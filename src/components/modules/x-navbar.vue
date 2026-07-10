<template>
    <view class="header" :style="{ paddingTop: MBInfo().top + 'px' }" >
        <view  :style="{ height: MBInfo().height + 'px' }" >
            <view class="top_Back" @click.stop="gateBack()" :style="{color:tcolor}">
                <text :style="{
                    color:whiteBack ? '#fff':'#1c1c1c'
                }" class="icof Back_ico">&#xe72c;</text>
                <text class="txt"> {{tit ? tit : '返回'}}</text>
            </view>
        </view>
    </view>
</template>
<script>
export default {
    data() {
        return {};
    },
    props: {
        tit: {
            type: String,
            default: " "
        },
        tcolor: {
            type: String,
            default: "#1c1c1c"
        },
        whiteBack: {
            type:Boolean,
            default:false
        }
    },
    created() {},
    mounted() {
        console.log(this.MBInfo());
    },
    methods: {},
};
</script>
<style lang='scss' scoped>
::v-deep .u-navbar__content__title{
    font-weight: 800;
font-size: 36rpx;
color: #000000;
text-align: left;
width: 580rpx !important;
}
.header{
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
}
.top_Back {
    color: #1c1c1c;
    padding-left: 24rpx;
    display: flex;
    align-items: center;

    text {
        vertical-align: middle;
    }

    .Back_ico {
        font-size: 50rpx;
        margin-right: 8rpx;
    }

    .txt {
        font-size: 36rpx;
    }
}
</style>