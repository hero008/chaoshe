<template>
    <view class="dongdongle" :style="{ paddingTop: MBInfo().top + 'px' }">
        <view class="top_Back flex_r flex_js flex_ac"
            :style="{ top: MBInfo().top + 'px', height: MBInfo().height + 'px' }">
            <img src="https://img.shinemang.com/gachaStatic/back.png" @click="gateBack" class="Back_ico" />
            <text class="title">炸弹赏</text>
        </view>
         <div class="i_notice flex_r flex_ac">
            <img src="https://img.shinemang.com/gachaStatic/static/img/market/ico2.png" class="m_ico" />
            <u-notice-bar :text="inotice" :fontSize="12" color="#fff" bgColor="rgba(0,0,0,0)"></u-notice-bar>
          </div>
             <view class="leftBox"  @click=" goto('/pages/common/rulepop', { val: 'SurpriseBoxRules' })"> <image
                        src="https://img.shinemang.com/gachaStatic/niudanji/ruleIcon.png"
                        mode="scaleToFill"
                    /><text>规则</text></view>
                     <!-- @click="goChaoGui" -->
       <view  @click="toShare" class="leftBox ico-share">
              <image
                        src="https://img.shinemang.com/gachaStatic/niudanji/shareIcon.png"
                        mode="scaleToFill"
                    /><text>分享</text>
        </view> 
        <!-- <div class="hint btns">
            <div class="hint_box flex_r flex_jc flex_ac">
                <div class="hint_item">
                    <view class="image pic1"></view>
                    <span>已售</span>
                </div>
                <div class="hint_item">
                    <image class="image" src="https://img.shinemang.com/gachaStatic/static/img/dongle/ddl_pic-2.png" />
                    <span>已选</span>
                </div>
                <div class="hint_item">
                    <image class="image" src="https://img.shinemang.com/gachaStatic/static/img/dongle/ddl_pic-3.png" />
                    <span>可选</span>
                </div>
            </div>
            <button open-type="share" class="btns_2 t_btn" @click="onShare">
                <image src="https://img.shinemang.com/gachaStatic/static/img/chaowanshang/cws_icon-share.png" />
            </button>
            <div class="btns_3 t_btn" @click="getRewardHistory">
                <image src="https://img.shinemang.com/gachaStatic/static/img/chaowanshang/cws_icon-record.png" />
            </div>
        </div> -->
        <div class="box_bar">
          
            <!-- <view class="ico-t" @click=" goto('/pages/common/rulepop', { val: 'SurpriseBoxRules' })">规则</view> -->
            <view class="multiple nb" v-if="gachainfo.costAwardMultiple > 1">
                <view class="number">{{ gachainfo.costAwardMultiple }}</view>
            </view>

       
               <view class="tit">
                     <view class="price">
                        ￥{{ (discountPrice > 0 && discountPrice) || price || "0.00" }}/抽
                     </view>
                </view>
            <!-- <div class="pro">
                <div class="quan"></div>
                <div class="txt">{{ Math.ceil((leftAwards / totalAwards) * 100) || 0 }}% </div>
            </div> -->
            <!-- <movable-area class="movable-draw">
                <movable-view y="1000rpx" v-if="activityOpen" class="movable-ball" direction="vertical">
                    <view class="coupon  flex_r flex_ac" :class="[getCouponType]">
                        <view class="bombImg" @click="$noMultipleClicks(getCoupon)">
                            <img src="https://img.shinemang.com/gachaStatic/static/img/dongle/bombImg.png" />
                        </view>
                        <view class="schedule" :class="[getCouponType]">
                            <view class="particulars" v-if="textNum.length > 1">
                                <view class="bomb_num">{{ textNum }}</view>
                                <view class="progress-track">
                                    <view class="progress-bar"
                                        :style="{ width: `${((currentAmount / total) >= 1 ? 1 : (currentAmount / total)) * 100}%` }">
                                        <div class='pop1' v-if="(currentAmount / total) * 100"></div>
                                    </view>
                                    <view class="chest-point flex_c  flex_ac" v-for="(chest, index) in chestList"
                                        :key="chest.id" :style="{ left: `${((chest.target / total) * 100) - 3}%` }"
                                        v-if="textNum.length > 4">
                                        <view class="chest-node "></view>
                                        <view class="chest-text">{{ chest.target }}</view>
                                        <view class="chestBg  flex_c  flex_ac "
                                            :class="{ active: currentAmount >= chest.target }" @click="getChest(chest)">
                                            <img class="chest-icon " :class="{ 'dx': openId == chest.id }"
                                                :src="`https://img.shinemang.com/gachaStatic/static/img/activity/${chest.cellTypeName}.png`" />
                                        </view>
                                    </view>
                                </view>
                            </view>
                            <div class="cut_ico icof" @click="$noMultipleClicks(getCoupon)">{{ getCouponType == 'long'
                                ? '&#xe72c;' : '&#xe72b;' }} </div>
                        </view>
                    </view>
                </movable-view>
            </movable-area> -->
            <!-- <view class="tit">￥{{ (discountPrice > 0 && discountPrice) || price || "0.00" }}/ 戳一次</view> -->
            <view class="bomb_box flex_r flex_ac" v-if="gachainfo.bombNum">
                <view class="bomb"></view>
                <view class="bomb_text"> {{ gachainfo.bombNum }}枚</view>
            </view>
            <view class="ddlProgress"> 
                <view>抽赏进度</view>
                <view class="progress">
                    <text>{{ Math.ceil((leftAwards / totalAwards) * 100) || 0 }}%</text>
                    <view :style="{width:(Math.ceil((leftAwards / totalAwards) * 100) || 0) + '%'}" class="activeProgress"></view>
                </view>
            </view>

            <div class="list clearfix">
                <div class="item  " :class="{
                    bg2: emptyCellIndexes.includes(s + 1),
                    bg3: selectGrid.includes(s + 1),
                }" v-for="(i, s) in totalAwards" :key="i" @click="getIndexAraeds(s + 1)">
                    <view style="width: 50rpx;height: 50rpx;position: relative;">{{ s + 1 }}

                     <view class="max_bomb" v-if="gachaBombRecord.cellIndex.includes(s + 1)"></view>
                       <view class="bomb_bg "
                        v-if="emptyCellIndexes.includes(s + 1) && (gachaBombRecord.bombRewardCellIndex.includes(s + 1) || gachaBombRecord.cellIndex.includes(s + 1))">
                    </view>
                    
                    </view>
                 
                    <view v-if="((s + 1) % 10 == 0) || (s-1 == (totalAwards.length))" class="line"></view>
                </div>
            </div>
          

         
          <block v-if="totalAwards">

           <view @click="onpay(0, 1)" class="foot-btn" style="padding-top: 56rpx;" v-if="showBtn">
            <view class="special_btn1 flex_c">
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
                    numberToChinese(
                        AReward.gacha.specialDiscountLimitBetNum
                    )
                }}抽起）</view>
            </view>
           </view>
            <view class="foot-btn flex_r flex_jb flex_ac" v-else-if="
                AReward.userBetCount == -1 && AReward.userBetCountDaily == -1
            ">
            
                <view class="flex_r">
                    <view class="btn-item suiji" @click="RandomShow = true"></view>
                    <view class="btn-item btn-item2 all" @click="onpay(2)"></view>
                </view>
                <view class="btn-item confirm" @click="onpay(0)">确定</view>
            </view>
            <view class="foot-btn" style="padding-top: 56rpx;"  v-else
                :class="{ forbid_bg: AReward.userBetCount == 0 || AReward.userBetCountDaily == 0, }"
                @click="AReward.userBetCount == 0 || AReward.userBetCountDaily == 0 ? (showDiscounts = true) : onpay(0, 3)">
                <view class="special_btn1 flex_c">
                    <view class="">立即抽赏</view>
                </view>
            </view>
          </block>
        </div>
      

        <div class="yunlanBtn" @click="visible = true">
            <!-- <div class="l_dit"></div>
            <div class="r_dit"></div>
            <img class="ico_img" src="https://img.shinemang.com/gachaStatic/static/img/dongle/img_small.png" alt="" />
            <img class="ico_txt" src="https://img.shinemang.com/gachaStatic/static/img/dongle/img_txt.png" alt="" />
            <img class="ico_light" src="https://img.shinemang.com/gachaStatic/static/img/dongle/img_light.png" alt="" /> -->
        </div>
        <div class="recordBtn" @click="getRewardHistory"></div>
        <!-- 过场动画 , { opacity: !cartoonShow } -->
        <u-popup :show="inAdvance" :overlay="cartoonShow" :safeAreaInsetBottom="false" bgColor="transparent">
            <div v-if="inAdvance" :class="['cartoon_con']">
                <div class="svga_it">
                    <c-svga ref="cSvgaRef" :src="cartoonsrc" :loops="1" :autoPlay="false" :isOnChange="true"
                        @finished="onFinished" @percentage="onPercentage" @loaded="onLoaded" width="100%"
                        height="100%" />
                </div>
                <div class="awards_box" v-if="percentage > 85 && isRun">
                    <div class="awards flex_r flex_jc">
                        <div class="ni">
                            <img class="ni_img" :src="spList[WinnInx].coverImage || spList[WinnInx].itemCover" />
                            <div class="ni_name ellipsis">{{ spList[WinnInx].itemName }}</div>
                        </div>
                    </div>
                    <div class="msg" v-if="percentage > 95">
                        赏品已自动放入星仓，可在星仓查看~
                    </div>
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
                        <div @click="shareType = 0" class="btn icof">
                            &#xe607;
                        </div>
                    </view>
                </div>
                <div class="c_btn flex_r flex_jse flex_ac" v-if="percentage > 95">
                    <div class="c_btn_item" @click="toDetails" v-if="WinnNum > 0">
                        跳过动画
                    </div>
                    <div class="c_btn_item cor9" @click="next">
                        <span>继续</span>
                        <div class="r_num flex_r flex_ae" v-if="WinnNum > 0">
                            <img src="https://img.shinemang.com/gachaStatic/static/img/dongle/piece.png" class="ico1" />
                            <span>x{{ WinnNum }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </u-popup>
        <!-- 炸弹 -->
        <u-popup :show="showDh" :overlay="cartoonShowDh" :safeAreaInsetBottom="false" bgColor="transparent">
            <div v-if="showDh" :class="['cartoon_con']">
                <div class="svga_it">
                    <c-svga ref="cSvgaRef" :src="cartoonsrc2" :loops="1" :autoPlay="false" :isOnChange="true"
                        @finished="onFinished1" @percentage="onPercentage1" width="100%" height="100%"
                        @loaded="onLoaded" />
                </div>
            </div>
        </u-popup>
        <u-popup :show="visible" @close="onclose" :overlay="true" :closeable="true" round="20">
            <div class="preview_con">
                <div class="title">奖品概览</div>
                <view class="preview_box">
                    <view class="p-list">
                        <view class="list-item" v-for="(item, index) in gachaAwards" :key="index"
                            @click="ondetail(item)">
                            <img :src="item.itemHalfImage" class="p-img" />
                            <view class="p-name ellipsis">{{
                                item.itemName
                            }}</view>
                            <view class="p-probability ellipsis" v-if="![42, 27, 50].includes(item.levelIndex)"> {{
                                "概率：" + item.probability + "%" }}</view>
                                    <!-- 图标 -->
                            <view class="Lucky flex_r  flex_js " v-if="item.levelName == 'Lucky' && item.luckyNo">
                                <view class="type">{{ item.levelName }}</view>
                                <view class="sort">{{ item.luckyNo }}赏</view>
                            </view>
                            <img v-else class="ico3" :class="{ 'rotated': item.levelName == '冲冲' }"
                                :src="`https://img.shinemang.com/gachaStatic/static/img/reward/ico_${item.levelName}.png`" />
                            <view v-if="item.levelName == 'Lucky' && item.luckyPhase"
                                class="schedule flex_r flex_jb flex_ac" @click.stop="onScheduleTips(item.luckyPhase)">
                                <view class="num">{{ item.luckyPhase }}%</view>
                                <view class="iocn"></view>
                            </view>
                        </view>
                        
                    </view>
                </view>
            </div>
        </u-popup>
        <u-popup :show="RandomShow" @close="RandomShow = false" :overlay="false" :closeable="true" round="20"
            bgColor="#F4F4F4">
            <div class="random_con">
                <div class="title">请选择随机数量</div>
                <div class="random_s flex_r flex_jb flex_ac">
                    <div class="random_item flex_c flex_ac flex_jc" @click="selectRandom(i)"
                        :class="{ active: RandomNum == i }" v-for="i in RandomS" :key="i">
                        <img src="https://img.shinemang.com/gachaStatic/static/img/dongle/ico2.png" class="img" />
                        <div class="tit">随机{{ i }}抽</div>
                        <img src="https://img.shinemang.com/gachaStatic/static/img/dongle/ico1.png" class="select_img" />
                        <div class="txt" v-if="oldRandomNum == i">上次选择</div>
                    </div>
                </div>
                <div class="random_btn" @click="onpay(1)">去支付</div>
            </div>
        </u-popup>
        <!-- 详情弹窗 -->
        <gachaDetails ref="gachaDetails" />
        <!-- 支付弹窗 -->
        <x-pay @success="onClickDraw" ref="xPay" mtype="4" :probabilityShow="probabilityShow" />
        <!-- 中赏记录 -->
        <draw-log-else ref="drawLog" :drawType="4" @onRefresh="onRefresh" />
        <discounts :visible="showDiscounts" @onDiscounts="onDiscounts" :themeName="AReward.gacha.themeName"
            :message="AReward.openMessage" />
        <xPrize ref="refPrize" :prize="prize" @showPrize="onVisible" />
        <scheduleTips :LuckyVisible="LuckyVisible" :scheduleNum="scheduleNum" @onTips="LuckyVisible = false" />
        <share v-if="shareTo" @closeSharePoupon="shareTo = false" @shareTo="shareToWechat"></share>
    </view>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { post } from "@/utils/api.js";
import xPay from "@/components/x-pay/index.vue";
import drawLogElse from "@/pages/product/modules/drawLogElse.vue";
import cSvga from "@/components/c-svga/c-svga.vue";
import { playDede, saveFileToLocal, uniShare, compressImg, groupBySum, itemDetails, vibratePhone } from "@/utils/fun.js";
import { Postpayment } from "@/utils/pay.js";
import discounts from "@/components/modules/x-discounts.vue";
import xPrize from "@/components/modules/x-prize";
import scheduleTips from "@/pages/product/modules/scheduleTips.vue";
import { tr } from "@dcloudio/vue-cli-plugin-uni/packages/postcss/tags";
import share from "./modules/share.vue";
import { shareUrl } from "../../utils/mgtv.js";
export default {
    data() {
        return {
            shareTo:false,
            selectGrid: [], // 选中的格子
            totalAwards: 0, // 洞洞乐总数
            leftAwards: 0, // 洞洞乐剩余数
            emptyCellIndexes: [], // 洞洞乐已售的格子
            gachaAwards: [],
            gachaId: 0,
            price: 0,
            discountPrice: 0,
            gachainfo: {},
            boxIndex: 0,
            boxState: 0,
            visible: false,
            oldRandomNum: 1,
            RandomShow: false,
            RandomNum: 1,
            cartoonShow: false, // 过场动画
            inAdvance: false, // 过场动画
            percentage: 0, // 动画播放进度
            Winning: [], // 抽中的赏品
            WinnInx: 0, // 正在展示的
            isRun: true,
            RandomS: [1, 5, 10, 50],
            couponId: 0,
            inotice: "平台发货不设门槛!星仓内提交发货申请后7个工作日安排发货。每单满5件包邮，不满5件需支付10元运费。",
            coverImage: "",
            spList: [],
            AReward: {
                gacha: { themeName: "" },
                gachaBox: {},
                gachaAwards: [],
                gachaBoxAwards: [],
                openMessage: "",
            },
            showBtn: false,
            showDiscounts: false,
            shareType: 0,
            probabilityShow: [],
            cartoonsrc: "https://img.shinemang.com/gachaStatic/static/img/cartoon/ddl.svga",
            newFilePath: "",
            cartoonsrc2: "https://img.shinemang.com/gachaStatic/static/img/cartoon/bomb.svga",
            newGifPath: "", //Gif动画资源地址
            showDh: false,
            cartoonShowDh: false,
            entrance: false,
            gachaBombRecord: {},
            showAnim: false,
            theme_id: '',
            vibrat: false,
            sound: 1,
            noClick: true, //防抖挂载
            noClickTime: 1000, //防抖挂载
            getCouponType: "",
            total: 0,
            chestList: [],
            currentAmount: 0, //累计金额
            textNum: '',
            openId: null,
            dataList: [],
            prize: {
                width: 550,
                height: 752,
                imgWidth: 320,
                imgHeight: 320,
                bg: "https://img.shinemang.com/gachaStatic/static/img/activity/chq_tc.png",
                btn: "https://img.shinemang.com/gachaStatic/static/img/activity/chq_an.png",
            },
            activityOpen: false,
            LuckyVisible: false,
            scheduleNum: null,
        };
    },
    components: {
        xPay,
        drawLogElse,
        cSvga,
        discounts,
        xPrize,
        scheduleTips,
        share
    },
    computed: {
        ...mapState(["userInfo", "selectTicket"]),
        WinnNum() {
            return this.spList.length - 1 - this.WinnInx;
        },
    },
    onLoad(da) {
        if (da.gacha_id || da.id) this.gachaId = da.gacha_id || da.id;
        else this.theme_id = da.theme_id
        this.boxIndex = da.index;
    },
    onShow() {
        this.loadDetail();
        this.oldRandomNum = this.$gl("selectRandomNumber");
        this.RandomNum = this.oldRandomNum || 1;
    },
    created() {
        this.saveFile();
    },
    methods: {
     toShare(){
            let channel = uni.getStorageSync('channel') ?  uni.getStorageSync('channel') : 'Channel_Official'
            let url = shareUrl+"&gachaName=ddl&gachaId="+this.gachaId+"&inviteCode="+this.userInfo.inviteCode+'&channel='+channel

            MgtvApi.showShareMenus(
            {
            title: "炸弹赏", // 分享标题
            desc: this.gachainfo.themeName, // 分享描述
            shareUrl: url, // 分享链接
            shareIcon: "https://img.shinemang.com/static/rednote/shareImg.jpg",
            },
            (resp) => { },
        );
           MgtvApi.showShare();

        },
        ...mapMutations(["UppayMessage"]),
        async saveFile() {
            this.newFilePath = await saveFileToLocal(
                "ddlSvga",
                this.cartoonsrc
            );
            this.newGifPath = await saveFileToLocal(
                "bombSvga",
                this.cartoonsrc2
            );

        },
        loadDetail() {
            let obj = {}
            if (this.theme_id !== '') obj = { theme_id: this.theme_id }
            else obj = { gacha_id: this.gachaId, box_index: this.boxIndex, }
            post("v1/gacha/detail", obj).then((res) => {
                res.gachaAwards.map(item => {
                    if (![27, 42, 45, 50].includes(item.levelIndex)) {
                        item.probability = Math.floor((item.totalNums / res.gachaBox.totalAwards) * 100000) / 1000
                    }
                })
                this.AReward = res;
                this.showBtn = this.canShowGachaButton(res);
                this.gachaBombRecord = res.gachaBombRecord == null ? { cellIndex: [], bombCellIndex: [], bombRewardCellIndex: [] } : res.gachaBombRecord;
                this.boxIndex = res.gachaBox.boxIndex;
                this.totalAwards = res.gachaBox.totalAwards;
                this.leftAwards = res.gachaBox.leftAwards;
                this.emptyCellIndexes = res.gachaBox.emptyCellIndexes;
                this.discountPrice = res.gacha.discountPrice;
                this.boxState = res.gacha.state;
                this.gachaId = res.gacha.id;
                this.price = res.gacha.price;
                this.coverImage = res.gacha.coverImage;
                this.gachaAwards = res.gachaAwards;
                this.couponId = res.gacha.couponId;
                this.gachainfo = { ...res.gacha, ...res.gachaBox };
                // #ifdef APP
                if (getApp().globalData.AppTypeList[plus.runtime.channel] == 2)
                    this.probabilityShow = groupBySum(res.gachaAwards);
                // #endif
                this.getData()
            });
        },
        getData() {
            post("v1/task/list", {
                // type: 2,
                key: 14,
            }).then(
                (res) => {
                    if (!res.code) {
                        if (res.activityOpen && res.data && res.data.length > 0) {
                            this.activityOpen = true
                            const list = ["钻石宝箱", "黄金宝箱", "白银宝箱", "青铜宝箱",]
                            this.currentAmount = Number(res.data[0].schedule.current)

                            this.chestList = res.data[0].subTask.map((item, index) => {
                                let img = list[index]
                                if (this.currentAmount >= Number(item.schedule.target)) img = list[index] + 1
                                return {
                                    ...item,
                                    cellTypeName: img,
                                    target: Number(item.schedule.target)
                                };
                            })
                            this.total = Math.max(...res.data[0].subTask.map(item => Number(item.schedule.target)));
                            this.dataList = res.data[0]
                            if (this.getCouponType == 'long') {
                                this.textNum = `我的炸弹：${this.currentAmount}个`
                            }
                        }
                    }
                }
            );
        },
        ondetail(data) {
            itemDetails(data, this.$refs.gachaDetails, "初始获奖概率", this.price)
        },
        onpay(type, special = 0) {
            this.RandomShow = false;
            if (this.leftAwards <= 0 || this.boxState == 3) {
                uni.$u.toast("该套系已售罄");
            } else {
                if (type == 0) {
                    // 确定
                    if (this.selectGrid.length < 1) {
                        uni.$u.toast("暂未选择格子");
                        return;
                    }
                    this.goPrice(special);
                } else if (type == 1) {
                    // 随机
                    this.RandomKey();
                } else if (type == 2) {
                    // 全部
                    this.selectGrid = [];
                    this.goPrice(special);
                }
            }
        },
        // 提取公共方法
        handleDrawResult(res, showAnim) {
            if(res.awards && res.awards.length > 0){
                res.awards[0].requestId = res.requestId
                // res.awards[]
            }
            this.Winning = res.awards;
            if (res.isBomb) {
                this.showAnim = showAnim;
                this.showDh = true;
                this.cartoonShowDh = true;
            } else {
                this.onClickPay(showAnim);
            }
        },

        onClickDraw(res, showAnim, type) {
            if (type == 0) {
                this.handleDrawResult(res, showAnim); // 直接出结果,查询结果
            } else {
                this.onClickPrize(res.res.createPaymentReply.payId, showAnim);
            }
        },

        onClickPrize(payId, showAnim) {
            post("v1/gacha/open/result", { pay_id: payId }).then((res) => {
                if (!res.code) {
                    this.handleDrawResult(res, showAnim);
                } else {
                    uni.$u.toast(res.message);
                }
            });
        },
        onClickPay(showAnim) {
            let a1 = [];
            a1 = this.Winning.filter((item) => {
                if ([28].includes(item.levelIndex)) {
                    this.spList.push(item);
                    this.vibrat = true
                } else {
                    return item;
                }
            });
            a1 = a1.sort((a, b) => a.levelIndex - b.levelIndex);
            if (!showAnim) this.spList = [...this.spList, ...a1];
            this.loadDetail();
            this.$sl("extractAwards", {
                da: this.Winning,
                path: "pages/product/dongle",
                id: this.gachaId,
                index: this.boxindex,
            });
            let a;
            if (this.spList.length && showAnim) {
                a = 2;
            } else {
                a = this.verdictBig(showAnim ? this.Winning : [this.Winning[0]]) ? 2 : 1;
            }
            if (!this.spList.length && showAnim) {
                playDede(a);
                uni.hideLoading();
                uni.$u.route({
                    type: "redirect",
                    url: "/pages/product/rewardResultDetails",
                });
            } else {
                this.sound = a
                this.showDh = false
                this.cartoonShowDh = false;
                this.inAdvance = true;
                setTimeout(() => {
                    this.cartoonShow = true;
                    uni.hideLoading();
                }, 1600);
            }
        },
        selectRandom(va) {
            this.RandomNum = va;
            this.$sl("selectRandomNumber", va);
        },
        async RandomKey() {
            let res = await post("v1/gacha/detail", {
                gacha_id: this.gachaId,
                box_index: this.boxIndex,
            });
            let emptyInx = res.gachaBox.emptyCellIndexes;
            let totalAward = res.gachaBox.totalAwards;
            let leftAward = res.gachaBox.leftAwards;
            this.emptyCellIndexes = emptyInx;
            const set = new Set();
            const excludedSet = new Set(emptyInx);
            if (this.RandomNum > leftAward) this.RandomNum = leftAward;
            while (set.size < this.RandomNum) {
                const num = Math.floor(Math.random() * totalAward) + 1;
                if (!excludedSet.has(num) && !set.has(num)) {
                    set.add(num);
                }
            }
            let arr = Array.from(set);
            this.selectGrid = arr;
            this.goPrice();
        },
        onDiscounts() {
            this.showDiscounts = false;
        },
        goPrice(special = 0) {
            let numss =
                this.selectGrid.length > 0
                    ? this.selectGrid.length
                    : this.leftAwards;
            if (
                special == 1 &&
                numss < this.AReward.gacha.specialDiscountLimitBetNum
            ) {
                return uni.$u.toast(
                    `折扣箱${this.AReward.gacha.specialDiscountLimitBetNum}次以上才能使用折扣箱`
                );
            }
            let res = Postpayment(this.AReward, numss, special);
            if (res && res.m > 0) {
                this.$refs.xPay.open(
                    res.m,
                    res.number,
                    getApp().globalData.RechargeType.Gacha,
                    this.gachaId,
                    this.couponId,
                    this.boxIndex,
                    0,
                    this.gachainfo.discount,
                    this.gachainfo.themeId
                );
                let take_all = this.selectGrid.length <= 0 ? 1 : 0;
                this.UppayMessage({
                    url: "ddl",
                    message: {
                        gacha_id: this.gachaId,
                        box_index: this.boxIndex,
                        nums: numss,
                        take_all,
                        cell_indexes: this.selectGrid,
                        user_coupon_id: this.selectTicket.id,
                    },
                    discount: res.discount,
                });
            }
        },
        getIndexAraeds(index) {
            const { userBetCountDaily, userBetCount } = this.AReward;
            if (
                // (userBetCountDaily == -1 &&this.selectGrid.length == userBetCount )||
                // ( userBetCount == -1 && this.selectGrid.length == userBetCountDaily) ||
                // (userBetCount !== -1 &&userBetCount !== -1 &&this.selectGrid.length == userBetCountDaily)
                (userBetCountDaily == -1 &&
                    this.selectGrid.length == userBetCount) ||
                this.selectGrid.length == userBetCountDaily
            ) {
                if (this.selectGrid.includes(index))
                    this.selectGrid = this.remove(this.selectGrid, index);
                else {
                    uni.$u.toast("今日特惠抽赏已上限~");
                }
                return;
            }
            // if (this.selectGrid.length == userBetCountDaily||this.selectGrid.length == userBetCount)
            //  {
            //     if (this.selectGrid.includes(index))
            //         this.selectGrid = this.remove(this.selectGrid, index);
            //     else uni.$u.toast("今日特惠抽赏已上限~");
            //     return;
            // }
            if (this.selectGrid.includes(index))
                this.selectGrid = this.remove(this.selectGrid, index);
            else if (!this.emptyCellIndexes.includes(index))
                this.selectGrid.push(index);
        },
        // 中将记录
        getRewardHistory() {
            let type = this.gachainfo.leftAwards !== 0 ? true : false
            this.$refs.drawLog.open(this.gachaId, this.boxIndex, -1, type);
        },
        shareToWechat(type){
          console.log(type);
          this.shareTo = false;
          if(!window.mgtv)return
              mgtv.shareTo({
                title:  "疯狂炸弹赏 : " + this.gachainfo.themeName,
                url: `https://app.mgtv.com/mgmp-share/?appid=mgkgw1fkyk9fw95nw&host=mgtv&path=${encodeURIComponent('name=ddl&id='+this.gachaId)}`,
                shareType:type==1? "wechat":'moments',
                success: () => {
                    mgtv.showToast({
                        title: '分享成功!'
                    })
                }
            })
        },
        // 分享
        onShare() {
            this.shareTo = true
            // this.shareType = 1
            // `https://app.mgtv.com/mgmp-share/?appid=xxx&host=mgtv&path=${encodeURIComponent(“key1=value1&key2=value2”)}`
            // uniShare(
            //     {
            //         tit: "疯狂洞洞乐 : " + this.gachainfo.themeName,
            //         path: "pages/product/dongle",
            //     },
            //     { id: this.gachaId, index: this.boxIndex },
            //     this.coverImage
            // );
        },
        // 刷新
        getRefresh() { },
        onclose() {
            this.visible = false;
        },
        onLoaded() {
            if (this.vibrat) vibratePhone(3000)
            this.$refs.cSvgaRef.call("startAnimation");
            // console.log("动画加载完成，播放时回调");
        },
        onPercentage(va) {
            if (va > 0.85) {
                this.percentage = va * 100;
            }
            // console.log(va, "动画加载完成，播放时回调2");
            if (this.percentage > 80 && this.percentage < 86) {
                playDede(this.sound);
            }
        },
        onPercentage1(va) {
            if (this.entrance || !this.showDh) return
            this.entrance = true
            uni.vibrateLong({
                complete: () => {
                    uni.vibrateLong();
                }
            });
            playDede(0, 'https://img.shinemang.com/gachaStatic/static/media/bomb.wav')
        },
        onFinished() {
            // console.log("动画停止播放时回调");
        },
        onFinished1() {
            // console.log("动画停止播放时回调");
            this.cartoonShow = false;
            this.onClickPay(this.showAnim);
        },
        next() {
            this.isRun = false;
            this.WinnInx++;
            if (this.WinnInx >= this.spList.length) {
                this.toDetails();
            }
            setTimeout(() => {
                if (this.WinnInx < this.spList.length) {
                    let a = this.verdictBig([this.spList[this.WinnInx]]) ? 2 : 1;
                    playDede(a);
                }
                this.isRun = true;
            }, 600);
        },
        toDetails() {
            uni.hideLoading();
            this.cartoonShow = false;
            uni.$u.route({
                type: "redirect",
                url: "/pages/product/rewardResultDetails",
                params: {
                    isdemo: this.istry,
                },
            });
        },
        verdictBig(arr) {
            let result = [1, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37];
            for (const i of arr) {
                if (result.includes(i.levelIndex)) return true;
            }
            return false;
        },
        onShareType(type) {
            const { coverThumb, itemName, itemCover } =
                this.spList[this.WinnInx];
            if (type == 2) {
                uniShare(
                    {
                        tit: `我在娱乐芒星赏APP抽中了${itemName}`,
                        path: "pages/product/dongle",
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
                    { itemName, path: "pages/product/dongle" },
                    { id: this.gachaId, index: this.boxIndex }
                );
            }
            this.shareType = 0;
        },
        getCoupon() {
            let showText = `我的炸弹：${this.currentAmount}个`
            let index = 0;
            if (this.getCouponType == 'long') {
                this.getCouponType = 'short'
                const deleteTimer = setInterval(() => {
                    if (this.textNum.length > 0) this.textNum = this.textNum.slice(0, -1);
                    else clearInterval(deleteTimer);
                }, 110);
            } else {
                this.getCouponType = 'long'
                // setTimeout(() => {
                const pushTimer = setInterval(() => {
                    if (index < showText.length) {
                        const currentChar = showText.charAt(index);
                        this.textNum += currentChar;
                        index++;
                    } else clearInterval(pushTimer)
                }, 100);
                // }, 100);
            }

        },
        getChest(item) {
            if (this.openId || this.currentAmount < Number(item.schedule.target)) return
            this.openId = item.id;
            setTimeout(() => {
                item.cellTypeName = item.cellTypeName.slice(0, -1) + 2;
                this.innerClick(item);
            }, 1000);
        },
        innerClick(item) {
            post("v1/task/accept", { id: this.dataList.id, sub_id: item.id }).then(
                (res) => {
                    if (!res.code) {
                        uni.$u.toast("领取成功");
                        this.openId = ""
                        this.$refs.refPrize.open(item.award, res.num);
                    } else uni.$u.toast(res.message);
                }
            );
        },
        onVisible() {
            this.getData();
        },
        onScheduleTips(num) {
            this.LuckyVisible = true
            this.scheduleNum = num
        },
        onRefresh() {
            this.loadDetail()
        }

    },
};
</script>
<style lang='scss' scoped>

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
.dongdongle {
    // background-color: #a8a2e9;
    // background-image: url("https://img.shinemang.com/gachaStatic/static/img/dongle/ddl_bg.png");
    // background-size: 100% 100%;
    background: linear-gradient( 180deg, #BCF8FF 0%, #E5FDFF 24%, #E4F5FA 100%);
    height: 100vh;
    overflow-y: auto;
}

.pic1 {
    background-image: url("@/static/btn/ddl_pic-1.png");
    background-size: 100% 100%;

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

.hint_box {
    .hint_item {
        display: flex;
        align-items: center;
        margin-right: 40rpx;
        font-size: 26rpx;

        &:last-child {
            margin-right: 0;
        }

        .image {
            width: 38rpx;
            height: 38rpx;
            margin-right: 10rpx;
        }
    }
}

.btns {
    padding: 36rpx 0 30rpx;
    position: relative;

    .t_btn {
        width: 72rpx;
        height: 72rpx;
        background-color: rgba($color: #000, $alpha: 0);
        position: absolute;
        z-index: 888;

        image {
            width: 72rpx;
            height: 72rpx;
        }
    }

    .btns_2 {
        left: 36rpx;
        top: 36rpx;
        padding: 0;

        &::after {
            border: none;
        }
    }

    .btns_3 {
        right: 36rpx;
        top: 36rpx;
    }
}

.nb {
    right: 88rpx;
    top: 50rpx;
}

.box_bar {
    width: 686rpx;
    height: 1280rpx;
    margin-top: 12rpx;

    background: url("https://img.shinemang.com/gachaStatic/ddl/bg.png");
    background-size: 100% 100%;
    margin-left: calc((100% - 686rpx) / 2);
    position: relative;
    padding-top: 47rpx;
    // padding-top: 186rpx;
   .ddlProgress{
    display: flex;
    align-items: center;
    color: #494C5A;
    top: 50rpx;
    font-size: 24rpx;
    position: absolute;
    //    top: 120rpx;
        left: 23%;
        // transform: translateX(-50%);
    .progress{
        margin-left: 8rpx;
        width: 210rpx;
        height: 28rpx;
        background: #FFFAE4;
        border-radius: 24rpx;
        border: 2rpx solid #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 24rpx;
        font-size: 28rpx;
        font-family: '倍数欧气值';
        position: relative;
        .activeProgress{
            height: 24rpx;
            background: linear-gradient( 90deg, #FCF85D 0%, #FFD200 100%);
            border-radius: 24rpx;
            position: absolute;
            top: 0rpx;
            left: 0rpx;
        }   
        text{
            position: relative;
            z-index: 4;
        }
    }
   }
    .bomb_box {
        position: absolute;
        // top: 120rpx;
        // left: 50%;
        // transform: translateX(-50%);
        right: 32rpx;
        display: flex;
        width: fit-content;

    
        height: 48rpx;
        border-radius: 24rpx;
        background-color: rgba(0, 0, 0, 0.2);
        padding-right: 34rpx;
        align-items: center;
        
        .bomb_text {
            // height: 32rpx;
            // padding-top: 5.5rpx;
            font-weight: bold;
            font-size: 28rpx;
            // background: linear-gradient(90deg, #D144EF, #4207B9);
            // -webkit-background-clip: text;
            // background-clip: text;
            // color: transparent;
            // white-space: nowrap;
            color: #494C5A;
        }

        .bomb {
            width: 64rpx;
            height: 64rpx;
            margin-top: -16rpx;
            background: url("https://img.shinemang.com/gachaStatic/ddl/zd.png");
            background-size: 100% 100%;
        }
    }

    .ico-t {
        width: 90rpx;
        height: 90rpx;
        background: url("https://img.shinemang.com/gachaStatic/static/img/dongle/ddl_btn-1.png");
        background-size: 100% 100%;
        font-size: 24rpx;
        line-height: 86rpx;
        text-align: center;
        font-weight: bold;
        position: absolute;
        top: 20rpx;
        left: 40rpx;
    }

    .coupon {
        position: absolute;
        min-width: 152rpx;
        height: 144rpx;
        border-radius: 24rpx;
        background: linear-gradient(180deg, #FFC51E 0%, #FFA1FC 58.26%, #FF49FF 100%);
        z-index: 10000;

        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: inherit;
            padding: 2px;
            box-sizing: border-box;
            background: linear-gradient(95deg, rgba(255, 255, 64, 1), rgba(255, 177, 50, 1), rgba(255, 252, 64, 1));
            -webkit-mask:
                linear-gradient(#fff 0 0) content-box,
                linear-gradient(#fff 0 0);
            -webkit-mask-composite: destination-out;
            mask-composite: exclude;
        }

        .bombImg {
            img {
                width: 148rpx;
                height: 156rpx;
                position: relative;
                bottom: 24rpx;
            }
        }

        .schedule {
            width: 0rpx;
            height: 100%;
            position: relative;

            .particulars {
                height: 132rpx;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 16rpx;
                margin-right: 40rpx;
                font-weight: bold;
                font-size: 20rpx;
                color: #5D3D82;
                // overflow: hidden;

                .bomb_num {
                    margin: 8rpx 16rpx;
                }

                .progress-track {
                    position: relative;
                    height: 12rpx;
                    background: #fff;
                    border-radius: 16rpx;
                    margin: 8rpx 16rpx 0;

                    .progress-bar {
                        height: 100%;
                        background: linear-gradient(90deg, #FFBE49 0%, #CB31FF 100%);
                        transition: width 0.3s ease;
                        border-radius: 16rpx;
                        position: relative;
                        right: 5rpx;

                        .pop1 {
                            width: 12rpx;
                            height: 12rpx;
                            background: #FFFFFF;
                            box-shadow: 2rpx 2rpx 4rpx 0rpx rgba(167, 0, 175, 0.4);
                            border-radius: 50%;
                            position: absolute;
                            right: -3rpx;
                            // right: -6rpx;
                            top: 50%;
                            transform: translateY(-50%);
                            z-index: 999;
                        }
                    }

                    .chest-point {
                        position: absolute;
                        top: 0rpx;
                        left: 20rpx;
                        text-align: center;

                        .chest-node {
                            width: 12rpx;
                            height: 12rpx;
                            background: rgba(252, 144, 61, 0.5);
                            border-radius: 50%;
                            border: 1rpx solid rgba(255, 255, 255, 0.6);
                        }

                        .chest-text {
                            font-weight: bold;
                            font-size: 20rpx;
                            color: #5D3D82;
                            margin-top: 2rpx;
                            white-space: nowrap;

                        }

                        .chestBg {
                            position: absolute;
                            top: 16rpx;
                            width: 88rpx;
                            height: 88rpx;
                            padding-top: 10rpx;

                            &.active {
                                width: 88rpx;
                                height: 88rpx;
                                background: url("https://img.shinemang.com/gachaStatic/static/img/activity/light.png");
                                background-size: 100% 100%;
                            }

                            .chest-icon {
                                width: 64rpx;
                                height: 64rpx;
                                margin: auto;
                            }

                            .dx {
                                animation: zy 1s 0.15s linear infinite;
                                -moz-animation: zy 1s 0.15s linear infinite;
                                -webkit-animation: zy 1s 0.15s linear infinite;
                                -o-animation: zy 1s 0.15s linear infinite;
                            }

                            @keyframes zy {
                                10% {
                                    transform: rotate(15deg);
                                }

                                20% {
                                    transform: rotate(-10deg);
                                }

                                30% {
                                    transform: rotate(5deg);
                                }

                                40% {
                                    transform: rotate(-5deg);
                                }

                                50% {
                                    transform: rotate(15deg);
                                }

                                100% {
                                    transform: rotate(0deg);
                                }
                            }

                        }

                    }

                    .pop {
                        min-width: 80rpx;
                        object-fit: cover;
                        height: 40rpx;
                        background: #FFEA94;
                        border-radius: 12rpx;
                        border: 4rpx solid #FA9C00;
                        font-weight: bold;
                        font-size: 20rpx;
                        position: absolute;
                        top: -45rpx;
                        color: #E97102;
                        text-align: center;
                        padding: 0 10rpx;

                        .triangle-bottom {
                            width: 0;
                            height: 0;
                            border-top: 10rpx solid #FA9C00;
                            border-left: 10rpx dashed transparent;
                            border-right: 10rpx dashed transparent;
                            position: absolute;
                            left: 50%;
                            transform: translateX(-50%);
                            bottom: -10rpx;
                        }

                        .pop_text {
                            width: 100%;
                            position: absolute;
                            left: 50%;
                            top: 50%;
                            transform: translate(-50%, -50%);

                        }
                    }


                }
            }



            .cut_ico {
                position: absolute;
                width: 28rpx;
                height: 28rpx;
                background: rgba(129, 13, 119, 0.5);
                line-height: 28rpx;
                text-align: center;
                border-radius: 50%;
                font-size: 22rpx;
                color: rgba(255, 197, 30, 1);
                flex-shrink: 0;
                top: 50%;
                transform: translateY(-50%);
                right: 6rpx;
            }
        }

        .long {
            animation: squareToRect 1s ease-in-out 1 forwards;
            animation-fill-mode: forwards;
        }

        @keyframes squareToRect {

            /* 起始状态：正方形 */
            0% {
                width: 0rpx;
            }

            /* 结束状态：长方形 */
            100% {
                width: 500rpx;
            }
        }

        .short {
            animation: short 1s ease-in-out 1 forwards;
            animation-fill-mode: forwards;
        }

        @keyframes short {

            /* 起始状态：正方形 */
            0% {
                width: 500rpx;
            }

            /* 结束状态：长方形 */
            100% {
                width: 0rpx;

            }
        }
    }

    .tit {
        position: absolute;
        left: -14rpx;
        top: 4rpx;
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

 .line{
     position: absolute;
  left: 10rpx;
 pointer-events: none;
  z-index: 1;
                width: 534rpx;
                height: 16rpx;
                background: url('https://img.shinemang.com/gachaStatic/ddl/line.png');
                background-size: 100% 100%;
                margin-top: -4rpx;
               

            }

    .list {

        // padding: 0 0 0 38rpx;
        // height: 810rpx;
        width: 554rpx;
        height: 938rpx;
        margin: auto;
        overflow-y: auto;
        margin-top: 130rpx;
        padding: 14rpx 10rpx;
         position: relative;
         padding-top: 0;
        // padding-top: 100px;

        .item {
            width: 50rpx;
            height: 50rpx;
            text-align: center;
            line-height: 50rpx;
            font-size: 18rpx;
            background-size: 100% 100%;
            margin-left: 2rpx;
          text-shadow: 1px 1px 2px rgba(73,146,181,0.7);
            text-stroke: 0.4px #1E92CA;
            text-align: center;
            font-style: normal;
            text-transform: none;
            -webkit-text-stroke:  0.4px #1E92CA;
            color: #fff;
            font-family: '倍数欧气值';
            float: left;
            background: url("https://img.shinemang.com/gachaStatic/ddl/bg0.png");
          
            background-size: 100% 100%;
            margin-bottom: 20rpx;

            &.bg2 {
              background: url("https://img.shinemang.com/gachaStatic/ddl/bg2.png");
                background-size: 100% 100%;
                color: #899AAA;
                text-shadow: 1px 1px 2px rgba(155,162,166,0.7);
                text-stroke: 0.4px #FFFFFF;
                text-align: center;
                font-style: normal;
                text-transform: none;
                -webkit-text-stroke: 0.4px #FFFFFF;
            }

            &.bg3 {
                background: url("https://img.shinemang.com/gachaStatic/ddl/bg1.png");
                background-size: 100% 100%;
                color: #0C9CEF;

                text-shadow: 1px 1px 2px rgba(57,166,219,0.7);
                text-stroke: 0.4px #FFFFFF;
                text-align: center;
                font-style: normal;
                text-transform: none;
                -webkit-text-stroke: 0.4px #FFFFFF;
            }
           

        }

        .bomb_bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #9D00FF;
            opacity: 0.3;
        }

        .max_bomb {
            position: absolute;
            top: 0;
            left: 0;
            width: 50rpx;
            height: 50rpx;
            background: url("https://img.shinemang.com/gachaStatic/ddl/zd.png");
            background-size: 100% 100%;
        }
    }
}

.foot-btn {
    padding: 42rpx 56rpx 40rpx;
}

.btn-item {
    width: 178rpx;
    height: 95rpx;
    line-height: 95rpx;
    background-image: url("@/static/btn/left.png");
    background-size: 100% 100%;
    text-align: center;
    font-weight: bolder;
    font-size: 30rpx;
    &.suiji{
        width: 112rpx;
        height: 112rpx;
        background: url('https://img.shinemang.com/gachaStatic/ddl/suiji.png');
        background-size: 100% 100%;
        margin-right: 40rpx;
    }
    &.all{
        width: 112rpx;
        height: 112rpx;
        background: url('https://img.shinemang.com/gachaStatic/ddl/all.png');
        background-size: 100% 100%;
    }
    &.confirm{
        width: 172rpx;
        height: 72rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 72rpx;
          background: url('https://img.shinemang.com/gachaStatic/ddl/btnBgc.png');
        background-size: 100% 100%;
        color: #fff;
    }
}

.btn-item2 {
    background-image: url("@/static/btn/right.png");
    background-size: 100% 100%;
}
.recordBtn{
      width: 112rpx;
height: 104rpx;
background: url('https://img.shinemang.com/gachaStatic/ddl/record.png');
background-size: 100% 100%;
position: absolute;
right: 0;

top: 1250rpx;  
}
.yunlanBtn {
    width: 112rpx;
height: 104rpx;
background: url('https://img.shinemang.com/gachaStatic/ddl/preview.png');
background-size: 100% 100%;
position: absolute;
right: 0;

top: 1100rpx;
    // background: #eef3ff;
    // border-radius: 42rpx 42rpx 0px 0px;
    // height: 122rpx;
    // width: 100%;
    // position: fixed;
    // left: 0;
    // bottom: 0;

    // .l_dit {
    //     width: 24rpx;
    //     height: 24rpx;
    //     background: #a295ed;
    //     border-radius: 50%;
    //     position: absolute;
    //     top: 53rpx;
    //     left: 217rpx;
    // }

    // .r_dit {
    //     width: 265rpx;
    //     height: 24rpx;
    //     background: linear-gradient(43deg, #b8b5f2, #9e90ec);
    //     border-radius: 12rpx;
    //     position: absolute;
    //     top: 53rpx;
    //     left: 252rpx;
    // }

    // .ico_img {
    //     width: 44rpx;
    //     height: 44rpx;
    //     position: absolute;
    //     top: 14rpx;
    //     left: 501rpx;
    // }

    // .ico_txt {
    //     width: 228rpx;
    //     height: 42rpx;
    //     position: absolute;
    //     top: 30rpx;
    //     left: 267rpx;
    // }

    // .ico_light {
    //     width: 250rpx;
    //     height: 64rpx;
    //     animation: breathingLight 3s infinite;
    //     position: absolute;
    //     top: 20rpx;
    //     left: 256rpx;
    // }

    // @keyframes breathingLight {
    //     0% {
    //         opacity: 1;
    //     }

    //     50% {
    //         opacity: 0.1;
    //     }

    //     100% {
    //         opacity: 1;
    //     }
    // }
}

.pro {
    width: 86rpx;
    height: 86rpx;
    position: absolute;
    top: 20rpx;
    right: -20rpx;
    text-align: center;
    background-image: linear-gradient(#58f0ed, #2b8efa);
    border-radius: 50% 50%;

    .quan {
        position: absolute;
        top: 0;
        left: 0;
        width: 88rpx;
        height: 88rpx;
        animation: rotoImg 1.5s linear infinite;
        background-image: url("https://img.shinemang.com/gachaStatic/static/img/dongle/ddl_pic-8.png");
        background-size: 100% 100%;
    }

    .txt {
        font-weight: 800;
        color: #fef8fe;
        font-size: 24rpx;
        line-height: 86rpx;
    }
}

.preview_con {
    padding-bottom: 50rpx;
    background-color: #C4DEED;
    border-radius: 32rpx 32rpx 0 0;
    height: 1248rpx;

    .title {
        font-weight: bold;
        font-size: 30rpx;
        padding: 26rpx 0;
        padding-top: 40rpx;
        padding-left: 36rpx;
    }

    .preview_box {
        width: 702rpx;
        height: 1100rpx;
        margin: 0 auto;
       
        padding-right: 0;
        background: rgba(255,255,255,0.6);
        border-radius: 32rpx;
        overflow-y: auto;
        // background: url("https://img.shinemang.com/gachaStatic/static/img/niudan/ndj_pic-2.png");
        // background-size: 100% 100%;

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
            // padding: 0 10rpx;
             padding: 24rpx 26rpx;
             padding-right: 0;
            // display: grid;
            // justify-content: space-between;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            // grid-template-columns: repeat(auto-fill, 151rpx);
            // overflow-y: auto;
            // height: 100%;
        }

        .list-item {
            width: 208rpx;
            height: 300rpx;
            // background: url("@/static/homePage/ndj_pic-3.png");
            // background-size: 100% 100%;
            background: linear-gradient( 0deg, #C4DEED 0%, #FFFFFF 60%);
            border-radius: 16rpx;
            // text-align: center;
            // padding-top: 18rpx;
            margin-right: 16rpx;

            margin-bottom: 16rpx;
            
            position: relative;
            &:nth-child(3n) {
                margin-right: 0;
            }

            .p-img {
                width: 208rpx;
                height: 208rpx;
                border-radius: 16rpx 16rpx 0 0;
            }

            .p-name {
                margin-top: 2rpx;
                font-size: 24rpx;
                padding: 0 8rpx;
                color: #1A1A1A;
            }

            .p-probability {
                font-size: 20rpx;
                color: #8D8D94;
                padding: 0 8rpx;
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
// text-stroke: 2rpx #000000;
 text-shadow:
      1px  1px 0 #000,
     1px -1px 0 #000,
    -1px  1px 0 #000,
    -1px -1px 0 #000,
     1px  0px 0 #000,
    -1px  0px 0 #000,
     0px  1px 0 #000,
     0px -1px 0 #000;
text-align: center;
display: flex;
align-items: center;
justify-content: center;
font-style: normal;
text-transform: none;
// -webkit-text-stroke:2rpx #000000;
font-size: 22rpx;
                // .type {
                //     height: 32.81rpx;
                //     line-height: 28rpx;
                //     font-size: 17rpx;
                //     background: linear-gradient(90deg, #FFF661, #FF1D1D);
                //     -webkit-background-clip: text;
                //     -webkit-text-fill-color: transparent;
                //     background-clip: text;
                //     margin-left: 8.44rpx;
                // }

                // .sort {
                //     height: 32.81rpx;
                //     line-height: 28rpx;
                //     font-size: 19rpx;
                //     background: linear-gradient(360deg, #FFF661, #FF1D1D);
                //     -webkit-background-clip: text;
                //     -webkit-text-fill-color: transparent;
                //     background-clip: text;
                //     margin-left: 2rpx;
                // }
            }

            .schedule {
                // position: absolute;
                // bottom: 59rpx;
                // right: 10rpx;
                // width: 76rpx;
                width: fit-content;
                height: 36rpx;
                background: linear-gradient(0deg, #58BBF7 0%, #7347B1 100%);
                border-radius: 12rpx 12rpx 12rpx 12rpx;
                border: 2rpx solid #FFFFFF;
                font-size: 20rpx;
                color: #FFFFFF;
                padding: 6rpx;
                line-height: 36rpx;

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
}

.random_con {
    padding-bottom: 50rpx;

    .title {
        font-weight: bold;
        font-size: 30rpx;
        padding: 26rpx 0;
        text-align: center;
    }

    .random_s {
        padding: 30rpx 36rpx 168rpx;

        .random_item {
            width: 148rpx;
            height: 174rpx;
            background: #e8e8e8;
            border-radius: 16rpx;
            position: relative;

            .img {
                width: 60rpx;
                height: 56rpx;
            }

            .tit {
                font-size: 28rpx;
                margin-top: 22rpx;
            }

            .txt {
                position: absolute;
                right: 14rpx;
                bottom: -60rpx;
                width: 120rpx;
                height: 36rpx;
                line-height: 36rpx;
                text-align: center;
                font-size: 20rpx;
                color: #835ce0;
                border-radius: 20rpx;
                background-color: rgba($color: #835ce0, $alpha: 0.2);
            }

            .select_img {
                width: 36rpx;
                height: 36rpx;
                position: absolute;
                right: -12rpx;
                top: -12rpx;
                display: none;
            }

            &.active {
                background: #fff;
                box-shadow: 4rpx 4rpx 26rpx 4rpx rgba($color: $motif-color, $alpha: 0.6);

                .select_img {
                    display: inline-block;
                }
            }
        }
    }

    .random_btn {
        color: #fff;
        text-align: center;
        font-size: 32rpx;
        height: 90rpx;
        line-height: 90rpx;
        width: calc(100% - 72rpx);
        background: #715cdd;
        border-radius: 16rpx;
        margin-left: 36rpx;
    }
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
        height: 627rpx;
        position: absolute;
        left: 50%;
        top: 52.5%;
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
        height: 627rpx;
        padding-top: 126rpx;
        background-image: url("https://img.shinemang.com/gachaStatic/static/img/dongle/exhibition.png");
        background-size: 100% 100%;
        animation: myFn 0.8s;

        .ni {
            width: 272rpx;

            .ni_img {
                width: 272rpx;
                height: 272rpx;
                border-radius: 20rpx;
                border: 4rpx solid #fff;
            }

            .ni_name {
                font-weight: bold;
                font-size: 30rpx;
                color: #fff;
                margin-top: 146rpx;
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
        bottom: -80rpx;
    }

    .c_btn {
        width: 100%;
        position: absolute;
        bottom: 263rpx;
        left: 0;

        .c_btn_item {
            width: 260rpx;
            height: 81rpx;
            text-align: center;
            line-height: 60rpx;
            padding: 10rpx 0;
            border-radius: 81rpx;
            font-weight: 500;
            font-size: 28rpx;
            background-color: rgba($color: #000, $alpha: 0.5);
            border: 2rpx solid #72707d;
            position: relative;
            color: #fff;

            &.cor9 {
                background: linear-gradient(0deg, #e68ff1, #a75bf8);
                border: 2rpx solid #fff;
            }

            .r_num {
                position: absolute;
                top: -90%;
                left: 50%;
                transform: translate(-50%, 0);
                font-size: 30rpx;
                font-weight: 500;
            }

            .ico1 {
                width: 64rpx;
                height: 64rpx;
                margin-right: 6rpx;
            }
        }
    }
}

.i_notice {
   width: 654rpx;
height: 56rpx;
background: #2A2A2A;
border-radius: 28rpx 28rpx 28rpx 28rpx;
margin: auto;
margin-top: 12rpx;
margin-bottom: 24rpx;
padding: 0 32rpx;
padding-right: 16rpx;

    .m_ico {
        width: 34rpx;
        height: 34rpx;
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

@keyframes rotoImg {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>