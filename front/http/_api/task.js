import serviceAxios from "../index";

// 获取Task列表
export const createTask = (data) => {
    return serviceAxios({
        url: `/task/createTask`,
        method: "post",
        data,
    });
}