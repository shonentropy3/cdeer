// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/console2.sol";
import {DeOrderTest} from "./Deorder.t.sol";

contract AbortOrder is DeOrderTest {
    // testCannotAbortOrder
    // @Summary 中止任务失败情况
    // function testCannotAbortOrder() public {
    //     createOrder(issuer, address(0), 100); // 创建Order
    //     // 状态不在Ongoing
    //     vm.expectRevert(abi.encodeWithSignature("ProgressError()"));
    //     abortOrder(issuer, 1); // 中止任务
    //     permitStage(issuer, worker, "Due", ""); // 阶段划分
    //     payOrder(issuer, 100, zero); // 付款
    //     startOrder(issuer); // 开始任务
    //     // 其它人调用合约中止
    //     vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
    //     abortOrder(other, 1);
    // }

    // // testCannotAbortOrder
    // // @Summary 中止任务失败情况
    // function testAbortOrder() public {
    //     createOrder(issuer, address(0), 100); // 创建Order
    //     permitStage(issuer, worker, "Due", ""); // 阶段划分
    //     payOrder(issuer, 100, zero); // 付款
    //     startOrder(issuer); // 开始任务
    //     // 中止任务 已经完成的阶段和预付款 付款给乙方
    //     abortOrder(worker, 1);
    // }

    //按期付款，设置100块，时间17280*10s（两天），一个阶段划分的order，issuer在时间一半的时候中止任务，只有一个阶段
    function testCannotDueIusserAbortOrder() public {
        createOrder(issuer, address(0), 100 ether); // 创建Order
        amounts = [100 ether]; //100块
        periods = [172800]; // 两天
        permitStage(issuer, worker, amounts, periods, "Due", ""); // 阶段划分
        payOrder(issuer, 100 ether, zero); // 付款
        assertEq(address(issuer).balance, 900 ether); //项目甲方余额
        vm.warp(0); //初始化时间
        startOrder(issuer); // 开始任务
        vm.warp(17280 * 5); //增加17280s
        abortOrder(issuer, 1); //issuer中止任务
        assertEq(address(issuer).balance, 950 ether); //项目结束甲方余额
        assertEq(address(worker).balance, 47.5 ether); //项目结束乙方余额

        // console2.log(address(issuer).balance);//打印账户的余额
        // console2.log(address(worker).balance);
        // console2.log(address(_weth).balance);
        // assertEq(address(owner).balance, 1);
    }

    //按期付款，设置100块，时间17280*10s（两天），一个阶段划分的order，worker在时间一半的时候中止任务，只有一个阶段
    function testCannotDueWorkerAbortOrder() public {
        createOrder(issuer, address(0), 100 ether); // 创建Order
        amounts = [100 ether];
        periods = [172800]; // 两天
        permitStage(issuer, worker, amounts, periods, "Due", ""); // 阶段划分
        payOrder(issuer, 100 ether, zero); // 付款
        assertEq(address(issuer).balance, 900 ether);
        vm.warp(0); //初始化时间
        startOrder(issuer); // 开始任务
        vm.warp(17280 * 5); //增加1天
        abortOrder(worker, 1);
        assertEq(address(issuer).balance, 1000 ether);
        assertEq(address(worker).balance, 0 ether);
    }

    //验收付款，设置100块，时间17280*10s（两天），一个阶段划分的order，worker在时间一半的时候中止任务，只有一个阶段
    function testCannotConfirmIusserAbortOrder() public {
        createOrder(issuer, address(0), 100 ether); // 创建Order
        amounts = [100 ether];
        periods = [172800]; // 两天
        permitStage(issuer, worker, amounts, periods, "Confirm", ""); // 阶段划分
        payOrder(issuer, 100 ether, zero); // 付款
        assertEq(address(issuer).balance, 900 ether);
        vm.warp(0); //初始化时间
        startOrder(issuer); // 开始任务
        vm.warp(17280 * 5); //增加1天
        abortOrder(issuer, 1);
        assertEq(address(issuer).balance, 1000 ether);
        assertEq(address(worker).balance, 0 ether);
    }

    function testCannotConfirmWorkerAbortOrder() public {
        createOrder(issuer, address(0), 100 ether); // 创建Order
        amounts = [100 ether];
        periods = [172800]; // 两天
        permitStage(issuer, worker, amounts, periods, "Confirm", ""); // 阶段划分
        payOrder(issuer, 100 ether, zero); // 付款
        assertEq(address(issuer).balance, 900 ether);
        vm.warp(0); //初始化时间
        startOrder(issuer); // 开始任务
        vm.warp(17280 * 5); //增加1天
        abortOrder(worker, 1);
        assertEq(address(issuer).balance, 1000 ether);
        assertEq(address(worker).balance, 0 ether);
    }

    // 甲方阶段延长时间，中止任务
    function testoo() public {
        vm.deal(owner, 0 ether);
        createOrder(issuer, address(0), 100 ether); // 创建Order
        amounts = [100 ether];
        periods = [86400]; // 一天
        permitStage(issuer, worker, amounts, periods, "Due", ""); // 阶段划分
        payOrder(issuer, 100 ether, zero); // 付款
        assertEq(address(issuer).balance, 900 ether);
        vm.warp(0); //初始化时间
        startOrder(issuer); // 开始任务
        prolongStage(issuer, worker, 1, 0, 86400, ""); //延长1天
        vm.warp(86400); //时间过了1/5天
        abortOrder(issuer, 1);
        assertEq(address(issuer).balance, 950 ether); //项目结束甲方余额
        assertEq(address(worker).balance, 47.5 ether); //项目结束乙方余额
        // console2.log('____________________________________');//打印账户的余额
        // console2.log(address(issuer).balance);//打印账户的余额
        // console2.log(address(worker).balance);
        // console2.log(address(_weth).balance);
        // console2.log(address(issuer).balance+address(worker).balance+address(_weth).balance+address(owner).balance);
        // console2.log(block.timestamp);
    }

    //Due乙方阶段延长，乙中止任务
    function testprolongStageDueWorkerAbortOrder() public {
        createOrder(issuer, address(0), 100 ether); // 创建Order
        amounts = [100 ether];
        periods = [86400]; // 一天
        permitStage(issuer, worker, amounts, periods, "Due", ""); // 阶段划分
        payOrder(issuer, 100 ether, zero); // 付款
        assertEq(address(issuer).balance, 900 ether);
        vm.warp(0); //初始化时间
        startOrder(issuer); // 开始任务
        prolongStage(worker, issuer,1, 0, 86400,""); //延长1天
        vm.warp(86400); //时间过了1/5天
        abortOrder(worker, 1);
        assertEq(address(issuer).balance, 1000 ether); //项目结束甲方余额
        assertEq(address(worker).balance, 0 ether); //项目结束乙方余额
    }

    //Confirm甲方阶段延长时间，乙方中止任务
    function testprolongStageConfirmWorkerAbortOrder() public {
        createOrder(issuer, address(0), 100 ether); // 创建Order
        amounts = [100 ether];
        periods = [86400]; // 一天
        permitStage(issuer, worker, amounts, periods, "Confirm", ""); // 阶段划分
        payOrder(issuer, 100 ether, zero); // 付款
        assertEq(address(issuer).balance, 900 ether);
        vm.warp(0); //初始化时间
        startOrder(issuer); // 开始任务
        prolongStage(worker, issuer,1, 0, 86400,""); //延长1天
        vm.warp(86400); //时间过了1/5天
        abortOrder(worker, 1);
        assertEq(address(issuer).balance, 1000 ether); //项目结束甲方余额
        assertEq(address(worker).balance, 0 ether); //项目结束乙方余额
    }

    //Confirm甲方阶段延长时间，甲方中止任务
    function testprolongStageConfirmIssuerAbortOrder() public {
        createOrder(issuer, address(0), 100 ether); // 创建Order
        amounts = [100 ether];
        periods = [86400]; // 一天
        permitStage(issuer, worker, amounts, periods, "Confirm", ""); // 阶段划分
        payOrder(issuer, 100 ether, zero); // 付款
        assertEq(address(issuer).balance, 900 ether);
        vm.warp(0); //初始化时间
        startOrder(issuer); // 开始任务
        prolongStage(issuer, worker, 1, 0, 86400, ""); //延长1天
        vm.warp(86400); //时间过了1/5天
        abortOrder(issuer, 1);
        assertEq(address(issuer).balance, 1000 ether); //项目结束甲方余额
        assertEq(address(worker).balance, 0 ether); //项目结束乙方余额
    }

    //多阶段due模式，前两阶段已完成下，甲方中断任务，剛過第三階段中段
    function testMoreDueIusserAbortOrder() public {
        createOrder(issuer, address(0), 100 ether); // 创建Order
        amounts = [20 ether, 40 ether, 60 ether];
        periods = [86400, 172800, 259200]; // 一天
        permitStage(issuer, worker, amounts, periods, "Due", ""); // 阶段划分
        modifyOrder(issuer, 1, zero, 120 ether); //修改總金額
        payOrder(issuer, 120 ether, zero); // 付款
        assertEq(address(issuer).balance, 880 ether);
        vm.warp(0); //初始化时间
        startOrder(issuer); // 开始任务
        vm.warp(388800); //时间过了3天
        abortOrder(issuer, 1);
        assertEq(address(issuer).balance, 910 ether); //项目结束甲方余额
        assertEq(address(worker).balance, 85.5 ether); //项目结束乙方余额
        // console2.log('____________________________________');//打印账户的余额
        // console2.log(address(issuer).balance);//打印账户的余额
        // console2.log(address(worker).balance);
        // console2.log(address(_weth).balance);
        // console2.log(address(issuer).balance+address(worker).balance+address(_weth).balance+address(owner).balance);
    }

    //多阶段due模式，前两阶段已完成下，乙方中断任务，剛過第三階段中段
    function testMoreDueWorkerAbortOrder() public {
        createOrder(issuer, address(0), 100 ether); // 创建Order
        amounts = [20 ether, 40 ether, 60 ether];
        periods = [86400, 172800, 259200]; // 一天
        permitStage(issuer, worker, amounts, periods, "Due", ""); // 阶段划分
        modifyOrder(issuer, 1, zero, 120 ether); //修改總金額
        payOrder(issuer, 120 ether, zero); // 付款
        assertEq(address(issuer).balance, 880 ether);
        vm.warp(0); //初始化时间
        startOrder(issuer); // 开始任务
        vm.warp(388800); //时间过了3天
        abortOrder(worker, 1);
        assertEq(address(issuer).balance, 940 ether); //项目结束甲方余额
        assertEq(address(worker).balance, 57 ether); //项目结束乙方余额
    }

    //多階段Confirm前两阶段已完成下，甲方中断任务，剛過第三階段中段
    function testMoreConfirmIusserAbortOrder() public {
        createOrder(issuer, address(0), 100 ether); // 创建Order
        amounts = [20 ether, 40 ether, 60 ether];
        periods = [86400, 172800, 259200]; // 一天
        permitStage(issuer, worker, amounts, periods, "Confirm", ""); // 阶段划分
        modifyOrder(issuer, 1, zero, 120 ether); //修改總金額
        payOrder(issuer, 120 ether, zero); // 付款
        assertEq(address(issuer).balance, 880 ether);
        vm.warp(0); //初始化时间
        startOrder(issuer); // 开始任务
        stageIndexs = [0, 1];
        confirmDelivery(issuer, 1, stageIndexs);
        vm.warp(388800); //时间过了3天
        abortOrder(issuer, 1);
        assertEq(address(issuer).balance, 940 ether); //项目结束甲方余额
        assertEq(address(worker).balance, 57 ether); //项目结束乙方余额
    }

    //多階段Confirm前两阶段已完成下，乙方中断任务，剛過第三階段中段
    function testMoreConfirmWorkerAbortOrder() public {
        createOrder(issuer, address(0), 100 ether); // 创建Order
        amounts = [20 ether, 40 ether, 60 ether];
        periods = [86400, 172800, 259200]; // 一天
        permitStage(issuer, worker, amounts, periods, "Confirm", ""); // 阶段划分
        modifyOrder(issuer, 1, zero, 120 ether); //修改總金額
        payOrder(issuer, 120 ether, zero); // 付款
        assertEq(address(issuer).balance, 880 ether);
        vm.warp(0); //初始化时间
        startOrder(issuer); // 开始任务
        stageIndexs = [0, 1];
        confirmDelivery(worker, 1, stageIndexs);
        vm.warp(388800); //时间过了3天
        abortOrder(issuer, 1);
        assertEq(address(issuer).balance, 940 ether); //项目结束甲方余额
        assertEq(address(worker).balance, 57 ether); //项目结束乙方余额
    }

    //1個階段劃分，甲方增加階段劃分，甲方終止任務
    function testMoreDueIusserAbortOrder() public {
        createOrder(issuer, address(0), 100 ether); // 创建Order
        amounts = [20 ether, 40 ether, 60 ether];
        periods = [86400, 172800, 259200]; // 一天
        permitStage(issuer, worker, amounts, periods, "Confirm", ""); // 阶段划分
        modifyOrder(issuer, 1, zero, 120 ether); //修改總金額
        payOrder(issuer, 120 ether, zero); // 付款
        assertEq(address(issuer).balance, 880 ether);
        vm.warp(0); //初始化时间
        startOrder(issuer); // 开始任务
        stageIndexs = [0, 1];
        confirmDelivery(worker, 1, stageIndexs);
        vm.warp(388800); //时间过了3天
        abortOrder(issuer, 1);
        assertEq(address(issuer).balance, 940 ether); //项目结束甲方余额
        assertEq(address(worker).balance, 57 ether); //项目结束乙方余额
    }
    //1個階段劃分，甲方增加階段劃分，乙方終止任務
    //1個階段劃分，甲方增加階段劃分，甲方終止任務
}
