<template>
    <view class="eggBox">
        <view class="topBack">
            <img
                src="https://img.shinemang.com/gachaStatic/static/img/activity/white.png"
                @click.stop="gateBack"
                class="Back_ico"
            />
        </view>
        <scroll-view
            class="box"
            :scroll-y="true"
            @scrolltolower="onReachScollBottom"
            :lower-threshold="400"
        >
            <view class="title"></view>
            <view class="titleText ellipsis">{{ swiperName }}</view>
            <view class="content">
                <SYStackedCarouselVue
                    height="360rpx"
                    :images="swiperList"
                    :current="current"
                    :autoplay="true"
                    @change="selection"
                    @click="clickHandler"
                >
                </SYStackedCarouselVue>
                <view class="text">距离开奖</view>
                <view class="tiem flex_r flex_ac"
                    >还剩
                    <u-count-down
                        :time="residuetime"
                        :show-days="false"
                    ></u-count-down
                ></view>
            </view>
            <view class="qualification">{{
                dataList.count > 0
                    ? "您已参与，等待开奖~"
                    : "您还未获得抽取资格"
            }}</view>
            <view
                class="eggBtn"
                @click="goto('/pages/chaowan/gachasList',{type:2})"
            ></view>
            <view class="tip"
                ><u-parse
                    :content="(cont && cont.text) || ''"
                    :selectable="true"
                ></u-parse
            ></view>
            <view class="recordBox">
                <view class="recordTitle"></view>
                <view class="record">
                    <view
                        class="recordItem"
                        v-for="(item, index) in recordList"
                        :key="index"
                    >
                        <view class="message flex_r flex_ac">
                            <image
                                class="head"
                                :src="item.userAvatar | active"
                                mode="aspectFill"
                            />{{ item.userName }}
                            <view class="time">{{ item.period }}</view>
                        </view>
                        <view
                            class="prize flex_r flex_ac"
                            v-for="(i, j) in item.award"
                            :key="j"
                        >
                            <img class="prizeImg" :src="i.thumb" />
                            <view class="prizeName ellipsis">{{ i.name }}</view>
                            <view class="prizeNum" v-if="i.num > 1"
                                >X{{ i.num }}</view
                            >
                        </view>
                    </view>
                </view>
            </view>
        </scroll-view>
        <!-- 赏品详情 -->
         <gachaDetails ref="gachaDetails" />
    </view>
