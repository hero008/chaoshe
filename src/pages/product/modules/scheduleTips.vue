<template>
    <u-popup :show="LuckyVisible" bgColor="transparent" >
        <view class="scheduleTips flex_r flex_jb flex_ac">
            <view class="title">进度节点</view>
            <view class="center">抽赏进度条达到当前整箱<text class="highlight">{{ scheduleNum }}%</text>进度节点时，将触发该 Lucky 赏的掉落机制 ——
                在本阶段所有参与抽赏的用户中，随机抽取 1 位用户获得该 Lucky赏</view>
            <view class="btn" @click="onTipsOff()">继续开赏</view>
        </view>
    </u-popup>
</template>
<script>
export default {
    // name: "scheduleTips",
    props: {
        LuckyVisible: {
            type: Boolean,
            default: false,
        },
        scheduleNum: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {};
    },
    methods: {
        onTipsOff() {
           this.$emit("onTips",false);
        }
    },
};
</script>
<style lang='scss' scoped>
.scheduleTips {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 670rpx;
    height: 736rpx;
    background-image: url("https://img.chaoshewang.com/static/img/niudan/scheduleTips.png");
    background-size: 100% 100%;

    .title {
        position: absolute;
        left: 50%;
        top: 88rpx;
        transform: translateX(-50%);
        font-size: 56rpx;
        font-family: "Microsoft Yahei", "PingFang SC", sans-serif;
        color: #ffffff;
        text-align: center;
        text-shadow:
            0 0 24px #6600D7,
            0 0 24px #6600D7,
            0 0 24px #6600D7;
        letter-spacing: 3px;
    }

    .center {
        position: absolute;
        left: 50%;
        bottom: 176rpx;
        transform: translateX(-50%);
        width: 478rpx;
        height: 296rpx;
        background: #7D39C7;
        border-radius: 24rpx;
        padding: 48rpx 32rpx;
        // font-weight: bold;
        font-size: 28rpx;
        color: #FFFFFF;
        line-height: 40rpx;
        letter-spacing: 1rpx;

        .highlight {
            color: #F6A34F;
            font-weight: bold;
        }
    }

    .btn {
        position: absolute;
        left: 50%;
        bottom: 56rpx;
        transform: translateX(-50%);
        width: 462rpx;
        height: 80rpx;
        line-height: 80rpx;
        background: linear-gradient(0deg, #FFFCE1 0%, #F6A34F 100%);
        border-radius: 40rpx;
        font-weight: 800;
        font-size: 32rpx;
        color: #5B1CA1;
        letter-spacing: 1px;
        text-align: center;
    }
}
</style>