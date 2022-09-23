import serviceAxios from "./index";


export const getDemand = (data) => {
    return serviceAxios({
        url: "/demand/getDemand",
        method: "get",
        data,
    });
}

export const getSearch = (data) => {
    return serviceAxios({
        url: "/demand/getSearch/?name="+data,
        method: "get"
    });
}

export const getOrders = (data) => {
    return serviceAxios({
        url: "/demand/getOrder/?account="+data,
        method: "get",
    });
}

export const getOrdersInfo = (data) => {
    return serviceAxios({
        url: "/demand/getOrdersInfo/?oid="+data,
        method: "get",
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

// 获取库内存储的order => ipfs 并返回json
export const getStagesJson = (data) => {
    return serviceAxios({
        url: "/common/getStagesJson",
        method: "post",
        data
    })
}

export const updateAttachment = (data) => {
    return serviceAxios({
        url: "/common/updateAttachment",
        method: "post",
        data
    })
}


export const updateSignature = (data) => {
    return serviceAxios({
        url: "/common/updateSignature",
        method: "post",
        data
    })
}

<<<<<<< Updated upstream
export const getProlongStage = (data) => {
    return serviceAxios({
        url: "/common/getProlongStage",
=======

export const setMyInfo = (data) => {
    return serviceAxios({
        url: "/user/setMyInfo",
>>>>>>> Stashed changes
        method: "post",
        data
    })
}
<<<<<<< Updated upstream
=======


export const modifyMyInfo = (data) => {
    return serviceAxios({
        url: "/user/modifyMyInfo",
        method: "post",
        data
    })
}


export const getMyInfo = (data) => {
    return serviceAxios({
        url: "/user/getMyInfo",
        method: "post",
        data
    })
}
>>>>>>> Stashed changes
