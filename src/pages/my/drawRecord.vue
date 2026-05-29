<template>
    <view :style="{ paddingTop: MBInfo().top + 'px' }" class="drawRecord">
        <div :style="{ height: MBInfo().height + 'px' }" class="navbar_x flex_r flex_jb flex_ac">
            <view class="top_Back" @click.stop="gateBack">
                <text class="icof Back_ico">&#xe72c;</text>
                <text class="txt">抽赏记录</text>
            </view>
        </div>
        <div class="shanggui_con" :style="{ height: conHeight }">
            <view class="tabs_two flex_r flex_jb">
                <view
                    class="tab_item"
                    :class="{ active: i.val == secondCondition }"
                    @click="ontab2(i)"
                    v-for="(i, s) in navbar"
                    :key="s"
                    >
                    <text>{{ i.txt }}</text>
                     <view v-if="i.val == secondCondition" class="line"></view>
                    </view
                >
            </view>
            <view style="margin-top: 14rpx;" class="bgcBox"></view>
            <view class="p_lists">
                <div class="order_list" v-if="myRewardData.length">
                    <scroll-view
                        class="product-scroll"
                        @scrolltolower="onReachScollBottom"
                        :lower-threshold="400"
                        :scroll-y="true"
                    >
                        <div
                            class="order_item"
                            v-for="(item, index) in myRewardData"
                            :key="index"
                            @click="onclickHistoryDetail(item)"
                        >
                            <view style="padding:  0 32rpx;">
                                <div class="row flex_r flex_jb flex_ac">
                                <div class="flex_r flex_ac">
                                    <span class="txt">套系</span
                                    ><span class="txt">{{
                                        item.gachaName
                                    }}</span>
                                </div>
                                <div
                                    class="detail"
                                    @click="
                                        getRecordDetails(
                                            item.gachaId,
                                            item.boxIndex
                                        )
                                    "
                                >
                                    <span>查看详情</span
                                    ><span class="icof">&#xe72b;</span>
                                </div>
                            </div>
                            <div class="row flex_r flex_ac">
                                <span class="txt">箱号</span
                                ><span class="txt">{{ item.boxOutNo }}</span>
                            </div>
                            <div class="row flex_r flex_ac flex_jb">
                                <div class="flex_r flex_ac">
                                    <span class="txt">抽赏类型</span>
                                    <!-- : item.items[0].levelIndex | levelNum -->
                                    <span
                                        class="txt"
                                        v-if=" item.count"
                                    >
                                        {{ "抽" + item.count + "发" }}
                                    </span>
                                    <span
                                        class="txt"
                                        v-else
                                    >
                                        {{
                                            item.items[0].levelIndex | levelNum
                                        }}赏
                                    </span>
                                    <!-- <span class="txt" v-else
                                        >{{
                                            (item.count &&
                                                "抽" + item.count + "发") ||
                                            "Lucky"
                                        }}
                                    </span>   -->
                                </div>
                                <div class="flex_r flex_ac">
                                    <span class="txt">抽赏时间</span
                                    ><span class="txt">{{
                                        item.createTime
                                    }}</span>
                                </div>
                            </div>
                            <div
                                class="goods"
                                :class="{
                                    yifansh:
                                        secondCondition == 1 &&
                                        item.items.length > 1,
                                }"
                            >
                                <template v-for="(a, b) in item.items">
                                    <div
                                        class="goods_item flex_r flex_ac flex_jb"
                                        :key="b"
                                    >
                                        <div
                                            class="name ellipsis"
                                            v-if="secondCondition == 1"
                                        >
                                            {{ a.levelIndex | levelNum }}赏
                                        </div>
                                        <div class="name ellipsis" v-else>
                                            {{ a.itemName }}
                                        </div>
                                        <div class="num">
                                            {{
                                                a.count > 1 ? "x" + a.count : ""
                                            }}
                                        </div>
                                        <img :src="a.itemCover" class="img" />
                                    </div>
                                </template>
                            </div>
                            </view>
                             <view style="margin-top: 24rpx;" class="bgcBox"></view>
                        </div>
                    </scroll-view>
                </div>
                <u-empty
                    v-else
                    text="暂无抽赏记录~"
                    icon="https://img.shinemang.com/gachaStatic/static/img/home/empty.png"
                    :marginTop="50"
                />
            </view>
        </div>
    </view>
