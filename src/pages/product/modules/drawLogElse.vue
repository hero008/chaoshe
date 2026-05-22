<template>
    <u-overlay :show="show">
        <view class="warp">
            <img src="https://img.shinemang.com/gachaStatic/static/img/niudan/title.png" class="log_ico2" />
            <img src="https://img.shinemang.com/gachaStatic/static/img/niudan/close2.png" class="close" @click="onclose" />
            <div class="drawLog">
                <scroll-view v-if="gachaRecords.length" class="product-scroll" @scrolltolower="onReachScollBottom"
                    :lower-threshold="400" :scroll-y="true">
                    <div class="list">
                        <div class="log_item" v-for="(i, s) in gachaRecords" :key="s">
                            <div class="row flex_r flex_ac flex_jb">
                                <div class="user flex_r flex_ac">
                                    <img class="avatar" :src="(Object.keys(i).includes('avatar')
                                        ? i.avatar
                                        : i.userAvatar) | active
                                        " />
                                    <span class="name">{{
                                        i.name || i.userName
                                    }}</span>
                                </div>
                                <!-- <div class="flex_r flex_ac">
                                    <span class="txt">抽赏时间</span
                                    ><span class="txt">{{
                                        i.createTime || i.gainTime
                                    }}</span>
                                </div> -->
                            </div>
                            <div class="goods">
                                <template v-for="(a, b) in i.awardItems || i.award">
                                    <div class="goods_item flex_r flex_ac"
                                        :class="{ sp: a.levelIndex == 28, a: a.levelIndex == 1, dt: drawType == 3 }"
                                        :key="b">
                                        <div class="name ellipsis">{{ a.itemName || a.name }}</div>
                                        <img :src="a.itemCover || a.thumb" class="img" />
                                        <view class="Lucky flex_r  flex_js "
                                            v-if="a.levelName == 'Lucky' && a.luckyNo">
                                            <view class="type">{{ a.levelName }}</view>
                                            <view class="sort">{{a.luckyNo}}</view>
                                        </view>
                                        <img class="Lucky1" v-else-if="a.levelName == 'Lucky'"
                                            :src="`https://img.shinemang.com/gachaStatic/static/img/reward/ico_Lucky.png`" />
                                    </div>
                                </template>

                            </div>
                        </div>
                    </div>
                </scroll-view>
                <u-empty v-else text="暂无中赏记录~" icon="https://img.shinemang.com/gachaStatic/static/img/home/empty.png"
                    :marginTop="50" />
            </div>
        </view>
    </u-overlay>
