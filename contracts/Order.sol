// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./interface/ITask.sol";
import "./interface/IOrder.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import '@uniswap/lib/contracts/libraries/TransferHelper.sol';
import "hardhat/console.sol";

// TODO:考虑阶段甲方确认后，修改后续阶段的问题
contract Order is IOrder, Ownable {
    uint8 constant private takerChecked = 1;
    uint8 constant private makerChecked = 2;
    uint8 constant private confirmedIs = 1;
    uint8 constant private confirmedNo = 2;
    uint8 private maxTaskOrders = 12;
    uint8 private maxStages = 12;
    address private _task;

    using SafeERC20 for IERC20;
    using Counters for Counters.Counter;

    event CreateOrder(uint indexed orderId, uint indexed taskId, address indexed issuer, address worker, uint amount);
    event ModifyOrder(uint taskId, address issuer, uint orderId, address worker, uint amount);
    event SetStage(uint indexed orderId, address  worker, address token, uint[] amounts, uint[] periods);
    event ConfirmOrder(uint orderId, address indexed issuer);
    event ConfirmOrderStage(uint indexed orderId, address issuer, uint8 stageIndex);
    event TerminateOrder(uint indexed orderId, address user);
    event TerminateStage(uint indexed orderId, address user, uint8 stageIndex);
    event Withdraw(uint indexed orderId, address worker, uint8 stageIndex);

    struct Order {
        uint taskId;
        address worker;
        address token;
        uint amount;
        uint8 checked;
        uint startDate;
    }

    //交付阶段
    struct Stage {
        uint amount;
        string desc;
        uint8 confirmed;
        bool withdrawed;
        uint endDate;  
    }

    Counters.Counter private orderIds;

    // orderId  = > 
    mapping(uint => Order) public orders;

    // taskId => worker => orderId
    mapping(uint => mapping(address =>uint)) public applyOrderIds; 

    // taskId = > orderId
    mapping(uint => uint[]) private taskOrders;
    // orderId = >
    mapping(uint => Stage[]) private orderStages;

    constructor(address task_) {
        _task = task_;
    }

    function createOrder(Order memory _order) external {
        require(msg.sender == ITask(_task).ownerOf(_order.taskId), "No creating permission.");
        require(address(0) != _order.worker, "Taker is zero address.");
        require(maxTaskOrders >= taskOrders[_order.taskId].length, "Excessive number of orders.");

        uint orderId;
        if (applyOrderIds[_order.taskId][_order.worker] == 0) {
            orderIds.increment();
            orderId = orderIds.current();
            orders[orderId] = Order({
                taskId: _order.taskId,
                worker: _order.worker,
                token: _order.token,
                amount: _order.amount,
                checked: 0,
                startDate: block.timestamp
            });
            applyOrderIds[_order.taskId][_order.worker] = orderId;

            console.log("createOrder", orderId);

            emit CreateOrder(orderId, _order.taskId, msg.sender, _order.worker, _order.amount);                     
        } else {
            require(orders[orderId].checked != 2, "The order has been confirmed.");

            orderId = applyOrderIds[_order.taskId][_order.worker];
            orders[orderId].taskId = _order.taskId;
            orders[orderId].worker = _order.worker;
            orders[orderId].token = address(0);
            orders[orderId].amount = _order.amount;
            orders[orderId].checked = 0;
            orders[orderId].startDate = block.timestamp;

            console.log("modifyOrder", orderId);

            emit ModifyOrder(_order.taskId, msg.sender, orderId, _order.worker, _order.amount);  
        }
    }

    function setStage(uint _orderId, address _token, uint[] memory _amounts, string[] memory _desc, uint[] memory _periods) external {
        require(orders[_orderId].worker == msg.sender, "No permission.");
        require(orders[_orderId].checked != makerChecked, "The order has been checked by issuer.");

        _setStage(_orderId, _amounts, _desc, _periods); 
        orders[_orderId].token = _token;
        orders[_orderId].startDate = block.timestamp;
        orders[_orderId].checked = takerChecked;

        emit SetStage(_orderId, msg.sender, _token, _amounts, _periods);
    }

    function confirmOrder(uint _orderId) external payable {
        uint _taskId  = orders[_orderId].taskId;
        require(msg.sender == ITask(_task).ownerOf(_taskId), "No confirming permission.");
        require(orders[_orderId].checked == takerChecked, "Need worker checked.");
        require(maxTaskOrders >= taskOrders[_taskId].length, "Excessive number of orders.");
        
        address _token = orders[_orderId].token;
        if (_token == address(0)) {
            require(orders[_orderId].amount == msg.value);
        } else {
            IERC20(_token).safeTransferFrom(msg.sender, address(this), orders[_orderId].amount);
        }
        Stage[] storage orderStagesArr = orderStages[_orderId];
        uint delayTime = block.timestamp - orders[_orderId].startDate;
        for (uint i; i < orderStagesArr.length; i++) {
            orderStagesArr[i].endDate += delayTime;
        }
        orders[_orderId].checked = makerChecked;
        orders[_orderId].startDate = block.timestamp;
        if (orderStagesArr[0].endDate == orders[_orderId].startDate) {
            orderStagesArr[0].confirmed = confirmedIs;
        }

        taskOrders[_taskId].push(_orderId);

        emit ConfirmOrder(_orderId, msg.sender);
    }

    function confirmOrderStage(uint _orderId, uint8 _stageIndex) external {
        uint _taskId  = orders[_orderId].taskId;
        require(msg.sender == ITask(_task).ownerOf(_taskId), "No confirming permission.");
        require(!orderStages[_orderId][_stageIndex].withdrawed, "Already withdrawed.");
        require(orderStages[_orderId][_stageIndex].confirmed == 0, " Already confirmed.");
        if (_stageIndex == 0){
            orderStages[_orderId][_stageIndex].confirmed = confirmedIs; 
        } else {
            require(orderStages[_orderId][_stageIndex-1].confirmed == confirmedIs, "The previous stage was not confirmed");
            orderStages[_orderId][_stageIndex].confirmed = confirmedIs; 
        }
        
        emit ConfirmOrderStage(_orderId, msg.sender, _stageIndex);
    }

    function getOrderStages(uint _orderId) external view returns(Stage[] memory orderStagesArr) {
        Stage[] memory orderStagesArr;
        orderStagesArr = orderStages[_orderId];
        return orderStagesArr;
    }


    function terminateOrder(uint _orderId) external {
        uint _taskId  = orders[_orderId].taskId;
        require(ITask(_task).ownerOf(_taskId) == msg.sender || orders[_orderId].worker == msg.sender, "No terminate permission.");
        require(orders[_orderId].checked != makerChecked, "The order has been checked by issuer.");
        
        delete orders[_orderId];
        delete orderStages[_orderId];

        emit TerminateOrder(_orderId, msg.sender);
    }

    function terminateStage(uint _orderId, uint8 _stageIndex) external {
        uint _taskId  = orders[_orderId].taskId;
        require(ITask(_task).ownerOf(_taskId) == msg.sender || orders[_orderId].worker == msg.sender, "No terminate permission.");
        require(orderStages[_orderId][_stageIndex].confirmed != confirmedIs, "Already confirmed.");

        uint startDate = orders[_orderId].startDate;
        uint stageStartDate;
        uint sumAmount;
        uint sumAmountA;
        uint sumAmountB;
        uint8 isConfirmed;  
        Stage[] storage orderStagesArr = orderStages[_orderId];
        if (_stageIndex == 0) {
            stageStartDate = startDate;
        } else {
            stageStartDate = orderStagesArr[_stageIndex - 1].endDate;
            isConfirmed = orderStagesArr[_stageIndex - 1].confirmed;
        }
        require((block.timestamp >= stageStartDate && orderStagesArr[_stageIndex].endDate >= block.timestamp) || isConfirmed == confirmedIs, "Out stage.");
        uint period = orderStagesArr[_stageIndex].endDate - stageStartDate;
        sumAmountB += orderStagesArr[_stageIndex].amount * (block.timestamp - stageStartDate) / period;
        for (_stageIndex; _stageIndex < orderStagesArr.length; _stageIndex++) {
            sumAmount += orderStagesArr[_stageIndex].amount;
            orderStagesArr[_stageIndex].confirmed == confirmedNo;
            orderStagesArr[_stageIndex].withdrawed == true;
        }
        sumAmountA = sumAmount - sumAmountB;
        _transfer(orders[_orderId].token, ITask(_task).ownerOf(_taskId), sumAmountA);
        _transfer(orders[_orderId].token, orders[_orderId].worker, sumAmountB);

        emit TerminateStage(_orderId, msg.sender, _stageIndex);
    }

    // TODO:项目需要抽成
    function withdraw(uint _orderId, uint8 _stageIndex) external {
        require(orders[_orderId].worker == msg.sender, "No permission.");
        require(orders[_orderId].checked == makerChecked, " Need issuer checked.");
        Stage storage pro = orderStages[_orderId][_stageIndex];
        require(!pro.withdrawed, "Aleady withdrawed");

        if (pro.confirmed == confirmedIs || pro.endDate + 7*24*60*60 < block.timestamp) {
            _transfer(orders[_orderId].token, msg.sender, pro.amount);
            pro.withdrawed = true;
        }

        emit Withdraw(_orderId, msg.sender, _stageIndex);
    }

    function hasTaskOrders(uint _taskId) external view override  returns (bool hasTaskOrders_){
        uint[] memory ordersLength;
        ordersLength = taskOrders[_taskId];
        if (ordersLength.length > 0) { 
            hasTaskOrders_ = true;
        } else {
            hasTaskOrders_ = false;
        } 
    }

    function modifyMaxStages(uint8 _maxStages) external onlyOwner {
        maxStages = _maxStages;
    }
    
    function modifyMaxTaskOrders(uint8 _maxTaskOrders) external onlyOwner {
        maxTaskOrders = _maxTaskOrders;
    }

    function _setStage(uint _orderId, uint[] memory _amounts, string[] memory _desc, uint[] memory _periods) private {
        uint _taskId  = orders[_orderId].taskId;
        require(msg.sender == ITask(_task).ownerOf(_taskId) || msg.sender == orders[_orderId].worker, "No setting permission.");
        require(_amounts.length == _periods.length  && _amounts.length != 0, "Wrong parameter length.");
        require(maxStages >= _amounts.length, "Wrong parameter length.");

        Stage[] storage orderStagesArr = orderStages[_orderId];
        uint totalAmounts;
        uint _endDate = block.timestamp;
        for ( uint i = 0; i< _periods.length; i++ ) {
            _endDate += _periods[i];
            Stage memory pro = Stage ({
                amount: _amounts[i],
                desc: _desc[i],
                confirmed: 0,
                withdrawed: false,
                endDate: _endDate
            });
            orderStagesArr.push(pro);
            totalAmounts += _amounts[i];
        }
        require(totalAmounts == orders[_orderId].amount, "Wrong amounts.");
    }

    function _transfer(address _token, address _to, uint _amount) private {
        if (address(0) == _token) {
           TransferHelper.safeTransferETH(_to, _amount);
        } else {
            IERC20(_token).safeTransfer(_to, _amount);
        }
    }

}