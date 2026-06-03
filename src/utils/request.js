import { post } from "@/utils/api.js"
import { goto } from '@/utils/fun.js';
import { setCache } from "@/utils/storage.js"
import { isMTVapp } from "./mgtv";
export default ({ url, method, params, header = {}, baseURL }) => {
    baseURL = baseURL ? baseURL : process.env.VUE_APP_BASE_URL;
    return new Promise((resolve, reject) => {
        uni.request({
            url: baseURL + url,
            method,
            header,
            data: {
                ...params
            },
            success(res) {
                resolve(res.data);
            },
            fail(err) {
                reject(err);
            }
        });
    });
};

let throttle401 = true;
uni.addInterceptor('request', {
    // 请求前
    invoke(args) {
        let token = uni.getStorageSync('aToken');
        if (token && args && args.header) args.header.Authorization = "Bearer " + token;
    },
   
    // 请求成功
    success(args) {
        if ([401].includes(args.statusCode) && throttle401) {
            throttle401 = false
          
            let rt = uni.getStorageSync("rToken");
            if (rt) {
                post("v1/user/refresh_token", { refresh_token: rt }).then(res => {
                    if (!res.code) {
                        setCache("userInfo", res, 60 * 60 * 24 * 7)
                        uni.setStorageSync("aToken", res.accessToken)
                        uni.setStorageSync("rToken", res.refreshToken)
                        goto("/pages/my/loading")
                    }
                    else logout()
                })
            }
            else logout();
          
            // // #ifdef MP-WEIXIN
            // logout();
            // // #endif
            setTimeout(() => { throttle401 = true }, 3000)
        }
        if(args.statusCode==500&&args.data.message==''){
            uni.$u.toast("网络异常,请稍后重试！");
            return
        }
    },
    // 请求失败
    fail(err) {},
    // 成功|失败
    complete(res) { }
})

let logout = () => {
    uni.removeStorageSync("rToken")
    uni.removeStorageSync("aToken")
    uni.removeStorageSync("userInfo")

    uni.removeStorageSync('uuid')

    // 登出,判断是否是 是芒果环境,如果过是芒果环境,
    // 判断是否登录,如果没登录,不管他,如果登录了, 到pages/my/loading 调用 芒果登录.
    // setTimeout(() => { goto("/pages/login/login") }, 0)
    // // #ifdef MP-WEIXIN
   
    // // #endif
        setTimeout(() => { goto("/pages/my/loading") }, 0)

   
}