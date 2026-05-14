<template>
    <u-popup :show="visible" @close="onclose" :closeable="true" round="26">
        <div class="ipFilt">
            <div class="title">IP筛选</div>
            <view class="h-tit">所属IP</view>
            <view class="ips clearfix">
                <view class="ip_item" :class="{active:selects.includes(i.id)}" v-for="i in ips" :key="i.id" @click="onselect(i.id)">{{i.name}}</view>
            </view>
            <view class="fbtn" @click="onClickSure">确认</view>
        </div>
    </u-popup>
</template>
<script>
import { post } from "@/utils/api.js"
export default {
    data() {
        return {
            ips: [],
            selects: []
        }
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
    },
    components: {},
    watch: {},
    computed: {},
    created() {
        this.getips()
    },
    mounted() {},
    methods: {
        onselect(va) {
            if (this.selects.includes(va)) this.selects = this.remove(this.selects, va)
            else this.selects.push(va)
        },
        getips() {
            post("v1/goods/item_ip/list").then(res => {
                this.ips = res.itemIps
            })
        },
        onClickSure() {
            this.$emit('input', this.selects)
            this.$emit('change', this.selects)
            this.onclose()
        },
        onclose() {
            this.$emit('update:visible', false)
        },

    },
}
</script>
<style lang='scss' scoped>
.ipFilt {
    height: 70vh;
    overflow-y: auto;
    padding: 0 32rpx 100rpx;
}

.title {
    padding: 20rpx 0;
    text-align: center;
    font-size: 36rpx;
    font-weight: bold;
}

.h-tit {
    font-size: 30rpx;
    color: #666;
    margin-bottom: 22rpx;
}

.ips {
    margin: 0 -12rpx;
    height: calc(100% - 200rpx);
    overflow-y: auto;
}

.ip_item {
    float: left;
    margin: 12rpx;
    padding: 12rpx 30rpx;
    border-radius: 38rpx;
    background-color: #fff;

    &.active {
        background-color: #9064FF;
        color: #fff;
    }
}

.fbtn {
    background-color: #9064FF;
    color: #fff;
    font-weight: bold;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    font-size: 35rpx;
    border-radius: 12rpx;
    width: calc(100% - 64rpx);
    position: fixed;
    left: 32rpx;
    bottom: 50rpx;
}
</style>