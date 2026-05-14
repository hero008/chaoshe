<template>
    <view class="balance">
        <x-navbar tit="金币充值" />
        <div class="balance_con">
            <div class="top_cord">
                <div class="tit flex_r flex_ac flex_jb">
                    <view
                        class="t_msg1 flex_r flex_ac"
                        @click="
                            goto('/pages/common/rulepop', {
                                val: 'ServiceAgreement',
                            })
                        "
                        >当前金币<view class="ico"></view
                    ></view>
                    <view class="t_msg flex_r flex_ac" @click="goRechargeRecord"
                        >交易记录 <view class="ico"></view
                    ></view>
                </div>
                <div class="B_num flex_r flex_ac flex_jc">
                    <img
                        src="https://img.chaoshewang.com/static/img/pay/gold.png"
                        class="m_ico"
                    />
                    <div class="m_num">{{ gold || "0.00" }}</div>
                </div>
                <view class="nums">1金币=1元RMB</view>
                <div class="btns" @click="onClickWithdrawal">申请退款</div>
            </div>
            <div class="bill_log">
                <div class="tit flex_r flex_ac">
                    <span>请选择充值金额:</span
                    ><span class="tit1">(余额可支持提现退款)</span>
                </div>
                <div class="box">
                    <view
                        class="list_item flex_c flex_ac flex_jc"
                        v-for="(i, s) in topUpList"
                        :key="s"
                        :class="{ active: topUp.id == i.id }"
                        @click="getPayNum(i)"
                        ><view class="pr"></view
                        ><view>{{ i.amount }}</view></view
                    >
                </div>
                <view class="text"
                    >1、充值的<span class="co">潮社金币</span>可用于<span
                        class="co"
                        >购买潮社平台在售盲盒商品</span
                    >，1潮社金币等于1元钱;<br />
                    2、充值的潮社金币不会过期，支付后的<span class="co"
                        >剩余潮社金币支持提现退款</span
                    >，但不可转赠他人;<br />
                    3、未成年人消费需事先取得家人或法定监护人的陪同及监管下进行消费;<br />
                    4、充值前请您仔细阅读<span class="co"
                        >《购买协议&隐私条款》</span
                    >，成功充值即代表您对本协议无异议</view
                >
            </div>
        </div>
        <view class="foot-btn">
            <div class="appoint flex_r">
                <div
                    class="select"
                    @click="showAnimation = !showAnimation"
                    :class="{ active: showAnimation }"
                ></div>
                <div class="text">
                    本人已满18周岁且具备完全行为能力，充值即代表同意<span
                        class="cr"
                        @click="
                            goto('/pages/common/rulepop', {
                                val: 'ServiceAgreement',
                            })
                        "
                        >《购买协议》</span
                    >及
                    <span
                        class="cr"
                        @click="
                            goto('/pages/common/rulepop', {
                                val: 'PrivacyClause',
                            })
                        "
                        >《隐私条款》</span
                    >
                </div>
            </div>
            <div class="pays">
                <div class="pay_item flex_r flex_jb flex_ac">
                    <div class="pay_name flex_r flex_ac">
                        <img
                            :src="`https://img.chaoshewang.com/static/img/pay/${payItem.img}.png`"
                            class="pay_ico"
                        />{{ payItem.msg
                        }}<view class="t_msg flex_r flex_ac" @click="getSelect"
                            >更多支付 <view class="ico"></view
                        ></view>
                    </div>
                    <div class="reduce_pay">
                        <div
                            class="select"
                            :class="{ active: payItem.show }"
                        ></div>
                    </div>
                </div>
            </div>
            <view class="all flex_r flex_jb flex_ac">
                <view class="allNum"
                    >合计：<span class="num">{{ topUp.amount }}</span></view
                >
                <view class="btn" @click="onpayDeposit">立即购买</view>
            </view>
        </view>
        <u-popup
            :show="payShow"
            bgColor="transparent"
            :safeAreaInsetBottom="false"
            :closeable="true"
            @close="payShow = false"
        >
            <view class="payShow">
                <view class="top_Back flex_r flex_ac">
                    <view class="icof Back_ico" @click="payShow = false"
                        >&#xe72c;</view
                    >
                    <view class="txt">选择支付方式</view>
                </view>
                <view class="payList">
                    <div
                        class="pay_item flex_r flex_jb flex_ac"
                        v-for="(i, s) in payList"
                        :key="s"
                        @click="onPay(i)"
                    >
                        <div class="pay_name flex_r flex_ac">
                            <img
                                :src="`https://img.chaoshewang.com/static/img/pay/${i.img}.png`"
                                class="pay_ico"
                            />{{ i.msg }}
                        </div>
                        <div class="reduce_pay">
                            <div
                                class="select"
                                :class="{ active: i.show }"
                            ></div>
                        </div>
                    </div>
                </view>
            </view>
        </u-popup>
        <popUpVue ref="popup" />
        <!-- <autonym
            @onAutonym="onClickAutonym"
            ref="autonym"
            :visible="showAutonym"
        /> -->
        <xTipsVue
            @tipsVue="onTipsVue"
            :visible="tipsShow"
            :deal="[
                { text: 'ServiceAgreement', name: '购买协议' },
                { text: 'PrivacyClause', name: '隐私条款' },
            ]"
            next="支付"
        />
    </view>
