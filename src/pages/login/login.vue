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
            <!-- #ifndef MP-WEIXIN -->
            <template v-if="isAppWechat">
                <image
                    @click="gateBack"
                    class="img_close"
                    :style="{ top: padTop }"
                    src="@/static/login/group_close.png"
                ></image>
                <wButton
                    text="进入微信绑定账户"
                    :rotate="isRotate"
                    @click="WeChatlogin"
                    class="get_PhoneNum"
                />
            </template>
            <template v-else>
                <!-- 主体表单 -->
                <view class="main">
                    <wInput
                        v-model="phoneData"
                        type="number"
                        maxlength="11"
                        placeholder="请输入手机号"
                        isShowSection
                    ></wInput>
                    <wInput
                        v-model="verCode"
                        type="number"
                        maxlength="6"
                        placeholder="请输入验证码"
                        isShowCode
                        codeText="发送验证码"
                        ref="runCode"
                        @setCode="getVerCode()"
                    ></wInput>
                    <wButton
                        text="立即登录"
                        :bgColor="isinpu ? '#FFEA2B' : '#7E55E3'"
                        :fontColor="isinpu ? '#414852' : '#fff'"
                        :rotate="isRotate"
                        @click="startLogin"
                    ></wButton>
                </view>
                <!-- 其他登录 -->
                <view class="other_login">
                    <view class="login_icon" @click="login_one">
                        <image src="@/static/login/phone.png"></image>
                        <view class="login_name">一键登录</view>
                    </view>
                    <view class="login_icon" @click="login_weixin">
                        <image src="@/static/login/weixin.png"></image>
                        <view class="login_name">微信登录</view>
                    </view>
                </view>
            </template>
            <!-- #endif -->
            <!-- #ifdef MP-WEIXIN -->
            <!-- 微信小程序登录 -->
            <template v-if="!showAgree">
                <view class="main">
                    <wInput
                        v-model="phoneData"
                        type="number"
                        maxlength="11"
                        placeholder="请输入手机号"
                        isShowSection
                    ></wInput>
                    <wInput
                        v-model="verCode"
                        type="number"
                        maxlength="6"
                        placeholder="请输入验证码"
                        isShowCode
                        codeText="发送验证码"
                        ref="runCode"
                        @setCode="getVerCode()"
                    ></wInput>
                    <wButton
                        text="立即登录"
                        :bgColor="isinpu ? '#FFEA2B' : '#7E55E3'"
                        :fontColor="isinpu ? '#414852' : '#fff'"
                        :rotate="isRotate"
                        @click="startLogin"
                    ></wButton>
                </view>
                <wButton
                    text="一键微信登录"
                    :rotate="isRotate"
                    @click="unagreement"
                    class="get_PhoneNumwx"
                />
            </template>
            <template v-else>
                <wButton
                    text="一键登录"
                    :rotate="isRotate"
                    v-if="loginInfo.id"
                    @click="weixinlogin"
                    class="get_PhoneNum"
                />
                <wButton
                    text="微信授权登录"
                    :rotate="isRotate"
                    v-else
                    openType="getPhoneNumber"
                    @getphonenumber="getPhoneNumber"
                    class="get_PhoneNum"
                />
            </template>

            <!-- #endif -->
            <!-- 底部信息 -->
            <view class="footer">
                <view @tap="isShowAgree" class="flex_r flex_ac">
                    <div :class="['agree_ico', { active: showAgree }]"></div>
                    <text style="margin-left: 8px">我已阅读并同意</text>
                </view>
                <!-- 协议地址 -->
                <navigator
                    url="/pages/common/rulepop?val=UserAgreement&urlData=pages/login/login"
                    open-type="navigate"
                    >《用户协议》</navigator
                >
                <navigator
                    url="/pages/common/rulepop?val=PrivacyClause&urlData=pages/login/login"
                    open-type="navigate"
                    >《隐私政策》</navigator
                >
            </view>
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
// #endif


