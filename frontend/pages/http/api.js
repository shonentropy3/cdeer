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
        url: "/upchain/createProject",
        method: "post",
        data,
    }
);
}
