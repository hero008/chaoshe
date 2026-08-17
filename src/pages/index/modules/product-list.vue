<template>
    <view class="hot-product flex_r flex_jb" v-if="evenList.length">
        <view class="l-lists">
            <view class="p-item" v-for="(item, index) in evenList" :key="index" @click="tn(item)">
                <image :src="item.coverImage" class="p-img" />
                <view class="product-info">
                      <img v-if="item.type == 3" src="https://img.shinemang.com/gachaStatic/home/wxc.png"
                        class="w-icon" />
                         <img v-else-if="item.type == 2" src="https://img.shinemang.com/gachaStatic/home/ndIcon.png"
                        class="w-icon" />
                         <img v-else-if="item.type == 4" src="https://img.shinemang.com/gachaStatic/home/ddlIcon.png"
                        class="w-icon" />
                           <img v-else-if="item.type == 7" src="https://img.shinemang.com/gachaStatic/home/ddpIcon.png"
                        class="w-icon" />
                    <view class="oneLine flex_r ">
                        <view class="p-name ">{{ item.themeName }}</view>
                        <view class="multiple1 flex_r" v-if="item.costAwardMultiple > 1">
                            <view class="number">{{ item.costAwardMultiple }}</view>
                            <view class="times">倍</view>
                        </view>
                    </view>
                    <view class="p-info flex_r flex_jb">
                        <view v-if="item.isWelfare == true" class="WelfareBox">福利箱</view>
                        <view class="priceBox" v-else>
                            <view class="price">
                                {{
                                    item.discountPrice || item.price || "0.00"
                                }}</view>
                        </view>
                        <!-- <view class="tag"></view> -->
                        <!-- <img class="tag" src="https://img.shinemang.com/gachaStatic/static/img/home/ico_ico.png" alt="" /> -->
                    </view>
                </view>
                <view class="label" v-show="item.discount > 0">
                    <view class="discount">
                        {{ item.discountPrice || item.price || "0.00" }}
                    </view>
                    <view class="original">￥{{ item.price }}</view>
                </view>
                <view class="ltopBox">
                  <div class="ltop">
                    <view class="tag2" v-show="item.isNew"></view>
                    <view class="tag2 welfare" v-show="item.isWelfare"></view>
                </div>
                </view>
              
                <div class="sellOut flex_r flex_ac flex_jc"
                    v-show="item.leftBox == 0 || item.state == 1 || item.state == 3">
                    <div class="tag3" v-if="item.state == 1">
                        <div class="txt2">
                            {{ toTime(item.startTime).substring(0, 5) }}
                        </div>
                        <div class="txt2">
                            {{ toTime(item.startTime).substring(5,
                                toTime(item.startTime).length + 1) }}
                        </div>
                        <div class="txt3">整点开售</div>
                        <div class="txt1">{{ setIsSub(item) }}</div>
                    </div>
                    <div class="tag2 corr" v-else>售罄</div>
                </div>
            </view>
        </view>
        <!-- <view class="l-lists" v-else>
            <view class="commodityBox" v-for="item in evenList" :key="item.configId">
                <view class="showImg" @click="onGo(item)">
                    <image :src="item.thumb" class="img" />
                    <image v-if="item.startTime > 0" src="https://img.shinemang.com/gachaStatic/static/img/home/yushou.png"
                        class="spotGoods" />
                    <image v-show="item.label == 1" src="https://img.shinemang.com/gachaStatic/static/img/home/new.png"
                        class="new" />
                    <image v-show="item.onlyShipment == 1" src="https://img.shinemang.com/gachaStatic/static/img/home/zfh.png"
                        class="zfh" />
                </view>
                <view class="title">{{ item.itemList[0].name }}</view>
                <view class="integral" v-if="item.price !== '0'">
                    <view class="iocn">￥</view>
                    <view class="money">{{ item.price }}</view>
                </view>
                <view class="integral" v-if="item.value !== '0'">
                    <view class="integralImg">星光积分</view>
                    <view class="number">{{ item.value }}</view>
                </view>
            </view>
        </view> -->
         <!-- v-if="type < 3" -->
        <view class="r-lists">
            <view class="p-item" v-for="(item, index) in oddList" :key="index" @click="tn(item)">
                <image :src="item.coverImage" class="p-img" />
                <view class="product-info">
                    <view class="oneLine flex_r ">
                        <view class="p-name ">{{ item.themeName }}</view>
                        <view class="multiple1 flex_r" v-if="item.costAwardMultiple > 1">
                            <view class="number">{{ item.costAwardMultiple }}</view>
                            <view class="times">倍</view>
                        </view>
                    </view>

                   <img v-if="item.type == 3" src="https://img.shinemang.com/gachaStatic/home/wxc.png"
                        class="w-icon" />
                         <img v-else-if="item.type == 2" src="https://img.shinemang.com/gachaStatic/home/ndIcon.png"
                        class="w-icon" />
                         <img v-else-if="item.type == 4" src="https://img.shinemang.com/gachaStatic/home/ddlIcon.png"
                        class="w-icon" />
                         <img v-else-if="item.type == 7" src="https://img.shinemang.com/gachaStatic/home/ddpIcon.png"
                        class="w-icon" />
                    <view class="p-info flex_r flex_jb">
                        <view v-if="item.isWelfare == true" class="WelfareBox">福利箱</view>
                        <view class="priceBox" v-else>
                            <!-- <view
                                class="discountPrice"
                                v-show="item.discount > 0"
                                >￥{{ item.price }}</view
                            > -->
                            <view class="price">{{ item.discountPrice || item.price || "0.00" }}</view>
                        </view>
                        <!-- <view class="tag"></view> -->
                        <!-- <img class="tag" src="https://img.shinemang.com/gachaStatic/static/img/home/ico_ico.png" alt="" /> -->
                    </view>
                </view>
                <view class="label" v-show="item.discount > 0">
                    <view class="discount">
                        {{ item.discountPrice || item.price || "0.00" }}
                    </view>
                    <view class="original">￥{{ item.price }}</view>
                </view>
                   <view class="ltopBox">
                     <div class="ltop flex_r">
                 
                    <view class="tag2 welfare" v-show="item.isWelfare"></view>
                       <view class="tag2" v-show="item.isNew"></view>
                </div>
                   </view>
               
                <div class="sellOut flex_r flex_ac flex_jc"
                    v-show="item.leftBox == 0 || item.state == 1 || item.state == 3">
                    <div class="tag3" v-if="item.state == 1">
                        <div class="txt2"> {{ toTime(item.startTime).substring(0, 5) }} </div>
                        <div class="txt2"> {{ toTime(item.startTime).substring(5, toTime(item.startTime).length + 1) }}
                        </div>
                        <div class="txt3">整点开售</div>
                        <div class="txt1">{{ setIsSub(item) }}</div>
                    </div>
                    <div class="tag2 corr" v-else>售罄</div>
                </div>
            </view>
        </view>
        <!-- <view class="r-lists" v-else>
            <view class="commodityBox" v-for="item in oddList" :key="item.configId">
                <view class="showImg" @click="onGo(item)">
                    <image :src="item.thumb" class="img" />
                    <image v-if="item.startTime > 0" src="https://img.shinemang.com/gachaStatic/static/img/home/yushou.png"
                        class="spotGoods" />
                    <image v-show="item.label == 1" src="https://img.shinemang.com/gachaStatic/static/img/home/new.png"
                        class="new" />
                    <image v-show="item.onlyShipment == 1" src="https://img.shinemang.com/gachaStatic/static/img/home/zfh.png"
                        class="zfh" />
                </view>
                <view class="title">{{ item.itemList[0].name }}</view>
                <view class="integral" v-if="item.price !== '0'">
                    <view class="iocn">￥</view>
                    <view class="money">{{ item.price }}</view>
                </view>

                <view class="integral" v-if="item.value !== '0'">
                    <view class="integralImg">星光积分</view>
                    <view class="number">{{ item.value }}</view>
                </view>
            </view>
        </view> -->
    </view>
    <u-empty v-else-if="type < 10" :text="type == 1 ? '敬请期待热门箱子~' : '暂时没有可捡漏的箱子哦~'"
        icon="https://img.shinemang.com/gachaStatic/static/img/home/empty.png" :marginTop="50" />
    <u-empty v-else :text="'暂无商品'" icon="https://img.shinemang.com/gachaStatic/static/img/home/empty.png" :marginTop="50" />
    <!-- </scroll-view> -->
