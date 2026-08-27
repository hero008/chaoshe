<template>
    <u-popup :show="show" mode="center" :safeAreaInsetBottom="false" bgColor="transparent" :overlayOpacity="0.8">
        <view v-show="!dynamicEffectShow" class="card_list_popup flex_c flex_ac flex_jc"
            :style="{ 'pointer-events': shareType ? 'none' : 'auto',backgroundImage:`url(${cysType == 28 ? bgc:''})` }">
            <view v-if="originalList.length > 1"  class="title flex_r  flex_ac ">
                <img src="@/static/result/Congratulations.png" class="title_img" />
            </view>
            <view v-if="originalList.length > 1" class="card_list" @touchstart="handleTouchStart" @touchmove="handleTouchMove"
                @touchend="handleTouchEnd">
                <view v-if="cysType == 28" class="guang"></view>
                <view  class="page-list flex_r flex_ac flex_jse flex_wrap" :class="{
                    // 'animate-left': animateDir === '左' && isAnimating,
                    // 'animate-right': animateDir === '右' && isAnimating, 'transition': isAnimating
                }">
                <!-- k.rotated && !k.click ? 'rotated' :  @click="onRotated(k)"-->
                    <view class="card " v-for="(k, s) in formateRewardsList(originalList)" :key="s"
                       >
                        <!-- <view v-show="!k.click" class="card-contents card-front">
                            <view class="num">{{ k.no }}</view>
                        </view> -->
                                                 <!-- !k.click ? 'reversal' : '' -->

                        <view class="card-contents card-back" @click="ondetail(k)"
                            :class="['card' + k.levelName,]">
                            
                            <view v-if="k.levelIndex != 28 && k.levelIndex != 52" class="count">
                               <view>x{{ k.num }}</view>
                            </view>

                            <view :style="{
                                backgroundImage:`url(${getResultBgc(k)})`,
                                backgroundSize:'100% 100%'
                            }" :class="['kuang']">
                                <!-- v-show="k.rotated && k.click" -->
                                   <img  :src="k.coverImage" class="award_img" />

                              <view 
                               :style="{
                                backgroundImage:`url(https://img.shinemang.com/gachaStatic/tag/${k.levelName}.png)`
                               }"
                              :class="['cl_' + (k.levelName.includes('SP') || k.levelIndex == 52? 'SP':'')]"></view> 
                            </view>
                           <view class="itemName flex_c flex_ac flex_jc ">
                                <view class="name ellipsis">{{ k.itemName }} </view>
                            </view> 
                            <!-- #ifndef MP-WEIXIN -->
                            <!-- <view v-if="k.levelName == 'SP' && k.rotated"
                                @click="onShare(k.itemName, k.itemId, k.levelIndex, k)" class="share_btn" /> -->
                            <!-- #endif -->
                            
                            
                        </view>
                    </view>
                </view>
              
            </view>
            <view class="oneRewards" v-else-if="originalList.length == 1">
                  <view class="title flex_r  flex_ac ">
                <img src="@/static/result/Congratulations.png" class="title_img" />
              
                <!-- <view @click="close" class="closebtn" style="margin-right: 40rpx;"></view> -->
            </view>
            <view class="guang">
                       <view v-if="cysType == 28" class="guangImg animation">
                           
                       </view>
                       <view v-else class="guangImg"></view>
                       <img v-if="originalList[0].levelIndex == 28" class="tag" src="@/static/result/SP.png" alt="">
                        <img v-if="originalList[0].levelIndex == 52" class="tag bz" src="https://img.shinemang.com/gachaStatic/bz.png" alt="">
                      <img @click="ondetail(originalList[0])" :src="originalList[0].coverImage || originalList[0].itemCover" class="goodsImg" alt="">
                      <view class="goodsName ellipsis">{{ originalList[0].itemName }}</view>
                </view>
                <view class="btn">
                     <view  @click='fangsheng' v-if="!hasBx && userInfo.featureConfig && (userInfo.featureConfig.decomposed == 'FeatureFlag_Enable' ||   userInfo.featureConfig.decomposed == 'FeatureFlag_AdminOpen') &&  originalList && originalList[0].requestId" style="margin-right:32rpx;" class="fangsheng"></view>
                     <view class="all_btn" @click="close"></view>
                     
                </view>
                 <view class="tips" > {{originalList && originalList[0].requestId ? '赏品已自动放进星仓，可在星仓查看~': '试玩结果仅供参考~'}}</view>
                 <view class="closeBtn">
                         <img @click="close"  src="@/static/close.png" alt="">
                 </view>
            </view>
            <view v-if="originalList.length > 1" class="footer">
                <!-- <view class="page" v-if="totalPage > 1">{{ pageNum }}/{{ totalPage }}</view> -->
                <view  class="box">
                    <view class="btn">
                      <view  @click='fangsheng' v-if="!hasBx && userInfo.featureConfig && (userInfo.featureConfig.decomposed == 'FeatureFlag_Enable' ||   userInfo.featureConfig.decomposed == 'FeatureFlag_AdminOpen') && originalList && originalList[0].requestId" style="margin-right:32rpx;" class="fangsheng"></view>

                      <view class="all_btn" @click="close"></view>
                    </view>
                     <view class="tips">赏品已自动放进星仓，可在星仓查看~</view>
                     <view class="closeBtn">
                         <img @click="close"  src="@/static/close.png" alt="">
                     </view>
                </view>
            </view>
        </view>
        <gachaDetails ref="gachaDetails" />
        <show-modal></show-modal> 
    </u-popup>

