<template>
    <view class="agreement">
        
    </view>
</template>
<script>

export default {
    data() {
        return {
             targetUrl:'',
            
        };
    },
    onLoad(da){
        this.targetUrl = da.url
        
      
    },
    onShow(da){
         if(!this.pay){
            this.pay = 1
         }else{

         }
         console.log(this.pay);
       
           console.log(window.location.search)
           const params = new URLSearchParams(window.location.search);
           console.log(params);
           console.log(params.get('url'))
        
        //  window.location.href = this.targetUrl
         
    //    if(this.pay){
    //      MgtvApi.closeWebView();
    //    }
    }
   
};
</script>
