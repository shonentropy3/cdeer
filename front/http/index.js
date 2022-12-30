import axios from "axios";
import { useAccount } from "wagmi";
// import qs from "qs";
let serviceAxios;

if (typeof window !== "undefined") {

  const url = window.document.location.hostname;

  // 创建 axios 请求实例
serviceAxios = axios.create({
  baseURL: url + process.env.NEXT_PUBLIC_DEVELOPMENT_API, // 基础请求地址
  timeout: 10000 // 请求超时设置
//   withCredentials: false, // 跨域请求是否需要携带 cookie
});
  // 创建请求拦截
  serviceAxios.interceptors.request.use(

    async(config) => {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      // if (serverConfig.useTokenAuthorization) {
        config.headers["x-token"] = localStorage.getItem(`session.${accounts[0]}`); // 请求头携带 token
        config.headers["x-address"] = accounts[0]; // 请求头携带 address
      // }
      // console.log(useAccount());
      return config;
    },
    error => {
      Promise.reject(error);
    }
  );

// 创建响应拦截
serviceAxios.interceptors.response.use(
  async(res) => {
    let data = res.data;
    if (data.data.reload) {
      localStorage.clear();
      history.go(0)
    }
    // 处理自己的业务逻辑，比如判断 token 是否过期等等
    // 代码块
    return data;
  },
  (error) => {
    let message = "";
    if (error && error.response) {
      switch (error.response.status) {
        case 302:
          message = "接口重定向了！";
          break;
        case 400:
          message = "参数不正确！";
          break;
        case 401:
          message = "您未登录，或者登录已经超时，请先登录！";
          break;
        case 403:
          message = "您没有权限操作！";
          break;
        case 404:
          message = `请求地址出错: ${error.response.config.url}`;
          break;
        case 408:
          message = "请求超时！";
          break;
        case 409:
          message = "系统已存在相同数据！";
          break;
        case 500:
          message = "服务器内部错误！";
          break;
        case 501:
          message = "服务未实现！";
          break;
        case 502:
          message = "网关错误！";
          break;
        case 503:
          message = "服务不可用！";
          break;
        case 504:
          message = "服务暂时无法访问，请稍后再试！";
          break;
        case 505:
          message = "HTTP 版本不受支持！";
          break;
        default:
          message = "异常问题，请联系管理员！";
          break;
      }
    }
    // console.log(error.response.config.baseURL+error.response.config.url);
    return Promise.reject(message);
  }
);

}
export default serviceAxios;