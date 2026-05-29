<template>
    <view class="balance">
        <x-navbar tit="交易记录" />
        <div class="balance_con" :style="{ paddingTop: padTop }">
            <div class="top_cord">
                <div class="tit flex_r flex_ac flex_jb">
                    <view
                        class="t_msg1 flex_r flex_ac"
                        @click="
                            goto('/pages/common/rulepop', {
                                val: 'ServiceAgreement',
                            })
                        "
                        >可用金币<view class="ico"></view
                    ></view>
                    <view class="t_msg">1枚金币=1元RMB</view>
                </div>
                <div class="B_num flex_r flex_ac flex_jc">
                    <img
                        src="https://img.shinemang.com/gachaStatic/static/img/pay/gold.png"
                        class="m_ico"
                    />
                    <div class="m_num">{{ balance || "0.00" }}</div>
                </div>
                <!-- <div class="btns" @click="onClickWithdrawal">申请退款</div> -->
            </div>
            <div class="bill_log">
                <div class="tit flex_r flex_ac flex_jb">
                    <span>存储记录</span>
                </div>
                <div class="box">
                    <scroll-view
                        :scroll-y="true"
                        class="list"
                        @scrolltolower="onReachScollBottom"
                        :lower-threshold="400"
                    >
                        <div
                            class="li_item flex_r flex_jb"
                            v-for="(item, index) in transactionList"
                            :key="index"
                        >
                            <view class="itb flex_c flex_jb">
                                <view class="itb2">{{
                                    getOpraType(item.sourceType)
                                }}</view>
                                <view class="itb1">{{ item.createTime }}</view>
                            </view>

                            <view class="itb3"
                                >{{ item.amount > 0 ? "+" : ""
                                }}{{ item.amount }}</view
                            >
                            <!-- <view class="itb">{{item.state == 2?'已成功':'待处理'}}</view> -->
                        </div>
                    </scroll-view>
                </div>
            </div>
        </div>
        <!-- 身份证信息认证 -->
        <!-- <autonym
            @onAutonym="onClickAutonym"
            ref="autonym"
            :visible="showAutonym"
        /> -->
        <popUpVue ref="popUp" @popUp="onClickPopUp" />
    </view>
