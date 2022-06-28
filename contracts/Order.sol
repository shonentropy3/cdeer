// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./interface/IProject.sol";
import "./interface/IOrder.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Order is IOrder {

    using Counters for Counters.Counter;

    //TODO:缺少数量
    event CreateOrder(uint proId, address user, address applyAddr, uint amount);
    event ConfirmOrder(uint _orderId, address user);

    enum ConfirmOrDeny{ NULL, TRUE, FALSE }

    struct Order{
        uint proId;
        address applyAddr;
        IERC20 token;
        uint amount;
        bool confirmed;
    }

    //交付进程
    struct Process {
        uint amount;
        ConfirmOrDeny confirmed;
        bool withdrawed;
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

    //TODO：考虑coin,token 类型又问题
    function createOrder(uint _proId, Order memory _order, IERC20 _token) external {
        require(msg.sender == project.ownerOf(_proId), "No create permission.");
        require(address(0) != _order.applyAddr, "Application address is zero address.");

        uint orderId = orderIds.current();  

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

    function confirmOrder(uint _orderId, uint[] memory _amounts, uint[] memory _endDate) external {
        require(orders[_orderId].applyAddr == msg.sender, "No permission.");
        require(!orders[_orderId].confirmed, "The order has been confirmed.");
        require((_amounts.length == _endDate.length && _endDate.length < 10), "Wrong number of processes");
        orders[_orderId].confirmed = true;


        uint totalAmounts;

        // Process[] memory orderProcessesArr = orderProcesses[_orderId];

        for ( uint i = 0; i< _endDate.length; i++ ) {
            Process memory pro = Process ({
                amount: _amounts[i],
                confirmed: ConfirmOrDeny.NULL,
                withdrawed: false,
                endDate: _endDate[i]
            });
            orderProcesses[_orderId].push(pro);
            totalAmounts += _amounts[i];
        }
        require(totalAmounts == orders[_orderId].amount, "Wrong amount of commission.");

        emit ConfirmOrder(_orderId, msg.sender);
    }

    function confirmOrderProcess(uint _orderId, uint i, ConfirmOrDeny _confirmed) external returns(bool resultConfirmed_) {
        uint _proId  = orders[_orderId].proId;
        require(msg.sender == project.ownerOf(_proId), "No create permission.");
        //无取款
        require(orderProcesses[_orderId][i].withdrawed == false, "Aleady withdrawed");
        Process storage pro = orderProcesses[_orderId][i];
        if (pro.confirmed != (ConfirmOrDeny.NULL)){
            pro.confirmed = _confirmed;
            resultConfirmed_ = true;
        }else{
            resultConfirmed_ = false;
        }
    }

   function projectSideWithdraw(uint _orderId, uint i) external {
        //TODO：项目方提款 1.接单方没有确认订单/接单方做一半
    }

    function orderSideWithdraw(uint _orderId, uint i) external {
        require(orders[_orderId].applyAddr == msg.sender, "No permission.");
        Process storage pro = orderProcesses[_orderId][i];
        //无取款
        require(pro.withdrawed == false, "Aleady withdrawed");

        if (pro.confirmed == ConfirmOrDeny.FALSE || pro.endDate + 7 days < block.timestamp ) {
            // TODO transfer pro.amount
            pro.withdrawed = true;
        }
    }

    function isProOrders(uint _proId) external view virtual override  returns (bool){
        if(proOrders[_proId].length > 0){
            return true;
        }else{
            return false;
        } 
    }
}