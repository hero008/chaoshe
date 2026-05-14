<template>
<!-- padding: padding, backgroundColor: bgColor, -->
	<view class="sy-swiper" :style="{
		
		height: addUnit(height),
		
		borderRadius: addUnit(radius)
	}">
		<view v-if="showButton" class="sy-swiper__operation left" @click="slideLeft" :style="{
			width: addUnit(buttonSize),
			height: addUnit(buttonSize),
			background: buttonBgColor,
			fontSize: addUnit(buttonSize)
		}">
			<slot name="left-button"></slot>
		</view>
		<view class="sy-swiper__panel" @touchstart="onTouchStart" @touchend="onTouchEnd">
			<view class="sy-swiper__panel-item" v-for="(item, index) in images" :key="index" :style="{
	                    transform: itemStyles[index].transform,
	                    zIndex: itemStyles[index].zIndex,
	                    opacity: itemStyles[index].opacity,
						transitionDuration: millisecondsToSeconds(duration) + 's',
						transitionTimingFunction: easing
	                }">
				<view class="sy-swiper__panel-item__content" @click="$emit('click', item, index)">
					<template v-if="showFirstImageOnly">
						<!-- :style="{borderRadius: addUnit(slideRadius)}" -->
						<image class="slide" :src="item.thumb" :mode="imgMode" v-if="itemStyles[index].isTop" ></image>
						<view class="slide-mask" v-else :style="{ background: maskBgColor, borderRadius: addUnit(slideRadius) }"></view>
					</template>
					<template v-else>
						<!-- :style="{ borderRadius: addUnit(slideRadius) }" -->
						<image class="slide" :src="item.thumb" :mode="imgMode" >
						</image>
					</template>

					<!-- <text class="desc" :class="{ 'text': descNoWrap }" v-if="showDesc && item.desc" :style="{ background: descBgColor, color: descColor, fontSize: addUnit(descSize), borderRadius: `0 0 ${addUnit(slideRadius)} ${addUnit(slideRadius)}` }">{{ item.desc }}</text> -->
				</view>
			</view>
		</view>
		<view v-if="showButton" class="sy-swiper__operation right" @click="slideRight" :style="{
			width: addUnit(buttonSize),
			height: addUnit(buttonSize),
			background: buttonBgColor,
			fontSize: addUnit(buttonSize)
		}">
			<slot name="right-button"></slot>
		</view>
	</view>
</template>

