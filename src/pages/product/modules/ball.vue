<template>
    <!-- @click="changeTop" -->
    <view class="ball" :style="{top:topNum+'rpx'}" >
        <view>
            <view v-if="afterTop !== -60" class="waterItem water water-level-10" :data-content="40 - afterTop + '%'"
                :style="{ '--after-top': afterTop + '%' }"></view>
            <view class="waterItem water1" v-else></view>
            <view class="outer"></view>
        </view>
        <!-- :data-content="40 - afterTop + '%'" -->
        <view class="num">{{ 40 - afterTop }}%</view>
        <view class="starry-container">
            <view v-for="(star, index) in stars" :key="index" class="star" :style="star.style"></view>
        </view>
    </view>
</template>
<script>
export default {
    props: {
        afterTop: {
            type: Number,
            default: 0,
        },
        topNum: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            // afterTop: -60, //-60 满，40 空
            stars: null,
        };
    },
    mounted() {
        // if (![-60, 40].includes(this.afterTop)) {
        this.stars = Array(20)
            .fill()
            .map(() => {
                const size = Math.random() * 2 + 5;
                const hue = Math.floor(Math.random() * 360); // 0-359任意色相
                const saturation = Math.floor(Math.random() * 30) + 20; // 20-50%饱和度
                const lightness = Math.floor(Math.random() * 20) + 70; // 70-90%明度
                return {
                    style: {
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        width: `${size}rpx`,
                        height: `${size}rpx`,
                        background: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
                    },
                };
            });
        // }
    },
    methods: {
        changeTop() {
            // this.afterTop = -30; // 动态修改
            // console.log('列表1');
        },
    },
};
</script>
<style lang='scss' scoped>
.ball {
    position: fixed;
    width: 160rpx;
    height: 160rpx;
    overflow: hidden;
    font-weight: bold;
    color: white;
    z-index: 999;

    .waterItem {
        position: absolute;
        width: 84rpx;
        height: 84rpx;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        overflow: hidden;
    }

    .water {
        background: linear-gradient(90deg, #8500e4 0%, #ff42e9 100%);
    }

    .water1 {
        background-image: url("https://img.shinemang.com/gachaStatic/static/img/chaowanshang/ballFull.png");
        background-size: 100% 100%;
    }

    .water::after {
        content: "";
        position: absolute;
        text-align: center;
        top: 0;
        left: 50%;
        width: 150%;
        height: 150%;
        border-radius: 35%;
        border: 2rpx solid #fcc7fe;
        background-color: #f6c3ff;
        animation: real 5s linear infinite;
    }

    @keyframes real {
        0% {
            transform: translate(-50%, -65%) rotate(0deg);
        }

        100% {
            transform: translate(-50%, -65%) rotate(360deg);
        }
    }

    /* 水位高度top: 35% ~ -65% */
    .water::before {
        content: "";
        position: absolute;
        top: 0;
        left: 50%;
        width: 150%;
        height: 150%;
        border-radius: 30%;
        border: 2rpx solid #fcc7fe;
        animation: virtual 7s linear infinite;
    }

    @keyframes virtual {
        0% {
            transform: translate(-50%, -60%) rotate(0deg);
        }

        100% {
            transform: translate(-50%, -60%) rotate(360deg);
        }
    }

    /* 定制浮动水位样式 */
    .water-level-10::after,
    .water-level-10::before {
        top: var(--after-top);
    }

    .water-level-20::after,
    .water-level-20::before {
        top: var(--after-top);
    }

    .outer {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background-image: url("https://img.shinemang.com/gachaStatic/static/img/duoyou/ballPP.png");
        background-size: 100% 100%;
        // text-align: center;
        // line-height: 240rpx;
    }

    // .outer::after {
    //     content: attr(data-content);
    //     width: 100%;
    //     position: absolute;
    //     left: 50%;
    //     top: 50%;
    //     transform: translate(-50%, -50%);
    //     -webkit-text-stroke: 3px transparent;
    //     background-color: #ea20fd;
    //     -webkit-background-clip: text;
    //     z-index: 999;
    // }

    .starry-container {
        position: absolute;
        width: 72rpx;
        height: 70rpx;
        left: 50%;
        top: 42rpx;
        transform: translateX(-50%);

        z-index: 997;

        .star {
            position: absolute;
            border-radius: 50%;
            animation: twinkle 2s infinite ease-in-out;
            opacity: 0;
            will-change: transform, opacity;
            /* 提升动画性能 */
        }

        @keyframes twinkle {

            // 0%,
            100% {
                opacity: 0.3;
                transform: scale(0.8);
                box-shadow: 0 0 2rpx rgba(255, 215, 0, 0.3);
            }

            50% {
                opacity: 1;
                transform: scale(1.2);
                box-shadow: 0 0 16rpx #ffd700, 0 0 32rpx #daa520;
            }
        }
    }

    .num {
        width: 100%;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        -webkit-text-stroke: 3px transparent;
        background-color: #ea20fd;
        -webkit-background-clip: text;
        z-index: 999;
        font-size: 26rpx;
        text-align: center;
    }
}

.ball::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("https://img.shinemang.com/gachaStatic/static/img/chaowanshang/ballBg.png");
    background-size: cover;
    // animation: rotateBg 20s linear infinite;
}

@keyframes rotateBg {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>