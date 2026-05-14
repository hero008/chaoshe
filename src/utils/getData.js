import { post } from "@/utils/api.js"
// 获取当前欧气值
export function  integralPrice(){
    return new Promise(async (resolve, reject) => {
        post("v1/activity/cost-award/point").then((res) => {
            resolve(res)
       });
    })
 
}
// 弹出物品详情
export function  gachaDetailsMethod(that,id){
        post("v1/goods/item/get",{item_id: id}).then((res) => {
            if(!res.code){ that.$refs.gachaDetails.open(res,0)}
            else return
    })
}
