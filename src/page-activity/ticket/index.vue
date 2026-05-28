<template>
    <view class="ticket">
        <view class="topBack">
            <img
                src="https://img.shinemang.com/gachaStatic/static/img/niudan/ndj_back.png"
                @click.stop="gateBack"
                class="Back_ico"
            />
            <text class="title">超级福利大放送</text>
        </view>
        <view class="particulars">
            <button open-type="share" class="btns_2 t_btn" @click="onShare">
                <image
                    src="https://img.shinemang.com/gachaStatic/static/img/chaowanshang/cws_icon-share.png"
                />
            </button>
            <img
                class="rule"
                src="https://img.shinemang.com/gachaStatic/static/img/activity/huoodngguizhe.png"
                @click="
                    goto('/pages/common/rulepop', {
                        val: 'CostGiftCoupon',
                    })
                "
            />
            <!-- val: 'CostGiftCouponOnce', -->
            <view class="time">8月13日 - 8月19日</view>
            <view class="number">我的抽赏金额：{{ money }}</view>
            <!-- <view class="number">优惠券可领：{{ money }} 抽</view> -->
            <img
                v-if="state == 0"
                class="get"
                src="https://img.shinemang.com/gachaStatic/static/img/activity/huodonganniu.png"
                @click="getInquire"
            />
            <img
                v-else
                class="get"
                src="https://img.shinemang.com/gachaStatic/static/img/activity/zhihuianniu.png"
                @click="hint"
            />
            <view class="attention">
                <view class="title">
                    <view class="l"> </view>
                    <view class="title">注意事项 </view>
                    <view class="r"> </view>
                </view>
                <view class="text"
                    >1.公司有权根据实际情况对活动规则进行必要的调整或解<br />释，以确保活动的公平、公正和顺利进行。
                    <br />2.用户参与活动时需遵守芒星赏APP的相关规定和法律法规要
                    <br />求，不得采用任何不正当手段参与活动或获取奖励。对于违<br />规行为，芒星赏文化传播公司有权取消用户的参与资格及已获
                    <br />得的奖励。</view
                >
            </view>
        </view>
    </view>
</template>
<script>
import { post, activityLIst } from "@/utils/api.js";
import { uniShare } from "@/utils/fun.js";
export default {
    data() {
        return {
            state: null,
            money: 0,
            message: {},
            keyList: [{ key: "CostGiftCoupon", id: 102 }],
        };
    },
    components: {},
    watch: {},
    computed: {},
    onLoad(da) {
        this.message = JSON.parse(da.itemJson);
        if (this.message) {
            const foundItem = this.keyList.find(
                (item) => item.id === this.message.type
            );
            if (foundItem) {
                // 找到后进行赋值操作
                this.message.key = foundItem.key;
            }
        }
    },
    onShow() {
        this.onInquire();
    },
    created() {},
    mounted() {},
    methods: {
        onShare() {
            uniShare(
                {
                    tit: this.message.name,
                    path: "page-activity/ticket/index",
                },
                { id: this.message.id, index: 0 }
            );
        },
        async onInquire() {
            // post("v1/activity/cost-gift-coupon-once").then((res) => {
            //     this.state = res.state;
            //     this.money = res.cnt;
            // });
            post("v1/activity/cost-gift-coupon").then((res) => {
                this.state = res.state;
                this.money = res.CurrentAmount;
            });
            let a = await activityLIst({ key: ["CostGiftCoupon"] });
        },
        getInquire() {
            post("v1/activity/cost-gift-coupon/accept").then((res) => {
                // post("v1/activity/cost-gift-coupon-once/accept").then((res) => {
                uni.showToast({
                    title: "您已领取成功~",
                    icon: "none",
                    duration: 2000,
                });
                this.onInquire();
            });
        },
        hint() {
            if (this.state == 1) {
                uni.showToast({
                    title: "您已领取~",
                    icon: "none",
                    duration: 2000,
                });
            } else {
                uni.showToast({
                    title: "您尚未达到领取条件~",
                    icon: "none",
                    duration: 2000,
                });
            }
        },
    },
};
</script>
<style lang='scss' scoped>
.ticket {
    // width: 750rpx;
    background-color: #a8a2e9;
    background-image: url("https://img.shinemang.com/gachaStatic/static/img/activity/DFSx.png");
    // background-image: url("https://img.shinemang.com/gachaStatic/static/img/activity/hdbg.png");
    background-size: 100% 100%;
    height: 1624rpx;
    // height: 100vh;
    overflow-y: auto;
}

.Back_ico {
    width: 50rpx;
    height: 50rpx;
    margin-right: 50rpx;
}
.title {
    height: 50rpx;
    line-height: 50rpx;
}
.share {
    margin-left: 90rpx;
    width: 48rpx;
    height: 48rpx;
}
.particulars {
    width: 100%;
    height: 100%;
    position: relative;
    .btns_2 {
        left: 19rpx;
        top: 320rpx;
        padding: 0;
        background-color: rgba($color: #000, $alpha: 0);

        &::after {
            border: none;
        }

        image {
            width: 72rpx;
            height: 72rpx;
        }
    }
    .t_btn {
        width: 72rpx;
        height: 72rpx;
        position: absolute;
    }
    .rule {
        width: 50rpx;
        height: 102rpx;
        position: absolute;
        right: 0;
        top: 320rpx;
    }
    .time {
        position: absolute;
        left: 274rpx;
        top: 418rpx;
        font-size: 28rpx;
        color: #ffffff;
    }
    .number {
        width: 502rpx;
        height: 60rpx;
        line-height: 60rpx;
        text-align: center;
        position: absolute;
        left: 124rpx;
        top: 950rpx;
        font-weight: 800;
        font-size: 28rpx;
        color: #e97102;
    }
    .get {
        position: absolute;
        left: 192rpx;
        top: 1074rpx;
        width: 366rpx;
        height: 132rpx;
    }
    .attention {
        position: absolute;
        width: 686rpx;
        height: 304rpx;
        left: 32rpx;
        bottom: 32rpx;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 16rpx 16rpx 16rpx 16rpx;
        padding: 24rpx;
        .title {
            display: flex;
            width: 100%;
            height: 40rpx;
            align-items: center;
            justify-content: center;
            // margin-bottom: 12rpx;
            .l {
                width: 60rpx;
                height: 0rpx;
                border-radius: 0rpx 0rpx 0rpx 0rpx;
                border: 2rpx solid;
                border-image: linear-gradient(
                        90deg,
                        rgba(227, 142, 0, 0),
                        rgba(227, 142, 0, 1)
                    )
                    2 2;
            }
            .title {
                width: 112rpx;
                font-weight: 800;
                font-size: 28rpx;
                color: #e38e00;
                margin: 0 20rpx 0;
            }
            .r {
                width: 60rpx;
                height: 0rpx;
                border-radius: 0rpx 0rpx 0rpx 0rpx;
                border: 2rpx solid;
                border-image: linear-gradient(
                        90deg,
                        rgba(227, 142, 0, 1),
                        rgba(227, 142, 0, 0)
                    )
                    2 2;
            }
        }
        .text {
            height: 40rpx;
            line-height: 40rpx;
            font-weight: 500;
            font-size: 24rpx;
            color: #e38e00;
        }
    }
}
</style>