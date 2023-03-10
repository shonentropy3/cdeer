const _data = require('../data/data.json')

export const deform_Skills = (arr) => {
    let newArr = [];
    if (!arr) {
        arr = []
    }
    arr.forEach(e => {
        _data.skills.forEach(ele => {
            if (e == ele.value) {
                newArr.push(ele.name)
            }
        })
    })
    return newArr
}

export const deform_Count = (count,currency) => {
    if (currency === 'ETH') {
        count = count / Math.pow(10,18);
    }
    return count
}


// export const deform_ProjectTypes = (arr) => {
//     let newArr = []
//     arr.forEach(e => {
//         _data.projectTypes.forEach(ele => {
//             if (e === ele.value) {
//                 newArr.push(ele.name)
//             }
//         })
//     })
//     return newArr
// }