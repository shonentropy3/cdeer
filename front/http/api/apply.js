import serviceAxios from "../index";

// 报名
export const applyFor = (data) => {
    return serviceAxios({
        url: "/applyFor/applyFor",
        method: "post",
        data,
    });
}

//  取消报名
export const cancelApply = (data) => {
    return serviceAxios({
        url: "/applyFor/cancelApply",
        method: "post",
        data,
    });
}

// 修改报名列表排序
export const modifyApplySort = (data) => {
    return serviceAxios({
        url: "/applyFor/modifyApplySort",
        method: "post",
        data,
    });
}