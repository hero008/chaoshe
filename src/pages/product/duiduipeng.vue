<template>
    <view class="duiduipeng" :style="{ paddingTop: MBInfo().top + 'px' }">
        <view class="top_Back flex_r flex_js flex_ac"
            :style="{ top: MBInfo().top + 'px', height: MBInfo().height + 'px' }">
            <img src="https://img.shinemang.com/gachaStatic/back.png" @click.stop="gateBack"
                class="Back_ico" />
            <view class="title">对对碰</view>
        </view>
       
        <!-- 托管模式切换按钮 -->
        <!-- <view class="auto_pilot flex_r flex_ac" :class="{ auto_pilot_on: isAutoMode }" @click="toggleAutoMode">
            <view class="auto_pilot_ico">{{ isAutoMode ? '❚❚' : '▶' }}</view>
            <view class="auto_pilot_txt">{{ autoModeText }}</view>
        </view> -->
         <!-- #ifndef MP-WEIXIN -->
           
            <!-- #endif -->
            
            <view class="theme_card">
                <view class="gz" @click=" goto('/pages/common/rulepop', { val: 'FateMatch' })"></view>
                  <view class="share " @click="onShare"></view>
                <view class="theme_content flex_r flex_ac ">
                   
                    <image
                     v-if="initialData"
                        :src="initialData.gacha.coverImage"
                        mode="scaleToFill"
                    />
                    <!-- <view class="theme_deco "></view> -->
                    <view>
                         <view class="theme_title">{{ themeName }}</view>
                        <view class="theme_price">￥{{ (discount > 0 && discount) || price || "0.00" }} /抽</view>
                    <!-- <view class="theme_deco theme_deco_right"></view> -->
                     </view>
                </view>
              
               
                <!-- <view class="theme_fate_badge" v-if="stateType == 1 && Object.keys(fateCard).length > 0">
                    <image :src="fateCard.cardImage || fateCard.image" class="theme_fate_img" />
                </view> -->
            </view>
            <!-- flex_jse -->
            <view class="status_bar flex_r flex_ac ">
                <view class="stat_item flex_r flex_ac">
                    <view class="stat_label">天命:</view>
                    <view class="stat_num">{{ fateCount }}</view>
                     <image v-if="fateBadgeSrc" :src="fateBadgeSrc" :key="fateBadgeSrc" class="theme_fate_badge" />
                    <view class="stat_use_txt" @click="useFateCard">使用</view>
                </view>
                <!-- <view class="dashed  "> </view> -->
                <view style="width:312rpx" class="stat_item flex_r flex_ac">
                    <view class="stat_label">当前碰数:</view>
                    <view class="stat_num">x{{ matchCount }}</view>
                </view>
            </view>
        <view class="game_shell">
            <view class="tab_pill_right" @click="showList(2, '中奖记录')"></view>
        <view class="tab_pill_left" @click="showList(1, '奖品概览')"></view>
            <view class="game_area">
                <view style="padding:0 12rpx">
                    <view class="progress_track">
                    <view class="progress_inner" :style="{ width: progressPercent + '%' }">
                         <div class="image"></div>
                     
                    </view>
                </view>
                <view class="progress_row flex_r flex_ac flex_jb">
                    <view class="progress_tip">累计{{ accumulate.accumulationNum }}局 碰击次数达到{{ accumulate.rangeLeft + '~' +
                        accumulate.rangeRight }}次，额外赠送一轮游戏</view>
                    <view class="progress_num">{{ accumulate.num }} /{{ accumulate.accumulationNum }}</view>
                </view>
                </view>
             <view class="table_area">

                <!-- 蒙版层 -->
                <view class="table_mask"></view>
                <view class="table_grid">
                    <view class="card_slot " v-for="(card, index) in tableSlots" :key="index"
                        @click="onCardClick(card, index)">
                        <template v-if="stateType == 1 && Object.keys(fateCard).length > 0">
                            <image :src="resolveImg(card.cardImage)" class="card_img" mode="aspectFill" />
                            <view class="card_overlay" v-if="selectedCards.includes(index)">
                                <image :src="pitchOnSrc" class="check_ico" />
                            </view>
                            <view class="card_mask" v-if="selectedCards.length && !selectedCards.includes(index)">
                            </view>
                        </template>
                        <template v-else>
                            <view class="card_back1">
                            </view>
                        </template>
                    </view>
                </view>
                <image v-if="showPeng" :src="pengSrc" class="peng_img" :style="pengStyle" />
            </view>
            </view>
        
            <!-- 卡桌区域 -->
        
            <view class="game_footer">
                <view class="start_row" v-if="stateType == 0">
                    <!-- 经典模式：图片开始按钮；疯狂模式：倍速开始按钮 -->
                    <view class="start_bar" v-if="!isCrazyMode" @click="onpay"> </view>
                    <!-- <view class="start_bar start_bar_crazy flex_r flex_ac flex_jc" v-else @click="onCrazyStart">
                        选择倍速开始游戏</view> -->
                    <!-- 疯狂/经典模式切换按钮 -->
                    <!-- <view class="crazy_switch" :class="{ crazy_switch_on: isCrazyMode }" @click="toggleCrazyMode">{{
                        isCrazyMode ? '切换经典模式' : '切换疯狂模式' }}</view> -->
                </view>
            </view>
        </view>
        <!-- 选择天命卡弹窗 -->
        <view class="fate_select_mask" v-if="stateType == 1 && Object.keys(fateCard).length === 0">
            <view class="fate_select_box">
                <view class="fate_select_title"></view>
                <view class="fate_select_tip">{{ fateTipText }}</view>
                <view class="fate_list">
                    <view class="fate_option" v-for="(item, idx) in fateOptions" :key="idx" :class="{
                        'fate_selected': selectedFateIndex === idx,
                        'fate_greyed': (selectedFateIndex !== -1 && selectedFateIndex !== idx) || (isAutoRolling && autoRollIndex !== idx),
                        'fate_rolling': isAutoRolling && autoRollIndex === idx,
                        'fate_exit': isSelectingFate,
                    }" @click="onSelectFate(item, idx)">
                        <image :src="resolveImg(item.cardImage)" class="fate_opt_img" mode="aspectFill" />
                        <view class="fate_check" v-if="selectedFateIndex === idx && !isSelectingFate">✓</view>
                    </view>
                </view>
            </view>
        </view>
        <!-- 奖励物品弹窗  -->
        <view class="awards_mask" v-if="showAwardsModal">
            <view class="awards_box flex_c flex_ac">
                <view class="awards_title"></view>
                <view class="awardsImg ">
                    <view :style="{
                        background:getTagPng(finishNumber).bgc
                    }" class="awards_number">x{{ finishNumber }}碰</view>
                    <image class="awards_img" :src="awards.length ? awards[0].coverThumb : ''" />
                    <view class="awards_name flex_r flex_ac flex_jc">
                        <view class="awardsName ellipsis">{{ awards[0].itemName }}</view>
                        <view class="awardsNumber">x1</view>
                    </view>
                </view>
                <view class="awards_btn_group " @click="awardsPlayAgain"> </view>

                <view @click="awardsPlayAgain" class="closeBtn"></view>
            </view>
        </view>
        <u-popup  @close="showList"  :show="popupShow" bgColor="transparent">
            <view class="popupShow">
                <view class="title">{{ popupTitle }}</view>
                <view class="close" @click="showList()"></view>
                <view class="prizeList flex_r" v-if="popupTitle == '奖品概览'">
                    <view class="prizeItem" v-for="(value, index) in prizeList" :key="index">
                        <view class="prizeBox">
                            <view class="probability ellipsis">概率：{{ value.ratio }}%</view>
                               <image :src="value.itemCover" class="prizeImg" @click="ondetail(value.itemId)" />
                        </view>
                        <view class="prizeName ellipsis">{{ value.itemName }}</view>
                        
                        <view :style="{
                            background:`url(${getTagPng(value.matchNum).tagPng})`
                        }" class="frequency">{{ value.matchNum }}碰获得</view>
                    </view>
                </view>
                <scroll-view v-else @scrolltolower="onReachScollBottom" class="recordList" :scroll-y="true">
                    <view class="recordItem flex_r " v-for="(value, index) in recordList" :key="index">
                        <image :src="value.awardItems[0].itemCover" class="recordImg"
                            @click="ondetail(value.awardItems[0].itemId)" />
                        <view class="right flex_r flex_wrap ">
                            <view class="goods flex_r flex_jb flex_ac">
                                <view class="recorName ellipsis">{{ value.awardItems[0].itemName }}</view>
                                <view :style="{
                                    color:getTagPng(value.awardItems[0].matchNum).color
                                }" class="number">{{ value.awardItems[0].matchNum }}碰</view>
                            </view>
                            <view class="message flex_r flex_ac">
                                <image :src="value.avatar | active" class="headPortrait" />
                                <view class="userName">{{ value.name }}</view>
                                <view class="time">{{ value.createTime }}</view>
                            </view>
                        </view>
                    </view>
                    
                    <u-empty v-if="!recordList.length" text="暂无记录~"
                        icon="https://img.shinemang.com/gachaStatic/static/img/home/empty.png" :marginTop="30" />
                </scroll-view>
            </view>
        </u-popup>
        <!-- 支付 -->
        <x-pay @success="onClickDraw" ref="xPay" mtype="7" :probabilityShow="[]" :isMultiple="isCrazyMode"
            :maxNum="buyMaxNum" />
        <!-- 详情弹窗 -->
        <gachaDetails ref="gachaDetails" />
    </view>
