<template>
  <view class="scroll-container">
    <view class="scroll-wrapper">
      <view 
        class="scroll-content" 
        :class="{ 'animate-scroll': items.length >= 3 }"
        :style="animationStyle"
      >
        <!-- 原始内容 -->
        <view v-for="(item, index) in items" :key="'o-' + index" class="scroll-item">
            <img :src="item.itemCover" alt="">
        </view>
        <!-- 复制一份实现无缝 -->
        <view v-for="(item, index) in items" :key="'c-' + index" class="scroll-item">
           <img :src="item.itemCover" alt="">
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "InfiniteScroll",
  props: {
    // 固定速度（px/秒），默认80
    speed: {
      type: Number,
      default: 80
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      defaultItems: [
        { icon: "🎨", title: "艺术画廊" },
        { icon: "🚀", title: "极速科技" },
        { icon: "🌈", title: "彩虹世界" },
        { icon: "🎵", title: "音乐律动" },
        { icon: "🍕", title: "美食探店" },
        { icon: "⚽", title: "运动健身" }
      ]
    };
  },
  computed: {
    items() {
      return this.list.length > 0 ? this.list : this.defaultItems;
    },
    // 一组盒子的总宽度（px）- 纯计算，不依赖DOM
    groupWidth() {
      const len = this.items.length;
      if (len === 0) return 0;
      
      // 获取屏幕宽度（rpx转px）
      const systemInfo = uni.getSystemInfoSync();
      const screenWidth = systemInfo.screenWidth;
      
      // CSS中定义的：width: 280rpx, margin-right: 24rpx
      const itemWidthPx = (88 * screenWidth) / 750;
      const marginPx = (16 * screenWidth) / 750;
      
      // 总宽度 = 个数 × (盒子宽度 + 右边距)
      return len * (itemWidthPx + marginPx);
    },
    // 动画时长 = 一组宽度 / 固定速度
    duration() {
      if (this.groupWidth === 0) return 0;
      return this.groupWidth / this.speed;
    },
    animationStyle() {
      if (this.items.length < 4 || this.duration === 0) {
        return {};
      }
      return {
        animationDuration: this.duration + 's'
      };
    }
  }
};
</script>

<style scoped lang="scss">
.scroll-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.scroll-wrapper {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
  
  &::-webkit-scrollbar {
    display: none;
  }
}

.scroll-content {
  display: inline-flex;
  align-items: center;
  height: 100%;
}

.scroll-content.animate-scroll {
  animation: scrollLeft linear infinite;
}

.scroll-item {
  flex-shrink: 0;
width: 88rpx;
height: 88rpx;
background: linear-gradient( 180deg, #CCFFF4 0%, #FFFFFF 60%);
border-radius: 16rpx 16rpx 16rpx 16rpx;
border: 2rpx solid #A1FAE3;
  margin-right: 16rpx;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  color: white;
  img{
    width: 88rpx;
    height: 88rpx;
    border-radius: 16rpx;
  }
}

.item-icon {
  font-size: 64rpx;
}

.item-text {
  font-size: 28rpx;
  margin-top: 16rpx;
}

@keyframes scrollLeft {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>