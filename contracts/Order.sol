pragma solidity ^0.8.0;

import "./interface/IProject.sol";
import "./interface/IOrder.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Order is IOrder {

    event CreateOrder();
    event ConfirmOrder();

    enum ConfirmeOrDeny{ NULL, TRUE, FALSE }

    struct Order{
        uint proId;
        address applyAddr;
        uint amount;
        uint prePayment;
        bool confirmed;
    }

    //交付进程
    struct Process {
        uint amount;
        ConfirmeOrDeny NULL;
        bool withdrawed;
        uint endDate;
    }

    Counters.Counter private orderIds;
    // orderId = > 
    mapping(uint => Order) private orders;
    // projectId = > orderId
    mapping(uint => uint[]) private proOrders;
    //存交付
    mapping(uint => orderProcess[]) private orderProcesses;

    constructor() {

    }

    //TODO：考虑pay by tokens
    function createOrder(uint _proId, Order memory _order, uint [] _periods, uint [] _amounts) external {
        require(msg.sender == IProject.ownerOf(_proId),"No create permission.");
        require(address(0) != _order.applyAddr,"Application address is zero address.");
        require(_periods.length = _amounts.length && _periods.length < 10,"Wrong number of processes");
    
        // require(msg.value == _order.amount,"Wrong amount of commission.");
        require(proOrders[_order.proId].length < 10, "Excessive number of project orders.");

        // TODO: check ( sum of _amounts  + prePayment) == _order.amount ;

        uint orderId = orderIds.current();      

        orders[orderId] = Order({
            proId: _order.proId;
            applyAddr: _order.applyAddr;
            amount: _order.amount;
            prePayment: _order.prePayment;
            confirmed: false;
        });

        proOrders[_order.proId].push(orderId);
        
        Process[] orderProcessesArr = orderProcesses[orderId];

        for ( uint i = 0; i< _periods.length; i++ ) {
            Process pro = new Process{
                amount = _amounts[i];
                period =  _periods[i];
                confired : false;
            }
            orderProcessesArr.push(pro)
        }
        // TODO: TransferFrom  amount tokens

        emit CreateOrder(_order.proId, msg.sender, msg.value, _order.applyAddr, _order.amount, _order.status, _order.submitTimes, _order.period);        
    }

    function confirmOrder(uint _orderId) external {
        require(orders[_orderId].applyAddr == msg.sender, "No permission.");
        require(!orders[_orderId].confirmed, "The order has been confirmed.");
        orders[_orderId].confirmed = true;
        if(0 != order[_orderId].prePayment){
            // TODO: transfer 
        }

        emit ConfirmOrder(_orderId, msg.sender);
    }

    function confirmOrderProcess(uint _proId, uint _orderId, uint i, bool _confirmOrder ) external {
        require(msg.sender == IProject.ownerOf(_proId),"No create permission.");
        for ( uint j = 0; j< proOrders[_proId].length; j++ ) {
            if(proOrders[_proId][j] == _orderId){
                break;
            }else{
                require(!j == proOrders[_proId].length,"No orders for this project.");
            }
            Proecess storage pro = orderProcesses[_orderId][i];
            if{_confirmOrder}{
                pro.ConfirmeOrDeny = ConfirmeOrDeny.TRUE;
            }else{
                pro.ConfirmeOrDeny = ConfirmeOrDeny.FALSE;
            }
        }
    }

    function withdraw(uint _orderId, uint i) external {
        require(orders[_orderId].applyAddr == msg.sender, "No permission.");
        Proecess storage pro = orderProcesses[_orderId][i];
        require(!pro.withdrawed, "aleady withdrawed");
        
        if (pro.confired || pro.endDate + 7 days < block.timestamp ) {
            // TODO transfer pro.amount

            pro.withdrawed = true;
        }
    }

    function isProOrders(uint _proId) internal view returns (bool){
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