</template>
<script>
import { post } from "@/utils/api.js";
export default {
    data() {
        return {
            gachaId: "",
            boxInx: "",
            pageda: {
                page: 1,
                page_size: 20,
                total: 20,
            },
            show: false,
            gachaRecords: [],
            activity: 0, //第几个转盘
            type: false
        };
    },
    props: {
        drawType: {
            type: Number,
            default: 2,
        },
    },
    methods: {
        onclose() {
            this.$emit("onRefresh");
            this.show = false;
        },
        open(id, inx = 0, activity = -1, type = false) {
            this.activity = activity;
            this.gachaId = id;
            this.boxInx = inx;
            this.type = type
            this.getRewards();
            this.show = true;
        },
        getRewards() {
            let url = "v1/gacha/record";
            let data = { gacha_id: this.gachaId, box_index: this.boxInx };
            if (this.activity > -1) {
                url = "v1/activity/prize-wheel/history/list";
                data = { index: this.activity };
            }
            if (this.type) {
                data.level_type = 3;
            }
            post(url, {
                ...this.pageda,
                ...data,
            }).then((res) => {
                if (!res.code) {
                    if (this.pageda.page == 1) this.gachaRecords = [];
                    this.gachaRecords = this.gachaRecords.concat(
                        this.activity > -1 ? res.history : res.gachaRecords
                    );
                    this.pageda.total = res.total;
                }
            });
        },
        onReachScollBottom() {
            if (this.pageda.total > this.pageda.page * this.pageda.page_size) {
                this.pageda.page++;
                this.getRewards();
            }
        },
    },
};
</script>
<style lang='scss' scoped>
.warp {
    height: 75vh;
    width: 686rpx;
    position: absolute;
    bottom: 0;
    left: calc((100% - 686rpx) / 2);
    background-image: url("https://img.shinemang.com/gachaStatic/static/img/niudan/draw_log_bg.png");
    background-size: 100% 100%;
    padding: 18rpx 16rpx 0;

    .log_ico2 {
        width: 250rpx;
        height: 82rpx;
        position: absolute;
        left: calc((100% - 250rpx) / 2);
        top: -26rpx;
        z-index: 3;
    }

    .close {
        width: 60rpx;
        height: 60rpx;
        position: absolute;
        top: -12rpx;
        right: 0;
        z-index: 3;
    }

    .drawLog {
        width: 100%;
        height: 100%;
        background: #fff;
        position: relative;
        z-index: 2;
        padding: 40rpx 0 28rpx;
        /* overflow-y: auto; */
        border-radius: 20rpx 20rpx 0 0;

        .product-scroll {
            height: 100%;

            .list {
                padding: 28rpx;
            }
        }

        .log_item {
            padding: 16rpx 24rpx;
            border-radius: 16rpx;
            background-color: #fff;
            border: 2rpx solid #e2e1e3;
            margin-bottom: 20rpx;

            .row {
                font-size: 24rpx;
                color: #818181;
                font-weight: 500;
                padding-bottom: 12rpx;

                .avatar {
                    width: 64rpx;
                    height: 64rpx;
                    border-radius: 50%;
                }

                .name {
                    color: #333;
                    margin-left: 16rpx;
                }

                .txt {
                    margin-left: 18rpx;
                }
            }

            .goods {
                padding-top: 12rpx;
                border-top: 2rpx solid #e2e1e3;
            }

            .goods_item {
                position: relative;
                background: #f9f9f9;
                border-radius: 16rpx;
                font-size: 28rpx;
                padding: 8rpx 20rpx;
                margin-bottom: 15rpx;

                &:last-child {
                    margin-bottom: 0;
                }

                .name {
                    width: calc(100% - 80rpx);
                }

                .img {
                    width: 60rpx;
                    height: 60rpx;
                    border-radius: 8rpx;
                    background-color: rgba($color: $motif-color, $alpha: 0.5);
                    border: 2rpx solid #fff;
                    box-shadow: 0 0 2rpx 2rpx #cacaca;
                    margin: 2rpx;
                }

                .Lucky1 {
                    position: absolute;
                    top: -14rpx;
                    left: -22rpx;
                    width: 77rpx;
                    height: 35rpx;
                }

                .Lucky {
                    position: absolute;
                    top: -14rpx;
                    left: -22rpx;
                    width: 99.38rpx;
                    height: 32.81rpx;
                    background-image: url("https://img.shinemang.com/gachaStatic/static/img/niudan/LuckyBg.png");
                    background-size: 100% 100%;
                    font-weight: 800;
                    color: transparent;
                    transform: skew(-15deg);

                    .type {
                        height: 32.81rpx;
                        line-height: 28rpx;
                        font-size: 17rpx;
                        background: linear-gradient(90deg, #FFF661, #FF1D1D);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        margin-left: 8.44rpx;
                    }

                    .sort {
                        height: 32.81rpx;
                        line-height: 28rpx;
                        font-size: 19rpx;
                        background: linear-gradient(360deg, #FFF661, #FF1D1D);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        margin-left: 2rpx;
                    }
                }
            }

            .dt {
                &.sp {
                    color: #f00;
                }

                &.a {
                    color: rgb(255, 166, 0);
                }
            }
        }
    }
}
</style>