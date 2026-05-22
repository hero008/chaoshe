<template>
    <view class="join">
        <view class="top_Back flex_r flex_js flex_ac">
            <img
                src="https://img.shinemang.com/gachaStatic/static/img/chaowanshang/allFh.png"
                @click.stop="gateBack"
                class="Back_ico"
            />参团记录
        </view>
        <view class="title ellipsis">{{ title }}</view>
        <!-- 开奖记录 -->
        <view class="list">
            <scroll-view
                v-if="list.length"
                class="scroll_list"
                scroll-y="true"
                @scrolltolower="onReachScollBottom"
                :lower-threshold="400"
            >
                <view
                    class="item"
                    v-for="(item, index) in list"
                    :key="index"
                    @click="onShowItem(index, item)"
                >
                    <view class="item_box flex_r flex_ac">
                        <image
                            :src="item.avatar | active"
                            class="head"
                            mode="aspectFill"
                        />
                        <view class="head_ico" v-if="item.levelIocn"></view>
                        <view
                            class="name"
                            :class="{ active: item.levelIocn }"
                            >{{ item.name }}</view
                        >
                        <view class="time">{{ item.createTime }}</view>
                        <view class="num ellipsis" v-if="item.awardItems.length"
                            >x{{ item.awardItems.length }}</view
                        >
                        <view
                            class="xl"
                            v-if="item.awardItems.length"
                            :class="{ active: onIndex == index }"
                        ></view>
                    </view>
                    <view
                        class="item_xl"
                        :class="[onIndex == index ? 'anim' : '']"
                        v-if="onIndex == index"
                    >
                        <view
                            class="time_xl flex_r flex_ac"
                            v-for="i in item.awardItems"
                            :key="i.userId"
                        >
                            <img class="heade_xl" :src="i.itemCover" />
                            <view class="name_xl ellipsis">{{
                                i.itemName
                            }}</view>
                            <view class="num_xl ellipsis">x{{ i.nums }}</view>
                        </view>
                    </view>
                </view>
            </scroll-view>
            <!-- 空白页 -->
            <u-empty
                v-else
                text="暂无参团记录~"
                icon="https://img.shinemang.com/gachaStatic/static/img/home/empty.png"
                :marginTop="50"
            />
        </view>
    </view>
</template>

<script>
import { post } from "@/utils/api.js";
export default {
    data() {
        return {
            onIndex: null,
            pageda: {
                page: 1,
                page_size: 20,
                total: 20,
            },
            gachaId: 0,
            boxId: 0,
            list: [],
            title: "",
        };
    },
    onLoad(da) {
        this.gachaId = da.id;
        this.boxId = da.index;
        this.title = decodeURIComponent(da.name);
        this.onClickPrize();
    },
    methods: {
        onShowItem(index, item) {
            if (item.awardItems.length) {
                this.onIndex = this.onIndex == index ? null : index;
            }
        },
        //开奖记录
        onClickPrize() {
            post("v1/gacha/record", {
                ...this.pageda,
                gacha_id: this.gachaId,
                box_index: this.boxId,
            }).then((res) => {
                if (!res.code) {
                    if (this.pageda.page == 1) this.list = [];
                    res.gachaRecords.map((item) => {
                        item.levelIocn = false;
                        item.awardItems.map((i) => {
                            if (["SSR", "SP"].includes(i.levelName))
                                item.levelIocn = true;
                        });
                    });
                    this.list = this.list.concat(res.gachaRecords);
                    this.pageda.total = res.total;
                } else uni.$u.toast(res.message);
            });
        },

        onReachScollBottom() {
            if (this.pageda.total > this.pageda.page * this.pageda.page_size) {
                this.pageda.page++;
                this.onClickPrize();
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.join {
    width: 100%;
    height: 100vh;
    overflow-y: auto;
    background-image: url("https://img.shinemang.com/gachaStatic/static/img/chaowanshang/allBg.png");
    background-size: 100% 100%;
    overflow: hidden;
    color: #ffffff;

    .top_Back {
        position: relative;
        width: 100%;
        padding: 90rpx 32rpx 0;
        font-weight: 800;
        font-size: 36rpx;
        .Back_ico {
            width: 56rpx;
            height: 56rpx;
            margin-right: 32rpx;
        }
    }
    .title {
        padding: 20rpx 32rpx;

        text-align: center;
        font-weight: 800;
        font-size: 32rpx;
    }

    .list {
        width: 100%;
        height: calc(100% - 200rpx);
        margin-top: 16rpx;
        padding-bottom: 50rpx;
        .scroll_list {
            height: 100%;
            .item {
                width: 686rpx;
                margin: 0 auto 16rpx;
                position: relative;
                overflow: hidden;
                border-radius: 16rpx;
                .item_box {
                    width: 100%;
                    height: 96rpx;
                    background: #2e0074;
                    border-radius: 16rpx;
                    padding: 0 24rpx;
                    position: relative;
                    z-index: 1;
                    .head {
                        width: 64rpx;
                        height: 64rpx;
                        border-radius: 50%;
                        border: 2rpx solid #ffffff;
                    }
                    .head_ico {
                        position: absolute;
                        width: 32rpx;
                        height: 32rpx;
                        left: 62rpx;
                        top: 4rpx;
                        z-index: 2;
                        background-image: url("https://img.shinemang.com/gachaStatic/static/img/chaowanshang/crown.png");
                        background-size: 100% 100%;
                    }
                    .name {
                        font-weight: bold;
                        font-size: 28rpx;
                        margin: 0 32rpx 0 16rpx;

                        &.active {
                            color: #ffc119;
                        }
                    }
                    .time {
                        font-weight: 400;
                        font-size: 24rpx;
                    }
                    .num {
                        margin-left: auto;
                        font-weight: 800;
                        font-size: 40rpx;
                    }
                    .xl {
                        width: 32rpx;
                        height: 32rpx;
                        background-image: url("https://img.shinemang.com/gachaStatic/static/img/chaowanshang/allSj.png");
                        background-size: 100% 100%;
                        margin-left: auto;
                        &.active {
                            background-image: url("https://img.shinemang.com/gachaStatic/static/img/chaowanshang/allxl.png");
                            background-size: 100% 100%;
                        }
                    }
                }
                .item_xl {
                    position: relative;
                    left: 50%;
                    transform: translate(-50%);
                    width: 100%;
                    background: #25005c;
                    border-radius: 0 0 16rpx 16rpx;
                    padding: 24rpx 32rpx;
                    top: -24rpx;
                    .time_xl {
                        width: 100%;
                        height: 48rpx;
                        margin-top: 24rpx;
                        .name_xl {
                            width: 420rpx;
                            font-weight: 500;
                            font-size: 24rpx;
                        }
                        .heade_xl {
                            width: 48rpx;
                            height: 48rpx;
                            margin-right: 24rpx;
                            border-radius: 8rpx;
                            border: 2rpx solid #ffffff;
                        }
                        .num_xl {
                            font-weight: bold;
                            font-size: 28rpx;
                            margin-left: auto;
                        }
                    }
                }
                .anim {
                    animation: tobottom 0.5s ease-in;
                    animation-fill-mode: forwards;
                }

                @keyframes tobottom {
                    from {
                        top: -80px;
                    }

                    to {
                        top: -24rpx;
                    }
                }
            }
        }
    }
}
</style>