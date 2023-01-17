// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "./multicall.t.sol";

contract WithdrawMulticallTest is MulticallTest {
    // testMulticallPayOrderWithToken Multicall调用多次付款Token
    function testFailMulticallWithdraw() public {
        createOrder(issuer, address(0), 100); // 创建Order
        vm.deal(address(_weth), 1 ether); // 初始化原生币余额
        permitStage(worker, issuer, amounts, periods, "Due", ""); // 阶段划分
        payOrder(issuer, 100, zero); // 支付
        startOrder(issuer); // 开始任务
        stageIndexs = [0, 1];
        confirmDelivery(issuer, 1, stageIndexs);

        bytes[] memory data = new bytes[](2);
        data[0] = abi.encodeWithSelector(deOrder.withdraw.selector, 1, worker);
        data[1] = abi.encodeWithSelector(deOrder.withdraw.selector, 1, worker);

        vm.startPrank(worker);
        vm.expectRevert(abi.encodeWithSignature("ProgressError()"));
        deOrder.multicall(data);
        vm.stopPrank();
        assertEq(address(deOrder).balance, 95);
    }
}
