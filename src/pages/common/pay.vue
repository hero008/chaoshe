<template>
    <view class="agreement">
        
        
    </view>
</template>
<script>
import { isMTVapp,shareUrl } from '../../utils/mgtv';

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
        console.log(this.targetUrl);
        const addReturnUrl = uni.getStorageSync('returnUrl');
        if(addReturnUrl){
            if(this.targetUrl.includes('alipay')){
             this.targetUrl = this.targetUrl + '&return_url'+ encodeURIComponent(addReturnUrl)  //支付宝
            }else{ 
              this.targetUrl = this.targetUrl + '&redirect_url'+ encodeURIComponent(addReturnUrl) // 微信
            // 支付宝
            }
        }else{

        }
    },

    onShow(da){
     if(window.location.href.includes('isPay=1')){
        // MgtvApi.closeWebView();
     }else{
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
