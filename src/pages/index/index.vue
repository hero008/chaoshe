<!-- 首页中转界面-->
<template>
    <view>
        <view class="index_page">
          
          
            <!-- <chao-wan v-if="tbStyle.selectIndex == 0" :inx.sync="chaowanInx" /> -->
            <!-- 微信小程序不需要 -->
            <market v-if="tbStyle.selectIndex == 1" ref="marketPage" />
            <!-- 微信小程序不需要 -->
            <home  v-if="tbStyle.selectIndex == 0" />
            <shang-gui v-if="tbStyle.selectIndex == 2" ref="shangGui" />
            <my v-if="tbStyle.selectIndex == 3" ref="tabmy" />
            <!-- 底部导航 -->
            <tabbar :tbStyle.sync="tbStyle" ref="xtabbar" @currentChange="currentChange" />
            <!-- 微信协议 -->
            <!-- #ifdef MP-WEIXIN  -->
            <!-- <mp-privacy initiative /> -->
            <!-- #endif -->

           <u-popup zIndex='999999999' bgColor='transparent' class="bannerPoupon"  :overlayStyle="{background:'rgba(0,0,0,0.7)'}"  round="24" :show="showBannersActivity"  mode="center">
            <scroll-view v-if="showBannerActivityDetail" scroll-y class="showBannerActivityContent">
                <!-- <text>出淤泥而不染，濯清涟而不妖</text> -->
                 <div @click="toTarget(showBannerActivityDetail)" v-html="showBannerActivityDetail.content">

                 </div>
                
            </scroll-view>
             <div @click="closeBannerActivityPoupon" class="closeIcon"></div>
		</u-popup>
        </view>
    </view>
