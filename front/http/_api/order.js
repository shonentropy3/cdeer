import serviceAxios from "../index";

// 新建任务
export const createOrder = (data) => {
    return serviceAxios({
        url: `/order/createOrder`,
        method: "post",
        data,
    });
}

// 获取个人进行中的项目
export const getOrderList = (data) => {
    return serviceAxios({
        url: `/order/getOrderList?page=${data.page}&pageSize=${data.pageSize}${data.issuer ? '&issuer='+data.issuer : ''}${data.worker ? '&worker='+data.worker : ''}`,
        method: "get",
        data,
    });
}

// 获取任务详情
export const getOrderDetail = (data) => {
    return serviceAxios({
        url: `/order/getOrderList?order_id=${data.order_id}`,
        method: "get",
        data,
    });
}