<template>
    <div class="loading_box" @click.capture="handleAllClicks">
        <view class="head_con">
            <view class="top_Back flex_r flex_js flex_ac" :style="{
                top: MBInfo().top + 'px',
                height: MBInfo().height + 'px',
            }">
                <img src="https://img.chaoshewang.com/static/img/chaowanshang/allFh.png" @click.stop="gateBack"
                    class="Back_ico" />
                <text class="title ellipsis">{{ title }}</text>
                <!-- #ifndef MP-WEIXIN -->
                <img src="https://img.chaoshewang.com/static/img/chaowanshang/allFx.png" @click="onShare"
                    class="Back_ico a" />
                <!-- #endif -->
            </view>
            <div class="particulars">
                <img class="header1" :src="AReward.gacha.coverImage" />
                <view class="name flex_r flex_ac" @click="onIndex = !onIndex">
                    <view class="text ellipsis">{{
                        AReward.gacha.themeName
                        }}</view>
                    <view class="xl" :class="{ active: onIndex }"></view>
                </view>
                <view class="frame" v-if="onIndex">
                    <view class="frame_time" v-for="i in AReward.otherPeriod" :key="i.gachaId" :class="{
                        active: AReward.gachaBox.gachaId == i.gachaId,
                    }" @click="switchTo(i)">{{ i.themeName }}</view>
                </view>
                <view class="price ellipsis">{{ unitPrice }}</view>
                <view class="box_number flex_r flex_ac" @click="tipsShow = !tipsShow">{{
                    AReward.gachaBox.totalAwards +
                    "件/" +
                    AReward.gachaBox.totalBetNum
                }}车<view class="headerRight">!
                        <view class="tipsBox" v-if="tipsShow">
                            <view class="sj"></view>
                            <view class="tips">商品件数为赏池商品总数，抽数为成团条件，成团后参与人瓜分赏池内的所有商品，每抽获得件数随机</view>
                        </view>
                    </view>
                </view>
                <view class="time">本期{{
                    AReward.gacha.state == 2 ? "截止" : "结束"
                }}时间：{{ AReward.gacha.finishTime }}</view>
            </div>
            <view class="rbtn1" @click="
                goto('/pages/common/rulepop', {
                    val: 'GachaShareBillRules',
                })
                "></view>
            <view class="rbtn3" @click="
                goto('/pages/product/modules/join', {
                    index: AReward.gachaBox.boxIndex,
                    id: AReward.gachaBox.gachaId,
                    name: AReward.gacha.themeName,
                })
                "></view>
        </view>
        <view class="yifanshang_con">
            <scroll-view scroll-y="true" class="box_list" @scrolltolower="onReachScollBottom" :lower-threshold="600"
                scroll-with-animation="true">
                <view class="p-list">
                    <view class="list-item" v-for="(item, index) in highGrade" :key="index"
                        :style="{ borderColor: colorMap[item.levelName] }">
                        <img @click="ondetail(item, index)" class="p-img" :src="item.itemHalfImage" />
                        <view class="p-num">{{ item.totalNums }}件</view>
                        <view class="p-name ellipsis">{{ item.itemName }}</view>
                        <view class="p-probability ellipsis">概率:{{ item.probability }}%</view><img class="ico_"
                            :style="{ width: wtMap[item.levelName] }"
                            :src="`https://img.chaoshewang.com/static/img/chaowanshang/css_${item.levelName}.png`" />
                    </view>
                </view>
            </scroll-view>
        </view>
        <view class="foot">
            <view class="progressBar">
                <view class="bubble flex_r flex_ac flex_jc tm" :style="{ left: bubble + 'px' }">
                    <view class="bubble_text">剩余时间</view>
                    <u-count-down :time="residuetime" :show-days="false">
                    </u-count-down>
                </view>
                <view class="number1">{{
                    AReward.gachaBox.leftBetNum +
                    "/" +
                    AReward.gachaBox.totalBetNum
                }}
                </view>
                <view class="progress" :style="{ width: progressNum + '%' }">
                    <view class="masker"></view>
                    <view class="masker1"></view>
                </view>
            </view>
            <view class="foot_btn flex_r flex_ac" v-if="AReward.gacha.state == 2">
                <u-number-box v-model="numberShow" :min="1" :max="userBetCount > AReward.gachaBox.leftBetNum
                        ? AReward.gachaBox.leftBetNum
                        : userBetCount
                    " @change="changeValue" :disabled="userBetCount == 0" integer>
                    <view slot="minus" class="minus">
                        <u-icon name="minus" color="transparent"></u-icon>
                    </view>
                    {{ numberShow }}
                    <view slot="plus" class="plus" @click="onBet">
                        <u-icon name="plus" color="transparent"></u-icon>
                    </view>
                </u-number-box>
                <view class="text_boxe flex_r">
                    <view class="text1">参团</view>
                    <view class="text">车</view>
                </view>
            </view>
            <view class="this_time flex_r flex_ac flex_jc" v-if="AReward.gacha.state == 3">
                <view class="mvp_img"></view>
                <image :src="mvp.avatar | active" class="mvp_head" mode="aspectFill" />
                <view class="mvp_name">{{ mvp.name }}</view>
            </view>
            <view class="btn" @click="onSkip">{{ btnText }}</view>
            <view class="discount flex_r flex_ac" v-if="AReward.gacha.discountMap.length" @click="visible = !visible">
                <view class="discount_text">限时优惠</view>
                <view class="discount_icon">!</view>
                <view class="explain" v-if="visible">
                    <view class="explain_item" v-for="(item, index) in AReward.gacha.discountMap" :key="item.count">
                        一次性购买
                        <span class="explain_num" :data-number="item.count"></span>{{
                            AReward.gacha.discountMap.length - 1 == index
                                ? "车以上"
                                : "车"
                        }}可享受<span class="explain_num2" :data-discount="item.discount / 10"></span>折
                    </view>
                </view>
            </view>

            <view class="Rectangle" v-if="
                AReward.gacha.discountMap.length &&
                Object.keys(discountObj).length
            " @click="onSkip">{{ discountObj.discount / 10 }}</view>
        </view>
        <x-pay @success="onClickDraw" ref="xPay" mtype="13" :probabilityShow="probabilityShow" />
        <gachaDetails ref="gachaDetails" />
    </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { post } from "@/utils/api.js";
