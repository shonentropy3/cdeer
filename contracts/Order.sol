pragma solidity ^0.8.0;

import "./interface/IProject.sol";
import "./interface/IOrder.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Order is IOrder {

    event CreateOrder();
    event ConfirmOrder();

    enum ConfirmOrDeny{ NULL, TRUE, FALSE }

    struct Order{
        uint proId;
        address applyAddr;
        //token
        uint amount;
        uint prePayment;
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
    mapping(uint => orderProcess[]) private orderProcesses;

    IProject project;

    constructor(IProject _project) {
        project = _project;
    }

    //TODO：考虑coin
    function createOrder(uint _proId, Order memory _order, IERC20 _token, uint [] _amounts) external {
        require(msg.sender == IProject(project).ownerOf(_proId),"No create permission.");
        require(address(0) != _order.applyAddr,"Application address is zero address.");
        require(_amounts.length && _periods.length < 10,"Wrong number of processes");

        uint totalAmounts;
        uint orderId = orderIds.current();      

        orders[orderId] = Order({
            proId: _order.proId;
            applyAddr: _order.applyAddr;
            amount: _order.amount;
            confirmed: false;
        });

        proOrders[_order.proId].push(orderId);
        
        Process[] orderProcessesArr = orderProcesses[orderId];

        for ( uint i = 0; i< _periods.length; i++ ) {
            Process pro = new Process{
                amount = _amounts[i];
                period =  _periods[i];
                confirmed = ConfirmOrDeny.NULL;
            }
            orderProcessesArr.push(pro)
            totalAmounts += _amounts[i];
        }
        require(totalAmounts == _order.amount,"Wrong amount of commission.");

        SafeERC20.safeTransferFrom(_token, msg.sender, address(this), _order.amount);

        emit CreateOrder(_order.proId, msg.sender, msg.value, _order.applyAddr, _order.amount, _order.status, _order.submitTimes, _order.period);        
    }

    function confirmOrder(uint _orderId) external {
        require(orders[_orderId].applyAddr == msg.sender, "No permission.");
        require(!orders[_orderId].confirmed, "The order has been confirmed.");
        orders[_orderId].confirmed = true;
        if(0 != order[_orderId].prePayment) {
            // TODO: transfer 
        }

        emit ConfirmOrder(_orderId, msg.sender);
    }

    function confirmOrderProcess(uint _orderId, uint i, ConfirmOrDeny _confirmed) external returns(bool) {
        uint _proId  = orders[_orderId].proId;
        require(msg.sender == IProject.ownerOf(_proId),"No create permission.");
        //无取款
        require(orderProcesses[_orderId][i].withdrawed == false,"Aleady withdrawed");
        Proecess storage pro = orderProcesses[_orderId][i];
        if (pro.confirmed != ConfirmOrDeny.0){
            pro.confirmed = _confirmed;
        }else{
            return false;
        }
    }

   function projectSideWithdraw(uint _orderId, uint i) external {
        //TODO：项目方提款 1.接单方没有确认订单/接单方做一半
    }

    function orderSideWithdraw(uint _orderId, uint i) external {
        require(orders[_orderId].applyAddr == msg.sender, "No permission.");
        Proecess storage pro = orderProcesses[_orderId][i];
        //无取款
        require(pro.withdrawed == false, "Aleady withdrawed");

        if (pro.confirmed == ConfirmOrDeny.2 || pro.endDate + 7 days < block.timestamp ) {
            // TODO transfer pro.amount
            pro.withdrawed = true;
        }
    }

    function isProOrders(uint _proId) external view returns (bool){
        if(proOrders[_proId].length > 0){
            return true;
        }else{
            return false;
        } 
    }

//查询剩余时间
//接单
//查看状态
//阶段性付款
//完成交易
//提款
//查看余额
//交易手续费
//查看个人申报项目状体
//查看报名人数和个人信息
//查询订单详情
//接单放已完成，项目方  待验收
//单方面终止
//修改订单，双方确定

}