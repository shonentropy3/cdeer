pragma solidity ^0.8.0;

import "./interface/IProject.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Order {

    event CreateOrder();
    event ConfirmOrder();

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
        //甲方是否确认\
        uint8 confirmedordeny;
        bool withdrawed;
        uint period;
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
    function createOrder(uint _proId, Order memory _order, uint [] periods, uint [] amounts) external {
        require(msg.sender == IProject.ownerOf(_proId),"No create permission.");
        require(address(0) != _order.applyAddr,"Application address is zero address.");
        require(periods.length = amounts.length && periods.length < 10,"Wrong number of processes");
    
        // require(msg.value == _order.amount,"Wrong amount of commission.");
        require(proOrders[_order.proId].length < 10, "Excessive number of project orders.");

        // TODO: check ( sum of amounts  + prePayment) == _order.amount ;

        uint orderId = orderIds.current();      

        orders[orderId] = Order({
            proId: _order.proId;
            applyAddr: _order.applyAddr;
            amount: _order.amount;
            prePayment: _order.prePayment;
            confirmed: false;
        });

        proOrders[_order.proId].push(orderId);
        
        orderProcesses [] orderProcessesArr = orderProcesses[orderId];

        for ( uint i = 0; i< periods.length; i++ ) {
            Process pro = new Process{
                amount = amounts[i];
                period =  periods[i];
                confired : false;
            }
            orderProcessesArr.push(pro)
        }
        // TODO: TransferFrom  amount tokens

        emit CreateOrder(_order.proId, msg.sender, msg.value, _order.applyAddr, _order.amount, _order.status, _order.submitTimes, _order.period);        
    }
    //TODO：整理至此
    function confirmOrder(uint orderId) external {
        require(orders[orderId].applyAddr == msg.sender, "");
        require(!order[orderId].confirmed ," ...");

        orders[orderId].startTime = block.timestamp;
        orders[orderId].confirmed = true;

        if(0 != order[orderId].prePayment){
            // TODO: transfer 
        }

        emit ConfirmOrder(orderId, msg.sender);
    }

    // 
    function confirmOrderProcess(uint orderId, uint i) external {
        // check msg.sender;
                Proecess storage pro = orderProcesses[orderId][i];
        pro.confired = true;
    }

    function withdraw(uint orderId, uint i) external {
        Proecess storage pro = orderProcesses[orderId][i];
        require(!pro.withdrawed, "aleady withdrawed");
        
        if (pro.confired || starttime + pro.period - 7 days > block.timestamp ) {
            // TODO transfer pro.amount

            pro.withdrawed = true;
        }
    }

    function _status(uint256 _tokenId) public view returns (uint8) {
        return status[_tokenId];
    }    

    function  modifyState(uint _tokenId,uint8 _status) public {
        require(msg.sender == ownerOf(_tokenId), "No modification permission");
        status[_tokenId] = _status;
    } 

    function acceptOrders

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