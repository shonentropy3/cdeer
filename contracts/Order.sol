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
        //乙方确认订单2(防止不断接收订单)，处于交付第几阶段，订单结束状态为1
        uint8 status;
        //项目交付期数
        uint8 deliveryTimes;
        //预付款
        uint advancePayment;
        uint period;
        uint startTime; 
    }

    //交付进程
    struct orderProcess{
        uint projectTokenId;
        //项目酬金
        uint remuneration;
        //交付阶段数
        uint8 deliveryTimes;
        //甲方是否确认
        bool false;
        //发起时间
        uint launchTime; 
        //甲方确认时间
        uint confirmTime;
    }

    mapping(uint => Order) private order;

    constructor() {

    }

    function createOrder(Order _order) external payable{
        判断发起人是否是项目方本人
        require(msg.sender == );
        require(msg.value == _order.remuneration,"Wrong amount of commission.");
        order[_order.projectTokenId] = Order({
            projectTokenId: _order.projectTokenId,
            applyAddr: _order.applyAddr;
            remuneration: _order.remuneration;
            status: _order.status;
            deliveryTimes: _order.deliveryTimes;
            period: _order.period;
        });

        emit CreateOrder(_order.projectTokenId, msg.sender, msg.value, _order.applyAddr, _order.remuneration, _order.status, _order.deliveryTimes, _order.period)
    }

    function confirmOrder(uint _projectTokenId){
        考虑重复调用的问题，判断订单是否已经确认，
        require(1 != order[__projectTokenId].status && (2 != order[__projectTokenId].status) ,"Not authorized to accept orders.");
        订单不能是结束状态
        require(msg.sender == order[__projectTokenId].applyAddr,"Not authorized to accept orders.");
        order[__projectTokenId].status = 2;
        order[__projectTokenId].startTime = now;
        if(0 != order[__projectTokenId].advancePayment){
            授权乙方金额
        }

        emit ConfirmOrder(_projectTokenId, msg.sender);
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