</template>
<script>
import xNavbar from "@/components/modules/x-navbar";
import { post } from "@/utils/api.js";
import xBtn from "@/components/modules/x-btn";
import { mapActions, mapState } from "vuex";
import { callPayment } from "@/utils/pay.js";
import popUpVue from "./popUp.vue";
// import autonym from "@/components/autonym/index.vue";
import xTipsVue from "../../components/modules/x-tips.vue";
export default {
    data() {
        return {
            gold: 0,
            accesstype: 1, // 1退款 0充值
            valueDeposit: undefined, // 充值金额
            withdrawId: "",
            forbid: true,
            topUpList: [],
            topUp: {},
            showAnimation: false, //协议
            payShow: false,
            payList: [
                // #ifdef MP-WEIXIN
                {
                    name: "微信支付",
                    type: 3,
                    img: "WeChat",
                    show: false,
                    msg: "微信小程序支付",
                },
                // #endif
                // #ifndef MP-WEIXIN

                {
                    name: "支付宝",
                    type: 1,
                    img: "Ali",
                    show: true,
                    msg: "支付宝支付",
                },
                // {
                //     name: "微信支付",
                //     type: 2,
                //     img: "WeChat",
                //     show: false,
                //     msg: "微信支付",
                // },
                // #endif
            ],
            payItem: {
                name: "支付宝",
                type: 1,
                img: "Ali",
                show: true,
                msg: "支付宝支付",
            },
            showAutonym: false,
            closeAutonym: false,
            tipsShow: false,
            refund: { refundAmountLimit: "0", refundResidueCnt: 0 }, //单日退款次数上限
            isModalVisible: false,
        };
    },
    components: {
        xNavbar,
        xBtn,
        popUpVue,
        // autonym,
        xTipsVue,
    },
    onLoad(da) {
        this.gold = this.userInfo.gold;
    },
    onShow() {
        this.getBalance();
    },
    computed: {
        ...mapState(["userInfo"]),
        padTop() {
            let da = this.MBInfo();
            return da.top + da.height + "px";
        },
    },
    mounted() {
        this.closeAutonym = this.userInfo.isAuthenticated;
    },
    watch: {
        svgaData() {
            this.userInfo.isAuthenticated;
            this.userInfo.gold;
        },
        "$store.state.userInfo.gold": {
            handler(newVal) {
                this.gold = newVal;
            },
        },
    },
    methods: {
        ...mapActions(["asyncUpdateInfo", "asyncUpBalance"]),
        // 关闭身份认证
        // async onClickAutonym() {
        //     this.showAutonym = false;
        //     let a = await post("v1/user/self/get", {
        //         user_id: this.userInfo.id,
        //     });
        //     this.closeAutonym = a.isAuthenticated;
        //     if (this.closeAutonym) this.onClickWithdrawal();
        // },

        // 获取余额
        getBalance() {
            post("v1/pay/saving/config", { type: 2 }).then((res) => {
                if (!res.code) {
                    res.config.forEach((element) => {
                        if (!element.amount.includes("."))
                            element.amount = element.amount + ".00";
                    });
                    this.topUpList = res.config;
                    if (Object.keys(this.topUp).length == 0) {
                        this.topUp = res.config[0];
                    }
                    this.refund = res;
                }
            });
        },
        // 充值
        onClickDeposit() {
            this.accesstype = 0;
        },
        // 申请退款
        onClickWithdrawal() {
            // if (!this.userInfo.isAuthenticated && !this.closeAutonym) {
            //     this.showAutonym = !this.userInfo.isAuthenticated; // 是否已实名认证;
            //     return;
            // }
            if (!this.refund.refundResidueCnt) {
                uni.$u.toast("今日提现次数已达上限！");
                return;
            }
            if (this.gold) {
                this.$refs.popup.open(this.refund);
            } else uni.$u.toast("金币不足！");
        },
        // 确认充值
        async onpayDeposit() {
            if (!this.showAnimation) {
                this.tipsShow = true;
                return;
            }
            let money = Number(this.topUp.amount);
            let that = this;
            let type = that.payItem.type;
            let data = {
                platform_id: type,
                amount: money,
                device_id: "",
                source_type: 12,
                source_id: that.topUp.id,
            };
            let res = await callPayment("v1/pay/payment/create", data, type);
            let orderInfo = res.orderInfo;
            if (!res.code) {
                uni.requestPayment({
                    provider: type == 1 ? "alipay" : "wxpay",
                    // #ifndef MP-WEIXIN
                    orderInfo,
                    // #endif
                    // #ifdef MP-WEIXIN
                    ...orderInfo,
                    // #endif
                    success: async function (res) {
                        console.log("success:" + JSON.stringify(res));
                        uni.$u.toast("充值金币成功！");
                        that.asyncUpBalance();
                        // that.gold = that.floatingPoint(that.gold, "+", money);
                    },
                    fail: function (err) {
                        console.log("fail:" + JSON.stringify(err));
                        if (err.errCode == -8) uni.$u.toast("客户端未安装");
                        if (err.errCode == -100)
                            uni.$u.toast("您中途取消了支付");
                        if (err.errMsg == "requestPayment:fail cancel")
                            uni.$u.toast("您中途取消了支付");
                    },
                });
            } else {
                uni.$u.toast(res.message);
            }
        },

        onPay(i) {
            let a = this.payList.findIndex((num) => num.show);
            this.payList[a].show = false;
            i.show = true;
            this.payItem = i;
            this.payShow = false;
        },
        getSelect() {
            this.payList.map((i) => {
                if (this.payItem.name == i.name) {
                    i.show = true;
                } else i.show = false;
            });
            this.payShow = true;
        },
        getPayNum(i) {
            this.topUp = i;
        },
        onTipsVue(valse) {
            this.showAnimation = valse;
            this.tipsShow = false;
        },
        goRechargeRecord() {
            let itemJson = JSON.stringify(this.refund);
            this.goto("/page-a/balance/rechargeRecord", { itemJson });
        },
    },
};
</script>
<style lang='scss' scoped>
.balance {
    width: 100vw;
    height: 100vh;
    position: relative;
    &::before {
        content: "";
        width: 100vw;
        height: 1000rpx;
        position: absolute;
        background-image: url("https://img.chaoshewang.com/static/img/home/topUp_bg.png");
        background-size: 100% 100%;
    }
}

