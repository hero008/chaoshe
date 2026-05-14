<template>
    <u-popup mode="center" :show="visible" bgColor="transparent" :safeAreaInsetBottom="false">
        <view class="remind_box flex_c flex_ac" :style="{
            backgroundImage: `url(${prize.bg})`,
            width: prize.width + 'rpx',
            height: prize.height + 'rpx',
        }">
            <view class="swiper-box" :style="{
                width: prize.width - 100 + 'rpx',
                height: prize.imgHeight + 90 + 'rpx',
            }">
                <swiper @change="onSwiperChange" :indicator-dots="autoplay" :interval="2000" :duration="500"
                    :circular="autoplay" :autoplay="autoplay" :style="{
                        height: WeChat
                            ? prize.height + 20 + 'rpx'
                            : prize.imgHeight + 'rpx',
                    }" class="swiper-box1">
                    <swiper-item v-for="(item, index) in prizeList" :key="index">
                        <image class="swiper-img" :src="item.thumb" mode="aspectFill" :style="{
                            width: prize.imgWidth + 'rpx',
                            height: prize.imgHeight + 'rpx',
                        }" />
                        <view class="name-box flex_r flex_jc flex_ac">
                            <view class="name ellipsis" :style="{
                                'max-width': prize.width - 200 + 'rpx',
                            }">{{ item.name }}</view>
                            <view class="num" v-if="item.num>1"> X{{ item.num }}</view>
                        </view>
                    </swiper-item>
                </swiper>
            </view>
            <view class="btn" :style="{ backgroundImage: `url(${prize.btn})` }" @click="onClick(1)"></view>
        </view>
        <uni-icons class="off" @click="onClick" type="close" color="#fff" size="40"></uni-icons>
    </u-popup>
</template>
<script>
export default {
    props: {
        prize: {
            type: Object,
            default: {},
        },
    },
    data() {
        return {
            autoplay: true,
            currentIndex: 0,
            // #ifndef MP-WEIXIN
            WeChat: false,
            // #endif
            // #ifdef MP-WEIXIN
            WeChat: true,
            // #endif
            visible: false,
            prizeList: [],
        };
    },
    computed: {},
    onLoad(da) { },
    mounted() { },
    methods: {
        open(list, num = 0) {
            this.visible = true;
            if (num) list[0].num = num
            this.prizeList = list;
            this.autoplay = list.length > 1 ? true : false;
        },
        onSwiperChange(e) {
            this.currentIndex = e.detail.current;
        },
        onClick() {
            this.$emit("showPrize");
            this.visible = false;
        },
    },
};
</script>
<style lang='scss' scoped>
.swiper-box {
    overflow: hidden;
    margin-top: 30rpx;
}

::v-deep .uni-swiper-wrapper {
    overflow: visible !important;
}

::v-deep uni-swiper-item {
    overflow: visible !important;
}

::v-deep .uni-swiper-dots-horizontal {
    bottom: -14rpx;
}

::v-deep swiper-item {
    overflow: visible !important;
}

.remind_box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    /* 水平居中 */
    align-items: center;
    /* 垂直居中 */
    flex-wrap: wrap;

    /* 允许子元素换行 */
    .btn {
        width: 380rpx;
        height: 80rpx;
        margin-top: 40rpx;
        background-size: 100% 100%;
    }
}

.swiper-img {
    display: block;
    margin-left: auto;
    margin-right: auto;
}

.name-box {
    position: absolute;
    width: 100%;
    text-align: center;
    font-weight: bold;
    font-size: 32rpx;
    color: #383228;
    margin-top: 32rpx;

    .num {
        margin-left: 8rpx;
        color: #e10000;
    }
}

.off {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    top: 450rpx;
}
</style>