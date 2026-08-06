<template>
    <view class="niudan" :style="{ paddingTop: MBInfo().top + 'px' }">
        <view class="top_Back flex_r flex_js flex_ac" :style="{ height: MBInfo().height + 'px' }">
            <!-- @click.stop="gateBack" -->
            <img src="https://img.shinemang.com/gachaStatic/back.png" @click="goBack" class="Back_ico" />
            <text class="title ellipsis">{{ marquee }}</text>
        </view>
        <!-- <view class="btns">
            <button open-type="share" class="btns_2 t_btn" @click="onShare">
                <image src="https://img.shinemang.com/gachaStatic/static/img/chaowanshang/cws_icon-share.png" />
            </button>
            <view class="btns_3 t_btn" @click="ondrawLog">
                <image src="https://img.shinemang.com/gachaStatic/static/img/chaowanshang/cws_icon-record.png" />
            </view>
        </view> -->
          
          <view class="niudan_con" :style="{ height: conHeight }">
            <view class="i_notice flex_r flex_ac">
                    <img src="https://img.shinemang.com/gachaStatic/niudanji/notice.png" class="m_ico" />
                    <u-notice-bar text="平台发货不设门槛!星仓内提交发货申请后7个工作日安排发货。每单满5件包邮，不满5件需支付10元运费。" :fontSize="12" color="#1A1A1A"
                        bgColor="rgba(0,0,0,0)"></u-notice-bar>
                </view>
            <view class="gashapon_machine_box">
                <view class="gachaProgress">
                     <view class="title">抽赏进度</view>
                     <view class="progress">
                     
                        <div :style="{width:(probability || 0) + '%'}" class="actiiveProgress"></div>
                        <text>{{ probability || 0 }}%</text>
                    </view>
                     <!-- <view class="total"></view> -->
                </view>
                <capsule-toys ref="capsuleToys" @eggPlay="onTry" />
                <!-- <view class="probability lp flex_r flex_ae">
                    <view class="h_num" :style="{ height: probability + '%' }"></view>
                    <div class="bubble l" :style="{ bottom: `${probability * 1.2 - 15}rpx` }">{{ (probability || 0) +  "%" }}</div>
                </view>
                <view class="probability rp flex_r flex_ae">
                    <view class="h_num" :style="{ height: probability + '%' }"></view>
                    <div class="bubble r flex_r flex_ac flex_jc" :style="{ bottom: `${probability * 1.2 - 15}rpx` }">
                        <view class="rNum">{{ (probability || 0) + "%" }}</view>
                    </div>
                </view> -->
                <!-- <view class="motif-tit ellipsis">{{ marquee }}</view> -->
                <!-- <image :src="gachainfo.coverThumb" class="gacha_img" mode="aspectFill" /> -->
                <view class="ico-t" @click="goto('/pages/common/rulepop', { val: 'GashaponRules' })">
                    <image
                        src="https://img.shinemang.com/gachaStatic/niudanji/ruleIcon.png"
                        mode="scaleToFill"
                    /><text>规则</text>
                </view>
               <view @click="toShare" class="ico-share ico-t" >
                    <image
                        src="https://img.shinemang.com/gachaStatic/niudanji/shareIcon.png"
                        mode="scaleToFill"
                    /><text>分享</text>
                </view>
                <!-- <view class="ico-r">点击试玩</view> -->
                <view class="tit">
                     <view class="price">
                        ￥{{ (discountPrice > 0 && discountPrice) || price || "0.00" }}/抽
                     </view>
                </view>
                <view class="multiple nb" v-if="gachainfo.costAwardMultiple > 1">
                    <view class="number">{{ gachainfo.costAwardMultiple }}</view>
                </view>
            </view>
            <view :style="{
                backgroundImage:`url(${previewType == 1 ? bgc3:bgc4})`
            }" class="preview_box">
                 <div class="preview_tabs">

                                 <div @click="changeTabs(1)" :class="['tab',previewType == 1 ? 'active':'']">
                                    <span>奖品预览</span>
                                 </div>
                                 <div @click="changeTabs(2)" :class="['tab',previewType == 2 ? 'active':'']">
                                    <span>中奖记录</span>
                                 </div>
                              </div>

                <!-- <view @click="ondrawLog" class="record">234234234</view> -->
                <view v-if="previewType == 1" style="padding-left: 24rpx;" class="box">
                    <view class="tab">
                      
                      <text class="amount">初始商品总数共：{{ (eggTwister.gachaBox &&
                            eggTwister.gachaBox.totalAwards)}}抽</text>
                    </view>
                   <scroll-view scroll-y class="p-list" @scroll="onScroll">
                    <view class="flex-container">
                        <view class="list-item" v-for="(item, index) in goodsList" :key="index"  @click=" ondetail(item)">
                            <img lazy-load :src="item.itemCover" class="p-img" />
                            <view class="p-name ellipsis">{{ item.itemName }}</view>
                            <view class="p-probability ellipsis" v-if="![42, 27, 50].includes(item.levelIndex)">{{
                                "概率：" + item.probability + "%" }}</view>
                           <view class="Lucky flex_r  flex_js " v-if="item.levelName == 'Lucky' && item.luckyNo">
                                <view class="type">{{ item.levelName }}</view>
                                <view class="sort">{{item.luckyNo}}赏</view>
                            </view> 
                            <img v-else class="ico3" :class="[item.levelName == '冲冲' ? 'rotated' : '']"
                                :src="`https://img.shinemang.com/gachaStatic/static/img/reward/ico_${item.levelName}.png`" />
                            <view v-if="item.levelName == 'Lucky' && item.luckyPhase"
                                class="schedule flex_r flex_jb flex_ac" @click.stop="onScheduleTips(item.luckyPhase)">
                                <view class="num">{{ item.luckyPhase }}%</view>
                                <view class="iocn"></view>
                            </view>
                        </view>
                    </view>
                </scroll-view>
                </view>
               <view style="height:790rpx;position: relative;" v-show="previewType == 2">
                 <draw-log-other  @onRefresh="onRefresh" ref="drawLogOther" :drawType="2"  />
               </view>
                <!-- <view class="p-tit flex_r flex_jb flex_ac">
                    <view class="l">奖品概览</view>
                    <view class="r" v-if="eggTwister.gachaBox">{{
                        "本池初始商品总数共：" +
                        (eggTwister.gachaBox &&
                            eggTwister.gachaBox.totalAwards) +
                        "抽"
                    }}
                    </view>
                </view> -->
              
            </view>
            <view v-if="gachainfo && gachainfo.id" style="padding-top: 10rpx;" class="actionBtn">
                 <view class="foot-btn flex_r flex_jc" v-if="isWelfare">
                <view class="btn-item" @click="onpay(1)">抽奖</view>
            </view>
            <view class="special_btn1 flex_c" v-else-if="showBtn"
                @click="onpay(eggTwister.gacha.specialDiscountLimitBetNum, 1)">
                <view class="">立即抽赏</view>
                <view class="number">￥{{
                    (
                        $h.Mul(
                            eggTwister.gacha.specialDiscountLimitBetNum - 1,
                            eggTwister.gacha.discountPrice
                                ? eggTwister.gacha.discountPrice
                                : eggTwister.gacha.price
                        ) + eggTwister.gacha.specialDiscountPrice
                    ).toFixed(2)
                }}<span class="num">￥{{
                        $h.Mul(
                            eggTwister.gacha.specialDiscountLimitBetNum,
                            eggTwister.gacha.discountPrice
                                ? eggTwister.gacha.discountPrice
                                : eggTwister.gacha.price
                        )
                    }}
                    </span></view>
                <view class="hubble-bubble">
                    首抽￥{{ eggTwister.gacha.specialDiscountPrice }}（{{
                        numberToChinese(
                            eggTwister.gacha.specialDiscountLimitBetNum
                        )
                    }}抽起）</view>
            </view>
            <view class="foot-btn flex_r flex_jb flex_ac"
                v-else-if="eggTwister.userBetCount == -1 && eggTwister.userBetCountDaily == -1">
                <view v-if="userInfo.featureConfig && (userInfo.featureConfig.biggerBetNum == 'FeatureFlag_Enable' ||   userInfo.featureConfig.biggerBetNum == 'FeatureFlag_AdminOpen')" class="cut flex_r flex_ac" @click="oncut" :class="[cutPattern]">
                    <!-- <view>{{ cutPattern == 'common' ? '普通' : "激情" }}模式</view> -->
                    <view :class="[cutPattern + 'Img']"> </view>
                </view>
                <!-- <img class="cut " :src="`https://img.shinemang.com/gachaStatic/static/img/cw-new/${cutPattern}.png`"  :key="cutPattern"   @click="oncut" /> -->
                <!-- { forbid_btn: probability > 10 && value.text == '全包' } -->
                <view v-for="(value, index) in payOptions" :key="index" class="btn-item"
                    :class="[value.className, {forbid_btn: probability > 10 && value.text == '全包'}]"
                    
                    @click="probability > 10 && value.text == '全包'?tipQb(): onpay(value.num)">
                    {{ value.text }}</view>
            </view>
            <view  class="special_btn1 flex_c" v-else :class="{
                forbid_bg:
                    eggTwister.userBetCount == 0 ||
                    eggTwister.userBetCountDaily == 0,
            }" @click="
                eggTwister.userBetCount == 0 ||
                    eggTwister.userBetCountDaily == 0
                    ? (showDiscounts = true)
                    : onpay(1, 2)
                ">
                <view class="">立即抽赏</view>
            </view>
            </view>
        </view>
        <!-- 过场动画 -->
        <u-popup :show="inAdvance" :overlay="cartoonShow" :safeAreaInsetBottom="false" bgColor="transparent">
            <view :class="['cartoon_con', { opacity: !cartoonShow }]" v-if="inAdvance">
                <view class="svga_it">
                    <c-svga ref="cSvgaRef" :src="cartoonsrc" :loops="1" :autoPlay="false" :isOnChange="true"
                        @finished="onFinished" @percentage="onPercentage" @loaded="onLoaded" width="100%"
                        height="100%" />
                </view>
                <view class="awards_box" v-if="percentage > 85 && isRun">
                    <view class="awards flex_r flex_jc">
                        <view class="ni">
                            <img :src="spList[WinnInx].coverImage ||
                                spList[WinnInx].itemCover
                                " class="ni_img" />
                            <view class="ni_name ellipsis">{{
                                spList[WinnInx].itemName
                            }}</view>
                        </view>
                    </view>
                    <view class="msg" v-if="percentage > 95">{{ hint }}</view>
                    <!-- <view class="awards_share flex_r flex_jc flex_ac" @click="shareType = 1"
                        v-if="spList[WinnInx].levelIndex == 28">
                        <view class="share_img"></view>
                        <view class="share_text">炫耀一下</view>
                    </view> -->
                    <view class="share flex_r flex_ac" v-if="shareType">
                        <view @click="onShareType(2)">
                            <img class="icon" src="https://img.shinemang.com/gachaStatic/static/img/home/xcx.png" />
                            <view>小程序</view>
                        </view>
                        <view @click="onShareType(3)">
                            <img class="icon" src="https://img.shinemang.com/gachaStatic/static/img/home/pyq.png" />
                            <view>朋友圈</view>
                        </view>
                        <div @click="shareType = 0" class="btn icof"> &#xe607;</div>
                    </view>
                </view>
                <view class="c_btn flex_r flex_jse flex_ac" v-if="percentage > 95">
                    <view class="c_btn_item" @click="toDetails" v-if="WinnNum > 0">跳过动画</view>
                    <view class="c_btn_item cor9" @click="next">
                        <span>继续</span>
                        <view class="r_num flex_r flex_ae" v-if="WinnNum > 0">
                            <img src="https://img.shinemang.com/gachaStatic/static/img/niudan/ball.png" class="ico1" />
                            <view>x{{ WinnNum }}</view>
                        </view>
                    </view>
                </view>
            </view>
        </u-popup>
     
        <!-- <movable-area class="movable-draw">
            <movable-view v-if="chqShow" class="movable-ball" direction="all" :style="`left: ${ballLeft}; top:450rpx;`"
                @click="changeTop">
                <ball :afterTop="afterTop"></ball>
            </movable-view>
        </movable-area> -->
      
        <view class="mask" v-if="show"></view>
        <!-- 详情弹窗 -->
        <gachaDetails ref="gachaDetails" />
        <!-- 支付 -->
        <x-pay @success="onClickDraw" ref="xPay" mtype="2" :probabilityShow="probabilityShow" />
        <!-- 中赏记录 -->
        <draw-log-else ref="drawLog" :drawType="2"  @onRefresh="onRefresh"  />
        <discounts :visible="showDiscounts" @onDiscounts="onDiscounts" :themeName="eggTwister.gacha.themeName"
            :message="eggTwister.openMessage" />
        <scheduleTips :LuckyVisible="LuckyVisible" :scheduleNum="scheduleNum" @onTips="LuckyVisible = false" />
       <show-modal></show-modal>
        <!-- 抽赏动效 -->
        <!-- <dynamic-effect ref="animation" @childData="handleChildData" /> -->
        <!-- <xPrize ref="refPrize" :prize="prize" /> -->
    </view>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import RateRandom from "rate-random"; // 概率取值
