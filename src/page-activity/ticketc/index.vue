<template>
    <view
        class="ticket"
        :style="{ backgroundImage: `url(${message.imageUrlMap.bg})`}"
    >
        <view :style="{
            top: MBInfo().top + 'px' ,
            height:'40px',
            alignItems:'center'
        }" class="topBack">
            <img
                src="https://img.shinemang.com/gachaStatic/static/img/niudan/ndj_back.png"
                @click.stop="gateBack"
                class="Back_ico"
            />
            <text style="color: #fff;" class="title">{{ message.name }}</text>
        </view>
        <view class="particulars">
            <!-- #ifndef MP-WEIXIN -->
            <!-- <button open-type="share" class="btns_2 t_btn" @click="onShare">
                <image
                    src="https://img.shinemang.com/gachaStatic/static/img/chaowanshang/cws_icon-share.png"
                />
            </button> -->
            <!-- #endif -->
            <img
                class="rule"
                :src="message.imageUrlMap.rule"
                @click="
                    goto('/pages/common/rulepop', {
                        val: 'CostGiftCouponSummary',
                    })
                "
            />
            <!-- style="bottom" -->
            <view class="box">
                
                <view :style="{
                    color:message.paramsMap.time
                }" class="time"
                    >{{ message.startTime }} - {{ message.endTime }}</view
                >
                <view style="height: 610rpx;"></view>
                <!-- margin-top -->
               
                <!-- margin-top -->
                <img
                    class="get"
                    :src="
                        state == 0
                            ? message.imageUrlMap.button_open
                            : message.imageUrlMap.button_close
                    "
                    @click="getInquire"
                />
                 <view class="number">优惠券可领：{{ money }} </view>
            </view>

            <view class="attention">
                <view class="title">
                    <view class="l"> </view>
                    <view class="title">注意事项 </view>
                    <view class="r"> </view>
                </view>
                <view class="text"
                    >1.公司有权根据实际情况对活动规则进行必要的调整或解<br />释，以确保活动的公平、公正和顺利进行。
                    <br />2.用户参与活动时需遵守芒星赏的相关规定和法律法规要
                    <br />求，不得采用任何不正当手段参与活动或获取奖励。对于违<br />规行为，芒星赏有权取消用户的参与资格及已获
                    <br />得的奖励。</view
                >
            </view>
        </view>
    </view>
</template>
<script>
import { post, activityLIst } from "@/utils/api.js";
import { uniShare } from "@/utils/fun.js";
import color from "uview-ui/libs/config/color";
export default {
    data() {
        return {
            state: null,
            money: 0,
            message: { imageUrlMap: { bg: "" } },
        };
    },
    components: {},
    watch: {},
    computed: {},
    onLoad(da) {
        // this.message = JSON.parse(da.itemJson);
        // this.message.id=da
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
                    path: "page-activity/ticketc/index",
                },
                { id: this.message.id, index: 0 },
                this.message.imageUrlMap.share
            );
        },
        async onInquire() {
            let a = await activityLIst({ key: ["CostGiftCouponSummary"] });
            this.message = a.activities[0];
            this.message.startTime = this.monthAndndDay(
                a.activities[0].startTime
            );
            this.message.endTime = this.monthAndndDay(a.activities[0].endTime);
            post("v1/activity/cost-gift-coupon-summary").then((res) => {
                this.state = res.state;
                this.money = res.cnt;
            });
        },
        getInquire() {
            if (this.state !== 0){
                uni.showToast({
                    title:'暂无可领优惠券',
                    icon:"none"
                })
                return
            };
            post("v1/activity/cost-gift-coupon-summary/accept").then((res) => {
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
page{
    background:#0d4799 ;
}
.ticket {
    // width: 750rpx;
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
    .box {
        width: 100%;
        position: absolute;
        bottom: 350rpx;
        .time {
            text-align: center;
            font-size: 28rpx;
            color: #fff;
            
        }
        .number {
             margin-top: -10rpx;
            text-align: center;
            font-weight: 800;
            font-size: 28rpx;
            color: #fff;
        }
        .get {
            display: block;
            transform: scale(1.5);
            width: 366rpx;
            height: 132rpx;
            margin: 40rpx auto 0;
        }
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
        overflow-y: auto;
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
                        rgba(255, 255, 0, 1)
                    )
                    2 2;
            }
            .title {
                width: 112rpx;
                font-weight: 800;
                font-size: 28rpx;
                color: #fff;
                margin: 0 20rpx 0;
            }
            .r {
                width: 60rpx;
                height: 0rpx;
                border-radius: 0rpx 0rpx 0rpx 0rpx;
                border: 2rpx solid;
                border-image: linear-gradient(
                        90deg,
                        rgba(255, 255, 0, 1),
                        rgba(227, 142, 0, 0)
                    )
                    2 2;
            }
        }
        .text {
            // height: 40rpx;
            line-height: 40rpx;
            font-weight: 500;
            font-size: 24rpx;
            color: #fff;
        }
    }
}
</style>