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
    <u-modal @confirm="confirm" :show="show" :title="title" :content='content'></u-modal>
  </view>
</template>
<script>
import { post } from "@/utils/api.js";
import { isMTVapp } from "../../utils/mgtv";
import { mapState } from "vuex";
import { tr } from "@dcloudio/vue-cli-plugin-uni/packages/postcss/tags";
let that;
export default {
  data() {
    return {
      inviteCode: uni.getStorageSync("inviteCode"),
      show:false,
      title:'提示',
      content:'登录失败,请重试,体验更多内容吧',
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
        if(window.mgtv){
            // this.webLogin();
            // return;
          this.loginMgtv((res)=>{
            
            //  let uuid = res.uuid;
            // let ticket = res.ticket;
            // let nickName = res.nickName;
            // let avatarUrl = res.avatarUrl;
            // this.webLogin();

               post("v1/user/login", {
                phone_num: "",
                type: 8,
                code:res.ticket,
                login_platform: 0,
                device_id: this.SystemInfo.deviceId,
                invite_code: this.inviteCode,
                channel_id: 1,
                uuid:res.uuid,
                nickname:res.nickName,
                avatar_url:res.avatarUrl
            }).then((res) => {
              console.log(res);
                if (res.code) {
                uni.$u.toast(res.message);
                this.show = true;
                // that.backtrack();
                } else {
                uni.setStorageSync('isNew',res.isNew);
                uni.setStorageSync("aToken", res.accessToken);
                uni.setStorageSync("rToken", res.refreshToken);
                uni.setStorageSync("uuid", res.uuid);
                that.$store.commit("updateInfo", res);
                that.backtrack();
                }
            });
               // 登录成功// 获取到res 的用户信息,在去登录
          },(err)=>{
            console.log('数据分类撒酒疯垃圾')
                 //登录失败 
                // uni.$u.toast('登录失败');
                // that.backtrack();
                this.show=true;
          });
        }else{
            this.webLogin();
            // this.show=true
        }
      
    },
    confirm(){
      let user = this.$gl("userInfo") || {};
        if (user.id) {
          this.backtrack();
        } else {
          this.toLogin();
          
        }
    },
    loginMgtv(success_, fail_) {
      let isLogin = mgtv.isLogin();
      if (!isLogin) {
        mgtv.login({
          success(res) {
            that.getUserInfo(success_, fail_);
          },
          fail(res) {
            fail_ && fail_(res);
          },
        });
      } else {
        this.getUserInfo(success_, fail_);
      }
    },

    getUserInfo(success_, fail_) {
      mgtv.getSetting({
        success(res) {
          if (!res.authSetting["scope.userProfile"]) {
            mgtv.authorize({
              scope: "scope.userProfile",
              success() {
                console.log("授权成功");
                mgtv.getUserProfile({
                  success(res) {
                    console.log("getUserProfile success:", JSON.stringify(res));
                    //注意查看返回的值 res.data
                    success_ && success_(res.data);
                  },
                  fail(res) {
                    console.log(res)
                    fail_ && fail_(res);
                  },
                });
              },
              fail(res) {
                fail_ && fail_(res);
              },
            });
          } else {
            console.log("授权成功");
            mgtv.getUserProfile({
              success(res) {
                console.log("getUserProfile success:", JSON.stringify(res));
                //注意查看返回的值 res.data
                success_ && success_(res.data);
              },
              fail(res) {
                fail_ && fail_(res);
              },
            });
          }
        },
        fail(res) {
          fail_ && fail_(res);
        },
      });
    },
// 19999999995
    webLogin(){
        post("v1/user/login", {
                phone_num: "19999999996",
                type: 0,
                code: "260106",
                login_platform: 0,
                device_id: this.SystemInfo.deviceId,
                invite_code: this.inviteCode,
                channel_id: 1,
            }).then((res) => {
                if (res.code) {
                // uni.$u.toast(res.message);
                // that.backtrack();
                } else {
                  uni.setStorageSync('isNew',res.isNew);  
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
</style>
