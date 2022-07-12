import serviceAxios from "./index";


export const getMarketData = (data) => {
    return serviceAxios({
        // url: "/upchain/getProject",
        url: "/market/getMarketData",
        method: "get",
        data,
    }
);
}

export const createDemand = (data) => {

    return serviceAxios({
        url: "/market/publish",
        // url: "/upchain/createDemand",
        method: "post",
        data,
    }
);
}

export const modifyDemand = (data) => {

    return serviceAxios({
        url: "/market/modifyDemand",
        // url: "/upchain/createDemand",
        method: "post",
        data,
    }
);
}

export const getHash = (data) => {
    
    return serviceAxios({
        url: "/market/upload",
        method: "post",
        data,
    }
);
}

export const getProjectDetail = (data) => {
    return serviceAxios({
        // url: "/upchain/getProject",
        url: "/market/projectDetail",
        method: "post",
        data,
    }
);
}


export const getMyPjcData = (data) => {
    return serviceAxios({
        // url: "/upchain/getProject",
        url: "/market/getMyPjcData",
        method: "post",
        data,
    }
);
}