</template>
<script>
import cSvga from "@/components/c-svga/c-svga.vue";
import { playDede, uniShare, compressImg, vibratePhone } from "@/utils/fun.js";
import { groupByItemId,MGTV_Channel ,choushangResultByItemId} from '@/utils/mgtv.js'
import { post } from '../../../utils/api';
import { mapState } from "vuex";
import bgc from '@/static/result/resultBg.png'
import lastBgc from '@/static/result/tag/Last_bgc.png'
import luckyBgc from '@/static/result/tag/Lucky_bgc.png'
import ccsBgc from '@/static/result/tag/ccs_bgc.png'
import spBgc from '@/static/result/tag/SP_bgc.png'
import otherBgc from '@/static/result/tag/A_bgc.png'
export default {
    data() {
        return {
             hasBx:0,
            bgc:bgc,
            MGTV_Channel:MGTV_Channel,
            show: false,
            dynamicEffectShow: true,
            awards: [],
            awardList: [],
            shareType: 0,
            share: {},
            gachaId: "",
            boxIndex: 0,
            cysType: 0,
            styleStep: 0,
            allShow: true,
            originalList: [],//初始列表
            startX: 0, // 触摸起始X坐标
            slideDirection: '未滑动', // 滑动方向
            threshold: 80, // 容差（过滤微小抖动，单位px）
            isSliding: false,// 是否处于滑动状态
            pageNum: 1,//页数
            totalPage: 1,//总页数
            pageSize: 10,
            animateDir: '',
            isAnimating: false,
            imgUrlList: [{ imageUrl: 'https://img.shinemang.com/gachaStatic/static/img/duoyou/open_loading_10.png', key: 'duoyou_img1', class: 'card1' },
            { imageUrl: 'https://img.shinemang.com/gachaStatic/static/img/duoyou/cj_center.png', key: 'duoyou_img2', class: 'card2' },
            { imageUrl: 'https://img.shinemang.com/gachaStatic/static/img/duoyou/winImgs4.png', key: 'duoyou_img3', class: 'card3' },],
        };
    },
     computed: {
        ...mapState(["userInfo"]),
 
    },
    mounted() {
        this.loadLocalImages();
    },
    components: { cSvga },

   
    methods: {
        formateRewardsList(list){
            return choushangResultByItemId(list)
        },
        getResultBgc(value){
           if(value.levelName.includes('SP') || value.levelIndex == 52){
            return spBgc
           }else if(value.levelName == '冲冲'){
            return ccsBgc
           }else if(value.levelName == 'Last'){
            return lastBgc
           }else if(value.levelName == 'Lucky'){
            return luckyBgc
           }else {
            return otherBgc
           }
        },
          fangsheng() {

            const that = this;
           const result = groupByItemId(this.originalList)
           post('v1/cabinet/decompose/cal-obtained',{item_dict:result}).then((res) => {
            console.log(res);
            if(!res.code){
                     that.$showModal({
                        title: "放生",
                        content: `本次放生共获得${res.balance}星币`,
                        hint: '温馨提示：放生后将无法恢复，请谨慎操作~',
                        success:(res1)=> {
                            if (res1.confirm) {
                                post("v1/cabinet/decompose/by-gacha-order", {
                                    request_id: that.originalList[0].requestId,
                                }).then((res2) => {
                                    if (res2.code) {
                                        uni.$u.toast(res2.message);
                                    } else {
                                        uni.$u.toast("放生成功");
                                        that.close()
                                      
                                    }
                                });
                            }
                        },
                    });
              }
           })
        },
        open(da, showAnim, id, index) {
            this.hasBx = da.filter((item)=>item.levelIndex == 52).length
             this.cysType = this.verdictBig(da)
            this.show = true;
            this.dynamicEffectShow = false;
            this.originalList = da//原数据
            // console.log(da,'sjdflsjflsjdfl')
            // this.originalList.sort((a,b)=>  b.levelIndex - a.levelIndex)
            // this.totalPage = Math.ceil(da.length / 10)
            this.awards = da.slice(0, 10);
            // this.pageSize = this.awards.length
            this.gachaId = id;
            this.boxIndex = index;
           
            

            // this.styleStep = 1
        },
        close() {
            this.show = false;
            this.shareType = 0;
            this.awards = [];
            // this.allShow = false
            this.$emit("onResult");
            this.pageNum = 1
        },
        loadLocalImages() {
            for (let i = 0; i < this.imgUrlList.length; i++) {
                const imgItem = this.imgUrlList[i];
                const storageKey = imgItem.key;
                const localPath = uni.getStorageSync(storageKey);
                if (localPath) {
                    this.$set(this.imgUrlList[i], 'localImageUrl', localPath);
                } else {
                    uni.setStorageSync(storageKey, imgItem.imageUrl);
                    this.$set(this.imgUrlList[i], 'localImageUrl', imgItem.imageUrl);
                }
            }
        },

        verdictBig(arr) {
            return arr.some(item => item.levelIndex === 28 || item.levelIndex == 52) ? 28 : 0;
        },
        showList() {
            this.dynamicEffectShow = false;
            this.awardList = [];
            let a = 0, atime = 500;
            if (this.awards.length > 5) atime = 100;
            const sp = this.cysType == 28 ? false : true
            if (!sp) {
                   this.dynamicEffectShow = true;
               
                // this.awardList.push({ ...this.awards[a], rotated: false, click: false });
                // this.originalList.forEach(item => { item.rotated = false; item.click = false; });
                 this.getAll()
            } else {
                // this.awardList.push({ ...this.awards[a], rotated: true, click: false });
                // setTimeout(() => {
                //     this.awardList.forEach((item, index) => {
                //         item.click = true
                //     });
                //     this.allShow = true
                // }, 200);
                // this.originalList.forEach(item => { item.rotated = true; item.click = true; });
            }
            // let ctimt = setInterval(() => {
            //     a++;
            //     if (a < this.awards.length) {
            //         if (!sp) {
            //              this.dynamicEffectShow = true;
            //             this.awardList.push({ ...this.awards[a], rotated: false, click: false });
            //              this.getAll()
            //         } else {
            //             this.awardList.push({ ...this.awards[a], rotated: true, click: false });
            //             setTimeout(() => {
            //                 this.awardList.forEach((item, index) => {
            //                     item.click = true
            //                 });
            //             }, 200);
            //         }
            //     } else clearInterval(ctimt);
            // }, atime);

        },
        showList1(list) {
            this.awardList = [];
            list.map(item => {
                this.awardList.push({ ...item })
            })
        },
        onRotated(vue) {
            if (this.awardList.length !== this.pageSize || vue.rotated && vue.click) return
            if (vue.levelIndex == 28) {
                this.dynamicEffectShow = true
                this.styleStep = 3
                playDede(0, 'https://img.shinemang.com/gachaStatic/static/media/chaoshen.mp3')
                vibratePhone(3000)
                setTimeout(() => {
                    this.dynamicEffectShow = false
                    vue.rotated = true;
                }, 4000);
                setTimeout(() => {
                    vue.click = true;
                    this.onListDatr()
                }, 4200);
            } else {
                vue.rotated = true;
                setTimeout(() => {
                    vue.click = true;
                    this.onListDatr()
                }, 200);
            }
        },
        onListDatr() {
            this.originalList.forEach((itemA, index) => {
                const matchB = this.awardList.find(itemB => itemB.no == itemA.no);
                if (matchB) this.originalList[index] = matchB;
            });
            this.allShow = !this.originalList.some(item => item.rotated === false);
        },
        getAll() {
            // if (this.awardList.length !== this.pageSize) return
            // if (this.allShow) {
            //     this.close()
            // } else if (this.awardList.length == this.pageSize) {
            //     const hasTargetItem = this.originalList.some(item =>
            //         item.levelIndex === 28 &&
            //         item.rotated !== true &&
            //         item.click !== true
            //     );
            //     if (hasTargetItem) {
            //         this.dynamicEffectShow = true
            //         this.styleStep = 3
            //         //超神动画
            //         playDede(0, 'https://img.shinemang.com/gachaStatic/static/media/chaoshen.mp3')
            //         vibratePhone(3000)
            //         setTimeout(() => {
            //             this.dynamicEffectShow = false;
            //             this.awardList.forEach(vue => {
            //                 vue.rotated = true;
            //             });
            //         }, 4000);
            //         setTimeout(() => {
            //             this.awardList.forEach(vue => {
            //                 vue.click = true;
            //             });
            //         }, 4200);
            //     } else {
            //         // 没有超神 ,直接开
            //         this.awardList.forEach(vue => {
            //             vue.rotated = true;
            //         });
            //         setTimeout(() => {
            //             this.awardList.forEach(vue => {
            //                 vue.click = true;
            //             });
            //         }, 200);
            //     }
            //     setTimeout(() => {
            //         this.allShow = true
            //     }, 1500);
            //     this.originalList.forEach(item => { item.rotated = true; item.click = true; });
            // }
        },
        onShare(tit, id, index, k) {
            // 炫耀一下
            this.shareType = 1;
            this.share = { tit: tit, id: this.gachaId, index: this.boxIndex, k: k };
        },
        onShareType(type) {
            let url = "pages/product/chaowanshang"
            const { tit, id, index, k } = this.share;
            if (type == 2) {
                uniShare(
                    {
                        tit: `我在娱乐芒星赏APP抽中了${tit}`,
                        path: url,
                    },
                    { id, index },
                    k.coverImage
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
                    title: `我在娱乐芒星赏APP抽中了“${tit}”赶紧来吸吸欧气吧！！！`,
                };
                compressImg(
                    k.coverImage,
                    type1,
                    type2,
                    { tit, path: url },
                    { id, index }
                );
            }
            this.shareType = 0;
        },
        onDy(index) {

            //第一步点击动画
            if (index !== 0) return
            playDede(0, 'https://img.shinemang.com/gachaStatic/static/media/click.mp3');
            this.styleStep = 2
            playDede(0, 'https://img.shinemang.com/gachaStatic/static/media/putong.mp3');
            this.timerList = setTimeout(() => {
                this.styleStep = 0
                this.showList();
            }, 2000);
        },
        handleTouchStart(e) {
            this.startX = e.changedTouches[0].clientX;
            this.isSliding = true;
            this.slideDirection = '未滑动';
        },
        handleTouchMove(e) {
            if (!this.isSliding) return;
            e.preventDefault();
            const currentX = e.changedTouches[0].clientX;
            const diffX = currentX - this.startX;
            if (Math.abs(diffX) > this.threshold) {
                this.slideDirection = diffX > 0 ? '向右滑' : '向左滑';
            }
        },
        handleTouchEnd(e) {
            if (!this.isSliding) return;
            const endX = e.changedTouches[0].clientX;
            const diffX = endX - this.startX;
            if (Math.abs(diffX) > this.threshold) {
                const finalDir = diffX > 0 ? '右' : '左';
                if (finalDir === '左' && this.pageNum < this.totalPage) {
                    this.pageNum++
                    this.animateDir = finalDir;
                    this.isAnimating = true;
                    setTimeout(() => {
                        const list = this.originalList.slice((this.pageNum - 1) * 10, this.pageNum * 10);
                        this.pageSize = list.length
                        this.showList1(list)
                    }, 400);

                } else if (finalDir === '右' && this.pageNum > 1) {
                    this.pageNum--
                    this.animateDir = finalDir;
                    this.isAnimating = true;
                    setTimeout(() => {
                        const list = this.originalList.slice((this.pageNum - 1) * 10, this.pageNum * 10);
                        this.showList1(list)
                        this.pageSize = list.length
                    }, 400);
                }
                this.$forceUpdate();
            } else {
                this.slideDirection = '未滑动（位移过小）';
            }
            this.isSliding = false;
            setTimeout(() => {
                this.isAnimating = false;
                this.animateDir = '';
            }, 400);
        },
        ondetail(item) {
            if(item.levelIndex == 52){
                if(this.originalList && this.originalList[0].requestId ){
            uni.showToast({
                    title:'宝藏已放入星仓,请到星仓点击宝藏寻宝',
                    icon:'none'
                })
                }
               
               return;
            }else{
                 this.gachaDetailsMethod(this, item.itemId);
            }
           
        },
    },

};
</script>
<style lang="scss" scoped>
.dynamicEffect {
    width: 100vw;
    height: 100vh;

    .card1 {
        position: absolute;
        width: 700rpx;
        height: 812px;
        left: 50%;
        top: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        background-size: 700rpx 12989.5px;
        background-repeat: no-repeat;
        background-position: 0 0;
        will-change: background-position, transform;
        backface-visibility: hidden;
        perspective: 1000px;
        -webkit-font-smoothing: antialiased;
        animation: animationA-data-v-008078b8 1s steps(16, jump-none) infinite;

    }

    .card3 {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 50%;
        top: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        background-image: url("https://img.shinemang.com/gachaStatic/static/img/duoyou/winImgs4.png");
        background-size: 100% 6000%;
        background-repeat: no-repeat;
        background-position: 0 0;
        will-change: background-position, transform;
        backface-visibility: hidden;
        perspective: 1000px;
        -webkit-font-smoothing: antialiased;
        animation: animationA-data-v-008078b8 5s steps(60, jump-none) forwards;
    }

    .card2 {
        position: absolute;
        // width: 100%;
        width: 700rpx;
        height: 812px;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        background-image: url('https://img.shinemang.com/gachaStatic/static/img/duoyou/cj_center.png');
        background-size: 700rpx 34104px;
        background-repeat: no-repeat;
        background-position: 0 0;
        will-change: background-position, transform;
        transform: translateZ(0);
        backface-visibility: hidden;
        perspective: 1000px;
        -webkit-font-smoothing: antialiased;
        animation: sprite-animation 2s steps(42, end) forwards;
    }

    @keyframes sprite-animation {
        0% {
            background-position: 0 0;
            transform: translateY(0);
        }

        50% {
            transform: translateY(calc((100vh - 812px)/2 * 0.04));
        }

        100% {
            background-position: 0 -34104px;
            transform: translateY(0);
        }
    }

    @-webkit-keyframes sprite-animation {
        0% {
            background-position: 0 0;
            -webkit-transform: translateY(0);
            transform: translateY(0);
        }

        50% {
            -webkit-transform: translateY(calc((100vh - 812px)/2 * 0.04));
            transform: translateY(calc((100vh - 812px)/2 * 0.04));
        }

        100% {
            background-position: 0 -34104px;
            -webkit-transform: translateY(0);
            transform: translateY(0);
        }
    }

    @media (max-width: 375px) {
        .card2 {
            width: 100vw;
            height: calc(100vw * 812 / 375);
            background-size: 100vw calc(100vw * 34104 / 375);
        }

        @keyframes sprite-animation {
            100% {
                background-position: 0 calc(-100vw * 34104 / 375);
            }
        }

        @-webkit-keyframes sprite-animation {
            100% {
                background-position: 0 calc(-100vw * 34104 / 375);
            }
        }
    }

    @keyframes go {
        0% {
            background-position-x: -40px;
        }

        100% {
            background-position-x: -1040px;
        }
    }

    @keyframes animationA-data-v-008078b8 {
        0% {
            background-position: 0 0;
            top: 50%;
        }

        50% {
            top: 52%;
        }

        100% {
            background-position: 0 100%;
            top: 50%;
        }
    }

}
.oneRewards{
    padding-top: 300rpx;
    height: 100vh;
    .title{
        text-align: center;
        img{
            width: 330rpx;
            height: 67rpx;
        }
    }
    .guang{
        width: 750rpx;
        height: 750rpx;

        padding-top: 170rpx;
        text-align: center;
        position: relative;
        .guangImg{
      background: url('@/static/result/guang.png');
        background-size: 100% 100%;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        // transform: translate(-50%,-50%);
        &.animation{
          animation: infinityScroll 10s linear infinite;

        }
        }
          @keyframes infinityScroll {
              from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }
        .tag{
             position: absolute;
            left: 50%;
            transform: translateX(-50%);
            top: -34rpx;
            width: 506rpx;
            height: 168rpx;
              z-index: 3;
              &.bz{
                 width: 466rpx;
            height: 128rpx;
              }
        }
        .goodsImg{
            width: 400rpx;
            height: 400rpx;
              position: relative;
  z-index: 3;
  border-radius: 32rpx;

        }
        .goodsName{
           font-size: 32rpx;
           color: #fff;
           font-weight: 600;
           margin-top: 48rpx;
           padding: 0 50rpx;
           text-align: center;
             position: relative;
  z-index: 3;
        }
    }
    .btn{
        margin-top: -40rpx;
       
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            z-index: 44;

    
        .fangsheng{
        width: 298rpx;
        height: 120rpx;
        background: url('@/static/result/fangsheng.png');
        background-size: 100% 100%;
    }
    .all_btn {
        width: 298rpx;
        height: 120rpx;
          background: url('@/static/result/confirm.png');
        background-size: 100% 100%;
        // line-height: 80rpx;
        // background: #9378F9;
        // border-radius: 20rpx;
        // margin: 20rpx auto 0;
    }
    }
     .tips{
            font-size: 24rpx;
            text-align: center;
            margin-top: 20rpx;
            color: #fff;

        }
        .closeBtn{
            text-align: center;
            margin-top: 32rpx;
             position: relative;
            z-index: 44;
            img{
                width: 56rpx;
                height: 56rpx;
            }
        }
}
.card_list_popup {
    height: 100vh;
    padding: 0;
    position: relative;
    background-size: cover;

    .title {
        width: 100%;
        height: 67rpx;
          margin-bottom: 76rpx;
        justify-content: center;

        .closebtn {
            width: 58rpx;
            height: 58rpx;
            background: url("https://img.shinemang.com/gachaStatic/static/img/duoyou/closebtn.png");
            background-size: 100% 100%;
            z-index: 9998;
            margin-left: 174rpx;
        }

        .title_img {
            width: 330rpx;
            height: 67rpx;
            // margin-left: 270rpx;
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

.card_list {
    width: 100vw;
    max-height: calc(100% - 480rpx);
    overflow-y: auto;
    // padding-bottom: 80rpx;
    position: relative;
    .guang{
        position: fixed;
        width: 750rpx;
        height: 750rpx;
        background: url('@/static/result/guang.png');
        background-size: 100% 100%;
        left: 0;
        top: calc((100vh - 750rpx)/2);
        // background-attachment: fixed;
        animation: infinityScroll 10s linear infinite;
    }
     @keyframes infinityScroll {
              from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }

    .page-list {
        position: relative;
        z-index: 10;
        width: 100%;
        // height: 100%;
        transform: translateX(0);
        opacity: 1;
        margin-bottom: 120rpx;

    }

    .page-list.transition {
        transition:
            transform 0.4s ease-in-out,
            opacity 0.3s ease-out;
    }

    .page-list.animate-left {
        transform: translateX(-100%);
        opacity: 0;
        transition-delay: 0s, 0.1s;
    }

    .page-list.animate-right {
        transform: translateX(100%);
        opacity: 0;
        transition-delay: 0s, 0.1s;
    }

}

.card {
    width: 224rpx;
    height: 268rpx;
    position: relative;
    // transform-style: preserve-3d;
    // box-shadow: 0rpx 2rpx 4rpx rgba(0, 0, 0, 0.02);
    margin-right: 8rpx;
    // animation: slide-in 0.8s forwards;
    margin-bottom: 20rpx;
     
    &:nth-child(3n) {
        margin-right: 0;
        // margin-right: 8rpx;
    }

    &:nth-child(2n) {
        // margin-left: -18rpx;
    }
}

@keyframes slide-in {
    0% {
        transform: translateX(0%);
    }

    100% {
        transform: translateX(0);
    }
}

.rotated {
    animation: dd-rotation 0.8s 1 forwards;
}

@keyframes dd-rotation {
    from {
        transform: rotateY(0deg);
    }

    to {
        transform: rotateY(-180deg);
    }
}

.card-contents {
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    padding-top: 4rpx;
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 2;
  .count{
        position: absolute;
        width: 84rpx;
        height: 52rpx;
        color: #fff;
        font-size: 28rpx;
        text-align: center;
        right: 0;
        top: 0;
        background: url('@/static/countBg.png');
        background-size: 100% 100%;
        z-index: 55;
        view{
            transform: rotate(7deg);  /* 沿 X 轴倾斜 */  
        }
    }
    .itemName {
        width: 208rpx;
        height: 32rpx;
        font-weight: 500;
        font-size: 24rpx;
        color: #FFFFFF;
        line-height: 32rpx;
        // position: absolute;
        // bottom: 60rpx;

        .name {
            width: 100%;
            text-align: center;
        }

    }
}



.cl_ {
   width: 168rpx;
    height: 32rpx;
    background-size: 100% 100%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 25rpx;
    z-index: 2;
}



.cl_SP {
      width: 180rpx;
    height: 88rpx;
    background-size: 100% 100%;
    position: absolute;
    left: 0;
    top: -24rpx;
        z-index: 2;



}



.card-front {
    width: 374rpx;
    height: 454rpx;
    background-image: url("@/static/btn/unified.png");
    background-size: 100% 100%;
    transform-style: preserve-3d;

    .num {
        height: 398rpx;
        line-height: 398rpx;
        font-size: 35rpx;
        font-weight: bold;
        color: transparent;
        -webkit-text-stroke: 1.5px #949494;
        opacity: 0;
        animation: fadeIn 1.5s ease-out forwards;
    }


}

.card-back {
    position: relative;
    // background: url("https://img.shinemang.com/gachaStatic/static/img/duoyou/border.png");
    // background-size: 100% 100%;
   .kuang{
    width: 100%;
    height: 236rpx;
    position: relative;
    
    // background: url('@/static/result/kuang.png');
    // background-size: 100% 100%;

   


   }
    .share_btn {
        width: 142rpx;
        height: 78rpx;
        position: absolute;
        left: 50%;
        bottom: -26rpx;
        transform: translate(-50%, 0);
        background: url("https://img.shinemang.com/gachaStatic/static/img/duoyou/share_btn.png");
        background-size: 100% 100%;
        opacity: 0;
        animation: fadeIn 1.5s ease-out forwards;
    }


}

.reversal {
    transform: rotateY(180deg);
    transform-style: preserve-3d;
}

@keyframes fadeIn {
    to {
        opacity: 1;
    }
}

.cardSP {
    // background: url("https://img.shinemang.com/gachaStatic/static/img/duoyou/unified28.png");
    // background-size: 100% 100%;
}

.cardA {
    // background: url("https://img.shinemang.com/gachaStatic/static/img/duoyou/unified1.png");
    // background-size: 100% 100%;
}

.award_img {
    width: 176rpx;
    height: 176rpx;
    background: transparent;
    position: absolute;
    left: 50%;
    top: 24rpx;
    transform: translateX(-50%);
    z-index: 1;
    /*#ifdef MP*/
    z-index: 2;
    /*#endif*/
}

.footer {
    width: 100%;
    height: 400rpx;
    background: rgba(0, 0, 0, 0.8);
    position: absolute;
    bottom: 0;
    color: #FFFFFF;
    font-weight: 800;
    font-size: 30rpx;
    text-align: center;
    z-index: 200;
    padding-top: 40rpx;

    .page {
        // margin-top: 20rpx;
        margin-bottom: 20rpx;
    }
    .box{
        align-items: center;
        width: 100%;
        // margin-top: 20rpx;
        // display: flex;
        // justify-content: center;
        .btn{
            display: flex;
            align-items: center;
            justify-content: center;

        }
        .tips{
            font-size: 24rpx;
            text-align: center;
            margin-top: 20rpx;

        }
        .closeBtn{
            text-align: center;
            margin-top: 32rpx;
            img{
                width: 56rpx;
                height: 56rpx;
            }
        }

    }
    .fangsheng{
        width: 298rpx;
        height: 120rpx;
        background: url('@/static/result/fangsheng.png');
        background-size: 100% 100%;
    }
    .all_btn {
        width: 298rpx;
        height: 120rpx;
          background: url('@/static/result/confirm.png');
        background-size: 100% 100%;
        // line-height: 80rpx;
        // background: #9378F9;
        // border-radius: 20rpx;
        // margin: 20rpx auto 0;
    }
}
</style>