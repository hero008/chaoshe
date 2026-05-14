<template>
    <view class="filter" @click="filterShow=!filterShow">赏品级别<span class="icof">&#xe604;</span>
        <div class="option_box" :class="{optionOpen:filterShow,optionC:!filterShow}">
            <div class="option_list">
                <div class="option" v-for="(i,s) in columns" :key="s">{{i}}</div>
            </div>
        </div>
    </view>
</template>
<script>
export default {
    data() {
        return {
            filterShow: false,
            columns: ["A级", "B级", "C级", "D级", "E级", "F级"],
        }
    },
    created() {},
    mounted() {},
    methods: {},
}
</script>
<style lang='scss' scoped>
.filter {
    color: #818181;
    font-size: 28rpx;
    position: relative;

    .icof {
        font-size: 24rpx;
        margin-left: 6rpx;
    }

    .option_box {
        width: 300rpx;
        border-radius: 0 0 16rpx 16rpx;
        background: #fff;
        color: #333;
        padding: 20rpx 30rpx;
        font-size: 30rpx;
        box-sizing: content-box;
        position: absolute;
        top: 46rpx;
        z-index: 99;

        .option_list {
            height: 100%;
            overflow-y: auto;
        }

        .option {
            line-height: 50rpx;
        }

        &.optionOpen {
            height: 200rpx;
            transition: height 0.5s;
            box-shadow: 0 5rpx 10rpx 2rpx rgba(0, 0, 0, .16);
        }

        &.optionC {
            height: 0;
            padding: 0 30rpx;
            transition: height 0.5s, padding 0.5s;
        }
    }
}
</style>