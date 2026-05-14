import { post } from "@/utils/api.js";
import { getTimestamp } from "./fun";
import Vue from 'vue'
import store from '@/store/index'
export function callPayment(url, data, type) {
    // console.log(url, data, type);
    return new Promise(async (resolve, reject) => {
        let res = await post(url, data);
        // console.log(res,'res');
        if (!res.code) {
            if (type == 0) {
                resolve(res)
                return
            }
            let orderInfo
            let { appId, nonce, partnerId, payId, platformPreId, sign, timestamp, } = res.createPaymentReply || res;
            if (type == 1) {
                orderInfo = platformPreId;
            } else if (type == 2) {
                orderInfo = {
                    // #ifdef APP-ANDROID
                    appid: appId,
                    // #endif
                    // #ifdef APP-IOS
                    appId,
                    // #endif
                    noncestr: nonce,
                    package: "Sign=WXPay",
                    partnerid: partnerId,
                    prepayid: platformPreId,
                    timestamp: timestamp,
                    sign: sign,
                };
            } else if (type == 3) {
                orderInfo = {
                    appId: appId,
                    timeStamp: timestamp,
                    nonceStr: nonce,
                    package: platformPreId,
                    signType: "RSA",
                    paySign: sign,
                };
            }
            let a = { res, orderInfo }
            resolve(a)
        } else {
            uni.$u.toast(res.message);
            resolve(res)
        }
    })

}

export function getGachasList(url, data) {
    return new Promise(async (resolve, reject) => {
        let arr1 = [], arr2 = [], list = [];
        let res = await post(url, data);
        if (url == 'v1/activity/cost-award/list') {
            res.config.map((item) => {
                if (item.itemList.length) {
                    if (item.startTime !== "")
                        item.startTime = getTimestamp(item.startTime);
                    if (item.endTime !== "")
                        item.endTime = getTimestamp(item.endTime);
                    list.push(item);
                    resolve({ list, total: res.total || 0 })
                }
            });
        } else {
            res.gachas.map((item) => {
                if (item.state == 1) {
                    arr1.push(item);
                } else {
                    arr2.push(item);
                }
            });
            list = [
                ...arr1
                    .sort((a, b) => b.startTime - a.startTime)
                    .slice(-2),
                ...arr2,
            ];
            resolve({ list, total: res.total || 0 })
        }



    })

}
// export function Postpayment(data = {}, num = 0, special = 0) {
//     const {
//         specialDiscountPrice,
//         discountPrice,
//         state,
//         price,
//         specialDiscountLimitBetNum, id, couponId
//     } = data.gacha;
//     const { leftAwards, boxIndex } = data.gachaBox;
//     if (data.gachaBox && (leftAwards <= 0 || state == 3)) {
//         uni.$u.toast("该箱已售罄，请选择其他箱子");
//         return {}
//     } else {
//         let money = discountPrice ? discountPrice : price;
//         let number = leftAwards < num ? leftAwards : num;
//         let m;
//         let discount;
//         if ((leftAwards < specialDiscountLimitBetNum && special) || !special
//         ) {
//             discount = true
//             m = Vue.prototype.$h.Mul(number, money);
//         } else if (special==1
//         ) {
//             discount = false
//             m = Vue.prototype.$h.Mul(number - 1, money) + specialDiscountPrice;
//         } else if (special==2){
//             discount = false
//             m=money
//         }else if (special==3){
//             discount = false
//             m = Vue.prototype.$h.Mul(number, money);
//         }
//         // console.log(number,m,discount);
//         return { number: number, m: Number(m.toFixed(2)), discount }
//     }
// }
// store.commit("UppayMessage", { discount: false })
export function Postpayment(data = {}, num = 0, special = 0) {
    const {
        specialDiscountPrice,
        discountPrice,
        state,
        price,
        specialDiscountLimitBetNum, id, couponId
    } = data.gacha;
    const { leftAwards, boxIndex } = data.gachaBox;
    // 处理无限库存情况：leftAwards === -1 表示无限库存，不触发售罄，数量不限制
    if (data.gachaBox && leftAwards !== -1 && (leftAwards <= 0 || state == 3)) {
        uni.$u.toast("该箱已售罄，请选择其他箱子");
        return {};
    } else {
        let money = discountPrice ? discountPrice : price;
        // 计算可购买数量：无限库存时直接取 num，否则取 min
        let number = leftAwards === -1 ? num : (leftAwards < num ? leftAwards : num);
        let m;
        let discount;
        if ((leftAwards < specialDiscountLimitBetNum && special) || !special) {
            discount = true;
            m = Vue.prototype.$h.Mul(number, money);
        } else if (special == 1) {
            discount = false;
            m = Vue.prototype.$h.Mul(number - 1, money) + specialDiscountPrice;
        } else if (special == 2) {
            discount = false;
            m = money;
        } else if (special == 3) {
            discount = false;
            m = Vue.prototype.$h.Mul(number, money);
        }
        return { number: number, m: Number(m.toFixed(2)), discount };
    }
}