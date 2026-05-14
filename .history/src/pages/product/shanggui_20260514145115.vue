<!-- 赏gui -->
<template>
    <view class="shanggui" :class="{ mpWeixin: ISmp() }" :style="{ paddingTop: MBInfo().top - 6 + 'px' }">
        <view class="top_tabs">
            <u-tabs :list="navbar" @click="ontab" lineColor="#333" :activeStyle="activeStyl"></u-tabs>
            <view class="top_btn" @click="goto('/pages/common/rulepop', { val: 'ShippingRules' })">
                <span>潮柜规则</span>
                <img class="ico" src="https://img.chaoshewang.com/static/img/shanggui/group_3.png" />
            </view>
        </view>
        <div class="shanggui_con" :style="{ height: conHeight }">
            <view class="flex_r flex_jb">
                <view class="tabs_two flex_r flex_jb">
                    <view class="tab_item" :class="{ active: i == active }" @click="ontab2(i, s)"
                        v-for="(i, s) in navbar2" :key="s">{{ i }}</view>
                </view>
                <!-- #ifndef MP-WEIXIN -->
                <view class="recycle flex_r flex_ac" @click="onGoRecycle()"  v-if="recycleState">
                    <img class="icon" src="https://img.chaoshewang.com/static/img/shanggui/recycle.png" />
                    <view class="text">回收</view>
                </view>
                <!-- #endif -->
            </view>
            <view class="p_lists">
                <view class="tab flex_r flex_ac flex_jb">
                    <view class="teg">赏品共{{ totalReward || 0 }}个</view>
                    <view class="flex_r flex_ac">
                        <view class="btn " :class="{ active: data.hasOwnProperty('order_by_create_time') }"
                            @click="onBtn(0)">最新</view>
                        <view class="btn" :class="{ active: data.hasOwnProperty('order_by_inner_price') }"
                            @click="onBtn(1)">最贵</view>
                    </view>
                </view>
                <scroll-view @scrolltolower="onReachScollBottom" v-if="cabinetData && cabinetData.length"
                    class="ListScroll" :lower-threshold="400" :scroll-y="true">
                    <view class="lists_box">
                        <view class="lists">
                            <view class="item" v-for="(item, index) in cabinetData" :key="index">
                                <view class="item_img" :style="{
                                    backgroundImage: `url(${item.item.coverThumb})`,
                                }" @click="ondetail(item.itemId)">
                                    <view class="box_ico frame" v-if="item.state == 'CabinetStockState_InStock'"></view>
                                    <!-- <img src="https://img.chaoshewang.com/static/img/shanggui/group_1.png"  class="box_ico" v-if="item.state =='CabinetStockState_InStock' " /> -->
                                    <view class="" v-if="
                                        item.state ==
                                        'CabinetStockState_OnDeal' ||
                                        item.state ==
                                        'CabinetStockState_Delivered'
                                    ">
                                        <img src="https://img.chaoshewang.com/static/img/shanggui/group_2.png"
                                            class="box_ico" />
                                        <view class="item_txt">{{
                                            item.state ==
                                                "CabinetStockState_OnDeal"
                                                ? "发布中"
                                                : "发货中"
                                        }}
                                        </view>
                                    </view>
                                    <view class="item_txt1">{{
                                        item.item.saleType == 1
                                            ? "现货"
                                            : "预售"
                                    }}</view>
                                </view>
                                <view class="item_name ellipsis">{{
                                    item.item.name
                                    }}</view>
                                <view class="item_no ellipsis">{{
                                    item.itemId
                                    }}</view>
                            </view>
                        </view>
                    </view>
                </scroll-view>
                <u-empty v-else text="暂无赏品~" icon="https://img.chaoshewang.com/static/img/home/empty.png"
                    :marginTop="50" />
            </view>
            <view class="foot_btn flex_r flex_ac flex_jse">
                <!-- #ifndef MP-WEIXIN -->
                <x-btn v-show="userInfo.showMarket" txt="选择交易" cor="2" @click="goto('/pages/transaction/index')" />
                <!-- #endif -->
                <x-btn txt="选择发货" cor="3" @click="goto('/pages/shipments/selectGoods')" />
            </view>
        </div>
        <gachaDetails ref="gachaDetails" />
        <select-goods ref="addStock" @totalNums="(va) => { totalNums = va; }" @confirmSelect="SelectIds" isfilt="1"
            typeClass="0" />
        <show-modal></show-modal>
    </view>
