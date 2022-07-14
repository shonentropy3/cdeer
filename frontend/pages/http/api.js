import serviceAxios from "./index";


export const getDemand = (data) => {
    return serviceAxios({
        // url: "/upchain/getProject",
        url: "/market/getDemand",
        method: "get",
        data,
    }
);
}

export const createDemand = (data) => {

    return serviceAxios({
        url: "/market/createDemand",
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

export const deleteDemand = (data) => {

    return serviceAxios({
        url: "/market/deleteDemand",
        // url: "/upchain/createDemand",
        method: "post",
        data,
    }
);
}

export const getHash = (data) => {
    
    return serviceAxios({
        url: "/common/upload",
        method: "post",
        data,
    }
);
}

export const getDemandInfo = (data) => {
    return serviceAxios({
        // url: "/upchain/getProject",
        url: "/market/getDemandInfo",
        method: "post",
        data,
    }
);
}


export const getMyDemand = (data) => {
    return serviceAxios({
        // url: "/upchain/getProject",
        url: "/user/getMyDemand",
        method: "post",
        data,
    }
);
}
