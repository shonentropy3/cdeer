import serviceAxios from "../index";

export const createDemand = (data) => {

    return serviceAxios({
        url: "/demand/createDemand",
        method: "post",
        data,
    });
}

// 获取附件ipfs
export const getHash = (data) => {
    
    return serviceAxios({
        url: "/common/upload",
        method: "post",
        data,
    });
}

// 获取Taks列表
export const getTasksData = (data) => {
    return serviceAxios({
        url: "/user/getMyDemand",
        method: "post",
        data,
    });
}

// 获取Orders列表
export const getOrdersData = (data) => {
    return serviceAxios({
        url: "/demand/getOrder/?account="+data,
        method: "get",
    });
}


// 获取报名中的项目
export const getApplyData = (data) => {
    return serviceAxios({
        url: "/user/getApply",
        method: "post",
        data,
    });
}