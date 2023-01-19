// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/console2.sol";
import "contracts/interface/IOrder.sol";
import {DeOrderTest} from "./DeOrder.t.sol";

contract FeeToTest is DeOrderTest {
    function setFeeTo(address who, uint _fee, address _feeTo) public {
        vm.startPrank(who);
        deOrder.setFeeTo(_fee, _feeTo);
        vm.stopPrank();
    }

    function testSetFeeToAbortDone() public {
        // 设置1%手续费
        assertEq(deOrder.fee(), 500);
        assertEq(deOrder.feeTo(), owner);
        setFeeTo(owner, 100, address(other));
        assertEq(deOrder.fee(), 100);
        assertEq(deOrder.feeTo(), other);
        // 项目中止
        uint256 balanceOfIssuer = issuer.balance; // 甲方余额
        uint256 balanceOfWorker = worker.balance; //
        createOrder(issuer, address(0), 100 ether); // 创建Order
        amounts = [100 ether];
        periods = [86400]; // 一天
        permitStage(issuer, worker, amounts, periods, "Due", ""); // 阶段划分
        payOrder(issuer, 100 ether, zero); // 付款
        vm.warp(0); //初始化时间
        startOrder(issuer); // 开始任务
        vm.warp(8640); //时间过了1/10天
        abortOrder(issuer, 1);
        assertEq(issuer.balance, balanceOfIssuer - 10 ether); //项目结束甲方余额
        assertEq(worker.balance, balanceOfWorker + 9.9 ether); //项目结束乙方余额
        assertEq(other.balance, 0.1 ether); //项目结束手续费接受者余额
    }

    function testSetFeeToOrderDone() public {
        // 设置1%手续费
        assertEq(deOrder.fee(), 500);
        assertEq(deOrder.feeTo(), owner);
        setFeeTo(owner, 100, address(other));
        assertEq(deOrder.fee(), 100);
        assertEq(deOrder.feeTo(), other);
        // 项目完成
        uint256 balanceOfIssuer = issuer.balance; // 甲方余额
        uint256 balanceOfWorker = worker.balance; //
        createOrder(issuer, address(0), 100 ether); // 创建Order
        amounts = [100 ether];
        periods = [86400]; // 一天
        permitStage(issuer, worker, amounts, periods, "Due", ""); // 阶段划分
        payOrder(issuer, 100 ether, zero); // 付款
        vm.warp(0); //初始化时间
        startOrder(issuer); // 开始任务
        vm.warp(864000); //时间过
        withdraw(worker, 1, worker);
        assertEq(issuer.balance, balanceOfIssuer - 100 ether); //项目结束甲方余额
        assertEq(worker.balance, balanceOfWorker + 99 ether); //项目结束乙方余额
        assertEq(other.balance, 1 ether); //项目结束手续费接受者余额
    }

    function testSetFeeToAbortDoneALL() public {
        // 设置1%手续费
        assertEq(deOrder.fee(), 500);
        assertEq(deOrder.feeTo(), owner);
        setFeeTo(owner, 10000, address(other));
        assertEq(deOrder.fee(), 10000);
        assertEq(deOrder.feeTo(), other);
        // 项目中止
        uint256 balanceOfIssuer = issuer.balance; // 甲方余额
        uint256 balanceOfWorker = worker.balance; //
        createOrder(issuer, address(0), 100 ether); // 创建Order
        amounts = [100 ether];
        periods = [86400]; // 一天
        permitStage(issuer, worker, amounts, periods, "Due", ""); // 阶段划分
        payOrder(issuer, 100 ether, zero); // 付款
        vm.warp(0); //初始化时间
        startOrder(issuer); // 开始任务
        vm.warp(8640); //时间过了1/10天
        abortOrder(issuer, 1);
        assertEq(issuer.balance, balanceOfIssuer - 10 ether); //项目结束甲方余额
        assertEq(worker.balance, balanceOfWorker); //项目结束乙方余额
        assertEq(other.balance, 10 ether); //项目结束手续费接受者余额
    }

    function testCannotSetFeeTo() public {
        vm.expectRevert(abi.encodeWithSignature("Ownable: caller is not the owner"));
        setFeeTo(issuer, 100, address(issuer));
    }
}
