import serviceAxios from "../index";

// 获取Task列表
export const searchTask = (data) => {
    return serviceAxios({
        url: `/task/getTaskList?page=${data.page}&pageSize=${data.pageSize}${data.role ? '&role='+data.role : ''}${data.title ? '&title='+data.title : ''}${data.issuer ? '&issuer='+data.issuer : ''}${data.status ? '&status='+data.status : ''}`,
        method: "get",
        data,
    });
}