import { post } from "@/utils/api.js";
import xPay from "@/components/x-pay/index.vue";
import capsuleToys from "@/components/capsuleToys/index.vue";
import drawLogElse from "@/pages/product/modules/drawLogElse.vue";
import drawLogOther from "@/pages/product/modules/drawLogOther.vue";
import cSvga from "@/components/c-svga/c-svga.vue";
import { playDede, saveFileToLocal, uniShare, compressImg, groupBySum, itemDetails, vibratePhone } from "@/utils/fun.js";
import { Postpayment } from "@/utils/pay.js";
import discounts from "@/components/modules/x-discounts.vue";
import ball from "@/page-activity/ball/ball.vue";
import bgc3 from '@/static/bgc3.png'
import bgc4 from '@/static/bgc4.png'
// import dynamicEffect from "@/pages/product/modules/dynamicEffect.vue";
// import xPrize from "@/components/modules/x-prize";
import scheduleTips from "@/pages/product/modules/scheduleTips.vue";
import { MGTV_Channel } from "@/utils/mgtv";
const ANIMATION_DURATION = 3000;    // 摇球动画时长（ms）
const PRE_ADVANCE_DELAY = 2200;      // 预加载延迟
export default {

    data() {
        return {
            MGTV_Channel:MGTV_Channel,
            bgc3:bgc3,
            bgc4:bgc4,
            eggTwister: {
                gacha: { themeName: "" },
                gachaBox: {},
                gachaAwards: [],
                gachaBoxAwards: [],
                openMessage: "",
            },
            show: false,
            gachainfo: {},
            gachaId: 0,
            marquee: "",
            price: 0,
            discountPrice: 0,
            boxIndex: 0,
            istry: false,
            cartoonShow: false, // 过场动画
            inAdvance: false, // 过场动画
            cartoonsrc: "https://img.shinemang.com/gachaStatic/static/img/cartoon/cartoon.svga",
            newFilePath: "",
            percentage: 0, // 动画播放进度
            Winning: [], // 抽中的赏品
            WinnInx: 0, // 正在展示的
            isRun: true,
            isWelfare: false, //福利
            couponId: 0, //福利券
            hint: "赏品已自动放入星仓，可在星仓查看~",
            coverImage: "",
            spList: [],
            showDiscounts: false,
            showBtn: false,
            goodsList: [],
            shareType: 0,
            probabilityShow: [],
            payOptions: [{ num: 1, className: "", text: '一抽' },
            { num: 5, className: "", text: '五抽' },
            { num: 10, className: "", text: '十抽' },
            { num: 50, className: "btn-item4", text: '五十抽' }],
            ballLeft: "",
            afterTop: 40,
            chqShow: false,
            cutPattern: 'passion',//普通模式  激情模式
            // prize: {
            //     width: 646,
            //     height: 764,
            //     imgWidth: 240,
            //     imgHeight: 240,
            //     bg: "https://img.shinemang.com/gachaStatic/static/img/duoyou/knowBg.png", //背景
            //     btn: "https://img.shinemang.com/gachaStatic/static/img/duoyou/knowBtn.png", //按钮图片
            // },
            // cartoonsrc2:
            //     "https://img.shinemang.com/gachaStatic/static/img/cartoon/700.gif",
            // newGifPath: "", //Gif动画资源地址
            theme_id: '',
            vibrat: false,
            LuckyVisible: false,
            scheduleNum: null,
            previewType:1
        };
    },
    components: {
        xPay,
        capsuleToys,
        drawLogElse,
        cSvga,
        discounts,
        ball,
        scheduleTips,
        drawLogOther
        // dynamicEffect,
        // xPrize
    },
    computed: {
        ...mapState(["userInfo"]),
        probability() {
            let num =
                (this.gachainfo.leftAwards / this.gachainfo.totalAwards) * 100;
            return num < 10 ? num.toFixed(2) : Math.floor(num);
        },
        conHeight() {
            let h = this.SystemInfo.screenHeight;
            let va = this.MBInfo();
            let th = va.height + va.top;
            let str = h - th + "px";
            return str;
        },
        WinnNum() {
            return this.spList.length - 1 - this.WinnInx;
            // return this.Winning.length - 1 - this.WinnInx;
        },
    },
    onLoad(da) {
        if (da.gacha_id || da.id) this.gachaId = da.gacha_id || da.id;
        else this.theme_id = da.theme_id
    },
    onShow() {
        this.leftt = uni.getSystemInfoSync().screenWidth + "px";
        this.ballLeft = uni.getSystemInfoSync().screenWidth - 80 + "px";
        this.loadDetail();
        const cacheMode = uni.getStorageSync('lotteryMode');
        if (cacheMode == 'common') {
            this.cutPattern = 'common'
            this.payOptions = [{ num: 50, className: "btn-item4", text: '五十抽' },
            { num: 100, className: "btn-item4", text: '一百抽' },
            { num: 200, className: "btn-item4", text: '二百抽' },
            { num: this.gachainfo.leftAwards, className: "btn-item5", text: '全包' }]
        }
    },
    created() {
        this.saveFile();
    },
    methods: {
        tipQb(){
               this.$showModal({
                        title: "全包",
                        content: `全包`,
                        hint: '',
                        success:(res1)=> {
                            if (res1.confirm) {
                           
                            }
                        },
                    });
        },
           changeTabs(type){
            if(type == this.previewType) return;
            
          this.previewType = type
          if(this.previewType == 2){
              let type1 = this.gachainfo.leftAwards !== 0 ? true : false;
              console.log(this.$refs.drawLogOther)
            this.$refs.drawLogOther.open(
                this.gachaId,
                this.eggTwister.gachaBox.boxIndex, -1, type1
            );
          }
        },
         toShare(){
            if(window.mgtv){
                 let channel = uni.getStorageSync('channel') ?  uni.getStorageSync('channel') : 'Channel_Official'
                mgtv.showShareMenu({
                    title: "扭蛋赏 : " + this.gachainfo.themeName,
                     typeList: ["moments", "wechat", "weibo", "qq", "qzone", "fantuan"],
                    url:`https://app.mgtv.com/mgmp-share/?appid=mgkgw1fkyk9fw95nw&host=mgtv&path=${encodeURIComponent("gachaName=ndj&gachaId="+this.gachaId+"&inviteCode="+this.userInfo.inviteCode +'&channel='+channel)}`
                })
            }
        },
        ...mapMutations(["UppayMessage"]),
        async saveFile() {
            this.newFilePath = await saveFileToLocal(
                "capsuleToysSvga",
                this.cartoonsrc
            );
            // this.newGifPath = await saveFileToLocal(
            //     "chaowsGif",
            //     this.cartoonsrc2
            // );
        },
        async loadDetail() {
            let obj = {}
            if (this.theme_id !== '') obj = { theme_id: this.theme_id }
            else obj = { gacha_id: this.gachaId, box_index: this.boxIndex, }
            post("v1/gacha/detail", obj).then((res) => {
                if (!res.code) {
                    const { gacha, gachaBox, gachaAwards } = res
                    gachaAwards.map(item => {
                        if (![27, 42, 45, 50].includes(item.levelIndex)) {
                            item.probability = Math.floor((item.totalNums / gachaBox.totalAwards) * 100000) / 1000
                        }
                    })
                    this.eggTwister = res;
                    this.goodsList = gachaAwards.length > 16 ? gachaAwards.slice(0, 16) : gachaAwards;
                    this.showBtn = this.canShowGachaButton(res);
                    this.gachainfo = { ...gacha, ...gachaBox };
                    this.isWelfare = gacha.isWelfare;
                    this.marquee = gacha.themeName;
                    this.price = gacha.price;
                    this.gachaId = gacha.id;
                    this.discountPrice = gacha.discountPrice;
                    this.boxIndex = gachaBox.boxIndex;
                    this.couponId = gacha.couponId;
                    this.coverImage = gacha.coverImage;
                    // #ifdef APP
                    if (getApp().globalData.AppTypeList[plus.runtime.channel] == 2) this.probabilityShow = groupBySum(res.gachaAwards);
                    // #endif

                }
            });
            // post("v1/activity/chaoyou", { gacha_id: this.gachaId, box_index: this.boxIndex }).then((res) => {
            //     if (!res.code) {
            //         if (Number(res.phaseId)) {
            //             this.chqShow = true
            //             const maxValue = Math.min(...res.cell.map(item => item.flowAmount));
            //             const schedule = 40 - (((res.historyFlowAmount / maxValue) * 100) / 100) * 100
            //             this.afterTop = Math.max(-60, Math.min(40, Math.ceil(schedule)))
            //         }
            //     }
            // });

        },
        onpay(num, special = 0) {
         
            let res = Postpayment(this.eggTwister, num, special);
            if (res && res.m > 0) {
                this.$refs.xPay.open(
                    res.m,
                    res.number,
                    getApp().globalData.RechargeType.Gacha,
                    this.gachaId,
                    this.couponId,
                    this.eggTwister.gachaBox.boxIndex,
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
        onClickDraw(res, showAnim, type) {
            if (type == 0) {
                if(res.awards && res.awards.length>0){
                    res.awards[0].requestId = res.requestId
                }
                this.Winning = res.awards;
                this.$refs.capsuleToys.eggPlay(1); // 执行摇球动画3s
                this.onClickPay(showAnim);
                return;
            } else {
                this.onClickPrize(res.res.createPaymentReply.payId, showAnim);
            }
        },
        onClickPrize(payId, showAnim) {
            post("v1/gacha/open/result", { pay_id: payId }).then((res) => {
                if (!res.code) {
                   if(res.awards && res.awards.length>0){
                    res.awards[0].requestId = res.requestId
                   }
                    this.Winning = res.awards;
                    this.onClickPay(showAnim);
                } else uni.$u.toast(res.message);
            });
        },
        // onClickPay(showAnim) {
        //     console.log(showAnim, '是否开启');

        //     let a1 = [];
        //     a1 = this.Winning.filter((item, index) => {
        //         if ([28].includes(item.levelIndex)) {
        //             this.spList.push(item);
        //             this.vibrat = true
        //         } else {
        //             return item;
        //         }
        //     });
        //     a1 = a1.sort((a, b) => a.levelIndex - b.levelIndex);
        //     if (!showAnim) {
        //         this.spList = [...this.spList, ...a1];
        //     }
        //     this.$refs.capsuleToys.eggPlay(1); // 执行摇球动画3s
        //     this.loadDetail();
        //     this.$sl("extractAwards", {
        //         da: this.Winning,
        //         path: "pages/product/niudan",
        //         id: this.gachaId,
        //         index: this.eggTwister.gachaBox.boxIndex,
        //     });
        //     setTimeout(() => {
        //         this.inAdvance = true;
        //     }, 2200);


        //     setTimeout(() => {
        //         let a;
        //         if (this.spList.length && showAnim) {
        //             a = 2;
        //         } else {
        //             a = this.verdictBig(showAnim ? this.Winning : [this.Winning[0]]) ? 2 : 1;
        //         }
        //         playDede(a);
        //         console.log(a);//2是大赏
        //     }, 3000);
        //     // a是2音效不一样
        //     setTimeout(() => {
        //         this.show = false;
        //         if (showAnim && this.spList.length == 0) {
        //             if (uni.$u.page() == "/pages/index/index")
        //                 this.goto("/pages/product/rewardResultDetails");
        //             else
        //                 uni.$u.route({
        //                     type: "redirect",
        //                     url: "/pages/product/rewardResultDetails",
        //                 });
        //         } else this.cartoonShow = true;
        //     }, 3000);
        // },

        // 常量定义（根据实际动画时长调整）


        async onClickPay(showAnim) {

            // 重置临时状态（避免累积）
            this.spList = [];
            this.vibrat = false;

            const winningList = this.Winning;                // 抽奖结果数组
            const GRAND_PRIZE_LEVEL = 28;                     // 大赏等级

            // 1. 分离大赏与非大赏
            const grandPrizes = winningList.filter(item => item.levelIndex === GRAND_PRIZE_LEVEL);
            const otherPrizes = winningList.filter(item => item.levelIndex !== GRAND_PRIZE_LEVEL)
                .sort((a, b) => a.levelIndex - b.levelIndex);

            // 大赏强制加入spList（无论是否开启动画）
            this.spList.push(...grandPrizes);
            this.vibrat = grandPrizes.length > 0;  // 直接赋值，无论长度如何
            // 2. 根据showAnim决定是否将非大赏加入spList
            if (!showAnim) {
                // 关闭动画时，所有奖品都会进入动画序列
                this.spList.push(...otherPrizes);
            }
            // 开启动画时，spList仅包含大赏，非大赏暂存于otherPrizes供后续使用

            // 3. 触发摇球动画（固定3秒）
            this.$refs.capsuleToys.eggPlay(1);

            // 4. 异步加载详情与统计（不阻塞后续）
            this.loadDetail();
            this.$sl("extractAwards", {
                da: winningList,
                path: "pages/product/niudan",
                id: this.gachaId,
                index: this.eggTwister.gachaBox.boxIndex,
            });

            // 5. 提前设置标记（2.2秒后）
            setTimeout(() => {
                this.inAdvance = true;
            }, PRE_ADVANCE_DELAY);

            // 6. 等待动画结束（3秒后执行音效与界面跳转）
            setTimeout(() => {
                this.handlePostAnimation(showAnim, winningList, otherPrizes);
            }, ANIMATION_DURATION);
        },

        /**
         * 动画结束后的处理：音效与界面跳转
         */
        handlePostAnimation(showAnim, winningList, otherPrizes) {
            // 判断是否存在大赏
            const hasGrandPrize = winningList.some(item => item.levelIndex === 28);

            // 确定音效类型（1=普通，2=特殊）
            let soundType = 1;
            if (hasGrandPrize) {
                soundType = 2; // 开启动画且有大赏 → 直接使用音效2
            } else {
                soundType = 1;
            }
            playDede(soundType);

            // 界面跳转/显示卡通动画
            this.show = false;
            if (showAnim && this.spList.length === 0) {
                // 开启动画且无大赏 → 直接跳转到结果详情页
                this.navigateToResultDetail();
            } else {
                // 其他情况（包括关动画，或开启动画但有大赏）显示内置卡通动画
                this.cartoonShow = true;
            }
        },

        /**
         * 跳转到结果详情页（根据当前页面决定跳转方式）
         */
        navigateToResultDetail() {
            const currentPage = uni.$u.page();
            const targetUrl = "/pages/product/rewardResultDetails";
            if (currentPage === "/pages/index/index") {
                this.goto(targetUrl);
            } else {
                uni.$u.route({ type: "redirect", url: targetUrl });
            }
        },
        ondetail(data) {
            itemDetails(data, this.$refs.gachaDetails, '初始获奖概率', this.price)
        },
        ondrawLog() {
            let type = this.gachainfo.leftAwards !== 0 ? true : false
            this.$refs.drawLog.open(
                this.gachaId,
                this.eggTwister.gachaBox.boxIndex, -1, type
            );
        },
        // 试玩
        onTry() {
            this.hint = "试玩结果仅供参考~";
            this.show = true;
            this.istry = true;
            let i = this.getRandomInt();
            let da = this.eggTwister.gachaAwards[i];
            da.requestId=''
            this.Winning = [da];
            this.spList = [da];
            this.$sl("extractAwards", {
                da: [da],
                path: "pages/product/niudan",
                id: this.gachaId,
            });
            setTimeout(() => {
                let a = this.verdictBig([da]) ? 2 : 1;
                playDede(a);
            }, 3000);
            setTimeout(() => {
                this.inAdvance = true;
            }, 2200);
            setTimeout(() => {
                this.show = false;
                this.cartoonShow = true;
            }, 3000);
        },
        getRandomInt() {
            let arr = this.eggTwister.gachaAwards,
                num = this.gachainfo.totalAwards,
                obj = {};
            for (const i in arr) {
                if (arr[i].levelType != 1) obj[i] = "0%";
                else {
                    let va = this.$h.Div(arr[i].totalNums, num);
                    obj[i] = va * 100 + "%";
                }
            }
            return RateRandom.rate(obj);
        },
        onLoaded() {
            this.$refs.cSvgaRef.call("startAnimation");
            if (this.vibrat) vibratePhone(3000)
            // console.log("动画加载完成，播放时回调");
        },
        onPercentage(va) {
            if (va > 0.85) this.percentage = va * 100;
        },
        onFinished() {
            // console.log("动画停止播放时回调");
        },
        next() {
            this.isRun = false;
            this.WinnInx++;
            this.hint = "赏品已自动放入星仓，可在星仓查看~";
            if (this.WinnInx >= this.spList.length) {
                this.toDetails();
            }
            setTimeout(() => {
                if (this.spList < this.spList.length) {
                    let a = this.verdictBig([this.spList[this.WinnInx]])
                        ? 2
                        : 1;
                    playDede(a);
                }
                this.isRun = true;
            }, 600);
        },
        toDetails() {
            this.cartoonShow = false;
            uni.$u.route({
                type: "redirect",
                url: "/pages/product/rewardResultDetails",
                params: {
                    isdemo: this.istry,
                },
            });
        },
        onShare() {
            uniShare(
                {
                    tit: "潮魂扭蛋赏 : " + this.gachainfo.themeName,
                    path: "pages/product/niudan",
                },
                { id: this.gachaId, index: this.boxIndex },
                this.coverImage
            );
        },
        verdictBig(arr) {
            let result = [1, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37];
            for (const i of arr) {
                if (result.includes(i.levelIndex)) return true;
            }
            return false;
        },
        onDiscounts() {
            this.showDiscounts = false;
        },
        onScroll(e) {
            if (
                (e.detail.scrollTop == 100 || e.detail.scrollTop > 100) &&
                this.goodsList.length !== this.eggTwister.gachaAwards.length
            ) {
                this.goodsList = [
                    ...this.goodsList,
                    ...this.eggTwister.gachaAwards.slice(
                        16,
                        this.eggTwister.gachaAwards.length
                    ),
                ];
            }
        },
        onShareType(type) {
            const { coverThumb, itemName, itemCover } =
                this.spList[this.WinnInx];
            if (type == 2) {
                uniShare(
                    {
                        tit: `我在娱乐芒星赏APP抽中了${itemName}`,
                        path: "pages/product/niudan",
                    },
                    { id: this.gachaId, index: this.boxIndex },
                    coverThumb || itemCover
                );
            } else {
                let type1 = {
                    quality: 10,
                    width: "100px",
                    height: "auto",
                };
                let type2 = {
                    scene: "WXSceneTimeline",
                    type: 0,
                    href: "http://www.chaoshewang.com",
                    title: `我在娱乐芒星赏APP抽中了“${itemName}”赶紧来吸吸欧气吧！！！`,
                };
                compressImg(
                    coverThumb || itemCover,
                    type1,
                    type2,
                    { itemName, path: "pages/product/niudan" },
                    { id: this.gachaId, index: this.boxIndex }
                );
            }
            this.shareType = 0;
        },
        changeTop() {
            const obj = { gacha_id: this.gachaId, box_index: 0 }
            this.goto("/page-activity/ocean/index", obj)
        },
        oncut() {
            this.cutPattern = this.cutPattern == 'common' ? 'passion' : 'common'
            uni.setStorageSync('lotteryMode', this.cutPattern);
            if (this.cutPattern == 'passion') {
                this.payOptions = [{ num: 1, className: "", text: '一抽' },
                { num: 5, className: "", text: '五抽' },
                { num: 10, className: "", text: '十抽' },
                { num: 50, className: "btn-item4", text: '五十抽' }]
            } else {
                this.payOptions = [{ num: 50, className: "btn-item4", text: '五十抽' },
                { num: 100, className: "btn-item4", text: '一百抽' },
                { num: 200, className: "btn-item4", text: '二百抽' },
                { num: this.gachainfo.leftAwards, className: "btn-item5", text: '全包' }]
            }
        },
        onScheduleTips(num) {
            this.LuckyVisible = true
            this.scheduleNum = num
        },
        goBack() {
            uni.setStorageSync('lotteryMode', '')
            let routes = getCurrentPages();
            if (routes.length > 1) {
                uni.navigateBack({
                    delta: 1,
                    fail() {
                        goto('/pages/index/index')
                    }
                })
            } else {
                uni.reLaunch({
                    url: '/pages/index/index'
                });
            }
        },
         onRefresh(){
            this.loadDetail()
        }
    },
};
</script>
<style lang='scss' scoped>
.preview_tabs{
    width: 100%;
    height: 80rpx;
    display: flex;
    >.tab{
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28rpx;
        color: #fff;
        position: relative;
        span{
            position: relative;
            z-index: 3;
        }

        &.active{
            color: #1A1A1A;
            font-size: 32rpx;

            &::after{
                position: absolute;
                content:'';
                width: 128rpx;
                    height: 16rpx;
                    background: linear-gradient( 90deg, #31E597 0%, #40E0EA 100%);
                    border-radius: 0rpx 0rpx 0rpx 0rpx;
                    bottom: 15rpx;
            }
        }
    }
}

.mask {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100%;
    height: 100vh;
    background: rgba(255, 255, 255, 0);
    display: flex;
    justify-content: center;
    align-items: center;

}

.niudan {
    background-image: url("https://img.shinemang.com/gachaStatic/niudanji/niudanji.png");
    background-size: 100% 100%;
    overflow-y: auto;
    height: 100vh;
    // padding-bottom: 136rpx;
}

.top_Back {
    color: #000000;
    font-size: 36rpx;
    font-weight: bold;
    padding: 0 30rpx;

    .Back_ico {
        width: 48rpx;
        height: 48rpx;
        margin-right: 24rpx;
    }
    .title{
        max-width: 400rpx;
    }
}

.btns {
    position: relative;
    z-index: 1;

    .t_btn {
        width: 72rpx;
        height: 72rpx;
        background-color: rgba($color: #000, $alpha: 0);
        position: absolute;

        image {
            width: 72rpx;
            height: 72rpx;
        }
    }

    .btns_2 {
        left: 36rpx;
        top: 28rpx;
        padding: 0;

        &::after {
            border: none;
        }
    }

    .btns_3 {
        right: 36rpx;
        top: 28rpx;
    }
}

.niudan_con {
    width: 100%;
    height: calc(100% - 190rpx);
    overflow-y: auto;
    padding: 30rpx 0;
    position: relative;
    padding-bottom: 150rpx;


}

.i_notice {
    width: 100%;
    height: 56rpx;
    // border-radius: 28rpx;
    background: rgba(255, 255, 255, 0.5);
    // transform: translateX(-50%);
    // position: absolute;
    // top: 280rpx;
    // left: 50%;
    z-index: 1;
    padding: 0 32rpx;

    .m_ico {
        width: 32rpx;
        height: 32rpx;
    }
}

.gashapon_machine_box {
    // padding: 0 30rpx 10rpx;
    position: relative;
    .gachaProgress{
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: absolute;
        z-index: 44;
        top: 20rpx;
        .title{
            color: #1A1A1A;
            font-size: 24rpx;
            font-weight: bold;
        }
        .progress{
            width: 440rpx;
            margin-top: 12rpx;
height: 24rpx;
background: #A4BADA;
border-radius: 12rpx 12rpx 12rpx 12rpx;
position: relative;
text{
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 20rpx;
    transform: translate(-50%,-50%);
}
.actiiveProgress{
    position: absolute;
    height: 24rpx;
background: linear-gradient( 90deg, #FFC710 0%, #F9E650 100%);
border-radius: 12rpx 12rpx 12rpx 12rpx;
}
        }
        .total{
            color: #3F5E83;
            font-size:20rpx ;
        }

    }

    .probability {
        width: 18rpx;
        height: 126rpx;
        position: absolute;
        bottom: 92rpx;
        // z-index: 10;
        background-color: #e555f0;
        border: 1rpx solid #c5d8ff;
        border-radius: 8rpx;

        .h_num {
            width: 18rpx;
            border-radius: 8rpx;
            background-color: #fff;
        }

        .bubble {
            width: 72rpx;
            height: 34rpx;
            background-image: url("https://img.shinemang.com/gachaStatic/static/img/niudan/bubble_l.png");
            background-size: 100% 100%;
            // z-index: 10;
            color: #fff;
            font-size: 18rpx;
            text-align: center;
            line-height: 34rpx;
            position: absolute;

            &.l {
                left: -70rpx;
                padding-right: 6rpx;
            }

            &.r {
                transform: scaleX(-1);
                right: -70rpx;

                .rNum {
                    margin-left: -6rpx;
                    transform: scaleX(-1);
                }

            }
        }

        &.lp {
            left: 70rpx;
            transform: translateX(50%);
        }

        &.rp {
            right: 72rpx;
            transform: translateX(-50%);
        }
    }

    .motif-tit {
        color: #fbbdff;
        font-size: 26rpx;
        position: absolute;
        left: 146rpx;
        top: 145rpx;
        width: 460rpx;
        height: 68rpx;
        line-height: 68rpx;
        text-align: center;
        // z-index: 10;
        padding: 0 20rpx;
    }

    .gacha_img {
        height: 118rpx;
        width: 118rpx;
        border-radius: 6rpx;
        position: absolute;
        top: 8rpx;
        left: 316rpx;
        // z-index: 10;
    }

    .ico-t {
       width: 100rpx;
        height: 40rpx;
        background: rgba(26, 26, 26, .5);
        font-size: 24rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        border-radius: 20rpx 0 0 20rpx;
        line-height: 40rpx;
        position: absolute;
        right: 0;
        z-index: 88;
        top: 0;
        &.ico-share{
            top: 60rpx;
        }
        image{
           width: 32rpx;
           height: 32rpx; 
           margin-right: 4rpx;
           vertical-align: middle;
        }

        // z-index: 10;
    }

    .ico-r {
        width: 118rpx;
        height: 70rpx;
        background: url("https://img.shinemang.com/gachaStatic/static/img/niudan/ndj_btn-2.png");
        background-size: 100% 100%;
        font-size: 22rpx;
        color: #fffefe;
        text-shadow: 2rpx 2rpx 4rpx rgba(0, 0, 0, 0.8);
        font-weight: 800;
        line-height: 50rpx;
        text-align: center;
        position: absolute;
        bottom: 150rpx;
        right: 118rpx;
        // z-index: 10;
    }

    .tit {
        position: absolute;
        left: 152rpx;
        bottom: 54rpx;
        font-weight: 800;
        font-size: 24rpx;
        color: #000;
        width: 178rpx;
        height: 139rpx;
        background: url('https://img.shinemang.com/gachaStatic/niudanji/price.png');
        background-size: 100% 100%;
        // text-align: center;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
        .price{
            margin-top: -10rpx;
            transform: skewY(-10deg);
        }
    }


    /* 左边气泡：背景镜像！内容不动！ */
    .bubble.r::after {
        transform: scaleX(-1);
    }
}

.preview_box {
    width: 702rpx;
    height: 886rpx;
    margin: auto;
    position: relative;
  
    // background: url('https://img.shinemang.com/gachaStatic/niudanji/bg.png');
      background-size: 100% 100%;
    //   padding-left: 24rpx;
      .record{
        position: absolute;
        width: 200rpx;
        height: 100rpx;
        right: 0;
        top: 0;
      }
   
    // padding: 0rpx 24rpx;
//    border-radius: 32rpx 32rpx 32rpx 32rpx;
// border: 2rpx solid #FFFFFF;
.box{
//     width: 100%;
//     height: 868rpx;
// background: rgba(196, 222, 237, 1);
// border-radius: 32rpx 32rpx 32rpx 32rpx;
// border: 2rpx solid #FFFFFF;
.tab{
    // height: 96rpx;
    width: 100%;
    // line-height: 96rpx;
    // font-weight: bold;
    font-size: 32rpx;
    margin-bottom: 16rpx;
    display: flex;
    align-items: center;
    color: #3F5E83;
    .amount{
        color: #3F5E83;
        font-size: 24rpx;
        // margin-left: 10rpx;
        font-weight: 100;
    }

}
}

    .p-tit {
        padding-left: 20rpx;
        padding-right: 20rpx;

        .l {
            font-weight: bold;
            font-size: 31rpx;
        }

        .r {
            font-size: 24rpx;
        }
    }

    .p-list {
        // margin-top: 15rpx;
        width: 100%;
        height: 760rpx;
        padding-bottom: 15rpx;

        .flex-container {
            width: 100%;
            // padding: 0 24rpx;
            padding-right: 0rpx;
            display: flex;
            flex-wrap: wrap;
            // @include grid(151rpx);
        }
    }

    .list-item {
        width: 208rpx;
        height: 300rpx;
        // background: url("@/static/homePage/ndj_pic-3.png");
        // background-size: 100% 100%;
        text-align: center;
        background: linear-gradient( 180deg, #CCFFF4 0%, #FFFFFF 60%);
        // padding-top: 18rpx;
        border-radius: 16rpx;
        margin-right: 16rpx;

        margin-bottom: 16rpx;
        position: relative;

        &:nth-child(3n) {
            margin-right: 0rpx;
        }
        .p-img {
            width: 208rpx;
            height: 208rpx;
            border-radius: 16rpx;
        }

        .p-name {
            margin-top: 2rpx;
            font-size: 24rpx;
            padding: 0 8rpx;
            color: #1A1A1A;
        }

        .p-probability {
            font-size: 20rpx;
            padding: 0 8rpx;
            color: #8D8D94;
            text-align: left;

        }

      .ico3 {
                position: absolute;
                top: 168rpx;
                left: 0rpx;
                 width: auto;
            height: 40rpx;
            }

        .Lucky {
               position: absolute;
                top: 168rpx;
                left: 0rpx;
                 width: 120rpx;
            height: 40rpx;
                background-image: url("https://img.shinemang.com/gachaStatic/static/img/niudan/LuckyBg.png");
                background-size: 100% 100%;
                // font-weight: 800;
                // color: transparent;
                font-family: '倍数欧气值';
                text-align: center;
                // transform: skew(-15deg);
color: #FF5C7A;
// color: transparent;
line-height: 40rpx;
// text-stroke: 1rpx #000000;
 text-shadow:

        -1px -1px 0 #000,  /* 左上 */

        1px -1px 0 #000,   /* 右上 */

        -1px 1px 0 #000,   /* 左下 */

        1px 1px 0 #000;    /* 右下 */
text-align: center;
display: flex;
align-items: center;
justify-content: center;
font-style: normal;
text-transform: none;
// -webkit-text-stroke:1rpx #000000;
font-size: 22rpx;
        }

        .schedule {
            // position: absolute;
            // bottom: 59rpx;
            // right: 10rpx;
            width: fit-content;
            // width: 76rpx;
            height: 36rpx;
            background: linear-gradient(0deg, #58BBF7 0%, #7347B1 100%);
            border-radius: 12rpx;
            border: 2rpx solid #FFFFFF;
            font-size: 20rpx;
            color: #FFFFFF;
            padding: 6rpx;

            .iocn {
                width: 16rpx;
                height: 16rpx;
                background-image: url("https://img.shinemang.com/gachaStatic/static/img/niudan/info.png");
                background-size: 100% 100%;
                margin-left: 4rpx;
            }
        }

        .rotated {
            width: 92.25rpx;
            height: 32.81rpx;
        }
    }
}
.actionBtn{
    position: fixed;
    bottom: 0;
    width: 750rpx;
height: 136rpx;
background: #FFFFFF;
z-index: 88;
border-radius:32rpx 32rpx 0 0 ;
}
.foot-btn {
    padding: 0rpx 30rpx 0;
    position: relative;


    .cut {
          position: absolute;
        width: 196rpx;
        height: 64rpx;
        bottom: 90rpx;
        right: 0rpx;
        // border-radius: 18rpx 0 0 18rpx;
        // font-weight: bold;
        // font-size: 24rpx;
        // color: #FFFFFF;
        // padding: 0 14rpx;
        // letter-spacing: 2rpx;
        // justify-content: flex-end;

        .passionImg {
            width: 100%;
            height: 100%;
            background: url("https://img.shinemang.com/gachaStatic/jq.png");
            background-size: 100% 100%;
          
        }

        .commonImg {
            // width: 32rpx;
            // height: 32rpx;
           width: 100%;
            height: 100%;
            background: url("https://img.shinemang.com/gachaStatic/pt.png");
            background-size: 100% 100%;
            // margin-left: 10rpx;
        }

    }

    // .passion {
    //     background: linear-gradient(86deg, rgba(227, 146, 75, 0.8) 0%, rgba(227, 93, 75, 0.8) 100%);
    //     box-shadow: inset 0rpx 1rpx 0rpx 0rpx rgba(255, 255, 255, 0.2), -4rpx 4rpx 8rpx 0rpx rgba(255, 61, 13, 0.3);
    // }

    // .common {
    //     background: linear-gradient(86deg, rgba(62, 223, 252, 0.8) 0%, rgba(83, 132, 246, 0.8) 100%);
    //     box-shadow: inset 0rpx 1rpx 0rpx 0rpx rgba(255, 255, 255, 0.2), -4rpx 4rpx 8rpx 0rpx rgba(13, 118, 255, 0.3);
    // }
}

.btn-item {
    width: 172rpx;
    height: 72rpx;
    line-height: 72rpx;
    // background-image: url("@/static/btn/left.png");
    background: url('https://img.shinemang.com/gachaStatic/ddl/btnBgc.png');
    background-size: 100% 100%;
    text-align: center;
    // font-weight: bolder;
    font-size: 36rpx;
    color: #fff;
    font-family: '倍数欧气值';
}

.nb {
    top: 655rpx;
    right: 300rpx;
}

.btn-item2 {
    background-image: url("@/static/btn/right.png");
    background-size: 100% 100%;
}

.btn-item3 {
    background-image: url("https://img.shinemang.com/gachaStatic/static/img/niudan/foot_all.png");
    background-size: 100% 100%;
}

.btn-item4{
    background: url('https://img.shinemang.com/gachaStatic/ddl/btn1Bgc.png');
    background-size: 100% 100%;
    color: #000;
}
.btn-item5{
    background: url('https://img.shinemang.com/gachaStatic/ddl/btn2Bgc.png');
    background-size: 100% 100%;
    color: #000;
}

.cartoon_con {
    width: 100vw;
    height: 100vh;
    position: relative;

    &.opacity {
        opacity: 0;
    }

    .svga_it {
        width: 100vw;
        height: calc(100vw / 0.4618);
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate(0, -50%);
    }

    .awards_box {
        width: 608rpx;
        height: 752rpx;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -500rpx);

        .awards_share {
            width: 240rpx;
            height: 72rpx;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 40rpx;
            border: 2rpx solid #ffffff;
            position: absolute;
            top: -70rpx;
            right: -30rpx;

            .share_img {
                width: 64rpx;
                height: 64rpx;
                background-image: url("https://img.shinemang.com/gachaStatic/static/img/dongle/shareMin.png");
                background-size: 100% 100%;
            }

            .share_text {
                font-weight: bold;
                font-size: 28rpx;
                text-align: center;
                font-style: normal;
                background: linear-gradient(0.0000016050983927748848deg,
                        #f7f4ff 0%,
                        #ccb8ff 100%);
                text-transform: none;
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
                color: transparent;
            }
        }

        .share {
            width: 500rpx;
            height: 200rpx;
            background: #fff;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 999;
            justify-content: space-around;
            border-radius: 15rpx;
            pointer-events: auto;

            .icon {
                width: 80rpx;
                height: 80rpx;
            }

            .btn {
                position: absolute;
                right: -30rpx;
                top: -80rpx;
                color: #fff;
                font-size: 50rpx;
                z-index: 9998;
            }
        }
    }

    .awards {
        width: 608rpx;
        height: 752rpx;
        padding-top: 192rpx;
        background-image: url("https://img.shinemang.com/gachaStatic/static/img/niudan/eggshell.png");
        background-size: 100% 100%;
        animation: myFn 0.8s;

        .ni {
            width: 229rpx;

            .ni_img {
                width: 229rpx;
                height: 229rpx;
                border-radius: 20rpx;
                // background-color: $motif-color;
            }

            .ni_name {
                font-weight: bold;
                font-size: 30rpx;
                color: #6b1bb4;
                margin-top: 18rpx;
                text-align: center;
            }
        }
    }

    .msg {
        font-size: 24rpx;
        font-weight: 500;
        color: #fff;
        width: 100%;
        text-align: center;
        position: absolute;
        left: 0;
        bottom: -60rpx;
    }

    .c_btn {
        width: 100%;
        position: absolute;
        bottom: 263rpx;
        left: 0;

        .c_btn_item {
            width: 228rpx;
            text-align: center;
            padding: 10rpx 0;
            border-radius: 36rpx;
            font-weight: 500;
            font-size: 28rpx;
            background: linear-gradient(0deg, #d6d6d6, #8d8c8c);
            border: 6rpx solid #fff;
            position: relative;

            &.cor9 {
                background: linear-gradient(0deg, #e68ff1, #a75bf8);
                color: #fff;
            }

            .r_num {
                position: absolute;
                width: 100%;
                top: -130%;
                left: 50%;
                transform: translate(-50%, 0);
                font-size: 30rpx;
                font-weight: 500;
            }

            .ico1 {
                width: 46rpx;
                height: 46rpx;
                margin-right: 6rpx;
            }
        }
    }
}

@keyframes myFn {
    0% {
        transform: scale(0);
    }

    100% {
        transform: scale(1);
    }
}

.placeholder {
    width: 100%;
    height: 100%;
    line-height: 100%;
    background-color: #f5f5f5;
    align-items: center;
    justify-content: center;
    color: #999;
    font-size: 28rpx;
}
</style>