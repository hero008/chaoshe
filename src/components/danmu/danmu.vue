<template>
  <view :style="{ top: top + 'px' }" class="danmaku-wrapper">
    <!-- 上行 -->
    <view class="danmaku-row row-top">
      <view
        class="danmaku-track"
        :style="{ animationDuration: duration + 's' }"
      >
        <view
          v-for="(item, index) in topData"
          :key="'top-' + index"
          :class="['danmaku-item', { 'fade-delay': index < 2 }]"
          :style="{
            '--delay': index < 2 ? '15s' : '0s'
          }"
        >
          <span :class="['type', item.extraData.level_name]">
            {{ formateGachaLevel(item.extraData.level_name) }}
          </span>
          <div class="name">{{ item.extraData.user_name }}获得</div>
          <img :src="item.body" alt="" />
          <div class="goodsName ellipsis">{{ item.title }}</div>
        </view>
        <view
          v-for="(item, index) in topData"
          :key="'top-clone-' + index"
          class="danmaku-item"
          
        >
          <span :class="['type', item.extraData.level_name]">
            {{ formateGachaLevel(item.extraData.level_name) }}
          </span>
          <div class="name">{{ item.extraData.user_name }}获得</div>
          <img :src="item.body" alt="" />
          <div class="goodsName ellipsis">{{ item.title }}</div>
        </view>
      </view>
    </view>

    <!-- 下行 -->
    <view class="danmaku-row row-bottom">
      <view
        class="danmaku-track"
        :style="{ animationDuration: duration + 's' }"
      >
        <view
          v-for="(item, index) in bottomData"
          :key="'bottom-' + index"
           :class="['danmaku-item', { 'fade-delay': index < 2 }]"
          :style="{
            '--delay': index < 2 ? '15s' : '0s'
          }"
        >
          <span :class="['type', item.extraData.level_name]">
            {{ formateGachaLevel(item.extraData.level_name) }}
          </span>
          <div class="name">{{ item.extraData.user_name }}获得</div>
          <img :src="item.body" alt="" />
          <div class="goodsName ellipsis">{{ item.title }}</div>
        </view>
        <view
          v-for="(item, index) in bottomData"
          :key="'bottom-clone-' + index"
          class="danmaku-item"
        >
          <span :class="['type', item.extraData.level_name]">
            {{ formateGachaLevel(item.extraData.level_name) }}
          </span>
          <div class="name">{{ item.extraData.user_name }}获得</div>
          <img :src="item.body" alt="" />
          <div class="goodsName ellipsis">{{ item.title }}</div>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { formateGachaLevelName } from '../../utils/mgtv';

export default {
  name: 'DanmakuSimple',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    top: {
      type: Number,
      default: 0,
    },
  
  },
  data() {
    return {
      topData: [],
      bottomData: [],
      isPageActive: true,
      duration:0,
      opacityClass:0,
      timer:null
    };
  },
  watch: {
    data: {
      handler(newData) {
        if (newData && newData.length > 0) {
          this.splitData(newData);
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    if (this.data && this.data.length > 0) {
      this.splitData(this.data);
    }
  },
  activated() {
    this.isPageActive = true;
    this.resumeScroll();
  },
  deactivated() {
    this.isPageActive = false;
    this.pauseScroll();
    // this.clearAll()
  },
  beforeDestroy() {
    this.clearAll();
  },
  methods: {
    formateGachaLevel(data) {
      return formateGachaLevelName(data);
    },
    splitData(data) {
      if (!data || data.length === 0) {
        this.topData = [];
        this.bottomData = [];
        return;
      }
       this.timer && clearTimeout(this.timer);
       this.timer = null;
      const half = Math.ceil(data.length / 2);
      this.topData = data.slice(0, half);

      this.bottomData = data.slice(half);
      this.duration = this.topData.length * 4
     this.timer = setTimeout(()=>{
          this.opacityClass = 1
      },5000)
    },
    pauseScroll() {
      // const tracks = document.querySelectorAll('.danmaku-track');
      // tracks.forEach((track) => {
      //   track.style.animationPlayState = 'paused';
      // });
    },
    resumeScroll() {
      const tracks = document.querySelectorAll('.danmaku-track');
      tracks.forEach((track) => {
        track.style.animationPlayState = 'running';
      });
    },
    clearAll() {
   
      this.topData = [];
      this.bottomData = [];
      this.opacityClass = 0
       this.timer && clearTimeout(this.timer);
       this.timer = null;
      this.pauseScroll();

    },
  },
};
</script>

<style scoped>
.danmaku-wrapper {
  position: absolute;
  width: 100%;
  height: 100px;
  overflow: hidden;
  left: 0;
  z-index: 8;
  pointer-events: none;
}

.danmaku-row {
  width: 100%;
  height: 30px;
  overflow: hidden;
  position: relative;
}

.row-top {
  top: 0;
}

.row-bottom {
  top: 0px;
}

.danmaku-track {
  display: flex;
  align-items: center;
  height: 100%;
  width: max-content;
  animation: scrollLeft linear infinite;
  /* 关键：从0开始，不是从100vw */
  transform: translateX(0);
  /* padding-left: 100vw;
  padding-right: 100vw; */
}

.danmaku-item {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48rpx;
  padding: 0 24rpx;
  margin-right: 20rpx;
  background: linear-gradient(90deg, rgba(50, 229, 157, 0.7) 0%, rgba(64, 225, 230, 0.5) 100%);
  border-radius: 24rpx;
  border: 2rpx solid #ffffff;
  font-size: 24rpx;
  color: #000;
  line-height: 48rpx;
  white-space: nowrap;
}
.danmaku-item.fade-delay {
  opacity: 0;
  animation: fadeIn 0.5s ease forwards;
  animation-delay: var(--delay, 15s);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.danmaku-item .type {
  font-family: '倍数欧气值';
  margin-right: 8rpx;
  text-align: center;
  font-style: normal;
  text-transform: none;
  font-size: 28rpx;
  -webkit-text-stroke: 0.5px #000000;
}

.danmaku-item .type.SP {
  color: #FF93C7;
}

.danmaku-item .type.A {
  color: #F9E650;
}

.danmaku-item .type.B {
  color: #50FFF5;
}

.danmaku-item .type.C {
  color: #EDF1F0;
}

.danmaku-item img {
  margin: 0 8rpx;
  width: 32rpx;
  height: 32rpx;
  border-radius: 8rpx;
}

.danmaku-item .goodsName {
  max-width: 120rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.danmaku-item .name {
  margin-right: 4rpx;
}

/* 关键：从0到-50%，正好是一组数据的宽度 */
@keyframes scrollLeft {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>