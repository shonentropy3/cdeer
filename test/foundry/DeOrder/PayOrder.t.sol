// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "contracts/interface/IOrder.sol";
import {IPermit2} from "contracts/interface/IPermit2.sol";
import {DeOrderTest} from "./Deorder.t.sol";

contract PayOrder is DeOrderTest {
    // testPayOrder
    // @Summary 付款
    function testPayOrder() public {
        // 甲方付款
        payOrder(issuer, 1, zero);
        Order memory order = deOrder.getOrder(1);
    }

    // payOrderWithPermit2
    // @Summary 使用Permit2付款
    function payOrderWithPermit2(address who, uint256 amount) public {
        uint256 nonce = 0;
        IPermit2.PermitTransferFrom memory permit = defaultERC20PermitTransfer(
            address(token0),
            nonce
        );
        // 签名数据
        bytes memory sig = getPermitTransferSignature(
            permit,
            DOMAIN_SEPARATOR,
            address(deOrder)
        );
        vm.startPrank(who);
        deOrder.payOrderWithPermit2(1, amount, permit, sig);
        vm.stopPrank();
    }

    // testPayOrderWithPermit2
    // @Summary 测试使用Permit2付款
    function testPayOrderWithPermit2() public {
        vm.startPrank(owner);
        deOrder.setSupportToken(address(token0), true);
        vm.stopPrank();
        // 创建Order
        vm.startPrank(issuer); // 甲方
        deOrder.createOrder(64, issuer, worker, address(token0), 100);
        vm.stopPrank();
        // console.log(deOrder.supportTokens(address(token0)));
        // 甲方付款
        payOrderWithPermit2(issuer, 100);
        Order memory order = deOrder.getOrder(1);
        assertEq(order.payed, 100);
    }
}
