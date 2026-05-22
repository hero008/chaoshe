<template>
    <view class="balance">
        <x-navbar />
        <div class="balance_con" :style="{ paddingTop: padTop }">
            <div class="top_cord">
                <div class="tit flex_r flex_ac flex_jb">
                    <span>我的账户</span>
                    <span class="t_msg">1枚余额=1元RMB</span>
                </div>
                <div class="B_num flex_r flex_ac">
                    <img src="https://img.shinemang.com/gachaStatic/static/img/market/ico5.png" class="m_ico" />
                    <div class="m_num">{{ balance || "0.00" }}</div>
                </div>
                <div class="btns flex_r flex_ac flex_jb">
                    <div class="btn cor" @click="onClickWithdrawal">
                        申请退款
                    </div>
                </div>
            </div>
            <div class="bill_log">
                <div class="tit flex_r flex_ac flex_jb">
                    <span>资产记录</span>
                </div>
                <div class="box">
                    <view class="top_bg flex_r flex_ac flex_jb">
                        <view class="itb1">时间</view>
                        <view class="itb2">操作</view>
                        <view class="itb3">金额</view>
                    </view>
                    <view class="list">
                        <scroll-view :scroll-y="true" class="list_box" @scrolltolower="onReachScollBottom"
                            :lower-threshold="400">
                            <div class="li_item flex_r flex_ac flex_jb" v-for="(item, index) in transactionList"
                                :key="index">
                                <view class="itb1">{{ item.createTime }}</view>
                                <view class="itb2">{{
                                    getOpraType(item.sourceType)
                                    }}</view>
                                <view class="itb3">{{ item.amount > 0 ? "+" : ""
                                }}{{ item.amount }}</view>
                            </div>
                        </scroll-view>
                    </view>
                </div>
            </div>
        </div>
        <!-- 绑定支付宝账户 -->
        <u-popup :show="popupShow1" bgColor="transparent" :safeAreaInsetBottom="false" mode="center">
            <view class="pop_bg">
                <div class="p_head flex_c flex_jse">
                    <image @click="onClickClose" class="ico_img"
                        src="https://img.shinemang.com/gachaStatic/static/img/transaction/close2.png"></image>
                    <view class="t_title">绑定支付宝账户</view>
                    <view class="t_txt">*请您确保账户信息准确，绑定后更改需联系客服</view>
                </div>
                <view class="bottom_bg">
                    <u--form labelWidth="auto">
                        <u-form-item label="支付账号：">
                            <u--input placeholder="请输入支付宝账号" v-model="bindAccount" border="surround" />
                        </u-form-item>
                        <u-form-item label="确认账号：">
                            <u--input placeholder="请再次输入支付宝账号" v-model="bindAccount2" border="surround" />
                        </u-form-item>
                        <u-form-item label="账号姓名：">
                            <u--input placeholder="请输入姓名" v-model="bindName" border="surround" />
                        </u-form-item>
                    </u--form>
                    <div class="pop_btn flex_r flex_jc">
                        <x-btn txt="确认" v-if="!bindAccount || !bindAccount2 || !bindName" />
                        <x-btn txt="确认" @click="confirmBind" v-else cor="1" />
                    </div>
                </view>
            </view>
        </u-popup>
        <!-- 退款 -->
        <u-popup :show="popupShow3" bgColor="transparent" :safeAreaInsetBottom="false" mode="center">
            <view class="pop_bg">
                <div class="p_head flex_c flex_jse">
                    <image @click="onClickClose" class="ico_img"
                        src="https://img.shinemang.com/gachaStatic/static/img/transaction/close2.png"></image>
                    <view class="t_title flex_r flex_ac">
                        <view>当前金额</view>
                        <img class="img_gold" src="https://img.shinemang.com/gachaStatic/static/img/market/ico5.png" />
                        <view>{{ balance }}<span class="t_ico">枚</span></view>
                    </view>
                    <view class="t_txt">1枚余额=1元RMB</view>
                </div>
                <view class="bottom_bg" v-if="accesstype">
                    <u--form labelWidth="auto">
                        <u-form-item label="账号：">
                            <u--input placeholder="请输入支付宝账号" v-model="valueAcc" disabled border="surround" />
                        </u-form-item>
                        <u-form-item label="姓名：">
                            <u--input placeholder="请输入姓名" v-model="valueName" disabled border="surround" />
                        </u-form-item>
                        <u-form-item label="金额：">
                            <u--input :placeholder="'单笔最高可退款' + payoutOneTimeLimit
                                " v-model="valueMoney" maxlength="8" @input="
                                    valueMoney = valueMoney.replace(
                                        /[^\d]/g,
                                        ''
                                    )
                                    " border="surround" />
                        </u-form-item>
                    </u--form>
                    <div class="withdraw_msg">
                        *每日可退款{{ payoutNumLimit }}笔， 每日可退款总额{{
                            payoutTotalLimit
                        }}
                    </div>
                    <div class="pop_btn flex_r flex_jc">
                        <x-btn txt="确认" v-if="
                            !valueAcc ||
                            !valueName ||
                            !valueMoney ||
                            !forbid
                        " />
                        <x-btn txt="确认" v-else cor="1" @click="confirmWithdrawal" />
                    </div>
                </view>
                <view class="bottom_bg" v-else>
                    <u--form labelWidth="auto">
                        <u-form-item label="金额：">
                            <u--input :placeholder="'单笔最高可退款' + payoutOneTimeLimit
                                " v-model="valueDeposit" maxlength="8" @input="
                                    valueDeposit = valueDeposit.replace(
                                        /[^\d]/g,
                                        ''
                                    )
                                    " border="surround" />
                        </u-form-item>
                    </u--form>
                    <div class="pop_btn flex_r flex_jc">
                        <x-btn txt="确认" v-if="!valueDeposit" />
                        <x-btn txt="确认" @click="onpayDeposit" v-else cor="1" />
                    </div>
                </view>
            </view>
        </u-popup>
        <!-- 支付 -->
        <!-- <x-pay @success="onClickDraw" ref="xPay" mtype="11" :probabilityShow=[] /> -->
        <autonym @onAutonym="onClickAutonym" ref="autonym" :visible="showAutonym" />
    </view>
