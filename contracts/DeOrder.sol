// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./interface/ITask.sol";
import "./interface/IOrder.sol";
import "./interface/IStage.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-IERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import './libs/TransferHelper.sol';
import "./libs/ECDSA.sol";


contract DeOrder is IOrder, Ownable {
    error PermissionsError();

    uint public constant FEE_BASE = 10000;
    uint public fee = 500;
    address public feeTo;

    address private task;
    address private stage;

    event OrderCreated(uint indexed taskId, uint indexed orderId,  address issuer, address worker, address token, uint amount);
    event OrderModified(uint indexed orderId, address token, uint amount);
    event OrderStarted(uint orderId, address who);
    event OrderAbort(uint indexed orderId, address who, uint stageIndex);
    event Withdraw(uint indexed orderId, uint amount, uint stageIndex);
    event AttachmentUpdated(uint indexed orderId, string attachment);
    event FeeUpdated(uint fee, address feeTo);

    uint private currOrderId;


    // orderId  = > 
    mapping(uint => Order) private orders;

    bytes32 public DOMAIN_SEPARATOR;
    bytes32 public constant PERMITSTAGE_TYPEHASH = keccak256("PermitStage(uint256 orderId,uint256[] amounts,uint256[] periods,uint256 nonce)");
    bytes32 public constant PERMITPROSTAGE_TYPEHASH = keccak256("PermitProStage(uint256 orderId,uint256 stageIndex,uint256 period,uint256 nonce)");

    mapping(address => uint) public nonces;

    constructor(address _task, address _stage) {
        task = _task;
        stage = _stage;
        feeTo = msg.sender;

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
        require(address(0) != _issuer, "Issuer is zero address.");

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

    function modifyOrder(uint orderId, address token, uint amount) external {
        Order storage order = orders[orderId];
        require(order.progress < OrderProgess.Ongoing, "PROG_STARTED");
        if(msg.sender != order.issuer) revert PermissionsError(); 

        // if change token , must refund
        if (orders[orderId].token != token && order.payed > 0) {
            refund(orderId, msg.sender, order.payed);
        }
        orders[orderId].token = token;
        orders[orderId].amount = amount;

        emit OrderModified(orderId, token, amount);
    }

    function setStage(uint _orderId, uint[] memory _amounts, uint[] memory _periods) external {
        Order storage order = orders[_orderId];
        require(order.progress < OrderProgess.Ongoing, "PROG_STARTED");

        if(order.worker != msg.sender && order.issuer != msg.sender) revert PermissionsError();

        if (order.worker == msg.sender) {
            order.progress = OrderProgess.Staged;
        } else {
            order.progress = OrderProgess.Staging;
        }
        
        IStage(stage).setStage(_orderId, _amounts, _periods);
    }

    function permitStage(uint _orderId, uint[] memory _amounts, uint[] memory _periods,
        uint nonce,
        uint8 v,
        bytes32 r,
        bytes32 s) public {
        
        Order storage order = orders[_orderId];
        require(order.progress < OrderProgess.Ongoing, "Progress Invalid");

        bytes32 structHash  = keccak256(abi.encode(PERMITSTAGE_TYPEHASH, _orderId,
                keccak256(abi.encodePacked(_amounts)), keccak256(abi.encodePacked(_periods)), nonce));
        bytes32 digest = ECDSA.toTypedDataHash(DOMAIN_SEPARATOR, structHash);

        address recoveredAddress = ECDSA.recover(digest, v, r, s);
        require(nonces[recoveredAddress] == nonce, "nonce error");
        nonces[recoveredAddress] += 1;

        if(order.worker == recoveredAddress && msg.sender == order.issuer) {
            order.progress = OrderProgess.Staged;
        } else if (order.issuer == recoveredAddress && msg.sender == order.worker) {
            order.progress = OrderProgess.Staging;
        } else {
            revert("invalid user");
        }
        
        require(IStage(stage).checkStage(_orderId, _amounts, _periods) == true, "mismatch amount");
    }


    function prolongStage(uint _orderId, uint _stageIndex, uint _appendPeriod,
        uint nonce, uint8 v, bytes32 r, bytes32 s) external {
        Order memory order = orders[_orderId];
        require(order.progress == OrderProgess.Ongoing, "Progress Invalid");

        bytes32 structHash = keccak256(abi.encode(PERMITPROSTAGE_TYPEHASH, _orderId,
            _stageIndex, _appendPeriod, nonce));
        bytes32 digest = ECDSA.toTypedDataHash(DOMAIN_SEPARATOR, structHash);
        address recoveredAddress = ECDSA.recover(digest, v, r, s);

        require(nonces[recoveredAddress] == nonce, "nonce error");
        nonces[recoveredAddress] += 1;

        if(order.worker == msg.sender) {
            require(recoveredAddress == order.issuer, "invalid user");
        } else if(order.issuer == msg.sender) {
            require(recoveredAddress == order.worker, "invalid user");
        } 
        IStage(stage).prolongStage(_orderId, _stageIndex, _appendPeriod);
    }

    function payOrderWithPermit(uint orderId, uint amount, uint deadline, uint8 v, bytes32 r, bytes32 s) external {
        IERC20Permit(orders[orderId].token).permit(msg.sender, address(this), amount, deadline, v, r, s);
        payOrder(orderId, amount);
    }

    // anyone can pay for this order
    function payOrder(uint orderId, uint amount) public payable {
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

    // 提交交付
    function updateAttachment(uint _orderId, string calldata _attachment) external {
        Order memory order = orders[_orderId];
        if(order.worker != msg.sender && msg.sender != order.issuer) revert PermissionsError();
        emit AttachmentUpdated(_orderId, _attachment);
    }

    function startOrder(uint _orderId) external payable {
        Order storage order = orders[_orderId];
        if(msg.sender == order.issuer) {
            require(order.progress == OrderProgess.Staged, "Need worker confirm");
        } else if (msg.sender == order.worker ) {
            require(order.progress == OrderProgess.Staging, "Need Issuer confirm");
        } else {
            revert PermissionsError();
        }
        
        require(order.amount == IStage(stage).totalAmount(_orderId), "amount mismatch");
        // do pay
        if (order.payed < order.amount) {
            uint needPayAmount = order.amount - order.payed;
            address _token = order.token;

            if (_token == address(0)) {
                require(needPayAmount == msg.value, "pay error");
            } else {
                TransferHelper.safeTransferFrom(_token, order.issuer, address(this), needPayAmount);
            }
            order.payed = order.amount;
        }

        order.progress = OrderProgess.Ongoing;
        order.startDate = block.timestamp;
        emit OrderStarted(_orderId, msg.sender);
        
        IStage(stage).startOrder(_orderId);
    }

    function confirmStage(uint _orderId, uint[] memory _stageIndexs) external {
        Order memory order = orders[_orderId];
        require(order.progress == OrderProgess.Ongoing, "Progress Invalid");

        if(msg.sender != order.issuer) revert PermissionsError(); 
        for (uint i = 0; i < _stageIndexs.length; i++) {
            IStage(stage).confirmStage(_orderId, _stageIndexs[i]);
        }
    }

    // Abort And Settle
    function abortOrder(uint _orderId) external {
        Order storage order = orders[_orderId];
        require(order.progress == OrderProgess.Ongoing, "Progress Invalid");

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

        if(order.progress >= OrderProgess.Ongoing) {
            require(order.payed >= order.amount, "refund too much");
        }
    }

    function withdraw(uint _orderId, address to) external {
        Order storage order = orders[_orderId];
        if(order.worker != msg.sender) revert PermissionsError(); 
        require(order.progress == OrderProgess.Ongoing, "UnOngoing");


        (uint pending, uint nextStage) = IStage(stage).pendingWithdraw(_orderId);
        if (pending > 0) {
            if (fee > 0) {
                uint feeAmount = pending * fee / FEE_BASE;
                doTransfer(order.token, feeTo, feeAmount);
                doTransfer(order.token, feeTo, pending - feeAmount);
            } else {
                doTransfer(order.token, to, pending);
            }
            
            IStage(stage).withdrawStage(_orderId, nextStage);
        }
        
        if (nextStage > 0) {
            emit Withdraw(_orderId, pending, nextStage - 1);
        }
        
        if (nextStage >= IStage(stage).stagesLength(_orderId)) {
            order.progress = OrderProgess.Done;
        }
    }

    function doTransfer(address _token, address _to, uint _amount) private {
        if (_amount == 0) return;

        if (address(0) == _token) {
            TransferHelper.safeTransferETH(_to, _amount);
        } else {
            TransferHelper.safeTransfer(_token, _to, _amount);
        }
    }

    function setFeeTo(uint _fee, address _feeTo) external {
        if(msg.sender != feeTo && msg.sender != owner()) {
            revert PermissionsError(); 
        }

        fee = _fee;
        feeTo = _feeTo;
        emit FeeUpdated(_fee, _feeTo);
    } 

}