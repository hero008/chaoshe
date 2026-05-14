<template>
    <view class="login">
        <image @click="onClickClose" class="img_close" :style="{top:padTop}" src="@/static/login/group_close.png"></image>
        <!-- 头部logo -->
        <view class="header">
            <view class="h_tit">绑定手机号</view>
            <view class="h_txt">为了您的账户安全，请绑定手机号</view>
        </view>
        <!-- 主体表单 -->
        <view class="main">
            <wInput v-model="phoneData" type="number" maxlength="11" placeholder="请输入手机号" isShowSection></wInput>
            <wInput v-model="verCode" type="number" maxlength="6" placeholder="请输入验证码" isShowCode codeText="发送验证码" ref="runCode" @setCode="getVerCode()"></wInput>
            <wButton text="绑定" :bgColor="isinpu?'#FFEA2B':'#7E55E3'" :fontColor="isinpu?'#414852':'#fff'" :rotate="isRotate" @click="startLogin"></wButton>
        </view>
    </view>
</template>
<script>
import { post } from "@/utils/api.js"
import wInput from '@/components/watch-login/watch-input.vue' //input
import wButton from '@/components/watch-login/watch-button.vue' //button
export default {
    data() {
        return {
            phoneData: undefined, //用户/电话
            verCode: undefined, //验证码
            isRotate: false, //是否加载旋转
        };
    },
    components: {wInput,wButton},
    computed: {
        isinpu() {
            if (!this.phoneData || this.phoneData.length != 11) return false
            // if (!uni.$u.test.mobile(this.phoneData)) return false
            if (!uni.$u.test.code(this.verCode, 6)) return false
            return true
        },
        padTop() {
            let da = this.MBInfo();
            return da.top + da.height + 'px'
        }
    },
    methods: {
        onClickClose() {
            uni.setStorageSync("currentChange", 2);
            uni.reLaunch({
                url: "/pages/index/index"
            });
        },
        getVerCode() { //获取验证码
            // if (!uni.$u.test.mobile(this.phoneData)) { // 标准的手机号校验
            if (!this.phoneData || this.phoneData.length != 11) { // 开放888开头号段
                uni.$u.toast("请输入正确的手机号")
                return false;
            }
            post("v1/captcha/send", { phone_num: this.phoneData, type: 2 }).then(res => {
                if (res.code) uni.$u.toast(res.message)
                else {
                    uni.$u.toast("验证码已发送")
                    this.$refs.runCode.$emit('runCode');
                }
            })

        },
        startLogin(){
            if (this.isRotate) {
                return false;
            }
            this.isRotate = true;
            post("v1/user/bind/phone", {
                phone_num: this.phoneData,
                captcha: this.verCode
            }).then(res => {
                if (res.code) uni.$u.toast(res.message)
                else this.goBackf(res);
                setTimeout(() => {
                    this.isRotate = false
                }, 1000);
            })
        },
        goBackf(res, tim = 1000) {
            uni.setStorageSync("aToken", res.accessToken)
            uni.setStorageSync("rToken", res.refreshToken)
            this.$store.commit('updateInfo', res);
            setTimeout(() => {
                let routes = getCurrentPages().reverse();
                let fil = ["pages/login/login","pages/login/binding"]
                for (const i of routes) {
                    if (!fil.includes(i.route)) {
                        uni.redirectTo({ url: i.$page.fullPath });
                        return;
                    }
                }
                uni.reLaunch({ url: "/pages/index/index" });
            }, tim);
        },
    },
};
</script>
<style>
@import url("./css/main.css");
.header{
    margin-bottom: 118rpx;
}
.h_tit{
    font-size: 48rpx;
    font-weight: 700;
    color: #FFFFFF;
}
.h_txt{
    line-height: 28rpx;
    color: #DFD2FF;
    margin-top: 36rpx;
}
</style>