<script>
	import {
		addUnit,
		millisecondsToSeconds
	} from "./util.js";
	export default {
		props: {
			// 图片列表
			images: {
				type: Array,
				default: () => []
			},
			padding: {
				type: String,
				default: "10px"
			},
			// 是否自动切换
			autoplay: {
				type: Boolean,
				default: false
			},
			// 动画类型
			easing: {
				type: String,
				default: "ease-in-out"
			},
			// 是否启用不透明度设定
			enableOpacity: {
				type: Boolean,
				default: true
			},
			// 最顶层图片的不透明度
			baseOpacity: {
				type: Number,
				default: 1
			},
			// 当前所在滑块的 index
			current: {
				type: Number,
				default: 0
			},
			// 滑块自动切换时间间隔（ms）
			interval: {
				type: Number,
				default: 2000
			},
			// 滑块切换过程所需时间（ms）
			duration: {
				type: Number,
				default: 500
			},
			// 左右边距
			horizontalMargin: {
				type: [String, Number],
				default: 16
			},
			// 上下边距
			verticalMargin: {
				type: [String, Number],
				default: 10
			},
			// 组件高度
			height: {
				type: [String, Number],
				default: 130
			},
			// 是否显示操作按钮
			showButton: {
				type: Boolean,
				default: false
			},
			// 按钮字体大小
			buttonSize: {
				type: [String, Number],
				default: 24
			},
			// 操作按钮背景颜色
			buttonBgColor: {
				type: String,
				default: "rgba(0, 0, 0, 0.26)"
			},
			// 图片裁剪模式，详情见微信原生imageMode
			imgMode: {
				type: String,
				default: "aspectFill"
			},
			// 是否只显示第一张图片，其他图片被蒙版遮住
			showFirstImageOnly: {
				type: Boolean,
				default: false
			},
			// 遮住蒙版的颜色
			maskBgColor: {
				type: String,
				default: "#ffffff"
			},
			// 是否显示图片描述（需要images传递的数据中存在desc属性）
			showDesc: {
				type: Boolean,
				default: true,
			},
			// 底部描述的背景
			descBgColor: {
				type: String,
				default: "rgba(0, 0, 0, 0.5)"
			},
			// 底部描述字体颜色
			descColor: {
				type: String,
				default: "#ffffff"
			},
			// 底部描述字体大小
			descSize: {
				type: [Number, String],
				default: 10
			},
			// 描述是否不换行，超出后用...省略
			descNoWrap: {
				type: Boolean,
				default: false
			},
			// 轮播图片的圆角值
			radius: {
				type: [String, Number],
				default: 4
			},
			// 容器背景色
			bgColor: {
				type: String,
				default: "#ffffff"
			},
			slideRadius: {
				type: [String, Number],
				default: 10
			}
		},
		// 切换
		emits: ["click", "change"],
		data() {
			return {
				slideNote: {
					x: 0,
					y: 0
				},
				itemStyles: [],
				screenWidth: 0,
				currentIndex: 0,
				autoSlideInterval: null,
				autoSlideTimeout: null
			}
		},
		mounted() {
			this.autoplay && this.doSomething();
		},
		onUnload() {
			this.autoSlideInterval = null;
			this.autoSlideTimeout = null;
		},
		beforeDestroy() {
			clearInterval(this.autoSlideInterval);
			clearTimeout(this.autoSlideTimeout);
			this.autoSlideInterval = null;
			this.autoSlideTimeout = null;
		},
		watch: {
			images: {
				handler(newImages) {
					var macInfo = uni.getSystemInfoSync();
					this.screenWidth = macInfo.screenWidth;
					this.itemStyles = newImages.map((_, index) => (this.getStyle(index)));
				},
				deep: true,
				immediate: true
			},
			current: {
				handler(newCurrentIndex) {
					this.scrollToCurrent(newCurrentIndex);
				},
				immediate: true
			}
		},
		methods: {
			addUnit,
			millisecondsToSeconds,
			doSomething() {
				this.$nextTick(() => {
					this.autoSlideInterval = setInterval(() => {
						this.slideRight();
					}, this.interval)
				})
			},
			getStyle(eIndex) {
				if (eIndex > this.images.length / 2) {
					var right = this.images.length - eIndex;
					return {
						transform: "scale(" + (1 - right / this.verticalMargin) + ") translate(-" + right * this
							.horizontalMargin + "%, 0px)",
						zIndex: 100 - right,
						opacity: this.enableOpacity ? this.baseOpacity / right : 1,
						isTop: eIndex === 0
					}
				} else {
					return {
						transform: "scale(" + (1 - eIndex / this.verticalMargin) + ") translate(" + eIndex * this
							.horizontalMargin + "%, 0px)",
						zIndex: 100 - eIndex,
						opacity: this.enableOpacity ? this.baseOpacity / eIndex : 1,
						isTop: eIndex === 0
					}
				}
			},
			restartTimer() {
				clearInterval(this.autoSlideInterval);
				this.autoSlideInterval = null;
			},
			scrollToCurrent(currentIndex) {
				// 清除现有的定时器，避免干扰
				this.restartTimer();
				// 这里选择用转动的方式，更改图片顺序会导致整个轮播的顺序错落
				for (let i = 0; i < currentIndex; i++) {
					this.slideRight();
				}
			},
			simulateStartMove(x) {
				this.slideNote.x = x;
			},
			onTouchStart(e) {
				this.restartTimer();
				this.slideNote.x = e.changedTouches[0] ? e.changedTouches[0].pageX : 0;
				this.slideNote.y = e.changedTouches[0] ? e.changedTouches[0].pageY : 0;
			},
			onTouchEnd(e) {
				var newList = JSON.parse(JSON.stringify(this.itemStyles));
				if (e.changedTouches[0].pageX - this.slideNote.x < -10) {
					// 向左滑动
					var last = [newList.pop()];
					newList = last.concat(newList);
					this.currentIndex = (this.currentIndex + 1) % this.images.length;
				} else if (e.changedTouches[0].pageX - this.slideNote.x >= 10) {
					// 向右滑动
					newList.push(newList[0]);
					newList.splice(0, 1);
					this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
				}
				this.itemStyles = newList;
this.$emit('change', this.currentIndex);
				if (this.autoplay) {
					clearInterval(this.autoSlideInterval);
					clearTimeout(this.autoSlideTimeout);
					// 设置新的定时器，使用 this.interval 值作为间隔时间
					this.autoSlideTimeout = setTimeout(() => {
						this.slideRight();
					}, this.interval);
				}
			},
			slideLeft() {
				this.restartTimer();
				this.simulateStartMove(this.slideNote.x); // 模拟 touchstart，确保 slideNote.x 更新
				this.onTouchEnd({
					changedTouches: [{
						pageX: this.slideNote.x + 20
					}]
				});
				// 触发 change 事件并传递当前的索引
				this.$emit('change', this.currentIndex);
			},
			slideRight() {
				this.restartTimer();
				this.simulateStartMove(this.slideNote.x); // 模拟 touchstart，确保 slideNote.x 更新
				this.onTouchEnd({
					changedTouches: [{
						pageX: this.slideNote.x - 20
					}]
				});
				// 触发change 事件并传递当前的索引
				this.$emit('change', this.currentIndex);
			}
		}
	}
