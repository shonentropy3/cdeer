pragma solidity ^0.8.0;

import "./interface/IOrder.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "hardhat/console.sol";
import "./interface/IProject.sol";


contract Project is ERC721Enumerable, IProject {
    using Counters for Counters.Counter;
    //TODO: 必要函数添加event
    event CreateProject(uint indexed tokenId, address indexed  user, string title, uint budget, 
            string indexed desc, uint period); 
    event  ApplyFor(uint indexed _proId, address indexed user);

    uint fee;
    address  private operator;

    struct ProjectInfo{
        string title;
        string desc;
        string attachment;
        uint budget;
        uint period;
    }

    Counters.Counter private tokenIds;

    mapping(uint => ProjectInfo) private projects; 
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

    function createProject(ProjectInfo memory _projectInfo) external payable {
        require(msg.value > fee, "Not enough handling fee.");
        uint tokenId = tokenIds.current();        
        projects[tokenId] = ProjectInfo({
            title: _projectInfo.title,
            budget: _projectInfo.budget,
            desc: _projectInfo.desc,
            attachment: _projectInfo.attachment,
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
            attachment: _projectInfo.attachment,
            period: _projectInfo.period
        });
    }

    function applyFor(uint _proId) external {
        require(address(0) != ownerOf(_proId), "Project does not exist.");
        //TODO:自己接单问题
        require(!order.isProOrders(_proId), "Existing orders.");
        require(!applyInfo[_proId][msg.sender], "Already applied.");

        applyInfo[_proId][msg.sender] = true;

        emit  ApplyFor( _proId, msg.sender);
    }

    function modifyFee(uint _fee) external onlyOperator {
        fee = _fee;
    }
}