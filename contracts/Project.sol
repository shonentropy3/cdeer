pragma solidity ^0.8.0;

import "./interface/IOrder.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "hardhat/console.sol";
import "./interface/IProject.sol";


contract Project is ERC721Enumerable, IProject {
    using Counters for Counters.Counter;
    //TODO:考虑手续费
    event CreateProject(uint indexed tokenId, address indexed  user, string title, uint budget, 
            string indexed desc, uint period); 
    event  ApplyFor(uint indexed _proId, address indexed user);

    struct ProjectInfo{
        string title;
        string desc;
        uint budget;
        uint period;
    }

    Counters.Counter private tokenIds;

    mapping(uint => ProjectInfo) private projects; 
    //报名信息,proId = > applyAddr
    mapping(uint => mapping(address => bool)) private  applications;

    IOrder order;

    // TODO: 手续费问题
    uint fee;

    //TODO:项目NFT名称
    constructor() ERC721("u","e") {
    }

    function initOrder(address _order) external  virtual override {
        require(_order == address(0), "Is zero address.");
        order  = IOrder(_order);    
    }

    // function updateOrder(IOrder _order) external onlyOwner {
    //     order  = _order;    
    // }

    function createProject(ProjectInfo memory _projectInfo) external payable {
        require(msg.value > fee, "Not enough handling fee.");
        uint tokenId = tokenIds.current();        
        projects[tokenId] = ProjectInfo({
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
        require(msg.sender == ownerOf(_tokenId), "No right of modification.");
        require(!IOrder(order).isProOrders(_tokenId), "Existing orders.");
        require(!order.isProOrders(_tokenId), "Existing orders.");

        projects[_tokenId] = ProjectInfo({
            title: _projectInfo.title,
            budget: _projectInfo.budget,
            desc: _projectInfo.desc,
            period: _projectInfo.period
        });
    }

    function applyFor(uint _proId) external {
        require(address(0) != ownerOf(_proId), "Project does not exist.");
        //TODO:自己接单问题
        require(!order.isProOrders(_proId), "Existing orders.");

        require(!applications[_proId][msg.sender], "Already applied.");
        applications[_proId][msg.sender] = true;

        emit  ApplyFor( _proId, msg.sender);
    }
}