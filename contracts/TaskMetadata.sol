pragma solidity ^0.8.0;

import "./interface/ITask.sol";
import "./interface/IMetadata.sol";
import "./libs/MyStrings.sol";
import "base64-sol/base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./libs/uint8a6.sol";

contract TaskMetadata is IMetadata {
    using MyStrings for string;
    using uint8a6 for uint;
    
    function getValue(uint[] memory values) public view returns (uint) {
        uint len = values.length;
        require(len < 6 , "length mismatch");
        uint va;

        for (uint256 i = 0; i < len; i++) {
            va = va.set(i, values[i]);
        }
        
        return va;
    }

    ITask public taskAddr;
    string public background;

    constructor(address _task) {
        taskAddr = ITask(_task);
    }

    function tokenURI(uint256 tokenId) external view override returns (string memory) {
        string memory svgFormat = generateSVG(tokenId);
        return generateTokenUri(svgFormat);
    }

    function set(uint id, string tag) {

    }

    function generateSVG(uint taskId) internal view returns (string memory svg) {
        TaskInfo memory task = taskAddr.tasks(taskId);

        string memory title = task.title;
        string memory desc = task.desc.shorten(20);
        task.skills;


        return
            string(
                abi.encodePacked(
                    '<svg id="l1" data-name="l_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 595.28 841.89">',
                    "<defs>",
                    "<style>",
                    ".c1 {fill: #fff;}",
                    ".c2 {font-size: 14px;}",
                    ".c2,.c3,.c4,.c5,.c6 {fill: #040000;}",
                    ".c2,.c3,.c5 {font-family: PingFangSC-Regular-GBpc-EUC-H, PingFang SC;}",
                    ".c3 {font-size: 7px;}",
                    ".c4 {font-size: 28px;font-family: PingFangSC-Medium-GBpc-EUC-H, PingFang SC;}",
                    ".c5 {font-size: 14.7px;}",
                    ".c6 {font-size: 15.47px;font-family: PingFangSC-Semibold-GBpc-EUC-H, PingFang SC;}",
                    "</style>",
                    "</defs>",
                    '<path class="c1" d="M595.28,841.89H0V0H595.28Z" />',
                    background,
                    '<text class="c2" transform="translate(194.98 695.62)">',
                    unicode"登链社区 — 中⽂区块链技术社区",
                    "</text>",
                    '<text class="c3" transform="translate(194.15 712.44)">Upchain Commutity-Chinese blockchain technology community</text>',
                    '<text class="c4" transform="translate(185.64 298.41)">',
                    unicode"原创作品存证证书",
                    "</text>",
                    '<text class="cls-5" transform="translate(130.43 420.13)">',
                    unicode":",
                    "</text>",
                    '<text class="cls-5" transform="translate(203.07 419.55)">',
                    "</text>",
                    '<text class="cls-5" transform="translate(130.43 452.85)">',
                    unicode"Token ID：",
                    "</text>",
                    '<text class="cls-5" transform="translate(203.07 452.42)">',
                    Strings.toString(taskId),
                    "</text>",
                    '<text class="cls-5" transform="translate(130.43 485.57)">',
                    unicode"预算:",
                    "</text>",
                    '<text class="cls-5" transform="translate(130.43 518.29)">',
                    unicode"",
                    "</text>",
                    '<text class="c6" transform="translate(168.52 326.54)">CERTIFICATE OF ORIGINAL WORK</text>',
                    "</svg>"
                )
            );
    }

        function generateTokenUri(string memory svgFormat)
        internal
        pure
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"image": "',
                                "data:image/svg+xml;base64,",
                                Base64.encode(bytes(svgFormat)),
                                '"}'
                            )
                        )
                    )
                )
            );
    }

}