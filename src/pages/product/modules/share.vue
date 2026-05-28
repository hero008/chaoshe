<template>
   <u-popup :show="true" @close="close" :round="16" >
            <view class="shareContent">
                 <view @click="share(1)">
                     <img src="https://img.shinemang.com/gachaStatic/static/img/imgs/WeChat.png" alt="">
                     <view>微信好友</view>
                 </view>
                 <view  @click="share(2)">
                     <img src="https://img.shinemang.com/gachaStatic/static/img/home/pyq.png" alt="">
                     <view>朋友圈</view>
                 </view>
            </view>
	</u-popup>
</template>

<script>
import { post } from "@/utils/api.js";
export default {
    data() {
        return {
       
        };
    },
    onLoad(da) {
      
    },
    methods: {

      close() {
        this.$emit("closeSharePoupon");
      },
      share(type){
        this.$emit("shareTo",type);
      }
    },
};
</script>

<style lang="scss" scoped>
   .shareContent{
      height:400rpx;
      width: 100%;
      border-radius: 16px 16px 0 0;
      display: flex;
      padding-top: 100rpx;
      background-color: #fff;
    //   align-items: center;
      justify-content: center;
      >view{
        text-align: center;
        &:first-child{
            margin-right: 100rpx;
        }

        img{
            width: 100rpx;
            height: 100rpx;
        }
        font-size: 32rpx;
        color: #1a1a1a;
      }
   }
</style>