<template>
    <view class="shoppingBox">
        <text class="icof Back_ico" @click.stop="gateBack">&#xe72c;</text>
        <image :src="goodsInfo.coverImage" class="img" />
        <view class="price">
            <view class="a" v-if="itemPrice !== '0'">￥</view>
            <view class="number" v-if="itemPrice !== '0'">{{ itemPrice }}</view>
            <view class="integral" v-if="itemValue !== '0'">
                <view class="integralImg">欧气值</view>
                <view class="">{{ itemValue }}</view>
            </view>
        </view>
        <view class="particulars">{{ goodsInfo.name }}</view>
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
                    <div class="arg_va arg_name ellipsis">{{ item.value }}</div>
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

        <view class="foot-btn flex_r flex_ac flex_jse" v-if="isShow">
            <!-- #ifndef MP-WEIXIN -->
            <x-btn
                v-if="itemPrice > 0"
                txt="立即购买"
                cor="2"
                @click="
                    goto('/pages/shopping/purchase', {
                        id: configId,
                        price: itemPrice,
                        stock: stock,
                        itemId: itemId,
                    })
                "
            />
            <!-- #endif -->
            <x-btn
                v-if="itemValue > 0"
                txt="欧气值兑换"
                cor="3"
                @click="
                    goto('/pages/shopping/exchange', {
                        id: configId,
                        itemId: itemId,
                        value: itemValue,
                        stock: stock,
                        onlyShipment:filteredNumbers.onlyShipment
                    })
                "
            />
        </view>
        <view class="foot-btn flex_r flex_ac flex_jse" v-else>
            <x-btn
                v-if="itemPrice > 0"
                txt="立即购买"
                cor="2"
                @click="onTime"
                :style="{ opacity: '0.5' }"
            />
            <x-btn
                v-if="itemValue > 0"
                txt="欧气值兑换"
                cor="3"
                @click="onTime"
                :style="{ opacity: '0.5' }"
            />
        </view>
    </view>
</template>
<script>
import xBtn from "@/components/modules/x-btn";
import { post } from "@/utils/api.js";
import { mapState } from "vuex";
export default {
    data() {
        return {
            itemId: "",
            goodsInfo: {},
            itemValue: 0,
            itemPrice: 0,
            stock: 0,
            configId: "",
            endTime: "",
            startTime: "",
            isShow: false,
            warning: "预售",
            objId: 0,
            filteredNumbers:{}
        };
    },
    components: {
        xBtn,
    },
    computed: {
        ...mapState(["userInfo"]),
    },
    onLoad(da) {
        // let obj = JSON.parse(da.itemJson);
        this.objId = da.id;
        this.onGet();
    },
    methods: {
        async onGet() {
            await post("v1/activity/cost-award/list", {
                user_id: this.userInfo.id,
                type: 2,
            }).then((res) => {
                let filteredNumbers = res.config.filter(
                    (item) => item.configId == this.objId
                );
                this.filteredNumbers = filteredNumbers[0]
                this.itemId = filteredNumbers[0].itemList[0].id;
                this.itemValue = Number(filteredNumbers[0].value);
                this.itemPrice = Number(filteredNumbers[0].price);
                this.stock = filteredNumbers[0].stock || 9999;
                this.configId = filteredNumbers[0].configId;
                if (filteredNumbers[0].startTime !== "") {
                    this.startTime = this.remainingTime(
                        filteredNumbers[0].startTime
                    );
                }
                if (filteredNumbers[0].endTime !== "") {
                    this.endTime = this.remainingTime(
                        filteredNumbers[0].endTime
                    );
                }
                if (this.startTime == "" || this.startTime < 0) {
                    this.warning = "购买时间截止";
                    if (this.endTime == "" || this.endTime > 0) {
                        this.warning = "此商品暂无库存";
                        if (this.stock > 0 || this.stock == "") {
                            this.isShow = true;
                        }
                    }
                }
            });
            await post("v1/goods/item/get", {
                item_id: this.itemId,
            }).then((res) => {
                res.item.itemParams.unshift({
                    key: "赏品状态",
                    value:
                        res.item.saleType == 1
                            ? "现货"
                            : `预售（${res.item.bookingTime}）`,
                });
                this.goodsInfo = res.item;
            });
        },

        onTime() {
            uni.$u.toast(`${this.warning}~`);
            return;
        },
    },
};
</script>
<style lang='scss' scoped>
.shoppingBox {
    width: 100vw;
    height: 100vh;
    background: linear-gradient(104deg, #e1d6f8 0%, #f8e7ed 100%);
    overflow-y: auto;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #f0f0f0 50%);

    .img {
        width: 100%;
        height: 750rpx;
        border-radius: 0rpx 0rpx 0rpx 0rpx;
    }
    .price {
        width: 100%;
        height: 112rpx;
        background: url("https://img.chaoshewang.com/static/img/home/bg_plus.png");
        color: #383228;
        font-weight: 800;
        background-size: 100% 100%;
        display: flex;
        align-items: center;
        .a {
            height: 56rpx;
            font-size: 24rpx;
            margin-right: 4rpx;
            margin-left: 32rpx;
        }
        .number {
            font-family: Binance PLEX, Binance PLEX;
            font-size: 56rpx;
        }

        .integral {
            height: 56rpx;
            background: #ffffff;
            border-radius: 0rpx 8rpx 8rpx 0rpx;
            font-family: Binance PLEX, Binance PLEX;
            font-size: 40rpx;
            color: #9762e9;
            line-height: 56rpx;
            display: flex;
            margin-left: 24rpx;
            padding-right: 12rpx;
            .integralImg {
                width: 104rpx;
                height: 56rpx;
                background: url("https://img.chaoshewang.com/static/img/home/plus.png");
                background-size: 100% 100%;
                font-size: 24rpx;
                color: #ffffff;
                line-height: 56rpx;
                text-align: center;
                margin-right: 8rpx;
            }
        }
    }
    .particulars {
        width: 100%;
        font-weight: 500;
        font-size: 28rpx;
        color: #383228;
        padding: 20rpx 32rpx;
        background: #fff;
        border-radius: 0rpx 0rpx 8rpx 8rpx;
        margin-bottom: 16rpx;
        overflow: hidden;
    }
    .gacha_info {
        padding: 28rpx 36rpx;
        margin-top: 16rpx;
        border-radius: 16rpx;
        background-color: #fff;

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
        .gacha_img_detail {
            width: 100%;
            margin-top: 10rpx;
            font-size: 0;
            image {
                width: 100%;
            }
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
    .foot-btn {
        position: fixed;
        bottom: 0rpx;
        left: 0;
        width: 100%;
        padding: 0 28rpx;
        width: 750rpx;
        height: 152rpx;
        background: #ffffff;
    }
    .Back_ico {
        font-size: 50rpx;
        margin-right: 8rpx;
        position: absolute;
        z-index: 1;
        top: 100rpx;
        left: 32rpx;
    }
}
</style>