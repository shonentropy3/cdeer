import serviceAxios from "../index";

export const createOrder = (data) => {

    return serviceAxios({
        url: "/order/createOrder",
        method: "post",
        data,
    });
}