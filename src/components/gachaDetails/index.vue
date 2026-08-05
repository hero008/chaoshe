<template>
    <u-popup :show="show" @close="close" round="20" bgColor="#F4F4F4">
        <div class="gachaDetails_con">
            <div class="s_c">
                <div class="gacha_img flex_r flex_jc">
                    <image mode="widthFix" :src="goodsInfo.coverImage"></image>
                </div>
                <div class="gacha_info">
                    <div class="row flex_r flex_ac flex_jb">
                        <div class="row_l flex_r flex_as">
                            <div class="tag">{{goodsInfo.referenceXPoint ? '星币' : '￥'}}</div>
                            <div class="price">{{goodsInfo.referenceXPoint?goodsInfo.referenceXPoint: goodsInfo.showPrice }}</div>
                            <div class="tag2">
                                <img
                                    src="https://img.shinemang.com/gachaStatic/static/img/product/Star.png"
                                    class="Star"
                                />
                                <div class="txt">参考价</div>
                            </div>
                        </div>
                        <div
                            class="row_r"
                            v-if="!contentTxt"
                            v-show="probability > 0"
                        >
                            {{ rewardTxt }}：{{ probability }}%
                        </div>
                        <div class="row_r txt_left" v-else>
                            {{ rewardTxt }}：{{ contentTxt }}
                        </div>
                    </div>
                    <div class="gacha_name">{{ goodsInfo.name }}</div>
                </div>
                <div
                    class="gacha_info"
                    v-if="goodsInfo.itemParams && goodsInfo.itemParams.length"
                >
                    <div class="tit">商品参数</div>
                    <div class="arguments">
                        <div
                            class="arg_item flex_r flex_ac flex_jb"
                            v-for="(item, i) in goodsInfo.itemParams"
                            :key="i"
                        >
                            <div class="arg_name ellipsis">{{ item.key }}</div>
                            <div class="arg_va arg_name ellipsis">
                                {{ item.value }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="gacha_info">
                    <div class="tit">商品详情</div>
                    <div>{{ goodsInfo.detailContent }}</div>
                    <div class="gacha_img_detail">
                        <image
                            mode="widthFix"
                            v-for="(item, index) in goodsInfo.detailUrls"
                            :src="item"
                            :key="index"
                        ></image>
                    </div>
                </div>
            </div>
            <!-- <view  class="icon"></view> -->
            <!-- <img src="https://img.shinemang.com/gachaStatic/static/img/home/ico_ico.png"/> -->
            <img
                src="https://img.shinemang.com/gachaStatic/static/img/product/close.png"
                @click="close"
                class="close"
            />
        </div>
    </u-popup>
</template>
<script>
export default {
    data() {
        return {
            show: false,
            goodsInfo: {},
            probability: 0,
            rewardTxt: "",
            contentTxt: "",
        };
    },
    created() {},
    mounted() {},
    methods: {
        open(data, probability, rewardTxt, contentTxt) {
            this.show = true;
            this.goodsInfo = data.item;
            if (this.goodsInfo) {
                this.goodsInfo.itemParams.unshift({
                    key: "赏品状态",
                    value:
                        this.goodsInfo.saleType == 1
                            ? "现货"
                            : `预售（${this.goodsInfo.bookingTime}）`,
                });
            }
            this.probability = probability;
            this.rewardTxt = rewardTxt;
            this.contentTxt = contentTxt;
        },
        close() {
            this.show = false;
        },
    },
};
</script>
<style lang='scss' scoped>
.gachaDetails_con {
    height: 75vh;
    position: relative;

    .close {
        width: 56rpx;
        height: 56rpx;
        position: absolute;
        top: 20rpx;
        right: 30rpx;
    }

    .icon {
        width: 86rpx;
        height: 58.36rpx;
        position: absolute;
         background: url("@/static/homePage/ico.png");
        background-size: 100% 100%;
        top: 24rpx;
        left: 30rpx;
    }

    .gacha_img {
        width: 100%;
        background-color: #fff;
        border-radius: 0 0 16rpx 16rpx;

        image {
            width: 100%;
            border-radius: 16rpx;
        }
    }

    .gacha_info {
        padding: 28rpx 36rpx;
        margin-top: 16rpx;
        border-radius: 16rpx;
        background-color: #fff;
        color: #000;
        .row_l {
            font-size: 20rpx;
            font-weight: 500;

            .tag {
                font-weight: 800;
                font-size: 24rpx;
            }

            .price {
                font-size: 47rpx;
                font-weight: 700;
                height: 56rpx;
                line-height: 56rpx;
                margin: 0 10rpx 0 4rpx;
            }

            .tag2 {
                .Star {
                    width: 14rpx;
                    height: 14rpx;
                }
            }
        }

        .row_r {
            font-size: 24rpx;
            font-weight: 500;
            color: #7f7a88;

            &.txt_left {
                width: 350rpx;
            }
        }

        .tit {
            font-weight: 500;
            font-size: 28rpx;
            color: #7f7a88;
            margin-bottom: 28rpx;
        }

        .gacha_name {
            font-weight: 500;
            font-size: 28rpx;
            margin-top: 20rpx;
        }

        .arg_item {
            margin-bottom: 8rpx;

            &:last-child {
                margin-bottom: 0;
            }

            .arg_name {
                height: 50rpx;
                line-height: 50rpx;
                width: 150rpx;
                padding: 0 12rpx;
                background: #f9f9f9;
                font-weight: 500;
                font-size: 24rpx;
                color: #383228;
                border-radius: 4rpx;
            }

            .arg_va {
                width: calc(100% - 162rpx);
            }
        }
    }

    .g_title {
        border-radius: 20px 20px 0 0;
        background-color: #fff;
        height: 80rpx;
    }

    .s_c {
        border-radius: 20px 20px 0 0;
        height: 100%;
        overflow-y: auto;
    }

    .gacha_img_detail {
        width: 100%;
        margin-top: 10rpx;
        font-size: 0;
        image {
            width: 100%;
        }
    }
}
</style>