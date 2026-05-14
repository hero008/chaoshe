<template>
    <view class="luck">
        <u-navbar title="集赏行动" bgColor="transparent" :titleStyle="titleStyle" @leftClick="gateBack" placeholder>
            <view class="fenxiang" slot="right" @click="onShare" :style="[
                SystemInfo.uniPlatform == 'app' ? '' : { display: 'none' },
            ]" />
        </u-navbar>
        <div class="con_box" :style="{ height: conHeight }">
            <div class="time flex_r flex_ac flex_jc">
                <view class="timeTiele">集赏时间：</view>
                <template v-if="residuetime > 0">
                    <u-count-down :time="residuetime" @change="rtimeChange">
                        <view class="timetxt">
                            <text>{{ timeData.days }}天</text>
                            <text>{{ timeData.hours }}小时</text>
                            <text>{{ timeData.minutes }}分</text>
                            <text>{{ timeData.seconds }}秒</text>
                        </view>
                    </u-count-down>
                </template>
                <div class="timetxt" v-else>已结束</div>
            </div>
            <view class="content">
                <view class="uni-margin-wrap">
                    <swiper :current="swiperCurrent" class="swiper" next-margin="200rpx" previous-margin="200rpx"
                        @change="swiperChange">
                        <swiper-item v-for="(i, index) in exchangeList" :key="index" class="swiper swiper-slide">
                            <view class="swiper-item uni-bg-red">
                                <view class="swiper-box" :style="[
                                    swiperCurrent !== index
                                        ? {
                                            opacity: 0.3,
                                            'pointer-events': 'none ',
                                        }
                                        : '',
                                ]">
                                    <image :src="i.item.thumb" class="swiper-img" @click="ondetail(i.item.id)" />
                                    <view class="swiper-title">{{
                                        i.item.name
                                    }}</view>
                                    <view class="swiper-price">￥{{ i.item.price }}</view>
                                    <view class="swiper-number">赏品剩余:
                                        {{
                                            i.stock !== "" ? i.stock : 99999
                                        }}</view>
                                </view>
                            </view>
                        </swiper-item>
                    </swiper>
                    <view class="css-prevSlide" @click="prevSlide(-1)"></view>
                    <view class="css-nextSlide" @click="prevSlide(1)"></view>
                </view>
            </view>
            <view class="schedule">
                <view class="schedule-title"></view>
                <view class="jd">
                    <view class="progress-container">
                        <view class="progress-bar"
                            :style="{ width: calculateProgress({ current: currentPercent, target: totalPrice }) + '%' }">
                        </view>
                        <view class="number">{{ calculateProgress({
                            current: currentPercent, target: totalPrice
                        }).toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1')}}%</view>
                    </view>
                    <!-- <view class="progress-view flex_js">
                        <view class="progress" :style="{ width: setProStyle + 'rpx' }"></view>
                          <view class="progress" :style="{ width: calculateProgress({current: totalPrice,target:currentPercent}) + '%' }"></view>
                        <view class="progress-num">{{ currentPercent / totalPrice * 100 }}/100</view>
                    </view> -->
                    <view class="progress-text">点选材料，进度满，可集成 </view>
                </view>

            </view>
            <view class="placement-area">
                <view class="placement-img"></view>
                <view class="add" @click="addStock">
                    <view class="add-btn"></view>
                    <view class="text">点击添加材料</view>
                </view>
                <view class="placement-imgBox">
                    <swiper class="placement-swiper" next-margin="510rpx" previous-margin="0rpx" :current="swiperIndex"
                        @change="onSwiperIndex">
                        <swiper-item v-for="(i, index) in swiperList" :key="index">
                            <view class="placement-item">
                                <image class="placement-image" :src="i.itemCover" />
                                <view class="saleNums">x{{ i.stockIds.length }}</view>
                            </view>
                        </swiper-item>
                    </swiper>
                </view>
            </view>
            <view class="button" :style="[
                insufficient
                    ? ''
                    : {
                        backgroundImage:
                            'url(https://img.chaoshewang.com/static/img/luck/anclbz.png)',
                        height: '92rpx',
                    },
            ]" @click="goGather"></view>
            <view class="con_box_bottom"></view>
        </div>
        <u-overlay :show="overflowBox == 1">
            <view class="tishi">
                <view class="title">集赏材料价格已溢出，是否继续集成？</view>
                <view class="tishi-btn">
                    <x-btn txt="取消" @click="overflowBtn(false)" />
                    <x-btn txt="确认" @click="overflowBtn(true)" cor="1" />
                </view>
            </view>
        </u-overlay>
        <u-overlay :show="overflowBox == 2">
            <view class="overlay-title"></view>
            <view class="overlay-kp" v-if="Object.keys(conversion).length !== 0">
                <image class="wp" :src="conversion.thumb" />
                <view class="kp-name">{{ conversion.name }} </view>
                <view class="kp-btn" @click="onEmpty"></view>
            </view>
            <div class="go" @click="goChaoGui">
                <view>赏品已放入潮柜</view>
                <view class="go-chaoGui"></view>
            </div>
        </u-overlay>
        <select-goods ref="addStock" @totalNums="
            (va) => {
                totalNums = va;
            }
        " @confirmSelect="SelectIds" isfilt="1" typeClass="0" :money="false" />
        <gachaDetails ref="gachaDetails" />
    </view>
</template>
<script>
import { post } from "@/utils/api.js";
import { mapState } from "vuex";
import selectGoods from "@/components/selectGoods/index";
import xBtn from "@/components/modules/x-btn";
import { uniShare, calculateProgress } from "@/utils/fun.js";
export default {
    data() {
        return {
            titleStyle: {
                fontWeight: 800,
                color: "#000",
                fontSize: "36rpx",
            },
            swiperCurrent: null,
            currentPercent: 0, //单价
            selectRewardIds: [],
            totalNums: 0, // 待交易赏品总数量
            exchangeList: [],
            timeData: {},
            residuetime: 0,
            totalPrice: 0,
            // selectRewardsInfo: [],
            insufficient: false,
            overflowBox: 0,
            numsId: "",
            conversion: {},
            swiperIndex: 0,
            swiperList: [],
            // showList: 10,
        };
    },
    components: {
        selectGoods,
        xBtn,
    },
    watch: {},
    computed: {
        ...mapState(["userInfo"]),
        conHeight() {
            let h = this.SystemInfo.screenHeight;
            let va = this.MBInfo();
            let th = va.height + va.top;
            let str = h - th - 38 + "px";
            return str;
        },
        //设置进度条样式，实时更新进度位置
        setProStyle() {
            return this.currentPercent * (510 / this.totalPrice); //510：按钮进度条宽度
        },
    },
    created() { },
    mounted() { },
    onLoad(da) {
        this.asyncUpBalance(da.index - 1, da.id);
    },
    onShow() { },
    methods: {
        // 分享
        onShare() {
            uniShare(
                {
                    tit: "集赏行动",
                    path: "page-a/luck/playingMethod",
                },
                { id: "", index: "" },
                this.exchangeList[this.swiperCurrent].item.thumb
                // this.swiperCurrent
            );
        },
        calculateProgress,
        swiperChange(e) {
            this.swiperCurrent = e.detail.current;
            this.onPage(e.detail.current);
        },
        onSwiperIndex(e) {
            // this.swiperIndex = e.detail.current;
            // if (
            //     e.detail.current > this.showList &&
            //     this.selectRewardsInfo.length > 20
            // ) {
            //     this.showList += 10;
            //     this.swiperList = [
            //         ...new Set([
            //             ...this.swiperList,
            //             ...this.selectRewardsInfo.slice(
            //                 this.showList,
            //                 this.showList + 10
            //             ),
            //         ]),
            //     ];
            // }
        },
        prevSlide(value) {
            if (
                this.swiperCurrent + value > -1 &&
                this.swiperCurrent + value < this.exchangeList.length
            ) {
                this.swiperCurrent = this.swiperCurrent + value;
                this.onPage(this.swiperCurrent);
            } else uni.$u.toast("最后一页");
        },
        onPage(value) {

            this.totalPrice = Number(this.exchangeList[value].item.price);
            this.conversion = this.exchangeList[value].item;
            this.insufficient = this.currentPercent >= this.totalPrice ? true : false;
        },
        addStock() {
            this.$refs.addStock.open(this.swiperList, this.totalPrice, true);
        },
        asyncUpBalance(index, id) {
            this.swiperList = [];
            post("v1/activity/item-exchange/list", {}).then((res) => {
                if (!res.code) {
                    this.residuetime = this.remainingTime(res.endTime);
                    res.config.map((item) => {
                        if (item.endTime == "") item.endTime = true;
                        else {
                            item.endTime = this.remainingTime(item.endTime) > 0;
                        }
                        if (item.startTime == "") item.startTime = true;
                        else {
                            item.startTime =
                                this.remainingTime(item.startTime) < 0;
                        }
                    });
                    this.exchangeList = res.config.filter(
                        (item) =>
                            (item.stock !== "0") & item.endTime & item.startTime
                    );
                    if (id !== "") {
                        const getIndex = (targetid) =>
                            this.exchangeList.findIndex(
                                (item) => item.id === targetid
                            );
                        this.swiperCurrent = getIndex(id);
                    } else this.swiperCurrent = index;
                    this.conversion =
                        this.exchangeList[this.swiperCurrent].item;
                    this.totalPrice = Number(
                        this.exchangeList[this.swiperCurrent].item.price
                    );
                }
            });
        },
        SelectIds(list, addTotalPrice) {
            this.currentPercent = 0;
            this.swiperIndex = 0;
            this.swiperList = [];
            this.numsId = "";
            this.swiperList = list;
            this.currentPercent = addTotalPrice;
            if (this.currentPercent >= this.totalPrice)
                this.insufficient = true;
            else this.insufficient = false;
        },
        rtimeChange(e) {
            this.timeData = e;
        },
        overflowBtn(value) {
            let id = [];
            this.swiperList.map((item) => {
                id = [...id, ...item.stockIds.slice(0, item.checked)];
            });
            this.numsId = this.exchangeList[this.swiperCurrent].id;
            if (value) {
                post("v1/activity/item-exchange/exchange", {
                    id: this.numsId,
                    stock_id: id,
                }).then((res) => {
                    if (!res.code) {
                        this.overflowBox = 2;
                        // this.selectRewardsInfo = [];
                        this.swiperList = [];
                        // this.showList = 10;
                    } else {
                        uni.$u.toast("集赏失败,请稍后重试！");
                    }
                });
            } else this.overflowBox = 0;
        },
        goGather() {
            if (this.insufficient) {
                if (
                    this.currentPercent >=
                    this.totalPrice + this.totalPrice * 0.1
                ) {
                    this.overflowBox = 1;
                } else this.overflowBtn(true);
            } else {
                uni.reLaunch({
                    url: "/pages/index/index",
                });
            }
        },
        goChaoGui() {
            uni.setStorageSync("currentChange", 3);
            uni.reLaunch({
                url: "/pages/index/index",
            });
        },
        onEmpty() {
            this.$refs.addStock.getSubclassReward();
            this.overflowBox = 0;
            this.currentPercent = 0;
            // this.selectRewardsInfo = [];
            this.swiperList = [];
            // this.showList = 10;
            this.insufficient = false;
            this.asyncUpBalance(this.swiperCurrent, "");
        },
        ondetail(id) {
            this.gachaDetailsMethod(this, id)
        },
    },
};
</script>
<style lang="scss" scoped>
.con_box_bottom {
    width: 100%;
    height: 96rpx;
}

.tishi {
    width: 590rpx;
    height: 308rpx;
    margin: 0 auto;
    margin-top: 568rpx;
    background: #ffffff;
    border-radius: 40rpx;
    padding-top: 80rpx;

    .title {
        font-weight: 500;
        font-size: 28rpx;
        color: #383228;
        margin-bottom: 64rpx;
        text-align: center;
    }

    .tishi-btn {
        display: flex;
        width: 510rpx;
        margin: 0 auto;
        justify-content: space-between;
    }
}

.fenxiang {
    width: 48rpx;
    height: 48rpx;
    background-image: url("https://img.chaoshewang.com/static/img/activity/fenx.png");
    background-size: 100% auto;
}

.rightImg {
    position: absolute;
    width: 248rpx;
    height: 200rpx;
    background-image: url("https://img.chaoshewang.com/static/img/luck/zt.png");
    background-size: 100% auto;
    right: 0;
    top: 312rpx;
}

.luck {
    width: 100%;
    height: 100vh;
    overflow-y: auto;
    background-image: url("https://img.chaoshewang.com/static/img/luck/bj3x.png");
    background-size: 100% auto;
    background-color: rgba(222, 215, 248, 1);
    font-family: PingFang SC, PingFang SC;
}

.time {
    width: 478rpx;
    height: 40rpx;
    margin: 0 auto;
    line-height: 40rpx;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 40rpx;
    border-image: linear-gradient(180deg,
            rgba(255, 255, 255, 0.5),
            rgba(255, 255, 255, 0.7)) 2 2;

    font-weight: bold;
    font-size: 24rpx;
    color: #886be8;
    text-align: center;
}

.content {
    width: 100%;
    height: 488rpx;
    margin-top: 52rpx;
    border: #886be8;

    .uni-margin-wrap {
        width: 100% !important;
        height: 100%;
        margin: 0 !important;
        overflow: visible !important;
        position: relative;

        .swiper {
            height: 100% !important;
            // padding-top: 32rpx;
        }
    }

    .uni-swiper-wrapper {
        overflow: visible !important;
        // uni-swiper-navigation uni-swiper-navigation-prev uni-swiper-navigation-disabled
    }

    .uni-swiper {
        .uni-swiper-item {
            overflow: visible !important;
        }
    }

    .swiper-item {
        width: 320rpx !important;
        height: 492rpx !important;
        margin-top: 32rpx !important;
        margin: 0 auto;
    }

    .swiper-box {
        width: 320rpx;
        height: 460rpx;
        margin: 0 auto;
        padding-top: 278rpx;
        background: #ffffff;
        box-shadow: 0rpx 4rpx 8rpx 2rpx rgba(136, 106, 232, 0.25);
        border-radius: 24rpx;
        position: absolute;
        overflow: visible !important;

        .swiper-img {
            width: 288rpx;
            height: 288rpx;
            border-radius: 16rpx;
            background: #fff;
            position: absolute;
            top: -32rpx;
            left: 0;
            right: 0;
            margin: 0 auto;
        }

        .swiper-title {
            width: 256rpx;
            height: 64rpx;
            margin: 0 auto;

            font-weight: 500;
            font-size: 24rpx;
            color: #383228;
            display: -webkit-box;
            overflow: hidden;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }

        .swiper-price {
            width: 100%;
            height: 36rpx;
            margin-top: 8rpx;
            font-weight: bold;
            font-size: 28rpx;
            color: #383228;
            line-height: 36rpx;
            text-align: center;
            margin-bottom: 16rpx;
        }

        .swiper-number {
            width: 200rpx;
            height: 40rpx;
            line-height: 40rpx;

            margin: 0 auto;
            background: rgba(255, 84, 85, 0.1);
            border-radius: 20rpx;
            font-weight: 500;
            font-size: 24rpx;
            color: #ff5455;
            text-align: center;
        }
    }
}

.css-prevSlide {
    position: absolute;
    left: 64rpx;
    top: 168rpx;
    width: 120rpx !important;
    height: 140rpx !important;
    background-image: url("https://img.chaoshewang.com/static/img/luck/jtleft.png") !important;
    background-size: 100% auto;
}

.css-nextSlide {
    position: absolute;
    right: 64rpx;
    top: 168rpx;
    width: 120rpx !important;
    height: 140rpx !important;
    background-image: url("https://img.chaoshewang.com/static/img/luck/jtright.png") !important;
    background-size: 100% auto;
}

.schedule {
    width: 640rpx;
    height: 32rpx;
    display: flex;
    margin: 56rpx auto;

    .schedule-title {
        width: 120rpx;
        height: 28rpx;
        background-image: url("https://img.chaoshewang.com/static/img/luck/jcjd.png");
        background-size: 100% auto;
    }

    .jd {
        position: relative;
        font-weight: 500;
        font-size: 20rpx;
        color: #383228;

        .progress-container {
            width: 502rpx;
            height: 32rpx;
            border-radius: 40rpx;
            background: #f3e8ff;
            text-align: center;
            overflow: hidden;
            position: relative;
            border: 2rpx solid #ffffff;

            .number {
                position: absolute;
                z-index: 22;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            }

            .progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #8769e7 0%, #b462da 100%);
                border-radius: 10rpx;
            }
        }

        .progress-view {
            width: 502rpx;
            height: 32rpx;
            border-radius: 40rpx;
            background: #f3e8ff;
            border: 2rpx solid #ffffff;
            overflow: hidden;
            position: absolute;

            &.active {
                background: linear-gradient(90deg, #8769e7 0%, #b462da 100%);
            }

            .progress {
                height: 28rpx;
                border-radius: 40rpx;
                background: linear-gradient(90deg, #8769e7 0%, #b462da 100%);
            }

            .progress-num {
                position: absolute;
                top: 0;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            }

        }

        .progress-text {
            width: 502rpx;
            top: 32rpx;
            position: absolute;
            text-align: center;
        }

    }

}

.placement-area {
    width: 686rpx;
    height: 456rpx;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 32rpx;
    position: relative;
    font-weight: 500;
    font-size: 20rpx;
    color: #aca9bc;
    padding-top: 100rpx;

    .placement-img {
        position: absolute;
        width: 282rpx;
        height: 76rpx;
        left: 0;
        right: 0;
        margin: 0 auto;
        top: -16rpx;
        background-image: url("https://img.chaoshewang.com/static/img/luck/cltfq.png");
        background-size: 100% auto;
    }

    .add {
        width: 400rpx;
        height: 160rpx;
        background: #f3f2f4;
        border-radius: 12rpx;
        border: 2rpx dashed #aca9bc;
        margin: 0 auto;

        .add-btn {
            width: 48rpx;
            height: 48rpx;
            margin: auto;
            margin-top: 44rpx;
            background-image: url("https://img.chaoshewang.com/static/img/luck/tjcl.png");
            background-size: 100% auto;
        }

        .text {
            width: 100%;
            text-align: center;
            margin-top: 16rpx;
        }
    }

    .placement-imgBox {
        width: 100%;
        height: 140rpx;
        padding-left: 24rpx;
        padding-left: 24rpx;
        margin-top: 32rpx;

        .placement-swiper {
            width: 100%;
            height: 140rpx;

            .placement-item {
                width: 140rpx !important;
                height: 140rpx;
                background: #f3f2f4;
                border-radius: 16rpx;
                border: 2rpx solid #d8d6e2;
                padding: 4rpx;
                position: relative;

                .placement-image {
                    width: 128rpx;
                    height: 128rpx;
                    margin: 0 auto;
                    border-radius: 10rpx;
                }

                .saleNums {
                    position: absolute;
                    bottom: 0rpx;
                    left: 0rpx;
                    padding: 0 8rpx;
                    height: 40rpx;
                    line-height: 40rpx;
                    text-align: center;
                    border-radius: 0 24rpx 0 14rpx;
                    background: rgba(0, 0, 0, 0.5);
                    font-weight: bold;
                    font-size: 24rpx;
                    color: #ffffff;
                }
            }
        }
    }
}

.button {
    width: 364rpx;
    height: 100rpx;
    margin: 0 auto;
    margin-top: 48rpx;
    background-image: url("https://img.chaoshewang.com/static/img/luck/jcbtn.png");
    background-size: 100% auto;
}

.overlay-title {
    width: 266rpx;
    height: 94rpx;
    margin: 0 auto;
    margin-top: 300rpx;
    background-image: url("https://img.chaoshewang.com/static/img/luck/cgan.png");
    background-size: 100% auto;
}

.overlay-kp {
    width: 522rpx;
    height: 632rpx;
    margin: 0 auto;
    background-image: url("https://img.chaoshewang.com/static/img/luck/kpbj.png");
    background-size: 100% auto;

    .wp {
        width: 300rpx;
        height: 300rpx;
        max-width: 300rpx;
        max-height: 300rpx;
        margin: 0 auto;
        display: block;
        margin-top: 112rpx;
    }

    .kp-name {
        width: 370rpx;
        height: 80rpx;
        margin: 0 auto;
        background: linear-gradient(90deg,
                rgba(78, 21, 79, 0) 0%,
                rgba(78, 21, 79, 0.5) 20%,
                rgba(78, 21, 79, 0.5) 80%,
                rgba(78, 21, 79, 0) 100%);
        font-weight: 500;
        font-size: 24rpx;
        color: #ffffff;
        text-align: center;
        display: -webkit-box;
        overflow: hidden;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        padding: 14rpx;
        margin-top: 32rpx;
    }

    .kp-btn {
        width: 258rpx;
        height: 92rpx;
        margin: 0 auto;
        background-image: url("https://img.chaoshewang.com/static/img/luck/querenanniu.png");
        background-size: 100% auto;
    }
}

.go {
    width: 370rpx;
    height: 48rpx;
    margin: 0 auto;
    line-height: 48rpx;
    background: linear-gradient(90deg,
            rgba(78, 21, 79, 0) 0%,
            rgba(78, 21, 79, 0.5) 20%,
            rgba(78, 21, 79, 0.5) 80%,
            rgba(78, 21, 79, 0) 100%);
    font-weight: 500;
    font-size: 24rpx;
    color: #ffffff;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;

    .go-chaoGui {
        width: 32rpx;
        height: 32rpx;
        background-image: url("https://img.chaoshewang.com/static/img/luck/baisejiantou.png");
        background-size: 100% auto;
    }
}
</style>