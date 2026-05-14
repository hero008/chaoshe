<template>
    <view class="x-search flex_r flex_ac flex_js" :style="{width:width+'px',height:height+'px'}">
        <span class="icof" @click="search">&#xe6c7;</span>
        <input class="inp" type="text" v-model="key" @input="inpchange" @confirm="search" confirm-type="search" :placeholder="placeholder"/>
    </view>
</template>

<script>
export default {
	props: {
		width: {
			type: Number,
			default: 250
		},
		height: {
			type: Number,
			default: 30
		},
		placeholder: {
			type: String,
			default: "请输入搜索内容"
		},
	},
    data() {
        return {
			key: "",
		};
    },
    created() {},
    mounted() {},
    methods: {
		inpchange(){
            this.$emit("input",this.key);
		},
        search() {
            this.$emit("search");
        },
    },
};
</script>

<style lang='scss' scoped>
.x-search {
	background-color: #fff;
	border-radius: 12rpx;
	padding-right: 20rpx;
	.icof{
		font-size: 36rpx;
		color: #928FA6;
		padding: 0 16rpx 0 20rpx;
	}
	.inp{
		font-size: 28rpx;
		width: calc(100% - 52rpx);
	}
}
</style>