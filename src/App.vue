
<script>
import { mapState,mapMutations } from "vuex";
import { getMsg, getWebSocket } from "./utils/webSocket";
import { isMTVapp, mgTvIsLogin,parseQueryString } from "./utils/mgtv";
import store from "./store";

export default {
    data() {
        return {
            isAppActive: true,
        };
    },

    globalData: {
        noticeInfo: [],
        SubscriptionTemplate: "Tv5VgpGBYeGiToduHjBqHEqOpnd2vc6CTN2SRtam290",
        // SubscriptionTemplate: "aYhClohtQEmov7TRYdasMH8ZBof1AY5wRcl8Yo6LETs", // 微信消息订阅模板
        RechargeType: {
            // 充值类型（用户在什么地方支付：玩法、集市、快递...）
            Recharge: 1, // 充值
            Withdraw: 2, // 提现
            Refund: 3, // 退款
            Gacha: 100, // 玩法
            MarketOrder: 201, // 发布交易（加价求购）
            MarketOffer: 202, // 集市参与交易
            Freight: 301, // 运费
            activity: 100005,
        },
        RechargeTypeMean: {
            // 充值类型（用户在什么地方支付：玩法、集市、快递...）
            1: "储值",
            2: "退款",
            3: "退款",
            100: "抽赏",
            200: "集市交易",
            300: "运费",
            600: "商城购买",
            100000: "活动奖励",
            12: "金币储值",
            13: "金币退款",
        },
        MarketOrderState: {
            // 集市交易状态
            MarketOrderState_nil: 0,
            MarketOrderState_Open: "交易中",
            MarketOrderState_Lock: "锁定中",
            MarketOrderState_Close: "已关闭",
            MarketOrderState_Done: "已结束",
            MarketOrderState_Expire: "已过期",
            MarketOrderState_AdminClose: "已关闭",
        },
        ActivityPointType: {
            PointType_Coin: "现金支付", // 0现金支付
            PointType_Invite: "邀请返佣钱包", // 1
            PointType_Gold: "金币钱包", // 2
            PointType_Point: "积分", // 3
            PointType_AmountPoint: "现金点", // 10
            PointType_CostAwardPoint: "欧气值", // 11
            PointType_Free: "免费抽奖", //免费
            PointType_Disable: "已达上限", //禁用
        },
        ActivityPointTypeNumber: {
            PointType_Coin: 0, // 潮币钱包
            PointType_Invite: 1, // 邀请返佣钱包
            PointType_Gold: 2, // 金币钱包
            PointType_Point: 3, // 积分
            PointType_AmountPoint: 10, // 现金点（活动期间抽赏金额）
            PointType_CostAwardPoint: 11, // 欧气值
        },
        ActivityPointTypeNumbers: {
            0: "潮币钱包",
            1: "邀请返佣钱包",
            2: "金币钱包",
            3: "积分",
            10: "现金点",
            11: "欧气值",
        },
        BannerTargetType: {
            BannerTargetType_Nil: 0, // 无
            BannerTargetType_Kuji: 1, // 跳转到 一番赏 详情
            BannerTargetType_Gashapon: 2, // 跳转到 扭蛋机 详情
            BannerTargetType_ChaoPlay: 3, // 跳转到 潮游赏 详情1
            BannerTargetType_SurpriseBox: 4, // 跳转到 洞洞乐 详情
        },
        PlatForm: {
            model: 0,
            iPhone: 0,
            android: 1,
            ios: 2,
            brand: 3,
            微博: 4,
        },
        TaskUserScheduleStatus: {
            TaskUserScheduleStatus_Finished: "已完成",
            TaskUserScheduleStatus_Enable: "领取",
            TaskUserScheduleStatus_Disenable: "未完成",
        },
        AppTypeList: {
            yyb: 128, //腾讯应用宝
            xiaomi: 8, //小米
            huawei: 2, //华为
            vivo: 16,
            honor: 32, //荣耀
            baidu: 64,
            official: 1,
            360:256,
            oppo: 4,
        },
        LotteryTargetType: {
            'LotteryTargetType_Nil': 0,// 
            'LotteryTargetType_Gacha': 100,//开箱
            'LotteryTargetType_Gacha_Kuji': 101,//一番赏
            'LotteryTargetType_Gacha_Gashapon': 102,//扭蛋机
            'LotteryTargetType_Gacha_ChaoPlay': 103,//潮游赏
            'LotteryTargetType_Gacha_SurpriseBox': 104,//洞洞乐
            'LotteryTargetType_Gacha_ChaoShe': 105,//芒星赏
            'LotteryTargetType_Gacha_ShareBill': 106,//一网打尽
        },
    },
    onLaunch: function () {
          uni.setStorageSync("currentChange", 0);
         
         if(window.mgtv){
            const parmas  = mgtv.getLaunchOptionsSync()
         
             const data =parmas ? parmas.path :'';
             uni.setStorageSync('parmasPath',data);
               if(data){
                 const query = parseQueryString(data);
                 if(query && query.inviteCode){
                     uni.setStorageSync('inviteCode',query.inviteCode)
                 }
                 if(query && query.gachaName){
                     uni.setStorageSync('gachaName',query.gachaName)
                 }
                 if(query && query.gachaId){
                     uni.setStorageSync('gachaId',query.gachaId)
                 }
               }

               const query = mgtv.getLaunchOptionsSync().query;
               uni.setStorageSync('query',JSON.stringify(query));
               if(query && query.inviteCode){
                   uni.setStorageSync('inviteCode',query.inviteCode)
               }
               if(query.gachaName){
                   uni.setStorageSync('gachaName',query.gachaName)
               }
               if(query.gachaId){
                   uni.setStorageSync('gachaId',query.gachaId)
               }
             

          let isLogin = mgtv.isLogin();
          console.log(isLogin,'isLogin')
          if(!isLogin){
                uni.removeStorageSync("aToken");
                uni.removeStorageSync("rToken");
                uni.removeStorageSync("userInfo");
                uni.removeStorageSync('uuid')
                this.goto("/pages/my/loading")
           
          }else{
            if(this.userInfo){
                mgtv.getSetting({
                success(res) {
                if (!res.authSetting["scope.userProfile"]) {
                        uni.removeStorageSync("aToken");
                        uni.removeStorageSync("rToken");
                        uni.removeStorageSync("userInfo");
                        uni.removeStorageSync('uuid')
                         this.goto("/pages/my/loading")
                        // console.log('resres')
                        //  goto("/pages/my/loading")
                } else {
                    mgtv.getUserProfile({
                    success(res) {
                            const uuid = res.data.uuid;
                            const localUUid = uni.getStorageSync('uuid')
                            console.log(localUUid);
                         if(localUUid != uuid){
                            uni.removeStorageSync("aToken");
                            uni.removeStorageSync("rToken");
                            uni.removeStorageSync("userInfo");
                            uni.removeStorageSync('uuid')
                             this.goto("/pages/my/loading")
                            // goto("/pages/my/loading")
                          }

                    },
                    fail(res) {
                      
                    },
                    });
                }
                },
                fail(res) {
              
                },
            });
            }
          }
         }
  
  
        


        // #ifdef APP-PLUS
        let that = this;
        // 获取网络类型（4G,5G,wifi,none[无网络]）
        setTimeout(() => {
            uni.getNetworkType({
                success: function (res) {
                    if (res.networkType == "none") that.noneNetwork();
                },
            });
        }, 1000);
        // #endif
    },
    methods: {
        // ...mapMutations(["updateMgTvLogin"]),
    },
    onLoad() {},
    computed: { ...mapState(["popupWebSocket","userInfo"]) },
    onShow: function () {
        if (
            !this.popupWebSocket &&
            this.SystemInfo.uniPlatform == "app" &&
            uni.getStorageSync("aToken")
        ) {
            getWebSocket(this);
        }

        // if(isMTVapp()){
        //     store.dispatch('asyncUpdateMgTvLogin');
     
        // }

    },
    onHide: function () {
        let that = this;
        let closeWeb = getMsg();
        // console.log("App Hide关闭");
        if (that.popupWebSocket && that.SystemInfo.uniPlatform == "app") {
            closeWeb.close({
                success: function (res) {
                    // console.log("WebSocket关闭成功！");
                },
                fail: function (res) {
                    // console.log("WebSocket关闭失败！");
                },
            });
        }
    },
};
</script>
<style lang="scss">
@import "uview-ui/index.scss";
@import "@/static/css/common.scss";
</style>