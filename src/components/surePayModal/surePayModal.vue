<template>
    <u-popup :safeAreaInsetBottom="false"  round="20" :show="show" mode="center" @close="close" >
        <view class="confirmSureModal">
              <view class="title">确认支付</view>
               <view class="tips">您是否已支付当前订单?</view>
               <view class="actionBtns">
                <view class="btn cancel" @click="close">未支付</view>
                <view @click="confirm" class="btn confirm">已支付</view>
               </view>
        </view>
	</u-popup>
</template>
<script>
export default {
    name: "surePayModal",
   data(){
    return {
         show:false
    }
   
   },
    methods: {
     confirm(){
        this.$emit('surePaySuccess',1)
        this.show=false;
     },
     open(){
        this.show=true
     },
     close(){
       this.$emit('surePaySuccess',0)
       this.show=false;
     },
  
    },
  
  
}
</script>
