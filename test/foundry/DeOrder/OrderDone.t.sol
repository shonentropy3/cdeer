// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "contracts/interface/IOrder.sol";
import "forge-std/console2.sol";
import {DeOrderTest} from "./DeOrder.t.sol";

contract OrderDoneTest is DeOrderTest {
    function testDoneOrder() public {
        uint256 balanceOfIssuer = issuer.balance; // 甲方余额
        uint256 balanceOfWorker = worker.balance; //
        createOrder(issuer, address(0), 50 ether); // 创建Order
        amounts = [50 ether];
        periods = [1000];
        permitStage(issuer, worker, 1, amounts, periods, "Due", ""); // 阶段划分
        payOrder(issuer, 100 ether, zero); // 付款
        assertEq(issuer.balance, balanceOfIssuer - 100 ether);
        assertEq(worker.balance, balanceOfWorker);
        vm.warp(0);
        startOrder(issuer); // 开始任务
        vm.warp(100000);
        withdraw(worker, 1, worker); //提款
        refund(issuer, 1, issuer, 50 ether);
        assertEq(issuer.balance, balanceOfIssuer - 50 ether);
        assertEq(worker.balance, balanceOfWorker + 47.5 ether);
    }
}
