// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "contracts/interface/IOrder.sol";
import {DeOrderTest} from "./DeOrder.t.sol";

contract CreateOrder is DeOrderTest {
    // testCannotCreateOrder
    // @Summary 创建Order失败情况
    function testCannotCreateOrder() public {
        // issuer address is 0
        vm.expectRevert(abi.encodeWithSignature("ParamError()"));
        deOrder.createOrder(1, address(0), worker, address(0), 1);
        // worker address is 0
        vm.expectRevert(abi.encodeWithSignature("ParamError()"));
        deOrder.createOrder(1, issuer, address(0), address(0), 1);
        // issuer == worker
        vm.expectRevert(abi.encodeWithSignature("ParamError()"));
        deOrder.createOrder(1, issuer, issuer, address(0), 1);
        // 不允许的币种
        vm.expectRevert(abi.encodeWithSignature("UnSupportToken()"));
        deOrder.createOrder(
            1,
            issuer,
            worker,
            address(0x69BB456f9181C798f6B31149004a5A1ADfAd241B),
            1
        );
        
    }

    // testCreateOrder
    // @Summary 测试创建Order
    function testCreateOrder() public {
        Order memory order;
        // 甲方创建Task ，只能甲方创建此Task的Order
        createOrder(); // 创建Order
        order = deOrder.getOrder(1);
        assertEq(order.issuer, issuer);
        assertEq(order.worker, worker);
        assertEq(order.token, address(0));
        assertEq(order.amount, 100);
        assertTrue(order.payType == PaymentType.Unknown);
        assertTrue(order.progress == OrderProgess.Init);
        assertEq(order.startDate, 0);
        assertEq(order.payed, 0);
        // amount最大值
        deOrder.createOrder(1, issuer, worker, address(0), 2 ** 96 - 1);
        order = deOrder.getOrder(2); // ID 为2
        assertEq(order.amount, 2 ** 96 - 1);
    }
}