</template>
<script>
import { post } from "@/utils/api.js";
import { mapState } from "vuex";
import SYStackedCarouselVue from "../../uni_modules/SY-StackedCarousel/components/SY-StackedCarousel/SY-StackedCarousel.vue";
export default {
    data() {
        return {
            swiperList: [],
            recordList: [],
            swiperName: "",
            current: 0,
            cont: "",
            residuetime: 0,
            dataList: {},
            pageda: {
                page: 1,
                page_size: 10,
                total: 10,
            },
        };
    },
    components: {
        SYStackedCarouselVue,
    },
    watch: {},
    computed: {
        ...mapState(["userInfo"]),
    },
    created() {},
    onShow() {
       this.getActivity();
        this.getList();
        this.getHistory();
    },
    onLoad(da){},
    
    mounted() {
        // this.getActivity();
        // this.getList();
        // this.getHistory();
    },
    methods: {
        getList() {
            post("v1/activity/lottery").then((res) => {
                const { data } = res;
                this.dataList = res;
                this.swiperList = data.award;
                this.residuetime = this.remainingTime(res.nextDrawTime);
                this.current = this.getMiddleIndex(data.award);
            });
        },
        getHistory() {
            post("v1/activity/lottery/history", this.pageda).then((res) => {
                if (this.pageda.page == 1) this.recordList = [];
                this.recordList = this.recordList.concat(res.data);
                this.pageda.total = res.total;
            });
        },
        selection(e) {
            this.swiperName = this.swiperList[e].name;
        },
        clickHandler(item, index) {
            this.gachaDetailsMethod(this,item.value)
        },
        getMiddleIndex(arr) {
            if (!arr || arr.length === 0) return -1;
            return Math.floor((arr.length - 1) / 2);
        },

        getActivity() {
            post("v1/system/protocol/get", { key: "ActivityLottery" }).then(
                (res) => {
                    this.cont = res;
                }
            );
        },
        goCacha() {
            // /pages/chaowan/gachasList
            //   getApp().globalData.LotteryTargetType[this.dataList.data.targetType]
        },
        onReachScollBottom() {
            if (this.pageda.total > this.pageda.page * this.pageda.page_size) {
                this.pageda.page++;
                this.getHistory();
            }
        },
    },
};
</script>
<style lang='scss' scoped>
::v-deep .u-count-down__text {
    font-size: 32rpx;
    color: #ff6900;
    margin-left: 10rpx;
}
.eggBox {
    width: 100vw;
    height: 100vh;
    position: relative;
    background: #fff9d5;
    overflow-y: auto;

    &::before {
        content: "";
        width: 100vw;
        height: 1040rpx;
        left: 0;
        top: 0;
        position: absolute;
        background-image: url("https://img.shinemang.com/gachaStatic/static/img/activity/eggBg.png");
        background-size: 100% 100%;
    }
}
.Back_ico {
    width: 48rpx;
    height: 48rpx;
}
.box {
    width: 100%;
    height: calc(100vh - 176rpx);
    position: fixed;
    top: 176rpx;
    color: #682300;
    overflow-y: auto;
    .title {
        width: 100%;
        height: 140rpx;
        background-image: url("https://img.shinemang.com/gachaStatic/static/img/activity/eggTitle.png");
        background-size: 100% 100%;
    }
    .titleText {
        height: 40rpx;
        font-weight: bold;
        font-size: 28rpx;
        text-align: center;
        margin: 32rpx 0 24rpx;
    }
    .content {
        position: relative;
        width: 100%;
        // padding: 0 32rpx;
        // height: 352rpx;
        margin-top: 24rpx;
        font-weight: 800;
        .swiper {
            width: 100%;
            height: 360rpx;
            .swiper-img {
                width: 360rpx;
                height: 360rpx;
                border-radius: 32rpx;
                border: 6rpx solid #ffffff;
                background: #fff;
                box-sizing: content-box;
            }
        }
        .text {
            position: absolute;
            pointer-events: none;
            width: 360rpx;
            color: #ff6900;
            text-align: center;
            left: 50%;
            transform: translateX(-50%);
            z-index: 100;
            font-size: 48rpx;
            bottom: 52rpx;
        }
        .text::after {
            content: "距离开奖";
            width: 100%;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            background-color: #fff;
            -webkit-background-clip: text;

            -webkit-text-stroke: 7px transparent;
        }
        .tiem {
            position: absolute;
            pointer-events: none;
            bottom: 15rpx;
            left: 50%;
            transform: translateX(-50%);
            z-index: 100;
            font-size: 32rpx;
            color: #ff6900;
        }
    }
    .qualification {
        width: 556rpx;
        height: 72rpx;
        margin: 24rpx auto;
        background: linear-gradient(
            90deg,
            rgba(255, 69, 0, 0) 0%,
            rgba(255, 69, 0, 0.5) 50%,
            rgba(255, 69, 0, 0) 100%
        );
        font-weight: 800;
        font-size: 36rpx;
        text-align: center;
        line-height: 72rpx;
    }
    .eggBtn {
        width: 440rpx;
        height: 104rpx;
        margin: 0 auto;
        background-image: url("https://img.shinemang.com/gachaStatic/static/img/activity/eggBtn.png");
        background-size: 100% 100%;
    }
    .tip {
        width: 686rpx;
        height: 304rpx;
        overflow-y: auto;
        padding: 24rpx;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 32rpx;
        border: 4rpx solid #ffffff;
        font-weight: bold;
        font-size: 28rpx;
        color: #381301;
        margin: 24rpx auto 16rpx;
    }
    .recordBox {
        width: 100%;
        padding: 0 32rpx 30rpx;
        .recordTitle {
            width: 686rpx;
            height: 120rpx;
            background-image: url("https://img.shinemang.com/gachaStatic/static/img/activity/eggRecord.png");
            background-size: 100% 100%;
        }
        .record {
            width: 686rpx;
            padding: 24rpx 32rpx;
            background: #fffcfa;
            box-shadow: 0rpx 8rpx 12rpx 0rpx rgba(255, 216, 109, 0.5);
            border-radius: 0 0 32rpx 32rpx;
            .recordItem {
                border-bottom: 1px dashed #9b7764;
                padding-bottom: 10rpx;
                margin-bottom: 16rpx;
                .message {
                    font-weight: bold;
                    font-size: 24rpx;
                    color: #9b7764;
                    margin-bottom: 24rpx;
                    .head {
                        width: 60rpx;
                        height: 60rpx;
                        margin-right: 16rpx;
                        border-radius: 50%;
                    }
                    .time {
                        margin-left: auto;
                    }
                }
                .prize {
                    width: 622rpx;
                    height: 64rpx;
                    background: #fff9d5;
                    border-radius: 16rpx;
                    padding-right: 16rpx;
                    margin-bottom: 24rpx;
                    font-weight: bold;
                    font-size: 28rpx;
                    color: #682300;
                    .prizeImg {
                        width: 64rpx;
                        height: 64rpx;
                        border-radius: 16rpx;
                    }
                    .prizeName {
                        width: 450rpx;
                        margin-left: 16rpx;
                    }
                    .prizeNum {
                        margin-left: auto;
                    }
                }
            }
        }
    }
}
.pc-carousel {
    width: 100%;
    height: 100%;
    min-height: 200px;
    position: relative;
    overflow: hidden;
    .carousel-block {
        position: absolute;
        overflow: hidden;
        border-radius: 10upx;
        overflow: hidden;
        box-shadow: 0 0 5px #0000001a;
        .image-block {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-size: 100% 100%;
            z-index: 5;
        }
        .error-block {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: #f5f7fa;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1;
        }
    }
}
</style>
