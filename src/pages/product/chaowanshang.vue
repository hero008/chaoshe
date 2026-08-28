<template>
    <view class="chaowanshang" :style="{ paddingTop: MBInfo().top + 'px' }">
        <view class="top_Back flex_r flex_js flex_ac" :class="{ borshad: conScrollTop > 10 }"
            :style="{ height: MBInfo().height + 'px' }">
            <img src="https://img.shinemang.com/gachaStatic/back.png" @click="gateBack" class="Back_ico" />
            <text class="title ellipsis">{{ gachainfo.themeName }}</text>
        </view>
        <view class="leftBox" @click=" goto('/pages/common/rulepop', { val: 'ChaoPlayRules' })"> <image
                        src="https://img.shinemang.com/gachaStatic/niudanji/ruleIcon.png"
                        mode="scaleToFill"
                    /><text>规则</text></view>
                     <!-- @click="goChaoGui" -->
        <view @click="toShare" class="leftBox ico-share">
              <image
                        src="https://img.shinemang.com/gachaStatic/niudanji/shareIcon.png"
                        mode="scaleToFill"
                    /><text>分享</text>
        </view> 
        <DanmakuSimple :data="danmuList" :top="MBInfo().top +48" ></DanmakuSimple>
        <scroll-view :style="{ height: conHeight, }" scroll-y="true" @scroll="onScroll">
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
                        <view class="dizuo"></view>
                        <view class="switch_btn switch_l" @click="switchover('last')" />
                        <view class="switch_btn  switch_r" @click="switchover('next')" />
                        <!-- <button open-type="share" class="btns_2 " @click="onShare">
                            <image src="https://img.shinemang.com/gachaStatic/static/img/duoyou/fx.png" />
                        </button> -->
                        <!-- <view class="ts">盲盒概率具有随机性，请理性消费</view> -->
                        <!-- #ifdef MP-WEIXIN -->
                        <!-- <view class="price">
                            <view class="price dyzt">￥{{ price }}/抽</view>
                        </view> -->
                        <!-- #endif -->
                    
                        <view class="price dyzt" ><view>￥{{ (price)
                        }}/抽</view> </view>
