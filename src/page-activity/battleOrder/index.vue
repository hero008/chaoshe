<template>
    <view class="battleOrder">
        <view class="topBack">
            <img src="https://img.chaoshewang.com/static/img/niudan/ndj_back.png" @click.stop="gateBack"
                class="Back_ico" />
            <!--  #ifndef MP-WEIXIN -->
            <view class="share" @click="onShare"></view>
            <!-- #endif -->
        </view>
        <view class="rule" @click="goto('/pages/common/rulepop', { val: 'TaskZhanLingRule' })"></view>
        <view class="list">
            <view v-for="(item, index) in list" :key="index">
                <view class="item flex_r flex_ac" v-for="(k, s) in item.subTask" :key="s">
                    <image class="freeOfCharge" :src="k.thumb" />
                    <!-- <view class="left">
                        <view><span :class="{
                           'num': k.target <= 9999,
                            'num1': k.target> 9999,
                            'num2': k.target> 99999,
                            'num3': k.target > 999999,
                        }">{{ k.target}}</span><br /><span>流水</span></view>
                    </view> -->
                    <view class="center">
                        <view class="one">{{ k.name }}</view>
                        <view class="tow flex_r  flex_ac " v-for="(j, y) in k.award" :key="y"
                            @click="ondetail(j.value)">
                            <img :src="j.thumb" class="img" />
                            <view class="name ellipsis2">{{ j.name }}</view>
                        </view>
                        <view class="progress-container">
                            <view class="progress-bar" :style="{ width: calculateProgress(k.schedule) + '%' }"></view>
                            <view class="number">{{ k.schedule.current + "/" + k.schedule.target }}</view>
                        </view>
                    </view>
                    <view class="right">
                        <view :class="{
                            'getPrize': k.schedule.status === 'TaskUserScheduleStatus_Finished',
                            'unclaimed': k.schedule.status === 'TaskUserScheduleStatus_Enable' ||
                                k.schedule.status === 'TaskUserScheduleStatus_Disenable',
                            'notQualified ': k.schedule.status === 'TaskUserScheduleStatus_Disenable'
                        }" @click="getAward(item.id, k)">{{ k.schedule.status !== 'TaskUserScheduleStatus_Finished' ? "领取" : "" }}</view>
                    </view>
                </view>
                <view class="item flex_r flex_ac" v-if="item.award  && item.award.length > 0">
                  <image class="freeOfCharge" :src="item.thumb" />
                    <view class="center">
                        <view class="one">{{ item.name }}</view>
                        <view class="tow flex_r  flex_ac " v-for="(j, y) in item.award" :key="y"
                            @click="ondetail(j.value)">
                            <img :src="j.thumb" class="img" />
                            <view class="name ellipsis2">{{ j.name }}</view>
                        </view>
                        <view class="progress-container">
                            <view class="progress-bar" :style="{ width: calculateProgress(item.schedule) + '%' }">
                            </view>
                            <view class="number">{{ item.schedule.current + "/" + item.schedule.target }}</view>
                        </view>
                    </view>
                    <view class="right">
                        <view :class="{
                            'getPrize': item.schedule.status === 'TaskUserScheduleStatus_Finished',
                            'unclaimed': item.schedule.status === 'TaskUserScheduleStatus_Enable' ||
                                item.schedule.status === 'TaskUserScheduleStatus_Disenable',
                            'notQualified ': item.schedule.status === 'TaskUserScheduleStatus_Disenable'
                        }" @click="getAward(0, item)">{{ item.schedule.status !== 'TaskUserScheduleStatus_Finished' ?"领取" : "" }}</view>
                    </view>
                </view>
            </view>
        </view>
        <gachaDetails ref="gachaDetails" />
    </view>
