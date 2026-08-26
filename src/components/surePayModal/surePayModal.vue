<template>
    <u-popup  :show="show" mode="center" :closeOnClickOverlay="false">
        <view class="sureModal">
              <view class="title">确认支付</view>
               <view class="tips">您是否已支付当前订单?</view>
               <view class="btns">
                <view class="btn">未支付</view>
                <view class="btn confirm">已支付</view>
               </view>
        </view>
	</u-popup>
</template>
<script>
export default {
    name: "surePayModal",
    props:{
        show:{
            type:Boolean,
            default:false
        }
    },
    methods: {
     confirm(){
        
     },
    },
  
    data() {
        return {

        };
    }
}
</script>
<style lang="scss" scoped>

 .sureModal{
    width: 654rpx;
padding: 64rpx 30rpx;
background: #FFFFFF;
border-radius: 40rpx 40rpx 40rpx 40rpx;
.title{
    color: #1A1A1A;
    font-size: 36rpx;
    font-weight: bold;
}
.tips{
    margin-top: 64rpx;
     color: #1A1A1A;
    font-size: 32rpx;
    font-weight: bold;
}

.btns{
    display: flex;
    align-items: center;
    justify-content: center;
    .btn{
        width: 264rpx;
height: 80rpx;
background: #F5F6F8;
border-radius: 40rpx 40rpx 40rpx 40rpx;
color: #1A1A1A;
font-size: 32rpx;
display: flex;
align-items: center;
justify-content: center;
&.confirm{
    background: linear-gradient( 90deg, #31E597 0%, #40E0EA 100%);
    margin-left: 30rpx;
}
    }
}
 }
</style>