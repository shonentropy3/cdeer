// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./interface/IDemand.sol";
import "./interface/IOrder.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import '@uniswap/lib/contracts/libraries/TransferHelper.sol';
import "hardhat/console.sol";

// TODO:考虑阶段甲方确认后，修改后续阶段的问题
contract Order is IOrder, Ownable {
    uint8 private maxDemandOrders = 12;
    uint8 private maxStages = 12;
    address private _demand;

    using SafeERC20 for IERC20;
    using Counters for Counters.Counter;

    event CreateOrder(uint demandId, address demander, address applyAddr, uint amount);
    event SetStage(uint orderId, address  applyAddr, address token, uint amounts, uint periods);
    event ConfirmOrder(uint orderId, address demander);
    event confirmOrderStage(uint orderId, address demander, uint8 stageIndex);
    event terminateOrder(uint orderId, address originator);
    event terminateStage(uint orderId, address originator, uint8 stageIndex);
    event withdraw(uint orderId, address applyAddr, uint8 stageIndex);

    struct Order{
        uint demandId;
        address applyAddr;
        address token;
        uint amount;
        uint8 confirmed;
        uint startDate;
    }

    //交付阶段
    struct Stage {
        uint amount;
        bool confirmed;
        bool withdrawed;
        uint endDate;  
    }

    Counters.Counter private orderIds;

    // orderId  = > 
    mapping(uint => Order) private orders;
    // demandId = > orderId
    mapping(uint => uint[]) private demandOrders;
    // orderId = >
    mapping(uint => Stage[]) private orderStages;

    constructor(address demand_) {
        _demand = demand_;
    }

    function createOrder(
        Order memory _order
    ) external {
        require(msg.sender == IDemand(_demand).ownerOf(_order.demandId), "No create permission.");
        require(address(0) != _order.applyAddr, "ApplyAddr is zero address.");
        require(maxDemandOrders >= demandOrders[_order.demandId].length, "Excessive number of orders.");

        uint orderId = orderIds.current();  
        orders[orderId] = Order({
            demandId: _order.demandId,
            applyAddr: _order.applyAddr,
            token: address(0),
            amount: _order.amount,
            confirmed: 0,
            startDate: block.timestamp
        });
        orderIds.increment();

        emit CreateOrder(_order.demandId, msg.sender, _order.applyAddr, _order.amount);   
    }

    function setStage(uint _orderId, address _token, uint[] memory _amounts, uint[] memory _periods) external {
        require(orders[_orderId].applyAddr == msg.sender, "No permission.");
        require(orders[_orderId].confirmed != 1, "The order has been confirmed.");

        _setStage(_orderId, _amounts, _periods); 
        orders[_orderId].token = _token;
        orders[_orderId].startDate = block.timestamp;
        orders[_orderId].confirmed = 2;

        emit SetStage(_orderId, msg.sender, _token, _amounts, _periods);
    }

    function confirmOrder(
        uint _orderId
    ) external payable {
        uint _demandId  = orders[_orderId].demandId;
        require(msg.sender == IDemand(_demand).ownerOf(_demandId), "No confirming permission.");
        require(orders[_orderId].confirmed == 2, "Non-confirmation stage.");
        require(maxDemandOrders >= demandOrders[_demandId].length, "Excessive number of orders.");
        
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
        orders[_orderId].confirmed = 1;
        orders[_orderId].startDate = block.timestamp;
        if (orderStagesArr[0].endDate == orders[_orderId].startDate) {
            orderStagesArr[0].confirmed = true;
        }

        demandOrders[_demandId].push(_orderId);

        emit ConfirmOrder(_orderId, msg.sender);
    }

    function confirmOrderStage(uint _orderId, uint8 _stageIndex) external {
        uint _demandId  = orders[_orderId].demandId;
        require(msg.sender == IDemand(_demand).ownerOf(_demandId), "No confirming permission.");
        require(!orderStages[_orderId][_stageIndex].withdrawed, "Already withdrawed.");
        require(!orderStages[_orderId][_stageIndex].confirmed, " Already confirmed.");
        orderStages[_orderId][_stageIndex].confirmed = true;
        
        emit confirmOrderStage(_orderId, msg.sender, _stageIndex);
    }

    function terminateOrder(uint _orderId) external {
        uint _demandId  = orders[_orderId].demandId;
        require(IDemand(_demand).ownerOf(_demandId) == msg.sender || orders[_orderId].applyAddr == msg.sender, "No terminate permission.");
        require(orders[_orderId].confirmed != 1, "The order has been confirmed.");
        
        delete orders[_orderId];
        delete orderStages[_orderId];

        emit terminateOrder(_orderId, msg.sender);
    }

    function terminateStage(uint _orderId, uint8 _stageIndex) external {
        uint _demandId  = orders[_orderId].demandId;
        require(IDemand(_demand).ownerOf(_demandId) == msg.sender || orders[_orderId].applyAddr == msg.sender, "No terminate permission.");
        require(!orderStages[_orderId][_stageIndex].confirmed, "Already confirmed.");

        uint startDate = orders[_orderId].startDate;
        uint stageStartDate;
        uint sumAmount;
        uint sumAmountA;
        uint sumAmountB;  
        Stage[] storage orderStagesArr = orderStages[_orderId];
        if (_stageIndex == 0) {
            stageStartDate = startDate;
        } else {
            stageStartDate = orderStagesArr[_stageIndex - 1].endDate;
        }
        require(block.timestamp > stageStartDate && block.timestamp < orderStagesArr[_stageIndex].endDate, "Out stage.");        
        uint period = orderStagesArr[_stageIndex].endDate - stageStartDate;
        sumAmountB += orderStagesArr[_stageIndex].amount * (block.timestamp - stageStartDate) / (60*60*24*period);
        for (_stageIndex; _stageIndex < orderStagesArr.length; _stageIndex++) {
            sumAmount += orderStagesArr[_stageIndex].amount;
            orderStagesArr[_stageIndex].withdrawed == true;
        }
        sumAmountA = sumAmount - sumAmountB;
        _transfer(orders[_orderId].token, IDemand(_demand).ownerOf(_demandId), sumAmountA);
        _transfer(orders[_orderId].token, orders[_orderId].applyAddr, sumAmountB);

        emit terminateStage(_orderId, msg.sender, _stageIndex);
    }
   
    function withdraw(uint _orderId, uint _stageIndex) external {
        require(orders[_orderId].applyAddr == msg.sender, "No permission.");
        require(orders[_orderId].confirmed == 1, "The order is not confirmed.");
        Stage storage pro = orderStages[_orderId][_stageIndex];
        //无取款
        require(pro.withdrawed == false, "Aleady withdrawed");
        if (pro.confirmed ) {
            _transfer(orders[_orderId].token, msg.sender, pro.amount);
            pro.withdrawed = true;
            return;
        }
        if (pro.confirmed || pro.endDate + 7*24*60*60 < block.timestamp) {
            _transfer(orders[_orderId].token, msg.sender, pro.amount);
            pro.withdrawed = true;
        }

        emit withdraw(_orderId, msg.sender, _stageIndex);

    }

    function isDemandOrders(uint _demandId) external view virtual override  returns (bool){
        if (demandOrders[_demandId].length > 0) { 
            return true;
        } else {
            return false;
        } 
    }

    function modifyMaxStages(uint8 _maxStages) external onlyOwner {
        maxStages = _maxStages;
    }
    
    function modifyMaxDemandOrders(uint8 _maxDemandOrders) external onlyOwner {
        maxDemandOrders = _maxDemandOrders;
    }

    function _setStage(uint _orderId, uint[] memory _amounts, uint[] memory _periods) private {
        uint _demandId  = orders[_orderId].demandId;
        require(msg.sender == IDemand(_demand).ownerOf(_demandId) || msg.sender == orders[_orderId].applyAddr, "No setting permission.");
        require(_amounts.length == _periods.length  && _amounts.length != 0, "Wrong parameter length.");
        require(maxStages >= _amounts.length, "Wrong parameter length.");

        Stage[] storage orderStagesArr = orderStages[_orderId];
        uint totalAmounts;
        uint _endDate = block.timestamp;
        for ( uint i = 0; i< _periods.length; i++ ) {
            _endDate += _periods[i];
            Stage memory pro = Stage ({
                amount: _amounts[i],
                confirmed: false,
                withdrawed: false,
                endDate: _endDate
            });
            orderStagesArr.push(pro);
            totalAmounts += _amounts[i];
        }
        require(totalAmounts == orders[_orderId].amount, "Wrong amount of commission.");
    }

    function _transfer(address _token, address _to, uint _amount) private {
        if (address(0) == _token) {
           TransferHelper.safeTransferETH(_to, _amount);
        } else {
            IERC20(_token).safeTransfer(_to, _amount);
        }
    }

}