<!--                     
                        <view class="multiple " v-if="gachainfo.costAwardMultiple > 1">
                            <view class="number">{{ gachainfo.costAwardMultiple }}</view>
                        </view> -->
                    </view>
                    
                </view>
                <view class="gahcaAmount">
                      距上次出<text class="cs">传说</text>已过<text class="num">x{{ spNum }}</text>
                    <!-- <image  mode="scaleToFill" src="https://img.shinemang.com/gachaStatic/chaoyou/icon.png" />
                    <text>已抽{{ residual }}发</text> -->
                </view>
                <view :style="{
                   backgroundImage:`url(${ previewType == 1?bgc1:bgc2})`,
                   height:previewType == 1? '936rpx':'988rpx'
                }"  class="preview_box">
                    <!-- <view class="seeRecords" @click="showRecards = true"></view> -->
                    <!-- <view class="p-tit flex_r flex_ac">
                        <view class="tit_item " @click="previewType = 1" :class="{ active: previewType == 1 }">赏池预览
                        </view>
                        <view class="tit_item " @click="chaoPlay(2)" :class="{ active: previewType == 2 }">抽赏记录</view>
                        <view class="spShow flex_r flex_ac">
                            <view>距上次出SP赏已过</view>
                            <view class="num">x{{ spNum }}</view>
                        </view>
                    </view> -->
                     <div class="preview_tabs">

                                 <div @click="changeTabs(1)" :class="['tab',previewType == 1 ? 'active':'']">
                                    <span>奖品预览</span>
                                 </div>
                                 <div @click="changeTabs(2)" :class="['tab',previewType == 2 ? 'active':'']">
                                    <span>中奖记录</span>
                                 </div>
                              </div>
                    <template v-if="previewType == 1">
                        <div class="preview_1">

                             
                              <div class="p-probability flex_r flex_ac ">
                                <div class="prob_item" v-for="(i, s) in probability" :key="i.id">
                           
                                    <text :class="['prob_name',s]"> 
                                          {{ formatName(s) }}
                                    </text>
                                <!-- <div class="prob_num">{{ ($h.Div(i, gachainfo.totalNum) * 100).toFixed(2) }}%</div> -->
                                <div class="prob_num" v-if="i">{{ i }}%</div>
                             </div>
                          </div>
                        <!-- <view class="spShow">
                             距上次出<text class="cs">传说</text>已过<text class="num">x{{ spNum }}</text>
                        </view> -->
                        <scroll-view scroll-y style="height:740rpx;">
                           <view class="list">
                             <view class="list-item" v-for="(item, index) in AllRewardsInfo" :key="index"
                                @click="ondetail(item)">
                                <img :src="item.itemHalfImage" class="p-img" />
                                <img :src="`https://img.shinemang.com/gachaStatic/tag_${item.levelName}.png`"
                                    :class="['badge','badge'+item.levelName]" />
                                <!-- <view class="bor"></view> -->
                                <view class="p-name flex_c flex_jb">
                                    <div class="tit ellipsis">{{ item.itemName }}</div>
                                    <div class="price">
                                        <span>单抽价：</span>
               <!-- :style="{ '--after-content': `'.${mantissa}'` }" -->
                                        <span class="corr" >￥{{
                                           (price)
                                        }}</span>
                                     
                                    </div>
                                </view>
                            </view>
                           </view>
                            <!-- </view> -->
                        </scroll-view>
                        </div>
                    </template>
                    <template v-if="previewType == 2">
                         <div class="preview_2">
                    <view class="tab">

                        <view @click="refreshBtn" class="refresh"></view>
                     <view @click="recordsTab(value.levelName)" :key="value.levelName" v-if="value.levelName != 'Lucky'" v-for="value in sortList" :class="['tabItem','tabItem'+value.levelName,value.levelName == recordLevelName ? 'active':'']">{{ formatName(value.levelName) }}</view>
                  <!-- <view class="tabItem">史诗</view>
                  <view class="tabItem">稀有</view>
                  <view class="tabItem">普通</view> -->
             </view>
                <scroll-view style="height: 780rpx;" scroll-y>
                    <div class="lotteryRaffle">
                            <div v-if="newRecordList && newRecordList.records && newRecordList.records.length !== 0" class="r_item" >
                             <!-- v-for="(array, key) in recordList" -->
                                <!-- <div  class="lr_tit flex_r flex_ac flex_jb" :class="['badge' + array.name]"> -->
                                    <!-- <img :src="`https://img.shinemang.com/gachaStatic/static/img/chaowanshang/duoyou_${array.name}.png`"
                                        class="badge" /> -->
                                    <!-- <div class="tit_r flex_r flex_ac" @click="getJl(array)">
                                        <span>查看最近10个</span>
                                        <span class="icof" v-if="array.active">&#xe72a;</span>
                                        <span class="icof" v-else>&#xe72d;</span>
                                    </div> -->
                                <!-- </div> -->
                                <div  :class="['lr_con', { row1: false }]">
                                    <div>
                                        <div :style="{
                                backgroundImage: `url(https://img.shinemang.com/gachaStatic/k_${newRecordList.name}.png)`,
                            }"  class="lr_i flex_r flex_ac flex_jb"
                                            @click="ondetail(item)"
                                            v-for="(item, i) in newRecordList.records.slice(0, newRecordList.records.lengthNumber)" :key="i">
                                            <div class="lr_r">
                                                <img class="lr_img" :src="item.itemCover" />
                                                <div class="nums">{{ item.no }}发</div>
                                            </div>
                                            <div class="bor"></div>
                                            <div class="lr_info flex_c flex_jb">
                                                <div class="name ellipsis">
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

                       
                                </div>
                            </div>
                            <u-empty v-else text="暂无中赏记录~" icon="https://img.shinemang.com/gachaStatic/static/img/home/empty.png"
                    :marginTop="50" />
                  </div>
               </scroll-view>
                        </div>
                        <!-- <view class="spNumber flex_r flex_ac flex_jb">
                            <view class="flex_r flex_ac">
                                <view class="icon"></view>已抽{{ residual }}发
                            </view>

                            <view class="sx flex_r flex_ac flex_jc" @click="refreshBtn">
                                <view class="icon1"></view>刷新
                            </view>
                        </view> -->
                     
                    </template>
                </view>
            </view>
        </scroll-view>
        <view v-if="gachainfo && gachainfo.id" class="footBox dyzt">
            <!-- <view v-if="activityOpen" class="coupon  flex_r flex_ac" :class="[getCouponType]">
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
            </view> -->

            <view class="foot-btn flex_r flex_jc" v-if="isWelfare">
                <view class="btn-item flex_r flex_jc flex_ac" @click="onpay(1)">抽奖</view>
            </view>
            <view style="padding-top: 0;" class="special_btn1 flex_c astrictBtn" v-else-if="showBtn"
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
                    <!-- <view>{{ cutPattern == 'common' ? '普通' : "激情" }}模式</view> -->
                    <view :class="[cutPattern + 'Img']"> </view>
                </view>
                <view v-for="(value, index) in payOptions" :key="index" class="btn-item flex_c flex_jc"
                    :class="value.class" @click="onpay(value.num)">
                    <view>{{ value.text }} </view>
                    <!-- #ifdef MP-WEIXIN -->
                    <!-- <view class="number">{{ value.price }} </view> -->
                    <!-- #endif -->
                 
                    <!-- <view class="number" :style="{ '--after-content': `'.${value.mantissa}'` }">{{
                        Math.floor(value.price)
                    }}
                    </view> -->
                 
                </view>
            </view>

            <view style="padding-top: 0;" v-else class="special_btn1 flex_c astrictBtn"
                :class="{ forbid_bg: AReward.userBetCount == 0 || AReward.userBetCountDaily == 0 }"
                @click=" AReward.userBetCount == 0 || AReward.userBetCountDaily == 0 ? (showDiscounts = true) : onpay(1, 2)">
                <view>立即抽赏</view>
            </view>
            <!-- <div class="inform">平台发货不设门槛！星仓内提交发货申请后3-5个工作日安排发货。每单满5件包邮，不满5件需支付10元运费。</div> -->
        </view>
       
        <!-- <movable-area class="movable-draw">
            <movable-view v-if="chqShow" class="movable-ball" direction="all" :style="`left: ${ballLeft}; top:300rpx;`"
                @click="changeTop">
                <ball :afterTop="afterTop"></ball>
            </movable-view>
        </movable-area> -->
          <movable-area class="area">
            <movable-view x="10000"  @click="openLordPopup" v-if="lordActivity" class="lord_pill " direction="all" :y="0">
                <view>
                        <!-- <view class="lord_pill_txt">领主模式</view> -->
                    </view>
            </movable-view>

           
       
         </movable-area>
        <!-- 支付 潮玩赏-->
        <x-pay @success="onClickDraw" ref="xPay" mtype="3" :probabilityShow="probabilityShow" />
        <!-- 详情弹窗 -->
     
        <discounts :visible="showDiscounts" @onDiscounts="onDiscounts" :themeName="AReward.gacha.themeName"
            :message="AReward.openMessage" />
        <duoyou @onDuoyouDetail="onDuoyouDetail" ref="duoyou" @onDuoyou="onClickDuoyou" />
        <xPrize ref="refPrize" :prize="prize" @showPrize="onVisible" />
        <u-popup round="16" @close="showRecards = false" :show="showRecards">
          <view class="recordList">
             <view class="title">中奖记录</view>
             <view class="tab">
                  <view @click="recordsTab(value.levelName)" :key="value.levelName" v-if="value.levelName != 'Lucky'" v-for="value in sortList" :class="['tabItem',value.levelName == recordLevelName ? 'active':'']">{{ formatName(value.levelName) }}</view>
                  <!-- <view class="tabItem">史诗</view>
                  <view class="tabItem">稀有</view>
                  <view class="tabItem">普通</view> -->
             </view>
               <scroll-view style="height: 1010rpx;" scroll-y>
                    <div class="lotteryRaffle">
                            <div v-if="newRecordList" class="r_item" >
                             <!-- v-for="(array, key) in recordList" -->
                                <!-- <div  class="lr_tit flex_r flex_ac flex_jb" :class="['badge' + array.name]"> -->
                                    <!-- <img :src="`https://img.shinemang.com/gachaStatic/static/img/chaowanshang/duoyou_${array.name}.png`"
                                        class="badge" /> -->
                                    <!-- <div class="tit_r flex_r flex_ac" @click="getJl(array)">
                                        <span>查看最近10个</span>
                                        <span class="icof" v-if="array.active">&#xe72a;</span>
                                        <span class="icof" v-else>&#xe72d;</span>
                                    </div> -->
                                <!-- </div> -->
                                <div  :class="['lr_con', { row1: false }]">
                                    <div v-if="newRecordList && newRecordList.records && newRecordList.records.length !== 0">
                                        <div :style="{
                                backgroundImage: `url(https://img.shinemang.com/gachaStatic/chaoyou/k_${newRecordList.name}.png)`,
                            }"  class="lr_i flex_r flex_ac flex_jb"
                                            v-for="(item, i) in newRecordList.records.slice(0, newRecordList.records.lengthNumber)" :key="i">
                                            <div class="lr_r">
                                                <img class="lr_img" :src="item.itemCover" />
                                                <div class="nums">{{ item.no }}发</div>
                                            </div>
                                            <div class="bor"></div>
                                            <div class="lr_info flex_c flex_jb">
                                                <div class="name ellipsis">
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
            </scroll-view>
          </view>
          
		</u-popup>
        <feudalLord ref="feudalLord" :gachaId="gachaId" />
        <bzModal ref="bzModal" ></bzModal>

      <gachaDetails ref="gachaDetails" />
    </view>