.balance_con {
    position: absolute;
    padding-top: 150rpx;
    overflow-y: auto;
    padding-bottom: 200rpx;

    .top_cord {
        width: 686rpx;
        height: 348rpx;
        background-image: url("https://img.chaoshewang.com/static/img/home/topUp_bg2.png");
        background-size: 100% 100%;
        padding: 32rpx;
        margin: 44rpx auto 0;
        margin-bottom: 16rpx;
        color: #fff;
        font-weight: 500;
        font-size: 24rpx;

        .tit {
            font-weight: 500;
            font-size: 28rpx;
            .t_msg1 {
                .ico {
                    margin-left: 8rpx;
                    width: 32rpx;
                    height: 32rpx;
                    background-image: url("https://img.chaoshewang.com/matt/static/img/index/group_3.png");
                    background-size: 100% 100%;
                }
            }
            .t_msg {
                font-weight: 500;
                font-size: 24rpx;
                .ico {
                    margin-left: 8rpx;
                    width: 32rpx;
                    height: 32rpx;
                    background-image: url("https://img.chaoshewang.com/static/img/home/group_4.png");
                    background-size: 100% 100%;
                }
            }
        }

        .B_num {
            margin: 32rpx 0 8rpx;

            .m_ico {
                width: 48rpx;
                height: 48rpx;
                margin-right: 16rpx;
            }

            .m_num {
                font-weight: bold;
                font-size: 48rpx;

                &::after {
                    content: "枚";
                    font-weight: 500;
                    font-size: 24rpx;
                    margin-left: 8rpx;
                }
            }
        }
        .nums {
            text-align: center;
            margin-bottom: 32rpx;
        }
        .btns {
            margin: auto;
            width: 220rpx;
            height: 64rpx;
            line-height: 64rpx;
            text-align: center;
            font-weight: bold;
            font-size: 28rpx;
            color: #000000;
            background: #fff;
            border-radius: 32rpx;
        }
    }
}