</template>

<script>

import { post } from "@/utils/api.js";
import { mapMutations,mapState } from "vuex";
import xPay from "@/components/x-pay/index.vue";
import { Postpayment } from "@/utils/pay.js";
import { playDede, uniShare } from "@/utils/fun.js";
import { cacheImage } from "@/utils/storage.js";
import bigPng from '@/static/big.png'
import middlePng from '@/static/middle.png'
import smallPng from '@/static/small.png'

export default {
    name: "duiduipeng",
    data() {
        return {
            // 游戏核心数据
            tableSlots: [],         // 卡桌：当前可操作的卡片(最多9张)
            selectedCards: [],      // 当前选中的卡片位置索引(最多2个)
            showPeng: false,        // 匹配成功时显示“碰”图片
            pengStyle: {
                left: "50%",
                top: "50%",
            },
            matchCount: 0,          // 碰数（成功消除次数）
            fateCount: 0,           // 天命数（主动补卡次数）
            fateCard: {},           // 天命卡信息
            gameOver: false,        // 游戏结束标志
            isProcessing: false,    // 防重复操作锁
            isMockMode: false,      // 是否为模拟数据模式
            // 天命卡选择
            fateOptions: [],
            selectedFateIndex: -1,     // 当前选中索引（-1表示未选中）
            isSelectingFate: false,     // 是否正在执行选中动画
            // 游戏配置
            gachaId: "",            // 关联的赏池ID
            maxTableSlots: 9,       // 卡桌最大容量
            // 初始数据
            initialData: '',
            awards: [],
            stateType: 0,//用户当前箱子状态
            // 奖励弹窗
            showAwardsModal: false,   // 奖励弹窗显示标志
            themeName: '',
            discount: 0,
            price: 0,
            accumulate: {
                accumulationNum: 0,
                rangeRight: 0,
                rangeLeft: 0,
                num: 0
            },
            popupShow: false,
            popupTitle: '',
            prizeList: [],
            pageda: {
                page: 1,
                page_size: 20,
                total: 20,
            },
            recordList: [],
            boxInx: 0,
            // 图片本地缓存：URL -> 本地路径
            imgCache: {},
            // “碰”特效图片，默认网络 URL，缓存就绪后替换为本地路径
            pengSrc: 'https://img.shinemang.com/gachaStatic/static/duiduipeng/peng.png',
            // “对勾”选中标记图片，默认网络 URL，缓存就绪后替换为本地路径
            pitchOnSrc: 'https://img.shinemang.com/gachaStatic/static/duiduipeng/pitchOn.png',
            // 复用的匹配音效上下文，避免重复创建与网络加载导致的延迟与内存泄漏
            matchAudio: null,
            finishNumber: 0,//结束次数
            // 疯狂模式（倍速玩法）开关
            isCrazyMode: false,
            // 托管模式
            isAutoMode: false,      // 是否处于托管中
            autoTimer: null,        // 托管调度定时器
            isAutoRolling: false,   // 托管随机选卡动画是否进行中
            autoRollIndex: -1,      // 随机选卡动画当前高亮的卡片索引
            recordId: '',
        };
    },
    components: {
        xPay,
    },
    computed: {
          ...mapState(["userInfo"]),
        // 普通模式可购买次数上限：取当前箱子剩余库存，-1（无限库存）时不限制
        buyMaxNum() {
            const left = this.initialData && this.initialData.gachaBox ? Number(this.initialData.gachaBox.leftAwards) : 0;
            return left === -1 ? 0 : left;
        },
        // 天命卡徽标图片源（统一取值，兼容 cardImage / image 两种字段）
        fateBadgeSrc() {
            return this.resolveImg((this.fateCard && (this.fateCard.cardImage || this.fateCard.image)) || '');
        },
        // 托管按钮文案：未开启=未托管，已开启且 stateType==1=托管中，已开启但未支付=托管待机
        autoModeText() {
            if (!this.isAutoMode) return '未托管';
            return this.stateType == 1 ? '托管中' : '托管待机';
        },
        // 天命卡弹窗提示文案：托管随机选卡时提示自动选择中
        fateTipText() {
            return this.isAutoRolling ? '托管中，正在随机选择天命卡…' : '点击卡片即可选定天命卡';
        },
        progressPercent() {
            var current = Number(this.accumulate && this.accumulate.num) || 0;
            var total = Number(this.accumulate && this.accumulate.accumulationNum) || 0;
            if (total <= 0) return 0;
            var percent = current / total * 100;
            if (percent < 0 || isNaN(percent)) return 0;
            return Math.min(percent, 100);
        },
    },
    onLoad(query) {
        this.gachaId = query.id || "";
        this.initGame();
    },
    created() {
        this.preloadPeng();
        this.preloadPitchOn();
        this.initMatchAudio();
    },
    onUnload() {
        // 页面卸载时停止托管，清理定时器
        this.stopAuto(false);
        // 销毁复用的音频上下文，防止内存泄漏
        if (this.matchAudio) {
            this.matchAudio.destroy();
            this.matchAudio = null;
        }
    },
    methods: {
        getTagPng(value){
           if(value == 0 || value ==1 || value ==12 || value ==13 || value ==14){
            return {
                tagPng:bigPng,
                color:'#FF659B',
                bgc:"linear-gradient( 90deg, rgba(255,101,155,0) 0%, #FF659B 50%, rgba(255,101,155,0) 99.52%)"
            }
           }else if(value == 2 || value == 8 || value == 9 || value == 10 || value == 11){
               return {
                tagPng:middlePng,
                color:'#FF932B',
                bgc:"linear-gradient( 90deg, rgba(255,147,43,0) 0%, #FF932B 50%, rgba(255,147,43,0) 99.52%)"
            }
            }else if(value == 3 || value == 4 || value == 5 || value == 6 || value == 7){
                return {
                tagPng:smallPng,
                color:'#73B7FE',
                bgc:"linear-gradient( 90deg, rgba(115,183,254,0) 0%, #73B7FE 50%, rgba(115,183,254,0) 99.52%)"
            }
           }else{
             return {
                tagPng:smallPng,
                color:'#73B7FE',
                bgc:"linear-gradient( 90deg, rgba(115,183,254,0) 0%, #73B7FE 50%, rgba(115,183,254,0) 99.52%)"
            }
           }
        },
        ...mapMutations(["UppayMessage"]),
        // ============ 游戏初始化 ============

        /** 初始化游戏：从后端获取数据并设置初始状态    */
        initGame() {
            return post("v1/gacha/detail", {
                gacha_id: this.gachaId,
                box_index: 1
            }).then((res) => {
                if (!res.code) {
                    this.initialData = res;//初始数据
                    const fateMatch = res.gachaFateMatch || {};
                    this.stateType = fateMatch.state;               // 0=未支付 1=已支付 2=已结束
                    this.fateCount = fateMatch.cardNum; //天命数量
                    this.themeName = res.gacha.themeName
                    this.discount = res.gacha.discount
                    this.price = res.gacha.price
                    this.matchCount = fateMatch.matchNum //对碰数量
                    this.awards = fateMatch.awards//奖励物品列表
                    this.fateCard = (fateMatch.matchCard && fateMatch.matchCard.cardImage) ? fateMatch.matchCard : {};
                    this.fateOptions = fateMatch.matchCards;//九张天命卡
                    // 预下载九张天命卡图片到本地
                    this.preloadCardImages((this.fateOptions || []).map((c) => c && c.cardImage));
                    const cards = fateMatch.cards || [];
                    const accumulationReward = res.gachaFateMatch.fateMatchAccumulationReward
                    this.accumulate = { ...accumulationReward, num: res.gachaFateMatch.accumulationNum }
                    this.tableSlots = cards.length > 0 ? cards : this.createEmptySlots();
                    this.prizeList = res.gachaAwards
                    this.recordId = fateMatch.recordId

                }
            }).catch((e) => {
                console.error('初始化游戏接口失败', e);
            });

        },

        /** 创建空占位槽位（9个牌背面） */
        createEmptySlots() {
            return new Array(this.maxTableSlots).fill(null);
        },
        /** 解析图片：命中本地缓存返回本地路径，否则回退网络 URL */
        resolveImg(url) {
            return this.imgCache[url] || url;
        },
        /** 预下载并缓存图片列表，去重后并行处理，完成后整体替换 imgCache 触发响应式更新 */
        async preloadCardImages(urls) {
            const list = Array.from(new Set((urls || []).filter((u) => u && !this.imgCache[u])));
            if (!list.length) return;
            const newMap = {};
            await Promise.all(list.map(async (u) => {
                newMap[u] = await cacheImage(u);
            }));
            this.imgCache = { ...this.imgCache, ...newMap };
        },
        /** 预下载“碰”特效图片，成功后替换为本地路径 */
        async preloadPeng() {
            const local = await cacheImage(this.pengSrc);
            if (local) this.pengSrc = local;
        },
        /** 预下载“对勾”选中标记图片，成功后替换为本地路径 */
        async preloadPitchOn() {
            const local = await cacheImage(this.pitchOnSrc);
            if (local) this.pitchOnSrc = local;
        },
        /** 预加载并复用匹配音效：缓存到本地并复用同一音频上下文，消除播放延迟与内存泄漏 */
        async initMatchAudio() {
            try {
                const src = await cacheImage('https://img.shinemang.com/gachaStatic/static/media/mini.mp3');
                const audio = uni.createInnerAudioContext();
                audio.autoplay = false;
                audio.src = src;
                audio.onError(() => { });
                this.matchAudio = audio;
            } catch (e) {
                this.matchAudio = null;
            }
        },
        /** 播放匹配音效：复用上下文即时播放，异常时回退 playDede */
        playMatchSound() {
            const audio = this.matchAudio;
            if (audio) {
                try {
                    audio.stop();
                    audio.play();
                    return;
                } catch (e) { }
            }
            playDede();
        },
        /** 点击选择天命卡（带动画效果） */
        async onSelectFate(item, idx) {

            // 如果正在执行动画，忽略点击
            if (this.isSelectingFate) return;

            // 设置选中状态（触发放大+置灰效果）
            this.selectedFateIndex = idx;

            // 短暂延迟后播放退出动画
            await this.delay(300);

            // 开始退出动画
            this.isSelectingFate = true;

            // 给所有未选中卡片添加退出动画
            await this.delay(100);

            // 等待退出动画完成（500ms）
            await this.delay(500);

            // 更新游戏状态到后端
            try {
                const res = await post('v1/gacha/choice_fate_card', {
                    gacha_id: this.gachaId,
                    card_index: item.cardIndex,
                    recordId: this.recordId
                });
                if (!res.code) {
                    this.tableSlots = res.cards;
                    this.fateCount = res.cardNum;
                    // awards 非空表示游戏结束，展示奖励物品弹窗
                    if (Array.isArray(res.awards) && res.awards.length > 0) {
                        this.awards = res.awards;
                        this.gameOver = true;
                        this.checkAwards(res.awards);
                        // 显示奖品 // 看是否能否放生
                        this.finishNumber = res.matchNum

                    }
                } else {
                    this.initGame();
                }
            } catch (e) {
                console.error('选择天命卡接口失败', e);
            }

            // 设置天命卡信息
            this.fateCard = { ...item };
            this.selectedFateIndex = -1;
            this.isSelectingFate = false;
        },
        // #ifndef MP-WEIXIN
        onpay() {
            if (this.initialData.gacha.state == 3) {
                uni.showToast({ title: '当前箱子已售罄~', icon: 'none' });
                return
            }
            let res = Postpayment(this.initialData, 1, 0);
            if (res && res.m > 0) {
                this.$refs.xPay.open(
                    res.m,
                    res.number,
                    getApp().globalData.RechargeType.Gacha,
                    this.gachaId,
                    this.initialData.gacha.couponId,
                    this.initialData.gachaBox.boxIndex,
                    0,
                    this.initialData.gacha.discount,
                    this.initialData.gacha.themeId,
                    this.initialData.gacha
                );
                this.UppayMessage({
                    url: "v1/gacha/open",
                    discount: res.discount,
                });
            }
        },
        // #endif
        //支付成功回调
        onClickDraw(res, showAnim, type) {
            // 进入新一局：重置上一局的结束标记与奖励，保证托管待机后能继续自动接管
            this.gameOver = false;
            this.awards = [];
            this.selectedCards = [];
            this.initGame()
        },
        /** 点击卡片 */
        onCardClick(card, index) {
            if (!card) return;
            // 匹配处理中忽略点击，避免误触与卡顿
            if (this.isProcessing) return;
            // 已选中则取消（点击自身取消选中）
            if (this.selectedCards.includes(index)) {
                this.selectedCards = [];
                return;
            }

            // 选中第一张：该卡显示对勾
            if (this.selectedCards.length === 0) {
                this.selectedCards = [index];
                return;
            }

            // 选中第二张：加入选中，触发匹配检测
            if (this.selectedCards.length === 1) {
                this.selectedCards = [...this.selectedCards, index];
                this.checkMatch();
            }
        },

        /** 检测两张卡是否匹配 */
        async checkMatch() {
            this.isProcessing = true;
            const [pos1, pos2] = this.selectedCards;
            const card1 = this.tableSlots[pos1];
            const card2 = this.tableSlots[pos2];
            if (card1 && card2 && card1.cardIndex === card2.cardIndex) {
                // 匹配成功：两张卡都显示对勾，执行消除
                // 传给后端使用 cardNo，后端返回后更新牌组与计数
                await this.handleMatchSuccess(card1, card2, pos1, pos2);
            } else {
                // 匹配失败：第一张保持对勾
                this.selectedCards = [pos1];

                await this.delay(600);

                // 恢复所有状态
                this.selectedCards = [];
                this.isProcessing = false;
            }
        },

        /** 匹配成功处理 */
        async handleMatchSuccess(card1, card2, pos1, pos2) {
            // 立即播放匹配音效（与动画、网络请求并行，消除音效延迟）
            this.playMatchSound();
            // 播放消除动画（用位置索引）
            this.showPengAtCards(pos1, pos2);
            await this.delay(500);
            // 调用后端匹配接口（参数使用 cardNo）
            if (!this.isMockMode) {
                try {
                    const res = await post('v1/gacha/match_card', {
                        gacha_id: this.gachaId,
                        card_no_1: card1.cardNo,
                        card_no_2: card2.cardNo,
                        recordId: this.recordId
                    });

                    if (!res.code) {
                        // 更新牌组
                        if (res.cards) {
                            this.tableSlots = res.cards || [];
                        }
                        // 更新游戏状态
                        if (res.state === 2) {
                            this.gameOver = true;
                        }
                        // 更新碰数
                        if (res.matchNum !== undefined) {
                            this.matchCount = res.matchNum;

                        }
                        // 更新天命数：优先 gachaFateMatch.cardNum，兼容 cardNum
                        const newFateCount = (res.gachaFateMatch && res.gachaFateMatch.cardNum !== undefined)
                            ? res.gachaFateMatch.cardNum
                            : res.cardNum;
                        if (newFateCount !== undefined) {
                            this.fateCount = newFateCount;
                        }
                        // awards 非空表示游戏结束，展示奖励物品弹窗
                        if (Array.isArray(res.awards) && res.awards.length > 0) {
                            this.awards = res.awards;
                            this.gameOver = true;
                            this.checkAwards(res.awards);
                            this.finishNumber = res.matchNum
                        }
                    } else {
                        // 接口返回错误码，重新请求列表数据刷新页面
                        this.initGame();
                    }
                } catch (e) {
                    console.error('匹配接口调用失败', e);
                }
            } else {
            }

            // 清理状态
            this.selectedCards = [];
            this.showPeng = false;
            this.isProcessing = false;

            // 检测游戏结束
            // this.checkGameOver();
        },

        /** 匹配成功时，将“碰”图定位到两张卡牌中心点之间 */
        showPengAtCards(pos1, pos2) {
            var that = this;
            this.showPeng = true;
            this.$nextTick(function () {
                var query = uni.createSelectorQuery().in(that);
                query.selectAll(".card_slot").boundingClientRect();
                query.select(".table_area").boundingClientRect();
                query.exec(function (res) {
                    var slots = res && res[0] ? res[0] : [];
                    var tableArea = res && res[1] ? res[1] : null;
                    if (!slots[pos1] || !slots[pos2] || !tableArea) {
                        that.pengStyle = {
                            left: "50%",
                            top: "50%",
                        };
                        return;
                    }
                    var card1CenterX = slots[pos1].left + slots[pos1].width / 2;
                    var card1CenterY = slots[pos1].top + slots[pos1].height / 2;
                    var card2CenterX = slots[pos2].left + slots[pos2].width / 2;
                    var card2CenterY = slots[pos2].top + slots[pos2].height / 2;
                    var centerX = (card1CenterX + card2CenterX) / 2 - tableArea.left;
                    var centerY = (card1CenterY + card2CenterY) / 2 - tableArea.top;
                    that.pengStyle = {
                        left: centerX + "px",
                        top: centerY + "px",
                    };
                });
            });
        },
        // ============ 技能操作 ============

        /** 使用天命补卡：从卡池抽一张补到卡桌 */
        useFateCard() {
            if (this.fateCount <= 0) {
                uni.showToast({ title: '天命数不足', icon: 'none' });
                return
            }
            if (this.tableSlots.length >= this.maxTableSlots) {
                uni.showToast({ title: '卡桌已满，请先消除卡牌~', icon: 'none' });
                return
            }
            // 更新游戏状态到后端
            post("v1/gacha/consume_fate_card", {
                gacha_id: this.gachaId,
                recordId: this.recordId
            }).then((res) => {
                if (!res.code) {
                    this.fateCount = res.cardNum
                    this.tableSlots = res.cards
                    this.awards = res.awards || []
                    this.checkAwards(res.awards);
                    this.finishNumber = res.matchNum
                } else {
                    this.initGame()
                }
            }).catch((e) => {
                console.error('使用天命卡接口失败', e);
            });
        },

        /**
         * 检查并展示奖励物品弹窗
         * @param {Array} awards - 奖励物品数组，为空则不处理
         */
        checkAwards(awards) {
            if (Array.isArray(awards) && awards.length > 0) {
                setTimeout(() => {
                    if (!this._isDestroyed) {
                        this.showAwardsModal = true;
                    }
                }, 1000);
            }
        },

        /** 奖励弹窗：再来一局 */
        awardsPlayAgain() {
            this.showAwardsModal = false;
            this.selectedCards = []
            this.tableSlots = []
            this.stateType = 0
            this.fateCard = {}
            this.finishNumber = 0
            // 重新初始化游戏
            return this.restartGame();
        },

        /** 切换疯狂/经典模式 */
        toggleCrazyMode() {
            this.isCrazyMode = !this.isCrazyMode;
        },

        /** 疯狂模式下点击“选择倍速开始游戏” */
        onCrazyStart() {
            this.onpay()
        },

        // ============ 托管模式 ============

        /** 点击托管按钮：未托管则开启，托管中则取消（保留当前游戏进度） */
        toggleAutoMode() {
            if (this.isAutoMode) {
                this.stopAuto(true);
                return;
            }
            // 不校验支付状态：未支付也可开启，开启后立即进入托管调度（未支付时待机等待开局）
            this.isAutoMode = true;
            uni.showToast({
                title:  '已开启托管' ,
                icon: 'none'
            });
            this.scheduleAutoStep(400);
        },

        /** 停止托管：仅清理定时器与开关，不改动游戏进度状态 */
        stopAuto(showTip) {
            this.isAutoMode = false;
            // 中止随机选卡动画，清除高亮与选中态（仅处理托管自己触发的动画，不影响手动选卡）
            if (this.isAutoRolling) {
                this.isAutoRolling = false;
                this.autoRollIndex = -1;
                this.selectedFateIndex = -1;
            }
            if (this.autoTimer) {
                clearTimeout(this.autoTimer);
                this.autoTimer = null;
            }
            if (showTip) {
                uni.showToast({ title: '已取消托管', icon: 'none' });
            }
        },

        /** 调度下一次托管执行 */
        scheduleAutoStep(delay) {
            if (!this.isAutoMode) return;
            if (this.autoTimer) clearTimeout(this.autoTimer);
            this.autoTimer = setTimeout(() => {
                this.autoTimer = null;
                this.runAutoStep();
            }, delay);
        },

        /** 托管主流程：自动选天命卡 -> 自动对碰 -> 自动补天命卡 -> 自动开下一局 */
        async runAutoStep() {
            if (!this.isAutoMode) return;

            // 奖励已发放：等待3秒后自动开始下一局
            if (this.showAwardsModal) {
                await this.delay(3000);
                if (!this.isAutoMode) return;
                // 等待期间用户手动关闭了弹窗，回到主流程重新判断
                if (!this.showAwardsModal) {
                    this.scheduleAutoStep(600);
                    return;
                }
                await this.awardsPlayAgain();
                if (!this.isAutoMode) return;
                // 下一局未支付（未购买多局）则转入待机，等用户支付后自动接管
                this.scheduleAutoStep(this.stateType == 1 ? 600 : 1500);
                return;
            }

            // 匹配处理中 / 选卡动画中：稍后重试
            if (this.isProcessing || this.isSelectingFate) {
                this.scheduleAutoStep(600);
                return;
            }

            // 本局已结束：有奖励则等待弹窗弹出，否则转入待机等待下一局开局
            if (this.gameOver) {
                if (Array.isArray(this.awards) && this.awards.length) {
                    this.scheduleAutoStep(600);
                } else {
                    this.scheduleAutoStep(1500);
                }
                return;
            }

            // 未支付 / 已结束：托管保持开启并待机轮询，不代替用户发起支付，支付完成后自动接管
            if (this.stateType != 1) {
                this.scheduleAutoStep(1500);
                return;
            }

            // 开局需先选择天命卡：先确定随机目标，再播放选卡动画，最后落到实际选卡逻辑
            if (Object.keys(this.fateCard).length === 0) {
                const pick = this.pickRandomFateOption();
                if (!pick) {
                    // 暂无可选天命卡（数据未就绪）：待机等待数据刷新
                    this.scheduleAutoStep(1500);
                    return;
                }
                await this.playAutoFateRoll(pick.validIndexes, pick.index);
                if (!this.isAutoMode) return;
                // 动画期间天命卡已确定（如数据刷新）：回主流程重新判断
                if (Object.keys(this.fateCard).length > 0) {
                    this.scheduleAutoStep(600);
                    return;
                }
                await this.onSelectFate(pick.item, pick.index);
                this.scheduleAutoStep(800);
                return;
            }

            // 桌面上存在相同卡牌：自动点击进行对碰
            const pair = this.findMatchPair();
            if (pair) {
                if (this.selectedCards.length) this.selectedCards = [];
                this.onCardClick(this.tableSlots[pair[0]], pair[0]);
                await this.delay(400);
                if (!this.isAutoMode) return;
                this.onCardClick(this.tableSlots[pair[1]], pair[1]);
                this.scheduleAutoStep(1000);
                return;
            }

            // 无相同卡牌：有天命卡且卡桌未满则自动补充
            if (this.fateCount > 0 && this.tableSlots.length < this.maxTableSlots) {
                this.useFateCard();
                this.scheduleAutoStep(1000);
                return;
            }

            // 天命卡为零 或 卡桌已满无法补充：本局无可执行动作，托管转入待机等待状态变化
            this.scheduleAutoStep(1500);
        },

        /** 从天命卡候选中随机挑选一张有效卡，返回 { item, index, validIndexes }，无有效卡时返回 null */
        pickRandomFateOption() {
            const list = this.fateOptions || [];
            const validIndexes = [];
            for (let i = 0; i < list.length; i++) {
                const card = list[i];
                if (!card) continue;
                // 有效卡：cardIndex / cardImage / cardNo 任一字段有值
                const hasIndex = card.cardIndex !== undefined && card.cardIndex !== 0;
                const hasImage = card.cardImage !== undefined && card.cardImage !== '';
                const hasNo = card.cardNo !== undefined && card.cardNo !== 0;
                if (hasIndex || hasImage || hasNo) validIndexes.push(i);
            }
            if (!validIndexes.length) return null;
            const index = validIndexes[Math.floor(Math.random() * validIndexes.length)];
            return { item: list[index], index, validIndexes };
        },

        /**
         * 托管随机选卡动画：高亮在候选卡间流转并逐步减速，最后定格在目标卡上
         * 仅做视觉反馈，不影响选卡结果；取消托管时自动中断并清理高亮
         * @param {Array} validIndexes - 参与流转的候选卡索引
         * @param {Number} targetIndex - 最终选定的卡片索引
         */
        async playAutoFateRoll(validIndexes, targetIndex) {
            const list = validIndexes || [];
            if (!list.length) return;
            this.isAutoRolling = true;
            // 流转 12 步，间隔由 70ms 逐步递增，形成减速定格的转盘观感
            const steps = 12;
            let cursor = Math.floor(Math.random() * list.length);
            for (let s = 0; s < steps; s++) {
                if (!this.isAutoMode) break;
                this.autoRollIndex = list[cursor % list.length];
                cursor++;
                await this.delay(70 + s * 14);
            }
            // 定格在最终选中的天命卡上，并直接切到选中态，与手动选卡动画无缝衔接
            if (this.isAutoMode) {
                this.autoRollIndex = targetIndex;
                await this.delay(300);
                this.selectedFateIndex = targetIndex;
                await this.delay(200);
            } else {
                // 动画被中断：恢复弹窗自由选择状态
                this.selectedFateIndex = -1;
            }
            this.isAutoRolling = false;
            this.autoRollIndex = -1;
        },

        /** 在卡桌上查找一对相同卡牌，返回两张卡的位置索引，无则返回 null */
        findMatchPair() {
            const seen = {};
            for (let i = 0; i < this.tableSlots.length; i++) {
                const card = this.tableSlots[i];
                if (!card) continue;
                if (seen[card.cardIndex] !== undefined) {
                    return [seen[card.cardIndex], i];
                }
                seen[card.cardIndex] = i;
            }
            return null;
        },


        /** 检测游戏是否结束 */
        checkGameOver() {
            if (this.tableSlots.length === 0) {
                this.endGame();
                return;
            }
            // 检查卡桌是否存在可配对
            const idMap = {};
            this.tableSlots.forEach((c) => {
                if (c) idMap[c.id] = (idMap[c.id] || 0) + 1;
            });
            const hasMatch = Object.keys(idMap).some((k) => idMap[k] >= 2);
            if (!hasMatch) {
                this.endGame();
            }
        },

        /** 结束游戏 */
        endGame() {
            this.gameOver = true;
            // 模拟数据模式下不请求后端
            if (this.isMockMode) return;
        },

        /** 重新开始游戏 */
        restartGame() {
            this.gameOver = false;
            this.fateCard = {};
            this.tableSlots = this.createEmptySlots();
            return this.initGame();
        },
        /** 延迟Promise */
        delay(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        },
        showList(value = 0, t = '') {
            this.popupShow = value ? true : false
            if (!this.popupShow) return
            this.popupTitle = t
            if (value == 2) {
                this.pageda.page = 1
                this.getRecordList()
            } else if (value == 0) {
                this.$refs.gachaDetails.close()
            }


        },
        getRecordList() {
            post("v1/gacha/record", {
                ...this.pageda,
                gacha_id: this.gachaId,
                box_index: 1,
            }).then(res => {
                if (this.pageda.page == 1) this.recordList = [];
                this.recordList = this.recordList.concat(res.gachaRecords || []);
                this.pageda.total = res.total || 0;
            }).catch((e) => {
                console.error('获取中奖记录失败', e);
            })
        },
        ondetail(id) {
            this.gachaDetailsMethod(this, id);
        },
        onReachScollBottom() {
            if (this.pageda.total > this.pageda.page * this.pageda.page_size) {
                this.pageda.page++;
                this.getRecordList();
            }
        },
        onShare() {
            console.log('ddddddddddd',window.mgtv)
            if(window.mgtv){
                let channel = uni.getStorageSync('channel') ?  uni.getStorageSync('channel') : 'Channel_Official'
                mgtv.showShareMenu({
                    title:"对对碰 : " +  ((this.initialData && this.initialData.gacha) ? this.initialData.gacha.themeName : ''),
                     typeList: ["moments", "wechat", "weibo", "qq", "qzone", "fantuan"],
                    url:`https://app.mgtv.com/mgmp-share/?appid=mgkgw1fkyk9fw95nw&host=mgtv&path=${encodeURIComponent("gachaName=ddp&gachaId="+this.gachaId+"&inviteCode="+this.userInfo.inviteCode+'&channel='+channel)}`
                })
            }
            // uniShare(
            //     {
            //         tit: "潮游赏 : " + (this.initialData.gacha ? this.initialData.gacha.themeName : ''),
            //         path: "pages/product/duiduipeng",
            //     },
            //     { id: this.gachaId, index: this.boxInx },
            //     this.initialData.gacha ? this.initialData.gacha.coverImage : ''
            // );
        },
    },
};
</script>

