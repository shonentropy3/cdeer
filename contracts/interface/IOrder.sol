//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IOrder {
    function hasDemandOrders(uint _proId) external view returns (bool);
}