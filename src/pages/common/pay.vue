<template>
    <view class="agreement">
        
        
    </view>
</template>
<script>
import {originUrl,isIos} from '../../utils/mgtv';

export default {
    data() {
        return {
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
              uni.removeStorageSync('jumpUrl')
              window.location.href = targetUrl
        }
    }
   
};
</script>
