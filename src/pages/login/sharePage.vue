<template>
    <view>
        <view class="login">
            <image
                @click="onClickClose"
                class="img_close"
                :style="{ top: padTop }"
                src="@/static/login/group_close.png"
            ></image>
            <!-- 头部logo -->
            <view class="header">
                <image src="@/static/login/logo.png"></image>
                <view class="c_text">正品潮玩抽赏娱乐平台</view>
            </view>
            <!-- #ifdef MP-WEIXIN -->
            <!-- #endif -->
            <!-- 微信小程序登录 -->
            <template>
                <view class="main" v-if="!otherPhone">
                    <wInput
                        v-model="inviteCode"
                        type="text"
                        placeholder="请输入邀请码（非必填）"
                        @input="getInviteCode"
                    ></wInput>
                    <wButton
                        text=" 本机号码一键注册"
                        bgColor="#FFEA2B"
                        fontColor="#414852"
                        :rotate="isRotate"
                        openType="getPhoneNumber"
                        @getphonenumber="getPhoneNumber"
                    ></wButton>
                    <view style="height: 40rpx"></view>
                    <wButton
                        text="其它号码一键注册"
                        bgColor="#ffffff"
                        fontColor="#9064FF"
                        @click="otherPhone = true"
                    ></wButton>
                </view>
                <view class="main" v-else>
                    <wInput
                        v-model="phoneData"
                        type="number"
                        maxlength="11"
                        placeholder="请输入手机号"
                        isShowSection="true"
                    ></wInput>
                    <wInput
                        v-model="verCode"
                        type="number"
                        maxlength="6"
                        placeholder="请输入验证码"
                        isShowCode="true"
                        codeText="发送验证码"
                        ref="runCode"
                        @setCode="getVerCode()"
                    ></wInput>
                    <wButton
                        text="一键注册"
                        bgColor="#FFEA2B"
                        fontColor="#414852"
                        :rotate="isRotate"
                        @click="startLogin"
                    ></wButton>
                </view>
            </template>
            <view class="footer">
                <view @tap="isShowAgree" class="flex_r flex_ac">
                    <div :class="['agree_ico', { active: showAgree }]"></div>
                    <text style="margin-left: 8px">我已阅读并同意</text>
                </view>
                <!-- 协议地址 -->
                <navigator
                    url="/pages/common/rulepop?val=UserAgreement"
                    open-type="navigate"
                    >《用户协议》</navigator
                >
                <navigator
                    url="/pages/common/rulepop?val=PrivacyClause"
                    open-type="navigate"
                    >《隐私政策》</navigator
                >
            </view>
            <view class="QRShow" v-if="QrShow && deviceInfo == 'iOS'">
                <image
                    @click="onModal"
                    class="close"
                    :style="{ top: padTop }"
                    src="https://img.chaoshewang.com/static/img/niudan/ndj_back.png"
                ></image>
                <image
                    class="ios"
                    mode="aspectFit"
                    show-menu-by-longpress="true"
                    src="https://img.chaoshewang.com/matt/static/img/index/ios_QR.png"
                />
                <view class="ts">长按保存图片微信识别二维码下载潮社APP</view>
            </view>
            <x-modal :visible.sync="downShow" :text="1" @onModal="onModal" />
        </view>
        <xTipsVue
            @tipsVue="onTipsVue"
            :visible="remindYoushow"
            :deal="[
                { text: 'UserAgreement', name: '用户协议' },
                { text: 'PrivacyClause', name: '隐私政策' },
            ]"
            next="登录"
        />
    </view>
