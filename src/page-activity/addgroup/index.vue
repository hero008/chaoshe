<template>
    <view class="addgroup">
        <view class="addgroup_con">
            <x-navbar tcolor="#fff" />
            <image src="https://img.shinemang.com/gachaStatic/static/img/activity/addgroup.png" class="bg" />
            <div class="qrcode_box flex_c flex_ac">
                <img :src="qrurl" class="qrcode" @click="yulan">
                <!-- #ifdef MP-WEIXIN -->
                <div class="txt">点击长按识别二维码</div>
                <!-- #endif -->
                <div class="txt">添加福利官进入社群领取神秘福利</div>
            </div>
        </view>
    </view>
</template>
<script>
// 社群
import xNavbar from "@/components/modules/x-navbar";
export default {
    data() {
        return {
            qrurl: 'https://img.shinemang.com/gachaStatic/static/img/home/contact_me_qr.png'
        };
    },
    components: { xNavbar },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    onLoad(da) {},
    onShow() {},
    methods: {
        yulan() {
            uni.previewImage({ urls: [this.qrurl] })
        }
    },
};
</script>
<style lang="scss" scoped>
.addgroup {
    width: 100vw;
    height: 100vh;
    overflow-y: auto;
}

.addgroup_con {
    height: 1624rpx;
    position: relative;

    .bg {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
    }

    .qrcode_box {
        width: 100%;
        position: absolute;
        top: 732rpx;
    }

    .qrcode {
        width: 260rpx;
        height: 260rpx;
        background-color: #fff;
        padding: 0 2rpx;
        border-radius: 16rpx;
        border: 8rpx solid $motif-color;
        margin-bottom: 30rpx;
    }

    .txt {
        color: #703FD8;
        font-size: 28rpx;
        line-height: 38rpx;
    }
}
</style>