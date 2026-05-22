<!-- 首页内容 -->
<template>
    <view class="home-con" :class="{ mpWeixin: ISmp() }" :style="{ paddingTop: MBInfo().top + 'px' }">
        <!-- 公告 -->
        <view class="notice_top flex_r flex_jb flex_ac">
            <!-- 微信小程序不用-->
            <!-- <img src="https://img.chaoshewang.com/static/img/home/ico_ico2.png" class="logo_img"
                :style="{ height: MBInfo().height - 2 + 'px' }" /> -->
            <!-- 微信小程序不用-->
            <view class="notice-bar flex_r flex_jb flex_ac" :style="{ height: MBInfo().height + 'px', width: boundW }">
                <view class="notice_con flex_r flex_ac"
                    @click="goto('/page-activity/notice/notice-details', { id: noticeList[0].id })">
                    <view class="l_ico flex_jc flex_ac">
                        <img src="../../static/gachaStatic/home/notice.png" class="ico">
                        <view>公告栏</view>
                    </view>
                    <u-notice-bar :text="notices[0]" :fontSize="11" color="#1A1A1A" bgColor="transparent"></u-notice-bar>
                </view>
                <!-- <view class="notice_btn" @click="goto('/page-activity/notice/notice-list')">
                    <view v-if="mail !== '0' && mail" class="notice_num">{{ mail > 99 ? '99+' : mail }}</view>
                </view> -->
            </view>
        </view>
        <scroll-view :style="{
            height:`calc(100vh - ${MBInfo().height}px - ${MBInfo().top}px - 28rpx)`
        }" scroll-with-animation="true"  @scroll="scroll" :scroll-top="scrollTop" @scrolltolower="onReachScollBottom" class="home-scroll" :scroll-y="true" :refresher-enabled="true"
            refresher-background="rgba(0,0,0,0)" :refresher-threshold="60" :refresher-triggered="triggered"
            @refresherrefresh="onRefresh" @refresherrestore="onRestore">
            <!-- AD banner -->
            <view class="head-adbar">
                <u-swiper @click="tn" :list="list3" indicator height='292rpx' indicatorMode="dot" circular
                    radius="18rpx" indicatorStyle="bottom: 10px" indicatorActiveColor="#7240F1"
                    indicatorInactiveColor="#ffffff"></u-swiper>
            </view>
            <!-- 微信小程序不需要 中间的--> 
            <view class="ad-entry flex_r flex_jb">
                <view>
                    <image
                        @click.stop = "ontab({index:1,type:'top'})"
                        style="width: 336rpx;
                         height: 280rpx;"
                        src="../../static/gachaStatic/home/niudan.png"
                        mode="scaleToFill"
                    />
                </view>
                <view style="width: 336rpx;">
                      <image
                        @click.stop =  "ontab({index:2,type:'top'})"
                        style="width: 336rpx;
                         height: 134rpx;margin-bottom: 12rpx;"
                        src="../../static/gachaStatic/home/gacha.png"
                        mode="scaleToFill"
                      />
                        <image
                          @click.stop =  "ontab({index:3,type:'top'})"
                        style="width: 336rpx;
                         height: 134rpx;"
                        src="../../static/gachaStatic/home/ddl.png"
                        mode="scaleToFill"
                      />
                </view>
                <!-- <view class="ads_l flex_c flex_jb">
                    <image class="item" @click="goto('/pages/chaowan/gachasList', { type: 1 })"
                        src="https://img.chaoshewang.com/static/img/home/yifanshang.png" />
                    <image class="item" v-if="egg.open" @click="goto('/page-activity/egg/index')"
                        src="https://img.chaoshewang.com/static/img/home/chaodan.png" />
                    <image class="item" v-else @click="onclickNew"
                        src="https://img.chaoshewang.com/static/img/home/yysx.png" />
                </view>
                <view class="welfare_show flex_r flex_jb" v-if="activity.open">
                    <image class="item" @click="goto('/page-activity/welfare/index')"
                        src="https://img.chaoshewang.com/static/img/home/welfare.png" />
                    <image class="item" @click="goto('/pages/chaowan/gachasList', { type: 2 })"
                        src="https://img.chaoshewang.com/static/img/home/niudanji.png" />
                </view>
                <view class="ads_r" @click="goto('/pages/chaowan/gachasList', { type: 2 })" v-else>
                    <view class="item_tit">
                        <view class="tit">潮魂扭蛋机</view>
                        <view class="txt">3C·潮玩</view>
                    </view>
                </view> -->
            </view>
            <!-- 爆爆爆活动 -->
            <!-- <view v-if="!allIn.open" class="allIn" @click="goto('/pages/chaowan/gachasList', { type: 3 })">
                <img src="https://img.chaoshewang.com/static/img/duoyou/syBg.png" class="allIn_img" />
            </view> -->
            <!-- <view class="allIn" v-else
                @click="goto('/pages/product/allCaptured', { val: allIn.paramsMap.theme_id, name: allIn.paramsMap.name })">
                <img :src="allIn.imageUrlMap.bg" class="allIn_img" />
                <view class="allIn_tiem"> <u-count-down :time="residuetime" :show-days="false"></u-count-down></view>
            </view> -->
            <!-- 微信小程序不需要  tab链-->
            <view class="tab">
                <!-- 微信小程序不需要 -->
                <u-tabs :current="active_m" :lineWidth='lineWidth' :list="navbar" @click="ontab" lineColor="#333" :activeStyle="activeStyl"
                    itemStyle=" height: 60px;"></u-tabs>
                <!-- <image src="https://img.chaoshewang.com/static/img/home/Group 1261155200@2x.png"
                    :class="[active_m == 2 ? 'shopping' : 'shopping1']" @click="ontab(2)" /> -->
                <!-- <image src="https://img.chaoshewang.com/static/img/home/welfare-icon.png"
                    :class="[active_m == -1 ? 'welfare' : 'welfare1']" @click="ontab(-1)" /> -->
                <!-- 微信小程序不需要 -->
            </view>

            <view style="min-height: 1400rpx;width: 100%;">
               <product-list v-if="active_m == 0" :type="active_m + 1" :IsScroll.sync="IsScroll" ref="productList" />
               <product-list1 v-else  :type="active_m + 1" :IsScroll.sync="IsScroll1" ref="productList1" />

            </view>
        </scroll-view>
        <!-- <x-first :visible.sync="firstShow" /> -->
         <!-- 没用到 -->
        <x-pay ref="xPay" :probabilityShow=[] />
        <!-- 下载app弹窗-->
        <x-modal :visible.sync="downShow" />
    </view>
