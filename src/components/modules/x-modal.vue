<template>
    <u-popup
        mode="center"
        :show="visible"
        bgColor="transparent"
        :safeAreaInsetBottom="false"
    >
        <div class="ipopup_con">
            <img
                @click="close"
                src="https://img.shinemang.com/gachaStatic/static/img/market/close.png"
                class="close"
            />
            <div class="title">操作提示</div>
            <div class="text_con flex_c flex_ac">
                <div class="p">
                    {{
                        text == 1
                            ? "复制链接浏览器下载"
                            : "小程序暂不支持该功能"
                    }}
                </div>
                <div class="p">
                    <span v-if="text !== 1">需使用</span
                    ><span class="corr">完整版芒盒APP</span>
                </div>
                <div class="p1 flex_r flex_ac flex_jb">
                    <div class="Ico_item flex_c flex_ac">
                        <img
                            src="https://img.shinemang.com/gachaStatic/static/img/my/android.png"
                            class="i_ico"
                        />
                        <div class="i_name">Andrroid</div>
                    </div>
                    <div class="Ico_item flex_c flex_ac">
                        <img
                            src="https://img.shinemang.com/gachaStatic/static/img/my/ios.png"
                            class="i_ico"
                        />
                        <div class="i_name">Iphone</div>
                    </div>
                </div>
                <div
                    class="btn"
                    @click="
                        copy(
                            'https://img.chaoshewang.com/apk/release_v0.0.1.apk'
                        )
                    "
                >
                    点击复制下载链接
                </div>
                <!-- <div class="btn" @click="copy('http://www.chaoshewang.com')">点击复制下载链接</div> -->
            </div>
        </div>
    </u-popup>
</template>
<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        text: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {};
    },
    components: {},
    created() {},
    mounted() {},
    methods: {
        close() {
            if (this.text == 1) {
                this.$emit("onModal", false);
            }
            this.$emit("update:visible", false);
        },
    },
};
</script>
<style lang='scss' scoped>
.ipopup_con {
    width: 542rpx;
    height: 587rpx;
    background-image: url("https://img.shinemang.com/gachaStatic/static/img/imgs/modal_bg.png");
    background-size: 100% 100%;
    position: relative;

    .close {
        width: 56rpx;
        height: 56rpx;
        position: absolute;
        right: 20rpx;
        top: 40rpx;
    }

    .title {
        position: absolute;
        top: 90rpx;
        left: 0;
        width: 100%;
        font-weight: 800;
        font-size: 44rpx;
        text-shadow: 0px 2px 2px rgba(255, 255, 255, 0.25);
        text-align: center;
        background-image: linear-gradient(90deg, #4a6ee9 0%, #c171ff 100%);
        color: transparent;
        background-clip: text;
    }

    .text_con {
        position: absolute;
        top: 188rpx;
        left: 28rpx;
        width: 486rpx;
        height: 372rpx;
        border-radius: 20rpx;
        padding: 18rpx 0;

        .p {
            font-weight: 500;
            font-size: 32rpx;
            line-height: 51rpx;
        }

        .corr {
            color: #ff5070;
            font-weight: 700;
            font-size: 32rpx;
        }

        .p1 {
            margin: 28rpx 0 48rpx;
            width: 188rpx;

            .i_ico {
                width: 48rpx;
                height: 48rpx;
            }

            .i_name {
                font-size: 20rpx;
            }
        }

        .btn {
            width: 386rpx;
            height: 62rpx;
            text-align: center;
            line-height: 62rpx;
            background: #ff5070;
            border-radius: 40rpx;
            color: #fff;
            font-size: 28rpx;
        }
    }
}
</style>