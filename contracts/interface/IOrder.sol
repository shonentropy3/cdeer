//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IOrder {
    function hasTaskOrders(uint _taskId) external view returns (bool);
}