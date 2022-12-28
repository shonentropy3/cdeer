import BigNumber from 'bignumber.js';

export const BitOperation = (arr) => {
    // 移位运算 << 12
    let num = 0;
    arr.forEach((ele,index) => {
        console.log(ele << ( ( arr.length - new BigNumber((index + 1) ) * 12 )));
        // num.plus(ele << ( ( arr.length - (index + 1) ) * 12 ))
        num += ele << ( ( arr.length - new BigNumber((index + 1) ) * 12 ))
    })
    return num
}