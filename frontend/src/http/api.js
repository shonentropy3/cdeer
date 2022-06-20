import serviceAxios from "./index";


export const getMarketData = (data) => {
    return serviceAxios({
        url: "/upchain/getProject",
        method: "get",
        data,
    }
);
}
