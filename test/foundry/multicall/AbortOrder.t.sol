// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "./multicall.t.sol";

contract AbortOrderMulticallTest is MulticallTest {
    //按期付款，设置100块，时间17280*10s（两天），一个阶段划分的order，issuer在时间一半的时候中止任务，只有一个阶段
    function testFailMulticallCannotDueIusserAbortOrder() public {
        createOrder(issuer, address(0), 100 ether); // 创建Order
        amounts = [100 ether]; //100块
        periods = [172800]; // 两天
        permitStage(issuer, worker, 1, amounts, periods, "Confirm", ""); // 阶段划分
        payOrder(issuer, 100 ether, zero); // 付款
        assertEq(address(issuer).balance, 900 ether); //项目甲方余额
        vm.warp(0); //初始化时间
        startOrder(issuer); // 开始任务
        vm.warp(17280 * 5); //增加17280s
        // abortOrder(issuer, 1);
        bytes[] memory data = new bytes[](2);
        data[0] = abi.encodeWithSelector(deOrder.abortOrder.selector, 1);
        data[1] = abi.encodeWithSelector(deOrder.abortOrder.selector, 1);
        vm.startPrank(issuer);
        deOrder.multicall(data);
        vm.stopPrank();
        assertEq(address(issuer).balance, 1000 ether);
        assertEq(address(worker).balance, 0 ether);
    }
}
