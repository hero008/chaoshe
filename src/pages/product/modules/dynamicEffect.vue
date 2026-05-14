<template>
    <u-popup :show="show" :safeAreaInsetBottom="false" bgColor="transparent" :overlayOpacity="0.8">
        <div @click="close" class="closebtn icof" :style="{ top: MBInfo().top + 1 + 'px' }">&#xe607; </div>
        <view class="dynamicEffect" v-if="dynamicEffectShow">
            <image v-if="!svgshow" :src="newGifPath" :class="['dynamic_gif', gifClass]" />
            <c-svga v-else ref="cSvgaRef" :src="newFilePath" :loops="1" :autoPlay="false" :isOnChange="true"
                @finished="onFinished" @percentage="onPercentage" @loaded="onLoaded" width="100%" height="100%" />
        </view>
        <div class="card_list_popup flex_c flex_ac flex_jc" :style="{ 'pointer-events': shareType ? 'none' : 'auto' }"
            v-else>
            <div class="title">
                <img src="https://img.chaoshewang.com/static/img/chaowanshang/tit_css.png" class="title_img1" />
            </div>
            <div class="card_list flex_r flex_ac flex_jse flex_wrap">
                <view class="card rotated" v-for="(k, s) in awardList" :key="s" @click="onRotated(s)">
                    <view :class="['card-contents', 'css-front', k.levelName.length == 1 ? '' : 'bg_' + k.levelName]">
                    </view>
                    <view :class="['card-contents', 'css-back', k.levelName.length == 1 ? '' : 'bg_' + k.levelName]">
                        <img :src="k.coverImage" class="award_img" @click.stop="ondetail(k.itemId)" />
                        <view class="itemName"> {{ k.itemName }}</view>
                        <img v-if="['Surprise', 'Lucky', 'Last', 'SSR', 'SS', 'SP',].includes(k.levelName)
                        " @click=" onShare(k.itemName, k.itemId, k.levelIndex, k)"
                            src="https://img.chaoshewang.com/static/img/chaowanshang/share_btn.png" class="share_btn" />
                        <view class="Lucky flex_r  flex_js " v-if="k.levelName == 'Lucky' && k.luckyNo">
                            <view class="type">{{ k.levelName }}</view>
                            <view class="sort"> {{ k.luckyNo }}</view>
                        </view>
                        <view v-else class="cs_" :class="[k.levelName.length > 1 ? 'cs_' + k.levelName.length : '',]"
                            :style="{ backgroundImage: `url(https://img.chaoshewang.com/static/img/chaowanshang/css_${k.levelName}.png)` }">
                        </view>
                    </view>
                </view>
            </div>
            <view class="share flex_r flex_ac" v-if="shareType">
                <view @click="onShareType(2)">
                    <img class="icon" src="https://img.chaoshewang.com/static/img/home/xcx.png" />
                    <view>小程序</view>
                </view>
                <view @click="onShareType(3)">
                    <img class="icon" src="https://img.chaoshewang.com/static/img/home/pyq.png" />
                    <view>朋友圈</view>
                </view>
                <div @click="shareType = 0" class="btn icof">&#xe607;</div>
            </view>
        </div>
        <!-- 详情弹窗 -->
        <gachaDetails ref="gachaDetails" />
    </u-popup>
