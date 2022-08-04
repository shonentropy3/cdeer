//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;


struct TaskInfo {
    string title;
    string desc;
    string attachment;
    uint budget;
    uint period;
    bool disabled;
}

interface ITask {
    function ownerOf(uint256 tokenId) external view returns (address);
    function tasks(uint256 tokenId)  external view returns (TaskInfo memory);
}