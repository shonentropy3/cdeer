//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

enum OrderProgess {
    Init,
    StagingByIssuer,   // Issuer Stage
    StagingByWoker,    // Worker Stage
    Staged,
    Ongoing,
    IssuerAbort,
    WokerAbort,
    Done
}

enum PaymentType {
    Unknown,
    Due,   // by Due
    Confirm // by Confirm , if has pre pay
}

struct Order {
    uint taskId;
    address issuer;
    address worker;
    address token;
    uint amount;
    uint payed;
    OrderProgess progress;   // PROG_*
    PaymentType payType;
    uint startDate;
}

interface IOrder {
    function getOrder(uint orderId) external view returns (Order memory);
}