<!-- 我的界面 -->
<template>
    <view class="my" :class="{ mpWeixin: ISmp() }">
        <div class="user_sugar flex_r flex_ac flex_jb" v-if="userInfo.name">
            <div class="user_info flex_r flex_ac">
                 <!-- @click="updateUser"  -->
               <view style="height: 164rpx;height: 164rpx;border:4rpx solid #fff;border-radius: 50%;position: relative;">
                 <image :src="userInfo.avatarUrl | active" class="profile" mode="aspectFill" />
                 <!-- <view class="edit">
                    <image
                        src="https://img.shinemang.com/gachaStatic/my/editIcon.png"
                        mode="scaleToFill"
                    />
                 </view> -->
               </view>
                <div class="info">
                    <div class="u_name">
                        <div class="ellipsis">{{ userInfo.name }}</div>

                        <!-- <div @click="
                            goto('/pages/common/rulepop', {
                                val: 'PayoutLevel',
                            }) " class="vip">
                           <view class="vip_icon" >
                         
                            <view class="class">Lv.{{ userInfo.level }}</view>
                        </view>
                       
                        </div> -->
                         <!-- <img @click="
                            goto('/pages/common/rulepop', {
                                val: 'PayoutLevel',
                            })
                            " src="https://img.shinemang.com/gachaStatic/static/img/my/shuoming.png" class="shuoming" /> -->
                    </div>
                    <view class="user_name">
                        <div @click="copy" class="u_ID">ID: <span :style="{textDecoration: 'underline'}">{{ userInfo.id || "" }}</span></div>
                        <!-- 先出现不需要 -->
                     
                        <!-- #endif -->
                    </view>
                </div>
            </div>
            <!-- <div class="editInfo" @click="updateUser">编辑资料</div> -->
        </div>
        <!-- <div class="user_sugar" v-else>
            <div class="user_info flex_r flex_ac">
                <image class="profile" mode="aspectFill" />
                <div class="login_btn" @click="login">
                    请登录
                </div>
            </div>
        </div> -->
          <div class="top_cord">
                <div class="tit flex_r flex_ac flex_jb">
                    <view
                        class="t_msg1 flex_r flex_ac"
                        @click="
                            goto('/pages/common/rulepop', {
                                val: 'ServiceAgreement',
                            })
                        "
                        >余额<view class="ico"></view
                    ></view>
                    <view class="t_msg flex_r flex_ac" @click="goRechargeRecord"
                        ><view>交易记录</view> <view class="ico"></view
                    ></view>
                </div>
                <div class="B_num flex_r flex_jb flex_ac">
                    <!-- <img
                        src="https://img.shinemang.com/gachaStatic/static/img/pay/gold.png"
                        class="m_ico"
                    /> -->
                    <div class="m_num">
                        <div style="font-size: 24rpx;">星光积分</div>

                        {{ point || "0.00" }}
                    </div>
                    <div class="m_num1">
                         <div style="font-size: 24rpx;">星币</div>
                        {{ userInfo.xCoin || "0.00" }}</div>
                </div>
                <!-- <view class="nums">1金币={{isIos?'0.75':'1'}}元RMB</view> -->
                <!-- <div class="btns" @click="onClickWithdrawal">申请退款</div> -->
          </div>
        <div class="module_bar">
            <!-- #ifndef MP-WEIXIN -->
            <!-- <div class="gold flex_r flex_ac flex_jb" @click="userInfo.id ? goto('/page-a/balance/topUp') : null">
                <div class="gold_num">
                    <span>我的账户</span>
                    <view style="font-size: 32rpx;margin-top: 12rpx;"> {{ balance }}</view>
                </div>
                <div class="withdraw_btn flex_r flex_ac flex_jc">
                    <view></view>
                    <view class="icof"></view>
                </div>
            </div> -->
            <div class="grid_bar">
                <div class="grid_jy">
                    <div :style="{
                        backgroundImage: 'url(' + i.bgUrl + ')',
                    }" class="jy-item" v-for="(i, s) in baseList1" @click="goto(i.path)" :key="s" >
                      
                    </div>
                </div>
            
            </div>
        </div>
        <!-- <button class="invite_bar" open-type="share" id="invite"></button> -->
        <!-- <button class="invite_bar" @click="goto('/page-activity/invite/index')"></button>  -->
        <div class="grid_bar">
            <!-- v-if="!userInfo.isAuthenticated && i.title === '实名认证' || i.title !== '实名认证'" -->
            <!-- <div class="grid_tit">常用功能</div> -->
            <view class="grid_content">
                <view  @click="topGrid(i)" v-for="(i, s) in baseList2" :key="s" class="x_grid"  >
                    <view class="leftIcon">
                        <view class="icon"
                         :style="{
                            backgroundImage:'url('+i.name+')'
                         }"
                        ></view>
                        <!-- <u-icon :name="i.name" :size="22" ></u-icon> -->
                    <text class="ellipsis">{{ i.title }}</text>
                    </view>
                    <view>
                       <u-icon color="#B3B3B3" name="arrow-right"></u-icon>
                    </view>
                </view>
            </view>
        </div>
        <!-- #ifdef MP-WEIXIN -->
        <div class="AD_bar">
            <img @click="downShow = true" src="https://img.shinemang.com/gachaStatic/static/img/my/download-app.png" class="AD_img" />
        </div>
        <!-- #endif -->
        <!-- <div class="ver_bar">
            <div>当前版本 {{ appversion }}</div>
        </div> -->
        <!-- 下载app弹窗-->
        <x-modal :visible.sync="downShow" />
        <!-- 公共弹窗提示组件 -->
        <show-modal></show-modal>
        <autonym @onAutonym="onAutonym" ref="autonym" :visible="showAutonym" />
    </view>