</template>
<script>
import { post } from "@/utils/api.js";
import { uniShare } from "@/utils/fun.js";
import { mapMutations,mapState } from "vuex";
import { Postpayment } from "@/utils/pay.js";
import discounts from "@/components/modules/x-discounts.vue";
import ball from "@/page-activity/ball/ball.vue";

import xPay from "@/components/x-pay/index.vue";
import duoyou from "@/pages/product/modules/duoyou.vue";
import xPrize from "@/components/modules/x-prize";
import { formateGachaLevelName,shareUrl } from "../../utils/mgtv";
import bgc1 from '@/static/bg1.png'
import bgc2 from '@/static/bg2.png'
import DanmakuSimple from '@/components/danmu/danmu'
import {awardsSort} from '@/utils/mgtv.js'
import feudalLord from "@/components/feudalLord/index.vue";
import bzModal from "@/components/bzModal/bzModal.vue";
export default {
    data() {
        return {
            danmuList:[
            ],
            bgc1:bgc1,
            bgc2:bgc2,
            showRecards:false,
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
            { num: 10, text: '十连超神', price: 0, class: 'btn-item3' }],
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
                bg: "https://img.shinemang.com/gachaStatic/static/img/activity/chq_ls.png",
                btn: "https://img.shinemang.com/gachaStatic/static/img/activity/an_ls.png",
            },
            activityOpen: false,


            recordLevelName:'',
            newRecordList:'',
   
            lordActivity:0
            


        };
    },
    components: {
        xPay,
        discounts,
        ball,
        duoyou,
        xPrize,
        DanmakuSimple,
        feudalLord,
        bzModal
    },
    computed: {
       ...mapState(["userInfo"]),
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
        openLordPopup() {
            this.$refs.feudalLord.open(this.gachaId)
            return
         
        },
        onDuoyouDetail(item){
           this.ondetail(item)
        },
        changeTabs(type){
          this.previewType = type
        },
    //     onShareMessage(){
          
    //     }
    //    ,
     toShare(){

            let channel = uni.getStorageSync('channel') ?  uni.getStorageSync('channel') : 'Channel_Official'
            let url = shareUrl+"&gachaName=wxs&gachaId="+this.gachaId+"&inviteCode="+this.userInfo.inviteCode+"&channel="+channel;

            MgtvApi.showShareMenus(
            {
            title: "无限赏", // 分享标题
            desc: this.gachainfo.themeName, // 分享描述
            shareUrl: url, // 分享链接
            shareIcon: "https://img.shinemang.com/static/rednote/shareImg.jpg",
            },
            (resp) => { },
        );
           MgtvApi.showShare();
        },
        recordsTab(value){
            console.log(value);
            this.recordLevelName = value
            this.newRecordList = this.recordList.find((item) => {
                        return item.name == this.recordLevelName
                    })
        },
        formatName(str){
            return formateGachaLevelName(str)
          
        },
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

                        if(gachaAwards.filter((item)=>item.levelIndex == 52).length){
                        this.recordLevelName = '宝箱'
                        }else{
                            this.recordLevelName = 'SP'
                        }
                
                    this.gachainfo = { ...gacha, ...gachaBox };
                    this.gachaId = res.gacha.id;
                    // this.theme_id = res.gacha.themeId;
                    this.mantissa = this.decimalPart(this.price)
                       this.lordActivity=res.lordActivity
                    // this.residual = gachaBox.totalAwards - gachaBox.leftAwards 
                    this.residual = gachaBox.totalAwards == -1 ? gachaBox.consumedAwards : gachaBox.totalAwards - gachaBox.leftAwards
                    this.gachas();
                    this.getPrice()
                    this.chaoPlay(this.previewType);
                    this.getChaoyou()
                    this.getData()


        

                //   mgtv.onShareAppMessage(() => {
                //       console.log('分享了')
                //        return {
                //         path:encodeURIComponent("gachaName=wxs&gachaId="+this.gachaId+"&inviteCode="+this.userInfo.inviteCode)
                //         //    query:"gachaName=wxs&gachaId="+this.gachaId+"&inviteCode="+this.userInfo.inviteCode,
                //       }
                //  })
                    // this.onshareMessage()
                }
            });

            post('v1/publicize/push/barrage/all').then((res)=>{
            console.log(res);
            this.danmuList = res.list
          })

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
            // post("v1/activity/chaoyou", { gacha_id: this.gachaId, box_index: this.boxId }).then((res) => {
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
                console.log(levelName)
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
            console.log(this.probability);
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
                 
                    this.newRecordList = this.recordList.find((item) => {
                        return item.name == this.recordLevelName
                    })
               
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
                    this.gachainfo.themeId,
                    this.gachainfo
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

                 if(res.awards && res.awards.length > 0){
                     res.awards = awardsSort(res.awards);
                    // let spList = res.awards.filter((item)=>item.levelIndex == 28)
                    // let other = res.awards.filter((item)=>item.levelIndex != 28)
                    // res.awards.sort((a,b)=>b.levelIndex - a.levelIndex)
                    res.awards[0].requestId = res.requestId
                    // res.awards[]
                  }
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
                     if(res.awards && res.awards.length > 0){
                        res.awards = awardsSort(res.awards);
                    //   res.awards.sort((a,b)=>b.levelIndex - a.levelIndex)
                      res.awards[0].requestId = res.requestId
                // res.awards[]
                  }
                    that.$refs.duoyou.open(res.awards, true, this.gachaId, this.boxId);
                    // that.loadDetail();
                    // that.chaoPlay(that.previewType);
                } else uni.$u.toast(res.message);
            });
        },
        ondetail(item) {
            if(item.levelIndex && item.levelIndex == 52){
                post('v1/goods/item/get',{
                    item_id:item.itemId
                }).then((res)=>{
                    this.bzcRewards = res.item.boxItems
                    this.$refs.bzModal.open(res.item.boxItems)

                })
             
            }else{
                
             this.gachaDetailsMethod(this, item.itemId);
            }
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
                this.payOptions = [{ num: 1, text: '一发入魂', price: 0, class: '' }, { num: 3, text: '欧气三连', price: 0, class: '' }, { num: 5, text: '五连绝世', price: 0, class: '' }, { num: 10, text: '十连超神', price: 0, class: 'btn-item3' },]
            } else {

                this.payOptions = [{ num: 5, text: '五连绝世', price: 0, class: 'btn-item3' }, { num: 10, text: '十连超神', price: 0, class: 'btn-item3' }, { num: 50, text: '五十爆燃', price: 0, class: 'btn-item3' }, { num: 100, text: '百连至臻', price: 0, class: 'btn-item4' },]
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
.area{
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 999;
   pointer-events: none; /* 🔥 关键 */

 

}
/* 领主标签（位于托管模式按钮下方） */
.lord_pill {
    position: absolute;
    right: 12rpx;
    top: 756rpx;
    width: 108rpx;
    height: 112rpx;
    background: url("https://img.shinemang.com/gachaStatic/static/duiduipeng/lz.png");
    background-size: 100% 100%;
    z-index: 2;
  pointer-events:auto;
    .lord_pill_txt {
        position: absolute;
        top: 58rpx;
        width: 104rpx;
        height: 36rpx;
        line-height: 33rpx;
        background: #DF9E3B;
        border-radius: 18rpx;
        border: 2rpx solid #FFFFFF;
        font-weight: bold;
        font-size: 20rpx;
        color: #FFFFFF;
        text-align: center;
        right: -12rpx;
    }

}
.chaowanshang {
    background-color: #969fde;
    background: url("https://img.shinemang.com/gachaStatic/chaoyou/bg.png") top center no-repeat;
    background-size: cover;
    height: 100%;
    width: 100%;

    overflow-y: auto;
    // padding-bottom: 200rpx;


    .footBox {
        position: fixed;
        width: 100%;
        height: 136rpx;
        // background: linear-gradient(180deg, rgba(45, 12, 23, 0) 0%, #2D0C17 35%, #2D0C17 100%);
        bottom: 0;
        padding: 0 22rpx;
        background-color: #fff;
        border-radius: 32rpx 32rpx 0 0;
        padding-top: 16rpx;

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
                url("https://img.shinemang.com/gachaStatic/static/img/chaowanshang/moie.png"),
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
        top: 232rpx;
        &.ico-share{
            top: 296rpx;
        }
        image{
           width: 32rpx;
           height: 32rpx; 
           margin-right: 4rpx;
           vertical-align: middle;
        }
    }



    .cg {
        top: 736rpx;
    }

    .gahcaAmount{
        width: 482rpx;
height: 56rpx;
background: rgba(63,94,131,0.1);
border-radius: 8rpx 8rpx 8rpx 8rpx;
border: 2rpx solid #FFFFFF;
margin: auto;
display: flex;
align-items: center;
justify-content: center;
color: #3F5E83;
font-size: 24rpx;
margin-top: -140rpx;
margin-bottom: 200rpx;
line-height: 56rpx;
.cs{
    font-family: "倍数欧气值";
    font-size: 14px;
    text-stroke:  0.5px #000000;
    -webkit-text-stroke: 0.5px #000000;
    text-align: center;
    font-style: normal;
    text-transform: none;
    color:#FF93C7;
}
image{
    width: 48rpx;
    height: 48rpx;
    margin-right: 16rpx;
    vertical-align: middle;
}

    }
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
    .dizuo{
        position: absolute;
        width: 610rpx;
        height: 140rpx;
        left: 50%;
        transform: translateX(-50%);
        background: url('https://img.shinemang.com/gachaStatic/chaoyou/dizuo.png');
        background-size: 100% 100%;
        bottom: 40rpx;
    }
    // background: url("https://img.shinemang.com/gachaStatic/static/img/duoyou/pedestal.png");
    // background-size: 100% 100%;

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
        right:  12rpx;
        bottom: 74rpx;
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
        view{
            margin-top: -10rpx;
            transform: skewY(-10deg);
        }
    }
}

