import serviceAxios from "./index";


export const getDemand = (data) => {
    return serviceAxios({
        url: "/demand/getDemand",
        method: "get",
        data,
    });
}

export const getUserApply = (data) => {
    return serviceAxios({
        url: "/user/getApply",
        method: "post",
        data,
    });
}


export const createDemand = (data) => {

    return serviceAxios({
        url: "/demand/createDemand",
        method: "post",
        data,
    });
}

export const createOrder = (data) => {

    return serviceAxios({
        url: "/demand/createOrder",
        method: "post",
        data,
    });
}

export const getFilter = (data) => {

    return serviceAxios({
        url: "/demand/getFilter",
        method: "post",
        data,
    });
}

export const modifyDemand = (data) => {

    return serviceAxios({
        url: "/demand/modifyDemand",
        method: "post",
        data,
    }
);
}

export const deleteDemand = (data) => {

    return serviceAxios({
        url: "/demand/deleteDemand",
        method: "post",
        data,
    });
}

export const getHash = (data) => {
    
    return serviceAxios({
        url: "/common/upload",
        method: "post",
        data,
    });
}

export const getFile = (data) => {
    return serviceAxios({
        url: "/common/download",
        method: "post",
        data,
    });
}

export const getDemandInfo = (data) => {
    return serviceAxios({
        url: "/demand/getDemandInfo",
        method: "post",
        data,
    });
}

export const getMyDemand = (data) => {
    return serviceAxios({
        url: "/user/getMyDemand",
        method: "post",
        data,
    });
}

export const applyFor = (data) => {
    return serviceAxios({
        url: "/applyFor/applyFor",
        method: "post",
        data,
    });
}

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

//报名开关
export const modifyApplySwitch = (data) => {
    return serviceAxios({
        url: "/applyFor/modifyApplySwitch",
        method: "post",
        data,
    });
}

export const getMyApplylist = (data) => {
    return serviceAxios({
        url: "/user/getMyApplylist",
        method: "post",
        data,
    })
}

export const getMyNftlist = (data) => {
    return serviceAxios({
        url: "/user/getMyNftlist",
        method: "post",
        data,
    })
}


// 获取stage hash
export const getStagesHash = (data) => {
    return serviceAxios({
        url: "/common/getHash",
        method: "post",
        data
    })
}
