<template>
    <u-overlay @click="onclose('')" zIndex="11000" :show="visible">
        <view class="warp flex_wrap">
            <img class="close_btn" src="@/static/close.png" @click="onclose('')" />
            <view class="header">备注</view>
            <textarea
                placeholder="请输入备注(最大长度50字)"
                class="textarea"
                maxlength=50
                v-model="text"
            ></textarea>
            <view class="btn" @click="onclose(text)">确定</view>
        </view>
    </u-overlay>
</template>
<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            text:''
        };
    },
    methods: {
        onclose(value) {
            this.text=value 
            let a =value==''?'无备注':value
           this.$emit('childEvent',false, a);
        },

    },
};
</script>
<style lang='scss' scoped>

.warp {
    height: 600rpx;
    width: 750rpx;
    position: absolute;
    background: #f4f4f4;
    bottom: 0;
    border-top-right-radius: 50rpx;
    padding: 56rpx 32rpx 80rpx 32rpx;
    font-family: PingFang SC, PingFang SC;
    .close_btn {
			position: absolute;
			right: 36rpx;
			top: -68rpx;
			width: 56rpx;
			height: 56rpx;
		}
    .header {
        font-weight: bold;
        font-size: 32rpx;
        color: #1a1a1a;
    }
    .textarea {
        margin-top: 20rpx;
        padding: 24rpx;
        width: 638rpx;
        height: 192rpx;
        background: #e2e1e3;
        border-radius: 16rpx 16rpx 16rpx 16rpx;

        font-weight: 500;
        color: #1a1a1a;
        font-size: 28rpx;
    }

    .btn {
        width: 686rpx;
        height: 80rpx;
        line-height: 80rpx;
        text-align: center;
        background: linear-gradient( 90deg, #31E597 0%, #40E0EA 100%);
        border-radius: 40rpx;
        font-weight: 500;
        color: #1a1a1a;
        margin-top:160rpx;
    }
}
</style>