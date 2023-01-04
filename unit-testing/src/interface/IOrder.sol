//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

enum OrderProgess {
    Init,
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
    uint96 amount;
    
    address worker;
    uint96 payed;

    address token;
    OrderProgess progress;   // PROG_*
    PaymentType payType;
    uint32 startDate;
}

interface IOrder {
    function getOrder(uint orderId) external view returns (Order memory);
    function stage() external view returns (address);
}