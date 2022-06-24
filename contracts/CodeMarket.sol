pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "hardhat/console.sol";


contract Project is ERC721Enumerable{
    using Counters for Counters.Counter;
    //TODO:考虑手续费
    event CreateProject(address indexed msgSender, uint indexed tokenId, string title, uint budget, 
            string indexed requirements, uint period); 

    struct ProjectInfo{
        string title;
        uint budget;
        string requirements;
        uint period;
        bool orderStatus;
    }

    struct Declaration{
        uint proId;
        uint applyTime;
    }
    
    Counters.Counter private tokenIds;

    mapping(uint => ProjectInfo) private projects; 
    
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
            requirements: _projectInfo.requirements,
            period: _projectInfo.period
        });

        _safeMint(msg.sender, tokenId);

        console.log("Owner Address: ",msg.sender);
        tokenIds.increment();   
        console.log("tokenId:", tokenId);
        emit CreateProject(msg.sender, tokenId, _projectInfo.title, _projectInfo.budget, 
            _projectInfo.requirements, _projectInfo.period);
    }

    function modifyProject(uint _tokenId, ProjectInfo memory _projectInfo) external {
        require(msg.sender == ownerOf(_tokenId),"No right of modification.");
        require(!_projectInfo.orderStatus,"Projects have been taken on order.");
        projectContent[_tokenId] = ProjectInfo({
            title: _projectInfo.title,
            budget: _projectInfo.budget,
            requirements: _projectInfo.requirements,
            period: _projectInfo.period
        });
    }
  
    function orderStatus(uint _tokenId,bool _orderStatus) external {
        require(msg.sender == ownerOf(_tokenId),"No right of modification.");
        require(projects[_tokenId].orderStatus != _orderStatus,"Already in this status.");
        projects[_tokenId].orderStatus = _orderStatus;
    }

    function applyProject(uint _proId) external {
        require(address(0) == ownerOf(_proId),"Project does not exist.");
        
    }
}