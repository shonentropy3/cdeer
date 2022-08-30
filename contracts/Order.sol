// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./interface/ITask.sol";
import "./interface/IOrder.sol";
import "./interface/IStage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import './libs/TransferHelper.sol';
import "./libs/ECDSA.sol";


contract Order is IOrder, Ownable {
    error PermissionsError();

    enum OrderProgess {
        Init,
        Staging,   // Issuer Stage
        Staged,    // Worker Stage
        Started,
        IssuerAbort,
        WokerAbort,
        Done
    }

    struct Order {
        uint taskId;
        address worker;
        address token;
        uint amount;
        uint payed;
        OrderProgess progress;   // PROG_*
        uint startDate;
    }

    address private task;
    address private stage;

    event OrderCreated(uint indexed orderId, uint taskId, address issuer, address worker, address token, uint amount);
    event OrderModified(uint indexed orderId, address token, uint amount);
    
    event OrderStarted(uint taskId, uint orderId, address who);
    event ConfirmOrderStage(uint indexed orderId, uint stageIndex);
    event OrderAbort(uint indexed orderId, address who, uint stageIndex);
    event Withdraw(uint indexed orderId, uint amount);

        event AttachmentUpdated(uint indexed orderId, string attachment);

    uint private currOrderId;

    // orderId  = > 
    mapping(uint => Order) public orders;

    // taskId = > orderId
    mapping(uint => uint[]) private taskOrders;



    constructor(address _task, address _stage) {
        task = _task;
        stage = _stage;
    }

    function createOrder(uint _taskId, address _worker, address _token, uint _amount) external {
        if(msg.sender != ITask(task).ownerOf(_taskId)) revert PermissionsError(); 
        require(address(0) != _worker, "Worker is zero address.");

        currOrderId += 1;
        orders[currOrderId] = Order({
            taskId: _taskId,
            worker: _worker,
            token: _token,
            amount: _amount,
            progress: OrderProgess.Init,
            startDate: 0,
            payed: 0
        });

        emit OrderCreated(currOrderId, _taskId, msg.sender, _worker, _token, _amount);
    }

    function updateOrder(uint orderId, address token, uint amount) external {
        Order storage order = orders[orderId];
        require(order.progress < OrderProgess.Started, "PROG_STARTED");
        if(msg.sender != ITask(task).ownerOf(order.taskId)) revert PermissionsError(); 

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

        if(order.worker != msg.sender && ITask(task).ownerOf(order.taskId) != msg.sender) revert PermissionsError();

        if (order.worker == msg.sender) {
            order.progress = OrderProgess.Staged;
        } else {
            order.progress = OrderProgess.Staging;
        }
        emit AttachmentUpdated(_orderId, _attachment);
        
        IStage(stage).setStage(_orderId, _amounts,_periods);
    }

    function payOrder(uint orderId, uint amount) external payable {
        Order storage order = orders[orderId];
        if(msg.sender != ITask(task).ownerOf(order.taskId)) revert PermissionsError(); 

        uint needPayAmount = order.amount - order.payed;
        address token = order.token;

        if (token == address(0)) {
            order.payed += msg.value;
        } else {
            TransferHelper.safeTransferFrom(token, msg.sender, address(this), needPayAmount);
            order.payed += amount;
        }
    }


    function stageDelivery(uint _orderId, string calldata _attachment) external {
        Order memory order = orders[_orderId];
        if(order.worker != msg.sender) revert PermissionsError();
        emit AttachmentUpdated(_orderId, _attachment);
    }



    function issuerStartOrder(uint _orderId) external payable {
        Order storage order = orders[_orderId];
        uint taskId = order.taskId;
        if(msg.sender != ITask(task).ownerOf(taskId)) revert PermissionsError(); 
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

    function workerStartOrder(uint _orderId) external {
        Order storage order = orders[_orderId];
        uint taskId = order.taskId;
        if(msg.sender != order.worker ) revert PermissionsError(); 
        require(order.progress == OrderProgess.Staging, "Need Issuer confirm");
        require(order.payed >= order.amount, "Need Pay");

        require(order.amount == IStage(stage).totalAmount(_orderId), "amount mismatch");
        
        doStartOrder(_orderId, order);
    }


    function doStartOrder(uint _orderId, Order storage order) internal {
        order.progress = OrderProgess.Started;
        order.startDate = block.timestamp;

        taskOrders[order.taskId].push(_orderId);
        emit OrderStarted(order.taskId, _orderId, msg.sender);
        
        IStage(stage).startState(_orderId);
    }

    // Abort And Settle
    function abortOrder(uint _orderId) external {
        Order storage order = orders[_orderId];
        address issuer = ITask(task).ownerOf(order.taskId);
        if(order.worker != msg.sender && issuer != msg.sender) revert PermissionsError(); 

        (uint currStageIndex, uint lastStageEnd) = getOngoingOrderStage(_orderId);

        Stage[] storage stages = orderStages[_orderId];
        uint forWorkerAmount;
        uint forIssuerAmount;

        for (uint i = 0; i < currStageIndex; i++) {
            if(stages[i].status != StageStatus.Done) {
                forWorkerAmount += stages[i].amount;
                stages[i].status == StageStatus.Done;
            }
        }

        Stage storage stage = stages[currStageIndex];
        if (order.worker == msg.sender) {
            forIssuerAmount += stage.amount;
            order.progress = OrderProgess.WokerAbort;
        } else {
            forWorkerAmount += stage.amount * (block.timestamp - lastStageEnd) / stage.period;
            forIssuerAmount += stage.amount * (lastStageEnd + stage.period - block.timestamp) / stage.period;
            order.progress = OrderProgess.IssuerAbort;
        }
        stage.status = StageStatus.Refused;

        for (uint i = currStageIndex; i < stages.length; i++) {
            forIssuerAmount += stages[i].amount;
            stages[i].status == StageStatus.Refused;
        }

        doTransfer(order.token, issuer, forIssuerAmount);
        doTransfer(order.token, order.worker, forWorkerAmount);

        emit OrderAbort(_orderId, msg.sender, currStageIndex);
    }

    function refund(uint _orderId, address _to, uint _amount) public {
        Order storage order = orders[_orderId];
        if(msg.sender != ITask(task).ownerOf(order.taskId)) revert PermissionsError(); 

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
        require(order.progress >= OrderProgess.Started, "order Unstarted");


        uint lastStageEnd = order.startDate;
        require(order.progress == OrderProgess.Started, "UnOngoing");

        Stage[] storage stages = orderStages[_orderId];
        uint nowTs = block.timestamp;
        uint pendingWithdraw;
        for ( uint i = 0; i < stages.length; i++) {
            Stage storage stage = stages[i];
            if(stage.status == StageStatus.Accepted || nowTs >= lastStageEnd + stage.period) {
                pendingWithdraw = stage.amount;
                stage.status = StageStatus.Done;
            }
            lastStageEnd += stage.period;
        }

        doTransfer(order.token, msg.sender, pendingWithdraw);

        emit Withdraw(_orderId, pendingWithdraw);
    }

    function hasTaskOrders(uint taskId) external view override  returns (bool hasTaskOrders_){
        uint[] memory ordersLength;
        ordersLength = taskOrders[taskId];
        if (ordersLength.length > 0) { 
            hasTaskOrders_ = true;
        } else {
            hasTaskOrders_ = false;
        } 
    }

    function modifyMaxStages(uint8 _maxStages) external onlyOwner {
        maxStages = _maxStages;
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