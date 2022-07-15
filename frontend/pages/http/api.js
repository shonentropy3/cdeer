import serviceAxios from "./index";


export const getDemand = (data) => {
    return serviceAxios({
        // url: "/upchain/getProject",
        url: "/demand/getDemand",
        method: "get",
        data,
    }
);
}

export const createDemand = (data) => {

    return serviceAxios({
        url: "/demand/createDemand",
        // url: "/upchain/createDemand",
        method: "post",
        data,
    }
);
}

export const modifyDemand = (data) => {

    return serviceAxios({
        url: "/demand/modifyDemand",
        // url: "/upchain/createDemand",
        method: "post",
        data,
    }
);
}

export const deleteDemand = (data) => {

    return serviceAxios({
        url: "/demand/deleteDemand",
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
        url: "/demand/getDemandInfo",
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


export const createApply = (data) => {
    return serviceAxios({
        url: "/applyfor/createApply",
        method: "post",
        data,
    }
);
}