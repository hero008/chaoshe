<template>
    <view class="x-btn flex_r flex_ac flex_jc" :class="['cor'+cor]" @click="onck">
        <div class="btn-bor" :class="['bcor'+cor]">{{txt}}</div>
    </view>
</template>
<script>
export default {
    props: {
        txt: {
            type: String,
            default: ""
        },
        cor: {
            type: String,
            default: "" // 1绿色 2黄色 3紫色 默认灰色
        },
    },
    data() {
        return {};
    },
    created() {},
    mounted() {},
    methods: {
        onck() {
            this.$emit("click")
        }
    },
};
</script>
<style lang='scss' scoped>
.x-btn {
    width: 246rpx;
    height: 82rpx;
    border-radius: 40rpx;
     background: linear-gradient(90deg, #31e597 0%, #40e0ea 100%);
    // background: rgba(80, 80, 80, 0.25);
    // box-shadow: 0rpx 4rpx 10rpx 4rpx rgba(80, 80, 80, 0.2);

    &.cor1 {
        // background: rgba(124, 243, 105, 0.4);
        // box-shadow: 0rpx 4rpx 10rpx 4rpx rgba(124, 243, 105, 0.2);
    }

    &.cor2 {
        // background: rgba(255, 190, 116, 0.4);
        // box-shadow: 0rpx 4rpx 10rpx 4rpx rgba(255, 190, 116, 0.2);
    }

    &.cor3 {
        // background: rgba(145, 129, 229, 0.4);
        // box-shadow: 0rpx 4rpx 10rpx 4rpx rgba(145, 129, 229, 0.2);
    }

    .btn-bor {
        color: #fff;
        border-radius: 40rpx;
        width: 230rpx;
        height: 70rpx;
        text-align: center;
        line-height: 70rpx;
        border-radius: 40rpx;
        font-size: 28rpx;
        font-weight: bold;
         color: #1a1a1a;
        // background: linear-gradient(180deg, #FFF0DE 0%, #EFEFEF 0%, #D3D3D3 100%);
        // box-shadow: inset 0rpx 4rpx 4rpx 0rpx rgba(255, 255, 255, 0.25);

        &.bcor {
           
        }

        &.bcor1 {
            // background: linear-gradient(180deg, #4FEF5F 0%, #1BAB04 100%);
            // box-shadow: inset 0rpx 4rpx 4rpx 0rpx rgba(255, 255, 255, 0.25);
        }

        &.bcor2 {
            // background: linear-gradient(180deg, #D9D9D9 0%, #FFBE74 0%, #FE922C 100%);
            // box-shadow: inset 0rpx 4rpx 4rpx 0rpx rgba(255, 255, 255, 0.25);
        }

        &.bcor3 {
            // background: linear-gradient(180deg, #9181E5 0%, #5A45C8 100%);
            // box-shadow: inset 0rpx 4rpx 4rpx 0rpx rgba(255, 255, 255, 0.25);
        }
    }
}
</style>