<style lang="scss" scoped>
page{
    background: rgb(252, 255, 225);
}
.duiduipeng {
    width: 100vw;
    overflow-x: hidden;
    height: 100vh;
    background: url("https://img.shinemang.com/gachaStatic/static/duiduipeng/ddpBg.png");
    background-size: 100% 100%;

    .top_Back {
        width: calc(100% - 120rpx);
        color: #000000;
        font-size: 36rpx;
        font-weight: bold;
        padding: 0 36rpx;
        position: fixed;
        top: 106rpx;
        left: 0;
        z-index: 888;

        .Back_ico {
            width: 50rpx;
            height: 50rpx;
            margin-right: 30rpx;
        }
    }

        .gz {
            width: 40rpx;
            height: 80rpx;
            background: url("https://img.shinemang.com/gachaStatic/static/duiduipeng/gainGz.png");
            background-size: 100% 100%;
            position: absolute;
            right: 0rpx;
            bottom: -20rpx;
        }

        .share {
            width: 68rpx;
            height: 68rpx;
            background: url("https://img.shinemang.com/gachaStatic/static/duiduipeng/gainFx.png");
            background-size: 100% 100%;
            position: absolute;
            right: 0rpx;
            top: -20rpx;
        }

        .theme_card {
            width: 100%;
           height: 140rpx;
           margin-top: 104rpx;
           position: relative;
            color: #000;
            // padding-top: 48rpx;
            background: linear-gradient( 90deg, rgba(222,248,255,0) 0%, #DEF8FF 20%, #DEF8FF 80%, rgba(222,248,255,0) 100%);
            border-radius: 0rpx 0rpx 0rpx 0rpx;
            border: 2rpx solid;
            border-image: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1), rgba(255, 255, 255, 1), rgba(255, 255, 255, 0)) 2 2;
           .theme_content {
                font-weight: 400;
                font-size: 40rpx;
            
                justify-content: center;
                // margin-bottom: 12rpx;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                image{
                    width: 116rpx;
                    height: 116rpx;
                    border-radius: 16rpx 16rpx 16rpx 16rpx;
                    border: 2rpx solid #F3FECE;
                    margin-right: 24rpx;
                }

                .theme_title {
                    // margin: 0 40rpx;
                        font-family: "倍数欧气值", sans-serif;
                }

                // .theme_deco {
                //     width: 80rpx;
                //     height: 6rpx;
                //     background: url("https://img.shinemang.com/gachaStatic/static/duiduipeng/style.png");
                //     background-size: 100% 100%;
                // }

                .theme_deco_right {
                    // transform: scaleX(-1);
                }
            }

            .theme_price {
                font-weight: 800;
                font-size: 32rpx;
                text-align: center;
            
            }


        }

        /* 状态栏 */
        .status_bar {
            // width: 648rpx;
            height: 80rpx;
            padding: 0 32rpx;
            // background: #E1C1F2;
            // border-radius: 16rpx;
            // border: 4rpx solid #FFFFFF;
            margin: 24rpx auto 0;
            display: flex;
            justify-content: space-between;

            // padding: 0 24rpx;

            .dashed {
                height: 70%;
                width: 1px;
                border-right: 2rpx dashed #A386CD;
                margin-right: 32rpx;
                margin-left: 40rpx;
            }

            .stat_item {
               width: 358rpx;
               position: relative;
                height: 80rpx;
                background: linear-gradient( 180deg, #FFF7A3 0%, #FFFEF9 100%);
                border-radius: 16rpx 16rpx 16rpx 16rpx;
                border: 4rpx solid #F894B8;
                overflow: hidden;
                padding: 0 24rpx;
                // margin-right: 26rpx;
                &:last-child{
                    // margin-right: 0;
                }

                .stat_label {
                    font-weight: 400;
                    font-size: 32rpx;
                    color: #000000;
                    font-family: "倍数欧气值", sans-serif;
                }

                .stat_num {
                    margin-left: 8rpx;
                    font-weight: 400;
                    font-size: 40rpx;
                    color: #FF659B;
                    font-family: "倍数欧气值", sans-serif;
                }

                .stat_use_txt {
                    width: 96rpx;
                    height: 40rpx;
                    background: #000000;
                    border-radius: 24rpx;
                    // font-weight: bold;
                    font-size: 24rpx;
                    color: #FFFFFF;
                    text-align: center;
                    line-height: 40rpx;
                    margin-left: auto;
                }

            }



        }

    .game_shell {
        width: 718rpx;
// height: 1068rpx
        padding: 32rpx 16rpx 60rpx;
        background: linear-gradient( 180deg, #B6EFFF 0%, #7BCFFE 100%);
        box-shadow: inset 0rpx 4rpx 12rpx 0rpx #FFFFFF, inset 0rpx -4rpx 12rpx 0rpx rgba(13,168,254,0.5);
        border-radius: 32rpx 32rpx 32rpx 32rpx;
        margin: 24rpx auto 0;
        // width: 100%;
        // height: 1304rpx;
        // background: url("https://img.shinemang.com/gachaStatic/static/duiduipeng/machine.png");
        background-size: 100% 100%;
        position: relative;

    }

    .popupShow {
        width: 100vw;
        height: 1166rpx;
        // background: url("https://img.shinemang.com/gachaStatic/static/duiduipeng/popupShow.png");
        background: #F5F6F8;
        border-radius: 32rpx 32rpx 0 0;
        background-size: 100% 100%;
        position: relative;
        bottom: 0;

        &::after{
        content: "";
        width: 100vw;
        height: 210rpx;
        left: 0;
        top: 0;
        position: absolute;
        z-index: 1;
        background: url('https://img.shinemang.com/gachaStatic/static/duiduipeng/topBG.png');
        background-size: 100% 100%;
      }
       

        .title {
            font-weight: 400;
            font-size: 36rpx;
            color: #1A1A1A;
            // font-family: "倍数欧气值", sans-serif;
            position: absolute;
            left: 50%;
            font-weight: bold;
            top: 28rpx;
            transform: translateX(-50%);
            z-index: 2;
        }

        .close {
            width: 56rpx;
            height: 56rpx;
            background: url("@/static/close.png");
            background-size: 100% 100%;
            position: absolute;
            top: -60rpx;
            right: 32rpx;
        }

        .prizeList {
            height: calc(100% - 120rpx);
            width: 702rpx;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 24rpx;
            position: absolute;
            bottom: 0;
            left: 50%;
            font-weight: 500;
            font-size: 20rpx;
            transform: translateX(-50%);
            flex-wrap: wrap;
            align-content: flex-start;
            padding: 20rpx 20rpx;
            padding-right: 0;
            justify-content: flex-start;
            overflow-y: auto;
            z-index: 2;

            .prizeItem {
                width: 212rpx;
                height: 294rpx;
                position: relative;
                box-sizing: border-box;
                margin-right: 12rpx;
                &:nth-child(3n){
                    margin-right: 0;
                }
                margin-bottom: 12rpx;
                .prizeBox{
                    text-align: center;
                    width: 212rpx;
height: 240rpx;
background: linear-gradient( 180deg, #FFF7A3 0%, #FFFEF9 100%);
border-radius: 16rpx 16rpx 16rpx 16rpx;
border: 2rpx solid #F1B966;
position: relative;
padding-top: 18rpx;
position: relative;

                }

                .prizeImg {
                    width: 180rpx;
                    height: 180rpx;
                    border-radius: 14rpx;
                    margin: auto;
                }

                .prizeName {
                    width: 100%;
                    padding: 0 12rpx;
                    margin-top: 8rpx;
                    margin-bottom: 4rpx;
                }

                .probability {
                    color: #818181;
                    padding: 0 12rpx;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                  height: 32rpx;
                    background: rgba(255, 147, 43, .5);
                    font-size: 20rpx;
                    color: #fff;
                    text-align: center;
                    border-radius: 0 0 16rpx 16rpx;
                }

                .frequency {
                    width: 116rpx;
                    height: 36rpx;
                    // font-weight: bold;
                    // background: linear-gradient(0deg, #B1FF4F 0%, #FDF678 100%);
                    background: url('https://img.shinemang.com/gachaStatic/static/duiduipeng/get.png');
                    background-size: 100% 100%;
                    // border-radius: 16rpx;
                    // border: 2rpx solid #FFFFFF;
                    position: absolute;
                    top: -13rpx;
                    left: 0;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    right: 0;
                    margin: 0 auto;
                    text-align: center;
                    line-height: 36rpx;
                    box-sizing: border-box;
                }
            }

        }

        .recordList {
            width: 702rpx;
            height: calc(100% - 120rpx);
            position: absolute;
            bottom: 0;
            left: 50%;
            font-weight: 500;
            font-size: 20rpx;
            transform: translateX(-50%);
            overflow-y: auto;
            z-index: 2;
            padding-bottom: 30rpx;

            .recordItem {
                width: 702rpx;
                height: 152rpx;
                background: rgba(255, 255, 255, 0.8);
                border-radius: 24rpx;
                align-items: center;
                padding: 0 20rpx;
                box-sizing: border-box;
                margin-bottom: 16rpx;

                .recordImg {
                    width: 120rpx;
                    height: 120rpx;
                    object-fit: cover;
                    border-radius: 14rpx;
                    flex-shrink: 0;
                    background: linear-gradient( 180deg, #FFF7A3 0%, #FFFEF9 100%);
                        border-radius: 16rpx 16rpx 16rpx 16rpx;
                        border: 2rpx solid #F1B966;
                }

                .right {
                    width: 552rpx;
                    height: 120rpx;
                    padding: 6rpx 18rpx;
                    align-content: space-between;

                    .goods {
                        width: 100%;

                        .recorName {
                            width: 410rpx;
                            font-weight: bold;
                            font-size: 26rpx;
                        }

                        .number {
                            font-weight: 400;
                            font-size: 36rpx;
                            color: #EA36D7;
                            font-family: "倍数欧气值", sans-serif;
                        }
                    }

                    .message {
                        width: 100%;
                        // font-weight: 500;
                        font-size: 24rpx;
                        color: #8D8D94;

                        .headPortrait {
                            width: 48rpx;
                            height: 48rpx;
                            border-radius: 50%;
                            margin-right: 8rpx;
                        }

                        .time {
                            font-size: 20rpx;
                            margin-left: auto;
                        }
                    }
                }

            }

        }
    }
}

.tab_pill_left {
    position: absolute;
    right: -18rpx;
    top: -8rpx;
    width: 154rpx;
    height: 60rpx;
    background: url("https://img.shinemang.com/gachaStatic/static/duiduipeng/prize_1.png");
    background-size: 100% 100%;
    z-index: 2;
}

/* 托管模式切换按钮（位于奖品概览下方） */
.auto_pilot {
    position: absolute;
    right: 0;
    top: 462rpx;
    height: 64rpx;
    padding: 0 20rpx 0 12rpx;
    background: rgba(0, 0, 0, 0.45);
    border-radius: 32rpx 0 0 32rpx;
    z-index: 2;

    .auto_pilot_ico {
        width: 40rpx;
        height: 40rpx;
        line-height: 40rpx;
        text-align: center;
        border-radius: 50%;
        background: #A386CD;
        color: #FFFFFF;
        font-size: 18rpx;
        margin-right: 8rpx;
    }

    .auto_pilot_txt {
        font-weight: 500;
        font-size: 24rpx;
        color: #FFFFFF;
    }

    &.auto_pilot_on {
        background: rgba(124, 92, 255, 0.85);

        .auto_pilot_ico {
            background: #EA36D7;
        }
    }
}

.tab_pill_right {
    position: absolute;
    top: -8rpx;
    left: -18rpx;
    width: 154rpx;
    height: 60rpx;
    background: url("https://img.shinemang.com/gachaStatic/static/duiduipeng/record_1.png");
    background-size: 100% 100%;
    z-index: 2;
}

.theme_fate_badge {
    position: absolute;
   
    width: 56rpx;
    height: 56rpx;

    top: 50%;
    transform: translateY(-50%);
    right:132rpx ;
    border-radius: 8rpx;
    background: #FF8ECC;
border: 2rpx solid #FFFFFF;

    // background: url("https://img.shinemang.com/gachaStatic/static/duiduipeng/destinyBg.png");
    // background-size: 100% 100%;
    z-index: 3;
   
    // display: flex;
    // align-items: center;
    // justify-content: center;

    .theme_fate_img {
        width: 120rpx;
        height: 132rpx;
        margin: 0 auto;
    }

}


.game_area{
    width: 686rpx;
// height: 976rpx;
height: 1020rpx;
background: #FFFFFF;
box-shadow: inset 8rpx 8rpx 8rpx 0rpx rgba(212,243,254,0.5);
border-radius: 24rpx 24rpx 24rpx 24rpx;
margin: auto;
padding:0 8rpx;
padding-top: 32rpx;
padding-bottom: 38rpx;
}

/* 卡桌区域 */
.table_area {
    width: 100%;
    padding: 16rpx 0rpx;
    position: relative;
}

/* 蒙版层：保留结构占位，默认不展示，可按动画需求打开 */
.table_mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 16rpx;
    z-index: 10;
    pointer-events: none;
    opacity: 0;
}

@keyframes maskFade {
    0% {
        opacity: 0;
    }

    20% {
        opacity: 1;
    }

    80% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}

.table_grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 2rpx;
    width: 100%;
}

.card_slot {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
    height: 100%;

    &.card_selected {
        border-color: #ffd700;
        box-shadow: 0 0 20rpx rgba(255, 215, 0, 0.4);
        transform: scale(1.05);
    }
}

.peng_img {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 456rpx;
    height: 288rpx;
    transform: translate(-50%, -50%);
    z-index: 20;
    pointer-events: none;
    animation: pengFade 0.5s ease forwards;
}

.card_mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 24rpx;
    z-index: 3;
    pointer-events: none;
}

