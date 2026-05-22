<template>
    <u-overlay :show="show">
        <view class="warp">
            <img src="https://img.shinemang.com/gachaStatic/static/img/product/log_topbg.png" class="log_topbg">
            <img src="https://img.shinemang.com/gachaStatic/static/img/product/log_ico1.png" class="close" @click="onclose">
            <img src="https://img.shinemang.com/gachaStatic/static/img/product/log_ico2.png" class="log_ico2">
            <div class="drawLog">
                <scroll-view v-if="gachaRecords.length" class="product-scroll" @scrolltolower="onReachScollBottom"
                    :lower-threshold="400" :scroll-y="true">
                    <div class="list">
                        <div class="log_item" v-for="(i, s) in gachaRecords" :key="s">
                            <div class="row flex_r flex_ac flex_jb">
                                <div class="user flex_r flex_ac">
                                    <img :src="i.avatar | active" class="avatar">
                                    <span class="name">{{ i.name }}</span>
                                </div>
                                <div class="flex_r flex_ac"><span class="txt">抽赏时间</span><span
                                        class="txt">{{ i.createTime }}</span></div>
                            </div>
                            <div class="goods" :class="{ yifansh: drawType == 1 && i.awardItems.length > 1 }">
                                <template v-for="(a, b) in i.awardItems">
                                    <div class="goods_item flex_r flex_ac" :key="b">
                                        <div class="name ellipsis" v-if="drawType == 1">{{ a.levelIndex | levelNum }}赏
                                            {{ (a.count > 1 ? ('X' + a.count) : '') }}</div>
                                        <div class="name ellipsis" v-else>{{ a.itemName + ' ' +
                                            (a.count>1?('X'+a.count):'')}}</div>
                                        <img :src="a.itemCover" class="img" />
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
import { post } from "@/utils/api.js"
export default {
    props: {
        drawType: {
            type: String,
            default: "1"
        }
    },
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
            gachaRecords: []
        };
    },
    methods: {
        onclose() {
            this.show = false
        },
        open(id, inx) {
            this.gachaId = id;
            this.boxInx = inx;
            this.getRewards();
            this.show = true;
        },
        getRewards() {
            post("v1/gacha/record", {
                ...this.pageda,
                gacha_id: this.gachaId,
                box_index: this.boxInx,
            }).then(res => {
                if (this.pageda.page == 1) this.gachaRecords = [];
                this.gachaRecords = this.gachaRecords.concat(res.gachaRecords);
                this.pageda.total = res.total;
            })
        },
        onReachScollBottom() {
            if (this.pageda.total > this.pageda.page * this.pageda.page_size) {
                this.pageda.page++;
                this.getRewards()
            }
        },
    },
};
</script>
<style lang='scss' scoped>
.warp {
    height: 75vh;
    width: 694rpx;
    position: absolute;
    bottom: 0;
    left: calc((100% - 694rpx) / 2);

    .log_topbg {
        width: 694rpx;
        height: 184rpx;
        position: absolute;
        top: -28rpx;
        left: 0;
        z-index: 1;
    }

    .log_ico2 {
        width: 282rpx;
        height: 98rpx;
        position: absolute;
        top: -78rpx;
        left: -20px;
        z-index: 3;
    }

    .close {
        width: 79rpx;
        height: 59rpx;
        position: absolute;
        top: -50rpx;
        right: -6px;
        z-index: 3;
    }

    .drawLog {
        width: 100%;
        height: 100%;
        background: #FEFBEC;
        position: relative;
        z-index: 2;
        padding: 28rpx 0;
        overflow-y: auto;

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
            border: 2rpx solid #E2E1E3;
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
                border-top: 2rpx solid #E2E1E3;
            }

            .goods_item {
                background: #F9F9F9;
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
                    box-shadow: 0 0 2rpx 2rpx #CACACA;
                    margin: 2rpx;
                }
            }

            .yifansh {
                @include grid(280rpx);

                .goods_item {
                    width: 280rpx;
                }
            }
        }
    }
}
</style>