</template>
<script>
import cSvga from "@/components/c-svga/c-svga.vue";
import { playDede, uniShare, compressImg, vibratePhone } from "@/utils/fun.js";
export default {
    data() {
        return {
            show: false,
            gifClass: "",
            svgshow: false,
            newFilePath: "",
            newGifPath: "",
            dynamicEffectShow: true,
            awards: [],
            awardList: [],
            pageType: "",
            shareType: 0,
            share: {},
            gachaId: "",
            boxIndex: 0
        };
    },
    components: { cSvga },
    methods: {
        open(da, svga, gif, showAnim, page, id, index) {
            this.show = true;
            this.awards = da;
            this.newFilePath = svga;
            this.newGifPath = gif;
            this.pageType = page;
            this.gachaId = id;
            this.boxIndex = index;
            let a = this.verdictBig(da) ? 2 : 1;
            // 音效
            playDede(a);
            // showAnim true是关闭动效
            if (showAnim && a !== 2) this.showList();
            else {
                if (a === 2) {
                    this.gifXianshi();
                    vibratePhone(3000)
                }
                else this.svgshow = true;
            }
        },
        close() {
            this.show = false;
            this.shareType = 0;
            this.svgshow = false;
            this.dynamicEffectShow = true;
            this.awards = [];
        },
        gifXianshi() {
            this.gifClass = "gif_xianshi";
            setTimeout(() => {
                this.gifClass = "gif_xiaoshi";
                setTimeout(() => {
                    this.gifClass = "";
                    this.showList();
                }, 290);
            }, 2800);
        },
        onLoaded() {
            // console.log("动画加载完成，播放时回调");
            this.$refs.cSvgaRef.call("startAnimation");
        },
        onPercentage(va) {
            // if (va > 0.85) this.percentage = va * 100
        },
        onFinished() {
            // console.log("动画停止播放时回调");
            this.showList();
        },
        verdictBig(arr) {
            for (const i of arr) {
                if ([28].includes(i.levelIndex)) return true;
            }
            return false;
        },
        showList() {
            this.dynamicEffectShow = false;
            this.awardList = [];
            let a = 0,
                atime = 500;
            if (this.awards.length > 5) atime = 100;
            this.awardList.push(this.awards[a]);
            let ctimt = setInterval(() => {
                a++;
                if (a < this.awards.length) {
                    this.awardList.push(this.awards[a]);
                } else clearInterval(ctimt);
            }, atime);
        },
        onRotated(i) {
            this.$set(this.awardList[i], "rotated", true);
        },
        onShare(tit, id, index, k) {
            // 炫耀一下
            this.shareType = 1;
            this.share = { tit: tit, id: this.gachaId, index: this.boxIndex, k: k };
        },
        onShareType(type) {
            let url =
                this.pageType == "cws"
                    ? "pages/product/chaowanshang"
                    : "pages/product/chaosheshang";
            const { tit, id, index, k } = this.share;
            if (type == 2) {
                uniShare(
                    {
                        tit: `我在娱乐潮社赏APP抽中了${tit}`,
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
                    title: `我在娱乐潮社赏APP抽中了“${tit}”赶紧来吸吸欧气吧！！！`,
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
        ondetail(id) {
            this.gachaDetailsMethod(this, id);
        },
    },
};
</script>
<style lang="scss" scoped>
.closebtn {
    position: fixed;
    left: 30rpx;
    color: #fff;
    font-size: 50rpx;
    z-index: 9998;
}

.dynamicEffect {
    width: 100vw;
    height: 100vh;

    .dynamic_gif {
        width: 100vw;
        height: 100vh;
        opacity: 0;

        &.gif_xianshi {
            opacity: 1;
        }

        &.gif_xiaoshi {
            animation: xiaoshi 0.29s;
        }
    }
}

@keyframes xiaoshi {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}

.card_list_popup {
    height: 100vh;
    padding: 86rpx 0;

    .title {
        text-align: center;

        .title_img {
            width: 400rpx;
            height: 102rpx;
            margin: 0 auto;
            margin-bottom: 28rpx;
        }

        .title_img1 {
            width: 380rpx;
            height: 112rpx;
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
    max-height: calc(100% - 160rpx);
    overflow-y: auto;
}

.card {
    width: 382rpx;
    height: 466rpx;
    position: relative;
    transform-style: preserve-3d;
    box-shadow: 0rpx 2rpx 4rpx rgba(0, 0, 0, 0.02);
    animation: slide-in 0.5s forwards;
    margin-bottom: -26rpx;

    &:nth-child(2n-1) {
        margin-right: -18rpx;
    }

    &:nth-child(2n) {
        margin-left: -18rpx;
    }
}

@keyframes slide-in {
    0% {
        transform: translateX(80%);
        /* 起始状态向左滑出 */
    }

    100% {
        transform: translateX(0);
        /* 结束状态在原位置 */
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
    padding-top: 60rpx;
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    align-items: center;

    .award_img {
        width: 250rpx;
        height: 250rpx;
    }

    .itemName {
        margin: 16rpx auto 0;
        padding: 5rpx 40rpx 0;
        width: 288rpx;
        height: 60rpx;
        background: linear-gradient(90deg,
                rgba(0, 0, 0, 0) 0%,
                rgba(0, 0, 0, 0.3) 30%,
                rgba(0, 0, 0, 0.3) 70%,
                rgba(0, 0, 0, 0) 100%);
        font-size: 20rpx;
        color: #fff;
        font-weight: 500;
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }



}

.Lucky {
    position: absolute;
    top: 10rpx;
    left: 36rpx;
    width: 148rpx;
    height: 52rpx;
    background-image: url("https://img.chaoshewang.com/static/img/chaowanshang/LuckyBg.png");
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

.share_btn {
    width: 170rpx;
    height: 62rpx;
    position: absolute;
    left: 50%;
    bottom: 20rpx;
    transform: translate(-50%, 0);
}

.cl_ {
    width: 104rpx;
    height: 48rpx;
    background: url("https://img.chaoshewang.com/static/img/card-bg/class4.png");
    background-size: 100% 100%;
    position: absolute;
    top: 35rpx;
    left: 36rpx;
}

.cl_B {
    background: url("https://img.chaoshewang.com/static/img/card-bg/class5.png");
    background-size: 100% 100%;
}

.cl_A {
    background: url("https://img.chaoshewang.com/static/img/card-bg/class6.png");
    background-size: 100% 100%;
}

.cl_SP {
    background: url("https://img.chaoshewang.com/static/img/card-bg/class7.png");
    background-size: 100% 100%;
}

.cs_ {
    height: 52rpx;
    width: 96rpx;
    background-size: 100% 100%;
    position: absolute;
    top: 10rpx;
    left: 36rpx;
}

.cs_8 {
    width: 136rpx;
}

.cs_5 {
    width: 142rpx;
}

.cs_4 {
    width: 124rpx;
}

.cs_3 {
    width: 124rpx;
}

.cs_2 {
    width: 112rpx;
}

.card-front {
    background: url("https://img.chaoshewang.com/static/img/card-bg/1.png");
    background-size: 100% 100%;
    transform-style: preserve-3d;

    &.bg_A {
        background: url("https://img.chaoshewang.com/static/img/card-bg/2.png");
        background-size: 100% 100%;
    }

    &.bg_SP {
        background: url("https://img.chaoshewang.com/static/img/card-bg/3.png");
        background-size: 100% 100%;
    }
}

.css-front {
    background: url("https://img.chaoshewang.com/static/img/chaowanshang/card_A.png");
    background-size: 100% 100%;
    transform-style: preserve-3d;

    &.bg_Surprise {
        background: url("https://img.chaoshewang.com/static/img/chaowanshang/card_Surprise.png");
        background-size: 100% 100%;
    }

    &.bg_Lucky {
        background: url("https://img.chaoshewang.com/static/img/chaowanshang/card_Lucky.png");
        background-size: 100% 100%;
    }

    &.bg_Last {
        background: url("https://img.chaoshewang.com/static/img/chaowanshang/card_Last.png");
        background-size: 100% 100%;
    }

    &.bg_SSR {
        background: url("https://img.chaoshewang.com/static/img/chaowanshang/card_SSR.png");
        background-size: 100% 100%;
    }

    &.bg_SS {
        background: url("https://img.chaoshewang.com/static/img/chaowanshang/card_SS.png");
        background-size: 100% 100%;
    }

    &.bg_SP {
        background: url("https://img.chaoshewang.com/static/img/chaowanshang/card_SP.png");
        background-size: 100% 100%;
    }
}

.card-back {
    background: url("https://img.chaoshewang.com/static/img/card-bg/bgt4.png");
    background-size: 100% 100%;
    transform: rotateY(180deg);
    transform-style: preserve-3d;

    &.bg_B {
        background: url("https://img.chaoshewang.com/static/img/card-bg/bgt5.png");
        background-size: 100% 100%;
    }

    &.bg_A {
        background: url("https://img.chaoshewang.com/static/img/card-bg/bgt6.png");
        background-size: 100% 100%;
    }

    &.bg_SP {
        background: url("https://img.chaoshewang.com/static/img/card-bg/bgt7.png");
        background-size: 100% 100%;
    }
}

.css-back {
    background: url("https://img.chaoshewang.com/static/img/chaowanshang/css_bgA.png");
    background-size: 100% 100%;
    transform: rotateY(180deg);
    transform-style: preserve-3d;

    &.bg_Surprise {
        background: url("https://img.chaoshewang.com/static/img/chaowanshang/css_bgSurprise.png");
        background-size: 100% 100%;
    }

    &.bg_Lucky {
        background: url("https://img.chaoshewang.com/static/img/chaowanshang/css_bgLucky.png");
        background-size: 100% 100%;
    }

    &.bg_Last {
        background: url("https://img.chaoshewang.com/static/img/chaowanshang/css_bgLast.png");
        background-size: 100% 100%;
    }

    &.bg_SSR {
        background: url("https://img.chaoshewang.com/static/img/chaowanshang/css_bgSSR.png");
        background-size: 100% 100%;
    }

    &.bg_SS {
        background: url("https://img.chaoshewang.com/static/img/chaowanshang/css_bgSS.png");
        background-size: 100% 100%;
    }

    &.bg_SP {
        background: url("https://img.chaoshewang.com/static/img/chaowanshang/css_bgSP.png");
        background-size: 100% 100%;
    }
}
</style>