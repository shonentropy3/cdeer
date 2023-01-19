// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "contracts/DeStage.sol";
import {DeOrderTest} from "./DeOrder.t.sol";

contract Common is DeOrderTest {
    // testUpdateAttachment 上传附件
    function testUpdateAttachment() public {
        createOrder(issuer, address(0), 100); // 创建Order
        permitStage(worker, issuer, amounts, periods, "Due", ""); // 阶段划分
        payOrder(issuer, 100, zero); // 支付
        startOrder(issuer); // 开始任务
        updateAttachment(
            worker,
            1,
            "Qmbjig3cZbUUufWqCEFzyCppqdnmQj3RoDjJWomnqYGy1f",
            ""
        );
    }

    // testUpdateAttachment 上传附件失败情况
    function testCannotUpdateAttachment() public {
        // orderID为空或其他的orderID调用失败
        updateAttachment(
            worker,
            1,
            "Qmbjig3cZbUUufWqCEFzyCppqdnmQj3RoDjJWomnqYGy1f",
            enFunc("PermissionsError()")
        );

        createOrder(issuer, address(0), 100); // 创建Order
        permitStage(worker, issuer, amounts, periods, "Due", ""); // 阶段划分
        payOrder(issuer, 100, zero); // 支付
        startOrder(issuer); // 开始任务
        updateAttachment(
            other,
            1,
            "Qmbjig3cZbUUufWqCEFzyCppqdnmQj3RoDjJWomnqYGy1f",
            enFunc("PermissionsError()")
        );
    }

    // testsetSupportToken 设置支持的Token
    function testsetSupportToken() public {
        assertEq(deOrder.supportTokens(address(token0)), false);
        setSupportToken(owner, address(token0), true); //设置支持的Token
        assertEq(deOrder.supportTokens(address(token0)), true);
    }

    // testCannotsetSupportToken 设置支持的Token失败情况
    function testCannotsetSupportToken() public {
        vm.startPrank(issuer);
        vm.expectRevert("Ownable: caller is not the owner");
        deOrder.setSupportToken(address(token0), true); //设置支持的Token
        vm.stopPrank();
    }

    function testSetSBT() public {
        // 非合约创建者调用
        vm.startPrank(other);
        vm.expectRevert("Ownable: caller is not the owner");
        deOrder.setSBT(address(token0), address(permit2));
        vm.stopPrank();
        // 正常调用
        vm.startPrank(owner);
        deOrder.setSBT(address(token0), address(permit2));
        assertEq(deOrder.builderSBT(), address(token0));
        assertEq(deOrder.issuerSBT(), address(permit2));
        vm.stopPrank();
    }

    function testSetDeStage() public {
        // 非合约创建者调用
        vm.startPrank(other);
        vm.expectRevert("Ownable: caller is not the owner");
        deOrder.setDeStage(address(token0));
        vm.stopPrank();
        // 正常调用
        vm.startPrank(owner);
        deOrder.setDeStage(address(token0));
        assertEq(deOrder.stage(), address(token0));
        vm.stopPrank();
    }

    function testSetFeeTo() public {
        // 非合约创建者调用
        vm.startPrank(other);
        vm.expectRevert("Ownable: caller is not the owner");
        deOrder.setFeeTo(100, address(issuer)); // %100块
        vm.stopPrank();
        // 正常调用
        vm.startPrank(owner);
        deOrder.setFeeTo(100, address(issuer)); // %100块
        assertEq(deOrder.fee(), 100);
        assertEq(deOrder.feeTo(), address(issuer));
        vm.stopPrank();
    }

    function testTransferOwnership()public{
        vm.expectRevert("Ownable: caller is not the owner");
        deOrder.transferOwnership(issuer);
        vm.startPrank(owner);
        deOrder.transferOwnership(issuer);
        vm.stopPrank();
        assertEq(deOrder.owner(),issuer);
    }
}
