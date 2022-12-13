import serviceAxios from "../index";


// 获取个人资料
export const getUserInfo = (data) => {
    console.log('api ==> ',data);
    return serviceAxios({
        url: `/user/getUserInfo?address=${data.address}`,
        method: "get",
        data
    })
}

// 创建个人资料
export const createUserInfo = (data) => {
    return serviceAxios({
        url: "/user/createUserInfo",
        method: "post",
        data
    })
}

// 修改个人资料
export const updateUserInfo = (data) => {
    return serviceAxios({
        url: "/user/updateUserInfo",
        method: "post",
        data
    })
}
