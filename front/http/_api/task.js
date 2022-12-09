import serviceAxios from "../index";

// 创建需求 
export const createTask = (data) => {
    return serviceAxios({
        url: `/task/createTask`,
        method: "post",
        data,
    });
}

// 报名
export const createApply = (data) => {
    return serviceAxios({
        url: `/apply/createApply`,
        method: "post",
        data,
    });
}

// 获取报名中的项目列表
export const getApplyList = (data) => {
    return serviceAxios({
        url: `/apply/getApplyList?apply_addr=${data.apply_addr}`,
        method: "get",
        data,
    });
}