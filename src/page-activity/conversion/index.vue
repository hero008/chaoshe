<template>
    <view class="conversation">
        <view class="header flex_r flex_ac flex_jb">
            <view class="icon" @click.stop="gateBack"></view>
            <view class="">福利兑换</view>
            <view class="icon1"></view>
        </view>
        <view class="center_box">
            <view class="center">
                <view class="shou"></view>
                <input
                    class="number"
                    v-model="inviteCode"
                    placeholder="输入兑换码"
                    @input="getInput"
                    placeholder-style="color:#e61eb1"
                    maxlength="10"
                />
                <view
                    v-if="inviteCode"
                    class="input_btn"
                    @click="clearIcon"
                ></view>
                <view class="btn" @click="$noMultipleClicks(getPrize)"
                    >立即兑换</view
                >
            </view>
            <view class="text">
                <view class="title">兑换说明：</view>
                <div class="parse_con">
                    <u-parse
                        :content="(cont && cont.text) || ''"
                        :selectable="true"
                    ></u-parse>
                </div>
            </view>
        </view>
        <xPrize ref="refPrize" :prize="prize" />
    </view>
</template>
<script>
//  福利兑换
import { post } from "@/utils/api.js";
import { mapState } from "vuex";
import xPrize from "@/components/modules/x-prize";
export default {
    data() {
        return {
            inviteCode: "",
            prize: {
                bg: "https://img-test.chaoshewang.com/product/1671992c359beb61e04831140cafb456.png",
                btn: "https://img-test.chaoshewang.com/product/ab918901efb1ca2445d9076a98bccb30.png",
                width: 646,
                height: 764,
                imgWidth: 250,
                imgHeight: 250,
            },
            prizeList: [],
            rawInput: "",
            cont: "",
            noClick: true, //防抖挂载
            noClickTime: 3000, //防抖挂载
        };
    },
    components: {
        xPrize,
    },
    watch: {},
    computed: {
        ...mapState(["userInfo"]),
    },
    created() {},
    onShow() {},
    mounted() {
        this.getRuleInfo();
    },
    methods: {
        getRuleInfo() {
            post("v1/system/protocol/get", { key: "RedemptionCodeRules" }).then(
                (res) => {
                    this.cont = res;
                }
            );
        },
        getPrize() {
            if (!this.inviteCode) {
                uni.$u.toast("请输入兑换码~");
                return;
            }
            if (!this.inviteCode.replace(/[^a-zA-Z0-9]/g, "")) {
                uni.$u.toast("只允许输入字母和数字~");
                return;
            }
            post("v1/activity/redemption-code/redemption", {
                redemption_code: this.inviteCode + "",
            }).then((res) => {
                if (res.code) {
                    uni.$u.toast(res.message);
                } else {
                    uni.$u.toast("兑换成功~");
                    this.prizeList = res.award;
                    this.$refs.refPrize.open(this.prizeList);
                }
            });
        },
        showPrize() {
            // this.prize = {};
        },
        getInput(e) {},
        clearIcon() {
            this.inviteCode = "";
        },
    },
};
</script>
<style lang='scss' scoped>
.uni-input-placeholder {
    text-align: center;
    color: #e61eb1;
    font-size: 32rpx;
}
.conversation {
    width: 100vw;
    height: 100vh;

    .header {
        position: sticky;
        top: 0; /* 固定在顶部 */
        z-index: 100; /* 确保在内容上方 */
        width: 100%;
        height: 176rpx;
        background: #ffffff;
        font-weight: 800;
        font-size: 40rpx;
        padding: 44rpx 32rpx 0;
        .icon {
            width: 48rpx;
            height: 48rpx;
            background-image: url("https://img.shinemang.com/gachaStatic/static/img/niudan/ndj_back.png");
            background-size: 100% 100%;
        }
        .icon1 {
            width: 48rpx;
            height: 48rpx;
        }
    }
    .center_box {
        width: 100%;
        height: 1448rpx;
        background-image: url("https://img.shinemang.com/gachaStatic/static/img/activity/conversion_bg.png");
        background-size: 100% 100%;
        padding-top: 560rpx;
        overflow: hidden;
        .center {
            width: 670rpx;
            height: 480rpx;
            margin: 0 auto;
            position: relative;
            background-image: url("https://img.shinemang.com/gachaStatic/static/img/activity/conversion_ box.png");
            background-size: 100% 100%;
            .shou {
                width: 406rpx;
                height: 278rpx;
                position: absolute;
                background-image: url("https://img.shinemang.com/gachaStatic/static/img/activity/conversion_shou.png");
                background-size: 100% 100%;
                left: 50%;
                top: -154rpx;
                transform: translate(-50%);
            }

            .number {
                width: 520rpx;
                height: 88rpx;
                position: absolute;
                background: #ffe2f7;
                border-radius: 48rpx;
                border: 2rpx solid #e61eb1;
                text-align: center;
                color: #e61eb1 !important;
                left: 50%;
                top: 154rpx;
                transform: translate(-50%);
            }
            .input_btn {
                width: 44rpx;
                height: 44rpx;
                position: absolute;
                top: 180rpx;
                right: 90rpx;
                background-image: url("https://img.shinemang.com/gachaStatic/static/img/transaction/close2.png");
                background-size: 100% 100%;
            }

            .btn {
                width: 520rpx;
                height: 88rpx;
                position: absolute;
                left: 50%;
                top: 312rpx;
                transform: translate(-50%);
                line-height: 88rpx;
                background: #e61eb1;
                border-radius: 44rpx;
                font-size: 32rpx;
                color: #ffffff;
                text-align: center;
            }
        }
        .text {
            font-weight: 500;
            font-size: 26rpx;
            color: #ffffff;
            margin: 40rpx 0 0 64rpx;
            .title {
                font-weight: bold;
                font-size: 36rpx;
            }
            .parse_con{
                height: 300rpx;
                overflow-y: auto;
                padding-bottom: 50rpx;
            }
        }
    }
}
</style>
