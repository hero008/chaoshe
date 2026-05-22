<template>
    <div class="loading_box">
        <view class="chaosheshang">
            <view class="head_con">
                <view class="top_Back flex_r flex_js flex_ac" :style="{
                    top: MBInfo().top + 'px',
                    height: MBInfo().height + 'px',
                }">
                    <img src="https://img.shinemang.com/gachaStatic/static/img/chaowanshang/chaosheshang_tc.png"
                        @click.stop="gateBack" class="Back_ico" />
                    <text class="title ellipsis">{{
                        AReward.gacha.themeName
                    }}</text>
                    <!-- #ifndef MP-WEIXIN -->
                    <img src="https://img.shinemang.com/gachaStatic/static/img/chaowanshang/chaosheshang_fx.png" @click="onShare"
                        class="Back_ico a" />
                    <!-- #endif -->
                </view>
                <div class="i_notice flex_r flex_ac">
                    <view class="r_ico flex_r flex_ac">
                        <img class="ico" src="https://img.chaoshewang.com/matt/static/img/chaowanshang/yfs_ts.png" />
                        <span>发货提示</span>
                    </view>
                    <u-notice-bar text="平台发货不设门槛!潮柜内提交发货申请后3-5个工作日安排发货。每单满5件包邮，不满5件需支付10元运费。" :fontSize="12"
                        color="#fff" bgColor="rgba(0,0,0,0)"></u-notice-bar>
                </div>
                <div class="particulars">
                    <view class="name ellipsis">{{
                        AReward.gacha.themeName
                    }}</view>
                    <img class="header1" :src="AReward.gacha.coverImage" />
                    <view class="box_number">箱号:{{ AReward.gachaBox.boxOutNo }}</view>
                    <view class="price ellipsis">{{ (AReward.gacha.discountPrice > 0 && AReward.gacha.discountPrice)
                        || AReward.gacha.price }}</view>
                    <view class="multiple nb" v-if="AReward.gacha.costAwardMultiple > 1">
                        <view class="number">{{ AReward.gacha.costAwardMultiple }}</view>
                    </view>
                </div>
                <view class="rbtn1" @click="
                    goto('/pages/common/rulepop', { val: 'ChaoSheRules' })
                    "></view>
                <view class="rbtn3" @click="onFlushed"></view>
            </view>
            <div class="chaosheshang_con">
                <view class="top_txt" v-show="AReward.gacha.discount > 0">限时{{ AReward.gacha.discount / 10 }}折优惠￥{{
                    AReward.gacha.discountPrice }}/发</view>
                <view class="head_in flex_r flex_jb flex_ac">
                    <view class="l_btn" @click="ondrawLog"> </view>
                    <view class="c_btn" v-show="AReward.gachaBox">
                        第<span class="cory">{{
                            AReward.gachaBox.boxIndex
                        }}</span>/{{ AReward.gacha.totalBox }}箱 赏品余量<span class="cory">{{
                                AReward.gachaBox.leftAwards }}</span>/{{ AReward.gachaBox.totalAwards }}
                    </view>
                    <view class="r_btn" @click="selectBoxOpen"></view>
                </view>
                <view class="p-list" v-show="!allSoldOut">
                    <view class="list-item" v-for="(item, index) in highGrade" :key="index">
                        <img @click="ondetail(item, index)" class="p-img" :src="item.itemHalfImage"
                            :style="[item.leftNums ? {} : { opacity: 0.4 }]" />
                        <view class="sold_out" v-show="!item.leftNums">已售罄</view>
                        <view class="p-name ellipsis" @click="getJqs(item, index)">{{ item.itemName }}</view>
                        <view v-show="item.probability" class="p-probability ellipsis">概率:{{ item.probability }}%</view>
                        <view class="surprise_" v-show="surpriseList.includes(item.levelName)"></view>
                        <view class="number">{{ item.leftNums }}/{{ item.totalNums }}</view>
                        <view class="Lucky flex_r  flex_js " v-if="item.levelName == 'Lucky' && item.luckyNo"
                            @click.stop="onScheduleTips(item.luckyPhase)">
                            <view class="type">{{ item.levelName }}</view>
                            <view class="sort">{{item.luckyNo}}</view>
                        </view>
                        <img v-else @click="getJqs(item, index)" class="ico_"
                            :class="[item.levelName.length == 1 ? 'type1' : 'type' + item.levelName.length,]"
                            :src="`https://img.shinemang.com/gachaStatic/static/img/chaowanshang/css_${item.levelName}.png`" />
                        <view v-if="item.levelName == 'Lucky' && item.luckyPhase"  class="schedule flex_r flex_jb flex_ac" @click.stop="onScheduleTips(item.luckyPhase)">
                            <view class="num">{{ item.luckyPhase }}%</view>
                            <view class="iocn"></view>
                        </view>
                    </view>
                </view>
            </div>
            <view v-if="AReward.boxUserBetLimit !== -1" class="special_btn flex_c jqs astrictBtn"
                :class="{ forbid_bg: AReward.boxUserBetLimit == 0 }"
                @click=" AReward.boxUserBetLimit !== 0 ? onpay(1, 2) : ''">
                <view>立即抽赏</view>
            </view>
            <view v-else-if="showBtn" class="special_btn flex_c jqs astrictBtn"
                @click="onpay(AReward.gacha.specialDiscountLimitBetNum, 1)">
                <view>立即抽赏</view>
                <view class="number">￥{{
                    (
                        $h.Mul(
                            AReward.gacha.specialDiscountLimitBetNum - 1,
                            AReward.gacha.discountPrice
                                ? AReward.gacha.discountPrice
                                : AReward.gacha.price
                        ) + AReward.gacha.specialDiscountPrice
                    ).toFixed(2)
                }}<span class="num">￥{{
                        $h.Mul(
                            AReward.gacha.specialDiscountLimitBetNum,
                            AReward.gacha.discountPrice
                                ? AReward.gacha.discountPrice
                                : AReward.gacha.price
                        )
                    }}
                    </span></view>
                <view class="hubble-bubble" style="color: #cf0004">首抽￥{{ AReward.gacha.specialDiscountPrice }}（{{
                    numberToChinese(
                        AReward.gacha.specialDiscountLimitBetNum
                    )
                }}抽起）</view>
            </view>
            <view class="footbtn flex_r flex_jb flex_ae" v-else-if="
                AReward.userBetCount == -1 &&
                AReward.userBetCountDaily == -1">
                <view v-for="(i, s) in btnList" :key="s" class="numBtn" @click="onpay(i.num)">
                    <view class="btn_item  flex_c flex_jc flex_ac" :class="i.className">
                        {{ i.text }} </view>
                    <view class="text1 ellipsis" v-show="i.className == ''">￥{{ i.price }}</view>
                </view>
            </view>
            <view v-else class="special_btn flex_c jqs astrictBtn" :class="{
                forbid_bg:
                    AReward.userBetCount == 0 ||
                    AReward.userBetCountDaily == 0,
            }" @click="
                AReward.userBetCount == 0 || AReward.userBetCountDaily == 0
                    ? (showDiscounts = true)
                    : onpay(1, 2)
                ">
                <view>立即抽赏</view>
            </view>
        </view>
        <u-popup :show="selectBoxShow" bgColor="transparent">
            <view class="warp_box">
                <view class="warp">
                    <uni-icons class="close" @click="onOffSelect" type="close" color="#fff" size="35"></uni-icons>
                    <img :src="`https://img.shinemang.com/gachaStatic/static/img/chaowanshang/${cutBtn == 1 ? 'log_ico1' : 'yfs_csjl'}.png`"
                        class="log_ico2" />
                    <div class="drawLog">
                        <scroll-view class="product-scroll" @scrolltolower="onReachScollBottom" :lower-threshold="400"
                            :scroll-y="true">
                            <view class="empty_box" v-if="!boxs.length && !gachaRecords.length">
                                <view class="img"></view>
                                <view class="text" style="color: #aaacbb">空空如也~</view>
                            </view>
                            <view class="list_box" v-else-if="cutBtn == 2">
                                <scroll-view scroll-x="true">
                                    <div class="tabs">
                                        <div class="tab_item" @click="onBoxIndex(0)" :class="{
                                            active: level_index == 0,
                                        }">
                                            全部
                                        </div>
                                        <template v-for="(i, s) in BoxAwards">
                                            <div class="tab_item" @click=" onBoxIndex(i.levelIndex)
                                                " :class="{ active: i.levelIndex == level_index }"
                                                v-if="![27, 42, 45, 48, 49].includes(i.levelIndex)" :key="s">
                                                {{ i.levelIndex | levelNum }}赏</div>
                                        </template>
                                    </div>
                                    <div class="box_list1" style="margin-top: 10rpx" v-if="boxs.length">
                                        <div class="boxs">
                                            <view class="boxss" @click="
                                                onClickChangeBox(item.boxIndex)" v-for="(item, index) in boxs"
                                                :key="index">
                                                <view class="boxsss" v-if="item.boxIndex == boxIndex"></view>
                                                <div class="box_item" :class="[
                                                    item.leftAwards > 0
                                                        ? ''
                                                        : 'sell',
                                                ]">
                                                    <view class="box">{{
                                                        item.boxIndex
                                                        }}箱</view>

                                                    <div class="box_num2">
                                                        {{
                                                            item.leftAwards
                                                        }}/{{
                                                            item.totalAwards
                                                        }}
                                                    </div>
                                                </div>
                                                <view v-show="!item.leftAwards" class="sellImg transform" />
                                            </view>
                                        </div>
                                    </div>
                                </scroll-view>
                            </view>
                            <div class="list" v-else>
                                <div class="log_item" v-for="(i, s) in gachaRecords" :key="s">
                                    <div class="row flex_r flex_ac flex_jb">
                                        <div class="user flex_r flex_ac">
                                            <img :src="i.avatar | active" class="avatar" />
                                            <span class="name">{{ i.name }} </span>
                                        </div>
                                        <div>{{ i.createTime }}</div>
                                    </div>
                                    <div class="goods">
                                        <template v-for="(a, b) in i.awardItems">
                                            <div class="goods_item flex_r flex_ac" :key="b">
                                                <div class="name ellipsis">
                                                    <span style="color: #fcb25f;">{{ a.levelName }}赏</span>
                                                    <span>{{ a.itemName }}</span>
                                                </div>
                                                <img class="img" :src="a.itemCover" />
                                                <view class="Lucky LuckyRecord flex_r  flex_js "
                                                    v-if="a.levelName == 'Lucky' && a.luckyNo"
                                                    @click.stop="onScheduleTips(a.luckyPhase)">
                                                    <view class="type">{{ a.levelName }}</view>
                                                    <view class="sort">{{a.luckyNo}}</view>
                                                </view>
                                                <img class="Lucky1" v-else-if="a.levelName == 'Lucky'"
                                                    :src="`https://img.shinemang.com/gachaStatic/static/img/chaowanshang/css_Lucky.png`" />
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </scroll-view>
                    </div>
                </view>
            </view>
        </u-popup>
        <u-popup :show="JSON.stringify(jqsShow) !== '{}'" bgColor="transparent">
            <view class="jinqushang_box" v-if="jqsShow.levelName == 'Surprise'">
                <view class="jinqushang transform">
                    <view class="btn" :class="{ active: jqsItem.leftNums == 0 }"></view>
                    <view class="title">{{
                        jqsItem.leftNums == 0 ? "惊趣赏已开出" : "惊趣赏未开出"
                    }}</view>
                    <view class="text">购买到第{{ jqsItem.surpriseTargetNum }}个{{  jqsItem.surpriseTargetLevelName  }}赏，即可获得“惊趣赏”</view>
                    <view class="box" v-if="jqsItem.leftNums > 0">
                        <view class="ticket">
                            <view class="quantity" :style="{ left: leftNumber + 'rpx' }">
                                第{{ jqsItem.surpriseTargetProgress + 1 }}张
                            </view>
                            <view v-if="residue > 2">
                                <view v-for="(it, ix) in leftList" :key="ix" class="number"
                                    :style="{ right: it.right + 'rpx' }">第{{ it.id }}张</view>
                            </view>
                            <view class="jqs_icon" :style="{ right: leftNumber + 2 + 'rpx' }">
                                <view class="which_one">第{{ jqsItem.surpriseTargetNum }}张</view>
                            </view>
                        </view>
                        <view class="text_center">当前已开出{{ jqsItem.surpriseTargetProgress }}个{{
                            jqsItem.surpriseTargetLevelName
                            }}赏， 再开出{{ residue }}个{{
                                jqsItem.surpriseTargetLevelName
                            }}赏即可获得“惊趣赏”哦！</view>
                        <view class="btn1" @click="jqsShow = {}">继续开赏</view>
                    </view>
                    <view class="box" v-else>
                        <view class="picture"><img class="img" :src="jqsItem.itemHalfImage" /></view>
                        <view class="hint">恭喜 {{ jqsItem.name }} 开出惊趣赏</view>
                        <view class="btn1" @click="jqsShow = {}">继续开赏</view>
                    </view>
                </view>
            </view>
            <view class="extraBox" v-else>
                <view class="extra">
                    <view class="title">{{
                        jqsShow.levelName == "空车" ? "空车赏" : "串串赏"
                    }}</view>
                    <view class="contentText" v-if="jqsShow.levelName == '空车'">本池中连续{{
                        jqsShow.emptyNum
                        }}次参与均未获得Lucky赏的用户可获得</view>
                    <view class="contentText" v-else>本池中累计获得{{ jqsShow.cumulativeNum }}次第{{
                        jqsShow.cumulativeIndex
                        }}个 Lucky赏的用户可获得</view>
                    <view class="goBtn" @click="jqsShow = {}">继续开赏</view>
                </view>
            </view>
        </u-popup>``
        <gachaDetails ref="gachaDetails" />
        <!-- 支付 潮社赏5 -->
        <x-pay @success="onClickDraw" ref="xPay" mtype="5" :probabilityShow="probabilityShow" />
        <!-- 抽赏动效 -->
        <dynamic-effect ref="animation" />
        <discounts :visible="showDiscounts" @onDiscounts="onDiscounts" :themeName="AReward.gacha.themeName"   :message="AReward.openMessage" />
        <scheduleTips :LuckyVisible="LuckyVisible" :scheduleNum="scheduleNum" @onTips="LuckyVisible = false" />
    </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { Postpayment } from "@/utils/pay.js";
