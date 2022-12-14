import serviceAxios from "../index";

// 获取当前任务状态
export const getOrderStatus = (data) => {
    return serviceAxios({
        url: `/order/getOrderList?worker=${data.worker}&task_id=${data.task_id}`,
        method: "get",
        data,
    });
}