.card_img {
    width: 222rpx;
    height: 282rpx;
    // margin: auto;
}

.card_overlay {
    position: absolute;
    bottom: 8rpx;
    right: 8rpx;
    width: 48rpx;
    height: 40rpx;
    z-index: 5;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;

    .check_ico {
        width: 48rpx;
        height: 40rpx;
    }
}

.card_back {
    // width: 208rpx;
    // height: 232rpx;
    // background: url("https://img.shinemang.com/gachaStatic/static/duiduipeng/cardBg.png");
    // background-size: 100% 100%;
}

.card_back1 {
    width: 222rpx;
    height: 282rpx;
    background: url("https://img.shinemang.com/gachaStatic/static/duiduipeng/card_1.png");
    background-size: 100% 100%;
}

/* 底部进度与按钮 */
.game_footer {
    width: 100%;
    height: 200rpx;
    padding: 30rpx 52rpx 0;
    position: absolute;
    bottom: -70rpx;
}

.progress_row {
    width: 100%;
    margin-bottom: 10rpx;
    font-size: 20rpx;
    color: #000000;

    .progress_num {
        margin-left: 16rpx;
        color: #FF932B;
    }
}



.progress_track {
    width: 100%;
    height: 16rpx;
    border-radius: 999rpx;
    background: #C5F9FB;
    // overflow: hidden;
    margin-bottom: 8rpx;

    .progress_inner {
        width: 0;
        height: 100%;
        border-radius: 999rpx;
        background: #FDE07B;
        transition: width 0.3s ease;
        position: relative;
        .image{
            background: url('https://img.shinemang.com/gachaStatic/static/duiduipeng/smallCard_1.png');
            background-size: 100% 100%;
            position: absolute;
            top: 50%;
            right: -14rpx;
            transform: translateY(-50%);
            width: 29rpx;
            height: 33rpx;
            
        }
    }
}



