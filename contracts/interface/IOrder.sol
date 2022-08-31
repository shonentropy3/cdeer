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
    address issuer;
    address worker;
    address token;
    uint amount;
    uint payed;
    OrderProgess progress;   // PROG_*
    uint startDate;
}

interface IOrder {
    function getOrder(uint orderId) external view returns (Order memory);
}