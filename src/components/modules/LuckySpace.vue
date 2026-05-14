<template>
    <u-popup
        mode="center"
        :show="true"
        bgColor="transparent"
        :safeAreaInsetBottom="false"
    >
        <view class="LuckySpace">
            <view class="off" @click="onOff"></view>
            <view class="text">能量已满，幸运降临，惊喜来袭！！</view>
            <view class="btn" @click="onGo">幸运空间 GO </view>
        </view>
    </u-popup>
</template>

<script>
export default {
    data() {
        return { visible: false };
    },
    created() {},
    mounted() {},
    methods: {
        onOff() {},
        onGo() {},
    },
};
</script>
<style lang="scss" scoped>
.LuckySpace {
    position: relative;
    width: 550rpx;
    height: 472rpx;
    background: linear-gradient(180deg, #e69bff 0%, #ffffff 60%, #ffffff 100%);
    border-radius: 48rpx;
    &::before {
        content: "恭喜您！";
        position: absolute;
        top: 0;
        width: 100%;
        height: 200rpx;
        background-image: url("https://img.chaoshewang.com/static/img/activity/upopup_title.png");
        background-size: 100% 100%;
        font-weight: 800;
        font-size: 40rpx;
        color: #9320e3;
        text-align: center;
        line-height: 200rpx;
    }
    .text {
        width: 390rpx;
        margin: 184rpx auto 0;
        text-align: center;
    }
    .btn {
        width: 296rpx;
        height: 80rpx;
        margin: 64rpx auto 0;
        background-image: url("https://img.chaoshewang.com/static/img/activity/kaixin.png");
        background-size: 100% 100%;
        font-weight: 800;
        font-size: 32rpx;
        color: #ffffff;
        line-height: 80rpx;
        text-align: center;
        &::after {
            content: " 〉〉";
            font-size: 28rpx;
        }
    }
    .off {
        position: absolute;
        width: 56rpx;
        height: 56rpx;
        right: 0;
        top: -88rpx;
        background-image: url("https://img.chaoshewang.com/static/img/activity/off.png");
        background-size: 100% 100%;
    }
}
</style>