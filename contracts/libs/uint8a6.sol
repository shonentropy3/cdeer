pragma solidity >=0.8.0;

// uint8[6]
library uint8a6 {
    uint constant bits = 8;
    uint constant elements = 6;
    
    uint constant range = 1 << bits;
    uint constant max = range - 1;

    function get(uint va, uint index) internal pure returns (uint) {
        require(index < elements, "index invalid");
        return (va >> (bits * index)) & max;
    }

    function set(uint va, uint index, uint value) internal pure returns (uint) {
        require(index < elements, "index invalid");
        require(value < range, "value invalid");
        uint pos = index * bits;
        return (va & ~(max << pos)) | (value << pos);
    }
}