.bill_log {
    width: 100%;
    background-color: #fff;
    border-radius: 16rpx 16rpx 0 0;
    padding: 32rpx 32rpx 120rpx;
    .tit {
        font-weight: bold;
        font-size: 32rpx;
        .tit1 {
            font-weight: bold;
            font-size: 28rpx;
            color: #fcb25f;
            margin-left: 8rpx;
        }
    }

    .box {
        border-radius: 32rpx;
        padding-top: 32rpx;
        // gap: 10px; /* 可选：设置项目之间的间距 */
        @include grid(218rpx);
        .list_item {
            width: 218rpx;
            height: 236rpx;

            border-radius: 16rpx;
            border: 2rpx solid #ebeef3;
            font-weight: 800;
            font-size: 36rpx;
            color: #000000;
            margin-bottom: 16rpx;
            .pr {
                width: 64rpx;
                height: 64rpx;
                background-image: url("https://img.chaoshewang.com/static/img/pay/gold.png");
                background-size: 100% 100%;
                margin-bottom: 24rpx;
            }
            &.active {
                border: 4rpx solid #865bf2;
                color: #865bf2;
            }
        }
    }
    .text {
        margin-top: 20rpx;
        font-weight: 500;
        font-size: 24rpx;
        color: #aaacbb;
        letter-spacing: 2px;
    }
    .co {
        color: #865bf2;
    }
}

.foot-btn {
    width: 100%;
    height: 320rpx;
    background: #fff;
    position: fixed;
    bottom: 0rpx;
    left: 0;
    width: 100%;
    padding: 24rpx 28rpx 24rpx;
    .appoint {
        height: 68rpx;

        .select {
            width: 32rpx;
            height: 32rpx;
            background-image: url("https://img.chaoshewang.com/static/img/home/icon16.png");
            background-size: 100% 100%;
            margin-right: 8rpx;
            &.active {
                background-image: url("https://img.chaoshewang.com/static/img/pay/ico3.png") !important;
                background-size: 100% 100%;
            }
        }
        .cr {
            color: rgba(255, 106, 22, 1);
        }
        .text {
            width: 646rpx;
            font-weight: 500;
            font-size: 24rpx;
            color: #000000;
            letter-spacing: 1px;
        }
    }
    .pays {
        font-weight: bold;
        font-size: 28rpx;

        .t_msg {
            font-weight: 500;
            font-size: 24rpx;
            color: #aaacbb;
            margin-left: 24rpx;
            height: 32rpx;
            line-height: 32rpx;
            .ico {
                margin-left: 8rpx;
                width: 32rpx;
                height: 32rpx;
                background-image: url("https://img.chaoshewang.com/static/img/home/tz_tu.png");
                background-size: 100% 100%;
            }
        }
    }
    .all {
        font-weight: bold;
        font-size: 28rpx;
        color: #000000;
        .allNum {
            .num {
                font-weight: 800;
                font-size: 40rpx;
                color: #ff6a16;
                &::before {
                    content: "￥";
                    font-weight: bold;
                    font-size: 32rpx;
                    color: #ff6a16;
                }
            }
        }
        .btn {
            width: 280rpx;
            height: 80rpx;
            background: #865bf2;
            border-radius: 40rpx;
            text-align: center;
            line-height: 80rpx;
            font-weight: bold;
            font-size: 32rpx;
            color: #ffffff;
            letter-spacing: 1px;
        }
    }
}
.payShow {
    width: 750rpx;
    height: 420rpx;
    background: #ffffff;
    border-radius: 40rpx 40rpx 0 0;
    padding: 32rpx;
    .top_Back {
        margin-bottom: 32rpx;
        .txt {
            width: 590rpx;
            font-weight: bold;
            font-size: 32rpx;
            color: #000000;
            text-align: center;
        }

        .Back_ico {
            font-size: 50rpx;
        }
    }
}
.pay_item {
    height: 104rpx;
    .pay_name {
        font-weight: bold;
        font-size: 28rpx;
        color: #000000;
        .pay_ico {
            width: 56rpx;
            height: 56rpx;
            margin-right: 24rpx;
        }
    }
    .reduce_pay {
        display: flex;
        align-items: center;
        .select {
            width: 36rpx;
            height: 36rpx;
            background-image: url("https://img.chaoshewang.com/static/img/home/icon16.png");
            background-size: 100% 100%;
            margin-right: 8rpx;
            &.active {
                background-image: url("https://img.chaoshewang.com/static/img/home/icon18.png") !important;
                background-size: 100% 100%;
            }
        }
    }
}

</style>