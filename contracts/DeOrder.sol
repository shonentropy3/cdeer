// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./interface/IOrder.sol";
import "./interface/IStage.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-IERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import './libs/TransferHelper.sol';
import "./libs/ECDSA.sol";
import './Multicall.sol';


contract DeOrder is IOrder, Multicall, Ownable {
    error PermissionsError();
    error ProgressError();
    error AmountError(uint reason); // 0: mismatch , 1: need pay
    error ParamError();
    error NonceError();
    error Expired();

    uint public constant FEE_BASE = 10000;
    uint public fee = 500;
    address public feeTo;

    address public deStage;
    uint public currOrderId;

    // orderId  = > 
    mapping(uint => Order) private orders;
    mapping(address => uint) public nonces;

    bytes32 public DOMAIN_SEPARATOR;
    bytes32 public constant PERMITSTAGE_TYPEHASH = keccak256("PermitStage(uint256 orderId,uint256[] amounts,uint256[] periods,uint256 nonce,uint256 deadline)");
    bytes32 public constant PERMITPROSTAGE_TYPEHASH = keccak256("PermitProStage(uint256 orderId,uint256 stageIndex,uint256 period,uint256 nonce,uint256 deadline)");
    bytes32 public constant PERMITAPPENDSTAGE_TYPEHASH = keccak256("PermitAppendStage(uint256 orderId,uint256 amount,uint256 period,uint256 nonce,uint256 deadline)");

    event OrderCreated(uint indexed taskId, uint indexed orderId,  address issuer, address worker, address token, uint amount);
    event OrderModified(uint indexed orderId, address token, uint amount);
    event OrderStarted(uint indexed orderId, address who);
    event OrderAbort(uint indexed orderId, address who, uint stageIndex);
    event Withdraw(uint indexed orderId, uint amount, uint stageIndex);
    event AttachmentUpdated(uint indexed orderId, string attachment);
    event FeeUpdated(uint fee, address feeTo);
    event StageUpdated(address stage);

    constructor() {
        
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
        if(address(0) == _worker || address(0) == _issuer || _worker == _issuer) revert ParamError();

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
        if(order.progress >= OrderProgess.Ongoing) revert ProgressError();
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
        if(order.progress >= OrderProgess.Ongoing) revert ProgressError();
        if(order.worker != msg.sender && order.issuer != msg.sender) revert PermissionsError();

        if (order.worker == msg.sender) {
            order.progress = OrderProgess.StagingByWoker;
        } else {
            order.progress = OrderProgess.StagingByIssuer;
        }
        
        IStage(deStage).setStage(_orderId, _amounts, _periods);
    }

    function permitStage(uint _orderId, uint[] memory _amounts, uint[] memory _periods,
        uint nonce,
        uint deadline,
        uint8 v,
        bytes32 r,
        bytes32 s) public {
        
        Order storage order = orders[_orderId];
        if(order.progress >= OrderProgess.Ongoing) revert ProgressError();

        bytes32 structHash  = keccak256(abi.encode(PERMITSTAGE_TYPEHASH, _orderId,
                keccak256(abi.encodePacked(_amounts)), keccak256(abi.encodePacked(_periods)), nonce, deadline));
        address signAddr = recoverVerify(structHash, nonce, deadline, v , r, s);

        if(order.worker == signAddr && msg.sender == order.issuer || 
            order.issuer == signAddr && msg.sender == order.worker) {
            order.progress = OrderProgess.Staged;
        } else {
            revert PermissionsError(); 
        }

        IStage(deStage).setStage(_orderId, _amounts, _periods);
    }

    function prolongStage(uint _orderId, uint _stageIndex, uint _appendPeriod,
        uint nonce, uint deadline, uint8 v, bytes32 r, bytes32 s) external {
        Order memory order = orders[_orderId];
        if(order.progress != OrderProgess.Ongoing) revert ProgressError();


        bytes32 structHash = keccak256(abi.encode(PERMITPROSTAGE_TYPEHASH, _orderId,
            _stageIndex, _appendPeriod, nonce, deadline));
        address signAddr = recoverVerify(structHash, nonce, deadline, v , r, s);

        if((order.worker == msg.sender && signAddr == order.issuer) ||
            (order.issuer == msg.sender && signAddr == order.worker)) {
            IStage(deStage).prolongStage(_orderId, _stageIndex, _appendPeriod);
        } else {
            revert PermissionsError();
        } 
    }

    function appendStage(uint _orderId, uint amount, uint period, uint nonce, uint deadline, uint8 v, bytes32 r, bytes32 s) external payable {
        Order storage order = orders[_orderId];
        if(order.progress != OrderProgess.Ongoing) revert ProgressError();

        bytes32 structHash = keccak256(abi.encode(PERMITAPPENDSTAGE_TYPEHASH, _orderId,
            amount, period, nonce, deadline));
        address signAddr = recoverVerify(structHash, nonce, deadline, v , r, s);

        if((order.worker == msg.sender && signAddr == order.issuer) ||
            (order.issuer == msg.sender && signAddr == order.worker)) {
        } else {
            revert PermissionsError(); 
        } 

        order.amount += amount;
        if(order.payed < order.amount) revert AmountError(1);
        

        IStage(deStage).appendStage(_orderId, amount, period);
    }

    function recoverVerify(bytes32 structHash, uint nonce, uint deadline, uint8 v, bytes32 r, bytes32 s) internal returns (address signAddr){
        bytes32 digest = ECDSA.toTypedDataHash(DOMAIN_SEPARATOR, structHash);
        signAddr = ECDSA.recover(digest, v, r, s);

        if(nonces[signAddr] != nonce) revert NonceError();
        if(deadline < block.timestamp) revert Expired();
        nonces[signAddr] += 1;
    }


    function payOrderWithPermit(uint orderId, uint amount, uint deadline, uint8 v, bytes32 r, bytes32 s) external {
        IERC20Permit(orders[orderId].token).permit(msg.sender, address(this), amount, deadline, v, r, s);
        payOrder(orderId, amount);
    }

    // anyone can pay for this order
    function payOrder(uint orderId, uint amount) public payable {
        Order storage order = orders[orderId];
        address token = order.token;

        if (token == address(0)) {
            order.payed += msg.value;
        } else {
            TransferHelper.safeTransferFrom(token, msg.sender, address(this), amount);
            order.payed += amount;
        }
    }

    // 提交交付
    function updateAttachment(uint _orderId, string calldata _attachment) external {
        if(orders[_orderId].worker != msg.sender && orders[_orderId].issuer != msg.sender) revert PermissionsError();
        emit AttachmentUpdated(_orderId, _attachment);
    }

    function startOrder(uint _orderId) external payable {
        Order storage order = orders[_orderId];
        if(order.progress == OrderProgess.Staged ||
            (msg.sender == order.issuer && order.progress == OrderProgess.StagingByWoker) || 
            msg.sender == order.worker && order.progress == OrderProgess.StagingByIssuer) {
        } else {
            revert PermissionsError();
        }
        
        if(order.amount != IStage(deStage).totalAmount(_orderId)) revert AmountError(0);
        if(order.payed < order.amount) revert AmountError(1);

        order.progress = OrderProgess.Ongoing;
        order.startDate = block.timestamp;
        emit OrderStarted(_orderId, msg.sender);
        
        IStage(deStage).startOrder(_orderId);
    }

    function confirmDelivery(uint _orderId, uint[] memory _stageIndexs) external {
        if(orders[_orderId].progress != OrderProgess.Ongoing) revert ProgressError();
        if(msg.sender != orders[_orderId].issuer) revert PermissionsError();

        for (uint i = 0; i < _stageIndexs.length; i++) {
            IStage(deStage).confirmDelivery(_orderId, _stageIndexs[i]);
        }
    }

    // Abort And Settle
    function abortOrder(uint _orderId) external {
        Order storage order = orders[_orderId];
        if(order.progress != OrderProgess.Ongoing) revert ProgressError();

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
            IStage(deStage).abortOrder(_orderId, issuerAbort);

        doTransfer(order.token, order.issuer, issuerAmount);
        doTransfer(order.token, order.worker, workerAmount);

        emit OrderAbort(_orderId, msg.sender, currStageIndex);
    }

    function refund(uint _orderId, address _to, uint _amount) public {
        Order storage order = orders[_orderId];
        if(msg.sender != order.issuer) revert PermissionsError(); 

        order.payed -= _amount;
        if(order.progress >= OrderProgess.Ongoing) {
            if(order.payed < order.amount) revert AmountError(1);
        }

        doTransfer(order.token, _to, _amount);
    }

    // worker withdraw the fee.
    function withdraw(uint _orderId, address to) external {
        Order storage order = orders[_orderId];
        if(order.worker != msg.sender) revert PermissionsError();
        if(order.progress != OrderProgess.Ongoing) revert ProgressError();

        (uint pending, uint nextStage) = IStage(deStage).pendingWithdraw(_orderId);
        if (pending > 0) {
            if (fee > 0) {
                uint feeAmount = pending * fee / FEE_BASE;
                doTransfer(order.token, feeTo, feeAmount);
                doTransfer(order.token, feeTo, pending - feeAmount);
            } else {
                doTransfer(order.token, to, pending);
            }
            
            IStage(deStage).withdrawStage(_orderId, nextStage);
        }
        
        if (nextStage > 0) {
            emit Withdraw(_orderId, pending, nextStage - 1);
        }
        
        if (nextStage >= IStage(deStage).stagesLength(_orderId)) {
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

    function setDeStage(address _stage) external onlyOwner {
        deStage = _stage;
        emit StageUpdated(_stage);
    }

}