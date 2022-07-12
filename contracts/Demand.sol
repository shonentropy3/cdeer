//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./interface/IOrder.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";
import "./interface/IDemand.sol";

//TODO:报名限制数量，乙方，时间久远后考虑废弃
contract Demand is ERC721, IDemand, Ownable {
    uint fee = 1*10**17;
    IOrder order;

    using Counters for Counters.Counter;
 
    event CreateDemand(uint indexed demandId, address indexed demandAddr, string title, uint budget, 
        string desc, string attachment, uint period);
    event ModifyDemand(uint indexed demandId, address demandAddr, string title, uint budget, 
        string desc, string attachment, uint period); 
    event ApplyFor(uint indexed demandId, address indexed applyAddr,uint previewPrice);
    event CancelApply(uint indexed demandId, address demandAddr);
    event ModifyApplySwitch(uint indexed demandId, address demandAddr, bool);

    struct DemandInfo {
        string title;
        string desc;
        string attachment;
        uint budget;
        uint period;
        bool applySwitch;
    }

    struct applyInfo {
        bool isApply;
        uint previewPrice;
    }

    Counters.Counter private demandIds;
    //demandId = >
    mapping(uint => DemandInfo) private demands; 
    //报名信息,demandId = > applyAddr
    mapping(uint => mapping(address => applyInfo)) private  applyInfos;

    //TODO: 项目NFT名称
    constructor() ERC721("UpChain","UpChain") {

    }

    function setOrder(address _order) external  virtual override onlyOwner {
        require(_order != address(0), "The parameter is zero address.");
        order  = IOrder(_order);    
    }

    function createDemand(DemandInfo memory _demandInfo) external payable {
        require(msg.value > fee, "Not enough fee.");

        uint demandId = demandIds.current();        
        demands[demandId] = DemandInfo({
            title: _demandInfo.title,
            budget: _demandInfo.budget,
            desc: _demandInfo.desc,
            attachment: _demandInfo.attachment,
            period: _demandInfo.period,
            applySwitch: false
        });
        _safeMint(msg.sender, demandId);
        demandIds.increment();   
        console.log("demandId", demandId);
        emit CreateDemand(demandId, msg.sender, _demandInfo.title, _demandInfo.budget, 
            _demandInfo.desc, _demandInfo.attachment, _demandInfo.period);
    }

    function modifyDemand(uint _demandId, DemandInfo memory _demandInfo) external {
        require(msg.sender == ownerOf(_demandId), "No root.");
        require(!order.hasDemandOrders(_demandId), "Existing orders.");

        demands[_demandId] = DemandInfo({
            title: _demandInfo.title,
            budget: _demandInfo.budget,
            desc: _demandInfo.desc,
            attachment: _demandInfo.attachment,
            period: _demandInfo.period,
            applySwitch: false
        });

        emit ModifyDemand(_demandId, msg.sender, _demandInfo.title, _demandInfo.budget, 
            _demandInfo.desc, _demandInfo.attachment, _demandInfo.period);
    }

    function applyFor(uint _demandId, uint _previewPrice) external {
        require(msg.sender != ownerOf(_demandId), "Not apply for orders yourself.");

        applyInfos[_demandId][msg.sender].isApply = true;
        applyInfos[_demandId][msg.sender].previewPrice = _previewPrice;

        emit ApplyFor(_demandId, msg.sender, _previewPrice);
    }

    function cancelApply(uint _demandId) external {
        require(msg.sender != ownerOf(_demandId), "Not applied.");
        applyInfos[_demandId][msg.sender].isApply = false;

        emit CancelApply(_demandId, msg.sender);
    }

    function modifyApplySwitch(uint _demandId, bool _switch) external {
        require(msg.sender == ownerOf(_demandId), "No Root.");
        require(demands[_demandId].applySwitch != _switch, "It is the current state.");
        demands[_demandId].applySwitch = _switch;

        emit ModifyApplySwitch(_demandId, msg.sender, _switch);
    }

    function modifyFee(uint _fee) external onlyOwner {
        fee = _fee;
    }
}