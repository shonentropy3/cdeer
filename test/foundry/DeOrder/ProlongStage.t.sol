// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "contracts/libs/ECDSA.sol";
import {DeOrderTest} from "./DeOrder.t.sol";

contract ProlongStage is DeOrderTest {
    // testCannotProlongStage
    // @Summary 延长阶段失败情况
    function testCannotProlongStage() public {
        createOrder(); // 创建Order
        permitStage(worker, issuer, "Confirm", ""); // 许可阶段划分
        uint256 _orderId = 1;
        uint256 _stageIndex = 0;
        uint256 _appendPeriod = 10;
        uint256 nonce = 0;
        uint256 deadline = 200;
        bytes32 structHash = keccak256(
            abi.encode(
                _verifier.PERMITPROSTAGE_TYPEHASH(),
                _orderId,
                _stageIndex,
                _appendPeriod,
                nonce,
                deadline
            )
        );
        bytes32 digest = ECDSA.toTypedDataHash(
            _verifier.DOMAIN_SEPARATOR(),
            structHash
        );
        // 甲方签名
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(1, digest);
        // 乙方调用
        vm.startPrank(worker);
        // 任务不在进行中
        vm.expectRevert(abi.encodeWithSignature("ProgressError()"));
        deOrder.prolongStage(
            _orderId,
            _stageIndex,
            _appendPeriod,
            nonce,
            deadline,
            v,
            r,
            s
        );
        vm.stopPrank();
        // TODO:任务进行中
    }

    // testProlongStage
    // @Summary 延长阶段
    function testProlongStage() public {
        createOrder(); // 创建Order
        permitStage(worker, issuer, "Due", ""); // 阶段划分
        payOrder(issuer, 100, zero); // 支付
        startOrder(issuer); // 开始任务
        uint256 _orderId = 1;
        uint256 _stageIndex = 0;
        uint256 _appendPeriod = 10;
        uint256 nonce = 0;
        uint256 deadline = 200;
        bytes32 structHash = keccak256(
            abi.encode(
                _verifier.PERMITPROSTAGE_TYPEHASH(),
                _orderId,
                _stageIndex,
                _appendPeriod,
                nonce,
                deadline
            )
        );
        bytes32 digest = ECDSA.toTypedDataHash(
            _verifier.DOMAIN_SEPARATOR(),
            structHash
        );
        // 甲方签名
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(1, digest);
        // 乙方调用
        vm.startPrank(worker);
        deOrder.prolongStage(
            _orderId,
            _stageIndex,
            _appendPeriod,
            nonce,
            deadline,
            v,
            r,
            s
        );
        vm.stopPrank();
    }
}
