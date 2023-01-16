// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {DeOrderTest} from "./Deorder.t.sol";
import "contracts/interface/IOrder.sol";
import "forge-std/console2.sol";

contract Refund is DeOrderTest {
    uint[] _stageIndexs = [0];
    // 测试项目超时自动验收后甲乙双方正常取款和退款（没有测超时后项目的状态）
    function testRefundByTimeOutGetNormal() public {
        vm.deal(owner, 0 ether); // 初始化原生币余额
        console2.log(address(owner).balance);

        createOrder(issuer, address(0), 100 ether); // 创建Order
        amounts = [100 ether];//100块
        periods = [172800]; // 两天
        permitStage(issuer, worker, amounts, periods, "Due", ""); // 阶段划分
        payOrder(issuer, 101 ether, zero); // 付款
        assertEq(address(issuer).balance, 899 ether); //项目甲方余额
        vm.warp(0);//初始化时间
        startOrder(issuer); // 开始任务
        vm.warp(172801);

        Order memory getordermsg=deOrder.getOrder(1);
        // vm.expectRevert(bytes(""));

        // assertEq(getordermsg.progress, OrderProgess.Done);
        vm.startPrank(issuer);//甲方提钱
        // Order memory getordermsg=deOrder.getOrder(1);
        deOrder.refund(1, issuer, 1 ether);
        vm.stopPrank();
        vm.startPrank(worker);//乙方提钱
        deOrder.withdraw(1,worker);
        vm.stopPrank();

        console2.log(address(issuer).balance);
        console2.log(address(worker).balance);
        console2.log(address(_weth).balance);
        console2.log(address(owner).balance);


    }

    // 测试项目超时自动验收后甲方多退退款
    function testRefundByTimeOutGetBigger() public {
        vm.deal(owner, 0 ether); // 初始化原生币余额
        console2.log(address(owner).balance);

        createOrder(issuer, address(0), 100 ether); // 创建Order
        amounts = [100 ether];//100块
        periods = [172800]; // 两天
        permitStage(issuer, worker, amounts, periods, "Due", ""); // 阶段划分
        payOrder(issuer, 101 ether, zero); // 付款
        assertEq(address(issuer).balance, 899 ether); //项目甲方余额
        vm.warp(0);//初始化时间
        startOrder(issuer); // 开始任务

        vm.warp(172801);//设置超时
        vm.startPrank(issuer);//甲方提钱
        // Order memory getordermsg=deOrder.getOrder(1);
        vm.expectRevert(abi.encodeWithSignature("AmountError(uint256)",1));
        deOrder.refund(1, issuer, 2 ether);
        vm.stopPrank();
        vm.startPrank(worker);//乙方提钱
        deOrder.withdraw(1,worker);
        vm.stopPrank();
        Order memory getordermsg=deOrder.getOrder(1);
        
        // console2.log(getordermsg.progress);

        console2.log(address(issuer).balance);
        console2.log(address(worker).balance);
        console2.log(address(_weth).balance);
        console2.log(address(owner).balance);
    }

    // 测试项目甲方验收后甲乙双方正常取款和退款
    function testRefundByConfirmDeliveryGetNormal() public {
        vm.deal(owner, 0 ether); // 初始化原生币余额
        console2.log(address(owner).balance);

        createOrder(issuer, address(0), 100 ether); // 创建Order
        amounts = [100 ether];//100块
        periods = [172800]; // 两天
        permitStage(issuer, worker, amounts, periods, "Due", ""); // 阶段划分
        payOrder(issuer, 101 ether, zero); // 付款
        assertEq(address(issuer).balance, 899 ether); //项目甲方余额
        vm.warp(0);//初始化时间
        startOrder(issuer); // 开始任务
        
        vm.startPrank(issuer);//甲方提钱
        // Order memory getordermsg=deOrder.getOrder(1);
        deOrder.confirmDelivery(1, _stageIndexs);
        deOrder.refund(1, issuer, 1 ether);
        vm.stopPrank();

        vm.startPrank(worker);//乙方提钱
        deOrder.withdraw(1,worker);
        vm.stopPrank();
        Order memory getordermsg=deOrder.getOrder(1);
        
        // console2.log(getordermsg.progress);

        console2.log(address(issuer).balance);
        console2.log(address(worker).balance);
        console2.log(address(_weth).balance);
        console2.log(address(owner).balance);
    }
    
    // 测试项目甲方验收后甲方多退款
    function testRefundByConfirmDeliveryGetBigger() public {
        vm.deal(owner, 0 ether); // 初始化原生币余额
        console2.log(address(owner).balance);

        createOrder(issuer, address(0), 100 ether); // 创建Order
        amounts = [100 ether];//100块
        periods = [172800]; // 两天
        permitStage(issuer, worker, amounts, periods, "Due", ""); // 阶段划分
        payOrder(issuer, 101 ether, zero); // 付款
        assertEq(address(issuer).balance, 899 ether); //项目甲方余额
        vm.warp(0);//初始化时间
        startOrder(issuer); // 开始任务
        
        vm.startPrank(issuer);//甲方提钱
        // Order memory getordermsg=deOrder.getOrder(1);
        deOrder.confirmDelivery(1, _stageIndexs);
        deOrder.refund(1, issuer, 1 ether);
        vm.stopPrank();

        vm.startPrank(worker);//乙方提钱
        deOrder.withdraw(1,worker);
        vm.stopPrank();
        Order memory getordermsg=deOrder.getOrder(1);
        
        // console2.log(getordermsg.progress);

        console2.log(address(issuer).balance);
        console2.log(address(worker).balance);
        console2.log(address(_weth).balance);
        console2.log(address(owner).balance);
    }

    // 测试甲方项目验收

    }