import wButton from "@/components/watch-login/watch-button.vue"; //button
import wInput from "@/components/watch-login/watch-input.vue"; //input
import aliLoginConfig from "@/utils/aliLoginConfig.js";
import { post } from "@/utils/api.js";
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
            remindYoushow: false,
            loginName: "",
            appType: 1,
        };
    },
    components: {
        // #ifndef MP-WEIXIN
        
        // #endif
        wInput,
        wButton,
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
        let inviteCode = uni.getStorageSync("inviteCode");
        that = this;
        // #ifdef MP-WEIXIN
        uni.login({
            provider: "weixin", //使用微信登录
            success(loginRes) {
                post("v1/user/login", {
                    code: loginRes.code,
                    type: 2,
                    login_platform,
                    device_id: that.SystemInfo.deviceId,
                    invite_code: inviteCode,
                    channel_id: that.appType,
                }).then((res) => {
                    that.loginInfo = res;
                    this.loginName = "";
                });
            },
        });
        // #endif
    },
    onLoad(da) {
        // #ifndef MP-WEIXIN
        this.appType =
            getApp().globalData.AppTypeList[plus.runtime.channel] || 1;
        // #endif
        if (da.type == "wechat") this.isAppWechat = true;
        this.ju_platform();
    },
    methods: {
        onTipsVue(valse) {
            this.showAgree = valse;
            this.remindYoushow = false;
            if (!valse) return;
            if (this.loginName == "xcx") this.weixinlogin();
            else if (this.loginName == "wx") this.WeChatlogin();
            else this.startLogin();
            this.loginName = "";
            this.remindYoushow = false;
        },
        ju_platform() {
            uni.getSystemInfo({
                success(res) {
                    if (res.uniPlatform == "app") {
                        if (res.osName == "ios") {
                            login_platform = 2;
                        } else {
                            login_platform = 1;
                        }
                    } else {
                        login_platform = 0;
                    }
                },
            });
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
                    // setTimeout(function() {
                    //     this.$refs.runCode.$emit('runCode', 0); //假装模拟下需要 终止倒计时
                    // }, 6 * 1000)
                }
            });
        },
        startLogin() {
            //登录
            //判断是否加载中，避免重复点击请求
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
                invite_code: that.inviteCode,
                channel_id: this.appType,
            }).then((res) => {
                // 存在code码，则表示登录错误

                if (res.code) {
                    uni.$u.toast(res.message);
                } else {
                    this.goBackf(res);
                }
                setTimeout(() => {
                    this.isRotate = false;
                }, 1000);
                this.loginName = "";
            });
        },
        login_one() {
            //一键登录
            uni.showLoading({ title: "加载中" });
            setTimeout(() => {
                uni.hideLoading();
            }, 1600);
            aLiSDKModule.getLoginToken(
                5000,
                aliLoginConfig,
                (tokenResult) => {
                    // console.log("--", tokenResult);
                    if ("600004" == tokenResult.resultCode) {
                        uni.$u.toast("请插入手机SIM卡");
                        aLiSDKModule.quitLoginPage();
                    } else if ("600001" == tokenResult.resultCode) {
                        // console.log("授权页拉起成功");
                    } else if ("600000" == tokenResult.resultCode) {
                        post("v1/user/login", {
                            access_token: tokenResult.token,
                            type: 4,
                            login_platform,
                            device_id: that.SystemInfo.deviceId,
                            invite_code: that.inviteCode,
                            channel_id: this.appType,
                        }).then((res) => {
                            if (!res.code) {
                                that.goBackf(res);
                            }
                            aLiSDKModule.quitLoginPage(); //手动关闭授权页
                            this.loginName = "";
                        });
                    } else {
                        uni.$u.toast(
                            tokenResult.msg
                                ? tokenResult.msg
                                : "请检查蜂窝网络是否正常！"
                        );
                        aLiSDKModule.quitLoginPage();
                    }
                },
                (clickResult) => {
                    if (clickResult.resultCode == "700000")
                        aLiSDKModule.quitLoginPage();
                },
                (customUiResult) => {}
            );
        },
        login_weixin() {
            //微信登录
            this.goto("/pages/login/login", { type: "wechat" });
        },
        unagreement() {
            // uni.$u.toast("请同意并阅读协议");
            this.remindYoushow = true;
            this.loginName = "xcx";
        },
        weixinlogin() {
            this.isRotate = true;
            this.goBackf(this.loginInfo);
        },
        getPhoneNumber(e) {
            if (e.detail.errMsg == "getPhoneNumber:ok") {
                this.isRotate = true;
                let code = e.detail.code;
                post("v1/user/login", {
                    code,
                    type: 3,
                    login_platform,
                    device_id: that.SystemInfo.deviceId,
                    invite_code: that.inviteCode,
                    channel_id: this.appType,
                }).then((res2) => {
                    if (res2.code) {
                        uni.$u.toast(res2.message);
                    } else {
                        uni.setStorageSync("aToken", res2.accessToken);
                        uni.login({
                            provider: "weixin", //使用微信登录
                            success: function (Res) {
                                post("v1/user/bind/wechat", {
                                    code: Res.code,
                                    type: 2,
                                }).then((res) => {
                                    that.goBackf(res2, 500);
                                });
                            },
                        });
                    }
                    this.loginName = "";
                });
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
            uni.setStorageSync("currentChange", 2);
            uni.reLaunch({
                url: "/pages/index/index",
            });
        },
        WeChatlogin() {
            //判断是否加载中，避免重复点击请求
            this.loginName = "wx";
            if (this.isRotate) {
                return false;
            }
            if (!this.showAgree) {
                // uni.$u.toast("请同意并阅读协议");
                this.remindYoushow = true;
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
                                    channel_id: that.appType,
                                }).then((res) => {
                                    // console.log("--WeChat login--", res);
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
                                    this.loginName = "";
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