</template>
<script>
import { post } from "@/utils/api.js";
import { mapState } from "vuex";
import infiniteScroll from "../../../components/infiniteScroll/infiniteScroll.vue";
export default {
    data() {
        return {
            pageda: {
                page: 1,
                page_size: 16,
                total: 16,
            },
            ismp: false,
            evenList: [],
            oddList: [],
            triggered: true,
            currentTime: new Date().getTime(),
        };
    },

    props: {
        type: Number,
        IsScroll: Boolean,
        ptype: {
            type: Number,
            default: 0,
        },
    },
    components: {},
    watch: {
        type() {
            this.pageda = {
                page: 1,
                page_size: 16,
                total: 16,
            };
            this.getlist(1);
        },
    },
    computed: {
        ...mapState(["userInfo"]),
    },
    created() {
        // #ifdef MP-WEIXIN
        this.ismp = true;
        this.getlist(2);
        // #endif
        // #ifndef MP-WEIXIN
        this.getlist(1);
        // #endif
    },
    onShow() { },
    mounted() { },
    methods: {
        getlist(page) {
            this.pageda.page = page;
            let url = "v1/gacha/list",
                da = {},
                p = Math.ceil(this.pageda.total / this.pageda.page_size);

            if (this.type < 3) {
                if (this.type == 1) {
                    // url = "v1/gacha/list";
                    da = {
                        is_mp: this.ismp,
                        is_recommend: 1,
                        type: this.ptype,
                        ...this.pageda,
                    };
                }
                else if (this.type == 0) {
                    // url = "v1/gacha/list";
                    da = {
                        is_mp: this.ismp,
                        is_recommend: 1,
                        type: this.ptype,
                        is_welfare: true,
                        ...this.pageda,
                    }
                }
                else {
                    url = "v1/gacha/pick_up/list";
                    da = {
                        is_mp: this.ismp,
                        type: this.ptype,
                        ...this.pageda,
                    };
                }
                if (p >= this.pageda.page) {
                    post(url, da).then((res) => {
                        if (this.pageda.page == 1) {
                            this.evenList = [];
                            this.oddList = [];
                        }
                        this.pageda.total = Number(res.total);
                        const Arr = res.gachas.filter(item => item.leftBox !== 0 && item.state !== 3);
                        // 解构赋值，一行完成奇偶分组
                        let [even, odd] = Arr.reduce(
                            ([e, o], item, index) =>
                                index % 2 === 0 ? [[...e, item], o] : [e, [...o, item]],
                            [[], []]
                        );

                        if (this.evenList.length - this.oddList.length === 1 && Arr.length < 2) {
                            odd = Arr;
                            even = [];
                        }
                        this.evenList = [...this.evenList, ...even];
                        this.oddList = [...this.oddList, ...odd];
                    });
                }
            } else {
                this.evenList = [];
                this.oddList = [];
                url = "v1/activity/cost-award/list";
                da = {
                    user_id: this.userInfo.id,
                    type: 2,
                };
                post(url, da).then((res) => {
                    const Arr = res.config.reduce((acc, item) => {
                        if (
                            item.itemList.length &&
                            item.leftBox !== 0 &&
                            item.state !== 3
                        ) {
                            if (item.startTime) item.startTime = this.remainingTime(item.startTime);
                            if (item.endTime) item.endTime = this.remainingTime(item.endTime);
                            acc.push(item);
                        }
                        return acc;
                    }, []);
                    let [even, odd] = Arr.reduce(([e, o], item, i) => {
                        i % 2 === 0 ? e.push(item) : o.push(item);
                        return [e, o];
                    }, [[], []]);
                    if (this.evenList.length - this.oddList.length === 1 && Arr.length < 2) {
                        odd = Arr;
                        even = [];
                    }
                    this.evenList.push(...even);
                    this.oddList.push(...odd);
                });
            }
        },
        tn(da) {
            if (da.state == 1) {
                if (da.isSub) return;
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
                                    }
                                });
                                da.isSub = !da.isSub;
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
                else if (da.type == 3) this.goto("/pages/product/chaowanshang", { id: da.id, });
                else if (da.type == 4) this.goto("/pages/product/dongle", { id: da.id, });
                else if (da.type == 5) this.goto("/pages/product/chaosheshang", { id: da.id, });
                  else if (da.type == 7) this.goto("/pages/product/duiduipeng", { id: da.id, });
            }
        },
        onReachScollBottom() {
            if (this.pageda.total > this.pageda.page * this.pageda.page_size) {
                this.pageda.page++;
                this.getlist();
            }
        },
        setIsSub(da) {
            if (da.isSub) {
                return "已预约";
            } else {
                return "点击预约";
            }
        },
        onGo(index) {
            let itemJson = JSON.stringify(index);
            let id = index.configId;
            // this.goto("/pages/shopping/commodity", { itemJson });
            this.goto("/pages/shopping/commodity", { id });
        },
        onRefresh() {
            this.pageda.page = 1;
            this.getlist();
            setTimeout(() => {
                this.triggered = false;
            }, 600);
        },
        onRestore() {
            this.triggered = "restore"; // 需要重置
        },
    },
};
</script>
<style lang='scss' scoped>
.product-scroll {
    height: calc(100% - 100rpx);
}

