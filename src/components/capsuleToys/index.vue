<template>
    <view class="egg">
        <!-- 背景 -->
        <!-- <image class="egg_bg" src="https://img.shinemang.com/gachaStatic/static/img/capsuleToys/ndj_bg1.png" mode="widthFix">
        </image> -->
        <image class="egg_ji" src="../../static/gachaStatic/niudanji/box.png" mode="widthFix">
        </image>

        <!-- 开关 -->
         <view class="play" :class="start ? 'go' : ''" @click="eggPlay">

         </view>
        <!-- <image class="play" :class="start ? 'go' : ''" @click="eggPlay"
            src="https://img.shinemang.com/gachaStatic/static/img/capsuleToys/ndj_btn-4.png" mode="widthFix"></image> -->
        <!-- 散蛋 -->
        <view class="egg_box">
            <image v-for="ball in balls" :key="ball.id" class="ball"
                :class="[ball.class, start ? 'weiyi_' + ball.id : '']" :src="baseImgUrl + ball.img"  mode="widthFix">
            </image>
        </view>
        <!-- 掉落的蛋 -->
        <!-- <image :hidden="qiu" :animation="ani" class="ball ball_end" src="https://img.shinemang.com/gachaStatic/static/img/capsuleToys/ndj_ball-3.png" mode="widthFix"></image> -->
    </view>
</template>
<script>
export default {
    data() {
        return {
            start: false,
            qiu: true,
            nui: '',
            balls: [
                { id: 1, img: 'ndj_ball-1.png', class: 'ball_1' },
                { id: 2, img: 'ndj_ball-2.png', class: 'ball_2' },
                { id: 3, img: 'ndj_ball-3.png', class: 'ball_3' },
                { id: 4, img: 'ndj_ball-4.png', class: 'ball_4' },
                { id: 5, img: 'ndj_ball-5.png', class: 'ball_5' },
                { id: 6, img: 'ndj_ball-6.png', class: 'ball_6' },
                { id: 7, img: 'ndj_ball-7.png', class: 'ball_7' },
                { id: 13, img: 'ndj_ball-5.png', class: 'ball_13' },
                { id: 9, img: 'ndj_ball-1.png', class: 'ball_9' },
                { id: 10, img: 'ndj_ball-6.png', class: 'ball_10' },
                { id: 11, img: 'ndj_ball-3.png', class: 'ball_11' },
                { id: 12, img: 'ndj_ball-5.png', class: 'ball_12' },
                { id: 8, img: 'ndj_ball-8.png', class: 'ball_8' }
            ],
            baseImgUrl: 'https://img.shinemang.com/gachaStatic/static/img/capsuleToys/'
        }
    },
    computed: {},
    methods: {
        // 点击扭蛋机
        eggPlay(isdemo) {
            if (isdemo != 1) this.$emit('eggPlay')
            this.start = true
            setTimeout(() => {
                this.start = false
                this.qiu = false
                //球落下动画
                var animation = uni.createAnimation({
                    duration: 1500,
                    timingFunction: 'ease',
                });
                animation.opacity(1).step()
                this.ani = animation.export()
            }, 3000);

            this.qiu = true
            //将动画返回到开始位置
            var animation = uni.createAnimation({
                duration: 1500,
                timingFunction: 'ease',
            });
            animation.opacity(0).step()
            this.ani = animation.export()
        },
    },
}
</script>
<style lang="css" scoped>
.egg {
    /* z-index: 3; */
    width: 100%;
    height: 662rpx;
    position: relative;
    margin-top: 24rpx;
}

.egg .egg_ji {
    width: 100%;
    height: 662rpx;
    position: absolute;
    left: 0;
    /* left: calc((100% - 660rpx) / 2); */
    top: 0;
    /* z-index: 1; */
}

.egg .egg_bg {
    width: 660rpx;
    height: 764rpx;
    position: absolute;
    left: calc((100% - 660rpx) / 2);
    top: 0;
}

.egg .play {
    width: 200rpx;
    height: 62rpx;
    position: absolute;
    /* z-index: 10; */
    bottom: 130rpx;
    right: 136rpx;
}

