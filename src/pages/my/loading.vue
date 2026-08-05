<template>
  <view class="my">
    <u-loading-page
      :loading="true"
      fontSize="15"
      iconSize="36"
      loadingMode="semicircle"
      loadingColor="#9064FF"
      color="#9064FF"
      loadingText="登录中..."
      bgColor="rgba(0,0,0,0)"
    />
    <u-modal
      @confirm="confirm"
      :show="show"
      :title="title"
      :content="content"
    ></u-modal>

    
    <view @click="toLogin" v-if="needLogin" class="loginBtn">
        登录
    </view>
  </view>
</template>
<script>
import { post } from "@/utils/api.js";
import { isMTVapp,shareUrl } from "../../utils/mgtv";

let that;
export default {
  data() {
    return {
      inviteCode: uni.getStorageSync("inviteCode"),
      show: false,
      title: "提示",
      content: "登录失败,请重试,体验更多内容吧",
      needLogin:false,
    };
  },
  created() {
    that = this;
  },
  onShow() {
    let user = this.$gl("userInfo") || {};

    if (user.id) {
      this.backtrack();
    } else {
      this.toLogin();
    }
    // if(!user.id) this.wxlogin()
    // else this.backtrack()
  },
  // computed: { ...mapState(["isMTVLogin"]) },
  methods: {
    toLogin() {
      if (!isMTVapp()) {
        let url = shareUrl;
          const params = new URLSearchParams(window.location.search);
         let gachaName = params && params.get("gachaName")|| '';
            let gachaId =  params && params.get("gachaId") || '';
             let channel = params && params.get("channel") || '';
               let inviteCode = params && params.get("inviteCode") || '';
             if(inviteCode){
              url= url+'&inviteCode='+inviteCode
             }
             if(channel){
              url= url+'&channel='+channel
             }
             if(gachaName && gachaId){
               url= url+'&gachaName='+gachaName+'&gachaId='+gachaId
             }
           window.location.href = `https://club.mgtv.com/act/download/index.html?schema=${encodeURIComponent(
          `imgotv://webview?url=${encodeURIComponent(url)}`,
        )}`;
        return;
      }

      if (window.MgtvApi) {
        MgtvApi.getUserInfo((user_info) => {
          console.log(user_info);
          if (user_info && user_info.length !== 0) {
            const userInfo = JSON.parse(user_info);
            if (userInfo.ticket && userInfo.uuid) {
                this.needLogin = false;
              let channel = uni.getStorageSync("channel");
              post("v1/user/login", {
                phone_num: "",
                type: 8,
                code: userInfo.ticket,
                login_platform: 0,
                device_id: this.SystemInfo.deviceId,
                invite_code: this.inviteCode,
                channel_id: channel ? channel : "Channel_Official",
                uuid: userInfo.uuid,
                nickname: userInfo.nickname,
                avatar_url: userInfo.avatar.l,
              }).then((res) => {
                if (res.code) {
                  uni.$u.toast(res.message);
                  this.show = true;
                  // that.backtrack();
                } else {
                  uni.setStorageSync("isNew", res.isNew);
                  uni.setStorageSync("aToken", res.accessToken);
                  uni.setStorageSync("rToken", res.refreshToken);
                  uni.setStorageSync("uuid", res.uuid);
                  that.$store.commit("updateInfo", res);
                  that.backtrack();
                }
              });
            } else {
              //登錄
              this.needLogin = true
              MgtvApi.login((res) => {
                console.log(res,'234823084230');
                // window.location.reload();
                this.toLogin()
              },(err)=>{
                console.log(err,'234234234234234')
              });
            }
          } else {
             this.needLogin = true
            //登錄
            MgtvApi.login(() => {
              // window.location.reload();
               this.toLogin()
            });
          }
        });
      }
      // if(window.mgtv){
      //     // this.webLogin();
      //     // return;
      //   this.loginMgtv((res)=>{

      //     //  let uuid = res.uuid;
      //     // let ticket = res.ticket;
      //     // let nickName = res.nickName;
      //     // let avatarUrl = res.avatarUrl;
      //     // this.webLogin();
      //     let channel = uni.getStorageSync('channel')

      //        post("v1/user/login", {
      //         phone_num: "",
      //         type: 8,
      //         code:res.ticket,
      //         login_platform: 0,
      //         device_id: this.SystemInfo.deviceId,
      //         invite_code: this.inviteCode,
      //         channel_id: channel ? channel : 'Channel_Official',
      //         uuid:res.uuid,
      //         nickname:res.nickName,
      //         avatar_url:res.avatarUrl
      //     }).then((res) => {
      //       console.log(res);
      //         if (res.code) {
      //         uni.$u.toast(res.message);
      //         this.show = true;
      //         // that.backtrack();
      //         } else {
      //         uni.setStorageSync('isNew',res.isNew);
      //         uni.setStorageSync("aToken", res.accessToken);
      //         uni.setStorageSync("rToken", res.refreshToken);
      //         uni.setStorageSync("uuid", res.uuid);
      //         that.$store.commit("updateInfo", res);
      //         that.backtrack();
      //         }
      //     });
      //        // 登录成功// 获取到res 的用户信息,在去登录
      //   },(err)=>{
      //     console.log('数据分类撒酒疯垃圾')
      //          //登录失败
      //         // uni.$u.toast('登录失败');
      //         // that.backtrack();
      //         this.show=true;
      //   });
      // }else{
      //     this.webLogin();
      //     // this.show=true
      // }
    },
    confirm() {
      let user = this.$gl("userInfo") || {};
      if (user.id) {
        this.backtrack();
      } else {
        this.toLogin();
      }
    },
 


    // 19999999995
    webLogin() {
      post("v1/user/login", {
        phone_num: "19999999999",
        type: 0,
        code: "260106",
        login_platform: 0,
        device_id: this.SystemInfo.deviceId,
        invite_code: this.inviteCode,
        channel_id: "Channel_Official",
      }).then((res) => {
        if (res.code) {
          // uni.$u.toast(res.message);
          // that.backtrack();
        } else {
          uni.setStorageSync("isNew", res.isNew);
          uni.setStorageSync("aToken", res.accessToken);
          uni.setStorageSync("rToken", res.refreshToken);
          that.$store.commit("updateInfo", res);
          that.backtrack();
        }
      });
    },

    mgTvLogin() {
      // 芒果登录 测试环境
      // 正式芒果登录
      // if(!isMTVapp()){
      //         post("v1/user/login", {
      //             phone_num: '13888888888',
      //             type: 0,
      //             code: '260106',
      //             login_platform: 0,
      //             device_id: this.SystemInfo.deviceId,
      //             invite_code: this.inviteCode,
      //             channel_id:1,
      //         }).then(res => {
      //           if (res.code) {
      //         uni.$u.toast(res.message);
      //          } else {
      //             uni.setStorageSync("aToken", res.accessToken)
      //             uni.setStorageSync("rToken", res.refreshToken)
      //             that.$store.commit('updateInfo', res)
      //             that.backtrack()
      //     }
      //         })
      // }else{
      //     if(this.isMTVLogin){
      //        post("v1/user/login", {
      //             phone_num: '13888888888',
      //             type: 0,
      //             code: '260106',
      //             login_platform: 0,
      //             device_id: this.SystemInfo.deviceId,
      //             invite_code: this.inviteCode,
      //             channel_id:1,
      //         }).then(res => {
      //           if (res.code) {
      //         uni.$u.toast(res.message);
      //          } else {
      //             uni.setStorageSync("aToken", res.accessToken)
      //             uni.setStorageSync("rToken", res.refreshToken)
      //             that.$store.commit('updateInfo', res)
      //             that.backtrack()
      //     }
      //         })
      //     }else{
      //         this.backtrack()
      //     }
      // }
    },
    backtrack() {
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
    wxlogin() {
      // #ifdef MP-WEIXIN
      uni.login({
        provider: "weixin",

        success(loginRes) {
          post("v1/user/login", {
            type: 2,
            code: loginRes.code,
            login_platform: 0,
            device_id: that.SystemInfo.deviceId,
            invite_code: that.inviteCode,
            channel_id: 1,
          }).then((res) => {
            uni.setStorageSync("aToken", res.accessToken);
            uni.setStorageSync("rToken", res.refreshToken);
            that.$store.commit("updateInfo", res);
            that.backtrack();
          });
        },
      });
      // #endif
      // #ifndef MP-WEIXIN
      this.backtrack();
      // #endif
    },
  },
};
</script>
<style lang="scss" scoped>
.my {
  width: 100vw;
  height: 100vh;
  position: relative;
  background: linear-gradient(104deg, #e1d6f8 0%, #f8e7ed 100%);
  overflow-y: auto;

  &::before {
    content: "";
    width: 100vw;
    height: calc(100vh - 212rpx);
    position: absolute;
    left: 0;
    top: 212rpx;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #f0f0f0 50%);
  }
}
.loginBtn{
  position: absolute;
  bottom: 80px;
  width: 686rpx;
  height: 80rpx;
  background: linear-gradient( 90deg, #31E597 0%, #40E0EA 100%);
  border-radius: 40rpx 40rpx 40rpx 40rpx;
  left: 50%;
  transform: translateX(-50%);
  color:#1A1A1A;
  font-size: 32rpx;
  font-weight: blod;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;

}
</style>
