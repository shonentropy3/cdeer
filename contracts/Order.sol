// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./interface/IProject.sol";
import "./interface/IOrder.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Order is IOrder {
    using SafeERC20 for IERC20;
    using Counters for Counters.Counter;

    //TODO:缺少数量
    event CreateOrder(uint proId, address user, address applyAddr, uint amount);
    event ConfirmOrder(uint _orderId, address user);

    enum OrderConfirmOrDeny{ NULL, TRUE, FINISH }
    enum ProcessConfirmOrDeny{ NULL, TRUE, FALSE }

    struct Order{
        uint proId;
        address applyAddr;
        address token;
        uint amount;
        OrderConfirmOrDeny confirmed;
    }

    //交付进程
    struct Process {
        uint amount;
        ProcessConfirmOrDeny confirmed;
        bool withdrawed;
        bool[2] terminated;
        uint endDate;
    }

    Counters.Counter private orderIds;

    // orderId = > 
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
                confirmed: OrderConfirmOrDeny.NULL
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
                confirmed: OrderConfirmOrDeny.NULL
            });
            proOrders[_order.proId].push(orderId);
            

            emit CreateOrder(_order.proId, msg.sender, _order.applyAddr, _order.amount);   
        }
    }

    function confirmOrder(uint _orderId, uint[] memory _amounts, uint[] memory _endDate) external {
        require(orders[_orderId].applyAddr == msg.sender, "No permission.");
        require(orders[_orderId].confirmed != OrderConfirmOrDeny.FINISH, "The order has been finished.");
        require(orders[_orderId].confirmed != OrderConfirmOrDeny.TRUE, "The order has been confirmed.");
        require((_amounts.length == _endDate.length && _endDate.length < 10), "Wrong number of processes");
        // 时间排序
        uint totalAmounts;
        for ( uint i = 0; i< _endDate.length; i++ ) {
            Process memory pro = Process ({
                amount: _amounts[i],
                confirmed: ProcessConfirmOrDeny.NULL,
                withdrawed: false,
                endDate: _endDate[i]
            });
            orderProcesses[_orderId].push(pro);
            totalAmounts += _amounts[i];
        }
        require(totalAmounts == orders[_orderId].amount, "Wrong amount of commission.");
    
        orders[_orderId].confirmed = OrderConfirmOrDeny.TRUE;

        emit ConfirmOrder(_orderId, msg.sender);
    }

    function confirmOrderProcess(uint _orderId, uint i, ProcessConfirmOrDeny _confirmed) external returns(bool resultConfirmed_) {
        uint _proId  = orders[_orderId].proId;
        require(msg.sender == project.ownerOf(_proId), "No create permission.");
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

    function terminateProcess(uint _orderId, uint[] memory i) public {
        require();
    }


   function projectSideWithdraw(uint _orderId, address _token, uint _amount, uint i) external {
        //TODO：项目方提款 1.接单方没有确认订单/接单方做一半
        uint _proId  = orders[_orderId].proId;
        uint sumAmount;
        require(msg.sender == project.ownerOf(_proId), "No create permission.");
        if(orders[_orderId].confirmed == OrderConfirmOrDeny.NULL) {
            orders[_orderId].confirmed = OrderConfirmOrDeny.FINISH;
            withdraw(_token, mgs.sender, _amount);
            //TODO：在进程下面再区分时间段
        } else if(orders[_orderId].confirmed == OrderConfirmOrDeny.TRUE){
            Process storage pro = ordorderProcessesers[_orderId][i];
            for( uint i = 0; i< ordorderProcessesers[_orderId].length; i++ ) {
               if(!pro.withdrawed && pro.confirmed != ProcessConfirmOrDeny.TRUE){
                   pro.withdrawed = true;
                   sumAmount += pro.amount;
               }
            }
            orders[_orderId].confirmed == OrderConfirmOrDeny.FINISH;
            withdraw(_token, mgs.sender, _amount);
        }else{
            return;
        }

    }

    function orderSideWithdraw(uint _orderId, uint i) external {
        require(orders[_orderId].applyAddr == msg.sender, "No permission.");
        Process storage pro = orderProcesses[_orderId][i];
        //无取款
        require(pro.withdrawed == false, "Aleady withdrawed");

        if (pro.confirmed == ProcessConfirmOrDeny.FALSE || pro.endDate + 7 days < block.timestamp) {
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