</template>
<script>
import { mapState } from "vuex";
import { post } from "@/utils/api.js";
import xBtn from "@/components/modules/x-btn";
import selectGoods from "@/components/selectGoods/index";
export default {
    data() {
        return {
            ISmp: this.ISmp,
            activeStyl: {
                color: "#333",
                fontWeight: "bold",
                fontSize: "18px",
                transform: "scale(1.05)",
            },
            navbar: [
                {
                    name: "全部",
                },
                {
                    name: "待交易",
                },
                {
                    name: "发布中",
                },
            ],
            active_m: 0,
            navbar2: ["全部", "现货", "预售"],
            active: "全部",
            totalReward: 0, // 赏品总量
            cabinetData: [], // 赏品数据
            firstCondition: 0, // 一级筛选条件
            secondCondition: 0, // 二级筛选条件
            pageda: {
                page: 1,
                page_size: 40,
                total: 40,

            },
            data: { order_by_create_time: 2, },// order_by_inner_price:2
            recycleState: 0,
        };
    },
    components: {
        xBtn,
        selectGoods
    },
    watch: {},
    computed: {
        ...mapState(["userInfo"]),
        conHeight() {
            let h = this.SystemInfo.screenHeight;
            let va = this.MBInfo();
            let th = va.height + va.top + 18;
            let str = h - th + "px";
            return str;
        },
    },
    created() {
        this.loadDetail();
        if (!this.userInfo.showMarket) this.navbar = [{ name: "全部" }];
    },
    methods: {
        ontab(item) {
            this.pageda.page = 1;
            this.secondCondition = item.index;
            this.loadDetail(1);
        },
        ontab2(item, index) {
            this.pageda.page = 1;
            this.active = item;
            this.firstCondition = index;
            this.loadDetail(1);
        },
        loadDetail(page) {
            if (page == 1) this.cabinetData = [];
            post("v1/cabinet/stock/list", {
                sale_type: this.firstCondition,
                state: this.secondCondition,
                order_by_award_level: 1,
                order_by_theme_type: 1,
                ...this.pageda, ...this.data,
            }).then((res) => {
                if (!res.code) {
                    this.totalReward = res.totalNums;
                    if (page == 1) {
                        this.cabinetData = res.cabinetStocks;
                    } else {
                        this.cabinetData = [
                            ...this.cabinetData,
                            ...res.cabinetStocks,
                        ];
                    }
                    this.pageda.total = res.totalNums;
                    this.recycleState = res.recycleState
                }
            });
        },
        ondetail(id) {
            this.gachaDetailsMethod(this, id);
        },
        onReachScollBottom() {
            if (this.pageda.total > this.pageda.page * this.pageda.page_size) {
                this.pageda.page++;
                this.loadDetail();
            }
        },
        onBtn(num) {
            if (num) this.data = { order_by_inner_price: 2 }
            else this.data = { order_by_create_time: 2, }

            this.pageda = { page: 1, page_size: 40, total: 40, },
                this.loadDetail(1)
        },
        onGoRecycle() {
            this.$refs.addStock.open([], -1);
            // uni.navigateTo({ url: "/pages/transaction/index?openStock=true" });
        },
          SelectIds(ids, infos) {
            let that = this;
            const data =ids.length==that.totalReward?[]:ids
            post("v1/cabinet/stock/recycle/preview", {
                stock_id: data,
            }).then((res) => {
                if (res.code) {
                    uni.$u.toast(res.message);
                } else {
                    that.$showModal({
                        title: "物品二次回收确认",
                        content: `本次将回收${res.itemNum}件赏品<br/>共获得${res.recyclingPrice}潮币余额`,
                        hint: '温馨提示：回收后将无法恢复，请谨慎操作~',
                        success(res1) {
                            if (res1.confirm) {
                                post("v1/cabinet/stock/recycle", {
                                    stock_id: data,
                                }).then((res2) => {
                                    if (res2.code) {
                                        uni.$u.toast(res2.message);
                                    } else {
                                        uni.$u.toast("回收成功！");
                                        // 刷新列表
                                        that.pageda.page = 1;
                                        that.loadDetail(1);
                                        // 刷新 selectGoods 组件数据
                                        that.$refs.addStock.getSubclassReward();
                                    }
                                });
                            }
                        },
                    });
                }
            });

        }
    },
};
</script>
<style lang='scss' scoped>
.shanggui {
    height: 100vh;
    padding-top: 80rpx;
    position: relative;
}

.frame {
    background: url("@/static/homePage/frame.png");
    background-size: 100% 100%;
}

