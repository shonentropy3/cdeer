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
