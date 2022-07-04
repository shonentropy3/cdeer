//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./interface/IOrder.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "hardhat/console.sol";
import "./interface/IDemand.sol";

contract Demand is ERC721Enumerable, IDemand, Ownable {
    using Counters for Counters.Counter;
    //TODO: 必要函数添加event
    event CreateDemand(uint indexed demandId, address indexed  demander, string title, uint budget, 
            string indexed desc, string attachment, uint period); 
    event  ApplyFor(uint indexed _proId, address indexed user);

    uint fee = 1;

    struct DemandInfo{
        string title;
        string desc;
        string attachment;
        uint budget;
        uint period;
    }

    Counters.Counter private demandIds;
    //proId = >
    mapping(uint => DemandInfo) private demands; 
    //报名信息,proId = > applyAddr
    mapping(uint => mapping(address => bool)) private  applyInfo;

    IOrder order;

    //TODO:项目NFT名称
    constructor() ERC721("u","e") {
    }

    function setOrder(address _order) external  virtual override onlyOwner {
        require(_order == address(0), "The parameter is zero address.");
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
        applyInfo[demandId][msg.sender] = true;
        console.log("Owner Address: ", msg.sender);
        demandIds.increment();   
        console.log("demandId:", demandId);

        emit CreateDemand(demandId, msg.sender, _demandInfo.title, _demandInfo.budget, 
            _demandInfo.desc, _demandInfo.attachment, _demandInfo.period);
    }

    function modifyDemand(uint _tokenId, DemandInfo memory _demandInfo) external {
        console.log("modifyDemand address" , msg.sender);
        require(msg.sender == ownerOf(_tokenId), "No right of modification.");
        require(!IOrder(order).isProOrders(_tokenId), "Existing orders.");
        require(!order.isProOrders(_tokenId), "Existing orders.");

        demands[_tokenId] = DemandInfo({
            title: _demandInfo.title,
            budget: _demandInfo.budget,
            desc: _demandInfo.desc,
            attachment: _demandInfo.attachment,
            period: _demandInfo.period
        });
    }

    function applyFor(uint _proId) external {
        require(address(0) != ownerOf(_proId), "Demand does not exist.");
        require(msg.sender != ownerOf(_proId), "Not taking orders yourself.");
        require(!order.isProOrders(_proId), "Existing orders.");
        require(!applyInfo[_proId][msg.sender], "Already applied.");

        applyInfo[_proId][msg.sender] = true;

        emit ApplyFor(_proId, msg.sender);
    }

    function cancelApplyFor(uint _proId) external {
        require(msg.sender != ownerOf(_proId), "Not applied.");
        applyInfo[_proId][msg.sender] = false;
    }

    function closeApplyFor(uint _proId) external {
        require(msg.sender != ownerOf(_proId), "No Root.");
        require(applyInfo[_proId][msg.sender], "Already closed.");
        applyInfo[_proId][msg.sender] = false;
    }

    function modifyFee(uint _fee) external onlyOwner {
        fee = _fee;
    }
}