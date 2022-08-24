// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./interface/ITask.sol";
import "./interface/IOrder.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import '@uniswap/lib/contracts/libraries/TransferHelper.sol';
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import "hardhat/console.sol";

// TODO:考虑阶段甲方确认后，修改后续阶段的问题
contract Order is IOrder, Ownable {
    
    enum OrderProgess {
        Init,
        Staging,
        Staged,
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


    enum StageStatus {
        Init,
        Delivered,
        Accepted,
        Refused,
        Done       // withdrawed
    }


    //交付阶段
    struct Stage {
        uint amount;        // pay amount
        uint peroid;        // second
        StageStatus status;
        string milestone;
        string delivery;
    }

    uint8 private maxStages = 12;
    address private task;

    using SafeERC20 for IERC20;
    using Counters for Counters.Counter;

    event OrderCreated(uint indexed orderId, uint indexed taskId, address indexed issuer, address worker, address token, amount);
    event OrderModified(uint orderId, address token, uint amount);
    event SetStage(uint indexed orderId, address worker, uint[] amounts, uint[] periods);
    event OrderStarted(uint orderId, address who);
    event ConfirmOrderStage(uint indexed orderId, address issuer, uint8 stageIndex);
    event TerminateOrder(uint indexed orderId, address user);
    event TerminateStage(uint indexed orderId, address user, uint8 stageIndex);
    event Withdraw(uint indexed orderId, address worker, uint8 stageIndex);

    Counters.Counter private orderIds;

    // orderId  = > 
    mapping(uint => Order) public orders;

    // taskId = > orderId
    mapping(uint => uint[]) private taskOrders;
    // orderId = >
    mapping(uint => Stage[]) private orderStages;

    constructor(address _task) {
        task = _task;
    }

    function createOrder(Order memory _order) external {
        require(msg.sender == ITask(task).ownerOf(_order.taskId), "No creating permission.");
        require(address(0) != _order.worker, "Worker is zero address.");

        orderIds.increment();
        uint orderId = orderIds.current();
        orders[orderId] = Order({
            taskId: _order.taskId,
            worker: _order.worker,
            token: _order.token,
            amount: _order.amount,
            progress: OrderProgess.Init
        });

        emit OrderCreated(orderId, _order.taskId, msg.sender, _order.worker, _order.token, _order.amount);
    }

    function updateOrder(uint orderId, address token, uint amount) external {
        Order storage order = orders[orderId];
        require(order.progress < OrderProgess.Started, "PROG_STARTED");
        require(msg.sender == ITask(task).ownerOf(order.taskId), "No creating permission.");

        if (order.payed > 0 && orders[orderId].token != token) {
            withdraw(orderId, msg.sender, order.payed);
        }
        orders[orderId].token = token;
        orders[orderId].amount = amount;

        emit OrderModified(orderId, token, amount);
    }

    function payOrder(uint orderId, uint amount) external payable {
        Order storage order = orders[orderId];
        require(ITask(task).ownerOf(order.taskId) == msg.sender, "No permission.");

        uint needPayAnount = order.amount - order.payed;
        address token = order.token;

        if (token == address(0)) {
            order.payed += msg.value;
        } else {
            IERC20(_token).safeTransferFrom(msg.sender, address(this), needPayAnount);
            order.payed += amount;
        }
    }

    function withdraw(uint _orderId, address _to, uint _amount) public {
        Order storage order = orders[_orderId];
        require(msg.sender == ITask(task).ownerOf(order.taskId), "No permission.");

        order.payed -= _amount;
        doTransfer(order.token, _to, _amount);

        if(order.progress >= OrderProgess.Started) {
            require(order.payed >= order.amount, "withdraw too much");
        }

    }

    function setStage(uint _orderId, uint[] memory _amounts, uint[] memory _periods, string[] memory _milestones) external {
        Order storage order = orders[orderId];
        require(order.progress < OrderProgess.Started, "PROG_STARTED");

        require(order.worker == msg.sender || ITask(task).ownerOf(order.taskId) == msg.sender, "No permission.");

        doSetStage(_orderId, _amounts, _periods, _milestones);
        if (order.worker == msg.sender) {
            order.progress = OrderProgess.Staged;
        } else {
            order.progress = OrderProgess.Staging;
        }

        emit SetStage(_orderId, msg.sender, _amounts, _periods);
    }

    function appendStage(uint _orderId, uint amount, uint period, string milestone) external {
        

    }

    function doSetStage(uint _orderId, uint[] memory _amounts, uint[] memory _periods, string[] memory _milestones) internal {
        require(_amounts.length == _periods.length && _amounts.length != 0, "Wrong parameter length.");
        require(maxStages >= _amounts.length, "Wrong parameter length.");

        delete orderStages[_orderId];
        Stage[] storage stages = orderStages[_orderId];

        for ( uint i = 0; i < _periods.length; i++ ) {
            Stage memory pro = Stage ({
                amount: _amounts[i],
                period: _periods[i],
                milestone: _milestones[i],
                status: StageStatus.Init
            });
            stages.push(pro);
        }
    }

    function checkAmount(uint orderId, Order storage order) internal {
        Stage[] storage stages = orderStages[orderId];
        uint total;
        for ( uint i = 0; i < stages.length; i++ ) {
            total += stages[i].amount;
        }

        require(total == order.amount, "amount mismatch");
    }


    function permitStage(uint _orderId, uint[] memory _amounts, uint[] memory _periods, bytes memory _signature) public {
        // TODO: 
        // address signer = _signature.toTypedDataHash().recover(_signature);
        
        Order storage order = orders[_orderId];
        address signer;
        require(order.worker == signer, "Invalid Worker");
        order.progress = OrderProgess.Staged;

        //TODO: nonce
    }


    function issuerStartOrder(uint _orderId) external payable {
        Order storage order = orders[_orderId];
        uint taskId = order.taskId;
        require(msg.sender == ITask(task).ownerOf(taskId), "No permission.");
        require(order.progress == OrderProgess.Staged, "Need worker confirm");
        checkAmount(_orderId, order);

        uint needPayAnount = order.amount - order.payed;
        address _token = order.token;

        if (needPayAnount > 0) {
            if (_token == address(0)) {
                require(needPayAnount == msg.value, "pay error");
            } else {
                IERC20(_token).safeTransferFrom(msg.sender, address(this), needPayAnount);
            }
            order.payed = order.amount;
        }

        doStartOrder(order);
    }

    function workerStartOrder(uint _orderId) external {
        Order storage order = orders[_orderId];
        uint taskId = order.taskId;
        require(order.worker == msg.sender, "No permission.");
        require(order.progress == StageStatus.Staging, "Need Isser confirm");
        require(order.payed >= order.amount, "Need Pay");

        checkAmount(_orderId, order);
        
        doStartOrder(order);
    }


    function doStartOrder(Order storage order) internal {
        order.progress = OrderProgess.Started;
        order.startDate = block.timestamp;

        Stage[] storage stages = orderStages[_orderId];
        if (stages[0].period == 0) {
            stages[0].status = StageStatus.Accepted;
        }

        taskOrders[taskId].push(_orderId);
        emit OrderStarted(_orderId, msg.sender);
    }


    function confirmOrderStage(uint _orderId, uint8 _stageIndex) external {
        uint taskId = orders[_orderId].taskId;
        require(msg.sender == ITask(task).ownerOf(taskId), "No confirming permission.");

        require(orderStages[_orderId][_stageIndex].status != StageStatus.Done, "Done");


        if (_stageIndex == 0) {
            orderStages[_orderId][_stageIndex].confirmed = accepted; 
        } else {
            require(orderStages[_orderId][_stageIndex-1].confirmed == accepted, "The previous stage was not confirmed");
            orderStages[_orderId][_stageIndex].confirmed = accepted; 
        }
        
        emit ConfirmOrderStage(_orderId, msg.sender, _stageIndex);
    }

    function getOrderStages(uint _orderId) external view returns(Stage[] memory stages) {
        return orderStages[_orderId];
    }


    function terminateOrder(uint _orderId) external {
        uint taskId  = orders[_orderId].taskId;
        require(ITask(task).ownerOf(taskId) == msg.sender || orders[_orderId].worker == msg.sender, "No terminate permission.");
        
        
    // enum StageStatus {
    //     Init,
    //     Delivered,
    //     Accepted,
    //     Refused,
    //     Done       // withdrawed
    // }


        require(orders[_orderId].checked != IssuerChecked, "The order has been checked by issuer.");
        
        delete orders[_orderId];
        delete orderStages[_orderId];

        emit TerminateOrder(_orderId, msg.sender);
    }

    function terminateStage(uint _orderId, uint8 _stageIndex) external {
        uint taskId  = orders[_orderId].taskId;
        require(ITask(task).ownerOf(taskId) == msg.sender || orders[_orderId].worker == msg.sender, "No terminate permission.");
        require(orderStages[_orderId][_stageIndex].confirmed != accepted, "Already confirmed.");

        uint startDate = orders[_orderId].startDate;
        uint stageStartDate;
        uint sumAmount;
        uint sumAmountA;
        uint sumAmountB;
        uint8 isConfirmed;  
        Stage[] storage stages = orderStages[_orderId];
        if (_stageIndex == 0) {
            stageStartDate = startDate;
        } else {
            stageStartDate = stages[_stageIndex - 1].endDate;
            isConfirmed = stages[_stageIndex - 1].confirmed;
        }
        require((block.timestamp >= stageStartDate && stages[_stageIndex].endDate >= block.timestamp) || isConfirmed == accepted, "Out stage.");
        uint period = stages[_stageIndex].endDate - stageStartDate;
        if (block.timestamp > stageStartDate) {
            sumAmountB += stages[_stageIndex].amount * (block.timestamp - stageStartDate) / period;
        } else {
            sumAmountB = 0;
        }

        for (_stageIndex; _stageIndex < stages.length; _stageIndex++) {
            sumAmount += stages[_stageIndex].amount;
            stages[_stageIndex].confirmed == refused;
            stages[_stageIndex].withdrawed == true;
        }
        sumAmountA = sumAmount - sumAmountB;
        doTransfer(orders[_orderId].token, ITask(task).ownerOf(taskId), sumAmountA);
        doTransfer(orders[_orderId].token, orders[_orderId].worker, sumAmountB);

        emit TerminateStage(_orderId, msg.sender, _stageIndex);
    }

    // TODO:项目需要抽成
    function withdraw(uint _orderId, uint8 _stageIndex) external {
        require(orders[_orderId].worker == msg.sender, "No permission.");
        require(orders[_orderId].checked == IssuerChecked, " Need issuer checked.");
        Stage storage pro = orderStages[_orderId][_stageIndex];
        require(!pro.withdrawed, "Aleady withdrawed");

        if (pro.confirmed == accepted || pro.endDate + 7*24*60*60 < block.timestamp) {
            doTransfer(orders[_orderId].token, msg.sender, pro.amount);
            pro.withdrawed = true;
        }

        emit Withdraw(_orderId, msg.sender, _stageIndex);
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
        if (address(0) == _token) {
            TransferHelper.safeTransferETH(_to, _amount);
        } else {
            IERC20(_token).safeTransfer(_to, _amount);
        }
    }

}