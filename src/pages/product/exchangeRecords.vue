<template>
  <view :style="{ paddingTop: MBInfo().top + 'px' }" class="releaseRecord">
    <div
      :style="{ height: MBInfo().height + 'px' }"
      class="navbar_x flex_r flex_jb flex_ac"
    >
      <view class="top_Back" @click.stop="gateBack">
        <text class="icof Back_ico">&#xe72c;</text>
        <text class="txt">兑换记录</text>
      </view>
    </div>
    <div class="shanggui_con" :style="{ height: conHeight }">

      <view class="p_lists">
        <div class="order_list" v-if="orderlist.length">
          <scroll-view
            class="product-scroll"
            @scrolltolower="onReachScollBottom"
            :lower-threshold="400"
            :scroll-y="true"
          >
            <div
              class="order_item"
              v-for="(item, index) in orderlist"
              :key="index"
            >
              <div class="title">
                <div>{{ item.itemName }}</div>
                <div class="status">兑换成功</div>
              </div>
              <div class="time">{{ item.createTime }}</div>
              <div class="code">
                <div>兑换码</div>
                <div class="copyCode">
                  <div>{{ item.value }}</div>
                  <div @click="copy(item.value)" class="copy">复制</div>
                </div>
              </div>
            </div>
          </scroll-view>
        </div>
        <u-empty
          v-else
          text="暂无发货记录~"
          icon="https://img.shinemang.com/gachaStatic/static/img/home/empty.png"
          :marginTop="50"
        />
      </view>
    </div>
  </view>
</template>
<script>
import { post } from "@/utils/api.js";
export default {
  data() {
    return {
    
      orderlist: [],
      pageda: {
        page: 1,
        page_size: 20,
        total: 20,
      },
    };
  },
  onLoad(da) {
    this.loadList();
  },
  computed: {
    conHeight() {
      let h = this.SystemInfo.screenHeight;
      let va = this.MBInfo();
      let th = va.height + va.top;
      let str = h - th + "px";
      return str;
    },
  },
  methods: {
    loadList() {
      post("v1/goods/item/virtual/log", {
        ...this.pageda,
      }).then((res) => {
        if (this.pageda.page == 1) this.orderlist = [];
        this.orderlist = this.orderlist.concat(res.items);
        this.pageda.total = res.total;
      });
    },

    onReachScollBottom() {
      if (this.pageda.total > this.pageda.page * this.pageda.page_size) {
        this.pageda.page++;
        this.loadList();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.product-scroll {
  height: calc(100%);
}
.releaseRecord {
  width: 100vw;
  height: 100vh;
  position: relative;
  padding: 100rpx 0 30rpx;
  overflow-y: auto;

  background-color: #f5f6f8;
}

.navbar_x {
  padding: 0 32rpx;
  position: relative;
  z-index: 2;

  .btn_r {
    width: 162rpx;
    height: 46rpx;
  }

  .top_Back {
    color: #1c1c1c;

    text {
      vertical-align: middle;
    }

    .Back_ico {
      font-size: 50rpx;
      margin-right: 8rpx;
    }

    .txt {
      font-size: 36rpx;
    }
  }
}

.tabs_two {
  // width: 650rpx;
  // background: #ac8afc;
  // border-radius: 0 30rpx 0 0;
  // padding-right: 20rpx;
  // width: 468rpx;
  height: 56rpx;
  // background: url("https://img.shinemang.com/gachaStatic/static/img/shanggui/tabs_bg.png");
  // background-size: 100% 100%;
  font-size: 28rpx;
  color: #666666;
  line-height: 28rpx;
  padding-left: 62rpx;
  padding-right: 62rpx;

  .tab_item {
    width: 136rpx;
    height: 56rpx;
    // background: #EEEEEE;
    // border-radius: 28rpx 28rpx 28rpx 28rpx;
    display: flex;
    color: #8d8d94;
    font-weight: bold;
    align-items: center;
    justify-content: center;
    line-height: 56rpx;
    margin-right: 16rpx;
    position: relative;
    .line {
      width: 64rpx;
      height: 12rpx;
      background: linear-gradient(90deg, #31e597 0%, #40e0ea 100%);
      border-radius: 6rpx 6rpx 6rpx 6rpx;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 4rpx;
    }
    text {
      position: relative;
      z-index: 2;
    }
    &:first-child {
      // margin-left: -16rpx;
    }
    &:last-of-type {
      // margin-right: 10rpx;
    }

    &.active {
      // background: linear-gradient( 90deg, #31E597 0%, #40E0EA 100%);
      color: #1a1a1a;
      // margin-top: -10rpx;
      // color: #333;
      // width: 156rpx;
      // height: 86rpx;
      // line-height: 76rpx;
      // font-weight: bold;
      // background: url("https://img.shinemang.com/gachaStatic/static/img/shanggui/tab_bg.png");
      // background-size: 100% 100%;
      // font-size: 30rpx;
    }
  }
}

.shanggui_con {
  width: 100%;
  height: calc(100% - 190rpx);
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 2;

  .p_lists {
    height: calc(100%);
    border-radius: 0 50rpx 0 0;
    // background: #F4F4F4;
    padding: 32rpx;
    padding-top: 40rpx;
  }
}

.order_list {
  height: 100%;
  overflow-y: auto;
}

.order_item {
  background-color: #fff;
  border-radius: 16rpx;
  // padding: 20rpx 26rpx;
  padding: 32rpx 24rpx;
  width: 100%;
  // height: 208rpx;
  margin-bottom: 16rpx;
  color: #8d8d94;
  .title {
    display: flex;
    justify-content: space-between;
    font-size: 28rpx;
    color: #1a1a1a;
    align-items: center;
    font-weight: bold;
    .status {
      font-size: 24rpx;
       color: #8d8d94;
       font-weight: normal;
    }
  }
  .time {
    font-size: 24rpx;
     margin-top: 12rpx;
  }
  .code {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12rpx;
font-size: 24rpx;
    .copyCode {
      width: 550rpx;
      height: 48rpx;
      background: #f5f6f8;
      border-radius: 8rpx 8rpx 8rpx 8rpx;
      padding: 0 16rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .copy {
        color: #01c2d0;
      }
    }
  }
}
</style>
