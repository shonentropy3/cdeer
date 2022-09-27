import serviceAxios from "../index";

export const createOrder = (data) => {

    return serviceAxios({
        url: "/order/createOrder",
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

// 获取order详情
export const getOrdersInfo = (data) => {
    return serviceAxios({
        url: "/demand/getOrdersInfo/?oid="+data,
        method: "get",
    });
}

// 获取延长阶段
export const getProlongStage = (data) => {
    return serviceAxios({
        url: "/common/getProlongStage",
        method: "post",
        data
    })
}

// 获取阶段 hash
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

// 修改签名
export const updateSignature = (data) => {
    return serviceAxios({
        url: "/common/updateSignature",
        method: "post",
        data
    })
}