// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/console2.sol";
import "contracts/interface/IOrder.sol";
import {DeOrder} from "contracts/DeOrder.sol";
import {WETH} from "contracts/mock/WETH.sol";
import {AttackRefund} from "./AttackRefund.sol";
import {AttackWithdraw} from "./AttackWithdraw.sol";
import {DeOrderVerifier} from "contracts/DeOrderVerifier.sol";

contract AttackTest is Test {
    AttackRefund attackRefund;
    AttackWithdraw attackWithdraw;
    DeOrder public deOrder;
    WETH public weth;
    DeOrderVerifier public verifier;
    address owner; // 合约拥有者
    address issuer; // 甲方
    address other; // 第三方

    function setUp() public {
        owner = msg.sender;
        issuer = vm.addr(1);
        other = vm.addr(3);
        vm.startPrank(owner); // 切换合约发起人
        weth = new WETH();
        verifier = new DeOrderVerifier();
        deOrder = new DeOrder(address(weth), address(0), address(verifier));
        attackRefund = new AttackRefund(deOrder, weth);
        attackWithdraw = new AttackWithdraw(deOrder, weth, verifier);
        vm.deal(owner, 100 ether); // 初始化原生币余额
        vm.deal(issuer, 1 ether); // 初始化原生币余额
        vm.stopPrank();
    }

    function testFailAttackRefund() public {
        vm.startPrank(owner);
        deOrder.createOrder(0, owner, other, address(0), 100);
        deOrder.payOrder{value: 100 ether}(1, 100 ether); // 付款
        vm.stopPrank();
        // console2.log(weth.totalSupply());

        vm.startPrank(issuer);
        attackRefund.attack{value: 1 ether}();
        vm.stopPrank();
        // console2.log(weth.totalSupply());
    }

    function testAttackWithdraw() public {
        vm.startPrank(owner);
        deOrder.createOrder(0, owner, other, address(0), 100);
        deOrder.payOrder{value: 100 ether}(1, 100 ether); // 付款
        vm.stopPrank();
        // console2.log(weth.totalSupply());

        vm.startPrank(issuer);
        attackWithdraw.attack{value: 1 ether}();
        vm.stopPrank();
        // console2.log(weth.totalSupply());
    }
}
