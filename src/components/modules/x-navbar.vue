<template>
    <u-navbar :height="MBInfo().top +  MBInfo().height + 'px'" :titleStyle="{paddingTop:MBInfo().top + 'px'}"  :title="tit"  bgColor="transparent">
        <view  :style="{paddingTop:MBInfo().top +  'px'}"   class="u-nav-slot" slot="left">
            <view class="top_Back" @click.stop="gateBack()" :style="{color:tcolor}">
                <text class="icof Back_ico">&#xe72c;</text>
                <text class="txt" v-if="tit==''">返回</text>
            </view>
        </view>
    </u-navbar>
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
        }
    },
    created() {},
    mounted() {},
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
.top_Back {
    color: #1c1c1c;

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