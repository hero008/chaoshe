<template>
    <view class="_showModal" v-show="show">
        <view class="_shade"></view>
        <view class="_modalBox">
            <div class="ipopup_con">
                <view @click.stop="clickBtn('cancel')" class="close"></view>
                <img src="https://img.chaoshewang.com/static/img/market/Group_title.png" class="Group_title">
                <view class="content">
                    <div class="title">{{ title }}</div>
                    <div class="text_con" v-html="content"></div>
                    <view class="hint">{{ hint }}</view>
                    <view class="x-btn flex_r flex_ac flex_jc" @click.stop="clickBtn('confirm')">
                        <div class="btn-bor">{{ confirmText }}</div>
                    </view>
                </view>
            </div>
        </view>
    </view>
</template>
<script>
export default {
    name: "show-modal",
    computed: {
        show() {
            return this.$modalStore.state.show;
        },
        title() {
            return this.$modalStore.state.title;
        },
        content() {
            return this.$modalStore.state.content;
        },
        showCancel() {
            return this.$modalStore.state.showCancel;
        },
        hint() {
            return this.$modalStore.state.hint;
        },
        cancelText() {
            return this.$modalStore.state.cancelText;
        },
        cancelColor() {
            return this.$modalStore.state.cancelColor;
        },
        cancelBackgroundColor() {
            return this.$modalStore.state.cancelBackgroundColor;
        },
        confirmText() {
            return this.$modalStore.state.confirmText;
        },
        confirmColor() {
            return this.$modalStore.state.confirmColor;
        },
        confirmBackgroundColor() {
            return this.$modalStore.state.confirmBackgroundColor;
        }
    },
    methods: {
        closeModal() {
            this.$modalStore.commit('hideModal')
        },
        clickBtn(res) {
            this.$modalStore.commit('hideModal')
            this.$modalStore.commit('success', res)
        }
    },
    beforeDestroy() {
        this.$modalStore.commit('hideModal')
    },
    data() {
        return {

        };
    }
}
</script>
<style lang="scss" scoped>
._showModal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;

    ._shade {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: #000;
        opacity: .6;
        z-index: 11000;
    }

    ._modalBox {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 12000;
        display: flex;
        justify-content: center;
        align-items: center;
    }

}

.ipopup_con {
    width: 542rpx;
    position: relative;
    margin: auto;

    .Group_title {
        width: 100%;
        height: 220rpx;
        display: block;
    }

    .content {
        width: 100%;
        background: linear-gradient(180deg, #BEC4FC 0%, #FFFFFF 100%);
        border-radius: 0rpx 0rpx 36rpx 36rpx;
        padding-bottom: 40rpx;
        margin-top: -20rpx;
        position: relative;
        z-index: 1;

        .title {
            width: 100%;
            font-weight: 800;
            font-size: 44rpx;
            text-shadow: 0px 2px 2px rgba(255, 255, 255, 0.25);
            text-align: center;
            background-image: linear-gradient(90deg, #4A6EE9 0%, #C171FF 100%);
            color: transparent;
            background-clip: text;
            padding-top: 10rpx;
        }

        .text_con {
            width: 488rpx;
            margin: 48rpx auto;
            padding: 44rpx 0;
            border-radius: 20rpx;
            font-weight: 500;
            font-size: 32rpx;
            background: rgba(255, 255, 255, 0.4);
            border: 2rpx solid rgba(255, 255, 255, 0.8);
            min-height: 60rpx;
            text-align: center;
            line-height: 1.6;
        }

        .hint {
            font-weight: 500;
            font-size: 24rpx;
            color: #F23A13;
            text-align: center;
            padding: 0 30rpx;
        }

        .x-btn {
            width: 246rpx;
            height: 82rpx;
            border-radius: 40rpx;
            background: rgba(145, 129, 229, 0.4);
            box-shadow: 0rpx 4rpx 10rpx 4rpx rgba(145, 129, 229, 0.2);
            margin: 40rpx auto 0;
            cursor: pointer;

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
                background: linear-gradient(180deg, #9181E5 0%, #5A45C8 100%);
                box-shadow: inset 0rpx 4rpx 4rpx 0rpx rgba(255, 255, 255, 0.25);
            }
        }
    }

    .close {
        width: 56rpx;
        height: 56rpx;
        position: absolute;
        right: 20rpx;
        top: 118rpx;
    }



}
</style>