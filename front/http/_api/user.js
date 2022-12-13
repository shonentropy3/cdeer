import serviceAxios from "../index";


// 获取个人资料
export const getUserInfo = (data) => {
    return serviceAxios({
        url: `/user/getUserInfo?address=${data.address}`,
        method: "get",
        data
    })
}

export const createUserInfo = (data) => {
    return serviceAxios({
        url: "/user/createUserInfo",
        method: "post",
        data
    })
}
