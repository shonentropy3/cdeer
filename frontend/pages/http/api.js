import serviceAxios from "./index";


export const getMarketData = (data) => {
    return serviceAxios({
        url: "/upchain/getProject",
        method: "get",
        data,
    }
);
}

export const createProject = (data) => {
    return serviceAxios({
        url: "/market/publish",
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