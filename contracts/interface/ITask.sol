//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;


struct TaskInfo {
    string title;
    string desc;
    string attachment;
    uint8 currency;
    uint64 budget;
    uint32 period;
    uint48 categories;     // uint8[6]
    uint48 skills;    // uint8[6]
    bool disabled;
}

interface ITask {
    function ownerOf(uint256 tokenId) external view returns (address);
    function tasks(uint256 tokenId)  external view returns (TaskInfo memory);
}

