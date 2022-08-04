// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./BytesLib.sol";


library MyStrings {
    using BytesLib for bytes;

    function shorten(string memory origin, uint256 maxlength)
        internal
        view
        returns (string memory)
    {
        if (maxlength < 5) return origin;
        bytes memory b = bytes(origin);
        uint256 len = b.length;

        if (len <= maxlength) return origin;

        uint256 kickLength = len - maxlength + 3; // ...

        uint256 mid = (maxlength - 3) / 2;
        uint256 start = (maxlength - 3) / 2;
        if (mid * 2 + 3 != maxlength) {
            start++;
        }
        uint256 end = start + kickLength;

        bytes memory part1 = b.slice(0, start);
        string memory ellipse = "...";
        bytes memory part2 = b.slice(end, len - end);

        return string(abi.encodePacked(string(part1), ellipse, string(part2)));
    }
}
