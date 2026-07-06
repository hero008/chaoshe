<!-- 潮玩赏首页点击进来的列表 -->
<template>
    <view class="gachasList" :class="{ 'gachasList_dy': game_type == 3 }" :style="{ paddingTop: MBInfo().top + 'px' }">
        <div class="navbar_x flex_r flex_jb flex_ac" :style="{ height: MBInfo().height + 'px' }">
            <view class="top_Back" :class="{ 'top_Back_dy': game_type == 3 }" @click.stop="gateBack">
                <text class="icof Back_ico">&#xe72c;</text>
                <text class="txt">返回</text>
            </view>
        </div>
        <div class="shanggui_con" :style="{ height: conHeight }">
            <!-- 2个tab -->
            <view class="tabs_two flex_r flex_jb" v-if="game_type == 1">
                <view class="tab_item" :class="{ active: i == active }" @click="ontab(i, s)" v-for="(i, s) in navbar"
                    :key="s">
                    {{ i }}
                </view>
            </view>
            <view class="noYFS tabs_two flex_r flex_jb" :class="{ 'tabs_two_dy': game_type == 3 }" v-else>
                <view class="tab_item" :class="{ active: i == active2 }" @click="ontab2(i, s)" v-for="(i, s) in navbar2"
                    :key="s">{{ i }}</view>
            </view>
            <view class="p_lists" :class="{ 'p_lists_dy': game_type == 3 }">
                <scroll-view v-if="productList.length" @scrolltolower="onReachScollBottom" class="product-scroll"
                    :lower-threshold="400" :scroll-y="true">
                    <view class="hot-product flex_r flex_jb flex_wrap">
                        <view class="p-item" :class="{ 'p-item_dy': game_type == 3 }"
                            v-for="(item, index) in productList" :key="index" @click="tn(item)">
                            <image :src="item.coverThumb" class="p-img" />
                            <view class="product-info">
                                <view class="oneLine flex_r ">
                                    <view class="p-name ellipsis2"
                                        :style="[game_type == 3 ? { minHeight: 0, color: '#fff' } : '',]">{{
                                            item.themeName }}</view>
                                    <view class="multiple1 flex_r" v-if="item.costAwardMultiple > 1">
                                        <view class="number" :class="{ 'multiple2': game_type == 3 }">
                                            {{ item.costAwardMultiple }}</view>
                                        <view class="times" :class="{ 'multiple2': game_type == 3 }">倍</view>
                                    </view>
                                </view>
                                <!-- <view class="p-name ellipsis2"
                                    :style="[game_type == 3 ? { minHeight: 0, color: '#fff' } : '',]">{{
                                        item.themeName }}</view> -->
                                <img src="https://img.shinemang.com/gachaStatic/static/img/cw-new/ico_wxsDy.png"
                                    v-if="game_type == 3" class="wuxiansang" />
                                <view></view>
                                <view class="p-info flex_r flex_jb">
                                    <view v-if="item.isWelfare == true" class="WelfareBox">福利箱</view>
                                    <view class="priceBox" v-else>
                                        <view class="price" :class="{ 'price_dy': game_type == 3 }">
                                            ￥{{ item.discountPrice || item.price || "0.00" }}</view>
                                    </view>
                                    <view class="num" :class="{ 'num_dy': game_type == 3 }">{{
                                        item.leftBox + "/" + item.totalBox
                                    }}套</view>
                                </view>
                            </view>
                            <view class="label" v-show="item.discount > 0">
                                <view class="discount">
                                    {{
                                        item.discountPrice ||
                                        item.price ||
                                        "0.00"
                                    }}
                                </view>
                                <view class="original">￥{{ item.price }}</view>
                            </view>
                            <div class="ltop flex_r">
                                <view class="tag2" v-show="item.isNew">新箱</view>
                                <!-- <view class="tag2 corg"v-show="item.discount > 0">折扣</view> -->
                                <view class="tag2 welfare" v-show="item.isWelfare">福利</view>
                            </div>
                            <div class="sellOut flex_r flex_ac flex_jc" v-show="item.leftBox == 0 ||
                                item.state == 1 ||
                                item.state == 3
                                ">
                                <div class="tag3" v-if="item.state == 1">
                                    <div class="txt2">
                                        {{ toTime(item.startTime).substring(0, 5) }}
                                    </div>
                                    <div class="txt2">
                                        {{ toTime(item.startTime).substring(5, toTime(item.startTime).length + 1) }}
                                    </div>
                                    <div class="txt3">整点开售</div>
                                    <div class="txt1">{{ setIsSub(item) }}</div>
                                </div>
                                <div class="tag2 corr" v-else>售罄</div>
                            </div>
                        </view>
                    </view>
                </scroll-view>
                <u-empty v-else text="暂无箱子~" icon="https://img.shinemang.com/gachaStatic/static/img/home/empty.png"
                    :marginTop="50" />
            </view>
        </div>
    </view>
