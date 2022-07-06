//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./interface/IOrder.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "hardhat/console.sol";
import "./interface/IDemand.sol";

//TODO:报名限制数量，乙方，时间久远后考虑废弃
contract Demand is ERC721Enumerable, IDemand, Ownable {
    uint fee = 1*10**17;
    IOrder order;

    using Counters for Counters.Counter;
 
    event CreateDemand(uint indexed demandId, address indexed  demander, string title, uint budget, 
        string indexed desc, string attachment, uint period);
    event ModifyDemand(uint indexed demandId, address indexed demander, string title, uint budget, 
        string desc, string attachment, uint period); 
    event  ApplyFor(uint indexed _proId, address indexed applyAddr);
    event  CancelApply(uint proId, address indexed demander);
    event  OpenApply(uint proId, address indexed demander);
    event  CloseApply(uint proId, address indexed demander);

    struct DemandInfo{
        string title;
        string desc;
        string attachment;
        uint budget;
        uint period;
    }

    struct applyInfo{
        bool isApply;
        uint prePrice;
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
            period: _demandInfo.period
        });
        _safeMint(msg.sender, demandId);
        applyInfos[demandId][msg.sender].isApply = true;
        demandIds.increment();   

        emit CreateDemand(demandId, msg.sender, _demandInfo.title, _demandInfo.budget, 
            _demandInfo.desc, _demandInfo.attachment, _demandInfo.period);
    }

    function modifyDemand(uint _demandId, DemandInfo memory _demandInfo) external {
        require(msg.sender == ownerOf(_demandId), "No root.");
        require(!order.isDemandOrders(_demandId), "Existing orders.");

        demands[_demandId] = DemandInfo({
            title: _demandInfo.title,
            budget: _demandInfo.budget,
            desc: _demandInfo.desc,
            attachment: _demandInfo.attachment,
            period: _demandInfo.period
        });

        emit ModifyDemand(_demandId, msg.sender, _demandInfo.title, _demandInfo.budget, 
            _demandInfo.desc, _demandInfo.attachment, _demandInfo.period);
    }

    function applyFor(uint _proId, uint _prePrice) external {
        require(msg.sender != ownerOf(_proId), "Not apply for orders yourself.");
        require(!applyInfos[_proId][msg.sender].isApply, "Already applied.");

        applyInfos[_proId][msg.sender].isApply = true;
        applyInfos[_proId][msg.sender].prePrice = _prePrice;

        emit ApplyFor(_proId, msg.sender);
    }

    function cancelApply(uint _proId) external {
        require(msg.sender != ownerOf(_proId), "Not applied.");
        applyInfos[_proId][msg.sender].isApply = false;

        emit CancelApply(_proId, msg.sender);
    }

    function openApply(uint _proId) external {
        require(msg.sender == ownerOf(_proId), "No Root.");
        require(!applyInfos[_proId][msg.sender].isApply, "Already opened.");
        applyInfos[_proId][msg.sender].isApply = true;

        emit OpenApply(_proId, msg.sender);
    }

    function closeApply(uint _proId) external {
        require(msg.sender == ownerOf(_proId), "No Root.");
        require(applyInfos[_proId][msg.sender].isApply, "Already closed.");
        applyInfos[_proId][msg.sender].isApply = false;

        emit CloseApply(_proId, msg.sender);
    }

    function modifyFee(uint _fee) external onlyOwner {
        fee = _fee;
    }
}