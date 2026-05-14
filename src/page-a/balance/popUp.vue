<template>
    <!-- popupShow  -->
    <u-popup
        :show="visible"
        bgColor="transparent"
        :safeAreaInsetBottom="false"
        mode="center"
    >
        <view class="pop_bg">
            <div class="p_head flex_c flex_jse">
                <image
                    @click="close"
                    class="ico_img"
                    src="https://img.chaoshewang.com/static/img/transaction/close2.png"
                ></image>
                <view class="t_title" >当前金币</view>
                <view class="gold flex_r flex_ac">
                    <img
                        class="icon"
                        src="https://img.chaoshewang.com/static/img/pay/gold.png"
                    />
                    <view class="num">{{ userInfo.gold }}</view>
                </view>
                <view class="t_txt">1枚金币=1元RMB</view>
            </div>
            <view class="gold_box">
                <view class="iphone w flex_r flex_ac">
                    <view class="text">手机号：</view>
                    <view>{{ userInfo.phone }}</view>
                </view>
                <view class="number w flex_r flex_ac">
                    <view class="text">退款金币：</view>
                    <input
                        class="inp"
                        min="0.01"
                        type="digit"
                        inputmode="decimal"
                        step="0.01"
                        placeholder="请输入退款金币"
                        :max="userInfo.gold"
                        v-model="valueMoney"
                        @input="getValueMoney"
                        id="valueMoneyRef"
                    />
                </view>
                <view class="code w flex_r flex_ac">
                    <view class="text">验证码：</view>
                    <input
                        class="inp1"
                        type="number"
                        placeholder="请输入验证码"
                        v-model="yard"
                        maxlength="6"
                        id="yardRef"
                    />
                    <view class="yard" v-if="!second" @click="getVerCode"
                        >发送验证码</view
                    >
                    <view class="yard" v-else>{{ second }}s</view>
                </view>
            </view>
            <view class="btn">
                <x-btn
                    txt="确认"
                    :cor="yard && valueMoney ? '1' : ''"
                    @click="onRefund"
                />
            </view>
        </view>
    </u-popup>
