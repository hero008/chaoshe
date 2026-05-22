<template>
    <u-popup
        mode="center"
        :show="visible"
        bgColor="transparent"
        :safeAreaInsetBottom="false"
    >
        <view class="remind_box">
            <view class="title">温馨提示</view>
            <view class="off" @click="onClick(0)"></view>
            <view class="box">
                <rich-text :nodes="highlightedContent"></rich-text>
            </view>
            <view class="btn_box" @click="onClick(1)"> </view>
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
        themeName: {
            type: String,
            default: "",
        },
        message: {
            type: String,
            default: "",
        },
    },
    data() {
        return {};
    },
    computed: {
        highlightedContent() {
            return this.formattedMessage();
        },
    },
    mounted() {},
    methods: {
        onClick(valse) {
            this.$emit("onDiscounts");
            if (valse) {
                uni.reLaunch({
                    url: "/pages/index/index",
                });
            }
        },
        formattedMessage() {
            // 转义正则表达式中的特殊字符
            const escapeRegExp = (string) => {
                return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            };
          
            // 创建安全的正则表达式
            const safeTheme = escapeRegExp(this.themeName);
            const regex = new RegExp(safeTheme, "g");
            // 替换文本，添加高亮样式
            return this.message.replace(
                regex,
                '<span style="color: #9762E9">$&</span>'
            );
        },
    },
};
</script>
<style lang='scss' scoped>
.remind_box {
    position: absolute;
    width: 542rpx;
    height: 750rpx;
    border-radius: 40rpx;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 0 28rpx;
    background-image: url("https://img.shinemang.com/gachaStatic/static/img/chaowanshang/discounts.png");
    background-size: 100% 100%;
    .title {
        font-weight: 800;
        font-size: 44rpx;
        text-shadow: 0px 2px 2px rgba(255, 255, 255, 0.25);
        text-align: center;
        font-style: normal;
        text-transform: none;
        background: linear-gradient(to right, #4a6ee9, #c171ff);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
        margin-top: 230rpx;
    }
    .off {
        position: absolute;
        top: 118rpx;
        right: 20rpx;
        width: 56rpx;
        height: 56rpx;
        background-image: url("https://img.shinemang.com/gachaStatic/static/img/market/close.png");
        background-size: 100% 100%;
    }
    .box {
        width: 488rpx;
        padding: 40rpx;
        font-weight: 500;
        font-size: 32rpx;
        color: #383228;
        background: rgba(255, 255, 255, 0.4);
        border-radius: 20rpx;
        border: 2rpx solid rgba(255, 255, 255, 0.8);
        margin: 48rpx auto 40rpx;
        text-align: left;
        span {
            color: rgba(126, 85, 227, 1);
        }
    }
    .btn_box {
        width: 258rpx;
        height: 102rpx;
        background-image: url("https://img.shinemang.com/gachaStatic/static/img/chaowanshang/discountsBtn.png");
        background-size: 100% 100%;
        margin: 0 auto;
    }
}
</style>