<template>
    <view class="dialog-container" v-if="isShow" @touchmove.stop.prevent="moveHandle">
        <view class="dialog-content">
            <view class="dialog-title">
                {{title}}
            </view>
            <view class="dialog-text" v-if="type==1">
                {{desc1}}
                <text style="color: #314ad9;" @tap="toOpenPrivacyContract">{{name}}</text>
            </view>
            <template v-if="type==2">
                <view class="dialog-text">
                    <view class='no-authorize_title'>为提更供优质的服务，需要获取以下信息</view>
                    <view class='no-authorize_text'>· 获得你微信绑定的手机号码</view>
                </view>
                <view class="dialog-text">
                    <span>{{desc1}}</span>
                    <navigator url="/pages/common/rulepop?val=UserAgreement" open-type="navigate">《用户协议》</navigator>
                    <navigator url="/pages/common/rulepop?val=PrivacyClause" open-type="navigate">《隐私政策》</navigator>
                </view>
            </template>
            <view class="dialog-text" v-if="type==3">
                {{desc1}}
                <text style="color: #314ad9;" @click=" goto('/pages/common/rulepop', {val: 'MarketAgreement',})">《集市服务协议》</text>
            </view>
            <view class="dialog-tip">
                {{desc2}}
            </view>
            <view class="dialog-button-box">
                <button class="dialog-button" @tap="close">拒绝</button>
                <button v-if="type==1" class="dialog-button primary" hover-class="hover-class" id="agree-btn" open-type="agreePrivacyAuthorization" @agreeprivacyauthorization="handleAgreePrivacyAuthorization">同意</button>
                <button v-if="type==2" class="dialog-button primary" hover-class="hover-class" id="agree-btn" openType="getPhoneNumber" @getphonenumber="getPhoneNumber">同意</button>
                <button v-if="type==3" class="dialog-button primary" hover-class="hover-class" id="agree-btn" open-type="getJIShi" @click="suclose">同意</button>
            </view>
        </view>
    </view>
</template>
<script>
import { post } from "@/utils/api.js"
export default {
    name: "mp-privacy",
    props: {
        title: { // 标题
            type: String,
            default: '用户隐私保护提示'
        },
        initiative: { // 是否主动弹出授权窗口
            type: Boolean,
            default: false
        },
        isCover: { // 控制是否覆盖tabBar，必须配置tabBar后使用，请按需设置
            type: Boolean,
            default: false
        },
        type: { // 授权类型
            type: String,
            default: '1'
        },
    },
    data() {
        return {
            isShow: false,
            desc1: '您使用本服务前应当阅读并同意',
            name: '《用户隐私保护指引》',
            desc2: '当您点击同意并开始使用此服务时，即表示你已理解并同息该条款内容，该条款将对您产生法律约束力。如您拒绝，将无法使用该服务。',
            inviteCode: uni.getStorageSync('inviteCode')
        };
    },
    created() {
        if (this.type == 1) {
            if (wx.onNeedPrivacyAuthorization) {
                wx.getPrivacySetting({
                    success: res => {
                        this.name = res.privacyContractName
                        if (this.initiative) {
                            this.isShow = res.needAuthorization
                            if (this.isShow) this.isCover && uni.hideTabBar()
                        }
                    }
                })
                wx.onNeedPrivacyAuthorization(resolve => {
                    this.resolvePrivacyAuthorization = resolve
                    this.isShow = true
                    this.isCover && uni.hideTabBar()
                })
                // 同意隐私政策后设置标志
                this.handleAgreePrivacy = () => {
                    if (this.resolvePrivacyAuthorization) {
                        this.resolvePrivacyAuthorization({ buttonId: 'agree' })
                        uni.setStorageSync('privacy_agreed', true);
                        this.isShow = false;
                        this.isCover && uni.showTabBar();
                    }
                }
            }
        }
        if (this.type == 2) {
            this.desc1 = "您使用本服务前应当阅读并同意"
        }
    },
    methods: {
        moveHandle() {},
        getPhoneNumber(e) {
            if (e.detail.errMsg == 'getPhoneNumber:ok') {
                let code = e.detail.code;
                post("v1/user/login", {
                    code, type: 3,
                    device_id: this.SystemInfo.deviceId,
                    login_platform: 0,
                    invite_code: this.inviteCode,
                    channel_id:1,
                }).then(res => {
                    if (res.code) {
                        uni.$u.toast(res.message)
                    } else {
                        uni.setStorageSync("aToken", res.accessToken)
                        uni.setStorageSync("rToken", res.refreshToken)
                        this.$store.commit('updateInfo', res);
                        this.suclose()
                    }
                })
            } else if (e.detail.errMsg === 'getPhoneNumber:fail user deny') { //拒绝授权
                uni.$u.toast('您拒绝了授权')
            }
        },
        handleAgreePrivacyAuthorization() {
            // 用户点击同意按钮后
            if (this.resolvePrivacyAuthorization) {
                this.resolvePrivacyAuthorization({
                    buttonId: 'agree-btn',
                    event: 'agree'
                })
            }
            this.suclose()
        },
        toOpenPrivacyContract() {
            wx.openPrivacyContract({
                success: () => {},
                fail: () => {},
                complete: () => {}
            })
        },
        open() {
            this.isShow = true
        },
        suclose() {
            this.$emit('authChange', true);
            this.isShow = false
            this.isCover && uni.showTabBar()
        },
        close() {
             this.$emit('authChange', false);
            this.isShow = false
            this.isCover && uni.showTabBar()
        }
    }
}
</script>
<style lang="scss" scoped>
.dialog-container {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.42);
    left: 0;
    top: 0;
    z-index: 999;

    .dialog-content {
        padding: 60rpx 40rpx;
        font-size: 32rpx;
        color: #2D3038;
        background-color: #fff;
        position: absolute;
        width: 100%;
        min-height: 200rpx;
        bottom: 0;
        box-sizing: border-box;

        .dialog-title {
            text-align: center;
            font-size: 36rpx;
            font-weight: 600;
        }

        .dialog-text {
            display: block;
            padding: 40rpx;
            padding-bottom: 20rpx;
            font-size: 30rpx;

            navigator {
                display: inline-block;
                color: $motif-color;
            }
        }

        .no-authorize_title {
            font-size: 30rpx;
            font-weight: 500;
            color: #121212;
            line-height: 1.5;
            padding-bottom: 12rpx;
            // text-align: center;
        }

        .no-authorize_text {
            font-size: 26rpx;
            color: #999;
            line-height: 1.6;
            // text-align: center;
        }

        .dialog-tip {
            padding: 40rpx;
            padding-top: 0;
            font-size: 26rpx;
            color: #848484;
        }

        .dialog-button-box {
            padding: 0 40rpx;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
        }

        .dialog-button {
            margin: 0;
            width: 240rpx;
            height: 80rpx;
            line-height: 80rpx;
            font-size: 28rpx;

            &.primary {
                color: #ffffff;
                background-color: #00d354;
            }

            &.hover-class {
                background-color: #00b344;
            }
        }
    }
}
</style>