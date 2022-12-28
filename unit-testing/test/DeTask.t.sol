// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../src/DeTask.sol";
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
        console.log(worker);
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
    }

    // testCannotCancelApply
    // @Summary 非本人取消报名
    function testCannotCancelApply() public {
        testApplyFor();
        vm.expectRevert(bytes("Not applied."));
        deTask.cancelApply(1);
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

    // testApplyAndCancel
    // @Summary 批量操作报名 && 批量操作取消报名
    function testApplyAndCancel() public {
        testCreateTask();
        testCreateTask();
        uint256[] memory _taskIds = new uint256[](2);
        uint256[] memory costs = new uint256[](2);
        uint256[] memory cancelIds = new uint256[](0);
        _taskIds[0] = 1;
        _taskIds[1] = 2;
        costs[0] = 1;
        costs[1] = 1; // costs为0相当于未申请
        // 不足支付手续费
        testUpdateFeeReceiver();
        vm.deal(worker, 20);
        vm.startPrank(worker); // 乙方
        // 批量操作报名
        deTask.applyAndCancel{value: 20}(worker, _taskIds, costs, cancelIds);
        // 批量操作取消报名
        _taskIds = new uint256[](0);
        costs = new uint256[](0);
        cancelIds = new uint256[](2);
        cancelIds[0] = 1;
        cancelIds[1] = 2;
        deTask.applyAndCancel(worker, _taskIds, costs, cancelIds);
        vm.stopPrank();
    }

    // testCannotDisableTask
    // @Summary 非本人修改Task报名状态 && 修改Task为相同状态
    function testCannotDisableTask() public {
        testCreateTask();
        // 非本人修改Task报名状态
        vm.expectRevert(bytes("No permission."));
        deTask.disableTask(1, true);
        // 修改Task为相同状态
        vm.startPrank(issuer); // 甲方
        vm.expectRevert(bytes("same state."));
        deTask.disableTask(1, false);
        vm.stopPrank();
    }

    // testDisableTask
    // @Summary 修改Task报名状态
    function testDisableTask() public {
        testCreateTask();
        vm.startPrank(issuer); // 甲方
        deTask.disableTask(1, true);
        vm.stopPrank();
        (, , , , , , , , bool disabled) = deTask.getTaskInfo(1);
        assertEq(disabled, true);
    }

    // TODO: ERROR
    // testTransferFee
    // @Summary 收取手续费
    function testTransferFee() public {
        vm.deal(issuer, 20 ether);
        // vm.startPrank(issuer); // 甲方
        // TransferHelper.safeTransferETH(owner, 1);
        // deTask.transferFee(1);
        // console.log(address(worker).balance);
        // (bool success, ) = address(worker).call{value: 1}(new bytes(0));
        // require(
        //     success,
        //     "TransferHelper::safeTransferETH: ETH transfer failed"
        // );
        //
        // vm.stopPrank();
    }

    // testCannotSetOrder
    // @Summary 非合约创建者设置Order合约地址 && 设置Order合约地址为 零地址
    function testCannotSetOrder() public {
        // 非合约创建者设置order合约地址
        vm.expectRevert(bytes("Ownable: caller is not the owner"));
        deTask.setOrder(address(0xd2EeE6cB28C99767BA7F8469C3C621033bb09C77));
        // 设置Order合约地址为 零地址
        vm.startPrank(owner);
        vm.expectRevert(bytes("zero address"));
        deTask.setOrder(address(0));
        vm.stopPrank();
    }

    // testSetOrder
    // @Summary 设置Order合约地址
    function testSetOrder() public {
        address addr = address(0xd2EeE6cB28C99767BA7F8469C3C621033bb09C77);
        vm.startPrank(owner);
        deTask.setOrder(addr);
        vm.stopPrank();
        assertEq(deTask.order(), addr);
    }

    // testCannotSetMetaContract
    // @Summary 非合约创建者设置Meta合约地址 && 设置Meta合约地址为 零地址
    function testCannotSetMetaContract() public {
        // 非合约创建者设置order合约地址
        vm.expectRevert(bytes("Ownable: caller is not the owner"));
        deTask.setMetaContract(address(0xd2EeE6cB28C99767BA7F8469C3C621033bb09C77));
        // 设置Order合约地址为 零地址
        vm.startPrank(owner);
        vm.expectRevert(bytes("zero address"));
        deTask.setMetaContract(address(0));
        vm.stopPrank();
    }

    // testSetMetaContract
    // @Summary 设置Meta合约地址
    function testSetMetaContract() public {
        address addr = address(0xd2EeE6cB28C99767BA7F8469C3C621033bb09C77);
        vm.startPrank(owner);
        deTask.setMetaContract(addr);
        vm.stopPrank();
        assertEq(deTask.meta(), addr);
    }    

    // function testTokenURI()public{
    //     console.log(deTask.tokenURI(1));
    // }
}