.egg_box {
    position: absolute;
    width: 517rpx;
    height: 287rpx;
    left: 50%;
    transform: translateX(-50%);
    bottom: 206rpx;
    overflow: hidden;

}

.egg .ball {
    width: 100rpx;
    height: 100rpx;
    position: absolute;
    /* z-index: 4; */
}

.egg .ball_1 {
    bottom: 34rpx;
    left: 199rpx;
}

.egg .ball_2 {
    bottom: 30rpx;
    left: 259rpx;
}

.egg .ball_3 {
    bottom: 32rpx;
    left: 139rpx;
}

.egg .ball_4 {
    bottom: 4rpx;
    left: 320rpx;
}

.egg .ball_5 {
    bottom: -20rpx;
    left: 180rpx;
}

.egg .ball_6 {
    bottom: 24rpx;
    left: 240rpx;
}

.egg .ball_7 {
    bottom: -8rpx;
    left: 290rpx;
}

.egg .ball_8 {
    bottom: -4rpx;
    left: 206rpx;
}

.egg .ball_9 {
    bottom: 24rpx;
    left: 98rpx;
}

.egg .ball_10 {
    bottom: -9rpx;
    left: 119rpx;
}

.egg .ball_11 {
    bottom: 51rpx;
    left: 49rpx;
}

.egg .ball_12 {
    bottom: -6rpx;
    left: 36rpx;
}

.egg .ball_13 {
    bottom: 96rpx;
    left: 88rpx;
}

.egg .ball_end {
    bottom: 87rpx;
    left: 143rpx;
}

.weiyi_1 {
    animation: around1 1.5s linear infinite;
}

.weiyi_2 {
    animation: around2 1.5s linear infinite;
}

.weiyi_3 {
    animation: around3 1.5s linear infinite;
}

.weiyi_4 {
    animation: around4 1.5s linear infinite;
}

.weiyi_5 {
    animation: around5 1.5s linear infinite;
}

.weiyi_6 {
    animation: around6 1.5s linear infinite;
}

.weiyi_7 {
    animation: around7 1.5s linear infinite;
}

.weiyi_8 {
    animation: around8 1.5s linear infinite;
}

.weiyi_9 {
    animation: around9 1.5s linear infinite;
}

.weiyi_10 {
    animation: around10 1.5s linear infinite;
}

.weiyi_11 {
    animation: around11 1.5s linear infinite;
}

.weiyi_12 {
    animation: around12 1.5s linear infinite;
}

.weiyi_13 {
    animation: around13 1.5s linear infinite;
}

.go {
    animation: around 0.3s linear 1;
}


/* 位移 */
@keyframes around {
    100% {
        transform: rotate(-180deg)
    }
}

@keyframes around1 {
    0% {
        transform: translate(0rpx, 0rpx)
    }

    20% {
        transform: translate(-100rpx, 10rpx)
    }

    40% {
        transform: translate(120rpx, -60rpx)
    }

    60% {
        transform: translate(-150rpx, -190rpx)
    }

    80% {
        transform: translate(80rpx, 50rpx)
    }

    100% {
        transform: translate(0, 0)
    }
}

@keyframes around2 {
    0% {
        transform: translate(0rpx, 0rpx)
    }

    20% {
        transform: translate(-180rpx, -100rpx)
    }

    40% {
        transform: translate(-20rpx, -50rpx)
    }

    60% {
        transform: translate(100rpx, -180rpx)
    }

    80% {
        transform: translate(-150rpx, -50rpx)
    }

    100% {
        transform: translate(0, 0)
    }
}

@keyframes around3 {
    0% {
        transform: translate(0rpx, 0rpx)
    }

    20% {
        transform: translate(180rpx, 10rpx)
    }

    40% {
        transform: translate(240rpx, -110rpx)
    }

    60% {
        transform: translate(100rpx, -160rpx)
    }

    80% {
        transform: translate(-50rpx, -130rpx)
    }

    100% {
        transform: translate(0, 0)
    }
}

