// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "contracts/DeTask.sol";
import {Utilities} from "./utils/Utilities.sol";
import {Mock} from "./mock/mock.sol";

contract DeTaskTest is Test {
    Mock internal mock;
    DeTask internal deTask;
    address owner; // 合约拥有者
    address issuer; // 甲方
    address worker; // 乙方
    address other; // 项目无关方

    function setUp() public {
        mock = new Mock();
        // 初始化用户地址
        owner = msg.sender;
        issuer = vm.addr(1);
        worker = vm.addr(2);
        other = vm.addr(3);

        vm.startPrank(owner); // 切换合约发起人
        deTask = new DeTask();
        vm.stopPrank();
        // 打印信息
        console.log(owner);
        console.log(issuer);
        console.log(worker);
    }

    // 测试不同身份创建task(pan)
    function testCreateTaskByDifferentPerson() public {
        string memory title;
        string memory attachment;
        uint8 currency;
        uint128 budget;
        uint32 period;
        uint48 skills;
        uint32 timestamp;
        bool disabled;
        // 生成Task
        TaskInfo memory task = mock.mockOneTask(1);
        TaskInfo memory taskRecord;

        vm.startPrank(issuer); // 甲方
        deTask.createTask(issuer, task);
        vm.stopPrank();
        (
            title,
            attachment,
            currency,
            budget,
            period,
            skills,
            timestamp,
            disabled
        ) = deTask.getTaskInfo(1);
        assertEq(bytes(title).length == 0, false);

        
        vm.startPrank(worker); // 乙方
        deTask.createTask(issuer, task);
        vm.stopPrank();
        (
            title,
            attachment,
            currency,
            budget,
            period,
            skills,
            timestamp,
            disabled
        ) = deTask.getTaskInfo(2);
         assertEq(bytes(title).length == 0, false);
       
        vm.startPrank(other); // 其他
        deTask.createTask(other, task);
        vm.stopPrank();
        (
            title,
            attachment,
            currency,
            budget,
            period,
            skills,
            timestamp,
            disabled
        ) = deTask.getTaskInfo(3);
         assertEq(bytes(title).length == 0, false);
    }
    // 测试创建task时task数据异常情况(pan)(异常数据的情况只要task的数据符合规范就不会报错)
    // function testCreateTaskByAbnormal() public {
    //     string memory title;
    //     string memory attachment;
    //     uint8 currency;
    //     uint128 budget;
    //     uint32 period;
    //     uint48 skills;
    //     uint32 timestamp;
    //     bool disabled;
    //     // 生成Task
    //     TaskInfo memory task = mock.mockOneTask(0);
    //     TaskInfo memory taskRecord;

    //     vm.startPrank(issuer); // 甲方
    //     deTask.createTask(issuer, task);
    //     vm.stopPrank();
    //     (
    //         title,
    //         attachment,
    //         currency,
    //         budget,
    //         period,
    //         skills,
    //         timestamp,
    //         disabled
    //     ) = deTask.getTaskInfo(1);
    //     assertEq(bytes(title).length == 0, false);
    // }

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
            string memory attachment,
            uint8 currency,
            uint128 budget,
            uint32 period,
            uint48 skills,
            uint32 timestamp,
            bool disabled
        ) = deTask.getTaskInfo(1);
        assertEq(task.title, title);
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
    // 测试taskid不存在(pan)
    function testModifyTaskUseTaskIdNotExist() public {
        testCreateTask();
        TaskInfo memory task = mock.mockOneTask(2);
        vm.startPrank(issuer);
        vm.expectRevert(bytes("ERC721: invalid token ID"));
        deTask.modifyTask(2, task);
        vm.stopPrank();
    }
    // 测试task数据异常情况(pan)(异常数据的情况只要task的数据符合规范就不会报错)
    // function testModifyTaskUseUnexpectTaskMessage() public {
    //      testCreateTask();
    //     TaskInfo memory task = mock.mockOneTask(2);
    //     vm.startPrank(issuer);
    //     // vm.expectRevert(bytes("ERC721: invalid token ID"));
    //     deTask.modifyTask(1, task);
    //     vm.stopPrank();
    // }
    
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
            string memory attachment,
            uint8 currency,
            uint128 budget,
            uint32 period,
            uint48 skills,
            ,
            bool disabled
        ) = deTask.getTaskInfo(1);
        assertEq(task.title, title);
        assertEq(task.attachment, attachment);
        assertEq(task.currency, currency);
        assertEq(task.budget, budget);
        assertEq(task.period, period);
        assertEq(task.skills, skills);
        assertEq(task.disabled, disabled);
    }
    // 测试getTaskInfo
    // taskid不存在的情况(pan)
    function testGetTaskInfoUseNotExistTaskId() public {
        string memory title;
        string memory attachment;
        uint8 currency;
        uint128 budget;
        uint32 period;
        uint48 skills;
        uint32 timestamp;
        bool disabled;

        testCreateTask();
        vm.startPrank(issuer);
        (
            title,
            attachment,
            currency,
            budget,
            period,
            skills,
            timestamp,
            disabled
        ) = deTask.getTaskInfo(1);
        assertEq(bytes(title).length == 0, false);
        vm.stopPrank();
        vm.startPrank(worker);
               (
            title,
            attachment,
            currency,
            budget,
            period,
            skills,
            timestamp,
            disabled
        ) = deTask.getTaskInfo(1);
        assertEq(bytes(title).length == 0, false);
        vm.stopPrank();
        vm.startPrank(other);
               (
            title,
            attachment,
            currency,
            budget,
            period,
            skills,
            timestamp,
            disabled
        ) = deTask.getTaskInfo(1);
        assertEq(bytes(title).length == 0, false);
        vm.stopPrank();

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
    // 测试报名时传入的报名地址为创建人/其他人/零
    // 事件
    event ApplyFor(uint indexed taskId, address indexed worker, uint cost);
    function testApplyForApplicantNotExist() public {
        
        testCreateTask();
        // 零地址
        address dre = 0x0000000000000000000000000000000000000000;
        vm.expectEmit(true, true, false, true);
        emit ApplyFor(1,0x0000000000000000000000000000000000000001,100);
        deTask.applyFor(dre, 1, 100);
    }


    // 测试报名时传入的taskId不存在
    function testApplyForTaskIdNotExist() public {
        
        testCreateTask();
        vm.expectRevert(bytes("ERC721: invalid token ID"));
        deTask.applyFor(worker, 2, 100);
    }
    // 测试报名时传入的cost>=0
    function testApplyForCostNotEnought() public {
        
        testCreateTask();
        // vm.expectRevert(bytes("ERC721: invalid token ID"));
        vm.expectEmit(true, true, false, true);
        emit ApplyFor(1,worker,100);
        deTask.applyFor(worker, 1, 0);
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
        // vm.startPrank(issuer);
        deTask.cancelApply(1);
        // vm.stopPrank();
    }

    //测试取消报名不存在的taskid
    function testCancelApplyTaskIdNotExist() public {
        testApplyFor();
        vm.expectRevert(bytes("Not applied."));
        // vm.startPrank(issuer);
        vm.startPrank(worker);
        deTask.cancelApply(2);
        vm.stopPrank();
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
        (, , , , , , , bool disabled) = deTask.getTaskInfo(1);
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

    // testCannotSetMetaContract
    // @Summary 非合约创建者设置Meta合约地址 && 设置Meta合约地址为 零地址
    function testCannotSetMetaContract() public {
        // 非合约创建者设置order合约地址
        vm.expectRevert(bytes("Ownable: caller is not the owner"));
        deTask.setMetaContract(
            address(0xd2EeE6cB28C99767BA7F8469C3C621033bb09C77)
        );
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

    // 设置手续费收取地址
    function testUpdateFeeReceiverNotOwner() public {
        vm.startPrank(other);
        vm.expectRevert("Ownable: caller is not the owner");
        deTask.updateFeeReceiver(20,20,issuer);
        vm.stopPrank();
    }

    // 设置合约的代币地址
    // function testTokenURINotExist() public {
    //     vm.startPrank(owner);
    //     deTask.tokenURI();
    //     vm.stopPrank();
    // }
}