/* 开始游戏按钮行（开始按钮居中，模式切换按钮靠右） */
.start_row {
    position: relative;
    width: 100%;
}

/* 开始游戏按钮 */
.start_bar {
    width: 526rpx;
    height: 128rpx;
    background: url("https://img.shinemang.com/gachaStatic/static/duiduipeng/startGame.png");
    background-size: 100% 100%;
    margin: 0 auto;
}

/* 疯狂模式下的倍速开始按钮：与开始按钮尺寸一致 */
.start_bar_crazy {
    background: linear-gradient(90deg, #7c5cff, #ff4fd8);
    border-radius: 52rpx;
    font-weight: 600;
    font-size: 32rpx;
    color: #FFFFFF;
}

/* 疯狂/经典模式切换按钮 */
.crazy_switch {
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -28rpx;
    height: 56rpx;
    padding: 0 16rpx;
    line-height: 56rpx;
    text-align: center;
    border-radius: 28rpx;
    background: rgba(0, 0, 0, 0.45);
    font-weight: 500;
    font-size: 22rpx;
    color: #FFFFFF;

    &.crazy_switch_on {
        background: rgba(234, 54, 215, 0.85);
    }
}


/* 天命卡选择弹窗 */
.fate_select_mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.fate_select_box {
    width: 680rpx;
    border-radius: 24rpx;

    .fate_select_title {
        width: 442rpx;
        height: 80rpx;
        background: url("https://img.shinemang.com/gachaStatic/static/duiduipeng/tmk.png");
        background-size: 100% 100%;
        margin: 0 auto;
    }

    .fate_select_tip {
        width: 454rpx;
        height: 40rpx;
      background: linear-gradient( 90deg, rgba(255,101,155,0) 0%, #FF659B 50%, rgba(255,101,155,0) 99.52%);
        font-weight: 500;
        font-size: 24rpx;
        color: #FFFFFF;
        line-height: 32rpx;
        text-align: center;
        line-height: 40rpx;
        margin: 0 auto;
        margin-top: 8rpx;
        margin-bottom: 40rpx;
    }
}

.fate_list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0rpx;
    z-index: 1;
}

.fate_option {
    width: 222rpx;
    height: 282rpx;
    // background: url("https://img.shinemang.com/gachaStatic/static/duiduipeng/cardBg.png");
    // background-size: 100% 100%;
    // position: relative;
    // overflow: hidden;

    // 选中状态：放大
    &.fate_selected {
        transform: scale(1.05);
        border-color: #ffd700;
        box-shadow: 0 0 24rpx rgba(255, 215, 0, 0.6);
        z-index: 2;
    }

    // 置灰状态：其他卡片
    &.fate_greyed {
        opacity: 0.4;
        filter: grayscale(80%);
        pointer-events: none;
    }

    // 托管随机选卡：高亮闪烁，与选中态保持一致的金色放大发光风格
    &.fate_rolling {
        border-color: #ffd700;
        z-index: 2;
        // 动画期间屏蔽点击，避免自动选卡与手动选卡冲突
        pointer-events: none;
        animation: fateRollFlash 0.3s ease-out forwards;
    }

    // 置灰退出动画：未选中的卡片渐渐变小淡出
    &.fate_greyed.fate_exit {
        animation: greyedExit 0.5s ease forwards;
    }

    // 退出动画：选中的卡片慢慢变小淡出
    &.fate_exit {
        animation: greyedExit 0.5s ease forwards;
    }

    .fate_opt_img {
        // width: 192rpx;
        // height: 192rpx;
      width: 222rpx;
    height: 282rpx;
        // position: absolute;
        // top: 50%;
        // left: 50%;
        // margin-top: -96rpx;
        // margin-left: -96rpx;
        // z-index: 1;
    }

    // 选中标记（勾选图标）
    .fate_check {
        position: absolute;
        bottom: 8rpx;
        left: 50%;
        transform: translateX(-50%);
        width: 40rpx;
        height: 40rpx;
        background: #ffd700;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24rpx;
        color: #1a0533;
        font-weight: bold;
        z-index: 3;
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
    }
}

/* 奖励物品弹窗 */
.awards_mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1100;
}