@keyframes around4 {
    0% {
        transform: translate(0rpx, 0rpx)
    }

    20% {
        transform: translate(-180rpx, 10rpx)
    }

    40% {
        transform: translate(-240rpx, -110rpx)
    }

    60% {
        transform: translate(-100rpx, -240rpx)
    }

    80% {
        transform: translate(-10rpx, -130rpx)
    }

    100% {
        transform: translate(0, 0)
    }
}

@keyframes around5 {
    0% {
        transform: translate(0rpx, 0rpx)
    }

    20% {
        transform: translate(40rpx, -70rpx)
    }

    40% {
        transform: translate(50rpx, -180rpx)
    }

    60% {
        transform: translate(80rpx, -10rpx)
    }

    80% {
        transform: translate(190rpx, -130rpx)
    }

    100% {
        transform: translate(0, 0)
    }
}

@keyframes around6 {
    0% {
        transform: translate(0rpx, 0rpx)
    }

    20% {
        transform: translate(-150rpx, -50rpx)
    }

    40% {
        transform: translate(130rpx, -140rpx)
    }

    60% {
        transform: translate(-110rpx, -180rpx)
    }

    80% {
        transform: translate(-130rpx, -20rpx)
    }

    100% {
        transform: translate(0, 0)
    }
}

@keyframes around7 {
    0% {
        transform: translate(0rpx, 0rpx)
    }

    20% {
        transform: translate(80rpx, -50rpx)
    }

    40% {
        transform: translate(-180rpx, -100rpx)
    }

    60% {
        transform: translate(50rpx, -150rpx)
    }

    80% {
        transform: translate(-180rpx, -20rpx)
    }

    100% {
        transform: translate(0, 0)
    }
}

@keyframes around8 {
    0% {
        transform: translate(0rpx, 0rpx)
    }

    20% {
        transform: translate(50rpx, -150rpx)
    }

    40% {
        transform: translate(-180rpx, -100rpx)
    }

    60% {
        transform: translate(80rpx, -50rpx)
    }

    80% {
        transform: translate(-180rpx, -20rpx)
    }

    100% {
        transform: translate(0, 0)
    }
}

@keyframes around9 {
    0% {
        transform: translate(0rpx, 0rpx)
    }

    20% {
        transform: translate(280rpx, -150rpx)
    }

    40% {
        transform: translate(10rpx, -100rpx)
    }

    60% {
        transform: translate(220rpx, -50rpx)
    }

    80% {
        transform: translate(30rpx, -200rpx)
    }

    100% {
        transform: translate(0, 0)
    }
}

@keyframes around10 {
    0% {
        transform: translate(0rpx, 0rpx)
    }

    20% {
        transform: translate(10rpx, -200rpx)
    }

    40% {
        transform: translate(280rpx, -150rpx)
    }

    60% {
        transform: translate(20rpx, -100rpx)
    }

    80% {
        transform: translate(220rpx, -50rpx)
    }

    100% {
        transform: translate(0, 0)
    }
}

@keyframes around11 {
    0% {
        transform: translate(0rpx, 0rpx)
    }

    20% {
        transform: translate(150rpx, -200rpx)
    }

    40% {
        transform: translate(280rpx, -10rpx)
    }

    60% {
        transform: translate(20rpx, -100rpx)
    }

    80% {
        transform: translate(220rpx, -50rpx)
    }

    100% {
        transform: translate(0, 0)
    }
}

@keyframes around12 {
    0% {
        transform: translate(0rpx, 0rpx)
    }

    20% {
        transform: translate(150rpx, -200rpx)
    }

    40% {
        transform: translate(280rpx, -10rpx)
    }

    60% {
        transform: translate(20rpx, -100rpx)
    }

    80% {
        transform: translate(220rpx, -50rpx)
    }

    100% {
        transform: translate(0, 0)
    }
}

@keyframes around13 {
    0% {
        transform: translate(0rpx, 0rpx)
    }

    20% {
        transform: translate(260rpx, 50rpx)
    }

    40% {
        transform: translate(-80rpx, -100rpx)
    }

    60% {
        transform: translate(-20rpx, 130rpx)
    }

    80% {
        transform: translate(100rpx, -180rpx)
    }

    100% {
        transform: translate(0, 0)
    }
}
</style>