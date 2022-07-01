// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./interface/IDemand.sol";
import "./interface/IOrder.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import '@uniswap/lib/contracts/libraries/TransferHelper.sol';

contract Order is IOrder {
    using SafeERC20 for IERC20;
    //TODO: 添加uint安全校验
    using Counters for Counters.Counter;

    //TODO:缺少数量
    event CreateOrder(uint proId, address user, address applyAddr, uint amount);
    event ConfirmOrder(uint _orderId, address user);


    IDemand demand;

    address  private operator;

    uint8 private maxStages = 12;

    struct Order{
        uint proId;
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
        uint endDate;  //  no startDate mean peroid;
    }

    Counters.Counter private orderIds;

    //TODO：减数据，全部提款
    //orderId  = > 
    mapping(uint => Order) private orders;
    // projectId = > orderId
    mapping(uint => uint[]) private proOrders;
    //orderId = >
    mapping(uint => Stage[]) private orderStages;


    constructor(IDemand _demand) {
        demand = _demand;
        IDemand(demand).setOrder(address(this));
    }
    
    function createOrder(uint _proId, Order memory _order, address _token, uint[] memory _amounts, uint[] memory _periods) external payable {
        require(msg.sender == demand.ownerOf(_proId), "No create permission.");
        require(address(0) != _order.applyAddr, "Application address is zero address.");

        uint orderId = orderIds.current();  
        if (_order.token == address(0)) {
            require(_order.amount == msg.value);
        } else {
            IERC20(_token).safeTransferFrom(msg.sender, address(this), _order.amount);
        }
        // TODO：修改映射
        orders[orderId] = Order({
            proId: _order.proId,
            applyAddr: _order.applyAddr,
            token: _token,
            amount: _order.amount,
            confirmed: 0,
            startDate: block.timestamp
        });
        proOrders[_order.proId].push(orderId);
        
        emit CreateOrder(_order.proId, msg.sender, _order.applyAddr, _order.amount);   
    
        _setStage(orderId, _amounts, _periods); 
        orderIds.increment();
    }


    function confirmOrderByB(uint _orderId, uint[] memory _amounts, uint[] memory _periods) external {

        require(orders[_orderId].applyAddr == msg.sender, "No permission.");
        //TODO：大于天数
        //校验传入参数天数
        require(!(orders[_orderId].startDate == 0 || orders[_orderId].startDate == 1), "The order has been confirmed.");
        require(!(orderStages[_orderId].length == 0 && _amounts.length == 0), "Missing stages.");
        Stage[] storage orderStagesArr = orderStages[_orderId];
        if (orderStagesArr.length != 0){
            uint delayTime = orders[_orderId].startDate - block.timestamp;
            for (uint i; i < orderStagesArr.length; i++) {
                orderStagesArr[i].endDate += delayTime;
            }
            orders[_orderId].startDate = block.timestamp;
            orders[_orderId].confirmed = 1;
        } else {
            _setStage(_orderId, _amounts, _periods); 
            orders[_orderId].confirmed = 2;
        }

        emit ConfirmOrder(_orderId, msg.sender);
    }

    function confirmOrderByA(uint _orderId) external {
        uint _proId  = orders[_orderId].proId;
        require(msg.sender == demand.ownerOf(_proId), "No confirming permission.");
        require(orders[_orderId].confirmed == 2, "No need to confirm");
        Stage[] storage orderStagesArr = orderStages[_orderId];
        uint delayTime = orders[_orderId].startDate - block.timestamp;
        for (uint i; i < orderStagesArr.length; i++) {
            orderStagesArr[i].endDate += delayTime;
        }
        orders[_orderId].confirmed = 1;
        orders[_orderId].startDate = block.timestamp;

        emit ConfirmOrder(_orderId, msg.sender);
    }

    // TODO:考虑阶段，是否已经确认
    // function _modifyStage(uint _orderId, uint[] memory _amounts, uint[] memory _endDate) private {
    //     uint _proId  = orders[_orderId].proId;
    //     require(msg.sender == demand.ownerOf(_proId) || msg.sender == orders[_orderId].applyAddr, "No setting permission.");
    //     require(_amounts.length == _endDate.length, "Wrong parameter lengt.");
    //     // 时间排序
    //     uint totalAmounts;
    //     uint _endDate = block.timestamp;

    //     for ( uint i = 0; i< _endDate.length; i++ ) {
    //         _endDate += startDate;
    //         Stage memory pro = Stage ({
    //             amount: _amounts[i],
    //             confirmed: false,
    //             withdrawed: false,
    //             endDate: 0
    //         });
    //         orderStagesArr.push(pro);
    //         totalAmounts += _amounts[i];
    //     }
    //     require(totalAmounts == orders[_orderId].amount, "Wrong amount of commission.");
    // }


    //TODO: 修改所有的拿去mapping中结构体


    function confirmOrderStage(uint _orderId, uint _stageIndex) external {
        uint _proId  = orders[_orderId].proId;
        require(msg.sender == demand.ownerOf(_proId), "No confirming permission.");
        //无取款
        require(!orderStages[_orderId][_stageIndex].withdrawed, "Aleady withdrawed");
        require(!orderStages[_orderId][_stageIndex].confirmed, "A ");
        orderStages[_orderId][_stageIndex].confirmed = true;
    }


    function terminateOrder(uint _orderId) external {
        uint _proId  = orders[_orderId].proId;
        require(demand.ownerOf(_proId) == msg.sender || orders[_orderId].applyAddr == msg.sender, "No terminate permission.");
        require(orders[_orderId].confirmed != 1, "The order has been confirmed.");
        //提取全部的币
        _transfer(orders[_orderId].token, msg.sender, orders[_orderId].amount);
        delete orders[_orderId];
        delete orderStages[_orderId];
    }

    function terminateStage(uint _orderId, uint _stageIndex) external {
        uint _proId  = orders[_orderId].proId;
        require(demand.ownerOf(_proId) == msg.sender || orders[_orderId].applyAddr == msg.sender, "No terminate permission.");

        require(!orderStages[_orderId][_stageIndex].confirmed, "Already confirmed.");
        Stage[] storage orderStagesArr = orderStages[_orderId];
        uint startDate = orders[_orderId].startDate;
        uint stageStartDate;
        uint sumAmount;
        uint sumAmountA;
        uint sumAmountB;        
        if (_stageIndex == 0) {
            stageStartDate = startDate;
        } else {
            stageStartDate = orderStagesArr[_stageIndex - 1].endDate;
        }
        require(block.timestamp > stageStartDate && block.timestamp < orderStagesArr[_stageIndex].endDate, "Out stage.");        
        uint period = stageStartDate - stageStartDate;
        sumAmountB += orderStagesArr[_stageIndex].amount * (block.timestamp - stageStartDate) / (60*60*24*period);
        for (_stageIndex; _stageIndex < orderStagesArr.length; _stageIndex++) {
            sumAmount += orderStagesArr[_stageIndex].amount;
            orderStagesArr[_stageIndex].withdrawed == true;
        }
        sumAmountA = sumAmount - sumAmountB;
        _transfer(orders[_orderId].token, demand.ownerOf(_proId), sumAmountA);
        _transfer(orders[_orderId].token, orders[_orderId].applyAddr, sumAmountB);
    }
   
    function withdrawByB(uint _orderId, uint _stageIndex) external {
        require(orders[_orderId].applyAddr == msg.sender, "No permission.");
        require(!(orders[_orderId].startDate == 0 || orders[_orderId].startDate == 1), "The order is not confirmed.");
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
    }

    function isProOrders(uint _proId) external view virtual override  returns (bool){
        if (proOrders[_proId].length > 0) { 
            return true;
        } else {
            return false;
        } 
    }

    function modifyMaxStages(uint8 _maxStages) external onlyOperator {
        maxStages = _maxStages;
    }

    modifier onlyOperator() {
        require(msg.sender == operator, "No Root.");
        _;
    }

    function _setStage(uint _orderId, uint[] memory _amounts, uint[] memory _periods) private {
        uint _proId  = orders[_orderId].proId;
        require(msg.sender == demand.ownerOf(_proId) || msg.sender == orders[_orderId].applyAddr, "No setting permission.");
        require(_amounts.length == _periods.length  && _amounts.length != 0, "Wrong parameter length.");
        require(maxStages >= _amounts.length, "Wrong parameter length.");

        Stage[] storage orderStagesArr = orderStages[_orderId];
        // 时间排序
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