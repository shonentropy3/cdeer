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

// 下载附件
export const getFile = (data) => {
    return serviceAxios({
        url: "/common/download",
        method: "post",
        data,
    });
}

// 修改附件
export const updateAttachment = (data) => {
    return serviceAxios({
        url: "/common/updateAttachment",
        method: "post",
        data
    })
}

// 获取task详情
export const getDemandInfo = (data) => {
    return serviceAxios({
        url: "/demand/getDemandInfo",
        method: "post",
        data,
    });
}

// 展示task列表
export const getDemand = (data) => {
    return serviceAxios({
        url: "/demand/getDemand",
        method: "post",
        data,
    });
}

// 搜索task
export const getSearch = (data) => {
    return serviceAxios({
        url: "/demand/getSearch/?name="+data,
        method: "get"
    });
}

// 筛选task
export const getFilter = (data) => {

    return serviceAxios({
        url: "/demand/getFilter",
        method: "post",
        data,
    });
}