</template>
<script>
import { post, activityLIst } from "@/utils/api.js";
import productList from "./modules/product-list.vue";
import productList1 from "./modules/product-list1.vue";
import xPay from "@/components/x-pay/index.vue";
import { mapActions, mapState, mapMutations } from "vuex";
import xModal from "@/components/modules/x-modal";
import { service } from '@/utils/fun.js';
export default {
    data() {
        return {
            scrollTop:0,
            scrollTop1:0,
            list3: [],
            activeStyl: {
                color: "#1A1A1A",
                fontWeight: "bold",
                fontSize: "18px",
              
            },
              navbar: [
                {
                    name: "热门推荐",
                },
                {
                    name: "扭蛋赏",
                },
                 {
                    name: "无限赏",
                },
                 {
                    name: "洞洞赏",
                },
            ],
            // navbar: [
            //     {
            //         name: "热门",
            //     },
            //     {
            //         name: "捡漏专区",
            //     },
            // ],
            active_m: 0,
            IsScroll: false,
            IsScroll1: false,
            noticeList: [],
            notices: [""],
            firstShow: false,
            lineWidth: "40rpx",
            triggered: true,
            page: 1,
            downShow: false,
            msgList: [],
            alarmMsgInstance: null,
            ceshi: 1,
            activity: false,
            residuetime: 0,
            timeData: {},
            allIn: { open: false },
            egg: { open: true },
        };
    },
    components: {
        productList,
        productList1,
        xPay,
        xModal,
    },
    mounted() {
        // #ifdef MP-WEIXIN
        // this.ontab(2);
        // #endif
        // #ifdef APP-PLUS
        let a = 0;
        a = Object.keys(this.userInfo).length;
        let that = this;
        uni.getNetworkType({
            success: function (res) {
                if (res.networkType !== "none" && a > 0) {
                    that.checkVersion();
                }
            },
        });
        // #endif
    },
    created() {
        this.getBannerList();
        this.showFirstActive();
    },
    methods: {
        scroll(e){
            this.scrollTop1 = e.detail.scrollTop
        },
        ...mapActions([
            "asyncUpdateInfo",
            "asyncUpBalance",
            "asyncUpOffsetInfo",
        ]),
        ...mapMutations(["UpMail", 'RandomDiscount']),
        getTime(data) {
            this.time = moment().format("YYYY年MM月DD日, hh:mm:ss");
            this.data = data;
        },
        ontab(item) {
                if(item.type == 'top'){
                   this.scrollTop = this.scrollTop1
                   this.$nextTick(() => {
                        let px = 656 * this.SystemInfo.screenWidth /750 ;
                        this.scrollTop=px
                   })
            }
            if ([item, item.index].includes(this.active_m)) return;
            this.page = 1;
            // if (item == 2 || item == -1) {
            //     this.active_m = item;
            //     this.activeStyl = {};
            //     this.lineWidth = "0rpx";
            // } else {
                this.active_m = item.index;
            
                this.activeStyl = {
                    color: "#1A1A1A",
                    fontWeight: "bold",
                    fontSize: "18px",
                    transform: "scale(1.05)",
                };
                this.lineWidth = "40rpx";
            // }

        
        },
        async getBannerList() {
            this.list3 = [];
            post("v1/publicize/banner/list").then((res) => {
                for (let s of res.banners) {
                    this.list3.push({
                        url: s.bannerUrl,
                        id: s.targetId,
                        type: s.type,
                        name: s.name,
                        key: s.protocolKey,
                        targetType: s.targetType,
                    });
                }
            });
            post("v1/system/notice/list", {
                type: 1,
            }).then((res) => {
                if (!res.code) {
                    this.noticeList = res.notices;
                    this.notices = res.notices.map((i) => i.title);
                    getApp().globalData.noticeInfo = res.notices;
                }
            });
            // console.log(this.userInfo,'userInfo')
            if(this.userInfo.id){
                post("v1/publicize/mail", { page: 1, page_size: 1 }).then((res) => {
                if (!res.code) {
                    this.UpMail(res.unread);
                }
            });
            }
           if(this.userInfo.id){
              let a = await activityLIst({
                key: ["Task", "ShareBill", "Lottery", 'RandomDiscount'],
            });
          
            a?.activities?.map((i) => {
                if (i.key == "ActivityKey_Task") this.activity = i;
                if (i.key == "ActivityKey_ShareBill") this.allIn = i;
                if (i.key == "ActivityKey_Lottery") this.egg = i;
                if (i.key == "ActivityKey_RandomDiscount") this.RandomDiscount(Object.keys(i).length ? i.open : false);
            });
           }
          
            if (this.allIn.open) {
                const todayStr =
                    new Date().toISOString().split("T")[0] +
                    " " +
                    this.allIn.dailyEndTime;
                this.residuetime = this.remainingTime(todayStr);
            }
        },
        onReachScollBottom() {
            this.IsScroll = true;
            this.IsScroll1 = true;
        },
        onReachScollBottom() {
            if (this.active_m == 0) {
                this.page = this.page + 1;
                this.$refs.productList.getlist(this.page);
            }else{
                this.page = this.page + 1;
                this.$refs.productList1.getlist(this.page);
            }
            return;
        },
        onRefresh() {
            if(this.active_m == 0){
               this.$refs.productList.getlist(1);
            setTimeout(() => {
                this.triggered = false;
            }, 600);
            }else{
                 this.$refs.productList1.getlist(1);
            setTimeout(() => {
                this.triggered = false;
            }, 600);
            }
           
        },
        onRestore() {
            this.page = 1;
            this.triggered = "restore"; // 需要重置
        },
        onclickNew() {
            this.$sl("chaowanInx", 2, 1);
            uni.setStorageSync("currentChange", 0);
            uni.reLaunch({
                url: "/pages/index/index?chaowanInx=2",
            });
        },

        tn(index) {
            const item = this.list3[index];
            const { type, id, key, targetType } = item;
            const itemJson = JSON.stringify(item);
            // 产品类型路由处理函数
            const productRoutes = {
                1: () =>
                    id !== 0 && this.goto("/pages/product/yifanshang", { id }),
                2: () => {
                    if (id === 0) return;

                    // #ifdef MP-WEIXIN
                    this.downShow = true;
                    // #endif

                    // #ifndef MP-WEIXIN
                    this.goto("/pages/product/niudan", { id });
                    // #endif
                },
                3: () => {
                    if (id === 0) return;

                    // #ifdef MP-WEIXIN
                    this.downShow = true;
                    // #endif

                    // #ifndef MP-WEIXIN
                    this.goto("/pages/product/chaowanshang", { id });
                    // #endif
                },
                4: () => {
                    if (id === 0) return;

                    // #ifdef MP-WEIXIN
                    this.downShow = true;
                    // #endif

                    // #ifndef MP-WEIXIN
                    this.goto("/pages/product/dongle", { id });
                    // #endif
                },
                5: () => {
                    if (id === 0) return;

                    // #ifdef MP-WEIXIN
                    this.downShow = true;
                    // #endif

                    // #ifndef MP-WEIXIN
                    this.goto("/pages/product/chaosheshang", { id });
                    // #endif
                },
            };

            // 活动类型路由处理函数
            const activityRoutes = {
                100: () => this.goto("/page-activity/activity/index"),
                102: () =>
                    this.goto("/page-activity/ticket/index", { itemJson }),
                103: () => this.goto("/page-activity/huigui/index", { id }),
                104: () => this.goto("/page-activity/ticketc/index", { id }),
                105: () => this.goto("/page-activity/ocean/index", { id }),
                106: () => this.goto("/page-activity/turntable/index", { id }),
                107: () => this.goto("/page-activity/pyramid/index", { id }),
                108: () => this.goto("/page-activity/newYear/index", { id }),
                411: () => this.goto("/page-activity/battleOrder/index", { id }),//战令
                400: () => this.goto('/page-activity/welfare/index', { id }),//任务
                109: () =>
                    this.goto("/page-activity/friendReturn/index", {
                        itemJson,
                    }),
                200: () =>
                    this.goto("/page-activity/activityDescription/index", {
                        id,
                        key,
                        targetType,
                    }),
                201: () => this.goto('/pages/common/rulepop', { key }),
                300: () => service(),
                101: () => { }, // 不执行任何操作
            };

            // 合并所有路由处理函数
            const routeHandlers = { ...productRoutes, ...activityRoutes };
            // 执行对应的路由处理函数
            if (routeHandlers[type]) {
                routeHandlers[type]();
            }
        },
        showFirstActive() {
            let show = uni.getStorageSync("firstActive");
            if (!show) {
                uni.setStorageSync("firstActive", true);
                this.firstShow = true;
            }
        },
        // 首页更新
        async checkVersion() {
            // let firstTime = uni.getStorageSync('firstTime')
            // console.log(typeof !firstTime ,firstTime, '测试更新1');
            let that = this;
            let gres = await post("v1/system/version");// 获取版本号超过就显示弹窗
            if (that.SystemInfo.uniPlatform == "app") {
                uni.request({
                    url: "https://img.chaoshewang.com/download/app.version",
                    success: (res) => {
                        let newVer = Number(res.data.replace(/\./g, ""));//获取当前版本号
                        let toVer = that.appversion.replace(/[.]/g, ""); //获取的是上一个包的版本号
                        let popupVersion = gres.versionText.version.replace(/[.]/g, "");
                        if (newVer > Number(toVer)) {
                            if (newVer > Number(popupVersion)) {
                                // uni.setStorageSync("firstTime", true) || !firstTime
                                uni.downloadFile({
                                    url: "https://img.chaoshewang.com/download/chaoshe.wgt",
                                    success: (downloadResult) => {
                                        plus.runtime.install(
                                            downloadResult.tempFilePath,
                                            { force: true },
                                            () => {
                                                plus.runtime.restart();
                                            }
                                        );
                                    },
                                });
                            } else {
                                uni.navigateTo({
                                    url:
                                        "./upgrade?info=" +
                                        encodeURIComponent(
                                            JSON.stringify(gres)
                                        ),
                                });
                            }
                        }
                    },
                });
            }
        },
    },
    computed: {
        ...mapState(["mail", 'userInfo']),
        boundW() {
       
        //    this.asyncUpdateInfo();
          
            if(this.userInfo.id){
                this.asyncUpBalance();
                this.asyncUpOffsetInfo();
            }
         
            let w = this.SystemInfo.windowWidth;
            let va = this.MBInfo().width;
            let str = w - va - 32 + "px";
            return va > 0 ? str : "542rpx";
        },
    },
};
</script>
<style lang="scss" scoped>
::v-deep .u-count-down__text {
    color: #ffffff;
    font-weight: 500;
    font-size: 24rpx;
    height: 36rpx;
    line-height: 36rpx;
    text-align: center;
}