.hot-product {
    padding: 10rpx 0 50rpx;
    padding-bottom: 160rpx;
}

.l-lists,
.r-lists {
    width: 336rpx;
}

.p-item {
    width: 100%;
    border-radius: 12rpx;
    background-color: #fff;
    margin-bottom: 14rpx;
    overflow: hidden;
    position: relative;

    .w-icon {
        position: absolute;
        bottom: 10rpx;
        right: 16rpx;
        width: 96rpx;
        height: 36rpx;
    }
}

.w-icon2 {
    width: 72rpx;
    height: 24rpx;
}

.commodityBox {
    width: 332rpx;
    height: 536rpx;
    background: #ffffff;
    border-radius: 16rpx 16rpx 16rpx 16rpx;
    font-weight: 800;
    margin-bottom: 20rpx;

    .showImg {
        width: 332rpx;
        height: 332rpx;
        position: relative;
        border-radius: 12rpx;
        overflow: hidden;

        .img {
            width: 100%;
            height: 100%;
        }

        .spotGoods {
            width: 100%;
            height: 48rpx;
            position: absolute;
            left: 0;
            bottom: 0;
        }

        .new {
            width: 104rpx;
            height: 104rpx;
            position: absolute;
            right: 0;
            top: 0;
        }

        .zfh {
            width: 84rpx;
            height: 84rpx;
            position: absolute;
            left: 0;
            bottom: -4rpx;
        }
    }

    .title {
        width: 300rpx;
        height: 64rpx;
        font-weight: 500;
        font-size: 24rpx;
        color: #818181;
        margin: 12rpx;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .integral {
        display: flex;
        margin-left: 12rpx;
        margin-top: 16rpx;
        align-items: flex-end;

        .money {
            color: #2c2c2c;
        }

        .iocn {
            font-weight: 800;
            font-size: 24rpx;
            color: #2c2c2c;
            text-align: end;
        }

        .integralImg {
            width: 84rpx;
            height: 40rpx;
            font-size: 20rpx;
            color: #ffffff;
            line-height: 40rpx;
            text-align: center;
            background: url("https://img.shinemang.com/gachaStatic/static/img/home/integral.png");
            background-size: 100% 100%;
            background-repeat: no-repeat;
            padding-right: 8rpx;
        }

        .number {
            // width: 156rpx;
            height: 40rpx;
            padding-left: 8rpx;
            background: #F5F5FC;
            border-radius: 0rpx 8rpx 8rpx 0rpx;
            font-size: 28rpx;
            color: #9762e9;
            line-height: 40rpx;
            padding-right: 8rpx;
            margin-right: 8rpx;
        }
    }
}

.p-img {
    width: 100%;
    height: 336rpx;
    /* background-color: rgba($color: #9064FF, $alpha: 0.5); */
}

.sm-img {
    height: 160rpx;
    background-color: rgba($color: #9064ff, $alpha: 0.5);
}

.product-info {
    padding: 10rpx 16rpx;
}
.ltopBox{
    width: 336rpx;
    height: 336rpx;
    position: absolute;
    top: 0;
    left: 0;
}
.tag2 {
    // color: #fff;
    // font-size: 24rpx;
    // padding: 2rpx 14rpx;
    // border-radius: 8rpx;
    // border: 2rpx solid #fff;
    // background: linear-gradient(to right, #e6c035, #fc7528);
    width: 88rpx;
    height: 32rpx;
    background: url('https://img.shinemang.com/gachaStatic/home/new.png');
    background-size: 100% 100%;
    margin-top: 8rpx;
  

    &.corr {
        background: linear-gradient(to right, #e65a35, #fd4228);
    }

    &.welfare {
    
         background: url('https://img.shinemang.com/gachaStatic/home/discount.png');
    background-size: 100% 100%;
    }
}

.tag3 {
    width: 132rpx;
    height: 176rpx;
    font-size: 20rpx;
    position: absolute;
    color: #000;
    background-image: url("https://img.shinemang.com/gachaStatic/static/img/home/tag-2.png");
    background-size: 100% 100%;
    left: 50%;
    transform: translateX(-50%);
    top: 0;
    padding-top: 55rpx;
    text-align: center;

    .txt2 {
        font-weight: 500;
        line-height: 24rpx;
    }

    .txt3 {
        font-weight: 800;
        line-height: 20rpx;
        margin:0rpx 0 10rpx;
    }

    .txt1 {
        // width: 88rpx;
        text-align: center;
        font-weight: 500;
        font-size: 24rpx;
        // background: #fff;
        padding: 0 12rpx;
        color: #31E597;
        border-radius: 12rpx;
        margin: 0 auto;
    }
}

.ltop {
    position: absolute;
    bottom: 26rpx;
    left: 0rpx;
}

.sellOut {
    top: 0;
    left: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba($color: #000, $alpha: 0.5);
}

.oneLine {
    width: 100%;

    .p-name {
        color: #1A1A1A;
        font-size: 28rpx;
    }

    .multiple1 {
        font-family: "倍数欧气值", sans-serif;
        font-size: 20rpx;
        background: linear-gradient(90deg, #FF921E 0%, #F84F00 100%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        white-space: nowrap;
        margin-left: auto;


        .number {
            height: 32rpx;
            font-size: 32rpx;
            // -webkit-text-stroke: 0.5px #ffffff;
            text-stroke: 2px #FFFFFF;
            /* 1px 白色描边，webkit内核前缀 */
            // text-stroke: 1px #ffffff;
            /* 标准属性（部分浏览器已支持） */
        }

        .times {
            height: 32rpx;
            line-height: 48rpx;

            &::after {
                content: '星光积分';
                background: linear-gradient(180deg, #A53A3F 0%, #3F1618 100%);
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
            }
        }
    }
}


.p-info {
    margin-top: 6rpx;

    .price {
        font-weight: 600;

        &:before {
            content: "￥";
            font-size: 24rpx;
            margin-right: 6rpx;
        }
    }

    .priceBox {
        display: flex;

        .discountPrice {
            font-weight: 800;

            color: #f83e15;
            font-size: 28rpx;
            text-decoration: line-through;
        }

        .price {
            // font-weight: 800;
            font-size: 30rpx;
            color: #F65C36;

            &:before {
                content: "￥";
                font-size: 24rpx;
                margin-right: 0rpx;
            }
        }
    }

    .WelfareBox {
        font-weight: 600;
        color: #F65C36;
        font-size: 28rpx;
    }

    .tag {
        width: 56rpx;
        height: 38rpx;
        background: url("@/static/homePage/ico.png");
        background-size: 100% 100%;
    }
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