pragma solidity ^0.8.0;

import "./ICodeMarket.sol";

contract Order {

    event CreateOrder();
    event ConfirmOrder();

    struct Order{
        uint projectTokenId;
        address applyAddr;
        //项目酬金
        uint remuneration;
        
        //项目交付期数
        uint8 deliveryTimes;
        //预付款
        uint prePayment;
        uint startTime; 
        bool confirmed;
    }

    //交付进程
    struct Process {
        //项目阶段中的酬金
        uint remuneration;
        //甲方是否确认\
        uint8 confirmedordeny;

        bool withdrawed;
        uint period;
    }

    uint orderId;

    mapping(uint => uint[] ) projectOrdres;
    // orderId = > 
    mapping(uint => Order) private orders;
    //存交付
    mapping(uint => orderProcess[] ) private orderProcesses;


    constructor() {

    }

    // pay by tokens
    function createOrder(Order memory _order, uint [] periods, uint [] amounts) external {
        //TODO: 判断发起人是否是项目方本人
        require(msg.sender == projectTokenId. );
        
        require(ends.length = _order);
        require(msg.sender == deliveryTimes, );
        

        // require(msg.value == _order.remuneration,"Wrong amount of commission.");
        require(projectOrdres[_order.projectTokenId].length < 10, "");

        // TODO: check ( sum of amounts  + prePayment) == _order.remuneration ;

        orderId++;

        orders[orderId] =  Order({
            projectTokenId: _order.projectTokenId,
            applyAddr: _order.applyAddr;
            remuneration: _order.remuneration;
            status: _order.status;
            deliveryTimes: _order.deliveryTimes;
            confirmed: false
        });

        projectOrdres[_order.projectTokenId].push(orderId);
        


        emit CreateOrder(_order.projectTokenId, msg.sender, msg.value, _order.applyAddr, _order.remuneration, _order.status, _order.deliveryTimes, _order.period)

        orderProcesses [] orderProcesses = orderProcesses[orderid];

        for ( uint i = 0; i< deliveryTimes; i++ ) {

            Process pro = new Process{
                remuneration = amounts[i];
                confired : false;
                period =  periods[i];
            }

            orderProcesses.push(pro)
        }

        // TODO: TransferFrom  remuneration tokens

        
    }



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
            // TODO transfer pro.remuneration

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