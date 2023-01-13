// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {DeOrderTest} from "./Deorder.t.sol";

contract AbortOrder is DeOrderTest {
    // testCannotAbortOrder
    // @Summary 中止任务失败情况
    function testCannotAbortOrder() public {
        createOrder(); // 创建Order
        // 状态不在Ongoing
        vm.expectRevert(abi.encodeWithSignature("ProgressError()"));
        abortOrder(issuer, 1); // 中止任务
        permitStage(issuer, worker, "Due", ""); // 阶段划分
        payOrder(issuer, 100, zero); // 付款
        startOrder(issuer); // 开始任务
        // 其它人调用合约中止
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        abortOrder(other, 1);
    }

    // testCannotAbortOrder
    // @Summary 中止任务失败情况
    function testAbortOrder() public {
        createOrder(); // 创建Order
        permitStage(issuer, worker, "Due", ""); // 阶段划分
        payOrder(issuer, 100, zero); // 付款
        startOrder(issuer); // 开始任务
        // 中止任务 已经完成的阶段和预付款 付款给乙方
        abortOrder(worker, 1);
    }
}
