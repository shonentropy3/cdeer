// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "contracts/DeStage.sol";
import "contracts/interface/IOrder.sol";
import "contracts/libs/ECDSA.sol";
import {DeOrderTest} from "./DeOrder.t.sol";

contract PermitStage is DeOrderTest {
    // testPermitStage
    // @Summary 阶段划分
    function testPermitStage() public {
        createOrder(issuer, address(0), 100); // 创建Order
        // 甲方签名 乙方提交
        amounts = [100];
        periods = [1000];
        permitStage(issuer, worker, amounts, periods, "Due", "");
        Order memory order = deOrder.getOrder(1);
        DeStage.Stage[] memory stages = deStage.getStages(1);
        assertTrue(order.progress == OrderProgess.Staged);
        assertEq(stages[0].amount, 100);
        assertEq(stages[0].period, 1000);
        assertTrue(order.payType == PaymentType.Due); // 付款模式
    }

    // testPermitStage
    // @Summary 阶段划分
    function testPermitStage2() public {
        createOrder(issuer, address(0), 100); // 创建Order
        amounts = [100];
        periods = [1000];
        // 乙方签名 甲方提交
        permitStage(worker, issuer, amounts, periods, "Confirm", "");
        Order memory order = deOrder.getOrder(1);
        DeStage.Stage[] memory stages = deStage.getStages(1);
        assertTrue(order.progress == OrderProgess.Staged);
        assertEq(stages[0].amount, 100);
        assertEq(stages[0].period, 1000);
        assertTrue(order.payType == PaymentType.Confirm); // 付款模式
    }

    // testCannotPermitStage
    // @Summary 许可阶段划分失败情况
    function testCannotPermitStage() public {
        createOrder(issuer, address(0), 100); // 创建Order
        // 甲方签名 && 甲方提交
        permitStage(
            issuer,
            issuer,
            amounts,
            periods,
            "Due",
            enFunc("PermissionsError()")
        );
        // 乙方签名 && 乙方提交
        permitStage(
            worker,
            worker,
            amounts,
            periods,
            "Due",
            enFunc("PermissionsError()")
        );
        // 乙方签名 && 其它人提交
        permitStage(
            worker,
            other,
            amounts,
            periods,
            "Due",
            enFunc("PermissionsError()")
        );
        // 其它人签名 && 乙方提交
        permitStage(
            other,
            worker,
            amounts,
            periods,
            "Due",
            enFunc("PermissionsError()")
        );
        // 其它人签名 && 另一个其他人提交
        permitStage(
            owner,
            other,
            amounts,
            periods,
            "Due",
            enFunc("PermissionsError()")
        );
        // 使用过期deadline调用失败
        vm.warp(202);
        permitStage(
            worker,
            issuer,
            amounts,
            periods,
            "Due",
            enFunc("Expired()")
        );
        vm.warp(0);
        // 任务已经开始 提交
        permitStage(worker, issuer, amounts, periods, "Due", ""); // 正常划分阶段
        payOrder(issuer, 100, zero); // 付款
        startOrder(issuer); // 开始任务
        permitStage(
            worker,
            issuer,
            amounts,
            periods,
            "Due",
            enFunc("ProgressError()")
        );
    }

    // memory _amounts与memory _periods数组不一致调用失败
    function testCannotPermitStageWithArrayErr() public {
        createOrder(issuer, address(0), 100); // 创建Order
        amounts = [100];
        periods = [100, 900];

        permitStage(
            worker,
            issuer,
            amounts,
            periods,
            "Due",
            abi.encodeWithSignature("ParamError(uint256)", 0)
        );
    }

    // nonce 使用已使用过的 nonce 或不存在的 nonce 调用失败
    function testCannotPermitStageWithErrNonce() public {
        createOrder(issuer, address(0), 100); // 创建Order
        uint256 _orderId = 1;
        amounts = [100];
        periods = [1000];
        // 使用不存在的nonce
        uint256 nonce = 13;
        uint256 deadline = 200;
        bytes32 structHash = keccak256(
            abi.encode(
                _verifier.PERMITSTAGE_TYPEHASH(),
                _orderId,
                keccak256(abi.encodePacked(amounts)),
                keccak256(abi.encodePacked(periods)),
                PaymentType.Confirm,
                nonce,
                deadline
            )
        );
        bytes32 digest = ECDSA.toTypedDataHash(
            _verifier.DOMAIN_SEPARATOR(),
            structHash
        );
        // 签名
        uint8 v;
        bytes32 r;
        bytes32 s;
        (v, r, s) = vm.sign(2, digest);
        vm.startPrank(issuer);
        vm.expectRevert(abi.encodeWithSignature("NonceError()"));
        deOrder.permitStage(
            _orderId,
            amounts,
            periods,
            PaymentType.Confirm,
            nonce,
            deadline,
            v,
            r,
            s
        );
        vm.stopPrank();
        // 使用已使用的Nonce
        permitStage(worker, issuer, amounts, periods, "Due", "");
        nonce = 0;
        structHash = keccak256(
            abi.encode(
                _verifier.PERMITSTAGE_TYPEHASH(),
                _orderId,
                keccak256(abi.encodePacked(amounts)),
                keccak256(abi.encodePacked(periods)),
                PaymentType.Confirm,
                nonce,
                deadline
            )
        );
        digest = ECDSA.toTypedDataHash(
            _verifier.DOMAIN_SEPARATOR(),
            structHash
        );
        // 签名
        (v, r, s) = vm.sign(2, digest);
        vm.startPrank(issuer);
        vm.expectRevert(abi.encodeWithSignature("NonceError()"));
        deOrder.permitStage(
            _orderId,
            amounts,
            periods,
            PaymentType.Confirm,
            nonce,
            deadline,
            v,
            r,
            s
        );
        vm.stopPrank();
    }
}