.shanggui_con {
    width: 100%;
    height: calc(100% - 196rpx);
    position: absolute;
    bottom: 0;
    left: 0;
}

.top_tabs {
    position: relative;

    .top_btn {
        position: absolute;
        right: 32rpx;
        top: 20rpx;
        width: 154rpx;
        height: 40rpx;
        line-height: 40rpx;
        text-align: center;
        background: linear-gradient(90deg, #5859b6 0%, #4878b6 100%);
        border-radius: 16rpx 20rpx 20rpx 6rpx;
        font-size: 24rpx;
        font-weight: bold;
        color: #ffffff;

        .ico {
            width: 26rpx;
            height: 26rpx;
            padding-left: 8rpx;
        }
    }
}

.tabs_two {
    width: 372rpx;
    height: 76rpx;
    background: url("https://img.chaoshewang.com/static/img/shanggui/tabs_bg.png");
    background-size: 100% 100%;
    font-size: 28rpx;
    color: #ffffff;
    line-height: 28rpx;

    .tab_item {
        width: 156rpx;
        line-height: 60rpx;
        text-align: center;

        &:first-child {
            margin-left: -16rpx;
        }

        &.active {
            margin-top: -10rpx;
            color: #333;
            width: 156rpx;
            height: 86rpx;
            line-height: 76rpx;
            font-weight: bold;
            background: url("https://img.chaoshewang.com/static/img/shanggui/tab_bg.png");
            background-size: 100% 100%;
            font-size: 30rpx;
        }
    }
}

.recycle {
    padding: 0 16rpx;
    height: 48rpx;
    background: linear-gradient(0deg, #4FEF5F 0.01%, #1BAB04 100%);
    box-shadow: inset 0rpx 4rpx 4rpx 0rpx rgba(255, 255, 255, 0.25);
    border-radius: 40rpx;
    margin-right: 32rpx;
    font-weight: bold;
    font-size: 24rpx;
    color: #FFFFFF;

    .icon {
        width: 40rpx;
        height: 40rpx;

    }

    .text {
        //  width: 40rpx;
        height: 40rpx;
        line-height: 40rpx;
    }
}

.p_lists {
    height: calc(100% - 66rpx);
    margin-top: -16rpx;
    border-radius: 0 50rpx 0 0;
    background: #f4f4f4;
    padding: 30rpx 36rpx;
    position: relative;

    // overflow-y: auto;
    .tab {
        .teg {
            width: 178rpx;
            height: 36rpx;
            text-align: center;
            background: rgba(102, 82, 207, 0.1);
            border-radius: 16rpx;
            line-height: 36rpx;
            color: #6652cf;
            font-size: 24rpx;
        }

        .btn {
            width: 88rpx;
            height: 44rpx;
            line-height: 44rpx;
            font-weight: 500;
            font-size: 24rpx;
            color: #343434;
            background: #E2E1E3;
            border-radius: 8rpx;
            text-align: center;
            margin-left: 16rpx;

            &.active {
                color: #6652CF;
                background: #CEC3ED;
            }
        }

    }

}

.lists_box {
    padding-bottom: 150rpx;
    // height: 100%;
    // overflow-y: auto;
}

.ListScroll {
    height: calc(100% - 160rpx);
    margin-top: 28rpx;
}

.lists {
    @include grid(152rpx);

    .item {
        width: 152rpx;
        margin-bottom: 18rpx;

        .item_img {
            width: 152rpx;
            height: 152rpx;
            background-color: rgba($color: #f4f4f4, $alpha: 1);
            border-radius: 16rpx;
            background-size: 100% 100%;
            position: relative;
        }

        .item_name {
            margin: 5rpx 0;
            font-size: 20rpx;
            font-weight: bold;
            color: #343434;
        }

        .item_no {
            font-size: 16rpx;
            color: #343434;
        }

        .box_ico {
            width: 152rpx;
            height: 152rpx;
        }

        .item_txt {
            color: #ffffff;
            font-size: 22rpx;
            position: absolute;
            left: 6rpx;
            bottom: 2rpx;
        }

        .item_txt1 {
            color: #ffffff;
            font-size: 20rpx;
            position: absolute;
            right: 6rpx;
            top: 0rpx;
        }
    }
}

.foot_btn {
    width: 100%;
    position: fixed;
    bottom: 176rpx;
    left: 0;
}

.mpWeixin {
    .top_tabs .top_btn {
        top: 108rpx;
        z-index: 12000;
    }
}
</style>