import { post } from "@/utils/api.js";
import { uniShare, saveFileToLocal, groupBySum, itemDetails, } from "@/utils/fun.js";
import xPay from "@/components/x-pay/index.vue";
import dynamicEffect from "@/pages/product/modules/dynamicEffect.vue";
import discounts from "@/components/modules/x-discounts.vue";
import scheduleTips from "@/pages/product/modules/scheduleTips.vue";
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
            highGrade: [], // 大赏，需要两列放大排放的
            gachaId: 0,
            selectBoxShow: false,
            level_index: 0,
            active: "全部",
            BoxAwards: [], //本赏池所有等级。去重后的
            boxs: [],
            boxIndex: 0,
            allSoldOut: false,
            couponId: 0,
            pay: false,
            btnList: [
                { num: 1, className: "", text: '一抽' },
                { num: 5, className: "", text: '五连抽' },
                { num: 10, className: "", text: '十连抽' },
                { num: 0, className: "btn_item1", text: '全收' },
            ],
            jqsShow: {},
            jqsItem: {},
            residue: 0,
            leftNumber: 80,
            leftList: [{ right: 192, id: 2 }],
            gachaRecords: [],
            pageda: {
                page: 1,
                page_size: 20,
                total: 20,
            },
            newSvgaPath: "", //svga动画资源地址
            newGifPath: "", //Gif动画资源地址
            surpriseList: [],
            cutBtn: 0,
            showDiscounts: false,
            showBtn: false,
            probabilityShow: [],
            theme_id: '',
            LuckyVisible: false,
            scheduleNum: 0,
        };
    }, 
    components: {
        xPay,
        dynamicEffect,
        discounts,
        scheduleTips
    },
    computed: { ...mapState(["userInfo"]) },
    onLoad(da) {
        if (da.gacha_id || da.id) this.gachaId = da.gacha_id || da.id;
        else this.theme_id = da.theme_id
        // this.loadDetail();
    },
    onShow() {
        this.loadDetail();
    },
    created() {
        that = this;
        that.saveFile();
    },
    methods: {
        ...mapMutations(["UppayMessage"]),
        async saveFile() {
            this.newFilePath = await saveFileToLocal("chaowsSvga", "https://img.shinemang.com/gachaStatic/static/img/cartoon/cws.svga");
            this.newGifPath = await saveFileToLocal("chaowsGif", "https://img.shinemang.com/gachaStatic/static/img/cartoon/700.gif");
        },
        getJqs(item, index) {
            if (["Surprise", "空车", "串串"].includes(item.levelName)) {
                this.jqsShow = item;
                if (item.levelName == "Surprise") this.loadDetail(item.id);
                return;
            }
            this.ondetail(item, index);
        },
        getJpsMsg(item) {
            this.leftNumber = 80;
            this.leftList = [{ right: 192, id: item.surpriseTargetProgress + 2 },];
            this.jqsItem = item;
            this.residue = item.surpriseTargetNum - item.surpriseTargetProgress;
            let num = this.residue - 2;
            if (num > 0) {
                this.leftNumber =
                    this.leftNumber - num * 20 > 20
                        ? this.leftNumber - num * 20
                        : 20;
                if (num == 2)
                    this.leftList = [
                        {
                            right: 172,
                            id: item.surpriseTargetProgress + 3,
                        },
                        {
                            right: 212,
                            id: item.surpriseTargetProgress + 2,
                        },
                    ];
                else if (num > 2)
                    this.leftList = [
                        {
                            right: 152,
                            id: item.surpriseTargetProgress + 4,
                        },
                        {
                            right: 192,
                            id: item.surpriseTargetProgress + 3,
                        },
                        {
                            right: 232,
                            id: item.surpriseTargetProgress + 2,
                        },
                    ];
            }
        },
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
        onOffSelect() {
            if (this.selectBoxShow && this.cutBtn == 1) {
                this.loadDetail();
            }
            this.level_index = 0;
            this.selectBoxShow = false;
        },
        async loadDetail(id = "") {
            this.loading = true;
            let total = 0;
            let obj = {}
            if (this.theme_id !== '') obj = { theme_id: this.theme_id }
            else obj = { gacha_id: this.gachaId, box_index: this.boxIndex, }
            let res = await post("v1/gacha/detail", obj);
            this.AReward = res;
            this.gachaId = res.gacha.id;
            this.showBtn = this.canShowGachaButton(res);
            this.couponId = res.gacha.couponId;
            this.highGrade = [];
            let result = [];
            let arr1 = [];
            res.gachaBoxAwards.map((item, index) => {
                arr1.push(Object.assign({}, res.gachaAwards[index], item));
            });
            let arr = arr1.filter((item) => {
                if (item.levelIndex == 45)
                    this.surpriseList.push(item.surpriseTargetLevelName);
                if ([27, 42, 45, 48, 49].includes(item.levelIndex)) {
                    result.push(item);
                } else return item.levelIndex;
            });
            for (const i in arr) {
                if (arr[i].totalNums) {
                    let obj;
                    res.gachaAwards.map((item, index) => {
                        if (item.levelIndex == arr[i].levelIndex) {
                            obj = Object.assign({}, item, arr[i]);
                        }
                    });
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
                        total += Number(a);
                    }
                    if (
                        i == arr.length - 1 &&
                        this.AReward.gachaBox.leftAwards !== 0
                    ) {
                        a = (
                            Number(a) + Number((100 - total).toFixed(2))
                        ).toFixed(2);
                    }
                    this.highGrade.push({ ...obj, probability: a });
                }
            }
            this.highGrade = [...result, ...this.highGrade];
            if (id) {
                let arr1 = this.highGrade.filter((item) => {
                    return item.id == id;
                });
                if (arr1[0].leftNums > 0) this.getJpsMsg(arr1[0]);
                else {
                    let res2 = await post("v1/gacha/award/record", {
                        box_index: arr1[0].boxIndex,
                        gacha_id: arr1[0].gachaId,
                        item_id: arr1[0].itemId,
                        page: 1,
                        page_size: 10,
                    });
                    if (!res2.code) {
                        this.jqsItem = { ...arr1[0], ...res2.records[0] };
                    }
                }
                return;
            }
            this.boxIndex = res.gachaBox?.boxIndex;
            if (res.gachaAwards.length == 0) {
                uni.$u.toast("已售完");
                this.allSoldOut = true;
            }
            this.btnList[3].num = this.AReward.gachaBox.leftAwards;
            this.quchong();
            this.loading = false;
            let { price, discountPrice } = this.AReward.gacha;
            this.btnList.map((item) => {
                let num = discountPrice > 0 ? item.num * discountPrice : item.num * price;
                item.price = (num + "").indexOf(".") != -1 ? num.toFixed(1) : num;
            });
            // #ifdef APP
            if (getApp().globalData.AppTypeList[plus.runtime.channel] == 2)
                this.probabilityShow = groupBySum(this.highGrade);
            // #endif
        },
        onClickChangeBox(boxindex) {
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
        onDiscounts() {
            this.showDiscounts = false;
        },
        //中奖
        onClickDraw(res, showAnim, type) {
            if (type == 0) {
                if (!Array.isArray(res.awards)) return
                that.$refs.animation.open(
                    res.awards,
                    that.newFilePath,
                    that.newGifPath,
                    showAnim,
                    "css",
                    that.gachaId
                );
                that.loadDetail();
                return;
            } else {
                post("v1/gacha/open/result", { pay_id: res.res.createPaymentReply.payId }).then((res) => {
                    if (!res.code) {
                        if (!Array.isArray(res.awards)) return
                        that.$refs.animation.open(
                            res.awards,
                            that.newFilePath,
                            that.newGifPath,
                            showAnim,
                            "css",
                            that.gachaId,
                            that.boxIndex
                        );
                        that.loadDetail();
                        return;
                    } else uni.$u.toast(res.message);
                });
            }
        },
        selectBoxOpen() {
            this.cutBtn = 2;
            this.gachaRecords = [];
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
             itemDetails(data, this.$refs.gachaDetails, "获奖概率", this.AReward.gacha.price)
        },
        ondrawLog() {
            // 中赏记录
            this.cutBtn = 1;
            this.boxs = [];
            this.selectBoxShow = true;
            this.pageda = {
                page: 1,
                page_size: 20,
                total: 20,
            };
            this.getPage();
        },
        onReachScollBottom() {
            if (this.pageda.total > this.pageda.page * this.pageda.page_size) {
                this.pageda.page++;
                this.getPage();
            }
        },
        getPage() {
            post("v1/gacha/record", {
                ...this.pageda,
                gacha_id: this.gachaId,
                box_index: this.boxIndex,
                // level_type:3
            }).then((res) => {
                if (this.pageda.page == 1) this.gachaRecords = [];
                this.gachaRecords = this.gachaRecords.concat(res.gachaRecords);
                this.pageda.total = res.total;
            });
        },
        onShare() {
            uniShare(
                {
                    tit: "潮社赏 : " + this.AReward.gacha.themeName,
                    path: "pages/product/chaosheshang",
                },
                { id: this.gachaId, index: this.boxIndex },
                this.AReward.gacha.coverImage
            );
        },
        onScheduleTips(num) {
            this.LuckyVisible = true
            this.scheduleNum = num
        },
    },
};
</script>
<style lang="scss" scoped>
.loading_box {
    width: 100%;
    height: 100vh;
    background-image: url("https://img.shinemang.com/gachaStatic/static/img/chaowanshang/chaosheshang_bg.png");
    background-size: 100% 100%;
    overflow: hidden;

}

