<template>
    <view class="chaowanshang" :style="{ paddingTop: MBInfo().top + 'px' }">
        <view class="top_Back flex_r flex_js flex_ac" :class="{ borshad: conScrollTop > 10 }"
            :style="{ height: MBInfo().height + 'px' }">
            <img src="https://img.chaoshewang.com/static/img/duoyou/tc.png" @click.stop="gateBack" class="Back_ico" />
            <text class="title ellipsis">{{ gachainfo.themeName }}</text>
        </view>
        <view class="leftBox" @click=" goto('/pages/common/rulepop', { val: 'ChaoPlayRules' })">规则</view>
        <view class="leftBox cg" @click="goChaoGui">潮柜</view>
        <scroll-view :style="{ height: conHeight }" scroll-y="true" @scroll="onScroll">
            <view class="chaowanshang_con">
                <view class="gashapon_machine_box">
                    <view class="gashapon_machine">
                        <swiper :current="cardCur" class="card-swiper" autoplay :circular="true" duration="500"
                            @change="cardSwiper">
                            <swiper-item v-for="(item, index) in AllRewardsInfo" :key="index"
                                :class="cardCur == index ? 'cur' : ''">
                                <view class="swiper-item2 image-banner">
                                    <div class="png-scaling">
                                        <image class="png-sussuspension2" :src="item.itemHalfImage" mode="heightFix">
                                        </image>
                                    </div>
                                </view>
                            </swiper-item>
                        </swiper>
                        <view class="switch_btn switch_l" @click="switchover('last')" />
                        <view class="switch_btn  switch_r" @click="switchover('next')" />
                        <button open-type="share" class="btns_2 " @click="onShare">
                            <image src="https://img.chaoshewang.com/static/img/duoyou/fx.png" />
                        </button>
                        <view class="ts">盲盒概率具有随机性，请理性消费</view>
                        <!-- #ifdef MP-WEIXIN -->
                        <view class="price dyzt">{{ price }}</view>
                        <!-- #endif -->
                        <!-- #ifndef MP-WEIXIN -->
                        <view class="price dyzt" :style="{ '--after-content': `'.${mantissa}'` }">{{ Math.floor(price)
                        }} </view>
                        <!-- #endif -->
                        <view class="multiple " v-if="gachainfo.costAwardMultiple > 1">
                            <view class="number">{{ gachainfo.costAwardMultiple }}</view>
                        </view>
                    </view>
                </view>
                <view class="preview_box">
                    <view class="p-tit flex_r flex_ac">
                        <view class="tit_item " @click="previewType = 1" :class="{ active: previewType == 1 }">赏池预览
                        </view>
                        <view class="tit_item " @click="chaoPlay(2)" :class="{ active: previewType == 2 }">抽赏记录</view>
                        <view class="spShow flex_r flex_ac">
                            <view>距上次出SP赏已过</view>
                            <view class="num">x{{ spNum }}</view>
                        </view>
                    </view>
                    <template v-if="previewType == 1">
                        <div class="p-probability flex_r flex_ac flex_jse">
                            <div class="prob_item" v-for="(i, s) in probability" :key="i.id">
                                <img :src="`https://img.chaoshewang.com/static/img/chaowanshang/duoyou_${s}.png`"
                                    class="badge" />
                                <!-- <div class="prob_num">{{ ($h.Div(i, gachainfo.totalNum) * 100).toFixed(2) }}%</div> -->
                                <div class="prob_num" v-if="i">{{ i }}%</div>
                            </div>
                        </div>
                        <scroll-view scroll-y>
                            <view class="list-item flex_r flex_ac" v-for="(item, index) in AllRewardsInfo" :key="index"
                                @click="ondetail(item.itemId)">
                                <img :src="item.itemHalfImage" class="p-img" />
                                <img :src="`https://img.chaoshewang.com/static/img/chaowanshang/duoyou_${item.levelName}.png`"
                                    class="badge" />
                                <view class="bor"></view>
                                <view class="p-name flex_c flex_jb">
                                    <div class="tit">{{ item.itemName }}</div>
                                    <div class="price">
                                        <span>单抽价：</span>
                                        <!-- #ifdef MP-WEIXIN -->
                                        <span class="corr">{{ price }}</span>
                                        <!-- #endif -->
                                        <!-- #ifndef MP-WEIXIN -->
                                        <span class="corr" :style="{ '--after-content': `'.${mantissa}'` }">{{
                                            Math.floor(price)
                                        }}</span>
                                        <!-- #endif -->
                                    </div>
                                </view>
                            </view>
                            <!-- </view> -->
                        </scroll-view>
                    </template>
                    <template v-if="previewType == 2">
                        <view class="spNumber flex_r flex_ac flex_jb">
                            <view class="flex_r flex_ac">
                                <view class="icon"></view>已抽{{ residual }}发
                            </view>

                            <view class="sx flex_r flex_ac flex_jc" @click="refreshBtn">
                                <view class="icon1"></view>刷新
                            </view>
                        </view>
                        <div class="lotteryRaffle">
                            <div class="r_item" v-for="(array, key) in recordList" :key="key">
                                <div class="lr_tit flex_r flex_ac flex_jb" :class="['badge' + array.name]">
                                    <img :src="`https://img.chaoshewang.com/static/img/chaowanshang/duoyou_${array.name}.png`"
                                        class="badge" />
                                    <div class="tit_r flex_r flex_ac" @click="getJl(array)">
                                        <span>查看最近10个</span>
                                        <span class="icof" v-if="array.active">&#xe72a;</span>
                                        <span class="icof" v-else>&#xe72d;</span>
                                    </div>
                                </div>
                                <div :class="['lr_con', { row1: !array.active }]">
                                    <div v-if="array.records.length !== 0">
                                        <div class="lr_i flex_r flex_ac flex_jb"
                                            v-for="(item, i) in array.records.slice(0, array.lengthNumber)" :key="i">
                                            <div class="lr_r">
                                                <img class="lr_img" :src="item.itemCover" />
                                                <div class="nums">{{ item.no }}发</div>
                                            </div>
                                            <div class="bor"></div>
                                            <div class="lr_info flex_c flex_jb">
                                                <div class="name ellipsis2">
                                                    {{ item.itemName }}
                                                </div>
                                                <div class="user_time flex_r flex_ac flex_jb">
                                                    <div class="user flex_r flex_ac">
                                                        <img class="u_img" :src="item.avatar
                                                            | active
                                                            " />
                                                        <div class="u_name">
                                                            {{ item.name }}
                                                        </div>
                                                    </div>
                                                    <div class="time">
                                                        {{ item.createTime }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div v-else class="nullBox">
                                        暂无中赏记录~
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </view>
            </view>
        </scroll-view>
        <view class="footBox dyzt">
            <view v-if="activityOpen" class="coupon  flex_r flex_ac" :class="[getCouponType]">
                <view class="particulars">
                    <view class="content flex_r flex_wrap flex_ac">
                        <view class="water" v-if="waters.length">{{ waters }} </view>
                        <view class="name ellipsis">{{ ticket }}</view>
                        <view class="ticket flex_r flex_jb flex_ac">
                            <img :src=water.thumb @click="ondetail(water.value)" />
                            <view class="number ellipsis"
                                :class="{ active: waters.length > 2 && getCouponType == 'long' }">x{{
                                    water.num || water.value }}</view>
                        </view>
                        <view class="btn" :class="{ active: currentPercent >= 100 }" @click.stop="innerClick">{{
                            currentPercent
                                >= 100 ? '领取' : '待完成' }}
                        </view>
                    </view>
                    <view class="progressBar flex_js"
                        v-if="(waters.length > 5 && getCouponType == 'long') || (ticket.length > 4 && getCouponType == 'short')">
                        <view class="progress" :style="{ width: currentPercent + '%' }">
                            <view class="schedule" v-if="currentPercent"></view>
                        </view>
                    </view>
                </view>
                <div class="cut_ico icof" :style="{ marginLeft: ticket.length > 4 ? '12rpx' : '4rpx' }"
                    @click="$noMultipleClicks(getCoupon)">{{ getCouponType == 'long' ? '&#xe72c;' : '&#xe72b;' }} </div>
            </view>

            <view class="foot-btn flex_r flex_jc" v-if="isWelfare">
                <view class="btn-item flex_r flex_jc flex_ac" @click="onpay(1)">抽奖</view>
            </view>
            <view class="special_btn flex_c astrictBtn" v-else-if="showBtn"
                @click="onpay(AReward.gacha.specialDiscountLimitBetNum, 1)">
                <view class="">立即抽赏</view>
                <view class="number">￥{{
                    ($h.Mul(
                        AReward.gacha.specialDiscountLimitBetNum - 1,
                        AReward.gacha.discountPrice
                            ? AReward.gacha.discountPrice
                            : AReward.gacha.price
                    ) + AReward.gacha.specialDiscountPrice).toFixed(2)
                }}<span class="num">￥{{
                        $h.Mul(
                            AReward.gacha.specialDiscountLimitBetNum,
                            AReward.gacha.discountPrice
                                ? AReward.gacha.discountPrice
                                : AReward.gacha.price
                        )
                    }}
                    </span></view>
                <view class="hubble-bubble">首抽￥{{ AReward.gacha.specialDiscountPrice }}（{{
                    numberToChinese(AReward.gacha.specialDiscountLimitBetNum)
                }}抽起）</view>
            </view>
            <view class="foot-btn flex_r flex_jb flex_ac"
                v-else-if="AReward.userBetCount == -1 && AReward.userBetCountDaily == -1">
                <view class="cut flex_r flex_ac" :class="[cutPattern]" @click="oncut">
                    <view>{{ cutPattern == 'common' ? '普通' : "激情" }}模式</view>
                    <view :class="[cutPattern + 'Img']"> </view>
                </view>
                <view v-for="(value, index) in payOptions" :key="index" class="btn-item flex_c flex_jc"
                    :class="value.class" @click="onpay(value.num)">
                    <view>{{ value.text }} </view>
                    <!-- #ifdef MP-WEIXIN -->
                    <view class="number">{{ value.price }} </view>
                    <!-- #endif -->
                    <!-- #ifndef MP-WEIXIN -->
                    <view class="number" :style="{ '--after-content': `'.${value.mantissa}'` }">{{
                        Math.floor(value.price)
                    }}
                    </view>
                    <!-- #endif -->
                </view>
            </view>

            <view v-else class="special_btn flex_c astrictBtn"
                :class="{ forbid_bg: AReward.userBetCount == 0 || AReward.userBetCountDaily == 0 }"
                @click=" AReward.userBetCount == 0 || AReward.userBetCountDaily == 0 ? (showDiscounts = true) : onpay(1, 2)">
                <view>立即抽赏</view>
            </view>
            <div class="inform">平台发货不设门槛！潮柜内提交发货申请后3-5个工作日安排发货。每单满5件包邮，不满5件需支付10元运费。</div>
        </view>
        <!-- #ifndef MP-WEIXIN -->
        <movable-area class="movable-draw">
            <movable-view v-if="chqShow" class="movable-ball" direction="all" :style="`left: ${ballLeft}; top:300rpx;`"
                @click="changeTop">
                <ball :afterTop="afterTop"></ball>
            </movable-view>
        </movable-area>
        <!-- #endif -->
        <!-- 支付 潮玩赏-->
        <x-pay @success="onClickDraw" ref="xPay" mtype="3" :probabilityShow="probabilityShow" />
        <!-- 详情弹窗 -->
        <gachaDetails ref="gachaDetails" />
        <discounts :visible="showDiscounts" @onDiscounts="onDiscounts" :themeName="AReward.gacha.themeName"
            :message="AReward.openMessage" />
        <duoyou ref="duoyou" @onDuoyou="onClickDuoyou" />
        <xPrize ref="refPrize" :prize="prize" @showPrize="onVisible" />
    </view>
</template>
<script>
import { post } from "@/utils/api.js";
import { uniShare } from "@/utils/fun.js";
import { mapMutations } from "vuex";
import { Postpayment } from "@/utils/pay.js";
import discounts from "@/components/modules/x-discounts.vue";
import ball from "@/page-activity/ball/ball.vue";
import xPay from "@/components/x-pay/index.vue";
import duoyou from "@/pages/product/modules/duoyou.vue";
import xPrize from "@/components/modules/x-prize";
export default {
    data() {
        return {
            AReward: {
                gacha: { themeName: "" },
                gachaBox: {},
                gachaAwards: [],
                gachaBoxAwards: [],
                openMessage: "",
            },
            gachaId: 0,
            price: 0, // 价格
            boxId: 0, // 当前箱号索引
            AllRewardsInfo: [], // 所有赏品信息
            gachainfo: { totalNum: 0 }, // 赏池信息
            cardCur: 0,
            probability: {},
            previewType: 1, // 1赏品概览 2抽赏记录
            conScrollTop: 0,
            recordList: [],
            sortList: [],
            isWelfare: false, //显示福利按钮
            couponId: 0,
            coverImage: "",
            spNum: 0,
            showDiscounts: false,
            showBtn: false,
            ballLeft: "",
            probabilityShow: [],
            payOptions: [{ num: 1, text: '一发入魂', price: 0, class: '' },
            { num: 3, text: '欧气三连', price: 0, class: '' },
            { num: 5, text: '五连绝世', price: 0, class: '' },
            { num: 10, text: '十连超神', price: 0, class: '' }],
            afterTop: 40,
            chqShow: false,
            mantissa: '00',
            cutPattern: 'passion',//普通模式  激情模式
            residual: 0, // 剩余赏品
            theme_id: '',
            getCouponType: "",
            currentPercent: 0, //当前下载百分比
            water: [{ name: '', num: 0, thumb: "" }],
            waters: '',
            ticket: "",
            noClick: true, //防抖挂载
            noClickTime: 1000, //防抖挂载
            waterList: {},
            prize: {
                width: 550,
                height: 752,
                imgWidth: 320,
                imgHeight: 320,
                bg: "https://img.chaoshewang.com/static/img/activity/chq_ls.png",
                btn: "https://img.chaoshewang.com/static/img/activity/an_ls.png",
            },
            activityOpen: false,
        };
    },
    components: {
        xPay,
        discounts,
        ball,
        duoyou,
        xPrize
    },
    computed: {
        conHeight() {
            let h = this.SystemInfo.screenHeight;
            let va = this.MBInfo();
            let th = va.height + va.top;
            let str = h - th + "px";
            return str;
        },
    },
    onLoad(da) {
        if (da.gacha_id || da.id) this.gachaId = da.gacha_id || da.id;
        else this.theme_id = da.theme_id

    },
    onShow() {
        this.ballLeft = uni.getSystemInfoSync().screenWidth + "px";
        this.loadDetail();
    },
    methods: {
        ...mapMutations(["UppayMessage"]),
        onScroll(e) {
            this.conScrollTop = e.detail.scrollTop;
        },
        async loadDetail() {
            let obj = {}
            if (this.theme_id !== '') obj = { theme_id: this.theme_id }
            else obj = { gacha_id: this.gachaId, box_index: this.boxId }
            post("v1/gacha/detail", obj).then((res) => {
                if (!res.code) {
                    const { gacha, gachaBox, gachaAwards } = res
                    this.AReward = res;
                    this.isWelfare = gacha.isWelfare;
                    this.showBtn = this.canShowGachaButton(res);
                    this.price = gacha.discountPrice ? gacha.discountPrice : gacha.price;
                    this.couponId = gacha.couponId;
                    this.boxId = gachaBox.boxIndex;
                    this.coverImage = gacha.coverImage;
                    this.AllRewardsInfo = gachaAwards;
                    this.gachainfo = { ...gacha, ...gachaBox };
                    this.gachaId = res.gacha.id;
                    // this.theme_id = res.gacha.themeId;
                    this.mantissa = this.decimalPart(this.price)
                    // this.residual = gachaBox.totalAwards - gachaBox.leftAwards 
                    this.residual = gachaBox.totalAwards == -1 ? gachaBox.consumedAwards : gachaBox.totalAwards - gachaBox.leftAwards
                    this.gachas();
                    this.getPrice()
                    this.chaoPlay(this.previewType);
                    this.getChaoyou()
                    this.getData()
                }
            });

        },
        getData(key = "") {
            post("v1/task/list", {
                // type: 2,
                key: 13,
            }).then(
                (res) => {
                    if (!res.code) {
                        if (res.activityOpen && res.data && res.data.length > 0) {
                            this.activityOpen = true
                            this.waterList = res.data[0];
                            this.water = res.data[0].subTask[0].award[0];
                            this.currentPercent = (Number(this.waterList.subTask[0].schedule.current) / Number(this.waterList.subTask[0].schedule.target)) * 100
                        }
                    }
                }
            );
        },
        innerClick() {
            post("v1/task/accept", { id: this.waterList.id, sub_id: this.waterList.subTask[0].id }).then(
                (res) => {
                    if (!res.code) {

                        this.$refs.refPrize.open(this.waterList.subTask[0].award, res.num);
                    } else uni.$u.toast(res.message);
                }
            );
        },
        onVisible() {
            uni.$u.toast("领取成功");
            this.getData();
        },
        getChaoyou() {
            post("v1/activity/chaoyou", { gacha_id: this.gachaId, box_index: this.boxId }).then((res) => {
                if (!res.code) {
                    if (Number(res.phaseId)) {
                        this.chqShow = true
                        const maxValue = Math.min(...res.cell.map(item => item.flowAmount));
                        const schedule = 40 - (((res.historyFlowAmount / maxValue) * 100) / 100) * 100
                        this.afterTop = Math.max(-60, Math.min(40, Math.ceil(schedule)))
                    }
                }
            });
        },
        // gachas() {
        //     let obj = {};
        //     for (const it of this.AllRewardsInfo) {
        //         if (obj[it.levelName]) obj[it.levelName] += it.totalNums;
        //         else obj[it.levelName] = it.totalNums;
        //     }
        //     let arr = [];
        //     for (const i of this.AllRewardsInfo) {
        //         arr.push({ levelIndex: i.levelIndex, levelName: i.levelName });
        //     }
        //     let map = new Map();
        //     for (let item of arr) {
        //         if (!map.has(item.levelIndex)) {
        //             map.set(item.levelIndex, item);
        //         }
        //     }
        //     let A = [...map.values()]; this.sortList = A; this.probability = obj;
        //     // const ratioSum = {}; // 按 levelName 累加 ratio
        //     // const levelIndexMap = new Map(); // 按 levelIndex 去重

        //     // this.AllRewardsInfo.forEach(item => {
        //     //     const { levelName, ratio = 0, levelIndex } = item;
        //     //     // 累加 ratio
        //     //     ratioSum[levelName] = (ratioSum[levelName] || 0) + ratio;

        //     //     // 记录唯一的 levelIndex 信息（取第一次出现的 levelName 即可）
        //     //     if (!levelIndexMap.has(levelIndex)) {
        //     //         levelIndexMap.set(levelIndex, { levelIndex, levelName });
        //     //     }
        //     // });
        //     // this.probability = ratioSum;
        //     // this.sortList = Array.from(levelIndexMap.values()); // 按 levelIndex 插入顺序
        //     // #ifdef APP
        //     if (getApp().globalData.AppTypeList[plus.runtime.channel] == 2) {
        //         const totalNum = this.gachainfo.totalNum;
        //         this.probabilityShow = Object.entries(ratioSum).map(([levelName, text]) => ({
        //             levelName,
        //             text: ((text / totalNum) * 100).toFixed(2)
        //         }));
        //     }
        //     // #endif
        // },
        gachas() {
            let obj = {};
            this.AllRewardsInfo.forEach(({ levelName, ratio = 0 }) => {
                // 使用高精度加法避免浮点数精度丢失
                if (obj[levelName]) {
                    obj[levelName] = Number(this.$h.Add(obj[levelName], ratio));
                } else {
                    obj[levelName] = ratio;
                }
            });
            let arr = [];
            for (const i of this.AllRewardsInfo) {
                arr.push({ levelIndex: i.levelIndex, levelName: i.levelName });
            }
            let map = new Map();
            for (let item of arr) {
                if (!map.has(item.levelIndex)) {
                    map.set(item.levelIndex, item);
                }
            }
            let A = [...map.values()];
            this.sortList = A;
            this.probability = obj;
            // #ifdef APP
            if (getApp().globalData.AppTypeList[plus.runtime.channel] == 2) {
                this.probabilityShow = Object.entries(obj).map(
                    ([levelName, text]) => ({
                        levelName,
                        text: (
                            this.$h.Div(text, this.gachainfo.totalNum) * 100
                        ).toFixed(2),
                    })
                );
            }
            // #endif
        },
        cardSwiper(e) {
            this.cardCur = e.detail.current;
        },
        switchover(va) {
            let totnum = this.AllRewardsInfo.length - 1;
            if (va == "last") {
                if (this.cardCur == 0) {
                    this.cardCur = totnum;
                } else this.cardCur--;
            }
            if (va == "next") {
                if (this.cardCur == totnum) {
                    this.cardCur = 0;
                } else this.cardCur++;
            }
        },
        // 获取中赏记录
        async chaoPlay(i) {
            this.recordList = [];
            this.previewType = i;
            post("v1/gacha/chao_play/record", { gacha_id: this.gachaId, box_index: this.boxId }).then((res) => {
                if (!res.code) {
                    let da = res.recordMap;
                    for (const ix in da) {
                        da[ix].records = da[ix].records.reverse();
                        da[ix].active = false;
                        da[ix].lengthNumber = da[ix].records.length;
                        if (ix == 28) {
                            if (da[ix].records.length) {
                                this.spNum = this.residual - da[ix].records[0].no;
                            } else this.spNum = 0;
                        }
                    }
                    let ins = this.sortList,
                        obj = [];
                    for (const it of ins) {
                        if (da[it.levelIndex]) {
                            obj.push({
                                ...da[it.levelIndex],
                                num: it.levelIndex,
                                name: it.levelName,
                            });
                        }
                    }
                    this.recordList = obj;
                }
            });
        },
        // 刷新
        refreshBtn() {
            uni.showLoading({
                title: "正在加载中...",
                mask: true,
            });
            this.loadDetail();
            // this.chaoPlay(this.previewType);
            setTimeout(function () {
                uni.hideLoading();
            }, 1200);
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
                    this.gachainfo.discount,
                    this.gachainfo.themeId
                );
                this.UppayMessage({
                    url: "v1/gacha/open",
                    discount: res.discount,
                });
            }
        },
        //中奖
        onClickDraw(res, showAnim, type) {
            if (type == 0) {
                if (!Array.isArray(res.awards)) return
                this.awardsList = res.awards;
                this.$refs.duoyou.open(res.awards, true, this.gachaId, this.boxId);
                // this.loadDetail();
                // this.chaoPlay(this.previewType);
                return;
            } else {
                this.onClickPrize(res.res.createPaymentReply.payId, true);
            }
        },
        onClickPrize(payId, showAnim) {
            const that = this;
            post("v1/gacha/open/result", { pay_id: payId }).then((res) => {
                if (!res.code) {
                    if (!Array.isArray(res.awards)) return
                    that.$refs.duoyou.open(res.awards, true, this.gachaId, this.boxId);
                    // that.loadDetail();
                    // that.chaoPlay(that.previewType);
                } else uni.$u.toast(res.message);
            });
        },
        ondetail(id) {
            this.gachaDetailsMethod(this, id);
        },
        onShare() {
            uniShare(
                {
                    tit: "潮游赏 : " + this.gachainfo.themeName,
                    path: "pages/product/chaowanshang",
                },
                { id: this.gachaId, index: this.boxId },
                this.coverImage
            );
        },
        onDiscounts() {
            this.showDiscounts = false;
        },
        changeTop() {
            const obj = { gacha_id: this.gachaId, box_index: 0 }
            this.goto("/page-activity/ocean/index", obj)
            // if (this.afterTop == -60) {
            // this.$refs.animation.open(this.AReward.goodLuckComeAwards, this.newFilePath, this.newGifPath, true, "chq", this.gachaId);
            // } else {
            //     this.goto("/page-activity/ball/record", {id:this.gachaId});
            // }
        },
        decimalPart(value) {
            if (value.toString().split(".").length > 1) {
                return value.toString().split(".")[1].padEnd(2, "0")
            } else {
                return '00'
            }
        },
        goChaoGui() {
            uni.setStorageSync("currentChange", 3);
            uni.reLaunch({
                url: "/pages/index/index",
            });
        },
        onClickDuoyou() {
            this.loadDetail();
            // this.chaoPlay(this.previewType);
        },
        oncut() {
            // 'common',//普通模式  passion激情模式
            this.cutPattern = this.cutPattern == 'common' ? 'passion' : 'common'
            if (this.cutPattern == 'passion') {
                this.payOptions = [{ num: 1, text: '一发入魂', price: 0, class: '' }, { num: 3, text: '欧气三连', price: 0, class: '' }, { num: 5, text: '五连绝世', price: 0, class: '' }, { num: 10, text: '十连超神', price: 0, class: '' },]
            } else {

                this.payOptions = [{ num: 5, text: '五连绝世', price: 0, class: '' }, { num: 10, text: '十连超神', price: 0, class: '' }, { num: 50, text: '五十爆燃', price: 0, class: 'btn-item1' }, { num: 100, text: '百连至臻', price: 0, class: 'btn-item2' },]
            }
            this.getPrice()
        },
        getPrice() {
            this.payOptions.map((item) => {
                const m = this.$h.Mul(item.num, this.price)
                item.price = m
                item.mantissa = this.decimalPart(m)
            });
        },
        getJl(array) {
            array.active = !array.active
        },
        getCoupon() {
            let name = this.waterList.subTask[0].award[0].name
            let wp = name.length > 8 ? name.slice(0, 8) + '...' : name
            let showText = `${this.waterList.subTask[0].name} 领${wp}`
            const leadIndex = showText.indexOf('领');
            let index = 0;
            if (this.getCouponType == 'long') {
                this.getCouponType = 'short'
                const deleteTimer = setInterval(() => {
                    if (this.ticket.length > 0) this.ticket = this.ticket.slice(0, -1);
                    else if (this.waters.length > 0) this.waters = this.waters.slice(0, -1);
                    else clearInterval(deleteTimer);
                }, 25);
            } else {
                this.getCouponType = 'long'
                setTimeout(() => {
                    const pushTimer = setInterval(() => {
                        if (index < showText.length) {
                            const currentChar = showText.charAt(index);
                            if (index < leadIndex) this.waters += currentChar;
                            else this.ticket += currentChar;
                            index++;
                        } else clearInterval(pushTimer)
                    }, 30);
                }, 400);
            }

        },
    },
};
</script>
<style lang='scss' scoped>
.chaowanshang {
    background-color: #969fde;
    background: url("https://img.chaoshewang.com/static/img/duoyou/bg.png");
    background-size: 100% 100%;
    height: 100vh;
    overflow-y: auto;


    .footBox {
        position: absolute;
        width: 100%;
        height: 200rpx;
        background: linear-gradient(180deg, rgba(45, 12, 23, 0) 0%, #2D0C17 35%, #2D0C17 100%);
        bottom: 0;
        padding: 0 22rpx;

        .inform {
            position: absolute;
            top: 102rpx;
            font-weight: 500;
            font-size: 18rpx;
            color: #9C8692;
            padding: 0 10rpx;
        }

        .coupon {
            position: absolute;
            width: 192rpx;
            height: 102rpx;
            left: 34rpx;
            bottom: 210rpx;
            border-radius: 24rpx;
            border: 2rpx solid #fff;
            padding: 8rpx;
            background:
                url("https://img.chaoshewang.com/static/img/chaowanshang/moie.png"),
                linear-gradient(90deg, #FF5DBD 0%, #FD4745 50%, #FC7B4B 100%);
            background-size: cover;
            background-repeat: no-repeat;
            z-index: 10000;

            .particulars {
                width: 610rpx;
                height: 90rpx;
                background: #FEDBDA;
                border-radius: 12rpx;
                padding: 8rpx;
                font-weight: bold;
                font-size: 24rpx;
                position: relative;

                .content {

                    // flex-wrap: nowrap;
                    .water {
                        margin-right: 8rpx;
                        color: #EB4930;

                    }

                    .name {
                        max-width: 180rpx;
                    }

                    .ticket {
                        // margin-right: 8rpx;

                        img {
                            width: 40rpx;
                            height: 40rpx;
                            margin: 0 8rpx 8rpx;
                        }

                        .number {
                            font-weight: bold;
                            color: #F35B03;
                            margin-right: auto;
                            font-size: 28rpx;
                            max-width: 60rpx;

                            &.active {
                                max-width: 80rpx;
                            }
                        }
                    }

                    .btn {
                        width: 96rpx;
                        height: 32rpx;
                        line-height: 32rpx;
                        text-align: center;
                        background: #F35B03;
                        border-radius: 16rpx;
                        font-weight: 500;
                        font-size: 20rpx;
                        color: #FFFFFF;
                        margin-left: auto;
                        margin-right: 8rpx;
                        opacity: 0.5;

                        &.active {
                            opacity: 1;
                        }
                    }
                }

                .progressBar {
                    height: 8rpx;
                    background: rgba(252, 123, 75, 0.2);
                    border-radius: 8rpx;
                    display: flex;
                    box-sizing: border-box;
                    margin-top: 14rpx;

                    .progress {
                        height: 100%;
                        background: linear-gradient(90deg, #30FEEF 0%, #FF954F 50%, #FF5DBD 100%);
                        border-radius: 4rpx;
                        position: relative;

                        .schedule {
                            width: 12rpx;
                            height: 12rpx;
                            background: #FFFFFF;
                            border-radius: 50%;
                            position: absolute;
                            right: 0;
                            top: 50%;
                            transform: translateY(-50%);

                        }
                    }
                }

            }


            .cut_ico {
                width: 44rpx;
                height: 44rpx;
                line-height: 44rpx;
                text-align: center;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 50%;
                font-size: 32rpx;
                color: #fff;
                margin-left: 4rpx;
                margin-right: 4rpx;
                flex-shrink: 0;
            }
        }

        .long {
            animation: squareToRect 1s ease-in-out 1 forwards;
            animation-fill-mode: forwards;
        }

        @keyframes squareToRect {

            /* 起始状态：正方形 */
            0% {
                width: 192rpx;
                height: 102rpx;
            }

            /* 结束状态：长方形 */
            100% {
                width: 686rpx;
                height: 102rpx;
                /* 仅改宽度；若要横竖变化，可改height: 100px; */
            }
        }

        .short {
            animation: short 1s ease-in-out 1 forwards;
            animation-fill-mode: forwards;
        }

        @keyframes short {

            /* 起始状态：正方形 */
            0% {
                width: 686rpx;
                height: 102rpx;
            }

            /* 结束状态：长方形 */
            100% {
                width: 192rpx;
                height: 102rpx;

            }
        }
    }

    .leftBox {
        width: 38rpx;
        height: 98rpx;
        background: rgba(0, 0, 0, 0.2);
        font-weight: bold;
        font-size: 20rpx;
        color: #FFFFFF;
        position: absolute;
        right: 0;
        top: 620rpx;
        text-align: center;
        display: grid;
        place-items: center;
        z-index: 10;
        border-radius: 12rpx 0 0 12rpx;
    }



    .cg {
        top: 736rpx;
    }
}

.top_Back {
    color: #FFFFFF;
    font-weight: bold;
    font-size: 30rpx;
    padding: 0 30rpx;

    &.borshad {
        box-shadow: 0 16rpx 16rpx -12rpx rgba(0, 0, 0, 0.3);
    }

    .Back_ico {
        width: 48rpx;
        height: 48rpx;
        margin-right: 8rpx;
    }

    .title {
        width: 400rpx;
        height: 48rpx;
        line-height: 48rpx;
    }
}

.notice-bar {
    width: 100%;
    position: fixed;
    top: 288rpx;
    left: 0;
}


.chaowanshang_con {
    padding-bottom: 150rpx;
}

.gashapon_machine {
    width: 662rpx;
    height: 702rpx;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 96rpx;
    background: url("https://img.chaoshewang.com/static/img/duoyou/pedestal.png");
    background-size: 100% 100%;

    .tit {
        background-color: rgba($color: #000, $alpha: 0.5);
        position: absolute;
        right: calc((100% - 200rpx) / 2);
        bottom: 20rpx;
        font-size: 22rpx;
        width: 200rpx;
        height: 30rpx;
        line-height: 30rpx;
        border-radius: 16rpx;
        text-align: center;
        color: #fff;
    }

    .ts {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        font-weight: 500;
        font-size: 18rpx;
        color: #FFFFFF;
        bottom: 152rpx;
    }

    .price {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 55rpx;
        font-weight: bold;
        font-size: 44rpx;
        color: #7A3641;


        &:before {
            content: "￥";
            font-size: 24rpx;
        }

        &:after {
            content: var(--after-content);
            font-size: 24rpx;
        }
    }
}

.dyzt {
    font-family: "多游字体", sans-serif;
}

.switch {
    width: 410rpx;
    height: 410rpx;
    position: absolute;
    bottom: 82rpx;
    right: calc((100% - 410rpx) / 2);
}

.switch_btn {
    width: 80rpx;
    height: 80rpx;
    position: absolute;
    top: 300rpx;
}



.switch_l {
    background: url("https://img.chaoshewang.com/static/img/duoyou/last.png");
    background-size: 100% 100%;
    left: 0rpx;
}

.switch_r {
    background: url("https://img.chaoshewang.com/static/img/duoyou/last.png");
    background-size: 100% 100%;
    transform: scaleX(-1);
    right: 0rpx;
}

.btns_2 {
    position: absolute;
    left: -20rpx;
    top: 638rpx;
    padding: 0;
    background-color: rgba($color: #000, $alpha: 0);

    &::after {
        border: none;
    }

    image {
        width: 48rpx;
        height: 48rpx;
    }
}

.bor {
    width: 1rpx;
    height: 104rpx;
    border: 1rpx solid #D8A7BD;
    opacity: 0.2;
    margin: 0 20rpx;
}

.z {
    width: 100%;
    text-align: end;
    padding-right: 22rpx;
    font-weight: 500;
    font-size: 24rpx;
    color: #fff;
}

.preview_box {
    width: 100%;
    padding: 26rpx 24rpx;
    background: #501C20;
    border-radius: 24rpx;
    position: relative;

    .p-tit {
        position: absolute;
        width: 100%;
        color: #fff;
        font-size: 28rpx;
        top: -72rpx;

        .tit_item {
            width: 196rpx;
            height: 72rpx;
            text-align: center;
            line-height: 72rpx;
            border-radius: 24rpx 24rpx 0 0;

            &.active {
                background: linear-gradient(180deg, #642A26 0%, rgba(100, 42, 38, 0) 100%);
                position: relative;
            }

            &.active::after {
                content: "";
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                width: 24rpx;
                height: 4rpx;
                background-color: #fff;
                border-radius: 1px;
            }


        }

        .spShow {
            margin-left: auto;
            padding-right: 40rpx;

            .num {
                font-weight: 500;
                font-size: 24rpx;
                color: #FFFFFF;
                color: #E28A25;
                margin-left: 8rpx;
            }
        }
    }

    .p-probability {
        margin-bottom: 28rpx;

        .badge {
            width: 105rpx;
            height: 38rpx;
        }

        .prob_num {
            text-align: center;
            font-size: 24rpx;
            color: #D09D9E;
            margin-top: -10rpx;
        }
    }

    .list-item {
        width: 100%;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 16rpx;
        margin-bottom: 16rpx;
        padding: 24rpx;
        position: relative;
        color: #FFFFFF;

        .p-img {
            width: 128rpx;
            height: 128rpx;
        }

        .badge {
            width: 100rpx;
            height: 32rpx;
            position: absolute;
            left: 38rpx;
            bottom: 18rpx;
        }

        .p-name {
            height: 127rpx;
            padding: 12rpx 0;
            font-size: 22rpx;
            width: calc(100% - 168rpx);

            .tit {
                font-weight: 500;
                font-size: 24rpx;
                color: #FFFFFF;
            }

            .price {
                font-weight: 500;
                font-size: 20rpx;
                color: #937C7E;

                .corr {
                    font-weight: bold;
                    font-size: 24rpx;
                    color: #F44935;

                    &::before {
                        content: "￥";
                        font-size: 16rpx;
                    }

                    &:after {
                        content: var(--after-content);
                        font-size: 16rpx;
                    }
                }
            }

        }
    }


    .spNumber {
        font-weight: 500;
        font-size: 24rpx;
        color: #FFFFFF;
        margin-bottom: 24rpx;

        .icon {
            width: 40rpx;
            height: 40rpx;
            background: url("https://img.chaoshewang.com/static/img/duoyou/icon_box.png");
            background-size: 100% 100%;
            margin-right: 8rpx;
        }

        .icon1 {
            width: 28rpx;
            height: 28rpx;
            background: url("https://img.chaoshewang.com/static/img/duoyou/sx.png");
            background-size: 100% 100%;
            margin-right: 8rpx;
        }

        .sx {
            font-weight: 500;
            font-size: 20rpx;
            width: 98rpx;
            height: 36rpx;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 18rpx;
        }
    }

    .lotteryRaffle {
        height: calc(100% - 180rpx);
        border-radius: 10rpx;
        overflow-y: auto;
        padding-bottom: 100rpx;
    }

    .r_item {
        background: #5D2028;
        border-radius: 24rpx;

        .lr_tit {
            font-weight: 500;
            font-size: 20rpx;
            color: #E9BCBD;
            padding: 10rpx 12rpx;
            border-radius: 10rpx 10rpx 0 0;

            .badge {
                width: 100rpx;
                height: 32rpx;
            }

            .icof {
                margin-left: 4rpx;
            }
        }

        .badgeA {
            background: linear-gradient(90deg, #B87B11 0%, rgba(184, 123, 17, 0.1) 100%);
        }

        .badgeC {
            background: linear-gradient(90deg, #9B8786 0%, rgba(155, 135, 134, 0.1) 100%);
        }

        .badgeSP {
            background: linear-gradient(90deg, #872F3F 0%, rgba(135, 47, 63, 0.1) 100%);
        }

        .badgeB {
            background: linear-gradient(90deg, #9B8786 0%, rgba(155, 135, 134, 0.1) 100%);
        }

        .lr_con {
            background: #6F2A2B;
            border-radius: 0rpx 0rpx 10rpx 10rpx;
            min-height: 150rpx;
            margin-bottom: 16rpx;

            &.row1 {
                height: 150rpx;
                overflow: hidden;
            }
        }

        .nullBox {
            height: 150rpx;
            font-weight: 500;
            font-size: 12px;
            color: #E9BCBD;
            line-height: 150rpx;
            text-align: center;
        }

        .lr_i {
            padding: 12rpx 14rpx;
            // padding: 12rpx 0;

            .lr_r {
                position: relative;

                .lr_img {
                    width: 126rpx;
                    height: 126rpx;
                }

                .nums {
                    white-space: nowrap;
                    padding: 0 12rpx;
                    height: 32rpx;
                    line-height: 32rpx;
                    background: #E28A25;
                    box-shadow: inset 4rpx 4rpx 4rpx 0rpx rgba(255, 248, 227, 0.25), inset -4rpx -4rpx 4rpx 0rpx rgba(255, 248, 227, 0.25);
                    border-radius: 18rpx;
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    bottom: 0;
                    font-weight: bold;
                    font-size: 18rpx;
                    color: #442914;
                    text-align: center;
                }
            }

            .lr_info {
                width: calc(100% - 166rpx);
                height: 126rpx;
                padding: 8rpx 0;
                font-weight: 500;
                font-size: 24rpx;
                color: #FFFFFF;

                .u_img {
                    width: 32rpx;
                    height: 32rpx;
                    margin-right: 8rpx;
                    border-radius: 50%;
                }

                .u_name {
                    font-weight: 500;
                    font-size: 20rpx;
                    color: #D09D9E;
                }

                .time {
                    font-weight: 500;
                    font-size: 20rpx;
                    color: #D09D9E;
                }
            }
        }
    }
}

.foot-btn {
    left: 0;
    width: 100%;
    position: relative;

    .cut {
        position: absolute;
        width: 172rpx;
        height: 52rpx;
        bottom: 100rpx;
        right: -26rpx;
        border-radius: 18rpx 0 0 18rpx;
        font-weight: bold;
        font-size: 24rpx;
        color: #FFFFFF;
        padding: 0 14rpx;
        letter-spacing: 2rpx;
        justify-content: flex-end;

        .passionImg {
            width: 32rpx;
            height: 32rpx;
            background: url("https://img.chaoshewang.com/static/img/chaowanshang/pattern.png"), radial-gradient(circle at center, rgba(255, 61, 13, 0.50) 0%, rgba(255, 61, 13, 0) 100%);
            background-size: 100% 100%;
            margin-left: 10rpx;
        }

        .commonImg {
            width: 32rpx;
            height: 32rpx;
            background: url("https://img.chaoshewang.com/static/img/chaowanshang/pattern.png"), radial-gradient(circle at center, rgba(13, 118, 255, 0.50) 0%, rgba(255, 61, 13, 0) 100%);
            background-size: 100% 100%;
            margin-left: 10rpx;
        }

    }

    .passion {
        background: linear-gradient(86deg, rgba(227, 146, 75, 0.7) 0%, rgba(227, 93, 75, 0.7) 100%);
        box-shadow: inset 0rpx 1rpx 0rpx 0rpx rgba(255, 255, 255, 0.2), -4rpx 4rpx 8rpx 0rpx rgba(255, 61, 13, 0.3);
    }

    .common {
        background: linear-gradient(86deg, rgba(62, 223, 252, 0.7) 0%, rgba(83, 132, 246, 0.7) 100%);
        box-shadow: inset 0rpx 1rpx 0rpx 0rpx rgba(255, 255, 255, 0.2), -4rpx 4rpx 8rpx 0rpx rgba(13, 118, 255, 0.3);
    }
}

.btn-item {
    width: 166rpx;
    height: 88rpx;
    background: #DC536C;
    border-radius: 24rpx;
    text-align: center;
    font-weight: bold;
    font-size: 24rpx;
    color: #FFFFFF;

    .number {
        &:before {
            content: "￥";
            font-size: 16rpx;
        }

        &:after {
            content: var(--after-content);
            font-size: 16rpx;
        }

    }
}

.btn-item1 {
    background: #E6B401;
}

.btn-item2 {
    background: #EC8917;
}

.card-swiper {
    width: 100% !important;
    height: 438rpx !important;
    position: absolute;
    top: 90rpx;
}

.card-swiper swiper-item {
    width: 100% !important;
    height: 440rpx !important;
    box-sizing: border-box;
}

.card-swiper swiper-item .png-scaling {
    transform: scale(0.6, 0.6);
    transition: all 1s ease 0s;
    will-change: transform;
}

.card-swiper swiper-item.cur .png-scaling {
    transform: scale(1, 1);
    transition: all 1.5s ease 0s;
    will-change: transform;
}

.image-banner {
    display: flex;
    align-items: center;
    justify-content: center;
}

.image-banner image {
    width: 410rpx;
    height: 410rpx;
}

.png-sussuspension2 {
    width: 410rpx;
    height: 410rpx;
    animation: suspension2 3s ease-in-out infinite;
}

@keyframes suspension2 {

    0%,
    100% {
        transform: translate(0, 0);
    }

    50% {
        transform: translate(0, 30rpx);
    }
}
</style>