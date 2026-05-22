<template>
    <div class="loading_box">
        <view class="yifanshang">
            <view class="head_con" :style="{ backgroundImage: `url(${AReward.gacha.coverImage})` }">
                <view class="top_Back flex_r flex_js flex_ac" :style="{
                    top: MBInfo().top + 'px',
                    height: MBInfo().height + 'px',
                }">
                    <img src="https://img.shinemang.com/gachaStatic/static/img/product/yfs_back.png" @click.stop="gateBack"
                        class="Back_ico" />
                    <text class="title">{{ AReward.gacha.themeName }}</text>
                </view>
                <view class="rbtn1" @click="goto('/pages/common/rulepop', { val: 'KujiRules' })">规则</view>
                <img class="yfs_top_bg" src="https://img.shinemang.com/gachaStatic/static/img/product/yfs_top_bg2.png" />
                <button open-type="share" class="rbtn2 rbtns" @click="onShare"></button>
                <view class="rbtn3 rbtns flex_r flex_jc flex_ac" @click="onFlushed">刷新</view>
                <div class="box_price">
                    ￥<span>{{ (AReward.gacha.discountPrice > 0 && AReward.gacha.discountPrice)
                        || AReward.gacha.price }}</span>元
                </div>
                <view class="multiple nb" v-if="AReward.gacha.costAwardMultiple > 1">
                    <view class="number">{{ AReward.gacha.costAwardMultiple }}</view>
                </view>
            </view>
            <div class="yifanshang_con">
                <view class="top_txt" v-if="AReward.gacha.discount > 0">限时{{ AReward.gacha.discount / 10 }}折优惠￥{{
                    AReward.gacha.discountPrice
                }}/发</view>
                <view class="head_in flex_r flex_jb flex_ac">
                    <view class="l_btn flex_c flex_ac flex_wrap" @click="ondrawLog">
                        <img src="https://img.shinemang.com/gachaStatic/static/img/product/yfs_btn-3.png" class="ico1" />
                        <view class="txt1">中赏记录</view>
                    </view>
                    <view class="c_btn" v-if="AReward.gachaBox">
                        <view class="p">第<span class="cory">{{
                            AReward.gachaBox.boxIndex
                                }}</span>/{{ AReward.gacha.totalBox }}箱 赏品余量<span class="cory">{{
                                    AReward.gachaBox.leftAwards }}</span>/{{ AReward.gachaBox.totalAwards }}
                        </view>
                        <view class="p">箱号:{{ AReward.gachaBox.boxOutNo }}</view>
                    </view>
                    <view class="r_btn flex_c flex_ac flex_wrap" @click="selectBoxOpen">
                        <img src="https://img.shinemang.com/gachaStatic/static/img/product/yfs_btn-4.png" class="ico1" />
                        <view class="txt1">换个箱子</view>
                    </view>
                </view>
                <view class="box_list" v-if="!allSoldOut">
                    <view class="row2 flex_r flex_jb flex_wrap">
                        <view class="row2_item" v-for="(item, index) in highGrade" :key="item.id">
                            <view class="p1 flex_r flex_jb flex_ac">
                                <view class="p_l" @click="ondetail(item, index)">
                                    <img :src="item.itemHalfImage" class="itemCover" />
                                    <img :src="`https://img.shinemang.com/gachaStatic/static/img/reward/${item.levelName}.png`"
                                        class="ico2" />
                                </view>
                                <view class="p_r flex_r flex_wrap">
                                    <div class="item_box" v-for="(i, s) in item.soldOut" :key="s"
                                        :style="{ zIndex: 101 + s }">
                                        <view class="card_item flex_r flex_ac flex_js bc">
                                            <div class="ico_box flex_r flex_ae flex_js">
                                                <img :src="`https://img.shinemang.com/gachaStatic/static/img/reward/${item.levelName}_.png`"
                                                    class="ico3" />
                                            </div>
                                            <div class="itemName ellipsis2">
                                                {{ item.itemName }}
                                            </div>
                                        </view>
                                    </div>
                                    <div class="item_box" v-for="(i, s) in item.leftNums" :key="s"
                                        :style="{ zIndex: 100 - s }">
                                        <view class="card_item flex_c flex_ac flex_jc">
                                            <span>第</span><span>{{ s + 1 }}</span><span>张</span>
                                        </view>
                                    </div>
                                </view>
                            </view>
                            <view class="p2">
                                <view class="ellipsis l_name">{{
                                    item.itemName
                                    }}</view>
                                <view class="flex_r flex_ac flex_jb">
                                    <span class="gailu">中奖概率约为{{
                                        item.probability
                                    }}%</span>
                                    <!-- <span class="gailu">中奖概率约为{{ ($h.Div(item.leftNums,AReward.gachaBox.leftAwards) * 100).toFixed(2) }}%</span> -->
                                    <span>共{{ item.totalNums }}个，剩{{
                                        item.leftNums
                                    }}个</span>
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="row1">
                        <view class="row1_item flex_r flex_js flex_ac" v-for="(item, index) in rewardList"
                            :key="item.id">
                            <view class="row1_item_l">
                                <view class="p1" @click="
                                    ondetail(item, index + highGrade.length)
                                    ">
                                    <img :src="item.itemHalfImage" class="itemCover" />
                                    <img :src="`https://img.shinemang.com/gachaStatic/static/img/reward/${item.levelName}.png`"
                                        class="ico2" :class="{
                                            LastIco: item.levelName == 'Last',
                                        }" />
                                </view>
                                <view class="p2">
                                    <view class="ellipsis l_name">{{
                                        item.itemName
                                        }}</view>
                                    <view>共{{ item.totalNums }}个，剩{{
                                        item.leftNums
                                    }}个</view>
                                    <view class="gailu" v-if="
                                        [27, 42].includes(item.levelIndex)
                                    ">非卖品</view>
                                    <view class="gailu" v-else>中奖概率{{ item.probability }}%</view>
                                    <!-- <view class="gailu" v-else>中奖概率{{ ($h.Div(item.leftNums,AReward.gachaBox.leftAwards - 1) * 100).toFixed(2) }}%</view> -->
                                </view>
                            </view>
                            <view class="row1_item_r">
                                <view class="card_box flex_r flex_wrap">
                                    <view class="item_box" :class="{ ncx: item.levelIndex == 27 }"
                                        v-for="(i, s) in item.soldOut" :key="s" :style="{ zIndex: 101 + s }">
                                        <view class="card_item flex_r flex_ac flex_js bc" :class="{
                                            nc: item.levelIndex == 27,
                                        }">
                                            <div class="ico_box flex_r flex_ae flex_js">
                                                <img :src="`https://img.shinemang.com/gachaStatic/static/img/reward/${item.levelName}_.png`"
                                                    class="ico3" :class="{
                                                        LastIco:
                                                            item.levelName ==
                                                            'Last',
                                                    }" />
                                            </div>
                                            <div class="itemName ellipsis2">
                                                {{ item.itemName }}
                                            </div>
                                        </view>
                                    </view>
                                    <div class="item_box" :class="{ ncx: item.levelIndex == 27 }"
                                        v-for="(i, s) in item.leftNums" :key="s" :style="{ zIndex: 99 - s }">
                                        <view class="card_item flex_c flex_ac flex_jc" :class="{
                                            nc: item.levelIndex == 27,
                                        }">
                                            <span>第</span><span>{{ s + 1 }}</span><span>张</span>
                                        </view>
                                    </div>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </div>
            <div class="i_notice flex_r flex_ac">
                <img src="https://img.shinemang.com/gachaStatic/static/img/market/ico6.png" class="m_ico" />
                <u-notice-bar text="平台发货不设门槛!潮柜内提交发货申请后7个工作日安排发货。每单满5件包邮，不满5件需支付10元运费。" :fontSize="12" color="#000"
                    bgColor="rgba(0,0,0,0)"></u-notice-bar>
            </div>

            <view v-if="showBtn" @click="onpay(AReward.gacha.specialDiscountLimitBetNum, 1)" class="special_btn flex_c"
                :style="{
                    color: '#FFF',
                    backgroundImage:
                        'url(https://img.shinemang.com/gachaStatic/static/img/chaowanshang/special_yfsBtn.png)',
                    height: '102rpx',
                }">
                <view>立即抽赏</view>
                <view class="number">￥{{
                    $h.Mul(
                        AReward.gacha.specialDiscountLimitBetNum - 1,
                        AReward.gacha.discountPrice
                            ? AReward.gacha.discountPrice
                            : AReward.gacha.price
                    ) + AReward.gacha.specialDiscountPrice
                }}<span class="num">￥{{
                        $h.Mul(
                            AReward.gacha.specialDiscountLimitBetNum,
                            AReward.gacha.discountPrice
                                ? AReward.gacha.discountPrice
                                : AReward.gacha.price
                        )
                    }}
                    </span></view>
                <view class="hubble-bubble" style="right: 0rpx">首抽￥{{ AReward.gacha.specialDiscountPrice }}（{{
                    numberToChinese(
                        AReward.gacha.specialDiscountLimitBetNum
                    )
                }}抽起）</view>
            </view>
            <view v-else-if="AReward.userBetCount == -1 && AReward.userBetCountDaily == -1"
                class="footbtn flex_r flex_jb flex_ae">
                <view class="btn_item btn_item1" @click="onpay(1)"></view>
                <view class="btn_item btn_item3" @click="onpay(3)"></view>
                <view class="btn_item btn_item4" @click="onpay(5)"></view>
                <view class="btn_item2" @click="onpay(AReward.gachaBox.leftAwards)">
                </view>
            </view>
            <view v-else @click="
                AReward.userBetCount == 0 || AReward.userBetCountDaily == 0
                    ? (showDiscounts = true)
                    : onpay(1, 2)
                " class="special_btn flex_c" :style="{
                    color: '#FFF',
                    backgroundImage:
                        'url(https://img.shinemang.com/gachaStatic/static/img/chaowanshang/special_yfsBtn.png)',
                    height: '102rpx',
                }" :class="{
                    forbid_bg:
                        AReward.userBetCount == 0 ||
                        AReward.userBetCountDaily == 0,
                }">
                <view>立即抽赏</view>
            </view>
            <!-- 选箱 -->
            <u-popup :show="selectBoxShow" :safeAreaInsetBottom="false" bgColor="transparent">
                <view class="select_box_module">
                    <div class="title">
                        <img src="https://img.shinemang.com/gachaStatic/static/img/product/yfs_back.png"
                            @click="selectBoxShow = false" class="Back_ico" />
                        <span>选取箱子</span>
                    </div>
                    <scroll-view scroll-x="true">
                        <div class="tabs">
                            <div class="tab_item" @click="onBoxIndex(0)" :class="{ active: level_index == 0 }">
                                全部
                            </div>
                            <template v-for="(i, s) in BoxAwards">
                                <div class="tab_item" @click="onBoxIndex(i.levelIndex)" :class="{
                                    active: i.levelIndex == level_index,
                                }" v-if="![27].includes(i.levelIndex)" :key="s">
                                    {{ i.levelIndex | levelNum }}赏
                                </div>
                            </template>
                        </div>
                        <div class="box_list" style="margin-top: 10rpx">
                            <div class="boxs">
                                <div class="box_item" @click="
                                    onClickChangeBox(item.boxIndex, index)
                                    " v-for="(item, index) in boxs" :key="item.boxOutNo">
                                    <img src="https://img.shinemang.com/gachaStatic/static/img/product/box.png"
                                        v-if="item.leftAwards > 0" class="box" :class="{ active: index == active2 }" />
                                    <img src="https://img.shinemang.com/gachaStatic/static/img/product/unbox.png" v-else
                                        class="box" :class="{ active: index == active2 }" />
                                    <div class="box_num">
                                        #{{ item.boxIndex }}
                                    </div>
                                    <div class="box_num2">
                                        {{ item.leftAwards }}/{{
                                            item.totalAwards
                                        }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </scroll-view>
                </view>
            </u-popup>
            <!-- 欧气值兑换 -->
            <!-- #ifdef MP-WEIXIN -->
            <luckEntrance :topNum='700' />
            <!-- #endif -->
            <!-- #ifndef MP-WEIXIN -->
            <movable-area class="movable-draw">
                <movable-view class="movable-view" direction="all" :style="`left: ${leftt}; top: ${topp};`">
                    <luckEntrance />
                </movable-view>
            </movable-area>
            <!-- #endif -->
            <!-- 赏品详情 -->
            <gachaDetails ref="gachaDetails" />
            <!-- 支付 一番赏1-->
            <x-pay @success="onClickDraw" ref="xPay" mtype="1" :probabilityShow="probabilityShow" />
            <!-- 中赏记录 -->
            <draw-log ref="drawLog" drawType="1" />
            <!-- 预加载动画背景图（过大） -->
            <div class="subscribeLoad" v-show="false">
                <img src="https://img.shinemang.com/gachaStatic/static/img/cs-result/yfs_bg.png" />
            </div>
            <discounts :visible="showDiscounts" @onDiscounts="onDiscounts" :themeName="AReward.gacha.themeName"
                :message="AReward.openMessage" />
        </view>
    </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { post } from "@/utils/api.js";
import xPay from "@/components/x-pay/index.vue";
import drawLog from "@/pages/product/modules/drawLog.vue";
import { playDede, uniShare, groupBySum } from "@/utils/fun.js";
import luckEntrance from "@/components/modules/luckEntrance.vue";
import { Postpayment } from "@/utils/pay.js";
import discounts from "@/components/modules/x-discounts.vue";
let that;
export default {
    data() {
        return {
            loading: true,
            AReward: {
                gacha: { themeName: "" },
                gachaBox: {},
                gachaAwards: [],
                gachaBoxAwards: [],
                openMessage: "",
            },
            rewardList: [], // 普通赏品
            highGrade: [], // 大赏，需要两列放大排放的
            gachaId: 0,
            selectBoxShow: false,
            boxsTitle: ["全部"],
            level_index: 0,
            active: "全部",
            active2: "",
            BoxAwards: [], //本赏池所有等级。去重后的
            boxs: [],
            boxIndex: 0,
            allSoldOut: false,
            couponId: 0,
            coverImage: "",
            ProbabilityList: [],
            pay: false,
            showBtn: false,
            showDiscounts: false,
            topp: "850rpx",
            leftt: "",
            probabilityShow: [],
            theme_id: ''
        };
    },
    components: {
        xPay,
        drawLog,
        luckEntrance,
        discounts,
    },
    computed: { ...mapState(["userInfo"]) },
    onLoad(da) {
        if (da.gacha_id || da.id) this.gachaId = da.gacha_id || da.id;
        else this.theme_id = da.theme_id
        if (da.index) this.boxIndex = da.index;
    },
    onShow() {
        this.leftt = uni.getSystemInfoSync().screenWidth + "px";
        this.loadDetail();
    },
    created() {
        that = this;
    },
    methods: {
        ...mapMutations(["UppayMessage"]),
        onFlushed() {
            uni.showLoading({
                title: "正在加载中...",
                mask: true,
            });
            this.loadDetail();
            setTimeout(function () {
                uni.hideLoading();
            }, 1200);
        },
        loadDetail() {
            this.loading = true;
            let total = 0;
            let obj = {}
            if (this.theme_id !== '') obj = { theme_id: this.theme_id }
            else obj = { gacha_id: this.gachaId, box_index: this.boxIndex, }
            post("v1/gacha/detail",obj).then((res) => {
                this.AReward = res;
                this.showBtn = this.canShowGachaButton(res);
                this.couponId = res.gacha.couponId;
                this.rewardList = [];
                this.gachaId = res.gacha.id;
                this.highGrade = [];
                this.ProbabilityList = [];
                this.coverImage = res.gacha.coverImage;
                let isTwo = true;
                let result = [];
                let it = 0;
                let itArr = 0;
                let arr = res.gachaBoxAwards.filter((item, index) => {
                    if ([27, 42].includes(item.levelIndex)) {
                        result.push(
                            Object.assign({}, res.gachaAwards[index], item)
                        );
                    }
                    return item.levelIndex !== 27 && item.levelIndex !== 42;
                });
                for (const i in arr) {
                    if (arr[i].totalNums) {
                        let obj = Object.assign({}, res.gachaAwards[i], arr[i]);
                        obj.soldOut = obj.totalNums - obj.leftNums;
                        let a =
                            obj.leftNums && this.AReward.gachaBox.leftAwards
                                ? (
                                    this.$h.Div(
                                        obj.leftNums,
                                        this.AReward.gachaBox.leftAwards
                                    ) * 100
                                ).toFixed(2)
                                : "0.00";
                        if (obj.leftNums && this.AReward.gachaBox.leftAwards) {
                            if (a !== "0.00") {
                                it = obj.itemId;
                            }
                            total += Number(a);
                        }
                        if (i == arr.length - 1) {
                            itArr = (100 - total).toFixed(2);
                        }
                        if (
                            i < 4 &&
                            obj.totalNums <= 3 &&
                            obj.levelType != 2 &&
                            isTwo
                        ) {
                            this.highGrade.push({ ...obj, probability: a });
                        } else {
                            this.rewardList.push({ ...obj, probability: a });
                            if (i < 4) isTwo = false;
                        }

                        this.ProbabilityList.push(a);
                    }
                }
                this.rewardList = this.rewardList.concat(result);
                this.rewardList.map((i) =>
                    i.itemId == it
                        ? (i.probability = (
                            Number(i.probability) + Number(itArr)
                        ).toFixed(2))
                        : i.probability
                );
                this.highGrade.map((i) =>
                    i.itemId == it
                        ? (i.probability = (
                            Number(i.probability) + Number(itArr)
                        ).toFixed(2))
                        : i.probability
                );
                this.boxIndex = res.gachaBox?.boxIndex;
                if (res.gachaAwards.length == 0) {
                    uni.$u.toast("已售完");
                    this.allSoldOut = true;
                }
                this.quchong();
                this.loading = false;
                // #ifdef APP
                if (
                    getApp().globalData.AppTypeList[plus.runtime.channel] == 2
                ) {
                    this.probabilityShow = groupBySum([
                        ...this.highGrade,
                        ...this.rewardList,
                    ]);
                }
                // #endif
            });
        },
        onDiscounts() {
            this.showDiscounts = false;
        },
        onClickChangeBox(boxindex, index) {
            this.active2 = index;
            this.boxIndex = boxindex;
            this.loadDetail();
            this.selectBoxShow = false;
        },
        onpay(num, special = 0) {
            let res = Postpayment(this.AReward, num, special);
            if (res && res.m > 0) {
                this.$refs.xPay.open(
                    res.m,
                    res.number,
                    getApp().globalData.RechargeType.Gacha,
                    this.gachaId,
                    this.couponId,
                    this.AReward.gachaBox.boxIndex,
                    0,
                    this.AReward.gacha.discount,
                    this.AReward.gacha.themeId
                );
                this.UppayMessage({
                    url: "v1/gacha/open",
                    discount: res.discount,
                });
            }
        },
        onClickDraw(res, showAnim, type) {
            if (type == 0) {
                this.onClickPay(res.awards, showAnim);
                return;
            } else {
                this.onClickPrize(res.res.createPaymentReply.payId, showAnim);
            }
        },
        onClickPrize(payId, showAnim) {
            post("v1/gacha/open/result", { pay_id: payId }).then((res) => {
                if (!res.code) {
                    this.onClickPay(res.awards, showAnim);
                } else uni.$u.toast(res.message);
            });
        },
        onClickPay(awards, showAnim) {
            this.loadDetail();
            this.$sl("extractAwards", {
                da: awards,
                path: "pages/product/yifanshang",
                id: this.gachaId,
                index: this.boxIndex,
            });
            let a = this.verdictBig(showAnim ? awards : [awards[0]]) ? 2 : 1;
            if (showAnim) {
                playDede(a);
                uni.$u.route({
                    type: "redirect",
                    url: "/pages/product/rewardResultDetails",
                });
            } else
                uni.$u.route({
                    type: "redirect",
                    url: "/pages/product/rewardResult",
                    params: { a },
                });
        },
        selectBoxOpen() {
            post("v1/gacha/box/list", {
                gacha_id: this.gachaId,
                level_index: this.level_index,
                order_by_box_index: 0,
                order_by_award_left: 0,
                page: 1,
                page_size: 999,
            }).then((res) => {
                this.boxs = res.boxes;
                this.selectBoxShow = true;
            });
        },
        quchong() {
            let arr1 = [],
                arr2 = [];
            for (const i of this.AReward.gachaBoxAwards) {
                if (i.levelIndex) {
                    if (!arr1.includes(i.levelIndex)) {
                        arr1.push(i.levelIndex);
                        arr2.push(i);
                    }
                }
            }
            this.BoxAwards = arr2;
        },
        onBoxIndex(va) {
            this.level_index = va;
            this.selectBoxOpen();
        },
        ondetail(data, index) {
            let probability = 0;
            if (data.levelIndex != 27) {
                probability = this.ProbabilityList[index];
            }
            post("v1/goods/item/get", {
                item_id: data.itemId,
            }).then((res) => {
                res.item.price = this.AReward.gacha.price;
                this.$refs.gachaDetails.open(res, probability, "获奖概率");
            });
        },
        ondrawLog() {
            this.$refs.drawLog.open(this.gachaId, this.boxIndex);
        },
        onShare() {
            uniShare(
                {
                    tit: "一番赏 : " + this.AReward.gacha.themeName,
                    path: "pages/product/yifanshang",
                },
                { id: this.gachaId, index: this.boxIndex },
                this.coverImage
            );
        },
        verdictBig(arr) {
            let result = [1, 2, 3, 27];
            for (const i of arr) {
                if (result.includes(i.levelIndex)) return true;
            }
            return false;
        },
    },
};
</script>
<style lang="scss" scoped>
.loading_box {
    height: 100vh;
    background-color: #1c1d1f;
}

.yifanshang {
    background-color: #1c1d1f;
    background-image: url("https://img.shinemang.com/gachaStatic/static/img/product/yfs_bg.png");
    background-size: 100% 100%;
    height: 100vh;
}

.nb {
    top: 340rpx;
    left: 140rpx;
}

.head_con {
    width: 100%;
    height: 460rpx;
    background-size: 100% auto;
    position: relative;

    .yfs_top_bg {
        width: 100%;
        height: 210rpx;
        position: absolute;
        left: 0;
        bottom: -120rpx;
    }

    .rbtn1 {
        width: 88rpx;
        height: 62rpx;
        line-height: 56rpx;
        color: #fff;
        font-size: 28rpx;
        text-align: right;
        padding-right: 10rpx;
        background: url("https://img.shinemang.com/gachaStatic/static/img/product/yfs_btn-1.png");
        background-size: 100% 100%;
        position: absolute;
        bottom: 180rpx;
        right: 0;
    }

    .rbtns {
        width: 160rpx;
        height: 90rpx;
        position: absolute;
        bottom: 26rpx;
        color: #fff;
        font-weight: 600;
    }

    .rbtn2 {
        width: 144rpx;
        height: 92rpx;
        background: url("https://img.shinemang.com/gachaStatic/static/img/product/yfs_share.png");
        background-size: 100% 100%;
        left: 0;

        &::after {
            border: none;
        }
    }

    .rbtn3 {
        background: url("https://img.shinemang.com/gachaStatic/static/img/product/yfs_btn-2.png");
        background-size: 100% 100%;
        right: 0;
    }

    .box_price {
        width: 208rpx;
        height: 160rpx;
        text-align: center;
        line-height: 168rpx;
        background: url("https://img.shinemang.com/gachaStatic/static/img/product/yfs_price.png");
        background-size: 100% 100%;
        padding-right: 18rpx;
        font-size: 20rpx;
        font-weight: 800;
        position: absolute;
        bottom: 102rpx;
        left: 0;

        span {
            font-size: 36rpx;
        }
    }
}

.yifanshang_con {
    position: relative;
}

.top_Back {
    color: #fff;
    font-size: 36rpx;
    position: absolute;
    position: absolute;
    left: 36rpx;
    top: 105rpx;

    .Back_ico {
        width: 50rpx;
        height: 50rpx;
        margin-right: 50rpx;
    }
}

.top_txt {
    padding: 0 32rpx;
    font-size: 24rpx;
    color: #ffea2a;
}

.head_in {
    padding: 28rpx 32rpx;

    .ico1 {
        width: 128rpx;
        height: 60rpx;
    }

    .txt1 {
        font-size: 24rpx;
        color: #fff;
        margin-top: -6rpx;
    }

    .c_btn {
        width: 320rpx;
        height: 100rpx;
        background: url("https://img.shinemang.com/gachaStatic/static/img/product/yfs_number.png");
        background-size: 100% 100%;
        text-align: center;
        line-height: 24rpx;
        font-size: 22rpx;
        color: #fff;
        padding: 25rpx 0;

        .cory {
            color: #fff95a;
            font-weight: 500;
        }
    }
}

.box_list {
    height: calc(100vh - 710rpx);
    overflow-y: auto;
}

.row2 {
    padding: 0 32rpx;
}

.row2_item {
    width: calc(50% - 15rpx);
    margin-bottom: 60rpx;
    color: #fff;

    .p_l {
        width: 106rpx;
        height: 126rpx;
        position: relative;

        .ico2 {
            width: 79rpx;
            height: 49rpx;
            position: absolute;
            bottom: 0;
            left: 0;
        }

        .itemCover {
            width: 130rpx;
            height: 130rpx;
            position: absolute;
            bottom: 0;
            left: 0;
        }
    }

    .p2 {
        border-top: 1rpx solid #ffea2a;
        margin-top: 6rpx;
        padding: 2rpx 2rpx 0;
        font-size: 20rpx;

        .l_name {
            font-weight: 800;
            font-size: 24rpx;
        }

        .gailu {
            color: #a4a4a4;
        }
    }

    .p_r {
        height: 108rpx;
        width: calc(100% - 106rpx);
        vertical-align: middle;
    }
}

.item_box {
    width: 136rpx;
    height: 108rpx;
    display: inline-block;
    position: relative;
    margin-left: -98rpx;

    &:first-child {
        margin-left: 0;
    }
}

.card_item {
    width: 136rpx;
    height: 108rpx;
    color: #333;
    font-size: 16rpx;
    padding-left: 85rpx;
    line-height: 22rpx;
    background: url("https://img.shinemang.com/gachaStatic/static/img/product/yfs_tag-1.png");
    background-size: 100% 100%;

    &.bc {
        padding: 0;
        color: #fff;
        padding-left: 8rpx;
        background: url("https://img.shinemang.com/gachaStatic/static/img/product/yfs_tag-2.png");
        background-size: 100% 100%;

        .ico3 {
            width: 50rpx;
            height: 26rpx;
        }

        .itemName {
            width: calc(100% - 44rpx);
            padding-left: 6rpx;
            font-size: 14rpx;
        }
    }
}

.row1 {
    padding: 0 32rpx 120rpx;

    .card_item {
        width: 97rpx;
        height: 76rpx;
        padding-left: 52rpx;
        font-size: 15rpx;
        line-height: 18rpx;

        &.bc {
            padding: 0;
            padding-left: 8rpx;

            .ico3 {
                width: 38rpx;
                height: 18rpx;

                &.LastIco {
                    width: 67rpx;
                }
            }

            .itemName {
                width: calc(100% - 44rpx);
                padding-left: 6rpx;
                font-size: 12rpx;
            }
        }

        &.nc {
            width: 136rpx;
            height: 108rpx;
            font-size: 16rpx;
            line-height: 22rpx;

            .ico3 {
                width: 67rpx;
                height: 26rpx;
            }

            .itemName {
                width: calc(100% - 44rpx);
                padding-left: 6rpx;
                font-size: 14rpx;
            }
        }
    }

    .item_box {
        margin-left: -64rpx;
        width: 97rpx;
        height: 76rpx;

        &.ncx {
            width: 136rpx;
            height: 108rpx;
        }
    }
}

.row1_item {
    margin-bottom: 60rpx;
    color: #fff;

    .row1_item_l {
        width: 176rpx;
    }

    .row1_item_r {
        width: calc(100% - 190rpx);
        margin-left: 20rpx;

        .card_box {
            width: calc(100% - 70rpx);
            margin-left: 70rpx;
        }
    }

    .p1 {
        position: relative;
        min-height: 90rpx;

        .ico2 {
            width: 79rpx;
            height: 49rpx;
            position: absolute;
            bottom: 0;
            left: 0;

            &.LastIco {
                width: 132rpx;
            }
        }

        .itemCover {
            width: 130rpx;
            height: 130rpx;
            position: absolute;
            bottom: 0;
            left: 0;
        }
    }

    .p2 {
        border-top: 1rpx solid #ffea2a;
        margin-top: 6rpx;
        padding: 2rpx 2rpx 0;
        font-size: 20rpx;

        .l_name {
            font-weight: 800;
            font-size: 24rpx;
        }

        .gailu {
            color: #a4a4a4;
        }
    }
}

.footbtn {
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1000;
    height: 160rpx;
    background: url("https://img.shinemang.com/gachaStatic/static/img/product/yfs_tab_bg.png") no-repeat;
    background-size: 100% auto;
    background-color: rgb(34, 34, 36);
    text-align: center;
    color: #fff;

    .btn_item {
        width: 174rpx;
        height: 80rpx;
        margin-bottom: 42rpx;
        margin-right: -60rpx;
    }

    .btn_item1 {
        background-image: url("https://img.shinemang.com/gachaStatic/static/img/product/yfs_btn-5.png");
        background-size: 100% 100%;
    }

    .btn_item3 {
        background-image: url("https://img.shinemang.com/gachaStatic/static/img/product/yfs_btn-7.png");
        background-size: 100% 100%;
    }

    .btn_item4 {
        background-image: url("https://img.shinemang.com/gachaStatic/static/img/product/yfs_btn-8.png");
        background-size: 100% 100%;
    }

    .btn_item2 {
        background-image: url("https://img.shinemang.com/gachaStatic/static/img/product/yfs_btn-6.png");
        background-size: 100% 100%;
        width: 276rpx;
        height: 110rpx;
        margin-bottom: 36rpx;
    }
}

.select_box_module {
    height: 1060rpx;
    overflow: hidden;
    padding: 0 36rpx;
    border-radius: 60rpx 60rpx 0 0;
    background-image: url("https://img.shinemang.com/gachaStatic/static/img/product/p_bg.png");
    background-size: 100% 100%;

    .title {
        font-weight: bold;
        font-size: 32rpx;
        color: #fff;
        padding: 30rpx 0;
        position: relative;
        text-align: center;

        .Back_ico {
            width: 35rpx;
            height: 40rpx;
            position: absolute;
            left: 0;
            top: 30rpx;
        }
    }

    .tabs {
        white-space: nowrap;
        overflow-y: auto;

        .tab_item {
            display: inline-block;
            background-color: #a53d21;
            color: #dbcbc6;
            font-size: 24rpx;
            font-weight: bold;
            width: 133rpx;
            height: 46rpx;
            line-height: 46rpx;
            text-align: center;
            border-radius: 4rpx;
            margin-right: 18rpx;

            &:last-child {
                margin-right: 0;
            }

            &.active {
                background-image: url("https://img.shinemang.com/gachaStatic/static/img/product/tab_bg.png");
                background-size: 100% 100%;
                color: #fff;
            }
        }
    }

    .box_list {
        padding: 36rpx 0;
        height: 880rpx;
    }

    .boxs {
        @include grid(156rpx);

        .box_item {
            width: 156rpx;
            height: 160rpx;
            position: relative;

            .box {
                width: 156rpx;
                height: 128rpx;

                &.active {
                    background-image: url("https://img.shinemang.com/gachaStatic/static/img/product/border.png");
                    background-size: 100% 100%;
                    // animation: breathingLight 3s infinite;
                }

                @keyframes breathingLight {
                    0% {
                        opacity: 1;
                    }

                    /* 初始状态为完全不透明 */
                    50% {
                        opacity: 0.1;
                    }

                    /* 中间状态为部分透明度 */
                    100% {
                        opacity: 1;
                    }

                    /* 结束状态为完全不透明 */
                }
            }

            .box_num {
                font-weight: bold;
                font-size: 17rpx;
                color: #2d123d;
                width: 44rpx;
                text-align: center;
                height: 26rpx;
                line-height: 26rpx;
                position: absolute;
                right: 16rpx;
                top: 24rpx;
            }

            .box_num2 {
                font-size: 24rpx;
                font-weight: bold;
                color: #0e0e0e;
                text-align: center;
                position: relative;
                top: -20rpx;
            }
        }
    }
}

.i_notice {
    width: 708rpx;
    height: 61rpx;
    background: #f6c04c;
    border-radius: 20rpx;
    border: 6rpx solid #ffffff;
    transform: translateX(-50%);
    position: absolute;
    bottom: 170rpx;
    left: 50%;
    z-index: 500;
    padding: 0 30rpx;

    .m_ico {
        width: 34rpx;
        height: 34rpx;
    }
}
</style>