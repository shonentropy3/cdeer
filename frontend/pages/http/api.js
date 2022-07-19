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


export const applyFor = (data) => {
    return serviceAxios({
        // url: "/upchain/getProject",
        url: "/applyFor/applyFor",
        method: "post",
        data,
    }
);
}

export const getApplyinfo = (data) => {
    return serviceAxios({
        // url: "/upchain/getProject",
        url: "/applyFor/getApply",
        method: "post",
        data,
    }
);
}

//取消报名
export const cancelApply = (data) => {
    return serviceAxios({
        url: "/applyFor/cancelApply",
        method: "post",
        data,
    }
);
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
