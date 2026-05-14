<template>
    <view class="sz_box" @click="handleClick">
        <text :style="{color:status == 0 ? color : actColor}">{{title}}</text>
        <view class="sz_mark">
            <i class="top_mk" :style="{'border-bottom-color':actTopColor}"></i>
            <i class="bot_mk" :style="{'border-top-color':actBotColor}"></i>
        </view>
    </view>
</template>
<script>
export default {
    name: "x-filt",
    props: {
        title: {
            default: "销量",
            type: String
        },
        color: {
            default: '#343434',
            type: String
        },
        actColor: {
            default: '#343434',
            type: String
        }
    },
    data() {
        return {
            status: 0
        }
    },
    computed: {
        actColorLight() {
            return this.actColor + '4a'
        },
        actTopColor() {
            if (this.status == 1) {
                return this.actColorLight
            } else if (this.status == 2) {
                return this.actColor
            } else {
                return this.color;
            }
        },
        actBotColor() {
            if (this.status == 1) {
                return this.actColor
            } else if (this.status == 2) {
                return this.actColorLight
            } else {
                return this.color;
            }
        }
    },
    methods: {
        handleClick() {
            if (this.status == 0) {
                this.status = 1
            } else if (this.status == 1) {
                this.status = 2
            } else {
                this.status = 0
            }

            this.$emit('change', this.status)
        }
    }
}
</script>
<style scoped>
.top_mk {
    width: 0;
    height: 0;
    border-left: 8rpx solid transparent;
    border-right: 8rpx solid transparent;
    border-bottom: 8rpx solid #CDCDCD;
}

.bot_mk {
    margin-top: 4rpx;
    width: 0;
    height: 0;
    border-left: 8rpx solid transparent;
    border-right: 8rpx solid transparent;
    border-top: 8rpx solid #999;
}

.sz_mark {
    margin-left: 10rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.sz_box {
    display: inline-flex;
    font-size: 28rpx;
    font-weight: bold;
}
</style>