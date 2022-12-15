pragma solidity ^0.8.0;

import "./interface/ITask.sol";
import "./interface/IMetadata.sol";
import "./libs/MyStrings.sol";
import "base64-sol/base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./libs/uint8a6.sol";
import "./libs/DateTimeLibrary.sol";

contract TaskMetadata is IMetadata, Ownable {
    using MyStrings for string;
    using BytesLib for bytes;
    using uint8a6 for uint48;
    

    ITask public taskAddr;

    mapping (uint => string) currencyNames;
    mapping (uint => string) skills;

    constructor(address _task) {
        taskAddr = ITask(_task);
        currencyNames[1] = "USD";
        currencyNames[2] = "ETH";
        currencyNames[3] = "BNB";
        currencyNames[4] = "MATIC";
        currencyNames[5] = "OP";

        // l1 category 
        skills[1] = "Development";
        skills[2] = "Product";
        skills[3] = "Design";
        skills[4] = "Testing";
        skills[5] = "Writing";
        skills[6] = "Marketing";
        skills[7] = "Research";
        skills[8] = "Operation";
        skills[9] = "Translation";
        skills[10] = "Training";
        skills[11] = "Services";


        // l2 category: Langs
        skills[20] = "JavaScript";
        skills[21] = "Python";
        skills[22] = "Java";
        skills[23] = "Golang";
        skills[24] = "Solidity";
        skills[25] = "Rust";
        skills[26] = "C/C++";
        skills[27] = "PHP";
        skills[28] = ".Net";
        skills[29] = "SQL";
        skills[30] = "Move";


        // l2 category:  skills
        skills[40] = "Web Frontend";
        skills[41] = "Backend";
        skills[42] = "Desktop Apps";
        skills[43] = "Android/iOS";
        skills[44] = "Auto/Bots";
        skills[45] = "Mini Program";
        skills[46] = "Full Stack";
        skills[47] = "DevOps";
        skills[48] = "Data Analysts";
        skills[49] = "Blockchain"; 
        skills[50] = "AI/ML";  


        skills[61] = "Hardhat";
        skills[62] = "Defi";
        skills[63] = "NFT";
        
        skills[64] = "Spring";
        skills[65] = "Laravel";
        skills[66] = "React";
        skills[67] = "Vue.js";


    }

    function setSkillLabel(uint8 skillIndex,  string memory label) external onlyOwner {
        skills[skillIndex] = label;
    }

    function setCurrencyNames(uint8 currencyIndex,  string memory label) external onlyOwner {
        currencyNames[currencyIndex] = label;
    }

    function tokenURI(uint256 tokenId) external view override returns (string memory) {
        string memory svgFormat = generateSVG(tokenId);
        return generateTokenUri(svgFormat);
    }

    function nowDateTime(uint ts) internal view returns (string memory datatime) {
        // block.timestamp
        (uint year, uint month, uint day, uint hour, uint minute, uint second) = DateTimeLibrary.timestampToDateTime(ts);
        // (GMT+8)
        hour = (hour + 8) % 24;

        // Format: 2017-06-21T22:13:59+0800
        datatime = string(abi.encodePacked(Strings.toString(year),
            "-",
            month <10 ? "0": "",
            Strings.toString(month),
            "-",
            day <10 ? "0": "",
            Strings.toString(day),
            "T",
            hour <10 ? "0": "",
            Strings.toString(hour),
            ":",
            minute <10 ? "0": "",
            Strings.toString(minute),
            ":",
            second <10 ? "0": "",
            Strings.toString(second),
            "+0800"));
    }

    function skillSVG(uint48 taskskills, uint i)  internal view returns (string memory svgString) {
        uint skill = taskskills.get(i);
        if (skill > 0) {
            uint xPos = 16 + i * 24;
            return string(
                    abi.encodePacked(
                        '<path class="c26" d="M',
                        Strings.toString(xPos),
                        ' 86.42h19a.9.9 0 0 1 1 .8V91a.91.91 0 0 1-1 .8H',
                        Strings.toString(xPos),
                        'a.91.91 0 0 1-1-.8v-3.78a.9.9 0 0 1 1-.8Z"/>',

                        '<g class="c20">',
                        '<text class="c21" transform="translate(',
                        Strings.toString(xPos),
                        ' 90.08)">',
                        skills[skill],
                        '</text></g>'));
        }
        return "";
    }


    function getValueStr(uint128 taskbudget, uint8 currency) internal view returns (string memory budget) {
        if(taskbudget == 0) {
            return "Negotiable";
        } else {
            if (taskbudget / 1e18 > 0) {
                
                if(taskbudget / 1e18 < 10) {
                    uint digit = taskbudget / 1e18;
                    uint b = (taskbudget - (digit * 1e18)) / 1e17;
                    budget = string(abi.encodePacked("~", Strings.toString(digit),
                    ".",
                        Strings.toString(b)));
                } else {
                    budget = string(abi.encodePacked("~", Strings.toString(taskbudget / 1e18))); 
                }

            } else if (taskbudget / 1e17 > 0) {
                uint b = taskbudget / 1e17;
                budget = string(abi.encodePacked("~0.", Strings.toString(b)));
            } else if (taskbudget / 1e16 > 0) {
                uint b = taskbudget / 1e16;
                budget = string(abi.encodePacked("~0.0", Strings.toString(b)));
            } else if (taskbudget / 1e15 > 0) {
                uint b = taskbudget / 1e15;
                budget = string(abi.encodePacked("~0.00", Strings.toString(b)));
            } else {
                budget = "&lt;0.001";
            }
        }


        return string(
                    abi.encodePacked(budget, " ",
            currencyNames[currency]));
    }

    function testGettask(uint taskId) external view returns (TaskInfo memory) {
        // TaskInfo memory task = 
        return taskAddr.tasks(taskId);
    }
        

    function generateSVG(uint taskId) public view returns (string memory svg) {
        (string memory title, , string memory attachment, 
            uint8 currency, uint128 budget, ,uint48 taskskills, uint32 timestamp, 
            )= taskAddr.getTaskInfo(taskId);


        bytes memory hashb = bytes(attachment);

        string memory hashpart1 = string(hashb.slice(0, 30));
        string memory hashpart2 = string(hashb.slice(30, 16));

        string memory nowDate = nowDateTime(timestamp);
        string memory valueStr = getValueStr(budget, currency);


        return
            string(
                abi.encodePacked(
                    '<svg id="l_1" data-name="l 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 170 192"><defs><linearGradient id="a_17" x1="85.12" y1="17.17" x2="85.13" y2="180.08" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#d3d9f7"/><stop offset="1" stop-color="#dff8fd"/></linearGradient><linearGradient id="a" x1="-.19" y1="100.25" x2="170.44" y2="100.25" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#00d600"/></linearGradient><linearGradient id="a-2" x1="6" y1="100.25" x2="164.25" y2="100.25" xlink:href="#a"/><linearGradient id="a-3" x1="12.2" y1="100.25" x2="158.05" y2="100.25" xlink:href="#a"/><linearGradient id="a-4" x1="18.39" y1="100.25" x2="151.86" y2="100.25" xlink:href="#a"/><linearGradient id="a-5" x1="24.58" y1="100.25" x2="145.67" y2="100.25" xlink:href="#a"/><linearGradient id="a-6" x1="30.78" y1="100.25" x2="139.47" y2="100.25" xlink:href="#a"/><linearGradient id="a-7" x1="36.97" y1="100.25" x2="133.28" y2="100.25" xlink:href="#a"/><linearGradient id="a-8" x1="43.17" y1="100.25" x2="127.08" y2="100.25" xlink:href="#a"/><linearGradient id="a-9" x1="49.36" y1="100.25" x2="120.89" y2="100.25" xlink:href="#a"/><linearGradient id="a-10" x1="55.56" y1="100.25" x2="114.69" y2="100.25" xlink:href="#a"/><linearGradient id="a-11" x1="61.75" y1="100.25" x2="108.5" y2="100.25" xlink:href="#a"/><linearGradient id="a-12" x1="67.95" y1="100.25" x2="102.3" y2="100.25" xlink:href="#a"/><linearGradient id="a_44" x1="-399.35" y1="-508.52" x2="-389" y2="-508.52" gradientTransform="rotate(90 -464.18 -27)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#d4dcf8"/><stop offset="1" stop-color="#999"/></linearGradient><style>.c26{fill-rule:evenodd}.c20,.c21{isolation:isolate}.c21{font-size:2.71px;letter-spacing:.09em}.c21,.c28{font-family:PingFangSC-Regular-GBpc-EUC-H,PingFang SC}.c25{fill:gray;font-family:PingFangSC-Light-GBpc-EUC-H,PingFang SC;font-size:3.4px;letter-spacing:.07em}.c26{fill:#ff0;opacity:.8}.c28{font-size:5px;letter-spacing:.07em}</style><mask id="mask" x="18.61" y="131.58" width="16.56" height="16.56" maskUnits="userSpaceOnUse"><path id="path-1" style="fill-rule:evenodd;fill:#fff" d="M18.61 131.58h16.56v16.56H18.61v-16.56z"/></mask></defs><path style="fill:url(#a_17)" d="M.13 0h170v192H.13z"/><g style="opacity:.2"><circle cx="85.13" cy="100.25" r="84.75" style="stroke-width:1.14px;stroke:url(#a);fill:none;stroke-miterlimit:10"/><circle cx="85.13" cy="100.25" r="78.6" style="stroke-width:1.05px;stroke:url(#a-2);fill:none;stroke-miterlimit:10"/><circle cx="85.13" cy="100.25" r="72.44" style="stroke-width:.97px;stroke:url(#a-3);fill:none;stroke-miterlimit:10"/><circle cx="85.13" cy="100.25" r="66.29" style="stroke-width:.89px;stroke:url(#a-4);fill:none;stroke-miterlimit:10"/><circle cx="85.13" cy="100.25" r="60.14" style="stroke-width:.81px;stroke:url(#a-5);fill:none;stroke-miterlimit:10"/><circle cx="85.13" cy="100.25" r="53.98" style="stroke-width:.72px;stroke:url(#a-6);fill:none;stroke-miterlimit:10"/><circle cx="85.13" cy="100.25" r="47.83" style="stroke-width:.64px;stroke:url(#a-7);fill:none;stroke-miterlimit:10"/><circle cx="85.13" cy="100.25" r="41.68" style="stroke-width:.56px;stroke:url(#a-8);fill:none;stroke-miterlimit:10"/><circle cx="85.13" cy="100.25" r="35.52" style="stroke-width:.48px;stroke:url(#a-9);fill:none;stroke-miterlimit:10"/><circle cx="85.13" cy="100.25" r="29.37" style="stroke-width:.39px;stroke:url(#a-10);fill:none;stroke-miterlimit:10"/><circle cx="85.13" cy="100.25" r="23.22" style="stroke-width:.31px;stroke:url(#a-11);fill:none;stroke-miterlimit:10"/><circle cx="85.13" cy="100.25" r="17.06" style="stroke-width:.23px;stroke:url(#a-12);fill:none;stroke-miterlimit:10"/></g>',
                    '<text class="c28" transform="translate(15.13 20.86)">Detask.xyz</text><text class="c28" transform="translate(48.13 20.86)">#',
                    Strings.toString(taskId),
                    '</text>',
                    '<path d="m17.34 43.35-1.56-2.23-.53.76 2.09 3 2.09-3-.53-.76Zm0-3.29-1.56-2.23-.53.76 2.09 3 2.09-3-.53-.76Zm0 6.59-1.56-2.24-.53.76 2.09 3 2.09-2.94-.53-.82Z" style="fill:url(#a_44)"/>',
                    '<text transform="translate(14.49 74.47)" style="font-size:12px;font-family:PingFangSC-Semibold-GBpc-EUC-H,PingFang SC;letter-spacing:.07em">',
                    title,
                    '</text>',
                    '<text transform="translate(14.95 99.51)" style="fill:gray;font-family:PingFangSC-Light-GBpc-EUC-H,PingFang SC;font-size:6px;letter-spacing:.08em">',
                    'Task Description IPFS:',
                    '<tspan x="0" y="8">',
                    hashpart1,
                    '</tspan><tspan x="0" y="16">',
                    hashpart2,
                    '</tspan></text>',
                    skillSVG(taskskills,0),
                    skillSVG(taskskills,1),
                    skillSVG(taskskills,2),
                    skillSVG(taskskills,3),
                    '<text class="c25" transform="translate(15 126.77)">Task budget:</text>',
                    '<path style="stroke:#979797;stroke-width:.09px;fill:#fff" d="M14.67 128.37h86v22.99H14.67z"/>',
                    '<g style="mask:url(#mask)"><path d="M27.52 134.79v1.5c1.47.19 2.51 1 2.56 2.1v.09h-1.27c0-.49-.72-.95-1.95-.95s-1.95.39-1.95.95.61.93 1.83 1h.12c1.92 0 3.23.86 3.23 2.23s-1.05 2-2.57 2.19v1.52h-1.27v-1.52c-1.5-.17-2.56-1-2.62-2.11v-.08h1.28c0 .49.72 1 1.95 1s1.95-.39 1.95-1-.61-.93-1.83-1h-.24c-1.86 0-3.11-.9-3.11-2.23s1.08-2 2.62-2.2v-1.49Zm-.63-1.93a7 7 0 1 0 7 7 7 7 0 0 0-7-7Zm0-1.28a8.28 8.28 0 1 1-8.28 8.28 8.28 8.28 0 0 1 8.28-8.28Z" style="fill:#2c2c2c;fill-rule:evenodd"/></g>',

                    '<text transform="translate(41 143.66)" style="font-size:8.63px;font-family:PingFangSC-Medium-GBpc-EUC-H,PingFang SC;letter-spacing:.08em">',
                    valueStr,
                    '</text>',
                    '<text class="c25" transform="translate(15 169.77)">',
                    nowDate,
                    '</text>',
                    '</svg>'

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