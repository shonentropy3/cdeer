//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./interface/IOrder.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";
import "./interface/ITask.sol";

//TODO:1.报名限制数量(暂时取消了)，乙方，时间久远后考虑废弃 2.去掉所有log
contract Task is ERC721, ITask, Ownable {
    // 手续费数量
    uint createTaskFee = 1*10**17;
    address _order;

    using Counters for Counters.Counter;
 
    event CreateTask(uint indexed taskId, address indexed maker, string title, uint budget, 
        string desc, string attachment, uint period);
    event ModifyTask(uint indexed taskId, address maker, string title, uint budget, 
        string desc, string attachment, uint period);
    event DeleteTask(uint indexed taskId, address maker);
    event ApplyFor(uint indexed taskId, address indexed taker, uint valuation);
    event CancelApply(uint indexed taskId, address taker);
    event SwitchApply(uint indexed taskId, address maker, bool);
    event ModifyFee(address indexed owner, uint createTaskFee);

    struct TaskInfo {
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

    Counters.Counter private taskIds;
    //taskId = >
    mapping(uint => TaskInfo) private tasks; 
    //报名信息,taskId = > taker
    mapping(uint => mapping(address => applyInfo)) private  applyInfos;

    //TODO: 项目NFT名称
    constructor() ERC721("UpChain","UpChain") {

    }

    function setOrder(address order_) external  virtual override onlyOwner {
        require(order_ != address(0), "The parameter is zero address.");
        _order = order_;    
    }

    function createTask(TaskInfo memory _taskInfo) external payable {
        require(msg.value > createTaskFee, "Not enough createTaskFee.");
        taskIds.increment();   
        uint taskId = taskIds.current();        
        tasks[taskId] = TaskInfo({
            title: _taskInfo.title,
            desc: _taskInfo.desc,
            attachment: _taskInfo.attachment,
            budget: _taskInfo.budget,            
            period: _taskInfo.period,
            applySwitch: false
        });
        _safeMint(msg.sender, taskId);

        console.log("taskId", taskId);

        emit CreateTask(taskId, msg.sender, _taskInfo.title, _taskInfo.budget, 
            _taskInfo.desc, _taskInfo.attachment, _taskInfo.period);
    }

    function modifyTask(uint _taskId, TaskInfo memory _taskInfo) external {
        require(msg.sender == ownerOf(_taskId), "No permission.");
        require(!IOrder(_order).hasTaskOrders(_taskId), "Existing orders.");

        tasks[_taskId].title = _taskInfo.title;
        tasks[_taskId].budget = _taskInfo.budget;
        tasks[_taskId].desc = _taskInfo.desc;
        tasks[_taskId].attachment = _taskInfo.attachment;
        tasks[_taskId].period = _taskInfo.period;
        tasks[_taskId].applySwitch = false;

        emit ModifyTask(_taskId, msg.sender, _taskInfo.title, _taskInfo.budget, 
            _taskInfo.desc, _taskInfo.attachment, _taskInfo.period);
    }

    function deleteTask(uint _taskId) external {
        require(msg.sender == ownerOf(_taskId), "No permission.");
        require(!IOrder(_order).hasTaskOrders(_taskId), "Existing orders.");

        delete tasks[_taskId];
        _burn(_taskId);

        emit DeleteTask(_taskId, msg.sender);
    }

    function applyFor(uint _taskId, uint _valuation) external {
        require(msg.sender != ownerOf(_taskId), "Not apply for orders yourself.");

        applyInfos[_taskId][msg.sender].isApply = true;
        applyInfos[_taskId][msg.sender].valuation = _valuation;

        emit ApplyFor(_taskId, msg.sender, _valuation);
    }

    function cancelApply(uint _taskId) external {
        require(msg.sender != ownerOf(_taskId), "Not applied.");
        applyInfos[_taskId][msg.sender].isApply = false;

        emit CancelApply(_taskId, msg.sender);
    }

    function switchApply(uint _taskId, bool _switch) external {
        require(msg.sender == ownerOf(_taskId), "No permission.");
        require(tasks[_taskId].applySwitch != _switch, "It is the current state.");
        tasks[_taskId].applySwitch = _switch;

        emit SwitchApply(_taskId, msg.sender, _switch);
    }
    // TODO:手续费最大  
    function modifyFee(uint _createTaskFee) external onlyOwner {
        require(_createTaskFee < 2*10**17, "The createTaskFee is unreasonable.");

        createTaskFee = _createTaskFee;

        emit ModifyFee(msg.sender, _createTaskFee);
    }
}