</template>
<script>
import xNavbar from "@/components/modules/x-navbar";
import { post } from "@/utils/api.js";
import xBtn from "@/components/modules/x-btn";
import autonym from "@/components/autonym/index.vue";
import { mapState, mapActions } from "vuex";
export default {
    data() {
        return {
            balance: 0,
            popupShow1: false,
            popupShow3: false,
            accesstype: 1, // 1退款 0充值
            valueAcc: undefined, // 支付宝账号
            valueName: undefined, // 账号姓名
            valueMoney: undefined, // 退款金额
            bindAccount: undefined, // 绑定账号
            bindAccount2: undefined, // 确认绑定账号
            bindName: undefined, // 绑定账号的姓名
            valueDeposit: undefined, // 充值金额
            withdrawId: "",
            pageda: {
                page: 1,
                page_size: 20,
                total: 20,
            },
            transactionList: [],
            payoutOneTimeLimit: 0,
            payoutTotalLimit: 0,
            payoutNumLimit: 0,
            forbid: true,
            showAutonym: false,
            closeAutonym: false,
        };
    },
    components: {
        xNavbar,
        xBtn,
        autonym,
    },
    onLoad(da) {

    },
    onShow() {
        // this.getBalance();
        this.getTransaction();
        this.asyncUpBalance()
    },
    computed: {
        ...mapState(["userInfo"]),
        padTop() {
            let da = this.MBInfo();
            return da.top + da.height + "px";

        },

    },
    mounted() {
        this.closeAutonym = this.userInfo.isAuthenticated
    },
    watch: {
        svgaData() {
            // #ifdef MP
            this.render();
            // #endif
            this.userInfo.isAuthenticated;
        },
        "$store.state.userInfo.coin": {
            handler(newVal) {
                this.balance = newVal;
            },
        },
    },
    methods: {
        ...mapActions(["asyncUpdateInfo", "asyncUpBalance"]),
        async onClickAutonym() {
            this.showAutonym = false;
            let a = await post("v1/user/self/get", { user_id: this.userInfo.id });
            this.closeAutonym = a.isAuthenticated
            if (this.closeAutonym) this.onClickWithdrawal();
        },

        // 获取余额
        getBalance() {
            post("v1/wallet/balance", {
                user_id: this.userInfo.id,
            }).then((res) => {
                if (res && res.wallet && res.wallet["0"])
                    this.balance = res.wallet["0"].balance;
            });
        },
        // 获取流水
        getTransaction() {
            this.balance = this.userInfo.coin
            post("v1/wallet/transaction/list", {
                type: 0,
                ...this.pageda,
            }).then((res) => {
                if (this.pageda.page == 1) this.transactionList = [];
                this.transactionList = this.transactionList.concat(
                    res.transactions
                );
                this.pageda.total = res.total;
            });
        },
        onReachScollBottom() {
            if (this.pageda.total > this.pageda.page * this.pageda.page_size) {
                this.pageda.page++;
                this.getTransaction();
            }
        },
        onClickClose() {
            this.popupShow1 = false;
            this.popupShow3 = false;
            this.valueMoney = undefined;// 充值金额
        },
        onClickWithdrawal() {
            if (!this.userInfo.isAuthenticated && !this.closeAutonym) {
                this.showAutonym = !this.userInfo.isAuthenticated; // 是否已实名认证;
                return;
            }
            post("v1/pay/withdraw/info/get").then((res) => {
                if (!res.code) {
                    const {
                        payoutOneTimeLimit,
                        payoutTotalLimit,
                        aliPayAccount,
                        realName,
                        withdrawId,
                        payoutNumLimit,
                    } = res;
                    this.valueAcc = aliPayAccount;
                    this.valueName = realName;
                    this.withdrawId = withdrawId;
                    this.payoutTotalLimit = payoutTotalLimit;
                    this.payoutOneTimeLimit = payoutOneTimeLimit;
                    this.payoutNumLimit = payoutNumLimit;
                    let bindState = Boolean(realName);
                    if (bindState) {
                        this.popupShow3 = true;
                        this.accesstype = 1;
                    } else this.popupShow1 = true;
                }
            });
        },
        // 充值
        onClickDeposit() {
            this.popupShow3 = true;
            this.accesstype = 0;
        },
        // 确认充值
        onpayDeposit() {
            let money = Number(this.valueDeposit);
            if (money && money > 0) {
                this.$refs.xPay.open(
                    money,
                    1,
                    getApp().globalData.RechargeType.Recharge,
                    0,
                    "0"
                );
            }
        },
        // 确认绑定
        confirmBind() {
            if (this.bindAccount2 != this.bindAccount) {
                return uni.$u.toast("两次输入的账号不一致！");
            }
            post("v1/pay/withdraw/info/bind", {
                ali_pay_account: this.bindAccount,
                real_name: this.bindName,
            }).then((res) => {
                if (res.code) {
                    uni.$u.toast(res.message);
                } else {
                    uni.$u.toast("绑定成功！");
                    this.popupShow1 = false;
                    this.popupShow3 = true;
                    this.valueAcc = res.aliPayAccount;
                    this.valueName = res.realName;
                    this.withdrawId = res.withdrawId;
                    this.onClickWithdrawal();
                }
            });
        },
        // 确认退款
        confirmWithdrawal() {
            this.forbid = false;
            let money = Number(this.valueMoney);
            if (money && money > 0) {
                post("v1/pay/payout/create", {
                    withdraw_id: this.withdrawId,
                    amount: money,
                }).then((res) => {
                    if (!res.code) {
                        this.popupShow3 = false;
                        this.balance = res.balance;
                        uni.$u.toast("申请退款成功！请等待工作人员审核...");
                        this.pageda.page = 1;
                        this.pageda.total = 15;
                        this.getTransaction();
                        setTimeout(() => {
                            this.forbid = true;
                        }, 1000);
                        this.valueMoney = undefined;// 充值金额
                        this.asyncUpBalance()
                    } else {
                        let a = res.message || "退款失败，请联系客服人员！";
                        uni.$u.toast(a);
                        setTimeout(() => {
                            this.forbid = true;
                        }, 1000);
                    }
                });
            } else {
                uni.$u.toast("请输入正确的退款金额！");
            }
        },
        getOpraType(type) {
            return getApp().globalData.RechargeTypeMean[type];
        },
    },
};
</script>
<style lang='scss' scoped>
.balance {
    width: 100vw;
    height: 100vh;
    overflow-y: auto;
    position: relative;
    background: linear-gradient(104deg, #e1d6f8 0%, #f8e7ed 100%);

    &::before {
        content: "";
        width: 100vw;
        height: calc(100% - 212rpx);
        left: 0;
        top: 212rpx;
        position: absolute;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #f0f0f0 50%);
    }
}

.balance_con {
    position: absolute;
    padding: 0 36rpx;
    height: 100vh;
    width: 100%;
    bottom: 0;
    left: 0;

    .top_cord {
        background-color: #fff;
        border-radius: 16rpx;
        padding: 28rpx;
        height: 316rpx;
        margin-bottom: 16rpx;

        .tit {
            font-weight: bold;
            font-size: 28rpx;

            .t_msg {
                font-weight: 500;
                color: #818181;
                font-size: 24rpx;
            }
        }

        .B_num {
            margin: 46rpx 0;

            .m_ico {
                width: 40rpx;
                height: 40rpx;
                margin-right: 16rpx;
            }

            .m_num {
                font-size: 48rpx;
                font-weight: 700;

                &::after {
                    content: "枚";
                    font-weight: 500;
                    font-size: 24rpx;
                    color: #818181;
                    margin-left: 8rpx;
                }
            }
        }

        .btns {
            .btn {
                /* width: 304rpx; */
                width: calc(100% - 10rpx);
                height: 76rpx;
                line-height: 76rpx;
                text-align: center;
                background: #e2e1e3;
                border-radius: 16rpx;
                font-weight: bold;
                font-size: 28rpx;
                color: #626262;

                &.cor {
                    color: #fff;
                    background: linear-gradient(89deg,
                            #6290fe 0%,
                            #a439fc 100%);
                }
            }
        }
    }
}

.bill_log {
    width: 100%;
    height: calc(100% - 332rpx);
    background-color: #fff;
    border-radius: 16rpx 16rpx 0 0;

    .tit {
        padding: 28rpx;
        font-weight: bold;
        font-size: 28rpx;
    }

    .box {
        width: 638rpx;
        height: calc(100% - 116rpx);
        margin-left: 24rpx;
        background: #f9f9f9;
        border-radius: 16rpx 16rpx 16rpx 16rpx;

        .top_bg {
            width: 638rpx;
            height: 64rpx;
            background: #e2e1e3;
            border-radius: 16rpx 16rpx 0rpx 0rpx;
            padding: 0 26rpx;

            font-weight: 500;
            font-size: 24rpx;

            .t1 {
                padding-top: 20rpx;
                margin-left: 24rpx;
                color: #626262;
            }
        }

        .list {
            padding: 20rpx 26rpx;
            height: calc(100% - 70rpx);

            .list_box {
                height: 100%;

                .li_item {
                    height: 64rpx;
                    width: 100%;
                    font-weight: 500;
                    font-size: 20rpx;
                    color: #383228;
                    border-bottom: 2rpx solid #e2e1e3;
                    // &:last-child{
                    // 	border: none;
                    // }
                }
            }
        }

        .itb1 {
            width: 220rpx;
        }

        .itb2 {
            width: 80rpx;
            // text-align: center;
        }

        .itb3 {
            width: 80rpx;
            text-align: right;
        }
    }
}

.pop_bg {
    width: 686rpx;
    height: 646rpx;
    border-radius: 16rpx;
    background-color: #fff;

    .p_head {
        height: 186rpx;
        padding: 26rpx 36rpx;
        border-radius: 16rpx;
        background: linear-gradient(104deg, #e1d6f8 0%, #f8e7ed 100%);

        .ico_img {
            position: absolute;
            top: 16rpx;
            right: 16rpx;
            width: 52rpx;
            height: 52rpx;
        }

        .t_title {
            font-weight: bold;
            font-size: 40rpx;
            color: #1c1c1c;
        }

        .t_txt {
            font-size: 28rpx;
            color: #9e91acff;
        }

        .img_gold {
            width: 40rpx;
            height: 40rpx;
            margin: 0 10rpx 0 36rpx;
        }

        .t_ico {
            font-weight: 500;
            font-size: 24rpx;
            color: #818181;
            margin-left: 6rpx;
        }
    }

    .bottom_bg {
        height: calc(100% - 186rpx);
        padding: 30rpx 36rpx;
        position: relative;

        .pop_btn {
            width: 100%;
            left: 0;
            bottom: 36rpx;
            position: absolute;
        }

        .withdraw_msg {
            color: #999;
            font-size: 22rpx;
        }
    }
}
</style>