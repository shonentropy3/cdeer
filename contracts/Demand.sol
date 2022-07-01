//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./interface/IOrder.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "hardhat/console.sol";
import "./interface/IDemand.sol";

contract Demand is ERC721Enumerable, IDemand {
    using Counters for Counters.Counter;
    //TODO: 必要函数添加event
    event CreateProject(uint indexed tokenId, address indexed  user, string title, uint budget, 
            string indexed desc, uint period); 
    event  ApplyFor(uint indexed _proId, address indexed user);

    uint fee;
    address  private operator;

    struct ProInfo{
        string title;
        string desc;
        string attachment;
        uint budget;
        uint period;
    }

    Counters.Counter private tokenIds;
    //proId = >
    mapping(uint => ProInfo) private projects; 
    //报名信息,proId = > applyAddr
    mapping(uint => mapping(address => bool)) private  applyInfo;

    IOrder order;

    //TODO:项目NFT名称
    constructor(address _operator) ERC721("u","e") {
       operator = _operator;
    }

    modifier onlyOperator() {
        require(msg.sender == operator, "No Root.");
        _;
    }

    function modifyOperator(address _operator) external onlyOperator {
        require(_operator != address(0), "Operator is zero address.");
        operator = _operator;
    }

    function setOrder(address _order) external  virtual override onlyOperator {
        require(_order == address(0), "The parameter is zero address.");
        order  = IOrder(_order);    
    }

    function createProject(ProInfo memory _proInfo) external payable {
        require(msg.value > fee, "Not enough handling fee.");
        uint tokenId = tokenIds.current();        
        projects[tokenId] = ProInfo({
            title: _proInfo.title,
            budget: _proInfo.budget,
            desc: _proInfo.desc,
            attachment: _proInfo.attachment,
            period: _proInfo.period
        });

        _safeMint(msg.sender, tokenId);

        applyInfo[tokenId][msg.sender] = true;
        console.log("Owner Address: ",msg.sender);
        tokenIds.increment();   
        console.log("tokenId:", tokenId);
        emit CreateProject(tokenId, msg.sender, _proInfo.title, _proInfo.budget, 
            _proInfo.desc, _proInfo.period);
    }

    function modifyProject(uint _tokenId, ProInfo memory _proInfo) external {
        require(msg.sender == ownerOf(_tokenId), "No right of modification.");
        require(!IOrder(order).isProOrders(_tokenId), "Existing orders.");
        require(!order.isProOrders(_tokenId), "Existing orders.");

        projects[_tokenId] = ProInfo({
            title: _proInfo.title,
            budget: _proInfo.budget,
            desc: _proInfo.desc,
            attachment: _proInfo.attachment,
            period: _proInfo.period
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

    function modifyFee(uint _fee) external onlyOperator {
        fee = _fee;
    }
}