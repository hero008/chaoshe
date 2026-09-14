<template>
    <view class="agreement">
        
        
    </view>
</template>
<script>
import {originUrl} from '../../utils/mgtv';

export default {
    data() {
        return {
             targetUrl:'',
        };
    },
    onLoad(da){
        MgtvApi.setWebviewTitle({
            title:'支付'
        })
            this.targetUrl = da.url
            let returnUrl = originUrl+'#/pages/common/pay?isPay=1'
            const addReturnUrl = uni.getStorageSync('returnUrl');
            if(this.targetUrl.includes('alipay')){
                if(addReturnUrl){
                  this.targetUrl = this.targetUrl + '&return_url'+ encodeURIComponent(returnUrl)  //支付宝
                }
            }else{ 
                if(addReturnUrl){
                   this.targetUrl = this.targetUrl + '&redirect_url'+ encodeURIComponent(returnUrl) // 微信
                }
            }
      
    },
    onShow(da){
     if(window.location.href.includes('isPay=1') || uni.getStorageSync('isPay')){
        uni.removeStorageSync('isPay')
        MgtvApi.closeWebView();
     }else{
        uni.setStorageSync('isPay',1)
        history.replaceState(null, '',location.href +'&isPay=1')
        if(this.targetUrl.includes('http')){
            window.location.href= this.targetUrl
        }else{
            MgtvApi.closeWebView();
        }
     }
    }
   
};
</script>
