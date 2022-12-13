import serviceAxios from "../index";

// 创建需求 
export const createTask = (data) => {
    return serviceAxios({
        url: `/task/createTask`,
        method: "post",
        data,
    });
}

// 获取发布的项目 报名列表
export const getApply = (data) => {
    return serviceAxios({
        url: `/apply/getApplyList?task_id=${data.task_id}`,
        method: "get",
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

// 获取报名中的项目列表获取发布的项目 报名列表
export const getApplyList = (data) => {
    return serviceAxios({
        url: `/apply/getApply?page=${data.page}&pageSize=${data.pageSize}&apply_addr=${data.apply_addr}`,
        method: "get",
        data,
    });
}

