<template>
    <view class="agreement">
        
    </view>
</template>
<script>

export default {
    data() {
        return {
             targetUrl:'',
             pay:0
        };
    },
    onLoad(da){
         this.pay = 1
         this.targetUrl = da.url;
         window.location.href = this.targetUrl
    },
    onShow(da){
       if(this.pay){
         MgtvApi.closeWebView();
       }
    }
   
};
</script>