</template>
<script>
import { activityLIst } from "@/utils/api.js";
import { mapState, mapActions } from "vuex";
import xModal from "@/components/modules/x-modal";
import { getMsg } from "../../utils/webSocket";
import { service } from '@/utils/fun.js';
import { integralPrice } from "@/utils/getData.js";
import autonym from "@/components/autonym/index.vue";
import { mgTvLogin,MGTV_Channel } from "../../utils/mgtv";
import { copyCode, goto } from '../../utils/fun';

let that;
export default {
    data() {
        return {
             point:0,
            balance: 0,
            baseList1: [
                {
                    name: "https://img.shinemang.com/gachaStatic/static/img/my/ico10.png",
                    path: "/pages/my/drawRecord",
                    title: "抽赏记录",
                    bgUrl:"https://img.shinemang.com/gachaStatic/my/recordsBgc.png",
                },
                {
                    name: "https://img.shinemang.com/gachaStatic/static/img/my/ico11.png",
                    path: "/pages/my/releaseRecord",
                    title: "发货订单",
                     bgUrl:"https://img.shinemang.com/gachaStatic/my/orderBgc.png",
                },
            ],
            baseList2: [
                {
                    name: "https://img.shinemang.com/gachaStatic/my/addressIcon.png",
                    path: "/pages/shipments/addressList",
                    title: "地址管理",
                },
               {
                    name: 'https://img.shinemang.com/gachaStatic/zhuanzeng.png',
                    path: '/page-a/balance/transferGift',
                    title: '转赠记录'
                },
                // {
                //     name: 'https://img.shinemang.com/gachaStatic/static/img/my/ico3.png',
                //     path: '/pages/index/index',
                //     title: '常见问题'
                // },
               {
                    name: "https://img.shinemang.com/gachaStatic/my/myCardsIcon.png",
                    path: "/pages/my/cardpack",
                    // path:'/page-a/couponPackage/discountCoupon',
                    title: "我的卡包",
                },
                //  {
                //     name: "https://img.shinemang.com/gachaStatic/my/exchangeIcon.png",
                //     path: "/page-activity/conversion/index",
                //     title: "福利兑换",
                // },
                  {
                    name: "https://img.shinemang.com/gachaStatic/my/centerIcon.png",
                    path: '/page-a/luck/index',
                    title: "进阶中心",
                },
                // {
                //     name: "https://img.shinemang.com/gachaStatic/static/img/my/ico4.png",
                //     path: "/pages/index/index",
                //     title: "联系客服",
                // },

                {
                    name: "https://img.shinemang.com/gachaStatic/my/aboutUsIcon.png",
                    path: "/pages/my/agreementList",
                    title: "关于我们",
                    id: 1
                },
                // {
                //     name: 'https://img.shinemang.com/gachaStatic/static/img/my/ico6.png',
                //     path: '/pages/index/index',
                //     title: '隐私设置'
                // },

                // {
                //     name: "https://img.shinemang.com/gachaStatic/static/img/my/ico8.png",
                //     path: "/pages/index/index",
                //     title: "Double Chance",
                // },
               
              
              
                // {
                //     name: "https://img.shinemang.com/gachaStatic/my/loginOutIcon.png",
                //     path: "/pages/index/index",
                //     title: "注销账户",
                // },
                // {
                //     name: "https://img.shinemang.com/gachaStatic/static/img/my/vibrate.png",
                //     path: "/pages/my/agreementList",
                //     title: "手机震动",
                //     id: 2
                // },
                // {
                //     name: "https://img.shinemang.com/gachaStatic/static/img/my/ico7.png",
                //     path: "/page-activity/welfare/index",
                //     title: "任务活动",
                // },
                // {
                //     name: "https://img.shinemang.com/gachaStatic/static/img/my/ico17.png",
                //     // path:"/pages/my/agreementList",
                //     title: "实名认证",
                // },
            ],
            downShow: false,
            appversion: this.appversion,
            showAutonym: false,
            // closeAutonym: false,
        };
    },
    components: { xModal, autonym },
    // ,"isMTVLogin"
    computed: { ...mapState(["userInfo", "popupWebSocket"]) },
    created() {
        that = this;
       
        this.asyncUpBalance();
         this.asyncUpdateInfo();
         integralPrice().then((res)=>{
            this.point = res.point
         })

          if(this.userInfo.featureConfig && this.userInfo.featureConfig.donation != 'FeatureFlag_Enable' && this.userInfo.featureConfig.donation != 'FeatureFlag_AdminOpen'){
            this.baseList2.splice(1,1)
          }

    },
    mounted() {
        this.balance = this.userInfo.gold;
        //  #ifdef MP-WEIXIN
        this.getAv();
        // #endif
    },
    methods: {
        copy(){
            copyCode(this.userInfo.id)
        },
        goRechargeRecord(){
          this.goto("/page-a/balance/rechargeRecord");
        },
        ...mapActions(["asyncUpdateInfo", "asyncUpBalance"]),
        tabload() {
            // this.asyncUpBalance();
        },
        login(){
            // if(!this.isMTVLogin){
            //     mgTvLogin()
            //     return;
            // }
            goto('/pages/login/login')
        },
        async getAv() {
            let a = await activityLIst({ key: ["Task"] });
            if (a.activities[0].open) {
                this.baseList2.splice(5, 0, {
                    name: "https://img.shinemang.com/gachaStatic/static/img/my/ico14.png",
                    path: "/page-activity/welfare/index",
                    title: "任务活动",
                });
            }
        },
        topGrid(da) {
            if (da.title == "联系客服") {
                service();
            } else if (da.title == "Double Chance") this.towxmp();
            else if (da.title == "注销账户") this.logOut();
            else if (da.title == "实名认证") {
                if (!this.userInfo.isAuthenticated) {
                    this.showAutonym = !this.userInfo.isAuthenticated; // 是否已实名认证;
                    return;
                }
                uni.$u.toast("您已实名~");
            }
            else this.goto(da.path, { id: da.id });
        },
        towxmp() {
            // #ifdef APP-PLUS
            plus.share.getServices(
                function (res) {
                    var sweixin = null;
                    for (var i = 0; i < res.length; i++) {
                        var t = res[i];
                        if (t.id == "weixin") {
                            sweixin = t;
                        }
                    }
                    if (sweixin) {
                        sweixin.launchMiniProgram({
                            id: "gh_4dfbf919443c", // 万代小程序的原始ID
                            type: 0,
                        });
                    }
                },
                function (res) {
                    console.log(JSON.stringify(res));
                }
            );
            // #endif
            // #ifdef MP-WEIXIN
            uni.navigateToMiniProgram({
                appId: "wx79bfd4624aebfa22", // 万代小程序的 appId
                success(res) { },
                fail(err) { },
            });
            // #endif
        },
        logOut() {
            let closeWeb = getMsg();
            this.$showModal({
                title: "操作提示",
                content: "您确定要退出当前账号么？",
                success(res) {
                    if (res.confirm) {
                        uni.removeStorageSync("aToken");
                        uni.removeStorageSync("rToken");
                        uni.removeStorageSync("userInfo");
                        uni.removeStorageSync('uuid')
                        that.$store.commit("updateInfo", {});
                    }
                    if (
                        that.popupWebSocket &&
                        that.SystemInfo.uniPlatform == "app"
                    ) {
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
            });
        },
        updateUser() {
            // if(!this.isMTVLogin){
            //     mgTvLogin()
            // }

            this.goto("/pages/my/updateUser");
        },
        async onAutonym() {
            this.showAutonym = false;
            // let a = await post("v1/user/self/get", {
            //     user_id: this.userInfo.id,
            // });
            // this.closeAutonym = a.isAuthenticated;
            // if (this.closeAutonym) this.onClickRelTransaction();
        },
    },
    watch: {
        "$store.state.userInfo.gold": {
            handler(newVal) {
                this.balance = newVal;
            },
        },
    },
};
</script>
<style lang='scss' scoped>
  .top_cord {
        width: 686rpx;
        height: 264rpx;
        background-image: url("https://img.shinemang.com/gachaStatic/my/rechargeBgc.png");
        background-size: 100% 100%;
        padding: 32rpx;
        margin: 36rpx auto 0;
        margin-bottom: 24rpx;
        color: #1A1A1A;
        font-weight: 500;
        font-size: 24rpx;
        position: relative;

        .tit {
            font-weight: 500;
            font-size: 28rpx;
            .t_msg1 {
                .ico {
                    margin-left: 8rpx;
                    width: 24rpx;
                    height: 24rpx;
                    background-image: url("https://img.shinemang.com/gachaStatic/my/rechargeTips.png");
                    background-size: 100% 100%;
                }
            }
            .t_msg {
                font-weight: 500;
                font-size: 24rpx;
                color: #fff;
                margin-top: -24rpx;
                display: flex;
                align-items: center;
              
                .ico {
                    margin-left: 8rpx;
                    width: 32rpx;
                    height: 32rpx;
                    background-image: url("https://img.shinemang.com/gachaStatic/my/toIcon.png");
                    background-size: 100% 100%;
                    margin-top: 6rpx;
                }
            }
        }

        .B_num {
            margin: 50rpx 0 8rpx;

            .m_ico {
                width: 48rpx;
                height: 48rpx;
                margin-right: 16rpx;
            }

            .m_num {
                font-weight: bold;
                font-size: 48rpx;
              
                // &::after {
                //     content: "星光积分";
                //     font-weight: 500;
                //     font-size: 24rpx;
                //     margin-left: 8rpx;
                // }
            }
            .m_num1{
                 font-weight: bold;
                font-size: 48rpx;
                text-align: right;
              
                // &::after {
                //     content: "星币";
                //     font-weight: 500;
                //     font-size: 24rpx;
                //     margin-left: 8rpx;
                // }
            }
        }
        .nums {
            // text-align: center;
            margin-bottom: 32rpx;
            color: #266B59;
            font-size: 24rpx;
        }
        .btns {
            // margin: auto;
            // width: 220rpx;
            // height: 64rpx;
            // line-height: 64rpx;
            // text-align: center;
            // font-weight: bold;
            // font-size: 28rpx;
            // color: #000000;
            // background: #fff;
            // border-radius: 32rpx;
            width: 160rpx;
            height: 56rpx;
            background: #1A1A1A;
            border-radius: 28rpx 28rpx 28rpx 28rpx;
            font-size: 28rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            position: absolute;
            top: 168rpx;
            right: 32rpx;

        }
   }
.my {
    width: 100vw;
    height: 100vh;
    position: relative;
    padding: 120rpx 32rpx 190rpx;
    overflow-y: auto;
    background-color: #F5F6F8;
      &::after {
        content: "";
        width: 100vw;
        height: 800rpx;
        left: 0;
        top: 0;
        position: absolute;
        z-index: 1;
        background: url('https://img.shinemang.com/gachaStatic/my/bg.png');
        background-size: 100% 100%;
      }
      >div{
          position: relative;
          z-index: 2;
      }
    &.mpWeixin {
        // padding-top: 160rpx;
    }
}

.user_sugar {
    padding-top: 20rpx;
    .user_info {
        .profile {
            width: 160rpx;
            height: 160rpx;
            border-radius: 50%;
            // border: 4rpx solid #fff;
        }
        .edit{
            position: absolute;
            width: 48rpx;
            height: 48rpx;
            background: #FFFFFF;
            border-radius:50%;
            bottom: 0;
            right: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            image{
                width: 32rpx;
                height: 32rpx;
            }
        }

        .info {
            margin-left: 16rpx;
        }

        .u_name {
            font-size: 40rpx;
            font-weight: 800;
            margin-bottom: 8rpx;
            color: #1A1A1A;
            max-width: 500rpx;
            display: flex;
            align-items: center;
            // justify-content: center;
            .vip{
                width: 116rpx;
                height: 56rpx;
                background: url('https://img.shinemang.com/gachaStatic/my/vipBgc.png');
                background-size: 100% 100%;
                margin-left: 16rpx;
                color:#7E4904;
                font-size: 24rpx;
                padding-right: 16rpx;
                display: flex;
                align-items: center;
                justify-content: flex-end;

            }

        }

        .user_name {
            display: flex;
            // align-items: flex-end;

            .u_ID {
                color: #1A1A1A;
                font-size: 28rpx;
                font-weight: bold;
            }

            .vip_icon {
                width: 79.2rpx;
                height: 28.8rpx;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 40rpx;
                border: 0;
                margin-left: 20rpx;
                position: relative;

                .icon {
                    position: absolute;
                    width: 60rpx;
                    height: 60rpx;
                    top: -22rpx;
                    left: -18rpx;
                }

                .class {
                    position: absolute;
                    font-size: 20rpx;
                    top: 0;
                    right: 10rpx;
                }
            }

            .shuoming {
                margin-left: 5rpx;
                width: 30rpx;
                height: 30rpx;
            }
        }
    }

    .editInfo {
        color: #fff;
        width: 132rpx;
        font-size: 24rpx;
        text-align: center;
        height: 50rpx;
        line-height: 50rpx;
        border-radius: 28rpx;
        background: linear-gradient(180deg,
                rgba(#9181e5, 0.5) 0%,
                rgba(#5a45c8, 0.5) 100%);
    }

    .login_btn {
        width: 180rpx;
        height: 60rpx;
        line-height: 60rpx;
        text-align: center;
        background: linear-gradient(180deg, #9181e5 0%, #5a45c8 100%);
        border-radius: 40rpx;
        font-size: 24rpx;
        color: #fff;
        margin-left: 36rpx;
    }
}

.grid_bar {
    margin-top: 24rpx;
    // padding: 30rpx 0 0;
    // background-color: #fff;
    // border-radius: 16rpx;

    .grid_tit {
        font-weight: bold;
        font-size: 28rpx;
        padding: 26rpx 36rpx 28rpx;
    }

    .grid_jy {
        display: flex;
        // padding: 0rpx 80rpx 28rpx;
        justify-content: space-between;

        // width: 686rpx;
        // height: 196rpx;
        .jy-item {
            width: 334rpx;
            height: 160rpx;
            background-size: 100% 100%;

            // .jy-img {
            //     width: 60rpx;
            //     height: 60rpx;
            //     object-fit: contain;
            // }

            // .jy-text {
            //     margin-left: 30rpx;
            //     padding-top: 10rpx;
            //     font-size: 24rpx;
            //     font-weight: 500;
            // }
        }
    }

    .grid-text {
        padding-top: 10rpx;
        font-size: 24rpx;
        font-weight: 500;
    }
.grid_content{
    background-color: #fff;
    border-radius: 24rpx;
    padding: 0 24rpx;
}
    .x_grid {
        // margin-bottom: 36rpx;
        display: flex;
        align-items: center;
        height: 112rpx;
        justify-content: space-between;
        .leftIcon{
            display: flex;
            align-items: center;
            color: #1A1A1A;
            font-size: 28rpx;
            font-weight: bold;

            .icon{
                width: 40rpx;
                height: 40rpx;
                background-size: 100% 100%;
                margin-right: 24rpx;
            }

        }
    }
}

.module_bar {
    margin: 40rpx 0 20rpx;

    .gold {
        width: 100%;
        height: 152rpx;
        background-image: url("https://img.shinemang.com/gachaStatic/my/balanceBgc.png");
        background-size: 100% 100%;
        padding: 24rpx 32rpx;
        position: relative;

        .gold_num {
            font-size: 28rpx;
            color: #fff;
            font-weight: bold;
        }

        .gold_ico {
            width: 40rpx;
            height: 40rpx;
            margin-right: 10rpx;
        }

        .withdraw_btn {
            width: 150rpx;
            height: 60rpx;
            position: absolute;
            right: 10rpx;
            top: 10rpx;
            // background-color: #fff;
            // border-radius: 26rpx;
            // font-weight: bold;
            // font-size: 24rpx;
            // color: #865bf2;

            // .icof {
            //     width: 32rpx;
            //     height: 32rpx;
            //     background-image: url("https://img.shinemang.com/gachaStatic/static/img/my/icof.png");
            //     background-size: 100% 100%;
            // }
        }
    }

    // #ifndef MP-WEIXIN
    .grid_bar {
        // margin-top: -46rpx;
    }

    // #endif
}

.invite_bar {
    margin-bottom: 20rpx;
    height: 120rpx;
    background: url("https://img.shinemang.com/gachaStatic/static/img/activity/invite.png");
    background-size: 100% 100%;
}

.AD_bar {
    margin: 20rpx 0;
    height: 292rpx;
    display: none;

    .AD_img {
        width: 100%;
        height: 292rpx;
    }
}

.ver_bar {
    font-weight: 500;
    font-size: 24rpx;
    color: #ada9af;
    line-height: 24rpx;
    text-align: center;
    padding: 60rpx 0 20rpx;
}
</style>