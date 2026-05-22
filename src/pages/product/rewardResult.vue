<template>
    <view class="rewardResult">
        <div class="un_res flex_c flex_ac flex_jc" v-show="unRes">
            <image
                class="title"
                src="https://img.shinemang.com/gachaStatic/static/img/cs-result/yfs_txt.png"
            ></image>
            <image
                :src="'https://img.shinemang.com/gachaStatic/static/img/cs-result/yfs_card.gif'"
                class="yfs_card"
                @touchstart="start"
                @touchmove="move"
            />
        </div>
        <div class="res_ing flex_c flex_ac flex_jc" v-show="isRun">
            <image
                class="title"
                src="https://img.shinemang.com/gachaStatic/static/img/cs-result/yfs_txt.png"
            ></image>
            <image
                :src="'https://img.shinemang.com/gachaStatic/static/img/cs-result/yfs_run.gif'"
                class="yfs_run"
            />
        </div>
        <div class="result" v-if="isres">
            <div class="bg2 flex_c flex_ac flex_jc">
                <img :src="awards[awardIndex].coverImage" class="r_img" />
            </div>
            <div class="hint_box">
                <!-- :class="{ nc: awards[awardIndex].levelIndex == 27 }" class="ico1" -->
                <img
                    :class="[
                        awards[awardIndex].levelName.length == 1
                            ? 'ico1'
                            : 'ico' + awards[awardIndex].levelName.length,
                    ]"
                    :src="`https://img.shinemang.com/gachaStatic/static/img/reward/${awards[awardIndex].levelName}.png`"
                />
                <div class="r_name">{{ awards[awardIndex].itemName }}</div>
            </div>
            <div class="btns flex_r flex_ac flex_jse">
                <div class="btn" v-if="WinnNum > 0" @click="toDetails">
                    跳过动画
                </div>
                <div class="btn cor" @click="next">
                    <span>继续</span>
                    <div class="r_num flex_r flex_ac" v-if="WinnNum > 0">
                        <img
                            src="https://img.shinemang.com/gachaStatic/static/img/cs-result/ico1.png"
                            class="ico1"
                        />
                        <span>x{{ WinnNum }}</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- 预加载大图 防止动画卡顿 -->
        <div class="imgs" v-show="false">
            <img :src="i.coverImage" v-for="(i, s) in awards" :key="s" />
        </div>
    </view>
</template>
<script>
import { playDede } from "@/utils/fun.js";
export default {
    data() {
        return {
            Xdata: {},
            awards: [], // 抽到的赏
            awardIndex: 0, // 当前展示中的那个
            unRes: true, // 未开始
            isRun: false, // 是否在抽赏中
            isres: false,
            startData: {},
            audio_type: 0,
        };
    },
    computed: {
        WinnNum() {
            return this.awards.length - 1 - this.awardIndex;
        },
    },
    onLoad(da) {
        this.audio_type = da.a;
    },
    onShow() {
        this.loadAwards();
    },
    methods: {
        loadAwards() {
            this.Xdata = this.$gl("extractAwards");
            this.awards = this.Xdata.da;
        },
        run() {
            this.unRes = false;
            this.isRun = true;
            setTimeout(() => {
                this.isRun = false;
                this.isres = true;
                playDede(this.audio_type);
            }, 600);
        },
        start(e) {
            this.startData.clientX = e.changedTouches[0].clientX;
            this.startData.clientY = e.changedTouches[0].clientY;
        },
        move(event) {
            let touch = event.touches[0];
            let data = touch.clientX - this.startData.clientX;
            if (touch.clientX > this.startData.clientX) {
                //向左移动
                if (data > 80) this.run();
            }
        },
        next() {
            this.unRes = true;
            this.isRun = false;
            this.isres = false;
            this.awardIndex++;
            if (this.awardIndex >= this.awards.length) {
                this.toDetails();
            }
        },
        toDetails() {
            if (this.Xdata.path == "pages/product/chaosheshang") {
                const arrayParam = JSON.stringify(this.awards);
                uni.$u.route({
                    type: "redirect",
                    url: this.Xdata.path,
                    params: {
                        id: this.Xdata.id,
                        index: this.Xdata.index,
                        list: arrayParam,
                    },
                });
                return;
            }
            uni.$u.route({
                type: "redirect",
                url: "pages/product/rewardResultDetails",
            });
        },
    },
};
</script>
<style lang='scss' scoped>
.rewardResult {
    height: 100vh;
    overflow-y: auto;
    background-color: #0f1013;
    background-image: url("https://img.shinemang.com/gachaStatic/static/img/cs-result/yfs_bg.png");
    background-size: 100% 100%;
}

.un_res {
    width: 100%;
    height: 100%;

    .yfs_card {
        width: 750rpx;
        height: 660rpx;
    }
}

.res_ing {
    .yfs_run {
        width: 750rpx;
        height: 1624rpx;
    }
}

.title {
    width: 304rpx;
    height: 109rpx;
    position: absolute;
    top: 300rpx;
}

.result {
    width: 100%;
    height: 100%;
    position: relative;
    padding-top: 250rpx;

    .bg2 {
        width: 100%;
        height: 750rpx;
    }

    .r_img {
        width: 100%;
        height: 100%;
        animation: largen 0.8s;
    }

    .hint_box {
        width: 100%;
        height: 277rpx;
        animation: largen2 0.8s;
        background-image: url("https://img.shinemang.com/gachaStatic/static/img/cs-result/hint.png");
        background-size: 100% 100%;
        text-align: center;
        padding-top: 76rpx;
        overflow: hidden;

        .ico1 {
            width: 62rpx;
            height: 43rpx;
        }

        .r_name {
            font-weight: 800;
            font-size: 30rpx;
            color: #fff;
            line-height: 60rpx;
        }
    }

    .btns {
        padding-top: 56rpx;

        .btn {
            position: relative;
            width: 254rpx;
            height: 78rpx;
            text-align: center;
            line-height: 78rpx;
            background: linear-gradient(76deg, #b3d0ff, #83a2fb);
            box-shadow: 0rpx 3rpx 8rpx 0rpx #1d3169;
            border-radius: 16rpx;
            font-size: 30rpx;
            font-weight: bold;
            color: #27355d;

            &.cor {
                color: #855c3e;
                background: linear-gradient(76deg, #fce38e, #fcba60);
                box-shadow: 0rpx 3rpx 8rpx 0rpx #5d4118;
            }

            .r_num {
                position: absolute;
                top: -100%;
                left: 50%;
                transform: translate(-50%, 0);
            }

            .ico1 {
                width: 60rpx;
                height: 56rpx;
                margin-right: 6rpx;

                &.nc {
                    width: 67rpx;
                }
            }
              .ico8 {
                aspect-ratio: 16/9; 
            }
            .ico5 {
                 aspect-ratio: 16/9; 
            }
            .tico3 {
                 aspect-ratio: 16/9; 
            }
            .ico2 {
               aspect-ratio: 16/9; 
            }
        }
    }
}

@keyframes largen {
    0% {
        width: 0;
        height: 0;
    }

    100% {
        width: 100%;
        height: 100%;
    }
}

@keyframes largen2 {
    0% {
        width: 0;
    }

    100% {
        width: 100%;
    }
}
</style>