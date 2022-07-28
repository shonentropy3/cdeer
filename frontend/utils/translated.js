
const _data = require('../data/data.json')

export const translatedRole = (arr) => {
    let str = ''
    arr.forEach(e => {
        _data.role.forEach(ele => {
            if (e === ele.value) {
                str += ele.name+'、'
            }
        })
    })
    return str.substring(0,str.lastIndexOf('、'))
}

export const translatedPjc = (arr) => {
    let str = ''
    arr.forEach(e => {
        _data.demand.forEach(ele => {
            if (e === ele.value) {
                str += ele.name+'、'
            }
        })
    })
    return str.substring(0,str.lastIndexOf('、'))
}

export const sToDays = (s) => {
    console.log(s,'s==>');
    let days = s/60/60/24;
    return days
}