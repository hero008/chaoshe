<template>
    <scroll-view @scrolltolower="onReachScollBottom" class="product-scroll" :lower-threshold="400" :scroll-y="IsScroll">
        <view class="product-lists" v-if="content.length">
            <view class="p-item" v-for="(item, index) in content" :key="index">
                <image :src="item.coverThumb" class="p-img" />
                <view class="product-info flex_r flex_jb flex_ac">
                    <view class="p-info">
                        <view class="p-name">{{item.themeName}}</view>
                        <u-avatar-group :urls="item.avatars" size="35" gap="0.4" maxCount=3 v-if="item.avatars.length>0"></u-avatar-group>
                        <view class="p_people" v-if="item.joinNums>0">{{item.joinNums}}人已预约</view>
                    </view>
                    <view class="p-btn" @click="tn(item.id)">立即查看</view>
                </view>
            </view>
        </view>
        <u-empty v-else text="暂无赏品~" icon="https://img.shinemang.com/gachaStatic/static/img/home/empty.png" :marginTop="50" />
    </scroll-view>
</template>
<script>
import { post } from "@/utils/api.js"
export default {
    data() {
        return {
            pageda: {
                page: 1,
                page_size: 20,
				total:20
            },
            content: []
        }
    },
    props: { type: Number, IsScroll: Boolean },
    created() {
        this.getlist()
    },
    methods: {
        getlist() {
            post("v1/gacha/booking/list", {
                type: 0, // 0: 所有, 1:一番赏, 2:彩蛋机, 3:潮游赏
                ...this.pageda
            }).then(res => {
                this.content = res.gachas
				if (this.pageda.page == 1) this.content = [];
				this.content = this.content.concat(res.gachas);
				this.pageda.total =  res.total;
            })
        },
        tn(e) {
            console.log(e)
        },
        onReachScollBottom() {
            if (this.pageda.total > this.pageda.page * this.pageda.page_size) {
            	this.pageda.page++;
            	this.getlist()
            }
        }
    },
}
</script>
<style lang='scss' scoped>
.product-scroll {
    height: calc(100% - 60rpx);
}

.product-lists {
    padding: 10rpx 0 50rpx;
}

.p-item {
    width: 100%;
    border-radius: 12rpx;
    overflow: hidden;
    background-color: #fff;
    margin-bottom: 28rpx;
}

.product-info {
    padding: 10rpx 16rpx;
}

.p-img {
    width: 100%;
    height: 320rpx;
    background-size: 100% 100%;
    /* background-color: rgba($color: #9064FF, $alpha: 1); */
}

.p-name {
    color: #999;
    font-size: 26rpx;
    margin-bottom: 12rpx;
}

.p-btn {
    color: #fff;
    background-color: rgba($color: #9064FF, $alpha: 1);
    width: 150rpx;
    text-align: center;
    height: 56rpx;
    line-height: 56rpx;
    font-size: 26rpx;
    font-weight: bold;
    border-radius: 10rpx;
}
</style>