.awards_box {
    width: 100vh;

    .awards_title {
        position: relative;
        // top: 50rpx;
        width:324rpx;
        height: 88rpx;
        background: url("https://img.shinemang.com/gachaStatic/static/duiduipeng/gainTitle1.png");
        background-size: 100% 100%;
        margin: auto;
    }

    .awardsImg {
        width: 670rpx;
        height: 670rpx;
        background: url("https://img.shinemang.com/gachaStatic/static/duiduipeng/ligth1.png");
        background-size: 100% 100%;
        margin-top: 48rpx;
        position: relative;
        transform-origin: center center;
        animation: awardsZoomIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;

        .awards_number {
            font-family: "倍数欧气值", sans-serif;
            font-weight: 400;
            width: 398rpx;
            height: 56rpx;
            text-align: center;
            line-height: 56rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48rpx;
            color: #fff;
            position: absolute;
            top: -36rpx;
            left: 50%;
            transform: translateX(-50%);
        }

        .awards_img {
            width: 400rpx;
            height: 400rpx;
            position: absolute;
            left: 50%;
            top: 104rpx;
            transform: translateX(-50%);
        }

        @keyframes awardsZoomIn {
            0% {
                opacity: 0;
                transform: scale(0.2);
            }

            100% {
                opacity: 1;
                transform: scale(1);
            }
        }

        .awards_name {
            width: 100%;
            height: 40rpx;
            font-weight: bold;
            font-size: 28rpx;
            color: #FFFFFF;
            position: absolute;
            bottom: 32rpx;
            left: 50%;
            transform: translateX(-50%);

            .awardsName {
                max-width: 372rpx;
            }

            .awardsNumber {
                flex-shrink: 0;
                white-space: nowrap;
                color: #FEF47D;
                margin-left: 4rpx;
            }
        }
    }
   .closeBtn{
    width: 56rpx;
    height: 56rpx;
    background: url('@/static/close.png');
    background-size: 100% 100%;
    margin-top: 36rpx;
   }
}

.awards_btn_group {
    width: 406rpx;
    height: 120rpx;
    background: url("https://img.shinemang.com/gachaStatic/static/duiduipeng/confirmReceipt.png");
    background-size: 100% 100%;
}

/* 动画 */
@keyframes greyedExit {
    0% {
        transform: scale(1);
        opacity: 0.4;
    }

    100% {
        transform: scale(0.6);
        opacity: 0;
    }
}

/* 托管随机选卡：高亮流转时的金色闪烁，每流转到一张卡即重新触发 */
@keyframes fateRollFlash {
    0% {
        transform: scale(1);
        box-shadow: 0 0 0 rgba(255, 215, 0, 0);
    }

    30% {
        transform: scale(1.06);
        box-shadow: 0 0 28rpx rgba(255, 215, 0, 0.95);
    }

    100% {
        transform: scale(1.02);
        box-shadow: 0 0 16rpx rgba(255, 215, 0, 0.5);
    }
}

@keyframes pengFade {
    0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.7);
    }

    20% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1.05);
    }

    80% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }

    100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.9);
    }
}
</style>
