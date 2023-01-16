// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {DeOrderTest} from "./DeOrder.t.sol";

contract AppendStage is DeOrderTest {
    //testCannotAppendStage
    // @Summary 添加阶段失败情况
    function testCannotAppendStage() public {
        createOrder(); // 创建Order
        permitStage(worker, issuer, "Confirm", ""); // 许可阶段划分
        // 任务不在进行中
        // vm.expectRevert(abi.encodeWithSignature("ProgressError()"));
        appendStage(issuer, worker, "ProgressError()");
        // deOrder.appendStage(_orderId, amount, period, nonce, deadline, v, r, s);
    }

    // testAppendStage
    // @Summary 测试添加阶段
    function testAppendStage() public {
        createOrder(); // 创建Order
        permitStage(worker, issuer, "Due", ""); // 阶段划分
        payOrder(issuer, 100, zero); // 支付
        startOrder(issuer); // 开始任务

        payOrder(issuer, 10, zero); // 支付
        appendStage(worker, issuer, "");
    }
}
