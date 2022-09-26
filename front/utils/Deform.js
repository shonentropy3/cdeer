const _data = require('../data/data.json')

export const deform_Skills = (arr) => {
    let newArr = []
    arr.forEach(e => {
        _data.skills.forEach(ele => {
            if (e === ele.value) {
                newArr.push(ele.name)
            }
        })
    })
    return newArr
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