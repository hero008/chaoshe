<template>
    <u-popup
        mode="center"
        :show="visible"
        bgColor="transparent"
        :safeAreaInsetBottom="false"
    >
        <view class="remind_box">
            <view class="title">温馨提示</view>
            <view class="box">
                请阅读并同意
                <span 
                    @click.stop="
                        goto('/pages/common/rulepop', {
                            val: deal[0].text,
                        })
                    "
                    class="xy"
                    >《{{deal[0].name}}》</span
                >和<span 
                    @click.stop="
                        goto('/pages/common/rulepop', {
                            val: deal[1].text,
                        })
                    "
                    class="xy"
                    >《{{deal[1].name}}》</span
                >
                后进行{{next}}。
            </view>
            <view class="btn_box flex_r">
                <view class="left" @click="onRemindYou(false)"
                    >取消关闭</view
                >
                <view class="left right" @click="onRemindYou(true)"
                    >已阅读并同意</view
                >
            </view>
        </view>
    </u-popup>
</template>
<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        deal: {
            type: Array,
            default: [],
        },
        next: {
            type: String,
            default: "",
        },
    },
    data() {
        return {};
    },
    components: {},
    created() {},
    mounted() {},
    methods: {
        onRemindYou(valse){
               this.$emit("tipsVue",valse);
        }
    },
};
</script>
<style lang='scss' scoped>
.remind_box {
    position: absolute;
    width: 590rpx;
    height: 408rpx;
    background: #ffffff;
    border-radius: 40rpx;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 0 30rpx;
    .title {
        width: 100%;
        height: 150rpx;
        font-weight: 800;
        font-size: 40rpx;
        color: #383228;
        line-height: 150rpx;
        text-align: center;
    }
    .box {
        font-weight: 500;
        font-size: 28rpx;
        color: #383228;
        .xy {
            color:#01C2D0;
        }
    }
    .btn_box {
        margin-top: 48rpx;
        .left {
            width: 240rpx;
            height: 80rpx;
            line-height: 80rpx;
            text-align: center;
            background: #e2e1e3;
            border-radius: 80rpx;
            font-weight: bold;
            font-size: 28rpx;
            color: #383228;
        }
        .right {
            background: linear-gradient( 90deg, #31E597 0%, #40E0EA 100%);
            color: #000;
            margin-left: 30rpx;
        }
    }
}
</style>