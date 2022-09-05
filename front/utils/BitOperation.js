


export const BitOperation = (arr) => {
    // 移位运算 << 8
    let num = 0;
    arr.forEach((ele,index) => {
        num += ele << ( ( arr.length - (index + 1) ) * 8 )
    })
    return num
}