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
        amounts = [100 ether];//100块
        periods = [172800]; // 两天
        permitStage(issuer, worker,amounts,periods, "Due", ""); // 阶段划分
        payOrder(issuer, 100 ether, zero); // 付款
        assertEq(address(issuer).balance, 900 ether); //项目甲方余额
        vm.warp(0);//初始化时间
        startOrder(issuer); // 开始任务
        vm.warp(17280*5);//增加17280s
        abortOrder(issuer, 1);//issuer中止任务
        assertEq(address(issuer).balance, 950 ether); //项目结束甲方余额
        assertEq(address(worker).balance, 47.5 ether);//项目结束乙方余额
        
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
        permitStage(issuer, worker,amounts,periods, "Due", ""); // 阶段划分
        payOrder(issuer, 100 ether, zero); // 付款
        assertEq(address(issuer).balance, 900 ether); 
        startOrder(issuer); // 开始任务
        vm.warp(17280);//增加500s
        abortOrder(worker, 1);
        assertEq(address(issuer).balance, 1000 ether); 
        assertEq(address(worker).balance, 0 ether);

    }

    //验收模式一个阶段划分的order，issuer在时间一半时候中止任务
    function testCannotConfirmIusserAbortOrder() public {
        createOrder(issuer, address(0), 100 ether); // 创建Order
        // 状态不在Ongoing
        permitStage(issuer, worker,amounts,periods, "Confirm", ""); // 阶段划分
        payOrder(issuer, 100 ether, zero); // 付款
        vm.warp(0);//创造开始时间为0
        startOrder(issuer); // 开始任务

        vm.warp(17280);//增加17280s
        abortOrder(issuer, 1);
        // assertEq(address(issuer).balance, 990 ether); 
        // assertEq(address(worker).balance, 9.5 ether);
        console2.log(address(issuer).balance);//打印账户的余额
        console2.log(address(worker).balance);
        console2.log(address(_weth).balance);
    }
    function testCannotConfirmWorkerAbortOrder() public {
        createOrder(issuer, address(0), 100 ether); // 创建Order
        // 状态不在Ongoing
        permitStage(issuer, worker,amounts,periods, "Confirm", ""); // 阶段划分
        payOrder(issuer, 100 ether, zero); // 付款
        vm.warp(0);//初始化时间为0
        startOrder(issuer); // 开始任务

        vm.warp(17280);//增加17280s
        abortOrder(worker, 1);
        // assertEq(address(issuer).balance, 990 ether); 
        // assertEq(address(worker).balance, 9.5 ether);
        console2.log(address(issuer).balance);//打印账户的余额
        console2.log(address(worker).balance);
        console2.log(address(_weth).balance);
    }
}
