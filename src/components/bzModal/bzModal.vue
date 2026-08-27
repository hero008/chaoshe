<template>
    <!-- 领主接力弹窗（公共组件）：样式与交互与 duiduipeng.vue 保持一致 -->
    <u-popup mode="center" bgColor="transparent" round="16" @close="showBzcPopup = false" :show="showBzcPopup">
          <view class="BzcList">
            <view @click=" goto('/pages/common/rulepop', { val: 'TreasureChest' })" class="rules"></view>
            <scroll-view class="scrollView" scroll-y>
                 <view class="list">
                    <view @click="ondetail(item)" v-for="item in bzcRewards" :key="item.itemId" class="item">
                         <view :style="{
                            backgroundImage:`url(${item.coverThumb})`
                         }" class="bgc">
                            <view class="tag"></view>
                         </view>

                         <view class="name ellipsis">{{ item.name }}</view>
                         <view class="rate">概率:{{item.probability}}%</view>
                    </view>    
                
                </view>
            </scroll-view>
            <view class="close" @click="showBzcPopup = false"></view>
          </view>
            <gachaDetails ref="gachaDetails" />
	  </u-popup>
</template>

<script>
import { post } from "@/utils/api.js";

export default {
    name: "bzModal",
    props: {
     
    
    },
    data() {
        return {
            showBzcPopup: false,            // 弹窗显示标志
          bzcRewards:[]
        };
    },
    methods: {
        /** 打开领主接力弹窗，id 优先取参数，其次取 prop */
        open(da) {
            this.bzcRewards = da
            this.showBzcPopup = true;
        },
        /** 关闭领主接力弹窗 */
        close() {
            this.showBzcPopup = false;
         
        },
 
        ondetail(item) {
            this.gachaDetailsMethod(this, item.itemId);
        },
    },
};
</script>

<style lang="scss" scoped>
.BzcList{
    width: 670rpx;
    height: 1082rpx;
    background: url('https://img.shinemang.com/gachaStatic/bzsBg.png');
    background-size: 100% 100%;
    position: relative;
    padding-top: 220rpx;
    .rules{
        width: 112rpx;
        height: 40rpx;
        position: absolute;
        top: 36rpx;
        right: 16rpx;
        background: url('https://img.shinemang.com/gachaStatic/bzsRule.png');
        background-size: 100% 100%;
        z-index: 999;
    }
    .scrollView{
        width: 100%;
        height: 810rpx;
        // background: #fff;
        .list{
            width: 100%;
            padding-left: 28rpx;
            display: flex;
            flex-wrap: wrap;
            .item{
                width: 200rpx;
                height: 292rpx;
                background: linear-gradient( 180deg, #CCFBFF 0%, #FFFFFF 20%);
                border-radius: 16rpx 16rpx 16rpx 16rpx;
                margin-right: 8rpx;
                margin-bottom: 8rpx;
                .bgc{
                    width: 200rpx;
                    height: 200rpx;
                    border-radius: 16rpx 16rpx 0 0;
                    // background: red;
                    background-size: 100% 100%;
                    position: relative;
                    .tag{
                        width: 120rpx;
                        height: 40rpx;
                        position: absolute;
                        left: 0;
                        bottom: 0;
                        background: url('https://img.shinemang.com/gachaStatic/tag_宝箱.png');
                        background-size: 100% 100%;
                    }
                }
                .name{
                    color: #1A1A1A;
                    padding: 0 8rpx;
                    font-size: 24rpx;
                    line-height: 32rpx;
                    margin-top: 12rpx;
                }
                .rate{
                    padding-left: 8rpx;
                    color: #8D8D94;
                    font-size: 20rpx;
                    margin-top: 4rpx;
                }
            }
        }
    }
     .close{
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: -80rpx;
        width: 56rpx;
        height: 56rpx;
        background: url('@/static/close.png');
        background-size: 100% 100%;
    }
}
</style>
