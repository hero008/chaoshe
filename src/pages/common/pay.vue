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
        const addReturnUrl = uni.getStorageSync('returnUrl');
        if(addReturnUrl){
            
        }
        if(!isMTVapp()){
            try{
                 window.location.href = 'imgotv://';
            }catch(e){

            }
         
         //      window.location.href = `https://club.mgtv.com/act/download/index.html?schema=${encodeURIComponent(
        //   `imgotv://webview?url=${encodeURIComponent(shareUrl)}`,)}`;
        }
        this.targetUrl = da.url
        if(this.targetUrl.includes('apli')){
          // 支付宝
        }else{ 
          // 微信
        }
    },
    mounted(e){
     
    },
    onShow(da){
      
     if(location.href.includes('isPay=1')){
        MgtvApi.closeWebView();
     }else{
        history.replaceState(null, '',location.href +'&isPay=1')
        window.location.href= this.targetUrl
     }
        
        //    console.log(window.location.search)
        //    const params = new URLSearchParams(window.location.search);
        //    console.log(params);
        //    console.log(params.get('url'))
        
        //  window.location.href = this.targetUrl
         
    //    if(this.pay){
    //      MgtvApi.closeWebView();
    //    }
    }
   
};
</script>
