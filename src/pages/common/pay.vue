<template>
    <view class="agreement">
        
        
    </view>
</template>
<script>
import {originUrl,isIos} from '../../utils/mgtv';

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
          
      
    },
    onShow(da){

        let targetUrl = uni.getStorageSync('jumpUrl')
  
        if(window.location.href.includes('isPay=1') || !targetUrl){
            uni.removeStorageSync('jumpUrl')
            MgtvApi.closeWebView();
        }else{
            if(targetUrl.includes('alipay')){
              this.targetUrl = targetUrl
            }else{
              this.targetUrl = targetUrl 
            }
              uni.removeStorageSync('jumpUrl')
              window.location.href= this.targetUrl
        }
    }
   
};
</script>