.dyzt {
    // font-family: "多游字体", sans-serif;
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
    background: url("https://img.shinemang.com/gachaStatic/chaoyou/previous.png");
    background-size: 100% 100%;
    left: 0rpx;
}

.switch_r {
    background: url("https://img.shinemang.com/gachaStatic/chaoyou/next.png");
    background-size: 100% 100%;
    // transform: scaleX(-1);
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
    height: 86rpx;;
    border: 1rpx dashed #E5E5E5;
    // opacity: 0.2;
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

.preview_box {
    width: 702rpx;
    height: 936rpx;
    background: url('@/static/bg1.png');
    background-size:100%;
    margin: auto;

    padding:0 0rpx  26rpx;
    padding-right: 0;
    // background: #501C20;
    border-radius: 24rpx;
    margin-top: -190rpx;
    position: relative;
    .preview_1{
        padding: 0 24rpx;
        padding-right: 0;
    }

    .preview_2{
        padding: 0 16rpx;
        padding-right: 0;
    }
    .seeRecords{
        width: 200rpx;
        height: 100rpx;
        position: absolute;
        right: 0;
        top: 0;
    }

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
                // background: linear-gradient(180deg, #642A26 0%, rgba(100, 42, 38, 0) 100%);
                position: relative;
            }

            &::after {
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

 
    }
       .spShow {
        width: 524rpx;
height: 48rpx;
background: linear-gradient( 90deg, rgba(196,222,237,0) 0%, #C4DEED 30%, #C4DEED 70%, rgba(196,222,237,0) 100%);
border-radius: 0rpx 0rpx 0rpx 0rpx;
color: #3F5E83;
font-size: 24rpx;
margin: auto;
display: flex;
align-items: center;
justify-content: center;
line-height: 48rpx;
margin-bottom: 12rpx;
.cs{
    font-family: "倍数欧气值";
    font-size: 14px;
    text-stroke:  0.5px #000000;
    -webkit-text-stroke: 0.5px #000000;
    text-align: center;
    font-style: normal;
    text-transform: none;
    color:#FF93C7;
}

            .num {
       
                color: #F65C36;
                margin-left: 8rpx;
            }
        }
    .p-probability {
        margin-bottom: 20rpx;
        margin-top: 10rpx;
        justify-content: center;
        width: 100%;
        .prob_item{
            margin-right:66rpx;
            &:last-child{
                margin-right: 0;
            }
        }
     .prob_name{
        font-family: '倍数欧气值';
        font-size: 32rpx;
line-height: 40rpx;

text-stroke: 0.6px #000000;
-webkit-text-stroke:0.6px #000000;
text-align: center;
font-style: normal;
text-transform: none;
        &.SP{
            color: #FF93C7;
        }
        &.A{
            color: #F9E650;
        }
        &.B{
            color: #50FFF5;
        }
        &.C{
            color: #EDF1F0;
        }
        &.宝箱{
         background: -webkit-linear-gradient(26.15616568971575deg, #6E8AFF 0%, #FF98FB 26%, #F7FF9B 73%, #9DFFE4 100%);
        background:linear-gradient(26.15616568971575deg, #6E8AFF 0%, #FF98FB 26%, #F7FF9B 73%, #9DFFE4 100%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        }
    
     }
        .badge {
            width: 112rpx;
            height: 40rpx;
        }

        .prob_num {
            text-align: center;
            font-size: 20rpx;
            color: #1A1A1A;
            margin-top: -10rpx;
        }
    }
 .list{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    // padding-left: 24rpx;
   

 .list-item {
        width: 208rpx;
        height: 300rpx;
    //   background: linear-gradient( 0deg, #FFFFFF 0%, #CCFFF4 100%); 
    background: linear-gradient( 180deg, #CCFFF4 0%, #FFFFFF 60%);
            border-radius: 16rpx;
        margin-bottom: 16rpx;
        margin-right: 16rpx;
        color: #1A1A1A;
        position: relative;
        &:nth-child(3n) {
            margin-right: 0;
        }
      

        .p-img {
            width: 208rpx;
            height: 208rpx;
            border-radius: 16rpx;
        }

        .badge {
            width: 88rpx;
            height: 40rpx;
            position: absolute;
            left: 0;
            top: 168rpx;

            &.badge宝箱{
                width: 120rpx;
            }
        }

        .p-name {
            // height: 127rpx;
            padding: 0rpx 8rpx;
            font-size: 24rpx;
            width: 100%;
            // width: calc(100% - 168rpx);

            .tit {
                // font-weight: 500;
                font-size: 24rpx;
                color: #1A1A1A;
            }

            .price {
                // font-weight: 500;
                font-size: 20rpx;
                color: #8D8D94;

                .corr {
                    // font-weight: bold;
                    // font-size: 24rpx;
                    // color: #F44935;

                    // &::before {
                    //     content: "￥";
                    //     font-size: 16rpx;
                    // }

                    // &:after {
                    //     content: var(--after-content);
                    //     font-size: 16rpx;
                    // }
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
            background: url("https://img.shinemang.com/gachaStatic/static/img/duoyou/icon_box.png");
            background-size: 100% 100%;
            margin-right: 8rpx;
        }

        .icon1 {
            width: 28rpx;
            height: 28rpx;
            background: url("https://img.shinemang.com/gachaStatic/static/img/duoyou/sx.png");
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

  

 
}
.recordList{
     height: 1248rpx;
    width: 750rpx;
    // position: absolute;
    // bottom: 0;
    background: #F5F6F8;
    // left: calc((100% - 686rpx) / 2);
    // background-image: url("https://img.shinemang.com/gachaStatic/static/img/niudan/draw_log_bg.png");
    // background-size: 100% 100%;
    // padding: 18rpx 16rpx 0;
    border-radius: 32rpx 32rpx 0 0;
      &::after {
        content: "";
        width: 100vw;
        height: 210rpx;
        left: 0;
        top: 0;
        position: absolute;
        z-index: 1;
        background: url('https://img.shinemang.com/gachaStatic/pouponTopBgc.png');
        background-size: 100% 100%;
      }

      .title{
             color: #1A1A1A;
        font-size: 36rpx;
        text-align: center;
        padding-top: 48rpx;
        padding-bottom: 32rpx;
        position: relative;
        z-index: 2;
        font-weight: bold;
      }
      .tab{
        display: flex;
        margin-bottom: 32rpx;
        padding-left: 32rpx;
        position: relative;
        z-index: 2;
       .tabItem{
        width: 136rpx;
        height: 56rpx;
        background: #EEEEEE;
        border-radius: 28rpx 28rpx 28rpx 28rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 56rpx;
        margin-right: 16rpx;
        color: #666666;
        font-size: 28rpx;
        &.active{
            color: #000;
            font-weight: bold;
        }
        &.tabItem宝箱{
            &.active{
            background: linear-gradient( 116deg, #6E8AFF 0%, #FF98FB 26.44%, #F7FF9B 72.6%, #9DFFE4 100%);
            }
        }
        &.tabItemSP{
        &.active{
            background: #FF93C7;
        }
        }
        &.tabItemA{
            &.active{
            background: #F9E650;
        }
        }
        &.tabItemB{
            &.active{
            background: #50FFF5;
        }
        }
        &.tabItemC{
            &.active{
            background: #BCCFD4;
        }
        }
       }
      }

}
.preview_2{
          .tab{
        display: flex;
        margin-bottom: 24rpx;
        // padding-left: 32rpx;
        position: relative;
        z-index: 2;
        margin-top: 24rpx;
        .refresh{
            position: absolute;
            width: 48rpx;
            height: 48rpx;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 12rpx;
            background: url('@/static/refresh.png');
            background-size: 100% 100%;

        }
       .tabItem{
        // width: 136rpx;
height: 56rpx;
background: #fff;
border-radius: 28rpx 28rpx 28rpx 28rpx;
display: flex;
align-items: center;
justify-content: center;
line-height: 56rpx;
margin-right: 16rpx;
padding: 0 26rpx;
 color: #666666;
 font-size: 28rpx;
 &:last-child{
    margin-right: 0;
 }
 &.active{
    // background: #FF93C7;
    color: #000;
    font-weight: bold;
 }
   &.tabItem宝箱{
        &.active{
        background: linear-gradient( 116deg, #6E8AFF 0%, #FF98FB 26.44%, #F7FF9B 72.6%, #9DFFE4 100%);
        }
        }
        &.tabItemSP{
        &.active{
            background: #FF93C7;
        }
        }
        &.tabItemA{
            &.active{
            background: #F9E650;
        }
        }
        &.tabItemB{
            &.active{
            background: #50FFF5;
        }
        }
        &.tabItemC{
            &.active{
            background: #BCCFD4;
        }
        }

       }
      }
}
  .lotteryRaffle {
        height: calc(100%);
        border-radius: 10rpx;
        overflow-y: auto;
        
        padding:0;
        
       .r_item {
        // background: #5D2028;
        // background: linear-gradient( 180deg, #CCFFF4 0%, #FFFFFF 60%);
        border-radius: 24rpx;
          width: 100%;
        //   height: 184rpx;
          background-size: 100% 100%;
          display: flex;
          align-items: center;
        .lr_tit {
            font-weight: 500;
            font-size: 20rpx;
            color: #8D8D94;
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
            // background: linear-gradient(90deg, #B87B11 0%, rgba(184, 123, 17, 0.1) 100%);
        }

        .badgeC {
            // background: linear-gradient(90deg, #9B8786 0%, rgba(155, 135, 134, 0.1) 100%);
        }

        .badgeSP {
            // background: linear-gradient(90deg, #872F3F 0%, rgba(135, 47, 63, 0.1) 100%);
        }

        .badgeB {
            // background: linear-gradient(90deg, #9B8786 0%, rgba(155, 135, 134, 0.1) 100%);
        }

        .lr_con {
            // background: #6F2A2B;
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
            padding: 16rpx;
            background-size: 100% 100%;
            margin-bottom: 16rpx;
            width: 670rpx;
            height:184rpx;
            // padding: 12rpx 0;

            .lr_r {
                position: relative;

                .lr_img {
                    width: 152rpx;
                    height: 152rpx;
                }

                .nums {
                    white-space: nowrap;
                    // padding: 0 32rpx;
                    width: 152rpx;
                    height: 32rpx;
                    line-height: 32rpx;
                    background: #DBB36F;
                    // box-shadow: inset 4rpx 4rpx 4rpx 0rpx rgba(255, 248, 227, 0.25), inset -4rpx -4rpx 4rpx 0rpx rgba(255, 248, 227, 0.25);
                    border-radius: 16rpx;
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    bottom: 0;
                    // font-weight: bold;
                    font-size: 20rpx;
                    color: #fff;
                    text-align: center;
                }
            }

            .lr_info {
                width: 445rpx;
                height: 126rpx;
                padding: 8rpx 0;
                font-weight: 500;
                font-size: 28rpx;
                color: #1A1A1A;

                .u_img {
                    width: 40rpx;
                    height: 40rpx;
                    margin-right: 8rpx;
                    border-radius: 50%;
                }

                .u_name {
                  
                    font-size: 24rpx;
                    color: #1A1A1A;
                }

                .time {
                  
                    font-size: 24rpx;
                    color: #8D8D94;
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
        width: 380rpx;
        height: 64rpx;
        bottom: 90rpx;
        right: -26rpx;
        // border-radius: 18rpx 0 0 18rpx;
        // font-weight: bold;
        // font-size: 24rpx;
        // color: #FFFFFF;
        // padding: 0 14rpx;
        // letter-spacing: 2rpx;
        // justify-content: flex-end;

        .passionImg {
            width: 280rpx;
            height: 100%;
            background: url("https://img.shinemang.com/gachaStatic/jq1.png");
            background-size: 100% 100%;
            position: absolute;
            right: 0;
            top:0;
          
        }

        .commonImg {
            // width: 32rpx;
            // height: 32rpx;
           width: 100%;
            height: 100%;
            background: url("https://img.shinemang.com/gachaStatic/pt1.png");
            background-size: 100% 100%;
            // margin-left: 10rpx;
        }

    }

    .passion {
        // background: linear-gradient(86deg, rgba(227, 146, 75, 0.7) 0%, rgba(227, 93, 75, 0.7) 100%);
        // box-shadow: inset 0rpx 1rpx 0rpx 0rpx rgba(255, 255, 255, 0.2), -4rpx 4rpx 8rpx 0rpx rgba(255, 61, 13, 0.3);
    }

    .common {
        // background: linear-gradient(86deg, rgba(62, 223, 252, 0.7) 0%, rgba(83, 132, 246, 0.7) 100%);
        // box-shadow: inset 0rpx 1rpx 0rpx 0rpx rgba(255, 255, 255, 0.2), -4rpx 4rpx 8rpx 0rpx rgba(13, 118, 255, 0.3);
    }
}

.btn-item {
    width: 172rpx;
    height: 72rpx;
    // background: #DC536C;
    background: url('https://img.shinemang.com/gachaStatic/ddl/btnBgc.png');
    background-size: 100% 100%;
    border-radius: 24rpx;
    text-align: center;
    // font-weight: bold;
    font-size: 36rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFFFFF;
    font-family: '倍数欧气值';
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
.btn-item3{
    background: url('https://img.shinemang.com/gachaStatic/ddl/btn1Bgc.png') !important;
    background-size: 100% 100% !important;
    color:#000 !important
}
.btn-item4{
    background: url('https://img.shinemang.com/gachaStatic/ddl/btn2Bgc.png') !important;
    background-size: 100% 100% !important;
      color:#000 !important
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