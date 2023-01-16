// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/console2.sol";
import {DeOrderTest} from "./Deorder.t.sol";

contract AbortOrder is DeOrderTest {
    // testCannotAbortOrder
    // @Summary 中止任务失败情况
    // function testCannotAbortOrder() public {
    //     createOrder(); // 创建Order
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
    //     createOrder(); // 创建Order
    //     permitStage(issuer, worker, "Due", ""); // 阶段划分
    //     payOrder(issuer, 100, zero); // 付款
    //     startOrder(issuer); // 开始任务
    //     // 中止任务 已经完成的阶段和预付款 付款给乙方
    //     abortOrder(worker, 1);
    // }

    //按期付款，设置100块，时间1000s，一个阶段划分的order，issuer在时间一半的时候中止任务
    function test100r() public {
        createOrder(); // 创建Order
        // 状态不在Ongoing

        permitStage(issuer, worker, "Due", ""); // 阶段划分
        payOrder(issuer, 100 ether, zero); // 付款
        startOrder(issuer); // 开始任务

        vm.warp(100);//增加500s
        abortOrder(issuer, 1);
        
        assertEq(address(issuer).balance, 990.1 ether); 
        assertEq(address(worker).balance, 9.9 ether);
        
        console2.log(address(issuer).balance);
        console2.log(address(worker).balance);
        console2.log(address(_weth).balance);
        // assertEq(address(owner).balance, 1);

    }
    function testCannotDueIusserAbortOrder() public {
        createOrder(); // 创建Order
        // 状态不在Ongoing

        permitStage(issuer, worker, "Due", ""); // 阶段划分
        payOrder(issuer, 100 ether, zero); // 付款
        startOrder(issuer); // 开始任务

        vm.warp(300);//增加500s
        abortOrder(issuer, 1);
        
        assertEq(address(issuer).balance, 970.1 ether); 
        assertEq(address(worker).balance, 29.9 ether);
        
        console2.log(address(issuer).balance);
        console2.log(address(worker).balance);
        console2.log(address(_weth).balance);
        // assertEq(address(owner).balance, 1);

    }

    // //按期付款一个阶段划分的order，worker在时间一半的时候中止任务
    // function testCannotConfirmWorkerAbortOrder() public {
    //     createOrder(); // 创建Order
    //     // 状态不在Ongoing

    //     permitStage(issuer, worker, "Confirm", ""); // 阶段划分
    //     payOrder(issuer, 100, zero); // 付款
    //     startOrder(issuer); // 开始任务

    //     vm.warp(500);//增加500s
    //     abortOrder(worker, 1);
    //     assertEq(address(issuer).balance, 1000); 
    //     assertEq(address(worker).balance, 0);
    // }
    //验收模式一个阶段划分的order，issuer在时间一半时候中止任务
    // function testCannotDueIusserAbortOrder() public {
    //     createOrder(); // 创建Order
    //     // 状态不在Ongoing

    //     permitStage(issuer, worker, "Confirm", ""); // 阶段划分
    //     payOrder(issuer, 100, zero); // 付款
    //     startOrder(issuer); // 开始任务

    //     vm.warp(500);//增加500s
    //     abortOrder(iusser, 1);
    //     assertEq(address(issuer).balance, 1000); 
    //     assertEq(address(worker).balance, 0);
    // }

}
