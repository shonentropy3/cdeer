pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "hardhat/console.sol";


contract Project is ERC721Enumerable{
    using Counters for Counters.Counter;
    //TODO:考虑手续费
    event CreateProject(address indexed msgSender, uint indexed tokenId, string title, uint budget, 
            string indexed desc, uint period); 
    event  ApplyProject(address indexed msg.sender, uint indexed _proId);

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
        emit CreateProject(msg.sender, tokenId, _projectInfo.title, _projectInfo.budget, 
            _projectInfo.desc, _projectInfo.period);
    }

    function modifyProject(uint _tokenId, ProjectInfo memory _projectInfo) external {
        require(msg.sender == ownerOf(_tokenId),"No right of modification.");
        //TODO:判断项目是否存在订单
        projectContent[_tokenId] = ProjectInfo({
            title: _projectInfo.title,
            budget: _projectInfo.budget,
            desc: _projectInfo.desc,
            period: _projectInfo.period
        });
    }

    function applyProject(uint _proId) external {
        require(address(0) != ownerOf(_proId),"Project does not exist.");
        //TODO:判断项目是否存在订单
        require(!applications[_proId][msg.sender],"Already applied.");
        applications[_proId][msg.sender] = true;

        emit  ApplyProject(msg.sender,_proId)
        
        
    }
}