</template>
<script>
import { post } from "@/utils/api.js";
export default {
    data() {
        return {
            navbar: [
                // { txt: "一番赏", val: 1 },
                { txt: "扭蛋机", val: 2 },
                { txt: "无限赏", val: 3 },
                { txt: "洞洞乐", val: 4 },
                // { txt: "芒星赏", val: 5 },
                // { txt: "一网打尽", val: 6 },
            ],
            pageda: {
                page: 1,
                page_size: 20,
                total: 20,
            },
            secondCondition: 2,
            myRewardData: [],
        };
    },
    onLoad(da) {
        this.getMyRewards();
    },
    methods: {
        ontab2(da) {
            this.pageda.page = 1;
            this.secondCondition = da.val;
            this.getMyRewards();
        },
        getMyRewards() {
            post("v1/gacha/user_record", {
                ...this.pageda,
                gacha_type: this.secondCondition, // 0: 所有, 1:一番赏, 2:彩蛋机, 3:潮游赏，4:洞洞乐
            }).then((res) => {
                if (this.pageda.page == 1) this.myRewardData = [];
                this.myRewardData = this.myRewardData.concat(res.records);
                this.pageda.total = res.total;
            });
        },
        getRecordDetails(gachaId, boxIndex) {},
        onclickHistoryDetail(data) {
            let da = { id: data.gachaId, index: data.boxIndex };
            let s = "/pages/product/yifanshang";
            if (data.gachaType == 1) s = "/pages/product/yifanshang";
            else if (data.gachaType == 2) s = "/pages/product/niudan";
            else if (data.gachaType == 3) s = "/pages/product/chaowanshang";
            else if (data.gachaType == 4) s = "/pages/product/dongle";
            else if (data.gachaType == 5) s = "/pages/product/chaosheshang";
            else if (data.gachaType == 6) s = "/pages/product/allCaptured";
            this.goto(s, da);
        },
        onReachScollBottom() {
            if (this.pageda.total > this.pageda.page * this.pageda.page_size) {
                this.pageda.page++;
                this.getMyRewards();
            }
        },
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
};
</script>
<style lang='scss' scoped>
.drawRecord {
    width: 100vw;
    height: 100vh;
    position: relative;
    // padding: 100rpx 0 30rpx;
      background-color: #fff;
        
    overflow-y: auto;

  
}
.bgcBox{
    width: 100%;
    height: 16rpx;
    background-color: #F5F6F8;
}

.navbar_x {
    padding: 0 32rpx;
    position: relative;
    z-index: 2;

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
}

.tabs_two {
    
    // width: 650rpx;
    // background: #ac8afc;
    // border-radius: 0 30rpx 0 0;
    // padding-right: 20rpx;
    // width: 468rpx;
    height: 56rpx;
    // background: url("https://img.shinemang.com/gachaStatic/static/img/shanggui/tabs_bg.png");
    // background-size: 100% 100%;
    font-size: 28rpx;
    color: #666666;
    line-height: 28rpx;
    padding-left: 78rpx;
    padding-right: 78rpx;

    .tab_item {
      width: 136rpx;
height: 56rpx;
// background: #EEEEEE;
// border-radius: 28rpx 28rpx 28rpx 28rpx;
display: flex;
align-items: center;
justify-content: center;
line-height: 56rpx;
margin-right: 16rpx;
color: #8D8D94;
position: relative;
.line{
    width: 64rpx;
height: 12rpx;
background: linear-gradient( 90deg, #31E597 0%, #40E0EA 100%);
border-radius: 6rpx 6rpx 6rpx 6rpx;
position: absolute;
left: 50%;
transform: translateX(-50%);
bottom: 4rpx;
}
text{
    position: relative;
    z-index: 2;
}

        &:first-child {
            // margin-left: -16rpx;
        }
        &:last-of-type {
            // margin-right: 10rpx;
        }

        &.active {
            // background: linear-gradient( 90deg, #31E597 0%, #40E0EA 100%);
            color: #1A1A1A;
            font-weight: 600;
            // margin-top: -10rpx;
            // color: #333;
            // width: 156rpx;
            // height: 86rpx;
            // line-height: 76rpx;
            // font-weight: bold;
            // background: url("https://img.shinemang.com/gachaStatic/static/img/shanggui/tab_bg.png");
            // background-size: 100% 100%;
            // font-size: 30rpx;
        }
    }
}

.shanggui_con {
    width: 100%;
    height: calc(100% - 190rpx);
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 2;

    .p_lists {
        height: calc(100% - 86rpx);
        border-radius: 0 50rpx 0 0;
        // background: #f4f4f4;
        margin-top: -15rpx;
        padding: 32rpx 0;
    }
}

.order_list {
    height: 100%;
    /* overflow-y: auto; */
    .product-scroll {
        height: 100%;
    }
}

.order_item {
    background-color: #fff;
    border-radius: 16rpx;
    padding: 20rpx 0rpx;
    margin-bottom: 20rpx;
    font-size: 24rpx;

    .row {
        margin-bottom: 16rpx;

        .txt {
            margin-right: 10rpx;
        }

        .detail {
            color: #818181;
        }
    }

    .goods {
        padding-top: 16rpx;
        border-top: 2rpx solid #e2e1e3;
    }

    .goods_item {
        background: #f9f9f9;
        border-radius: 16rpx;
        font-size: 28rpx;
        padding: 8rpx 20rpx;
        margin-bottom: 15rpx;

        &:last-child {
            margin-bottom: 0;
        }

        .name {
            width: calc(100% - 138rpx);
        }

        .num {
            color: $motif-color;
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
    }

    .yifansh {
        @include grid(312rpx);

        .goods_item {
            width: 312rpx;
        }
    }
}
</style>