</template>
<script>
import xNavbar from "@/components/modules/x-navbar";
import { post } from "@/utils/api.js";
import xBtn from "@/components/modules/x-btn";
import xPay from "@/components/x-pay/index.vue";
// import autonym from "@/components/autonym/index.vue";
import { mapState, mapActions } from "vuex";
import popUpVue from "./popUp.vue";
export default {
    data() {
        return {
            balance: 0,
            pageda: {
                page: 1,
                page_size: 20,
                total: 20,
            },
            transactionList: [],
            showAutonym: false,
            closeAutonym: false,
            refund: { refundAmountLimit: "0", refundResidueCnt: 0 }, //单日退款次数上限
        };
    },
    components: {
        xNavbar,
        xBtn,
        xPay,
        // autonym,
        popUpVue,
    },
    onLoad(da) {
        this.refund = JSON.parse(da.itemJson);
    },
    onShow() {
        this.getTransaction();
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
        },
    },
    methods: {
        ...mapActions(["asyncUpdateInfo", "asyncUpBalance"]),
        async onClickAutonym() {
            this.showAutonym = false;
            let a = await post("v1/user/self/get", {
                user_id: this.userInfo.id,
            });
            this.closeAutonym = a.isAuthenticated;
            if (this.closeAutonym) this.onClickWithdrawal();
        },
        // 获取流水
        getTransaction() {
            this.balance = this.userInfo.gold;
            post("v1/wallet/transaction/list", {
                type: 2,
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
        onClickWithdrawal() {
            // if (!this.userInfo.isAuthenticated && !this.closeAutonym) {
            //     this.showAutonym = !this.userInfo.isAuthenticated; // 是否已实名认证;
            //     return;
            // }
            if (!this.refund.refundResidueCnt) {
                uni.$u.toast("今日提现次数已达上限！");
                return;
            }

            if (this.balance) {
                this.$refs.popUp.open(this.refund);
            } else uni.$u.toast("金币不足！");
        },

        getOpraType(type) {
            return getApp().globalData.RechargeTypeMean[type];
        },
        onClickPopUp() {
            (this.pageda = {
                page: 1,
                page_size: 20,
                total: 20,
            }),
                this.getTransaction();
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
::v-deep .u-form-item__body__left__content__label {
    font-weight: bold;
    font-size: 28rpx;
    color: #000000;
}
::v-deep .u-form-item__body__left {
    margin-right: 0;
}
::v-deep .u-input--square {
    width: 390rpx;
    height: 80rpx;
    background: #ebeef3;
    border-radius: 16rpx;
    border: 0;
}
::v-deep .u-form-item__body {
    margin-bottom: 40rpx;
}
.balance {
    width: 100vw;
    height: 100vh;
    &::before {
        content: "";
        width: 100vw;
        height: 1000rpx;
        position: absolute;
        background-image: url("https://img.shinemang.com/gachaStatic/matt/static/img/index/account_bg.png");
        background-size: 100% 100%;
    }
}
.navbar_x {
    position: relative;
}
.balance_con {
    position: absolute;
    padding: 0 36rpx;
    width: 100%;
    height: calc(100% - 70rpx);
    bottom: 0;
    overflow: hidden;
    .top_cord {
        width: 686rpx;
        height: 308rpx;
        background: linear-gradient(118deg, #845af1 0%, #78efe9 100%);
        border-radius: 32rpx;
        padding: 32rpx;
        margin-bottom: 16rpx;
        color: #fff;

        .tit {
            font-weight: 500;
            font-size: 28rpx;
            .t_msg1 {
                .ico {
                    margin-left: 8rpx;
                    width: 32rpx;
                    height: 32rpx;
                    background-image: url("https://img.shinemang.com/gachaStatic/matt/static/img/index/group_3.png");
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
                    background-image: url("https://img.shinemang.com/gachaStatic/static/img/home/group_4.png");
                    background-size: 100% 100%;
                }
            }
        }

        .B_num {
            margin: 40rpx 0;

            .m_ico {
                width: 48rpx;
                height: 48rpx;
                margin-right: 16rpx;
            }

            .m_num {
                font-size: 48rpx;
                font-weight: 700;

                &::after {
                    content: "枚";
                    font-weight: 500;
                    font-size: 24rpx;
                    margin-left: 8rpx;
                }
            }
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
    height: calc(100% - 332rpx);
    background-color: #fff;
    border-radius: 32rpx 32rpx 0 0;

    .tit {
        padding: 32rpx;
        font-weight: 800;
        font-size: 32rpx;
    }

    .box {
        width: 100%;
        height: calc(100% - 116rpx);
        border-radius: 32rpx;
        padding: 0 32rpx;

        .list {
            height: calc(100% - 70rpx);

            .li_item {
                height: 112rpx;
                width: 100%;
                font-weight: 500;
                font-size: 20rpx;
                color: #383228;
                border-bottom: 2rpx solid #e2e1e3;
                padding: 16rpx 0;
                // &:last-child{
                // 	border: none;
                // }
            }
        }
        .itb {
            .itb1 {
                font-weight: 500;
                font-size: 24rpx;
                color: #aaacbb;
            }

            .itb2 {
                font-weight: bold;
                font-size: 28rpx;
                color: #000000;
            }
        }

        .itb3 {
            font-weight: bold;
            font-size: 28rpx;
            color: #000000;
        }
    }
}

.before {
    &::before {
        content: "*";
        font-weight: 500;
        font-size: 24rpx;
        color: #fa80c7;
        margin-right: 4rpx;
    }
}
</style>