</template>
<script>
import chaoWan from "@/pages/chaowan/index.vue";
// #ifndef MP-WEIXIN
import market from "@/pages/market/index.vue";
// #endif
import home from "@/pages/index/home.vue";
import shangGui from "@/pages/product/shanggui.vue";
import my from "@/pages/my/index.vue";
import tabbar from "@/components/tabbar/tabbar.vue";
// #ifdef MP-WEIXIN
import mpPrivacy from "@/components/modules/mp-privacy.vue";
// #endif
import { mapState } from "vuex";
import { post } from "@/utils/api.js";
import { getWebSocket } from "../../utils/webSocket";
import DanmakuSimple from '@/components/danmu/danmu'
import { goto } from "../../utils/fun";
import { getMsg } from "../../utils/webSocket";
export default {
    data() {
        return {
            showBannersActivity: false,
            showBannerIndex:0,
            showBannerActivityDetail:null,
            bannersActivityList:[],
            tbStyle: {
                selectIndex: 2,  // 默认展示首页
            },
            chaowanInx: 1,  // 潮玩tab 默认一
            isPopupVisible: true, // 没用到, 
            loading: true, // 没用到
            danmakuList: [],
              colors: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6bcb'],
      messages: ['大家好！', '666', '太棒了', '哈哈', '加油！', '😊']
        };
    },

    components: {
        chaoWan,
        // #ifndef MP-WEIXIN
        market,
        // #endif
        home,
        shangGui,
        tabbar,
        my,
        // #ifdef MP-WEIXIN
        mpPrivacy,
        // #endif
        DanmakuSimple
    },
    computed: {
        ...mapState(["popupWebSocket", 'userInfo']),
    },
    watch:{
     
    },
    async onLoad(da) {
         if(this.userInfo && this.userInfo.id){
            this.getActivityBannerList();
            let gachaName = uni.getStorageSync('gachaName');
            let gachaId = uni.getStorageSync('gachaId');
            if(gachaName && gachaId){
                uni.removeStorageSync('gachaName');
                uni.removeStorageSync('gachaId');
                if(gachaName == 'ddl'){
                    this.goto('/pages/product/dongle',{id:gachaId})
                }else if(gachaName == 'ndj'){
                     this.goto("/pages/product/niudan", { id: gachaId });
                }else if(gachaName == 'wxs'){
                     this.goto("/pages/product/chaowanshang", { id: gachaId });
                }
            }
         }
        if (da.chaowanInx) this.chaowanInx = Number(da.chaowanInx); // 潮玩的tab 传进来
        let a = 0;
        a = Object.keys(this.userInfo).length;
        let that = this;
        uni.getNetworkType({
            success: function (res) {
                // 只有app 端检查版本
                if (res.networkType !== "none" && a > 0) {
                    // #ifdef APP-PLUS
                    that.checkVersion();
                    // #endif
                }
            },
        });
        if (
            !this.popupWebSocket &&  uni.getStorageSync("aToken")
        ) {
            // getWebSocket(this); // 链接socket
        }
    },
  
    onShow() {
        let inx = uni.getStorageSync("currentChange"); //当前底部的tab
        inx = [0, 1, 2, 3, 4].includes(inx) ? inx : 2; // 是否包含在tab上面
        this.tbStyle.selectIndex = inx; //当前tab 选中
        if (this.$refs.xtabbar) this.$refs.xtabbar.upindex(inx); // 修改
        if (this.$refs.marketPage && inx == 1) this.$refs.marketPage.refresh(); //刷新对应的界面
        if (this.$refs.tabmy && inx == 4) this.$refs.tabmy.tabload();//刷新对应的界面
        if (this.$refs.shangGui && inx == 3) this.$refs.shangGui.loadDetail(1);//刷新对应的界面
    },
    methods: {
        test(){
 const randomMsg = this.messages[Math.floor(Math.random() * this.messages.length)];
      const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
      const randomSize = 16 + Math.floor(Math.random() * 10);
      
      this.danmakuList.push({
        text: randomMsg,
        color: randomColor,
        fontSize: randomSize + 'px',
        duration: (6 + Math.random() * 4) + 's'
      });
        },
        
        toTarget(value){
            if(value.targetId){
                if(value.targetType == 'WindowTargetType_Gashapon'){
                        this.goto('/pages/product/niudan',{id:value.targetId})
                        this.closeBannerActivityPoupon()
                }else if(value.targetType == 'WindowTargetType_ChaoPlay'){
                      this.goto('/pages/product/chaowanshang',{id:value.targetId})
                        this.closeBannerActivityPoupon()
                }else if(value.targetType == 'WindowTargetType_SurpriseBox'){
                       this.goto('/pages/product/dongle',{id:value.targetId})
                         this.closeBannerActivityPoupon()
                }else{

                    console.log(value.targetId,value.targetId == -1,'targetId');
                    if(value.targetId == -1){
                        this.goto('/pages/my/cardpack')
                        this.closeBannerActivityPoupon()
                    }
                }
            }
        },
        closeBannerActivityPoupon(){
              var isSeeList = uni.getStorageSync('seeActivityBannerList') || [];
              if(this.showBannerActivityDetail.type == 'WindowType_NormalDailyOnce'){
                const index = isSeeList.findIndex(seen => seen.id === this.showBannerActivityDetail.id);
                if(index != -1){
                    isSeeList[index].seeTime = this.getNowDate();
                  
                }else{
                    isSeeList.push({id:this.showBannerActivityDetail.id,seeTime:this.getNowDate()})
                }
                uni.setStorageSync('seeActivityBannerList', isSeeList);
              }else if(this.showBannerActivityDetail.type == 'WindowType_NormalFirstLogin'){
                     uni.removeStorageSync('isNew');
              }
           if(this.showBannerIndex + 1 == this.bannersActivityList.length){
            this.showBannersActivity = false;
           }else{
            this.showBannerIndex = this.showBannerIndex + 1;
            this.showBannerActivityDetail = this.bannersActivityList[this.showBannerIndex];
           }
        },

        getNowDate(){
            const now = new Date();
        const year = now.getFullYear();     // 年份，如 2024
        const month = now.getMonth() + 1;   // 月份（0-11，需要+1）
        const day = now.getDate();      

        return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
        },
        getActivityBannerList(){
            post("v1/publicize/window/list").then(res=>{
                let arr = []
                res.window.forEach(item=>{
                    if(item.type != 'WindowType_Nil'){
                       var isSeeList = uni.getStorageSync('seeActivityBannerList') || [];
                       if((item.condition == 'WindowCondition_NoFirstBuy' && !this.userInfo.isFirstBuy) || item.condition != 'WindowCondition_NoFirstBuy'){
                            if(item.type == 'WindowType_NormalDailyOnce'){
                                if(isSeeList.length > 0){
                                    const index = isSeeList.findIndex(seen => seen.id === item.id);
                                    if(index ==-1){
                                        arr.push(item)
                                    }else{
                                        if(isSeeList[index].seeTime != this.getNowDate()){
                                            arr.push(item)
                                        }
                                    }
                                }else{
                                    arr.push(item)
                                }
                            }else{
                                const isNew = uni.getStorageSync('isNew');
                                console.log( isNew == 1,'是否新用户');
                                if(item.type == 'WindowType_NormalFirstLogin'){
                                    if(item.type == 'WindowType_NormalFirstLogin' && isNew == 1){
                                       arr.push(item)
                                    }else{
                                    }
                                }else{
                                    arr.push(item)
                                }
                            }
                       }
                    }
                })
                this.bannersActivityList = arr;

              
                if(this.bannersActivityList.length > 0){
                    this.showBannerActivityDetail = this.bannersActivityList[0];
                      this.showBannersActivity = true;
                    this.showBannerIndex = 0;
                }   
                // this.bannersActivityList = res.banners
            })
        },
        currentChange(va) { //tab切换
            this.tbStyle.selectIndex = va;
            setTimeout(() => {
                if (va == 4) this.$refs.tabmy.tabload();
            }, 200);
        },
        async checkVersion() { // 检查版本
            // let firstTime = uni.getStorageSync('firstTime')
            // console.log(typeof !firstTime ,firstTime, '测试更新');
            let that = this;
            let gres = await post("v1/system/version");
            let popupVersion = gres.versionText.version.replace(/[.]/g, "");
            let uniPlatform = this.SystemInfo.uniPlatform;
            // let AppType =getApp().globalData.AppTypeList[plus.runtime.channel] || 1;
            if (uniPlatform == "app") {
                let osname = this.SystemInfo.osName;
                // let urlAversion =
                //     AppType == 1
                //         ? "https://img.chaoshewang.com/download/app.version"
                //         : "https://img.chaoshewang.com/download_channel/app.version";

                uni.request({
                    url: "https://img.chaoshewang.com/download/app.version",
                    success: (res) => {
                        let newVer = Number(res.data.replace(/\./g, ""));
                        let toVer = that.appversion.replace(/[.]/g, ""); //获取的是上一个包的版本号
                        if (["android", "ios"].includes(osname)) {
                            if (newVer > Number(toVer)) {
                                // let urlData =
                                //     AppType == 1
                                //         ? "https://img.chaoshewang.com/download/chaoshe.wgt"
                                //         : "https://img.chaoshewang.com/download_channel/chaoshe.wgt";
                                // let firstTime = uni.getStorageSync('firstTime')
                                // console.log(firstTime,'是否更新过');|| !firstTime
                                if (newVer > Number(popupVersion) ) {
                                    // uni.setStorageSync("firstTime", true)
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
                        }
                    },
                });
            }
        },
    },
};  
</script>
<style lang='scss' scoped>
.showBannerActivityContent{
    max-height: 80vh;
    // padding: 20px;
    width: 100vw;
    box-sizing: border-box;
    background-color: transparent !important;
    position: relative;
    z-index: 99999999;
   :v-deep img{
        width: 100% !important;
        height: auto !important;
    }
   
  
}
 .closeIcon{
        // position: absolute;
        // bottom: -40rpx;
        width: 56rpx;
        height: 56rpx;
     
        margin: 0 auto;
        margin-top: 30rpx;
        background: url('@/static/close.png');
        background-size: 100% 100%;
        z-index: 999;
        

    }
.index_page {
    width: 100vw;
    height: 100vh;
    position: relative;
    // background: linear-gradient(104deg, #e1d6f8 0%, #f8e7ed 100%);
    overflow-y: auto;

  
}
</style>