</template>
<script>
// #ifdef APP-PLUS
const aLiSDKModule = uni.requireNativePlugin("AliCloud-NirvanaPns");
// #endif
// #ifdef APP
let AppType = getApp().globalData.AppTypeList[plus.runtime.channel] || 1;
let cipherUrl =
    AppType == 1
        ? "0kwFuq2TddzelmIViIhzZzpBExpcpBF1M6EvnqGeaEmG8y3iSFb9ezh8KV7Z9GW/dn3cSDvPweE4W0v0vQy/5CnmZbsW57vZE9R4lp4D8RtEJZFoxZxB1uoIDg668UhAaO+XToEDoyTA8YpRfAoHZDqCnJBlyByn56h9qM2aZxC+GrH2KTsSiZFLTSvP71aI+ppOKyRWr3CZ1bqPVSUk/+42pMW8AEvB/fE+Mhy8TH6ZcBrrBZSnztrV43/vA+lPaWBvuCYbpqaEFp7phkJkRxaowqp3yIbnnTezw31FyAHRooCevRSryQ=="
        : "eg7bzGNgbQN/zBcXVt/ErcK5JYZA+JlTV6r/1gsC5xeL69p/+MltawzNMCnuuzhq7CN5c55H0sWXhd83NOCpqcOFSSawtg2dmdN3Lu5wlo9uk158YpZLosRXC5S0RgunlysIcvS94c5TyGSLOd/luJCBtoD9FODX+UroRZBK/sg4cVElPzLZxqW7n05zBcRq/20TsnJ2QqCNR00OxhxfOisYgcKoyd+SlP/9TS0BiHv4cEsLYajpFOkKloxRLQjTmgQ0H/4ySz8Yzppua7JjYeQG7R7otpCb3dGNJJZWzcM=";
aLiSDKModule.setAuthSDKInfo(cipherUrl);
// #endif
// #ifdef APP-IOS
aLiSDKModule.setAuthSDKInfo(
    "91lSlq8ZN+VgtSCyL/Lh3rAAkrUr6BlLlIJ+JWF+YOZf9IYTRqxA6mxMGDV6ezCqM3ihjwYJSRMnn8A1Dj1X70HPH74zKoCvNY+6eGzJbXidzvVCUcd6bCTw7FXUtj27g4Yjf56TY5CdPXyD+70qofSQLfhSdx5SOj64Y8NM60HIK19UfYg8nTVaNvX/aoSPcbICnbx8mwvo03tlo63ee6pyLqi9zJUNlpqUSvP96pBUx3gDpIrKtsW+civGwehLvfIQqWToG8g="
);
// #endif
// #ifdef APP-PLUS
aLiSDKModule.accelerateLoginPage(5000, (result) => {});
// #endif
// #ifndef MP-WEIXIN
// import wInput from "@/components/watch-login/watch-input.vue"; //input
// #endif
import wInput from "@/components/watch-login/watch-input.vue"; //input
import wButton from "@/components/watch-login/watch-button.vue"; //button
import { post } from "@/utils/api.js";
import xModal from "@/components/modules/x-modal";
import xTipsVue from "@/components/modules/x-tips.vue";
let login_platform = 0,
    that;