import xPay from "@/components/x-pay/index.vue";
import { uniShare, groupBySum } from "@/utils/fun.js";
let that;
export default {
    data() {
        return {
            highGrade: [], // 大赏，需要两列放大排放的
            styleColor: [
                { name: "Last", color: "#5C92FF", width: "124rpx" },
                { name: "Lucky", color: "#EE59EF", width: "142rpx" },
                { name: "SP", color: "#E1D231", width: "112rpx" },
                { name: "SS", color: "#33B577", width: "112rpx" },
                { name: "SR", color: "#33B577", width: "112rpx" },
                { name: "SSR", color: "#31C7E1", width: "124rpx" },
                { name: "Surprise", color: "#F3CD5D", width: "144rpx" },
            ],
            onIndex: false,
            tipsShow: false,
            progressNum: 0,
            bubble: 0,
            numberShow: 1,
            residuetime: 0,
            colorS: 24,
            gachaId: "", //活动idbubble
            AReward: {
                gacha: {
                    themeName: "",
                    discountMap: [],
                },
                gachaBox: {},
                gachaAwards: [],
                gachaBoxAwards: [],
                openMessage: "",
                otherPeriod: [],
            }, //原数据
            leftt: 0,
            themeId: "",
            mvp: {},
            unitPrice: 0,
            btnText: "",
            visible: false,
            discountObj: {},
            title: "",
            probabilityShow: [],
            userBetCount: 0,
        };
    },
    components: {
        xPay,
    },
    computed: {
        ...mapState(["userInfo", "allInLeft"]),
        colorMap() {
            const map = {};
            this.styleColor.forEach((item) => {
                map[item.name] = item.color;
            });
            return map;
        },
        wtMap() {
            const wt = {};
            this.styleColor.forEach((item) => {
                wt[item.name] = item.width;
            });
            return wt;
        },
    },
    onLoad(da) {
        this.themeId = da.val || "";
        this.gachaId = da.id || "";
        this.title = da.name || "一网打尽";
    },
    onShow() {
        this.loadDetail();
        this.discountObj = {};
        this.numberShow = 1;
    },
    methods: {
        ...mapMutations(["UppayMessage"]),
        handleAllClicks(event) {
            const target = event.target || event.currentTarget;
            // 黄色提示 93 折扣7 57 下拉100 254
            if (target.offsetLeft !== 93) {
                if (this.tipsShow) this.tipsShow = false;
            }
            if (![7, 57].includes(target.offsetLeft)) {
                if (this.visible) this.visible = false;
            }
            if (![100, 254].includes(target.offsetLeft)) {
                if (this.onIndex) this.onIndex = false;
            }
        },
        // 获取活动列表
        async loadDetail() {
            //数据初始化
            let value = {};
            if (this.themeId !== "") value = { theme_id: this.themeId }; // "602" this.themeId
            if (this.gachaId !== "") value = { gacha_id: this.gachaId };
            let res = await post("v1/gacha/detail", value);
            this.unitPrice =
                (res.gacha.discountPrice > 0 && res.gacha.discountPrice) ||
                res.gacha.price; // 价格
            this.residuetime = this.remainingTime(res.gacha.finishTime); //时间
            //概率
            res.gachaAwards.map((item) => {
                let a = (item.totalNums / res.gachaBox.totalAwards) * 100;
                item.probability = a.toFixed(2);
            });

            this.AReward = res; //原数据
            this.getProgress();
            this.highGrade =
                res.gachaAwards.length > 12
                    ? res.gachaAwards.slice(0, 12)
                    : res.gachaAwards;
            if (res.gacha.state == 3) {
                this.btnText = res.userBetNum ? "查看开赏结果" : "查看其他奖池";
            } else this.btnText = "确认购买";
            switch (res.userBetCount) {
                case -1:
                    this.userBetCount = res.gachaBox.leftBetNum;
                    break;
                case 0:
                    this.userBetCount = 0;
                    break;
                default:
                    this.userBetCount = res.userBetCount;
                    break;
            }
            if (res.gacha.state == 3) {
                let res1 = await post("v1/gacha/record", {
                    page: 1,
                    page_size: 1,
                    total: 1,
                    gacha_id: res.gachaBox.gachaId,
                    box_index: res.gachaBox.boxIndex,
                });
                this.mvp = res1.gachaRecords[0];
            }
            // #ifdef APP
            if (getApp().globalData.AppTypeList[plus.runtime.channel] == 2)
                this.probabilityShow = groupBySum(res.gachaAwards);
            // #endif
        },
        // 切换期数
        switchTo(item) {
            this.gachaId = item.gachaId;
            this.themeId = "";
            this.loadDetail();
        },
        //支付
        onClickDraw(res, showAnim, type) {
            this.numberShow = 1;
            this.discountObj = {};
            if (!res.code) {
                if (type) {
                    post("v1/gacha/open/result", {
                        pay_id: res.res.createPaymentReply.payId,
                    }).then((res1) => {
                        if (!res1.code) {
                            uni.$u.toast("车位购买成功~");
                            this.loadDetail();
                        } else uni.$u.toast(res1.message);
                    });
                } else {
                    uni.$u.toast("车位购买成功~");
                    this.loadDetail();
                }
            } else {
                uni.$u.toast(res.message);
                this.loadDetail();
            }
        },
        //概率
        ondetail(data) {
            post("v1/goods/item/get", {
                item_id: data.itemId,
            }).then((res) => {
                if (!res.code) {
                    res.item.price = this.AReward.gacha.price;
                    this.$refs.gachaDetails.open(
                        res,
                        data.probability,
                        "获奖概率",
                        ""
                    );
                }
            });
        },
        onShare() {
            uniShare(
                {
                    tit: "一网打尽 : " + this.AReward.gacha.themeName,
                    path: "pages/product/allCaptured",
                },
                {
                    id: this.AReward.gachaBox.gachaId,
                    index: this.AReward.gachaBox.boxIndex,
                },
                this.AReward.gacha.coverImage
            );
        },
        onClickShowOff() {
            if (this.tipsShow) this.tipsShow = false;
            if (this.onIndex) this.onIndex = false;
        },
        //跳转支付
        onSkip() {
            const { gachaId, boxIndex } = this.AReward.gachaBox;
            let num;
            let original = 0;
            let a;
            if (this.AReward.gacha.state == 2) {
                if (this.AReward.userBetCount == 0) {
                    uni.$u.toast(`每人每期限制参与${this.AReward.gacha.userBetLimit}车`);
                    return;
                } else if (this.AReward.gachaBox.leftBetNum == 0) {
                    uni.$u.toast("奖池已结束~");
                    return;
                } else if (Object.keys(this.discountObj).length) {
                    a = this.discountObj.discount / 100;
                    num = this.$h.Mul(this.unitPrice, a);
                    original = this.$h.Mul(this.unitPrice, this.numberShow);
                } else {
                    num = this.unitPrice;
                }
                let m = this.$h.Mul(num, this.numberShow);
                const result = this.truncateDecimal(m);
                this.$refs.xPay.open(
                    result, //总价
                    this.numberShow, //总数量
                    getApp().globalData.RechargeType.Gacha,
                    gachaId,
                    this.AReward.gacha.couponId,
                    boxIndex,
                    original,
                    this.discountObj.discount / 10
                );
                this.UppayMessage({
                    url: "v1/gacha/open",
                });
                return;
            }
            if (this.AReward.userBetNum) {
                if (!uni.getStorageSync(`${this.userInfo.id}`)) {
                    uni.setStorageSync(`${this.userInfo.id}`, []);
                }
                this.goto("/pages/product/modules/allRecord", {
                    id: gachaId,
                    index: boxIndex,
                    name: this.AReward.gacha.themeName,
                });

                return;
            }
            uni.reLaunch({
                url: "/pages/index/index",
            });
        },
        truncateDecimal(num, digits = 2) {
            const str = num.toString();
            const decimalIndex = str.indexOf(".");
            if (decimalIndex === -1) return num; // 如果没有小数点，直接返回
            return parseFloat(str.slice(0, decimalIndex + digits + 1));
        },
        onBet() {
            const { userBetCount, gacha, gachaBox } = this.AReward;

            if (
                this.numberShow == userBetCount &&
                gachaBox.leftBetNum > userBetCount
            ) {
                uni.$u.toast(`每人每期限制参与${gacha.userBetLimit}车`);
            }
        },
        changeValue(e) {
            const { discountMap } = this.AReward.gacha;
            if (discountMap) {
                const sortedList = [...discountMap].sort(
                    (a, b) => b.count - a.count
                );
                this.discountObj =
                    sortedList.find((item) => item.count <= e.value) || {};
            }
        },
        // 触发
        onReachScollBottom() {
            const { gachaAwards } = this.AReward;
            if (this.highGrade.length < gachaAwards.length) {
                this.highGrade = [
                    ...this.highGrade,
                    ...gachaAwards.slice(
                        this.highGrade.length,
                        this.highGrade.length + 12
                    ),
                ];
            }
        },
        getProgress() {
            this.leftt = uni.getSystemInfoSync().screenWidth;
            this.progressNum =
                (
                    this.AReward.gachaBox.leftBetNum /
                    this.AReward.gachaBox.totalBetNum
                ).toFixed(2) * 100;
            this.bubble = (this.leftt * this.progressNum) / 100;
            let a = `${uni.upx2px(236)}` / 2;
            let b = this.leftt - a;
            if (this.bubble < a) {
                this.bubble = a;
            } else if (this.bubble > b) {
                this.bubble = b;
            }
        },
    },
    watch: {
        "allInLeft.extra_data.left_bet_num": {
            handler(va) {
                if (
                    this.AReward.gachaBox.gachaId ==
                    this.allInLeft.extra_data.gacha_id &&
                    va !== "0"
                ) {
                    this.AReward.gachaBox.leftBetNum = va;
                    this.getProgress();
                }
                if (va == "0") {
                    this.loadDetail();
                }
            },
        },
    },
};
</script>
<style lang="scss" scoped>
::v-deep .u-number-box {
    z-index: 2;
}

