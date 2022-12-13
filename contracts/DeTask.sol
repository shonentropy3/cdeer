//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./SBTBase.sol";

import "./interface/ITask.sol";
import "./interface/IMetadata.sol";
import './libs/TransferHelper.sol';


contract DeTask is SBTBase, Ownable {
    // 手续费
    // uint private taskFee  = 1*10**17;
    uint private taskFee  = 0;
    uint private applyFee = 0;
    address private feeReceiver;

    address public order;
    address public metadataAddr;

    using Counters for Counters.Counter;

    event TaskCreated(uint indexed taskId, address issuer, TaskInfo task);
    event TaskModified(uint indexed taskId, address issuer, TaskInfo task);
    event TaskDisabled(uint indexed taskId, bool disabled);

    event ApplyFor(uint indexed taskId, address indexed worker, uint cost);
    event CancelApply(uint indexed taskId, address worker);
    
    event ModifyFee(uint taskFee, uint applyFee, address feeReceiver);


    Counters.Counter private taskIds;
    //taskId =>
    mapping(uint => TaskInfo) public tasks; 

    //报名信息: taskId => worker
    mapping(uint => mapping(address => uint)) private applyCosts;

    constructor() SBTBase("DeTask", "DeTask") {
        feeReceiver = msg.sender;
    }

    function createTask(address who, TaskInfo memory task) external payable {
        require(msg.value >= taskFee, "Not enough taskFee.");
        taskIds.increment();

        uint taskId = taskIds.current();        
        tasks[taskId] = TaskInfo({
            title: task.title,
            desc: task.desc,
            attachment: task.attachment,
            currency: task.currency,
            budget: task.budget,
            period: task.period,
            skills: task.skills,
            timestamp: uint32(block.timestamp),
            disabled: false
        });
        _mint(who, taskId);

        emit TaskCreated(taskId, who, tasks[taskId]);
    }

    function modifyTask(uint taskId, TaskInfo memory task) external payable {
        require(msg.sender == ownerOf(taskId), "No permission.");

        TaskInfo storage taskInfo = tasks[taskId];

        taskInfo.title = task.title;
        taskInfo.desc = task.desc;
        taskInfo.attachment = task.attachment;
        taskInfo.currency = task.currency;
        taskInfo.budget = task.budget;
        taskInfo.period = task.period;
        taskInfo.skills = task.skills;
        taskInfo.disabled = task.disabled;

        emit TaskModified(taskId, msg.sender, taskInfo);
    }

    function applyFor(address who, uint taskId, uint _cost) public payable {
        require(msg.value >= applyFee, "low fee");
        doApply(who, taskId, _cost);
    }

    function doApply(address who, uint taskId, uint _cost) internal {
        require(who != ownerOf(taskId), "Not apply for orders yourself.");
        require(!tasks[taskId].disabled, "The apply switch is closed.");

        applyCosts[taskId][who] = _cost;
        emit ApplyFor(taskId, who, _cost);
    }

    function cancelApply(uint taskId) public {
        require(applyCosts[taskId][msg.sender] > 0, "Not applied.");
        applyCosts[taskId][msg.sender] = 0;

        emit CancelApply(taskId, msg.sender);
    }

    function applyAndCancel(address who, uint[] memory _taskIds, uint[] memory costs, uint[] memory cancelIds) external payable { 
        uint applyNum = _taskIds.length; 
        require(msg.value >= applyFee * applyNum, "low fee");
        for( uint i=0; i < applyNum; i++) {
            doApply(who, _taskIds[i], costs[i]);
        }

        for( uint i=0; i < cancelIds.length; i++) {
            cancelApply(cancelIds[i]);
        }
    }

    function disableTask(uint taskId, bool _disabled) external {
        require(msg.sender == ownerOf(taskId), "No permission.");
        require(tasks[taskId].disabled != _disabled, "same state.");

        tasks[taskId].disabled = _disabled;
        emit TaskDisabled(taskId, _disabled);
    }

    function transferFee(uint amount) external {
        TransferHelper.safeTransferETH(feeReceiver, amount);
    }

    function setOrder(address _order) external onlyOwner {
        require(_order != address(0), "zero address");
        order = _order;
    }

    function updateFeeReceiver(uint _taskFee, uint _applyFee, address _receiver) external onlyOwner {
        taskFee = _taskFee;
        applyFee = _applyFee;
        feeReceiver = _receiver;

        emit ModifyFee(_taskFee, _applyFee, _receiver);
    }

    function setMetadataContract(address _meta) external onlyOwner {
        require(_meta != address(0), "zero address");
        metadataAddr = _meta;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        return IMetadata(metadataAddr).tokenURI(tokenId);
    }

}