export default {
    data() {
        return {
            phoneData: undefined, //用户/电话
            verCode: undefined, //验证码
            showAgree: false, //协议是否选择
            isRotate: false, //是否加载旋转
            isFocus: true, //是否聚焦
            loginInfo: {},
            isAppWechat: false,
            inviteCode: uni.getStorageSync("inviteCode"),
            otherPhone: false, //输入手机号登入
            remindYoushow: false,
            QrShow: false,
            qrCodeUrl:
                "https://img.chaoshewang.com/static/img/niudan/ndj_back.png",
            deviceInfo: null,
            downShow: false,
        };
    },
    components: {
        // #ifndef MP-WEIXIN
        // wInput,
        // #endif
        wButton,
        wInput,
        xModal,
        xTipsVue,
    },
    computed: {
        isinpu() {
            if (!this.phoneData || this.phoneData.length != 11) return false;
            // if (!uni.$u.test.mobile(this.phoneData)) return false
            if (!uni.$u.test.code(this.verCode, 6)) return false;
            return true;
        },
        padTop() {
            let da = this.MBInfo();
            return da.top + da.height + "px";
        },
    },
    created() {
        that = this;
    },
    mounted() {
        this.inviteCode = uni.getStorageSync("inviteCode");
    },
    onLoad(da) {
        if (da.type == "wechat") this.isAppWechat = true;
        this.ju_platform();
        const q = da.scene ? decodeURIComponent(da.scene) : ""; // 获取到二维码原始链接内容
        if (q) {
            let a = q.split("=");
            uni.setStorageSync("inviteCode", a[1] || a[0]);
            setTimeout(() => {
                this.inviteCode = uni.getStorageSync("inviteCode");
            }, 500);
        }
    },
    methods: {
        onModal() {
            uni.reLaunch({ url: "/pages/index/index" });
            this.downShow = false;
            this.QrShow = false;
            this.otherPhone = false;
        },
        onTipsVue(valse) {
            this.showAgree = valse;
            this.remindYoushow = false;
            if (!valse) return;
            this.startLogin();
        },
        ju_platform() {
            const deviceInfo1 = wx.getDeviceInfo();
            this.deviceInfo = deviceInfo1.system.slice(0, 3);
        },
        isShowAgree() {
            //是否选择协议
            this.showAgree = !this.showAgree;
        },
        getVerCode() {
            //获取验证码
            // if (!uni.$u.test.mobile(this.phoneData)) { // 标准的手机号校验
            if (!this.phoneData || this.phoneData.length != 11) {
                // 开放888开头号段
                uni.$u.toast("请输入正确的手机号");
                return false;
            }
            post("v1/captcha/send", {
                phone_num: this.phoneData,
                type: 1,
            }).then((res) => {
                if (res.code) {
                    uni.$u.toast(res.message);
                } else {
                    uni.$u.toast("验证码已发送");
                    this.$refs.runCode.$emit("runCode"); //触发倒计时（一般用于请求成功验证码后调用）
                }
            });
        },
        getInviteCode(e) {
            uni.setStorageSync("inviteCode", e);
        },
        // 一键注册
        startLogin() {
            //判断是否加载中，避免重复点击请求
            let inviteCode = uni.getStorageSync("inviteCode");
            if (this.isRotate) {
                return false;
            }
            if (!this.phoneData || this.phoneData.length == "") {
                uni.$u.toast("手机号不能为空");
                return;
            }
            if (!this.verCode || this.verCode.length < 6) {
                uni.$u.toast("验证码不正确");
                return;
            }
            if (!this.showAgree) {
                // uni.$u.toast("请同意并阅读协议");
                this.remindYoushow = true;
                return;
            }
            // if (!inviteCode) {
            //     uni.$u.toast("绑定失败，请退出重新获取好友链接");
            //     return;
            // }
            // 获取网络类型（4G,5G,wifi,none[无网络]）
            setTimeout(() => {
                let that = this;
                uni.getNetworkType({
                    success: function (res) {
                        if (res.networkType == "none") that.noneNetwork();
                    },
                });
            }, 1000);
            this.isRotate = true;
            post("v1/user/login", {
                phone_num: this.phoneData,
                code: this.verCode,
                type: 0,
                login_platform,
                device_id: that.SystemInfo.deviceId,
                invite_code: inviteCode,
                channel_id:1,
            }).then((res) => {
                // 存在code码，则表示登录错误
                if (res.code) {
                    uni.$u.toast(res.message);
                } else {
                    if (res.isNew&&res.isInvite||res.isRecall)  uni.$u.toast("关系绑定成功");
                    if (this.deviceInfo == "iOS") {
                        setTimeout(() => {  
                            this.QrShow = true;
                        }, 500);
                    } else {
                        this.downShow = true;
                    }
                }
                setTimeout(() => {
                    this.isRotate = false;
                }, 500);
            });
        },
        getPhoneNumber(e) {
            let inviteCode = uni.getStorageSync("inviteCode");
            // if (!inviteCode) {
            //     uni.$u.toast("绑定失败，请退出重新获取好友链接");
            //     return;
            // }
            if (e.detail.errMsg == "getPhoneNumber:ok") {
                this.isRotate = true;
                let code = e.detail.code;
                post("v1/user/login", {
                    code,
                    type: 7,
                    login_platform,
                    device_id: that.SystemInfo.deviceId,
                    invite_code: inviteCode,
                    channel_id:1,
                }).then((res) => {
                       if (res.code) {
                    uni.$u.toast(res.message);
                } else {
                    if (res.isNew&&res.isInvite||res.isRecall)  uni.$u.toast("关系绑定成功");
                    if (this.deviceInfo == "iOS") {
                        setTimeout(() => {  
                            this.QrShow = true;
                        }, 500);
                    } else {
                        this.downShow = true;
                    }
                }
                });
                setTimeout(() => {
                    this.isRotate = false;
                }, 500);
            } else if (e.detail.errMsg === "getPhoneNumber:fail user deny") {
                //拒绝授权
                uni.$u.toast("您拒绝了授权");
            }
        },
        goBackf(res, tim = 1000) {
            uni.setStorageSync("aToken", res.accessToken);
            uni.setStorageSync("rToken", res.refreshToken);
            this.$store.commit("updateInfo", res);
            setTimeout(() => {
                let routes = getCurrentPages();
                routes = routes.reverse();
                for (const i of routes) {
                    if (i.route !== "pages/login/login") {
                        uni.reLaunch({ url: i.$page.fullPath });
                        return;
                    }
                }
                uni.reLaunch({ url: "/pages/index/index" });
            }, tim);
        },
        onClickClose() {
            if (!this.otherPhone) {
                uni.reLaunch({ url: "/pages/index/index" });
            }
            this.otherPhone = false;
        },
        WeChatlogin() {
            //判断是否加载中，避免重复点击请求
            if (this.isRotate) {
                return false;
            }
            if (!this.showAgree) {
                uni.$u.toast("请同意并阅读协议");
                return;
            }

            uni.getProvider({
                service: "share",
                success(res) {
                    if (res.provider[0] == "weixin") {
                        this.isRotate = true;
                        uni.login({
                            provider: "weixin",
                            onlyAuthorize: true, // 微信登录仅请求授权认证
                            success: function (event) {
                                //客户端成功获取授权临时票据（code）,向业务服务器发起登录请求。
                                const { code } = event;
                                post("v1/user/login", {
                                    code,
                                    type: 1,
                                    login_platform,
                                    device_id: that.SystemInfo.deviceId,
                                    invite_code: that.inviteCode,
                                    channel_id:1,
                                }).then((res) => {
                                    console.log("--WeChat login--", res);
                                    if (res.code) uni.$u.toast(res.message);
                                    else {
                                        if (res.isGuest) {
                                            uni.setStorageSync(
                                                "aToken",
                                                res.accessToken
                                            );
                                            uni.setStorageSync(
                                                "rToken",
                                                res.refreshToken
                                            );
                                            that.$store.commit(
                                                "updateInfo",
                                                res
                                            );
                                            that.goto("/pages/login/binding");
                                        } else that.goBackf(res, 1000);
                                    }
                                    that.isRotate = false;
                                });
                            },
                            fail(err) {
                                that.isRotate = false;
                            },
                        });
                    } else {
                        uni.showToast({
                            title: `系统检测到您尚未安装微信！`,
                            icon: "none",
                            duration: 2000,
                        });
                        return;
                    }
                },
            });
        },
        noneNetwork() {
            uni.showModal({
                title: "系统提示",
                content: "当前设备无网络或网络较差",
                cancelText: "取消",
                confirmText: "确定",
                success: (res) => {
                    if (res.confirm) {
                        this.isRotate = false;
                        // plus.runtime.restart(); //重启
                    } else {
                        plus.os.name == "Android"
                            ? plus.runtime.quit()
                            : plus.ios
                                  .import("UIApplication")
                                  .sharedApplication()
                                  .performSelector("exit");
                    }
                },
            });
        },
    },
};
</script>
<style>
@import url("./css/main.css");
</style>
<style lang="scss" scoped>
.QRShow {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    background-color: #fff;
    z-index: 9999;
    .close {
        width: 48rpx;
        height: 48rpx;
        margin-left: 40rpx;
        margin-top: 110rpx;
    }
    .ts {
        position: absolute;
        font-weight: 800;
        font-size: 40rpx;
        color: #383228;
        bottom: 40%;
        white-space: nowrap;
        left: 50%;
        transform: translate(-50%);
    }
    .ios {
        position: absolute;
        left: 50%;
        top: 40%;
        transform: translate(-50%, -50%);
    }
}
.already {
    width: 560rpx;
    height: 64rpx;
    background: #ea4166;
    border-radius: 32rpx;
    border: 2rpx solid #ffffff;
    margin-top: 24rpx;
    padding: 0 32rpx;
    font-weight: 500;
    font-size: 24rpx;
    color: #ffffff;
    .number {
        font-weight: 800;
        font-size: 36rpx;
    }
    .cp {
        .cp_icon {
            width: 24rpx;
            height: 24rpx;
            background-image: url("https://img.chaoshewang.com/matt/static/img/index/cp_icon.png");
            background-size: 100% 100%;
            margin-right: 4rpx;
        }
    }
}
</style>