::v-deep .u-number-box__input {
    width: 88rpx !important;
    height: 88rpx !important;
    margin: 0 124rpx !important;
    border-radius: 50%;
    border: 8rpx solid #8075fe;
    box-sizing: border-box;
}

::v-deep .uni-input-input {
    background: #311089;
    font-weight: 800;
    font-size: 40rpx;
    color: #ffc119;
}

::v-deep .u-count-down__text {
    color: #ffffff !important;
    font-size: 24rpx !important;
    height: 48RPX;
}

.loading_box {
    width: 100%;
    height: 100vh;
    background-image: url("https://img.chaoshewang.com/static/img/chaowanshang/allBg.png");
    background-size: 100% 100%;
    overflow: hidden;

    .head_con {
        width: 100%;
        height: 480rpx;
        background-size: 100% auto;
        padding-top: 90rpx;
        position: relative;
        color: #ffffff;

        .top_Back {
            width: 100%;
            font-weight: 800;
            font-size: 36rpx;
            padding: 0 32rpx;

            .Back_ico {
                width: 56rpx;
                height: 56rpx;
            }

            .title {
                margin-left: 32rpx;
            }

            .a {
                margin-left: auto;
            }
        }

        .particulars {
            position: relative;
            margin: 40rpx auto 0;
            width: 686rpx;
            height: 264rpx;
            background: #311089;
            box-shadow: inset 8rpx 8rpx 24rpx 0rpx #4a4ec3,
                inset -8rpx -8rpx 24rpx 0rpx #4a5ec3;
            border-radius: 16rpx;
            border: 4rpx solid #4724a1;

            .name {
                width: 596rpx;
                height: 80rpx;
                line-height: 80rpx;
                padding: 0 52rpx 0 200rpx;
                background-image: url("https://img.chaoshewang.com/static/img/chaowanshang/allTitle.png");
                background-size: 100% 100%;
                font-weight: bold;
                font-size: 32rpx;

                .text {
                    width: 300rpx;
                }

                .xl {
                    width: 32rpx;
                    height: 32rpx;
                    background-image: url("https://img.chaoshewang.com/static/img/chaowanshang/allSj.png");
                    background-size: 100% 100%;
                    margin-left: 8rpx;

                    &.active {
                        background-image: url("https://img.chaoshewang.com/static/img/chaowanshang/allxl.png");
                        background-size: 100% 100%;
                    }
                }
            }

            .header1 {
                position: absolute;
                left: 20rpx;
                top: 28rpx;
                width: 160rpx;
                height: 160rpx;
                border-radius: 8rpx;
                border: 4rpx solid #000000;
                background: #fff;
                box-sizing: border-box;
            }

            .box_number {
                position: absolute;
                left: 200rpx;
                top: 147rpx;
                font-weight: 500;
                font-size: 28rpx;

                .headerRight {
                    position: relative;
                    width: 32rpx;
                    height: 32rpx;
                    line-height: 32rpx;
                    text-align: center;
                    border-radius: 50%;
                    background: #ffc119;
                    color: #311089;
                    margin-left: 8rpx;
                }

                .tipsBox {
                    position: absolute;
                    left: 50%;
                    font-weight: 500;
                    font-size: 24rpx;
                    color: #181033;
                    bottom: -176rpx;
                    transform: translate(-50%);
                    width: 340rpx;
                    height: 176rpx;
                    z-index: 999;

                    .sj {
                        margin: 0 auto;
                        width: 0;
                        height: 0;
                        border-left: 8rpx solid transparent;
                        border-right: 8rpx solid transparent;
                        border-bottom: 8rpx solid #ffc119;
                    }

                    .tips {
                        width: 340rpx;
                        height: 168rpx;
                        background: #ffc119;
                        border-radius: 16rpx;
                        padding: 19rpx 24rpx;
                        text-align: left;
                    }
                }
            }

            .price {
                position: absolute;
                left: 200rpx;
                top: 90rpx;
                font-weight: bold;
                font-size: 40rpx;

                &:before {
                    content: "￥";
                    font-size: 28rpx;
                }

                &:after {
                    content: "元/车";
                    /* 添加的最后一个字 */
                    margin-left: 8rpx;
                    font-size: 28rpx;
                }
            }

            .time {
                position: absolute;
                bottom: 24rpx;
                left: 20rpx;
                font-weight: 500;
                font-size: 24rpx;
                color: #ffffff;
            }

            .frame {
                position: absolute;
                top: 68rpx;
                left: 276rpx;
                padding: 32rpx 50rpx 0;
                background: #181033;
                border-radius: 16rpx;
                z-index: 10;
                font-weight: 500;
                font-size: 28rpx;
                max-height: 1000rpx;
                overflow-y: auto;

                .frame_time {
                    margin-bottom: 32rpx;

                    &.active {
                        color: #9a2fbf;
                    }
                }
            }
        }

        .rbtn1 {
            width: 124rpx;
            height: 60rpx;
            background-image: url("https://img.chaoshewang.com/static/img/chaowanshang/allGz.png");
            background-size: 100% 100%;
            position: absolute;
            bottom: 164rpx;
            right: 0;
        }

        .rbtn3 {
            width: 172rpx;
            height: 60rpx;
            background-image: url("https://img.chaoshewang.com/static/img/chaowanshang/allJl.png");
            background-size: 100% 100%;
            position: absolute;
            bottom: 72rpx;
            right: 0;
        }
    }

    .yifanshang_con {
        width: 686rpx;
        margin: 0 auto;
        background: #dce0fe;
        border-radius: 32rpx;
        padding: 16rpx;

        .box_list {
            height: calc(100vh - 710rpx);
            // overflow-y: auto;

            .p-list {
                display: grid;
                justify-content: space-between;
                grid-template-columns: repeat(auto-fill, 208rpx);
                // overflow-y: auto;
                padding-bottom: 150rpx;

                .list-item {
                    width: 208rpx;
                    height: 288rpx;
                    background: #181133;
                    border-radius: 16rpx;
                    border: 4rpx solid #c3261b;
                    margin-bottom: 20rpx;
                    position: relative;
                    font-weight: bold;
                    font-size: 24rpx;
                    color: #ffffff;
                    overflow: hidden;

                    .p-img {
                        width: 100%;
                        height: 200rpx;
                        border-radius: 12rpx;
                    }

                    .p-num {
                        position: absolute;
                        background: rgba(0, 0, 0, 0.5);
                        padding: 2rpx 10rpx;
                        bottom: 80rpx;
                        right: 0;
                        border-radius: 6rpx 6rpx 12rpx 6rpx;
                    }

                    .p-name {
                        font-weight: bold;
                        font-size: 24rpx;
                        padding: 0 12rpx;
                    }

                    .p-probability {
                        font-weight: 500;
                        font-size: 20rpx;
                        color: #ff9960;
                        padding: 0 12rpx;

                        .number {
                            color: #fff;
                        }
                    }

                    // .number {
                    //     padding: 0 16rpx;
                    //     height: 40rpx;
                    //     text-align: center;
                    //     background: rgba(0, 0, 0, 0.5);
                    //     font-weight: bold;
                    //     font-size: 24rpx;
                    //     position: absolute;
                    //     border-bottom-left-radius: 24rpx;
                    //     top: 0;
                    //     right: 0;
                    // }
                    .ico_ {
                        position: absolute;
                        top: 152rpx;
                        left: -2rpx;
                        height: 52rpx;
                        width: 96rpx;
                    }
                }
            }
        }
    }

    .foot {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 350rpx;
        background-image: url("https://img.chaoshewang.com/static/img/chaowanshang/allFoot.png");
        background-size: 100% 100%;
        color: #ffffff;
        font-weight: bold;

        .progressBar {
            position: relative;
            width: 100%;
            height: 40rpx;
            background: linear-gradient(90deg, #421996 0%, #9c2ec2 100%);
            box-shadow: inset 0rpx 2rpx 2rpx 0rpx rgba(122, 0, 118, 0.5),
                inset 0rpx -2rpx 0rpx 0rpx rgba(255, 255, 255, 0.5);

            .end_time {
                position: absolute;
                top: -64rpx;
                left: 200rpx;
                width: 236rpx;
                height: 64rpx;
                font-size: 24rpx;
            }

            .bubble {
                position: absolute;
                top: -64rpx;
                left: 0;
                width: 236rpx;
                height: 48rpx;
                background: linear-gradient(90deg, #4527a3 0%, #9d30c2 100%);
                border-radius: 24rpx;
                border: 4rpx solid #be1bc2;
                font-weight: bold;
                font-size: 24rpx;

                .bubble_text {
                    margin-right: 5rpx;
                }

                &.tm {
                    transform: translateX(-50%);
                    -webkit-animation: load 3s;
                    animation: loadtm 3s;
                }

                @keyframes loadtm {
                    0% {
                        left: 0;
                    }
                }
            }

            .bubble::after,
            .bubble::before {
                position: absolute;
                content: "";
                pointer-events: none;
                border: solid transparent;
            }

            .bubble::after {
                border-top-color: #6f23ac;
                border-width: 16rpx 10rpx 0 10rpx;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
            }

            .bubble::before {
                border-top-color: #be1bc2;
                border-width: 22rpx 16rpx 0 16rpx;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
            }

            .progress {
                width: 0%;
                height: 40rpx;
                background: linear-gradient(-45deg,
                        #ffe759 36%,
                        #ff31c1 28%,
                        #ff31c1 67%,
                        #ffe759 25%);
                background-size: 40px 40rpx;
                -webkit-animation: load 3s;
                animation: load 3s;
                position: relative;
            }

            .masker {
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                opacity: 0.8;
                z-index: 1;
                background: linear-gradient(90deg, #ffe759 0%, #ff31c1 100%);
            }

            .masker1 {
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                opacity: 0.5;
                z-index: 3;
                background: linear-gradient(rgba(254, 255, 213, 1),
                        rgba(255, 255, 255, 0.1),
                        rgba(255, 255, 255, 0.1),
                        rgba(254, 255, 213, 1));
            }

            @keyframes load {
                0% {
                    width: 0;
                }
            }

            .number1 {
                position: absolute;
                left: 50%;
                top: 50%;
                padding: 0 16rpx;
                transform: translate(-50%, -50%);
                font-size: 24rpx;
                -webkit-text-stroke: 4px transparent;
                background-color: #cd0063;
                -webkit-background-clip: text;
                z-index: 2;
            }
        }

        .foot_btn {
            width: 462rpx;
            height: 72rpx;
            margin: 56rpx auto 40rpx;
            background: rgba(87, 38, 189, 0.5);
            padding: 0 8rpx;

            border-radius: 48rpx;

            .minus {
                width: 56rpx;
                height: 56rpx;
                background: url("https://img.chaoshewang.com/static/img/chaowanshang/allDecrease.png");
                background-size: 100% 100%;
            }

            .plus {
                width: 56rpx;
                height: 56rpx;
                background: url("https://img.chaoshewang.com/static/img/chaowanshang/allAdd.png");
                background-size: 100% 100%;
            }

            .text_boxe {
                position: absolute;
                font-size: 28rpx;

                .text1 {
                    margin-left: 96rpx;
                }

                .text {
                    margin-left: 172rpx;
                }
            }
        }

        .btn {
            margin: 0 auto;
            width: 400rpx;
            height: 88rpx;
            background: linear-gradient(90deg, #4527a3 0%, #9d30c2 100%);
            box-shadow: inset 0rpx -8rpx 16rpx 0rpx rgba(231, 178, 255, 0.5),
                inset 0rpx 8rpx 16rpx 0rpx rgba(192, 171, 255, 0.25);
            border-radius: 44rpx;
            font-size: 32rpx;
            text-align: center;
            line-height: 88rpx;
            box-sizing: border-box;
        }

        .this_time {
            margin: 48rpx auto 40rpx;

            .mvp_img {
                width: 294rpx;
                height: 80rpx;
                background: url("https://img.chaoshewang.com/static/img/chaowanshang/MVP.png");
                background-size: 100% 100%;
            }

            .mvp_head {
                margin: 0 16rpx;
                width: 64rpx;
                height: 64rpx;
                border-radius: 50%;
                border: 2rpx solid #ffffff;
            }

            .mvp_name {
                font-weight: 800;
                font-size: 40rpx;
                background: -webkit-linear-gradient(#ffeda9, #ffbf3f);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }

        .discount {
            position: absolute;
            right: 0;
            top: 56rpx;
            width: 150rpx;
            height: 48rpx;
            background: #ffc119;
            font-weight: bold;
            font-size: 24rpx;
            color: #181033;
            padding: 0 4rpx 0 14rpx;
            border-radius: 24rpx 0 0 24rpx;

            .discount_text {
                height: 32rpx;
                line-height: 32rpx;
            }

            .discount_icon {
                width: 32rpx;
                height: 32rpx;
                line-height: 32rpx;
                text-align: center;
                background: #181033;
                color: #ffc119;
                border-radius: 50%;
                margin-left: auto;
            }

            .explain {
                position: absolute;
                z-index: 99;
                right: 0rpx;
                bottom: 80rpx;
                width: 384rpx;
                // height: 198rpx;
                font-weight: 500;
                font-size: 24rpx;
                color: #fff;
                background: #181033;
                border-radius: 20rpx;
                padding: 20rpx 0;
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                .explain_item {
                    text-align: center;
                    margin: 10rpx 0;

                    .explain_num::before {
                        content: attr(data-number);
                        color: red;
                    }

                    .explain_num2::before {
                        content: attr(data-discount);
                        color: red;
                    }
                }
            }
        }

        .Rectangle {
            position: absolute;
            left: 352rpx;
            z-index: 99;
            top: 44rpx;
            width: 128rpx;
            height: 60rpx;
            background-image: url("https://img.chaoshewang.com/static/img/chaowanshang/Rectangle.png");
            background-size: 100% 100%;
            font-weight: bold;
            font-size: 32rpx;
            text-align: center;

            &::after {
                content: "折";
                font-size: 24rpx;
                margin-left: 8rpx;
            }
        }
    }
}
</style>