</template>
<script>
let _this, countDown;
import xNavbar from "@/components/modules/x-navbar";
import { post } from "@/utils/api.js";
import xBtn from "@/components/modules/x-btn";
import xPay from "@/components/x-pay/index.vue";
import autonym from "@/components/autonym/index.vue";
import { mapActions, mapState } from "vuex";
export default {
    data() {
        return {
            valueData: {},
            valueMoney: undefined, // 退款金额
            yard: undefined, //验证码
            second: 0, //倒计时
            phoneData: "", //金币退款号码
            refund: {},
            visible:false
        };
    },
    components: {
        xNavbar,
        xBtn,
        xPay,
        autonym,
    },
    onLoad(da) {},
    onShow() {},
    computed: {
        ...mapState(["userInfo"]),
        padTop() {
            let da = this.MBInfo();
            return da.top + da.height + "px";
        },
        _setTime() {
            //处理值
            const setTime = Number(this.setTime);
            return setTime > 0 ? setTime : 60;
        },
    },
    mounted() {},
    watch: {
        svgaData() {
            this.userInfo.isAuthenticated;
        },
    },
    methods: {
        ...mapActions(["asyncUpBalance"]),
        open(v) {
            this.visible=true
            this.refund = v;
        },
        getVerCode() {
            if (this.valueMoney < 0.01 || !this.valueMoney) {
                uni.$u.toast("请输入退款金币金额");
                return;
            }
            if (
                this.valueMoney > Number(this.refund.refundAmountLimit) &&
                this.userInfo.gold > Number(this.refund.refundAmountLimit)
            ) {
                uni.$u.toast(
                    `超出单笔退款金额${this.refund.refundAmountLimit}！`
                );
                return;
            } else if (this.valueMoney > this.userInfo.gold) {
                uni.$u.toast(`超出最大退款金额${this.userInfo.gold}！`);
                return;
            }
            post("v1/captcha/send", {
                phone_num: this.userInfo.phone,
                type: 3,
            }).then((res) => {
                if (res.code) {
                    uni.$u.toast(res.message);
                } else {
                    uni.$u.toast("验证码已发送");
                    this.runCode();
                }
            });
        },
        runCode(val) {
            //开始倒计时
            if (String(val) == "0") {
                //判断是否需要终止循环
                this.second = 0; //初始倒计时
                clearInterval(countDown); //清理循环
                return;
            }
            this.second = this._setTime; //倒数秒数
            let _this = this;
            countDown = setInterval(function () {
                _this.second--;
                if (_this.second == 0) {
                    clearInterval(countDown);
                }
            }, 1000);
        },
        onRefund() {
            if (this.valueMoney < 0.01) {
                uni.$u.toast("请输入退款金币金额");
                return;
            }
            if (!this.yard || this.yard.length !== 6) {
                uni.$u.toast("请输入正确的验证码");
                return;
            }
            if (
                this.valueMoney > Number(this.refund.refundAmountLimit) &&
                this.userInfo.gold > Number(this.refund.refundAmountLimit)
            ) {
                uni.$u.toast(
                    `超出单笔退款金额${this.refund.refundAmountLimit}！`
                );
                return;
            } else if (this.valueMoney > this.userInfo.gold) {
                uni.$u.toast(`超出最大退款金额${this.userInfo.gold}！`);
                return;
            }
            post("/v1/pay/saving/refund", {
                code: this.yard,
                type: 2,
                amount: this.valueMoney,
            }).then((res) => {
                if (res.code) {
                    let a = res.message || "退款失败，请联系客服人员！";
                    uni.$u.toast(a);
                } else {
                    uni.$u.toast("申请退款成功！请等待工作人员审核...");
                    this.close();
                    this.asyncUpBalance();
                }
            });
            this.runCode(0);
        },
        getValueMoney(e) {
            const value = e.target.value;
            const isValid = /^(0|[1-9]\d*)(\.\d{1,2})?$/.test(value);
            if (!isValid) {
                uni.$u.toast("请输入有效的数字（最多两位小数）");
            }
            if (
                e.target.value > Number(this.refund.refundAmountLimit) &&
                this.userInfo.gold > Number(this.refund.refundAmountLimit)
            ) {
                uni.$u.toast(
                    `超出单笔退款金额${this.refund.refundAmountLimit}！`
                );
                return;
            } else if (e.target.value > this.userInfo.gold) {
                uni.$u.toast(`超出最大退款金额${this.userInfo.gold}！`);
            }
        },
        close() {
            this.valueMoney = '';
            this.yard = '';
            this.second = 0;
            this.visible=false
            this.runCode(0);
        },
    },     
};
</script>
<style lang='scss' scoped>
::v-deep .u-input {
    width: 406rpx !important;
    padding: 0 !important;
}

.pop_bg {
    width: 686rpx;
    border-radius: 16rpx;
    background-color: #fff;
    .p_head {
        padding: 48rpx 0 32rpx 40rpx;
        border-radius: 16rpx 16rpx 0 0;
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
        .gold {
            font-weight: bold;
            font-size: 48rpx;
            color: #1c1c1c;
            margin: 16rpx 0 8rpx;
            .icon {
                width: 48rpx;
                height: 48rpx;
                margin-right: 16rpx;
            }
            .num {
                &::after {
                    content: " 枚";
                    font-weight: 500;
                    font-size: 28rpx;
                    color: #818181;
                }
            }
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

    .gold_box {
        padding: 0 52rpx;
        font-weight: bold;
        font-size: 28rpx;
        color: #1c1c1c;
        .text {
            width: 140rpx;
        }
        .iphone {
        }
        .w {
            height: 80rpx;
            margin-top: 32rpx;
        }
        .inp {
            // padding-left: 24rpx;
            width: 406rpx;
            height: 80rpx;
            background: #e2e1e3;
            border-radius: 16rpx;
        }
        .inp1 {
            // padding-left: 24rpx;
            width: 242rpx;
            height: 80rpx;
            background: #e2e1e3;
            border-radius: 16rpx 0 0 16rpx;
        }
        .yard {
            width: 164rpx;
            height: 80rpx;
            line-height: 80rpx;
            background: #e2e1e3;
            border-radius: 0 16rpx 16rpx 0;
            font-weight: 500;
            font-size: 28rpx;
            color: #ff6a16;
            text-align: center;
        }
    }
    .btn {
        width: 246rpx;
        margin: 60rpx auto;
    }
}
::v-deep .uni-input-placeholder {
    padding-left: 24rpx;
    font-weight: 500;
    font-size: 28rpx;
    color: #b7b6b9;
}
::v-deep .uni-input-input {
    padding-left: 24rpx;
}
</style>