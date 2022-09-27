import serviceAxios from "../index";

// 报名
export const applyFor = (data) => {
    return serviceAxios({
        url: "/applyFor/applyFor",
        method: "post",
        data,
    });
}

// 获取报名详情
export const getApplyinfo = (data) => {
    return serviceAxios({
        url: "/applyFor/getApply",
        method: "post",
        data,
    });
}

//取消报名
export const cancelApply = (data) => {
    return serviceAxios({
        url: "/applyFor/cancelApply",
        method: "post",
        data,
    });
}
