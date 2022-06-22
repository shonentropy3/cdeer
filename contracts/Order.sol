pragma solidity ^0.8.0;

import "./CodeMarket.sol";

contract Order is CodeMarket{

    uint private remainingTime;


    
    mapping (uint => uint) private _balances;
    mapping(uint => uint8) private status;   
    mapping(uint => uint)  private startDate;

    struct Order{
        uint tokenId;
        address applyAddress;
        address createAddress;
        uint amount;
        uint period;  
    }

    constructor() {

    }

    function createOrder(
        uint256 _tokenId,
        uint256 _monetaryAmount,
        uint256 _timePeriod
    )
        external payable
    {
        remainingTime = _timePeriod;
        require(condition);
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