//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IOrder {
    function isDemandOrders(uint _proId) external view returns (bool);
}