</template>
<script>
// 财神战令
import { post } from "@/utils/api.js";
import { uniShare, calculateProgress } from "@/utils/fun.js";
export default {
    data() {
        return {
            message: {
                id: "",
            },
            list: [],
        };
    },
    onLoad(da) {
        this.message.id = da;
        this.getData()
    },
    methods: {
        onShare() {
            uniShare(
                {
                    tit: '财运战令',
                    path: "page-activity/battleOrder/index",
                },
                { id: this.message.id, index: 0 },
                "https://img.chaoshewang.com/static/img/activity/moneyShare.png"
            );
        },
        calculateProgress,
        ondetail(id) {
            this.gachaDetailsMethod(this, id);
        },
        getData(key = "") {
            post("v1/task/list", {
                type: 2,
                key: key,
            }).then(
                (res) => {
                    if (!res.code) {
                        if (key) {
                            // 遍历现有列表，找到并更新匹配的项
                            for (let i = 0; i < this.list.length; i++) {
                                if (this.list[i].key === res.data[0].key) {
                                    // 使用Vue的响应式方法替换整个对象，确保视图更新
                                    this.$set(this.list, i, res.data[0]);
                                    break;
                                }
                            }
                        } else {
                            this.list = [];
                            this.list = res.data;
                        }

                    }
                }
            );
        },
        getAward(item, schedule) {
            post("v1/task/accept", { id: item, sub_id: schedule.id }).then(
                (res) => {
                    if (!res.code) {
                        uni.$u.toast("领取成功");
                        this.getData(schedule.key);
                    } else uni.$u.toast(res.message);
                }
            );
        },

    },
};
</script>
<style lang='scss' scoped>
.battleOrder {
    width: 100%;
    /*#ifdef APP-PLUS*/
    min-height: 100vh;
    background-size: 1;
    background-image: url("https://img.chaoshewang.com/static/img/activity/bOBg1.png");
    background-size: 100% auto;
    background-repeat: no-repeat;
    background-position: top center;
    background-color: #CAB4FF;
    /*#endif*/
    /*#ifdef H5*/
    min-height: 100vh;
    background-size: 1;
    background-image: url("https://img.chaoshewang.com/static/img/activity/bOBg1.png");
    background-size: 100% auto;
    background-repeat: no-repeat;
    background-position: top center;
    background-color: #CAB4FF;
    /*#endif*/

    /*#ifdef MP*/
    height: 100vh;
    overflow-y: auto;
    background-image: url("https://img.chaoshewang.com/static/img/activity/bOBg1.png");
    background-size: 100% 100%;

    /*#endif*/
    .list {

        padding-top: 594rpx;
        width: 100%;
        padding-bottom: 20rpx;

        .item {
            width: 702rpx;
            margin: 0 auto 24rpx;
            background: #FFFFFF;
            border-radius: 48rpx;
            padding: 32rpx 0 ;
            .freeOfCharge {
                width: 128rpx;
                height: 128rpx;
                // background-image: url("https://img.chaoshewang.com/static/img/activity/freeOfCharge.png");
                // background-size: 100% 100%;
                margin: 0 24rpx;
            }

            .left {
                width: 128rpx;
                height: 128rpx;
                margin: 0 24rpx;
                background: #6753FF;
                box-shadow: inset 0rpx 10rpx 20rpx 0rpx #D0CAFF;
                border-radius: 50rpx;
                font-weight: 1000;
                font-size: 28rpx;
                color: #FFFFFF;
                text-align: center;
                padding-top: 24rpx;

                .num {
                    font-weight: 1000;
                    font-size: 44rpx;
                }

                .num1 {
                    font-weight: 900;
                    font-size: 40rpx;
                }

                .num2 {
                    font-weight: 900;
                    font-size: 34rpx;
                }

                .num3 {
                    font-weight: 900;
                    font-size: 30rpx;
                }
            }

            .center {
                width: 366rpx;
                font-weight: 800;

                .one {
                    width: 100%;

                    font-size: 32rpx;
                }

                .tow {
                    width: 100%;
                    height: 96rpx;
                    background: #F3EAFF;
                    border-radius: 16rpx;
                    margin: 16rpx 0 24rpx;

                    .img {
                        width: 60rpx;
                        height: 60rpx;
                        border-radius: 8rpx;
                        margin: 0 12rpx;
                    }

                    .name {
                        width: 268rpx;
                        font-weight: 800;
                        font-size: 24rpx;
                        color: #917CC0;
                        text-align: left;

                    }
                }

                .progress-container {
                    width: 100%;
                    height: 20rpx;
                    line-height: 20rpx;
                    background: #DEC6FF;
                    text-align: center;
                    border-radius: 10rpx;
                    font-size: 20rpx;
                    overflow: hidden;
                    position: relative;
                    margin-top: 12rpx;
                    .number {
                        position: absolute;
                        z-index: 22;
                        left: 50%;
                        top: 50%;
                        color: rgba(0, 0, 0, 0.5);
                        transform: translate(-50%, -50%);
                    }

                    .progress-bar {
                        height: 100%;
                        background-color: #6753FF;
                        border-radius: 10rpx;
                    }
                }
            }

            .right {
                width: 160rpx;

                .getPrize {
                    width: 128rpx;
                    height: 128rpx;
                    margin: auto;
                    background-image: url("https://img.chaoshewang.com/static/img/activity/getPrize.png");
                    background-size: 100% 100%;
                    pointer-events: none;
                }

                .unclaimed {
                    width: 112rpx;
                    height: 56rpx;
                    line-height: 56rpx;
                    margin: auto;
                    border-radius: 48rpx;
                    font-weight: 800;
                    font-size: 28rpx;
                    color: #FFFFFF;
                    text-align: center;
                    background: #E43FD6;
                    box-shadow: inset 0rpx 8rpx 16rpx 0rpx rgba(255, 255, 255, 0.5);

                }

                .notQualified {
                    background: #C5C5DD;
                    pointer-events: none;
                }
            }
        }
    }
}

.rule {
    width: 50rpx;
    height: 102rpx;
    background-image: url("https://img.chaoshewang.com/static/img/activity/gz.png");
    background-size: 100% 100%;
    position: fixed;
    right: 0;
    top: 320rpx;
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
    background-image: url("https://img.chaoshewang.com/static/img/activity/fenx.png");
    background-size: 100% 100%;
    margin-left: auto;
    width: 48rpx;
    height: 48rpx;
}
</style>