</template>
<script>
import { post } from "@/utils/api.js";
// import { order } from '@/utils/fun.js';
export default {
    data() {
        return {
            navbar: ["全部", "现货", "预售"],
            active: "全部",
            firstCondition: 0,
            navbar2: ["全部", "折扣"],
            active2: "全部",
            active_m: 0,
            game_type: 1,
            keyword: "",
            pageda: {
                order_by_price: 0,
                order_by_time: 0,
                page: 1,
                page_size: 12,
                total: 12,
            },
            ismp: false,
            productList: [],
        };
    },
    computed: {
        conHeight() {
            let h = this.SystemInfo.screenHeight;
            let va = this.MBInfo();
            let th = va.height + va.top + 10;
            let str = h - th + "px";
            return str;
        },
    },
    created() { },
    mounted() { },
    onLoad(da) {
        this.game_type = da.type;
        if (da.keyword) this.keyword = decodeURIComponent(da.keyword);
        // #ifdef MP-WEIXIN
        this.ismp = true;
        // #endif
        this.getlist();
    },
    methods: {
        ontab(item, index) {
            this.pageda.page = 1;
            this.active = item;
            this.firstCondition = index;
            this.getlist();
        },
        ontab2(item, index) {
            this.pageda.page = 1;
            this.active2 = item;
            this.active_m = index;
            this.getlist();
        },
        getlist() {
            post("v1/gacha/list", {
                is_recommend: 0,
                type: this.game_type,
                is_discount: this.active_m,
                sale_type: this.firstCondition,
                key_word: this.keyword,
                is_mp: this.ismp,
                ...this.pageda,
            }).then((res) => {
                if (this.pageda.page == 1) this.productList = [];
                // this.productList = this.productList.concat(order(res.gachas, -2));
                this.productList = this.productList.concat(res.gachas)
                this.pageda.total = res.total;
            });
        },
        onReachScollBottom() {
            if (this.pageda.total > this.pageda.page * this.pageda.page_size) {
                this.pageda.page++;
                this.getlist();
            }
        },
        tn(da) {
            if (da.state == 1) {
                if (da.isSub) return;
                let self = this;
                // #ifdef MP-WEIXIN
                if (!da.isSub) {
                    wx.requestSubscribeMessage({
                        tmplIds: [getApp().globalData.SubscriptionTemplate],
                        success(res) {
                            if (
                                res[getApp().globalData.SubscriptionTemplate] ==
                                "accept"
                            ) {
                                post("v1/gacha/subscribe", {
                                    gacha_id: da.id,
                                    option: da.isSub ? 2 : 1,
                                }).then((res) => {
                                    if (res.code) {
                                        uni.$u.toast(res.message);
                                    } else {
                                        uni.$u.toast(
                                            da.isSub
                                                ? "预约成功！"
                                                : "已取消预约~"
                                        );
                                        da.isSub = !da.isSub;
                                    }
                                });
                            } else {
                                uni.$u.toast("预约失败！");
                            }
                        },
                        fail(err) {
                            uni.$u.toast("预约失败！");
                        },
                    });
                } else {
                    post("v1/gacha/subscribe", {
                        gacha_id: da.id,
                        option: da.isSub ? 2 : 1,
                    }).then((res) => {
                        if (res.code) {
                            uni.$u.toast(res.message);
                        } else {
                            uni.$u.toast(
                                da.isSub ? "预约成功！" : "已取消预约~"
                            );
                        }
                    });
                    da.isSub = !da.isSub;
                }
                // #endif
                // #ifndef MP-WEIXIN
                post("v1/gacha/subscribe", {
                    gacha_id: da.id,
                    option: da.isSub ? 2 : 1,
                }).then((res) => {
                    uni.$u.toast(da.isSub ? "预约成功！" : "已取消预约~");
                });
                da.isSub = !da.isSub;
                // #endif
            } else {
                if (da.type == 1) this.goto("/pages/product/yifanshang", { id: da.id, });
                else if (da.type == 2) this.goto("/pages/product/niudan", { id: da.id, });
                else if (da.type == 3) this.goto("/pages/product/chaowanshang", { id: da.id });
                else if (da.type == 4) this.goto("/pages/product/dongle", { id: da.id });
                else if (da.type == 5) this.goto("/pages/product/chaosheshang", { id: da.id, });
            }
        },
        setIsSub(da) {
            if (da.isSub) {
                return "已预约";
            } else {
                return "点击预约";
            }
        },
    },
};
</script>
<style lang='scss' scoped>
.gachasList {
    width: 100vw;
    height: 100vh;
    position: relative;
    padding: 100rpx 0 30rpx;
    background: linear-gradient(104deg, #e1d6f8 0%, #f8e7ed 100%);
    overflow-y: auto;

    &::before {
        content: "";
        width: 100vw;
        height: calc(100vh - 212rpx);
        position: absolute;
        top: 212rpx;
        left: 0;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #f0f0f0 50%);
    }
}

.gachasList_dy {
    background: #300F16; //多游
}

.navbar_x {
    padding: 0 32rpx;

    .btn_r {
        width: 162rpx;
        height: 46rpx;
    }

    .top_Back {
        color: #1c1c1c;

        text {
            vertical-align: middle;
        }

        .Back_ico {
            font-size: 50rpx;
            margin-right: 8rpx;
        }

        .txt {
            font-size: 36rpx;
        }
    }

    .top_Back_dy {
        color: #fff; //多游
    }
}

.tabs_two {
    width: 396rpx;
    height: 76rpx;
    background: url("https://img.shinemang.com/gachaStatic/static/img/shanggui/tabs_bg.png");
    background-size: 100% 100%;
    font-size: 28rpx;
    color: #ffffff;
    line-height: 28rpx;

    .tab_item {
        width: 33.33%;
        line-height: 60rpx;
        text-align: center;

        &:first-child {
            margin-left: -16rpx;
        }

        &.active {
            margin-top: -10rpx;
            color: #333; //芒星赏
            width: 156rpx;
            height: 84rpx;
            line-height: 76rpx;
            font-weight: bold;
            background: url("https://img.shinemang.com/gachaStatic/static/img/shanggui/tab_bg.png");
            background-size: 100% 100%;
            font-size: 30rpx;
        }
    }
}

.tabs_two_dy {
    background: url("https://img.shinemang.com/gachaStatic/static/img/duoyou/tabs_bg.png"); //多游
    background-size: 100% 100%;

    .tab_item {
        &.active {
            color: #ffffff;
            background: url("https://img.shinemang.com/gachaStatic/static/img/duoyou/tab_bg.png");
            background-size: 100% 100%;
        }
    }
}

.noYFS {
    width: 276rpx;

    .tab_item {
        width: 50%;
    }
}

.shanggui_con {
    width: 100%;
    height: calc(100% - 190rpx);
    position: absolute;
    bottom: 0;
    left: 0;

    .p_lists {
        height: calc(100% - 66rpx);
        border-radius: 0 50rpx 0 0;
        background: #f4f4f4;
        margin-top: -15rpx;
        padding: 28rpx 32rpx;
    }

    .p_lists_dy {
        background: #4F1B1E; //多游
    }
}

.product-scroll {
    height: 100%;
}

.hot-product {
    padding: 0 0 36rpx;

    .p-item {
        width: calc(50% - 10rpx);
        border-radius: 12rpx;
        background-color: #fff;
        margin-bottom: 20rpx;
        overflow: hidden;
        position: relative;
        padding: 6rpx 8rpx;
        box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(0, 0, 0, 0.15);

        .tag2 {
            color: #fff;
            font-size: 24rpx;
            padding: 2rpx 14rpx;
            border-radius: 8rpx;
            border: 2rpx solid #fff;
            background: linear-gradient(to right, #e6c035, #fc7528);

            &.corg {
                background: linear-gradient(to right, #7ecd43, #57b23a);
                margin-left: 8rpx;
            }

            &.corr {
                background: linear-gradient(to right, #e65a35, #fd4228);
            }

            &.welfare {
                margin-left: 8rpx;
                background: linear-gradient(90deg,
                        #ff4949 0%,
                        #ff64c1 33%,
                        #ff5a13 66%,
                        #ffb800 100%);
            }
        }

        .tag3 {
            width: 120rpx;
            height: 248rpx;
            font-size: 20rpx;
            position: absolute;
            color: #000;
            background-image: url("https://img.shinemang.com/gachaStatic/static/img/home/tag-2.png");
            background-size: 100% 100%;
            right: 8rpx;
            top: 0;
            padding-top: 114rpx;
            text-align: center;

            .txt2 {
                font-weight: 500;
                line-height: 24rpx;
            }

            .txt3 {
                font-weight: 800;
                line-height: 20rpx;
                margin: 10rpx 0 24rpx;
            }

            .txt1 {
                width: 88rpx;
                text-align: center;
                font-weight: 500;
                font-size: 16rpx;
                background: #fff;
                padding: 0 12rpx;
                border-radius: 12rpx;
                margin: 0 auto;
            }
        }

        .ltop {
            position: absolute;
            top: 20rpx;
            left: 20rpx;
        }

        .sellOut {
            top: 0;
            left: 0;
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: rgba($color: #000, $alpha: 0.5);
        }
    }

    .p-item_dy {
        background: #3F1618; //多游
    }

    .p-img {
        width: 100%;
        height: 320rpx;
        border-radius: 12rpx;
    }

    .product-info {
        padding: 10rpx 16rpx 0;
    }

    .oneLine {
        .p-name {
            font-weight: 500;
            font-size: 24rpx;
            min-height: 62rpx;
        }

        .multiple1 {
            font-family: "倍数欧气值", sans-serif;
            font-size: 24rpx;
            background: linear-gradient(90deg, #FF921E 0%, #F84F00 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            white-space: nowrap;
            margin-left: auto;
            font-weight: 100;

            .number {
                height: 32rpx;
                line-height: 32rpx;
                font-size: 36rpx;
            }

            .times {
                height: 32rpx;
                line-height: 36rpx;

                &::after {
                    content: '星光积分';
                    background: linear-gradient(180deg, #A53A3F 0%, #3F1618 100%);
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                }
            }

            .multiple2 {
                -webkit-text-stroke: 0.5px #ffffff;
            }
        }

    }

    .p-name_dy {
        color: #fff; //多游
    }

    .p-info {
        margin-top: 8rpx;
        align-items: center;

        .priceBox {
            display: flex;

            .discountPrice {
                font-weight: 800;
                color: #000;
                font-size: 28rpx;
                text-decoration: line-through;
            }

            .price {
                font-weight: 800;
                font-size: 28rpx;
                color: #000;

            }

            .price_dy {
                color: #F44935; //多游
            }
        }

        .WelfareBox {
            font-weight: 800;
            color: #000;
            font-size: 28rpx;
        }

        .num {
            font-size: 24rpx;
            font-weight: 500;
            color: #615e74;

        }

        .num_dy {
            color: #9F8A8B; //多游
        }
    }
}

.wuxiansang {
    width: 64rpx;
    height: 32rpx;
}

.label {
    width: 130.96rpx;
    height: 208rpx;
    position: absolute;
    padding-top: 115rpx;
    top: 0;
    right: 0;
    background-image: url("https://img.shinemang.com/gachaStatic/static/img/home/zhekoua.png");
    background-size: 100% 100%;

    .discount {
        width: 100%;
        font-weight: 800;
        font-size: 32rpx;
        color: #ffffff;
        text-align: center;

        &:before {
            content: "￥";
            font-size: 24rpx;
            margin-right: 0rpx;
        }
    }

    .original {
        width: 100%;
        font-family: PingFang SC, PingFang SC;
        font-weight: 800;
        font-size: 24rpx;
        color: #ffffff;
        line-height: 32rpx;
        text-align: center;
        opacity: 0.6;
        text-decoration: line-through;
    }
}
</style>