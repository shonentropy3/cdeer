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
    address _order;

    using Counters for Counters.Counter;
 
    event CreateDemand(uint indexed demandId, address indexed demandAddr, string title, uint budget, 
        string desc, string attachment, uint period);
    event ModifyDemand(uint indexed demandId, address demandAddr, string title, uint budget, 
        string desc, string attachment, uint period);
    event DeleteDemand(uint indexed demandId, address demandAddr);
    event ApplyFor(uint indexed demandId, address indexed applyAddr, uint valuation);
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
        uint valuation;
    }

    Counters.Counter private demandIds;
    //demandId = >
    mapping(uint => DemandInfo) private demands; 
    //报名信息,demandId = > applyAddr
    mapping(uint => mapping(address => applyInfo)) private  applyInfos;

    //TODO: 项目NFT名称
    constructor() ERC721("UpChain","UpChain") {

    }

    function setOrder(address order_) external  virtual override onlyOwner {
        require(order_ != address(0), "The parameter is zero address.");
        _order = order_;    
    }

    function createDemand(DemandInfo memory _demandInfo) external payable {
        require(msg.value > fee, "Not enough fee.");

        uint demandId = demandIds.current();        
        demands[demandId] = DemandInfo({
            title: _demandInfo.title,
            desc: _demandInfo.desc,
            attachment: _demandInfo.attachment,
            budget: _demandInfo.budget,            
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
        require(!IOrder(_order).hasDemandOrders(_demandId), "Existing orders.");

        demands[_demandId].title = _demandInfo.title;
        demands[_demandId].budget = _demandInfo.budget;
        demands[_demandId].desc = _demandInfo.desc;
        demands[_demandId].attachment = _demandInfo.attachment;
        demands[_demandId].period = _demandInfo.period;
        demands[_demandId].applySwitch = false;

        emit ModifyDemand(_demandId, msg.sender, _demandInfo.title, _demandInfo.budget, 
            _demandInfo.desc, _demandInfo.attachment, _demandInfo.period);
    }

    function deleteDemand(uint _demandId) external {
        require(msg.sender == ownerOf(_demandId), "No root.");
        require(!IOrder(_order).hasDemandOrders(_demandId), "Existing orders.");

        delete demands[_demandId];
        _burn(_demandId);

        emit DeleteDemand(_demandId, msg.sender);
    }

    function applyFor(uint _demandId, uint _valuation) external {
        require(msg.sender != ownerOf(_demandId), "Not apply for orders yourself.");

        applyInfos[_demandId][msg.sender].isApply = true;
        applyInfos[_demandId][msg.sender].valuation = _valuation;

        emit ApplyFor(_demandId, msg.sender, _valuation);
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