</script>

<style lang="scss" scoped>
.slide{
	width: 360rpx;
height: 360rpx;
border-radius: 32rpx ;
border: 6rpx solid #FFFFFF;
background: #FFFFFF;

}
	.sy-swiper {
		position: relative;
		box-sizing: border-box;

		.sy-swiper__operation {
			display: flex;
			justify-content: center;
			align-items: center;
			position: absolute;
			border-radius: 50%;
			background: rgba(0, 0, 0, 0.26);
			z-index: 999;

			&:active {
				filter: brightness(70%);
			}
		}

		.sy-swiper__operation.left {
			top: 50%;
			left: 10px;
			transform: translateY(-50%);
		}

		.sy-swiper__operation.right {
			bottom: 50%;
			right: 10px;
			transform: translateY(50%);
		}

		.sy-swiper__panel {
			width: 100%;
			height: 100%;
			overflow: hidden;
			position: relative;

			.sy-swiper__panel-item {
				height: 100%;
				width: 100%;
				position: absolute;
				top: 0;
				left: 0;
				transition-property: transform, opacity;
				// transition-duration: 0.4s;
				// transition-timing-function: ease-in-out;

				&__content {
					height: 100%;
					width: 330rpx;
					margin: 2rpx auto;
					position: relative;

					.slide {
						height: 100%;
						width: 100%;
					}

					.slide-mask {
						position: relative;
						height: 100%;
						width: 100%;
						z-index: 1;
					}

					.desc {
						position: absolute;
						width: 100%;
						bottom: 0;
						left: 0;
						padding: 10rpx 20rpx;
						box-sizing: border-box;
						box-shadow: 0rpx 4rpx 21rpx 0rpx rgba(0, 0, 0, 0.07);
						// border-radius: 0 0 20px 20px;
						font-family: PingFang SC;
						font-weight: 400;
						line-height: 32rpx;
						text-transform: none;
					}
				}
			}
		}
	}

	.text {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
</style>