.chaosheshang {
    height: 100vh;


}

.head_con {
    width: 100%;
    height: 490rpx;
    background-size: 100% auto;
    padding-top: 90rpx;
    position: relative;
    color: #ffffff;

    .top_Back {
        width: 100%;
        font-size: 36rpx;
        padding: 0 32rpx;

        .Back_ico {
            width: 56rpx;
            height: 56rpx;
        }

        .title {
            margin-left: 24rpx;
        }

        .a {
            margin-left: auto;
        }
    }

    .i_notice {
        width: 686rpx;
        height: 56rpx;
        margin: 44rpx auto 28rpx;
        background: linear-gradient(90deg, #210000 0%, #3d0000 100%);
        box-shadow: inset 8rpx 8rpx 16rpx 0rpx #c34a4a,
            inset -8rpx -8rpx 16rpx 0rpx #c34a4a;
        border-radius: 40rpx;
        border: 4rpx solid #c74d4d;
        z-index: 500;
        padding-right: 24rpx;

        .r_ico {
            height: 56rpx;
            background: linear-gradient(90deg, #c03232 0%, #8d1111 100%);
            box-shadow: inset 0rpx -8rpx 16rpx 0rpx rgba(231, 178, 255, 0.5),
                inset 0rpx 8rpx 16rpx 0rpx rgba(192, 171, 255, 0.25);
            border-radius: 34rpx;
            border: 4rpx solid rgba(192, 99, 99, 1);
            padding: 0 24rpx;
            font-weight: bold;
            font-size: 24rpx;
            color: #ffffff;

            .ico {
                width: 32rpx;
                height: 32rpx;
                margin-right: 8rpx;
            }
        }
    }

    .particulars {
        width: 686rpx;
        height: 256rpx;
        position: relative;
        margin: 0 auto;
        background: #000000;
        box-shadow: inset 8rpx 8rpx 24rpx 0rpx #c34a4a,
            inset -8rpx -8rpx 24rpx 0rpx #c34a4a;
        border-radius: 16rpx;
        border: 4rpx solid #b43838;

        .name {
            width: 596rpx;
            height: 80rpx;
            line-height: 80rpx;
            padding: 0 52rpx 0 230rpx;
            background-image: url("https://img.shinemang.com/gachaStatic/static/img/chaowanshang/css_jg.png");
            background-size: 100% 100%;
            font-weight: bold;
            font-size: 28rpx;
        }

        .header1 {
            position: absolute;
            left: 24rpx;
            top: 50%;
            transform: translate(0, -50%);
            width: 192rpx;
            height: 192rpx;
            border-radius: 8rpx;
            border: 4rpx solid #000000;
            box-sizing: border-box;
        }

        .box_number {
            position: absolute;
            left: 236rpx;
            top: 104rpx;
            font-weight: 500;
            font-size: 20rpx;
        }

        .price {
            position: absolute;
            left: 236rpx;
            bottom: 36rpx;
            width: 340rpx;
            height: 60rpx;
            font-weight: bold;
            font-size: 40rpx;
            line-height: 60rpx;
            padding-left: 40rpx;
            background-image: url("https://img.shinemang.com/gachaStatic/static/img/chaowanshang/css-mz.png");
            background-size: 100% 100%;

            &:before {
                content: "￥";
                font-size: 28rpx;
                font-weight: 800;
            }

            &:after {
                content: "元";
                /* 添加的最后一个字 */
                margin-left: 8rpx;
                font-weight: bold;
                font-size: 28rpx;
            }
        }
    }

    .rbtn1 {
        width: 124rpx;
        height: 60rpx;
        background-image: url("https://img.shinemang.com/gachaStatic/static/img/chaowanshang/chaosheshang_gz.png");
        background-size: 100% 100%;
        position: absolute;
        bottom: 132rpx;
        right: 0;
    }

    .rbtn3 {
        width: 124rpx;
        height: 60rpx;
        background-image: url("https://img.shinemang.com/gachaStatic/static/img/chaowanshang/chaosheshang_sx.png");
        background-size: 100% 100%;
        position: absolute;
        bottom: 52rpx;
        right: 0;
    }
}

.chaosheshang_con {
    position: relative;
    width: 100%;
    height: 1036.53rpx;
    margin-top: 64rpx;
    background-image: url("https://img.shinemang.com/gachaStatic/static/img/chaowanshang/chaosheshang_boxBg.png");
    background-size: 100% 100%;
}

.top_txt {
    padding: 0 32rpx;
    font-size: 24rpx;
    color: #ffea2a;
}

.nb {
    top: 195rpx;
    right: 200rpx;

}

.head_in {
    position: relative;
    width: 100%;
    top: -22rpx;
    padding: 0 18rpx;

    .l_btn {
        width: 160rpx;
        height: 160rpx;
        background: url("https://img.shinemang.com/gachaStatic/static/img/chaowanshang/chaosheshang_zjjl.png");
        background-size: 100% 100%;
    }

    .r_btn {
        width: 160rpx;
        height: 160rpx;
        background: url("https://img.shinemang.com/gachaStatic/static/img/chaowanshang/chaosheshang_hgxz.png");
        background-size: 100% 100%;
    }

    .c_btn {
        color: #fff;
        width: 346rpx;
        margin: 0 auto;
        margin-top: 16rpx;
        height: 64rpx;
        line-height: 64rpx;
        background: #190000;
        border-radius: 8rpx;
        border: 4rpx solid #db5c5c;
        text-align: center;
        font-weight: 500;
        font-size: 24rpx;
        display: flex;
        justify-content: center;
        align-items: center;

        .cory {
            color: rgba(255, 153, 96, 1);
        }
    }
}

.p-list {
    height: 800rpx;
    overflow-y: auto;
    display: grid;
    justify-content: space-between;
    grid-template-columns: repeat(auto-fill, 208rpx);
    padding: 0 48rpx 200rpx;

    .list-item {
        width: 208rpx;
        height: 288rpx;
        background: #210000;
        border-radius: 16rpx;
        border: 2rpx solid #953939;
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

        .sold_out {
            position: absolute;
            font-size: 30rpx;
            left: 50%;
            transform: translate(-50%);
            top: 75rpx;
        }

        .p-name {
            margin-top: 12rpx;
            font-size: 24rpx;
            padding: 0 12rpx;
        }

        .p-probability {
            font-weight: 500;
            font-size: 20rpx;
            color: #ff9960;
            padding: 0 12rpx;
        }

        .number {
            padding: 0 16rpx;
            height: 40rpx;
            text-align: center;
            background: rgba(0, 0, 0, 0.5);
            font-weight: bold;
            font-size: 24rpx;
            position: absolute;
            border-bottom-left-radius: 24rpx;
            top: 0;
            right: 0;
        }

        .surprise_ {
            position: absolute;
            width: 36rpx;
            height: 36rpx;
            background: url("https://img.shinemang.com/gachaStatic/static/img/chaowanshang/jing.png");
            background-size: 100% 100%;
            top: 6rpx;
            left: 6rpx;
        }

        .ico_ {
            position: absolute;
            top: 152rpx;
            left: -2rpx;
            height: 52rpx;
        }



        .type1 {
            width: 96rpx;
        }

        .type8 {
            width: 136rpx;
        }

        .type5 {
            width: 134rpx;
        }

        .type4 {
            width: 124rpx;
        }

        .type3 {
            width: 124rpx;
        }

        .type2 {
            width: 112rpx;
        }
    }

}

.Lucky {
    position: absolute;
    top: 154rpx;
    width: 148rpx;
    height: 52rpx;
    background-image: url("https://img.shinemang.com/gachaStatic/static/img/chaowanshang/LuckyBg.png");
    background-size: 100% 100%;
    font-weight: 800;
    color: transparent;
    padding-top: 18rpx;

    .type {
        height: 32.81rpx;
        line-height: 28rpx;
        font-weight: 400;
        font-size: 22rpx;
        background: linear-gradient(360deg, #FF91F9 10%, #FF91F9 40%, #FFF0FE 80%, #FFCFFB 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-left: 22rpx;
        font-family: "测试字体", sans-serif;
    }

    .sort {
        height: 32.81rpx;
        line-height: 34rpx;
        font-size: 20rpx;
        background: linear-gradient(360deg, #FF91F9 10%, #FF91F9 40%, #FFF0FE 80%, #FFCFFB 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-family: "测试字体", sans-serif;
        margin-left: 4rpx;
    }
}

.schedule {
    position: absolute;
    top: 0rpx;
    height: 18px;
    background: linear-gradient(0deg, #FF61FD 0%, #8A4AD1 100%);
    border: 1px solid #FFFFFF;
    border-radius: 12rpx 0 12rpx 0;
    border: 2rpx solid #FFFFFF;
    font-size: 20rpx;
    color: #FFFFFF;
    padding: 6rpx;
    font-weight: bold;

    .iocn {
        width: 16rpx;
        height: 16rpx;
        background-image: url("https://img.shinemang.com/gachaStatic/static/img/niudan/info.png");
        background-size: 100% 100%;
        margin-left: 4rpx;
    }
}

.LuckyRecord {
    position: absolute;
    top: -24rpx;
    left: -28rpx;

}

.Lucky1 {
    position: absolute;
    top: -24rpx;
    left: -28rpx;
    width: 134rpx;
    height: 52rpx;

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

.footbtn {
    position: fixed;
    width: 100%;
    bottom: 0;
    height: 232rpx;
    background: url("https://img.shinemang.com/gachaStatic/static/img/chaowanshang/chaosheshang_foot.png") no-repeat;
    background-size: 100% auto;
    text-align: center;
    color: #fff;
    padding: 0 32rpx 16rpx;

    .numBtn {
        position: relative;

        .btn_item {
            width: 172rpx;
            height: 172rpx;
            background-image: url("@/static/btn/numBtn.png");
            background-size: 100% 100%;
            font-size: 34rpx;
            font-weight: 1000;
            font-family: "测试字体", sans-serif;
            /*#ifdef APP-PLUS*/
            -webkit-text-stroke: 0.5px #700000;
            /*#endif*/
        }

        .text1 {
            position: absolute;
            font-size: 20rpx;
            bottom: 44rpx;
            left: 50%;
            transform: translateX(-50%);
        }
    }

    .btn_item1 {
        width: 184rpx !important;
        height: 184rpx !important;
        font-size: 45rpx !important;
        background-image: url("@/static/btn/allIn.png") !important;
        background-size: 100% 100%;
    }
}

.jinqushang_box {
    position: relative;
    width: 100%;
    height: 100vh;

    .jinqushang {
        width: 590rpx;
        height: 764rpx;
        background: url("https://img.shinemang.com/gachaStatic/static/img/chaowanshang/jinqushang_bg.png");
        background-size: 100% 100%;
        position: absolute;
        padding-top: 48rpx;

        .btn {
            position: absolute;
            width: 156rpx;
            height: 156rpx;
            background: url("https://img.shinemang.com/gachaStatic/static/img/chaowanshang/jqs-th.png");
            background-size: 100% 100%;
            right: -40rpx;
            top: -40rpx;

            &.active {
                background: url("https://img.shinemang.com/gachaStatic/static/img/chaowanshang/jqs_dg.png");
                background-size: 100% 100%;
            }
        }

        .title {
            margin: 0 auto;
            font-weight: 800;
            font-size: 56rpx;
            text-align: center;
            color: #ffcf98;
            text-shadow: -1px -1px 0 rgba(100, 0, 20, 1),
                1px -1px 0 rgba(100, 0, 20, 1), -1px 1px 0 rgba(100, 0, 20, 1),
                1px 1px 0 rgba(100, 0, 20, 1);
            /* 边框颜色 */
        }

        .text {
            margin: 16rpx auto;
            width: 586rpx;
            height: 64rpx;
            line-height: 64rpx;
            text-align: center;
            background: linear-gradient(90deg,
                    rgba(117, 0, 23, 0) 0%,
                    #750017 40%,
                    #750017 60%,
                    rgba(117, 0, 23, 0) 100%);
            font-weight: bold;
            font-size: 28rpx;
            color: #ff9494;
        }

        .box {
            margin: auto;
            width: 542rpx;
            height: 508rpx;
            background: url("https://img.shinemang.com/gachaStatic/static/img/chaowanshang/jqs_bg.png");
            background-size: 100% 100%;
            padding-top: 68rpx;

            .ticket {
                margin: 0 auto;
                width: 478rpx;
                height: 192rpx;
                background: #963839;
                border-radius: 24rpx;
                padding: 30rpx 20rpx;
                position: relative;
                font-weight: bold;
                font-size: 20rpx;
                color: #b11a00;

                .quantity {
                    position: absolute;
                    width: 190rpx;
                    height: 132rpx;
                    line-height: 132rpx;
                    padding-left: 20rpx;
                    background: url("https://img.shinemang.com/gachaStatic/static/img/chaowanshang/jqs_quantity.png");
                    background-size: 100% 100%;
                    z-index: 99;
                    font-size: 28rpx;
                    color: rgba(255, 207, 152, 1);
                    text-align: center;
                }

                .number {
                    position: absolute;
                    width: 160rpx;
                    height: 132rpx;
                    padding-left: 120rpx;
                    background: url("https://img.shinemang.com/gachaStatic/static/img/chaowanshang/jqs_number.png");
                    background-size: 100% 100%;
                    z-index: 98;
                    writing-mode: vertical-rl;
                    text-orientation: upright;
                    /* 使字符保持直立 */
                    text-align: center;
                    letter-spacing: 4px;
                    /* 设置字符间距为2像素 */
                    padding-right: 12rpx;
                    right: 152rpx;
                }

                .jqs_icon {
                    position: absolute;
                    width: 160rpx;
                    height: 132rpx;
                    background: url("https://img.shinemang.com/gachaStatic/static/img/chaowanshang/jqs_icon.png");
                    background-size: 100% 100%;
                    z-index: 97;

                    .which_one {
                        position: absolute;
                        width: 80rpx;
                        height: 28rpx;
                        background: linear-gradient(180deg,
                                #ffe9d2 0%,
                                #ffcf98 100%);
                        border-radius: 14rpx;
                        right: 28rpx;
                        top: 72rpx;
                        text-align: center;
                    }
                }
            }

            .text_center {
                margin: 32rpx auto;
                width: 460rpx;
                height: 80rpx;
                font-weight: bold;
                font-size: 28rpx;
                color: #ffb764;
            }

            .btn1 {
                margin: 0 auto;
                width: 462rpx;
                height: 80rpx;
                background: linear-gradient(180deg, #fff5be 0%, #d0680d 100%);
                border-radius: 40rpx;
                font-weight: 800;
                font-size: 32rpx;
                color: #8b0000;
                text-align: center;
                line-height: 80rpx;
            }

            .picture {
                margin: auto;
                width: 240rpx;
                height: 240rpx;
                background: #963839;
                box-shadow: 0rpx 0rpx 24rpx 0rpx #993739;
                border-radius: 24rpx;
                position: relative;

                .img {
                    width: 224rpx;
                    height: 224rpx;
                    border-radius: 16rpx;
                    border: 2rpx solid #ff9960;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                }
            }

            .hint {
                width: 314rpx;
                font-weight: bold;
                font-size: 28rpx;
                color: #ffb764;
                margin: 32rpx auto;
            }
        }
    }
}

.warp_box {
    width: 100%;
    height: 100vh;
    z-index: 9999;

    .warp {
        height: 75vh;
        width: 750rpx;
        background: linear-gradient(92deg, #550010 0%, #820002 100%);
        box-shadow: inset 0rpx 2rpx 4rpx 0rpx rgba(255, 255, 255, 0.5);
        border-radius: 48rpx 48rpx 0 0;
        padding: 88rpx 32rpx 0;
        position: absolute;
        bottom: 0;

        .log_topbg {
            width: 694rpx;
            height: 184rpx;
            position: absolute;
            top: -28rpx;
            left: 0;
            z-index: 1;
        }

        .log_ico2 {
            width: 490rpx;
            height: 98rpx;
            position: absolute;
            top: -25rpx;
            left: 50%;
            transform: translateX(-50%);
            z-index: 3;
        }

        .close {
            position: absolute;
            top: -72rpx;
            right: 32rpx;
            z-index: 3;
        }

        .drawLog {
            width: 100%;
            height: 100%;
            position: relative;
            z-index: 2;
            overflow-y: auto;

            .product-scroll {
                height: 100%;
                background: #250000;
                border-radius: 32rpx 32rpx 0 0;

                .list {
                    width: 686rpx;
                    padding: 16rpx;
                    padding-top: 30rpx;
                    overflow: hidden;
                }

                .list_box {
                    width: 686rpx;
                    padding: 40rpx 14rpx 80rpx;

                    .tabs {
                        white-space: nowrap;
                        overflow-x: auto;
                        overflow-y: hidden;

                        .tab_item {
                            display: inline-block;
                            margin-right: 20rpx;
                            padding: 10rpx 44rpx;
                            height: 56rpx;
                            border-radius: 8rpx;
                            border: 4rpx solid #640014;
                            background: #300303;
                            font-weight: 800;
                            font-size: 24rpx;
                            color: #ffffff;
                            text-align: center;

                            &:last-child {
                                margin-right: 0;
                            }

                            &.active {
                                box-shadow: inset 0rpx -8rpx 48rpx 0rpx #610002,
                                    inset 0rpx 8rpx 40rpx 0rpx #ff3131;
                            }
                        }
                    }

                    .box_list1 {
                        height: calc(100vh - 610rpx);
                        overflow-y: auto;


                    }
                }
            }

            .log_item {
                padding: 16rpx 24rpx;
                border-radius: 16rpx;
                background: linear-gradient(90deg,
                        #460707 0%,
                        rgba(166, 27, 27, 0.5) 55%,
                        #500b0b 100%);
                margin-bottom: 20rpx;

                .row {
                    height: 72rpx;
                    font-size: 24rpx;
                    color: #818181;
                    border-bottom: 2rpx dashed #818181;
                    font-weight: 500;
                    padding-bottom: 12rpx;

                    .avatar {
                        width: 40rpx;
                        height: 40rpx;
                        border-radius: 50%;
                    }

                    .name {
                        font-weight: 500;
                        font-size: 24rpx;
                        color: #b9b3cd;
                        margin-left: 8rpx;
                    }

                    .txt {
                        margin-left: 18rpx;
                    }
                }

                .goods {
                    padding-top: 12rpx;
                }

                .goods_item {
                    font-weight: bold;
                    font-size: 28rpx;
                    color: #ffffff;
                    padding: 8rpx 20rpx;
                    margin-bottom: 15rpx;
                    position: relative;

                    &:last-child {
                        margin-bottom: 0;
                    }

                    .name {
                        color: #fff;
                        width: calc(100% - 80rpx);

                        span {
                            margin-right: 8rpx;
                        }
                    }

                    .img {
                        width: 64rpx;
                        height: 64rpx;
                        border-radius: 12rpx;
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
}

.boxs {
    @include grid(165rpx);
    margin-top: 30rpx;
    overflow-x: hidden;

    .boxss {
        width: 172rpx;
        height: 208rpx;
        position: relative;
        margin-top: 10rpx;

        .box_item {
            position: absolute;
            width: 152rpx;
            height: 188rpx;
            background: linear-gradient(90deg,
                    #3a0505 0%,
                    rgba(143, 0, 0, 0.45) 55%,
                    #3a0505 100%);
            border-radius: 16rpx;
            padding-top: 28rpx;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);

            .box {
                width: 100rpx;
                height: 92rpx;
                padding-top: 40rpx;
                margin: auto;
                background-image: url("https://img.shinemang.com/gachaStatic/static/img/chaowanshang/css_box.png");
                background-size: 100% 100%;
                font-weight: bold;
                font-size: 28rpx;
                color: #ffffff;
                text-align: center;
            }

            .box_num2 {
                margin-top: 16rpx;
                font-weight: 500;
                font-size: 24rpx;
                color: #ffffff;
                text-align: center;
            }
        }

        .sell {
            opacity: 0.6;
        }

        .sellImg {
            position: absolute;
            width: 104rpx;
            height: 104rpx;
            background-image: url("https://img.chaoshewang.com/matt/static/img/chaowanshang/yfs_ysx.png");
            background-position: center;
            background-size: 100% 100%;
            z-index: 99 !important;
            opacity: 1;
        }

        .boxsss {
            width: 172rpx;
            height: 208rpx;
            position: absolute;
            top: 0;
            background-image: url("https://img.shinemang.com/gachaStatic/static/img/chaowanshang/css_border.png");
            background-size: 100% 100%;
            z-index: 99;
            animation: breathingLight 3s infinite;

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
    }
}

.empty_box {
    display: flex;
    height: 100%;
    line-height: 100%;
    flex-direction: column;
    justify-content: center;

    .img {
        margin: 0 auto;
        width: 504rpx;
        height: 344rpx;
        background-image: url("https://img.chaoshewang.com/matt/static/img/chaowanshang/css_kxz.png");
        background-size: 100% 100%;
    }

    .text {
        font-weight: 500;
        font-size: 28rpx;
        color: #aaacbb;
        text-align: center;
    }
}

.extraBox {
    width: 100%;
    height: 100vh;

    .extra {
        position: relative;
        width: 670rpx;
        height: 624rpx;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: url("https://img.shinemang.com/gachaStatic/static/img/chaowanshang/extra.png");
        background-size: 100% 100%;

        .title {
            position: absolute;
            font-weight: 800;
            font-size: 56rpx;
            line-height: 80rpx;
            color: #ffcf98;
            text-shadow: -1px -1px 0 rgba(100, 0, 20, 1),
                1px -1px 0 rgba(100, 0, 20, 1), -1px 1px 0 rgba(100, 0, 20, 1),
                1px 1px 0 rgba(100, 0, 20, 1);
            /* 边框颜色 */
            text-align: center;
            left: 50%;
            transform: translateX(-50%);
            top: 88rpx;
        }

        .contentText {
            position: absolute;
            width: 478rpx;
            background: #963839;
            border-radius: 24rpx;
            font-weight: bold;
            font-size: 28rpx;
            color: #ffb764;
            text-align: center;
            padding: 48rpx 80rpx;
            left: 50%;
            transform: translateX(-50%);
            top: 264rpx;
        }

        .goBtn {
            position: absolute;
            width: 462rpx;
            height: 80rpx;
            background: linear-gradient(180deg, #fff5be 0%, #d0680d 100%);
            border-radius: 40rpx;
            left: 50%;
            transform: translateX(-50%);
            bottom: 56rpx;
            font-weight: 800;
            font-size: 32rpx;
            color: #8b0000;
            text-align: center;
            line-height: 80rpx;
        }
    }
}
</style>