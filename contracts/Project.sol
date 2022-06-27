pragma solidity ^0.8.0;

import "./interface/IOrder.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "hardhat/console.sol";


contract Project is ERC721Enumerable {
    using Counters for Counters.Counter;
    //TODO:考虑手续费
    event CreateProject(uint indexed tokenId, address indexed msgSender, string title, uint budget, 
            string indexed desc, uint period); 
    event  ApplyProject(uint indexed _proId, address indexed msg.sender);

    struct ProjectInfo{
        string title;
        string desc;
        uint budget;
        uint period;
    }

    Counters.Counter private tokenIds;

    mapping(uint => ProjectInfo) private projects; 
    //报名信息
    mapping(uint => mapping(address => bool)) private  applications;

    //TODO:项目NFT名称
    constructor() {

    }
    //TODO:考虑支付其他货币
    function createProject(ProjectInfo memory _projectInfo) external payable {
        require(msg.value > fee, "Not enough handling fee.");
        uint tokenId = tokenIds.current();        
        projectContent[tokenId] = ProjectInfo({
            title: _projectInfo.title,
            budget: _projectInfo.budget,
            desc: _projectInfo.desc,
            period: _projectInfo.period
        });

        _safeMint(msg.sender, tokenId);

        console.log("Owner Address: ",msg.sender);
        tokenIds.increment();   
        console.log("tokenId:", tokenId);
        emit CreateProject(tokenId, msg.sender, _projectInfo.title, _projectInfo.budget, 
            _projectInfo.desc, _projectInfo.period);
    }

    function modifyProject(uint _tokenId, ProjectInfo memory _projectInfo) external {
        require(msg.sender == ownerOf(_tokenId),"No right of modification.");
        require(!IOrder.isProOrders(_tokenId),"Existing orders.");
        projectContent[_tokenId] = ProjectInfo({
            title: _projectInfo.title,
            budget: _projectInfo.budget,
            desc: _projectInfo.desc,
            period: _projectInfo.period
        });
    }

    function applyProject(uint _proId) external {
        require(address(0) != ownerOf(_proId),"Project does not exist.");
        require(!IOrder.isProOrders(_tokenId),"Existing orders.");
        require(!applications[_proId][msg.sender],"Already applied.");
        applications[_proId][msg.sender] = true;

        emit  ApplyProject( _proId, msg.sender)
        
        
    }
}