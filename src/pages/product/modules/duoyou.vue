<template>
    <u-popup :show="show" :safeAreaInsetBottom="false" bgColor="transparent" :overlayOpacity="0.8">
        <view class="dynamicEffect" v-show="dynamicEffectShow">
            <view v-for="(img, index) in imgUrlList" :key="index" v-show="styleStep == index + 1" @click="onDy(index)"
                :style="{ backgroundImage: `url(${img.localImageUrl || img.imageUrl})` }" :class="img.class"></view>
        </view>
        <view v-show="!dynamicEffectShow" class="card_list_popup flex_c flex_ac flex_jc"
            :style="{ 'pointer-events': shareType ? 'none' : 'auto' }">
            <view class="title flex_r  flex_ac " style="justify-content: flex-end;">
                <!-- <img src="https://img.shinemang.com/gachaStatic/static/img/duoyou/titile.png" class="title_img" /> -->
                <view @click="close" class="closebtn" style="margin-right: 40rpx;"></view>
            </view>
            <view class="card_list  " @touchstart="handleTouchStart" @touchmove="handleTouchMove"
                @touchend="handleTouchEnd">
                <view class="page-list flex_r flex_ac flex_jse flex_wrap" :class="{
                    'animate-left': animateDir === '左' && isAnimating,
                    'animate-right': animateDir === '右' && isAnimating, 'transition': isAnimating
                }">
                    <view class="card " v-for="(k, s) in awardList" :key="s" @click="onRotated(k)"
                        :class="[k.rotated && !k.click ? 'rotated' : '']">
                        <view v-show="!k.click" class="card-contents card-front">
                            <view class="num">{{ k.no }}</view>
                        </view>
                        <view class="card-contents card-back" @click="ondetail(k.itemId)"
                            :class="['card' + k.levelName, !k.click ? 'reversal' : '']">
                            <view class="itemName flex_c flex_ac flex_jc ">
                                <view class="name ellipsis2">{{ k.itemName }} </view>
                            </view>
                            <!-- #ifndef MP-WEIXIN -->
                            <!-- <view v-if="k.levelName == 'SP' && k.rotated"
                                @click="onShare(k.itemName, k.itemId, k.levelIndex, k)" class="share_btn" /> -->
                            <!-- #endif -->
                            <view class="cl_" :class="['cl_' + k.levelName]"></view>
                        </view>
                        <img v-show="k.rotated && k.click" :src="k.coverImage" class="award_img" />
                    </view>
                </view>
            </view>
            <view class="share flex_r flex_ac" v-if="shareType">
                <view @click="onShareType(2)">
                    <img class="icon" src="https://img.shinemang.com/gachaStatic/static/img/home/xcx.png" />
                    <view>小程序</view>
                </view>
                <view @click="onShareType(3)">
                    <img class="icon" src="https://img.shinemang.com/gachaStatic/static/img/home/pyq.png" />
                    <view>朋友圈</view>
                </view>
                <view @click="shareType = 0" class="btn icof">&#xe607;</view>
            </view>
            <view class="footer">
                <view class="page" v-if="totalPage > 1">{{ pageNum }}/{{ totalPage }}</view>
                <view  class="box">
                     <view @click='fangsheng' v-if="allShow && awardList && awardList[0].requestId" style="margin-right:20rpx; background: linear-gradient(0deg, #4FEF5F 0.01%, #1BAB04 100%);" class="all_btn">放生</view>
                     <view class="all_btn" @click="getAll">{{ allShow ? '确定' : '一键开奖' }}</view>
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
import { groupByItemId } from '@/utils/mgtv.js'
import { post } from '../../../utils/api';
export default {
    data() {
        return {
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
            allShow: false,
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
    mounted() {
        this.loadLocalImages();
    },
    components: { cSvga },
    methods: {
          fangsheng() {
           
            const that = this;
           const result = groupByItemId(this.awardList)
           console.log(result)
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
                                    request_id: that.awardList[0].requestId,
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
            this.show = true;
            this.dynamicEffectShow = true;
            this.originalList = da//原数据
            this.totalPage = Math.ceil(da.length / 10)
            this.awards = da.slice(0, 10);
            this.pageSize = this.awards.length
            this.gachaId = id;
            this.boxIndex = index;
            this.cysType = this.verdictBig(da)
            this.styleStep = 1
        },
        close() {
            this.show = false;
            this.shareType = 0;
            this.awards = [];
            this.allShow = false
            this.$emit("onDuoyou");
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
            return arr.some(item => item.levelIndex === 28) ? 28 : 0;
        },
        showList() {
            this.dynamicEffectShow = false;
            this.awardList = [];
            let a = 0, atime = 500;
            if (this.awards.length > 5) atime = 100;
            const sp = this.cysType == 28 ? false : true
            if (!sp) {
                this.awardList.push({ ...this.awards[a], rotated: false, click: false });
                this.originalList.forEach(item => { item.rotated = false; item.click = false; });
            } else {
                this.awardList.push({ ...this.awards[a], rotated: true, click: false });
                setTimeout(() => {
                    this.awardList.forEach((item, index) => {
                        item.click = true
                    });
                    this.allShow = true
                }, 200);
                this.originalList.forEach(item => { item.rotated = true; item.click = true; });
            }
            let ctimt = setInterval(() => {
                a++;
                if (a < this.awards.length) {
                    if (!sp) {
                        this.awardList.push({ ...this.awards[a], rotated: false, click: false });
                    } else {
                        this.awardList.push({ ...this.awards[a], rotated: true, click: false });
                        setTimeout(() => {
                            this.awardList.forEach((item, index) => {
                                item.click = true
                            });
                        }, 200);
                    }
                } else clearInterval(ctimt);
            }, atime);

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
            if (this.awardList.length !== this.pageSize) return
            if (this.allShow) {
                this.close()
            } else if (this.awardList.length == this.pageSize) {
                const hasTargetItem = this.originalList.some(item =>
                    item.levelIndex === 28 &&
                    item.rotated !== true &&
                    item.click !== true
                );
                if (hasTargetItem) {
                    this.dynamicEffectShow = true
                    this.styleStep = 3
                    playDede(0, 'https://img.shinemang.com/gachaStatic/static/media/chaoshen.mp3')
                    vibratePhone(3000)
                    setTimeout(() => {
                        this.dynamicEffectShow = false;
                        this.awardList.forEach(vue => {
                            vue.rotated = true;
                        });
                    }, 4000);
                    setTimeout(() => {
                        this.awardList.forEach(vue => {
                            vue.click = true;
                        });
                    }, 4200);
                } else {
                    this.awardList.forEach(vue => {
                        vue.rotated = true;
                    });
                    setTimeout(() => {
                        this.awardList.forEach(vue => {
                            vue.click = true;
                        });
                    }, 200);
                }
                setTimeout(() => {
                    this.allShow = true
                }, 1500);
                this.originalList.forEach(item => { item.rotated = true; item.click = true; });
            }
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
        ondetail(id) {
            this.gachaDetailsMethod(this, id);
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

.card_list_popup {
    height: 100vh;
    padding: 86rpx 0;
    position: relative;

    .title {
        width: 100%;
        height: 60rpx;
        margin-bottom: 28rpx;

        .closebtn {
            width: 58rpx;
            height: 58rpx;
            background: url("https://img.shinemang.com/gachaStatic/static/img/duoyou/closebtn.png");
            background-size: 100% 100%;
            z-index: 9998;
            margin-left: 174rpx;
        }

        .title_img {
            width: 210rpx;
            height: 60rpx;
            margin-left: 270rpx;
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
    max-height: calc(100% - 300rpx);
    overflow-y: auto;
    padding-bottom: 80rpx;
    position: relative;

    .page-list {
        width: 100%;
        height: 100%;
        transform: translateX(0);
        opacity: 1;
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
    width: 374rpx;
    height: 454rpx;
    position: relative;
    transform-style: preserve-3d;
    box-shadow: 0rpx 2rpx 4rpx rgba(0, 0, 0, 0.02);
    animation: slide-in 0.8s forwards;

    &:nth-child(2n-1) {
        margin-right: -18rpx;
    }

    &:nth-child(2n) {
        margin-left: -18rpx;
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
    padding-top: 38rpx;
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 2;

    .itemName {
        width: 228rpx;
        height: 52rpx;
        font-weight: 500;
        font-size: 18rpx;
        color: #FFFFFF;
        position: absolute;
        bottom: 60rpx;

        .name {
            width: 100%;
            text-align: center;
        }

    }
}



.cl_ {
    width: 88rpx;
    height: 40rpx;
    background: url("https://img.shinemang.com/gachaStatic/tag_C.png");
    background-size: 100% 100%;
    position: absolute;
    top: 15rpx;
    left: 10rpx;
}

.cl_B {
    background: url("https://img.shinemang.com/gachaStatic/tag_B.png");
    background-size: 100% 100%;
}

.cl_A {
    background: url("https://img.shinemang.com/gachaStatic/tag_A.png");
    background-size: 100% 100%;
}

.cl_SP {
    width: 104rpx;
    height: 44rpx;
    background: url("https://img.shinemang.com/gachaStatic/tag_SP.png");
    background-size: 100% 100%;
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
    background: url("https://img.shinemang.com/gachaStatic/static/img/duoyou/border.png");
    background-size: 100% 100%;

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
    background: url("https://img.shinemang.com/gachaStatic/static/img/duoyou/unified28.png");
    background-size: 100% 100%;
}

.cardA {
    background: url("https://img.shinemang.com/gachaStatic/static/img/duoyou/unified1.png");
    background-size: 100% 100%;
}

.award_img {
    width: 298rpx;
    height: 298rpx;
    background: #fff;
    position: absolute;
    left: 50%;
    top: 38rpx;
    transform: translateX(-50%);
    z-index: 1;
    /*#ifdef MP*/
    z-index: 2;
    /*#endif*/
}

.footer {
    width: 100%;
    height: 250rpx;
    background: rgba(0, 0, 0, 0.8);
    position: absolute;
    bottom: 0;
    color: #FFFFFF;
    font-weight: 800;
    font-size: 30rpx;
    text-align: center;

    .page {
        margin-top: 20rpx;
    }
    .box{
        align-items: center;
        width: 100%;
        margin-top: 20rpx;
        display: flex;
        justify-content: center;

    }

    .all_btn {
        width: 238rpx;
        height: 80rpx;
        line-height: 80rpx;
        background: #9378F9;
        border-radius: 20rpx;
        // margin: 20rpx auto 0;
    }
}
</style>