.u-tabs {
    height: 57px !important;
}

.u-tabs__wrapper {
    height: 57px !important;
}

.home-con {
    width: 100vw;
    height: 100vh;
    padding: 96rpx 0;
    padding-bottom: 0;
    position: relative;
    z-index: 2;
      &::after {
        content: "";
        width: 100vw;
        height: 600rpx;
        left: 0;
        top: 0;
        position: absolute;
        z-index: 1;
        background: linear-gradient( 269deg, #9CF9F1 0%, #ACFDBD 100%);    }
}

.notice_top {
    margin-bottom: 28rpx;
    padding-left: 32rpx;
    position: relative;
    z-index: 4;
    .logo_img {
        width: 126rpx;
    }

    .notice-bar {
        height: 70rpx;
        background-color: rgba(255, 255, 255, 0.5);
        border-radius: 35rpx;
        font-size: 22rpx;
        color: $motif-color;
        padding: 0 16rpx 0 22rpx;
        padding-left: 0;

        .notice_con {
            width: calc(100%);
            height: 100%;


            .l_ico {
                width: 132rpx;
                line-height: 100%;
                background: #1A1A1A;
                border-radius: 32rpx 32rpx 32rpx 32rpx;
                // height: 24rpx;
                height: 100%;
                // border-right: 2rpx solid $motif-color;
                // padding-right: 10rpx;
                display: flex;
                font-size: 24rpx;
                // font-weight: bold;
                color: #fff;
                .ico {
                    width: 32rpx;
                   
                    height: 32rpx;
                    margin-right: 4rpx;
                    vertical-align: middle;
                }
            }

            .notice_name {
                width: calc(100% - 50rpx);
            }
        }

        .notice_btn {
            color: #fff;
            height: 42rpx;
            width: 132rpx;
            line-height: 40rpx;
            text-align: right;
            background-image: url("https://img.chaoshewang.com/static/img/home/ntc-4.png");
            background-size: 100% 100%;
            position: relative;
            font-weight: 500;
            font-size: 20rpx;
            color: #ffffff;

            .notice_num {
                position: absolute;
                right: -16rpx;
                top: -16rpx;
                width: 32rpx;
                height: 32rpx;
                line-height: 32rpx;
                text-align: center;
                background: #ff411b;
                border-radius: 50%;
            }
        }
    }
}

.home-scroll {
    z-index: 4;
    // height: calc(100% - 32px - 28rpx);
    background: #F5F6F8;
border-radius: 32rpx 32rpx 32rpx 32rpx;
padding: 32rpx;
padding-bottom: 0;
position: relative;

}

.head-adbar {
    width: 100%;
    height: 292rpx;
  ::v-deep.u-swiper-indicator__wrapper__dot{
        width: 12rpx;
height: 12rpx;
background-color: #000 !important;
border-radius: 50%;
border: 4rpx solid #FFFFFF;
opacity: 0.5;
&.u-swiper-indicator__wrapper__dot--active{
   transform: scale(1.2);
opacity: 1;
}
    }

}
  
.tab {
    display: flex;
    z-index: 1;
    ::v-deep .u-tabs__wrapper__nav__line {
        background: linear-gradient( 90deg, #31E597 0%, #40E0EA 100%) !important;
        border-radius: 6rpx 6rpx 6rpx 6rpx;
        width: 32px !important;
        height: 6px !important;
        bottom: 15px !important;
    }
    .shopping {
        width: 120rpx;
        height: 112rpx;
    }

    .shopping1 {
        width: 96rpx;
        height: 89rpx;

    }

    .welfare {
        width: 144rpx;
        height: 112rpx;
    }

    .welfare1 {
        width: 129.6rpx;
        height: 100.8rpx;
    }
}

.ad-entry {
    // margin: 18rpx 0 10rpx;
    margin-top: 32rpx;


    .ads_l,
    .ads_r {
        width: calc(50% - 10rpx);
        height: 260rpx;
    }

    .ads_l {
        .item {
            width: 100%;
            height: 123rpx;
        }
    }

    .ads_r {
        background-image: url("https://img.chaoshewang.com/static/img/home/cp-3-1.png");
        background-size: 100% 100%;
        position: relative;
        padding: 22rpx 28rpx;
    }

    .welfare_show {
        width: 334rpx;
        height: 260rpx;

        .item {
            width: 160rpx;
            height: 100%;
        }
    }

    .item_tit {
        font-size: 22rpx;
        color: #fff;

        .tit {
            font-size: 34rpx;
            font-weight: 600;
            margin-bottom: 8rpx;
        }
    }
}

.allIn {
    width: 686rpx;
    height: 228rpx;
    border: 1px solid #e5e5e5;
    border-radius: 20rpx;
    margin-top: 20rpx;
    overflow: hidden;
    position: relative;

    .allIn_img {
        width: 100%;
        height: 100%;
    }

    .allIn_tiem {
        position: absolute;
        top: 8rpx;
        left: 8rpx;
        padding: 0 16rpx;
        height: 36rpx;
        border-radius: 6rpx;
        background: rgba(0, 0, 0, 0.5);
    }
}

.filtrate-bar {
    color: #999;
    font-size: 26rpx;

    .l {
        .fil-item {
            margin-right: 32rpx;
        }

        .sim {
            font-size: 20rpx;
        }
    }

    .fil-item {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
}

.mpWeixin {
    .notice-bar {
        width: calc(100% - 160rpx);
    }
}
</style>