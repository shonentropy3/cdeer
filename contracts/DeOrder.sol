// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./interface/ITask.sol";
import "./interface/IOrder.sol";
import "./interface/IStage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import './libs/TransferHelper.sol';
import "./libs/ECDSA.sol";


contract DeOrder is IOrder, Ownable {
    error PermissionsError();

    address private task;
    address private stage;

    event OrderCreated(uint indexed taskId, uint indexed orderId,  address issuer, address worker, address token, uint amount);
    event OrderModified(uint indexed orderId, address token, uint amount);
    event OrderStarted(uint orderId, address who);
    event OrderAbort(uint indexed orderId, address who, uint stageIndex);
    event Withdraw(uint indexed orderId, uint amount);

    event AttachmentUpdated(uint indexed orderId, string attachment);

    uint private currOrderId;

    // orderId  = > 
    mapping(uint => Order) private orders;

    bytes32 public DOMAIN_SEPARATOR;
    bytes32 public constant PERMITSTAGE_TYPEHASH = keccak256("PermitStage(uint256 orderId,uint256[] amounts,uint256[] periods,uint256 deadline)");

    constructor(address _task, address _stage) {
        task = _task;
        stage = _stage;

        DOMAIN_SEPARATOR = keccak256(
        abi.encode(
                keccak256(
                    "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
                ),
                // This should match the domain you set in your client side signing.
                keccak256(bytes("DetaskOrder")),
                keccak256(bytes("1")),
                block.chainid,
                address(this)
            )
        );
    }

    function createOrder(uint _taskId, address _issuer, address _worker, address _token, uint _amount) external {
        require(address(0) != _worker, "Worker is zero address.");
        require(address(0) != _issuer, "Worker is zero address.");

        currOrderId += 1;
        orders[currOrderId] = Order({
            issuer: _issuer,
            worker: _worker,
            token: _token,
            amount: _amount,
            progress: OrderProgess.Init,
            startDate: 0,
            payed: 0
        });

        emit OrderCreated(_taskId, currOrderId, _issuer, _worker, _token, _amount);
    }

    function getOrder(uint orderId) external view override returns (Order memory) {
        return orders[orderId];
    }

    function updateOrder(uint orderId, address token, uint amount) external {
        Order storage order = orders[orderId];
        require(order.progress < OrderProgess.Started, "PROG_STARTED");
        if(msg.sender != order.issuer) revert PermissionsError(); 

        if (order.payed > 0 && orders[orderId].token != token) {
            refund(orderId, msg.sender, order.payed);
        }
        orders[orderId].token = token;
        orders[orderId].amount = amount;

        emit OrderModified(orderId, token, amount);
    }

    function setStage(uint _orderId, uint[] memory _amounts, uint[] memory _periods, string memory _attachment) external {
        Order storage order = orders[_orderId];
        require(order.progress < OrderProgess.Started, "PROG_STARTED");

        if(order.worker != msg.sender && order.issuer != msg.sender) revert PermissionsError();

        if (order.worker == msg.sender) {
            order.progress = OrderProgess.Staged;
        } else {
            order.progress = OrderProgess.Staging;
        }
        emit AttachmentUpdated(_orderId, _attachment);
        
        IStage(stage).setStage(_orderId, _amounts,_periods);
    }

    function permitStage(uint _orderId, uint[] memory _amounts, uint[] memory _periods,
        uint deadline,
        uint8 v,
        bytes32 r,
        bytes32 s) public {

        bytes32 structHash = keccak256(abi.encode(PERMITSTAGE_TYPEHASH, _orderId,
            keccak256(abi.encodePacked(_amounts)), keccak256(abi.encodePacked(_periods)), deadline));
        bytes32 digest = ECDSA.toTypedDataHash(DOMAIN_SEPARATOR, structHash);

        address recoveredAddress = ECDSA.recover(digest, v, r, s);
        
        Order storage order = orders[_orderId];
        require(order.worker == recoveredAddress, "Invalid Worker Signature");
        
        if(IStage(stage).checkStage(_orderId, _amounts, _periods)) {
            order.progress = OrderProgess.Staged;
        }
    }

    // anyone can pay for this order
    function payOrder(uint orderId, uint amount) external payable {
        Order storage order = orders[orderId];

        uint needPayAmount = order.amount - order.payed;
        address token = order.token;

        if (token == address(0)) {
            order.payed += msg.value;
        } else {
            TransferHelper.safeTransferFrom(token, msg.sender, address(this), needPayAmount);
            order.payed += amount;
        }
    }

    function updateAttachment(uint _orderId, string calldata _attachment) external {
        Order memory order = orders[_orderId];
        if(order.worker != msg.sender && msg.sender != order.issuer) revert PermissionsError();
        emit AttachmentUpdated(_orderId, _attachment);
    }

    function issuerStartOrder(uint _orderId) external payable {
        Order storage order = orders[_orderId];
        if(msg.sender != order.issuer) revert PermissionsError(); 
        require(order.progress == OrderProgess.Staged, "Need worker confirm");
        require(order.amount == IStage(stage).totalAmount(_orderId), "amount mismatch");
        

        uint needPayAmount = order.amount - order.payed;
        address _token = order.token;

        if (needPayAmount > 0) {
            if (_token == address(0)) {
                require(needPayAmount == msg.value, "pay error");
            } else {
                TransferHelper.safeTransferFrom(_token, msg.sender, address(this), needPayAmount);
            }
            order.payed = order.amount;
        }

        doStartOrder(_orderId, order);
    }

    //TODO: transferFrom;
    function workerStartOrder(uint _orderId) external {
        Order storage order = orders[_orderId];
        if(msg.sender != order.worker ) revert PermissionsError(); 
        require(order.progress == OrderProgess.Staging, "Need Issuer confirm");
        require(order.payed >= order.amount, "Need Pay");

        require(order.amount == IStage(stage).totalAmount(_orderId), "amount mismatch");
        
        doStartOrder(_orderId, order);
    }


    function doStartOrder(uint _orderId, Order storage order) internal {
        order.progress = OrderProgess.Started;
        order.startDate = block.timestamp;

        emit OrderStarted(_orderId, msg.sender);
        
        IStage(stage).startOrder(_orderId);
    }

    function confirmStage(uint _orderId, uint[] memory _stageIndexs) external {
        if(msg.sender != orders[_orderId].issuer) revert PermissionsError(); 
        for (uint i = 0; i < _stageIndexs.length; i++) {
            IStage(stage).confirmStage(_orderId, _stageIndexs[i]);
        }
    }

    // Abort And Settle
    function abortOrder(uint _orderId) external {
        Order storage order = orders[_orderId];
        bool issuerAbort;
        if(order.worker == msg.sender) {
            order.progress = OrderProgess.WokerAbort;
        } else if (order.issuer == msg.sender) {
            order.progress = OrderProgess.IssuerAbort;
            issuerAbort = true;
        } else {
            revert PermissionsError(); 
        } 

        (uint currStageIndex, uint issuerAmount, uint workerAmount) = 
            IStage(stage).abortOrder(_orderId, issuerAbort);

        doTransfer(order.token, order.issuer, issuerAmount);
        doTransfer(order.token, order.worker, workerAmount);

        emit OrderAbort(_orderId, msg.sender, currStageIndex);
    }

    function refund(uint _orderId, address _to, uint _amount) public {
        Order storage order = orders[_orderId];
        if(msg.sender != order.issuer) revert PermissionsError(); 

        order.payed -= _amount;
        doTransfer(order.token, _to, _amount);

        if(order.progress >= OrderProgess.Started) {
            require(order.payed >= order.amount, "refund too much");
        }
    }

    // TODO:项目需要抽成
    function withdraw(uint _orderId) external {
        Order storage order = orders[_orderId];
        if(order.worker != msg.sender) revert PermissionsError(); 
        require(order.progress == OrderProgess.Started, "UnOngoing");


        (uint pending, uint nextStage) = IStage(stage).pendingWithdraw(_orderId);
        if (pending > 0) {
            doTransfer(order.token, msg.sender, pending);
            IStage(stage).withdrawStage(_orderId, nextStage);
        }
        

        emit Withdraw(_orderId, pending);
    }

    function doTransfer(address _token, address _to, uint _amount) private {
        if (_amount == 0) return;

        if (address(0) == _token) {
            TransferHelper.safeTransferETH(_to, _amount);
        } else {
            TransferHelper.safeTransfer(_token, _to, _amount);
        }
    }

}