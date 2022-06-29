// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./interface/IProject.sol";
import "./interface/IOrder.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Order is IOrder {
    using SafeERC20 for IERC20;
    //TODO: 添加uint安全校验
    using Counters for Counters.Counter;

    //TODO:缺少数量
    event CreateOrder(uint proId, address user, address applyAddr, uint amount);
    event ConfirmOrder(uint _orderId, address user);

    struct Order{
        uint proId;
        address applyAddr;
        address token;
        uint amount;
        uint startDate;
    }

    //交付进程
    struct Process {
        uint amount;
        bool confirmed;
        bool withdrawed;
        uint period;
    }

    Counters.Counter private orderIds;

    // orderId = > 
    //TODO：减数据，全部提款

    mapping(uint => Order) private orders;
    
    // projectId = > orderId
    mapping(uint => uint[]) private proOrders;
    //orderId = >
    mapping(uint => Process[]) private orderProcesses;

    IProject project;

    constructor(IProject _project) {
        project = _project;
        IProject(project).setOrder(address(this));
    }
    
    function createOrder(uint _proId, Order memory _order, address _token) external payable {
        require(msg.sender == project.ownerOf(_proId), "No create permission.");
        require(address(0) != _order.applyAddr, "Application address is zero address.");

        uint orderId = orderIds.current();  
        if(msg.value > 0){
            orders[orderId] = Order({
                proId: _order.proId,
                applyAddr: _order.applyAddr,
                token: _token,
                amount: msg.value,
                confirmed: false
            });
            proOrders[_order.proId].push(orderId);

            emit CreateOrder(_order.proId, msg.sender, _order.applyAddr, msg.value);   
        }else{
            IERC20.safeTransferFrom(_token, msg.sender, address(this), _order.amount);

            orders[orderId] = Order({
                proId: _order.proId,
                applyAddr: _order.applyAddr,
                token: _token,
                amount: _order.amount,
                confirmed: false
            });
            proOrders[_order.proId].push(orderId);
            

            emit CreateOrder(_order.proId, msg.sender, _order.applyAddr, _order.amount);   
        }
    }

    function confirmOrder(uint _orderId, uint[] memory _amounts, uint[] memory _periods) external {
        require(orders[_orderId].applyAddr == msg.sender, "No permission.");

        //TODO：大于天数
        //校验传入参数天数
        require(!orders[_orderId].confirmed, "The order has been confirmed.");
        require((_amounts.length == _periods.length && _periods.length < 10), "Wrong number of processes");
        // 时间排序
        uint totalAmounts;
        for ( uint i = 0; i< _periods.length; i++ ) {
            Process memory pro = Process ({
                amount: _amounts[i],
                confirmed: ProcessConfirmOrDeny.NULL,
                withdrawed: false,
                period: _periods[i]
            });
            orderProcesses[_orderId].push(pro);
            totalAmounts += _amounts[i];
        }
        require(totalAmounts == orders[_orderId].amount, "Wrong amount of commission.");
    
        orders[_orderId].confirmed = true;

        emit ConfirmOrder(_orderId, msg.sender);
    }

    //TODO：增加甲方确认阶段


    function confirmOrderProcess(uint _orderId, uint i, ProcessConfirmOrDeny _confirmed) external returns(bool resultConfirmed_) {
        uint _proId  = orders[_orderId].proId;
        require(msg.sender == project.ownerOf(_proId), "No confirming permission.");
        //无取款
        require(orderProcesses[_orderId][i].withdrawed == false, "Aleady withdrawed");
        Process storage pro = orderProcesses[_orderId][i];
        if (pro.confirmed == (ProcessConfirmOrDeny.NULL)){
            pro.confirmed = _confirmed;
            resultConfirmed_ = true;
        }else{
            resultConfirmed_ = false;
        }
    }

    function terminateProcess(uint _orderId, uint i) public {
        uint _proId  = orders[_orderId].proId;
        require(project.ownerOf(_proId) == msg.sender || orders[_orderId].applyAddr == msg.sender, "No terminate permission.");
        uint startDate = ordorderProcessesers[_orderId][i].startDate;
        uint period = ordorderProcessesers[_orderId][i].period;
        uint sumAmount;
        i -= 1
        for (uint j; j < ordorderProcessesers[_orderId].length; j++) {
            terminated = ordorderProcessesers[_orderId][i].terminated[0];
            if (j >= i) {
                sumAmount += ordorderProcessesers[_orderId][j].amount;
            }
        }
        ratioB = (block.timestamp - startDate)/(60*60*24*period)
        amountsA = ratioB * ordorderProcessesers[_orderId][i].amount + 
        

    }

   
    function withdrawByB(uint _orderId, uint i) external {
        require(orders[_orderId].applyAddr == msg.sender, "No permission.");
        Process storage pro = orderProcesses[_orderId][i];
        //无取款
        require(pro.withdrawed == false, "Aleady withdrawed");

        if (pro.confirmed == ProcessConfirmOrDeny.FALSE || pro.period + 7 days < block.timestamp) {
            // TODO transfer pro.amount
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

    function withdraw(address _token, address _to, uint _amount) private {
        if (address(0) == _token) {
            _to.safeTransfer(_to, _amount);
        } else {
            IERC20(_token).safeTransfer(_token, _to, _amount);
        }
    }
}