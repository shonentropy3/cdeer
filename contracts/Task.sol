//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./interface/IOrder.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./interface/ITask.sol";

import "hardhat/console.sol";

//TODO:1.报名限制数量(暂时取消了)，乙方，时间久远后考虑废弃之前报名数 
// 2.去掉所有log
contract Task is ERC721, ITask, Ownable {
    // 手续费数量
    uint createTaskFee = 1*10**17;

    address public order;

    using Counters for Counters.Counter;

    event TaskCreated(uint indexed taskId, address indexed issuer, string title, uint budget, 
        string desc, string attachment, uint period);
    event TaskModified(uint indexed taskId, address issuer, string title, uint budget, 
        string desc, string attachment, uint period);
    event TaskDisabled(uint indexed taskId, bool disabled);

    event ApplyFor(uint indexed taskId, address indexed worker, uint cost);
    event CancelApply(uint indexed taskId, address worker);
    
    event ModifyFee(address indexed owner, uint createTaskFee);

    struct TaskInfo {
        string title;
        string desc;
        string attachment;
        uint budget;
        uint period;
        bool disabled;
    }


    Counters.Counter private taskIds;
    //taskId =>
    mapping(uint => TaskInfo) public tasks; 

    //报名信息: taskId => worker
    mapping(uint => mapping(address => uint)) private applyCosts;

    //TODO: 项目NFT名称
    constructor() ERC721("UpChain","UpChain") {

    }

    function setOrder(address _order) external virtual override onlyOwner {
        require(_order != address(0), "The parameter is zero address.");
        order = _order;    
    }

    function createTask(TaskInfo memory _taskInfo) external payable {
        require(msg.value >= createTaskFee, "Not enough createTaskFee.");
        taskIds.increment();

        uint taskId = taskIds.current();        
        tasks[taskId] = TaskInfo({
            title: _taskInfo.title,
            desc: _taskInfo.desc,
            attachment: _taskInfo.attachment,
            budget: _taskInfo.budget,            
            period: _taskInfo.period,
            disabled: false
        });
        _safeMint(msg.sender, taskId);

        console.log("taskId", taskId);

        emit TaskCreated(taskId, msg.sender, _taskInfo.title, _taskInfo.budget, 
            _taskInfo.desc, _taskInfo.attachment, _taskInfo.period);
    }

    function modifyTask(uint _taskId, TaskInfo memory _taskInfo) external {
        require(msg.sender == ownerOf(_taskId), "No permission.");
        require(!IOrder(order).hasTaskOrders(_taskId), "Existing orders.");

        tasks[_taskId].title = _taskInfo.title;
        tasks[_taskId].budget = _taskInfo.budget;
        tasks[_taskId].desc = _taskInfo.desc;
        tasks[_taskId].attachment = _taskInfo.attachment;
        tasks[_taskId].period = _taskInfo.period;
        tasks[_taskId].disabled = _taskInfo.disabled;

        emit TaskModified(_taskId, msg.sender, _taskInfo.title, _taskInfo.budget, 
            _taskInfo.desc, _taskInfo.attachment, _taskInfo.period);
    }

    function applyFor(uint _taskId, uint _cost) external {
        require(msg.sender != ownerOf(_taskId), "Not apply for orders yourself.");
        require(!tasks[_taskId].disabled, "The apply switch is closed.");

        applyCosts[_taskId][msg.sender] = _cost;

        emit ApplyFor(_taskId, msg.sender, _cost);
    }


    function disableTask(uint _taskId, bool _disabled) external {
        require(msg.sender == ownerOf(_taskId), "No permission.");
        require(tasks[_taskId].disabled != _disabled, "same state.");

        tasks[_taskId].disabled = _disabled;
        emit TaskDisabled(_taskId, _disabled);
    }

    // TODO:手续费最大  
    function modifyFee(uint _createTaskFee) external onlyOwner {
        require(_createTaskFee < 2*10**17, "The createTaskFee is unreasonable.");

        createTaskFee = _createTaskFee;

        emit ModifyFee(msg.sender, _createTaskFee);
    }
}