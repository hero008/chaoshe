<template>
    <view class="my">
        <u-loading-page :loading="true" fontSize="15" iconSize="36" loadingMode="semicircle" loadingColor="#9064FF" color="#9064FF" bgColor="rgba(0,0,0,0)" />
    </view>
</template>
<script>
import { post } from "@/utils/api.js"
import { isMTVapp } from "../../utils/mgtv";
import { mapState } from "vuex";
let that;
export default {
    data() {
        return {
            inviteCode: uni.getStorageSync('inviteCode')
        };
    },
    created() {
        that = this
    },
    onShow() {
        let user = this.$gl("userInfo") || {};

       if(user.id){
        
        this.backtrack()
       }else{
         this.mgTvLogin()
       }
        // if(!user.id) this.wxlogin()
        // else this.backtrack()
    },
    computed: { ...mapState(["isMTVLogin"]) },
    methods: {
        mgTvLogin(){  
            if(!isMTVapp()){
                    post("v1/user/login", {
                        phone_num: '13888888888',
                        type: 0,
                        code: '260106',
                        login_platform: 0,
                        device_id: this.SystemInfo.deviceId,
                        invite_code: this.inviteCode,
                        channel_id:1,
                    }).then(res => {
                      if (res.code) {
                    uni.$u.toast(res.message);
                     } else {
                        uni.setStorageSync("aToken", res.accessToken)
                        uni.setStorageSync("rToken", res.refreshToken)
                        that.$store.commit('updateInfo', res)
                        that.backtrack()
                }
                    })
            }else{
                if(this.isMTVLogin){
                   post("v1/user/login", {
                        phone_num: '13888888888',
                        type: 0,
                        code: '260106',
                        login_platform: 0,
                        device_id: this.SystemInfo.deviceId,
                        invite_code: this.inviteCode,
                        channel_id:1,
                    }).then(res => {
                      if (res.code) {
                    uni.$u.toast(res.message);
                     } else {
                        uni.setStorageSync("aToken", res.accessToken)
                        uni.setStorageSync("rToken", res.refreshToken)
                        that.$store.commit('updateInfo', res)
                        that.backtrack()
                }
                    })
                }else{
                    this.backtrack()
                }
            }    
       
        },
        backtrack(){
            let routes = uni.$u.pages();
            let rout = uni.$u.deepClone(routes).reverse();
            for (const i of rout) {
                if (i.route !== "pages/my/loading") {
                    uni.reLaunch({ url: i.$page.fullPath });
                    return;
                }
            }
              uni.reLaunch({ url: "/pages/index/index" });
        },
        wxlogin(){
            
            // #ifdef MP-WEIXIN
            uni.login({
                provider: 'weixin',

                success(loginRes) {
                    post("v1/user/login", {
                        type: 2,
                        code: loginRes.code,
                        login_platform: 0,
                        device_id: that.SystemInfo.deviceId,
                        invite_code: that.inviteCode,
                        channel_id:1,
                    }).then(res => {
                        uni.setStorageSync("aToken", res.accessToken)
                        uni.setStorageSync("rToken", res.refreshToken)
                        that.$store.commit('updateInfo', res)
                        that.backtrack()
                    })
                }
            });
            // #endif
            // #ifndef MP-WEIXIN
            this.backtrack()
            // #endif
        }
    },
};
</script>
<style lang='scss' scoped>
  .my {
    width: 100vw;
    height: 100vh;
    position: relative;
    background: linear-gradient(104deg, #E1D6F8 0%, #F8E7ED 100%);
    overflow-y: auto;

    &::before {
        content: "";
        width: 100vw;
        height: calc(100vh - 212rpx);
        position: absolute;
        left: 0;
        top: 212rpx;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #F0F0F0 50%);
    }
}
</style>