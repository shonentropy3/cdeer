pragma solidity ^0.8.0;


interface IOrder {
    function isProOrders(uint _proId) external view returns (bool);
}