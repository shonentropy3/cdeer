// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "codemark/DeTask.sol";
import {Utilities} from "./utils/Utilities.sol";
import {Mock} from "./mock/mock.sol";

contract DeTaskTest is Test {
    Mock internal mock;
    DeTask internal deTask;
    address owner; // 合约拥有者
    address issuer; // 甲方
    address worker; // 乙方

    function setUp() public {
        mock = new Mock();
        // 初始化用户地址
        owner = msg.sender;
        issuer = vm.addr(1);
        worker = vm.addr(2);

        vm.startPrank(owner); // 切换合约发起人
        deTask = new DeTask();
        vm.stopPrank();
        // 打印信息
        console.log(owner);
        console.log(issuer);
    }

    // testCreateTask
    // @Summary 创建需求
    function testCreateTask() public {
        // TaskInfo
        TaskInfo memory task = mock.mockOneTask(1);
        // 创建Task
        vm.startPrank(issuer); // 甲方
        deTask.createTask(issuer, task);
        vm.stopPrank();
        // 获取getTaskInfo
        (
            string memory title,
            string memory desc,
            string memory attachment,
            uint8 currency,
            uint128 budget,
            uint32 period,
            uint48 skills,
            uint32 timestamp,
            bool disabled
        ) = deTask.getTaskInfo(1);
        assertEq(task.title, title);
        assertEq(task.desc, desc);
        assertEq(task.attachment, attachment);
        assertEq(task.currency, currency);
        assertEq(task.budget, budget);
        assertEq(task.period, period);
        assertEq(task.skills, skills);
        assertEq(task.timestamp, timestamp);
        assertEq(false, disabled);
    }

    // testCannotModifyTaskNotIssuer
    // @Summary 非本人修改Task
    // @Failure modifyTask No permission.
    function testCannotModifyTaskNotIssuer() public {
        testCreateTask();
        TaskInfo memory task = mock.mockOneTask(2);
        vm.expectRevert(bytes("No permission."));
        deTask.modifyTask(1, task);
    }

    // testModifyTask
    // @Summary 修改Task
    function testModifyTask() public {
        testCreateTask();
        TaskInfo memory task = mock.mockOneTask(3);
        // 修改Task
        task.timestamp = 123;
        vm.startPrank(issuer); // 甲方
        deTask.modifyTask(1, task);
        vm.stopPrank();
        // 获取getTaskInfo
        (
            string memory title,
            string memory desc,
            string memory attachment,
            uint8 currency,
            uint128 budget,
            uint32 period,
            uint48 skills,
            ,
            bool disabled
        ) = deTask.getTaskInfo(1);
        assertEq(task.title, title);
        assertEq(task.desc, desc);
        assertEq(task.attachment, attachment);
        assertEq(task.currency, currency);
        assertEq(task.budget, budget);
        assertEq(task.period, period);
        assertEq(task.skills, skills);
        assertEq(task.disabled, disabled);
    }

    // testCannotApplyFor
    // @Summary 报名Task失败情况
    function testCannotApplyFor() public {
        testCreateTask();
        // 报名自己的Task
        vm.expectRevert(bytes("Not apply for orders yourself."));
        deTask.applyFor(issuer, 1, 100);
        testModifyTask();
        // 报名已停止报名的Task
        vm.expectRevert(bytes("The apply switch is closed."));
        deTask.applyFor(worker, 1, 100);
        // 不足支付手续费
        testUpdateFeeReceiver();
        vm.deal(worker, 20);
        vm.startPrank(worker); // 乙方
        vm.expectRevert(bytes("low fee"));
        deTask.applyFor{value: 9}(worker, 1, 100);
        vm.stopPrank();
    }

    // testApplyFor
    // @Summary 报名Task
    function testApplyFor() public {
        testCreateTask();
        vm.startPrank(worker); // 乙方
        deTask.applyFor{value: 0}(worker, 1, 100);
        vm.stopPrank();
    }

    // testCannotUpdateFeeReceiver
    // @Summary 非合约创建人调用修改手续费
    function testCannotUpdateFeeReceiver() public {
        vm.expectRevert(bytes("Ownable: caller is not the owner"));
        deTask.updateFeeReceiver(1, 1, worker);
    }

    // testCannotUpdateFeeReceiver
    // @Summary 修改手续费
    function testUpdateFeeReceiver() public {
        vm.startPrank(owner);
        deTask.updateFeeReceiver(10, 10, owner);
        vm.stopPrank();
        assertEq(deTask.feeReceiver(), owner);
    }

    // testCannotCancelApply
    // @Summary 非本人取消报名
    function testCannotCancelApply() public {
        testApplyFor();
        vm.expectRevert(bytes("Not applied."));
        deTask.cancelApply(1);

        deTask.cancelApply(10);
    }

    // testCancelApply
    // @Summary 取消报名
    function testCancelApply() public {
        testApplyFor();
        vm.startPrank(worker);
        deTask.cancelApply(1);
        vm.stopPrank();
    }

    // testCannotApplyAndCancel
    // @Summary 批量操作非本人取消报名 && 批量操作不足支付手续费
    function testCannotApplyAndCancel() public {
        testCreateTask();
        testCreateTask();
        uint256[] memory _taskIds = new uint256[](2);
        uint256[] memory costs = new uint256[](2);
        uint256[] memory cancelIds = new uint256[](1);
        _taskIds[0] = 1;
        _taskIds[1] = 2;
        costs[0] = 1;
        cancelIds[0] = 1;
        // 不足支付手续费
        testUpdateFeeReceiver();
        vm.deal(worker, 20);
        vm.startPrank(worker); // 乙方
        vm.expectRevert(bytes("low fee"));
        deTask.applyAndCancel{value: 19}(worker, _taskIds, costs, cancelIds);
        vm.stopPrank();
        // 非本人取消报名
        vm.expectRevert(bytes("Not applied."));
        deTask.applyAndCancel{value: 20}(worker, _taskIds, costs, cancelIds);
    }

}
