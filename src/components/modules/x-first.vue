<template>
    <u-popup mode="center" :show="visible" bgColor="transparent" :safeAreaInsetBottom="false">
        <div class="ipopup_con">
            <img class="btn" @click='tochaowan' src="https://img.chaoshewang.com/static/img/my/first_btn.png">
            <img @click="close" src="https://img.chaoshewang.com/static/img/market/close.png" class="close">
        </div>
    </u-popup>
</template>
<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {};
    },
    components: {},
    created() {},
    mounted() {},
    methods: {
        close() { this.$emit('update:visible', false) },
        tochaowan() {
            uni.setStorageSync("currentChange", 0);
            uni.reLaunch({
                url: "/pages/index/index"
            });
        }
    },
};
</script>
<style lang='scss' scoped>
.ipopup_con {
    width: 573rpx;
    height: 717rpx;
    background-image: url("https://img.chaoshewang.com/static/img/my/first_bg.png");
    background-size: 100% 100%;
    position: relative;

    .close {
        width: 56rpx;
        height: 56rpx;
        position: absolute;
        right: 0rpx;
        top: 50rpx;
    }

    .btn {
        width: 342rpx;
        height: 125rpx;
        position: absolute;
        left: 114rpx;
        top: 535rpx;
    }
}
</style>