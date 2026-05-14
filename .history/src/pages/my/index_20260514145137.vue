
<template>
    <view class="my" :class="{ mpWeixin: ISmp() }">
        <div class="user_sugar flex_r flex_ac flex_jb" v-if="userInfo.name">
            <div class="user_info flex_r flex_ac">
                <image :src="userInfo.avatarUrl | active" class="profile" mode="aspectFill" />
                <div class="info">
                    <div class="u_name">{{ userInfo.name }}</div>
                    <view class="user_name">
                        <div class="u_ID">潮社ID：{{ userInfo.id || "" }}</div>
                        <!-- #ifndef MP-WEIXIN -->
                        <view class="vip_icon" @click="
                            goto('/pages/common/rulepop', {
                                val: 'PayoutLevel',
                            })
                            ">
                            <img class="icon"
                                :src="`https://img.chaoshewang.com/static/img/my/Lv.${userInfo.level}.png`" />
                            <view class="class">Lv.{{ userInfo.level }}</view>
                        </view>
                        <img @click="
                            goto('/pages/common/rulepop', {
                                val: 'PayoutLevel',
                            })
                            " src="https://img.chaoshewang.com/static/img/my/shuoming.png" class="shuoming" />
                        <!-- #endif -->
                    </view>
                </div>
            </div>
            <div class="editInfo" @click="updateUser">编辑资料</div>
        </div>
        <div class="user_sugar" v-else>
            <div class="user_info flex_r flex_ac">
                <image class="profile" mode="aspectFill" />
                <div class="login_btn" @click="goto('/pages/login/login')">
                    请登录
                </div>
            </div>
        </div>
        <div class="module_bar">
            <!-- #ifndef MP-WEIXIN -->
            <div class="gold flex_r flex_ac flex_jb" @click="userInfo.id ? goto('/page-a/balance/topUp') : null">
                <div class="gold_num flex_r flex_ac">
                    <img src="https://img.chaoshewang.com/static/img/pay/gold.png" class="gold_ico" />
                    <span>我的账户: {{ balance }}</span>
                </div>
                <div class="withdraw_btn flex_r flex_ac flex_jc">
                    <view>充值</view>
                    <view class="icof"></view>
                </div>
            </div>
            <!-- #endif -->
            <div class="grid_bar">
                <div class="grid_tit">我的交易</div>
                <div class="grid_jy">
                    <div class="jy-item" v-for="(i, s) in baseList1" @click="goto(i.path)" :key="s" >
                        <img class="jy-img" :src="i.name" />
                        <text class="jy-text">{{ i.title }}</text>
                    </div>
                </div>
                <!-- <u-grid :border="false"  :col='2'>
                    <u-grid-item
                        v-for="(i, s) in baseList1"
                        :key="s"
                        class="x_grid"
                        @click="goto(i.path)"
                    >
                        <u-icon :name="i.name" :size="30"></u-icon>
                        <text class="grid-text ellipsis">{{ i.title }}</text>
                    </u-grid-item>
                </u-grid> -->
            </div>
        </div>
        <!-- <button class="invite_bar" open-type="share" id="invite"></button> -->
        <!-- <button class="invite_bar" @click="goto('/page-activity/invite/index')"></button>  -->
        <div class="grid_bar">
            <div class="grid_tit">常用功能</div>
            <u-grid :border="false" col="4">
                <u-grid-item @click="topGrid(i)" v-for="(i, s) in baseList2" :key="s" class="x_grid"  v-if="!userInfo.isAuthenticated && i.title === '实名认证' || i.title !== '实名认证'">
                    <u-icon :name="i.name" :size="22" ></u-icon>
                    <text class="grid-text ellipsis">{{ i.title }}</text>
                </u-grid-item>
            </u-grid>
        </div>
        <!-- #ifdef MP-WEIXIN -->
        <div class="AD_bar">
            <img @click="downShow = true" src="https://img.chaoshewang.com/static/img/my/download-app.png" class="AD_img" />
        </div>
        <!-- #endif -->
        <div class="ver_bar">
            <div>当前版本 {{ appversion }}</div>
        </div>
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
import autonym from "@/components/autonym/index.vue";
let that;
export default {
    data() {
        return {
            balance: 0,
            baseList1: [
                {
                    name: "https://img.chaoshewang.com/static/img/my/ico10.png",
                    path: "/pages/my/drawRecord",
                    title: "抽赏记录",
                },
                {
                    name: "https://img.chaoshewang.com/static/img/my/ico11.png",
                    path: "/pages/my/releaseRecord",
                    title: "发货订单",
                },
            ],
            baseList2: [
                {
                    name: "https://img.chaoshewang.com/static/img/my/ico1.png",
                    path: "/pages/shipments/addressList",
                    title: "地址管理",
                },
                // {
                //     name: 'https://img.chaoshewang.com/static/img/my/ico2.png',
                //     path: '/pages/index/index',
                //     title: '进群交流'
                // },
                // {
                //     name: 'https://img.chaoshewang.com/static/img/my/ico3.png',
                //     path: '/pages/index/index',
                //     title: '常见问题'
                // },

                {
                    name: "https://img.chaoshewang.com/static/img/my/ico4.png",
                    path: "/pages/index/index",
                    title: "联系客服",
                },

                {
                    name: "https://img.chaoshewang.com/static/img/my/ico5.png",
                    path: "/pages/my/agreementList",
                    title: "关于我们",
                    id: 1
                },
                // {
                //     name: 'https://img.chaoshewang.com/static/img/my/ico6.png',
                //     path: '/pages/index/index',
                //     title: '隐私设置'
                // },

                {
                    name: "https://img.chaoshewang.com/static/img/my/ico8.png",
                    path: "/pages/index/index",
                    title: "Double Chance",
                },
                {
                    name: "https://img.chaoshewang.com/static/img/my/ico15.png",
                    path: "/page-activity/conversion/index",
                    title: "福利兑换",
                },
                {
                    name: "https://img.chaoshewang.com/static/img/my/ico13.png",
                    path: "/pages/my/cardpack",
                    // path:'/page-a/couponPackage/discountCoupon',
                    title: "我的卡包",
                },
                {
                    name: "https://img.chaoshewang.com/static/img/my/ico16.png",
                    path: '/page-a/luck/index',
                    title: "集赏中心",
                },
                {
                    name: "https://img.chaoshewang.com/static/img/my/ico12.png",
                    path: "/pages/index/index",
                    title: "注销账户",
                },
                {
                    name: "https://img.chaoshewang.com/static/img/my/vibrate.png",
                    path: "/pages/my/agreementList",
                    title: "手机震动",
                    id: 2
                },
                // {
                //     name: "https://img.chaoshewang.com/static/img/my/ico7.png",
                //     path: "/page-activity/welfare/index",
                //     title: "任务活动",
                // },
                {
                    name: "https://img.chaoshewang.com/static/img/my/ico17.png",
                    // path:"/pages/my/agreementList",
                    title: "实名认证",
                },
            ],
            downShow: false,
            appversion: this.appversion,
            showAutonym: false,
            // closeAutonym: false,
        };
    },
    components: { xModal, autonym },
    computed: { ...mapState(["userInfo", "popupWebSocket"]) },
    created() {
        that = this;
        this.asyncUpdateInfo();
        this.asyncUpBalance();
    },
    mounted() {
        this.balance = this.userInfo.gold;
        //  #ifdef MP-WEIXIN
        this.getAv();
        // #endif
    },
    methods: {
        ...mapActions(["asyncUpdateInfo", "asyncUpBalance"]),
        tabload() {
            // this.asyncUpBalance();
        },
        async getAv() {
            let a = await activityLIst({ key: ["Task"] });
            if (a.activities[0].open) {
                this.baseList2.splice(5, 0, {
                    name: "https://img.chaoshewang.com/static/img/my/ico14.png",
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
.my {
    width: 100vw;
    height: 100vh;
    position: relative;
    padding: 120rpx 36rpx 130rpx;
    overflow-y: auto;

    &.mpWeixin {
        padding-top: 160rpx;
    }
}

.user_sugar {
    .user_info {
        .profile {
            width: 150rpx;
            height: 150rpx;
            border-radius: 50%;
            border: 4rpx solid #fff;
        }

        .info {
            margin-left: 16rpx;
        }

        .u_name {
            font-size: 32rpx;
            font-weight: 800;
            margin-bottom: 26rpx;
        }

        .user_name {
            display: flex;
            align-items: flex-end;

            .u_ID {
                color: #818181;
                font-size: 20rpx;
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
    // padding: 30rpx 0 0;
    background-color: #fff;
    border-radius: 16rpx;

    .grid_tit {
        font-weight: bold;
        font-size: 28rpx;
        padding: 26rpx 36rpx 28rpx;
    }

    .grid_jy {
        display: flex;
        padding: 0rpx 80rpx 28rpx;
        justify-content: space-between;

        // width: 686rpx;
        // height: 196rpx;
        .jy-item {
            display: flex;

            .jy-img {
                width: 60rpx;
                height: 60rpx;
                object-fit: contain;
            }

            .jy-text {
                margin-left: 30rpx;
                padding-top: 10rpx;
                font-size: 24rpx;
                font-weight: 500;
            }
        }
    }

    .grid-text {
        padding-top: 10rpx;
        font-size: 24rpx;
        font-weight: 500;
    }

    .x_grid {
        margin-bottom: 36rpx;
    }
}

.module_bar {
    margin: 80rpx 0 20rpx;

    .gold {
        width: 100%;
        height: 135rpx;
        background-image: url("https://img.chaoshewang.com/static/img/my/gold_coin2.png");
        background-size: 100% 100%;
        padding: 0 36rpx 46rpx;

        .gold_num {
            font-size: 32rpx;
            color: #fff;
            font-weight: bold;
        }

        .gold_ico {
            width: 40rpx;
            height: 40rpx;
            margin-right: 10rpx;
        }

        .withdraw_btn {
            width: 122rpx;
            height: 44rpx;
            background-color: #fff;
            border-radius: 26rpx;
            font-weight: bold;
            font-size: 24rpx;
            color: #865bf2;

            .icof {
                width: 32rpx;
                height: 32rpx;
                background-image: url("https://img.chaoshewang.com/static/img/my/icof.png");
                background-size: 100% 100%;
            }
        }
    }

    // #ifndef MP-WEIXIN
    .grid_bar {
        margin-top: -46rpx;
    }

    // #endif
}

.invite_bar {
    margin-bottom: 20rpx;
    height: 120rpx;
    background: url("https://img.chaoshewang.com/static/img/activity/invite.png");
    background-size: 100% 100%;
}

.AD_bar {
    margin: 20rpx 0;
    height: 292rpx;

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