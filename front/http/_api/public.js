import serviceAxios from "../index";

// 报名
export const searchTask = (data) => {
    return serviceAxios({
        url: `/task/getSearchList?
            ${data.role !== '' ? 'role='+data.role : ''}&
            ${data.title !== '' ? 'title='+data.title : ''}&
            ${data.hash !== '' ? 'hash='+data.hash : ''}`,
        method: "get",
        data,
    });
}