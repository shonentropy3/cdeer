//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

enum OrderProgess {
    Init,
    Staging,   // Issuer Stage
    Staged,    // Worker Stage
    Started,
    IssuerAbort,
    WokerAbort,
    Done
}

struct Order {
    uint taskId;
    address worker;
    address token;
    uint amount;
    uint payed;
    OrderProgess progress;   // PROG_*
    uint startDate;
}

interface IOrder {
    function orders(uint _taskId) external view returns (Order memory);
    function hasTaskOrders(uint _taskId) external view returns (bool);
}