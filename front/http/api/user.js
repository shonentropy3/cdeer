import serviceAxios from "../index";

// 设置个人信息
export const setMyInfo = (data) => {
    return serviceAxios({
        url: "/user/setMyInfo",
        method: "post",
        data
    })
}

// 获取个人报名列表
export const getMyApplylist = (data) => {
    return serviceAxios({
        url: "/user/getMyApplylist",
        method: "post",
        data,
    })
}

// 获取个人报名中的项目
export const getApplyData = (data) => {
    return serviceAxios({
        url: "/user/getApply",
        method: "post",
        data,
    });
}

// 获取个人Taks列表
export const getTasksData = (data) => {
    return serviceAxios({
        url: "/user/getMyDemand",
        method: "post",
        data,
    });
}
// 获取个人Nftlist
export const getMyNftlist = (data) => {
    return serviceAxios({
        url: "/user/getMyNftlist",
        method: "post",
        data,
    })
}

// 获取个人信息
export const getMyInfo = (data) => {
    return serviceAxios({
        url: "/user/getMyInfo",
        method: "post",
        data
    })
}

// 修改个人信息
export const modifyMyInfo = (data) => {
    return serviceAxios({
        url: "/user/modifyMyInfo",
        method: "post",
        data
    })
}

// 修改个人Task报名开关
export const modifyApplySwitch = (data) => {
    return serviceAxios({
        url: "/applyFor/modifyApplySwitch",
        method: "post",
        data,
    });
}

// 修改个人task
export const modifyDemand = (data) => {
    return serviceAxios({
        url: "/demand/modifyDemand",
        method: "post",
        data,
    });
}

// 删除个人Task
export const delDemand = (data) => {
    return serviceAxios({
        url: "/demand/deleteDemand",
        method: "post",
        data
    })
}