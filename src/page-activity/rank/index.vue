<template>
  <view class="rankContent">
    <x-navbar :whiteBack="true" tcolor="#fff" tit="星光夺赏榜" />
    <div class="balance_con">
      <div class="topContent">
        <view v-if="topThree.length">
          <div class="topOne">
            <img class="bgc" src="../../static/new/rank1.png" alt="" />
            <img
              v-if="topThree[1]['profile']"
              :src="topThree[1]['profile'] | active"
              class="avator"
              alt=""
            />
            <div class="name ellipsis">{{ topThree[1]["userName"] }}</div>
            <div class="amount">{{ topThree[1]["point"] }}</div>
          </div>
          <div class="topTwo">
            <img class="bgc" src="../../static/new/rank2.png" alt="" />
            <img
              v-if="topThree[0]['profile']"
              :src="topThree[0]['profile'] | active"
              class="avator"
              alt=""
            />
            <div class="name ellipsis">{{ topThree[0]["userName"] }}</div>
            <div class="amount">{{ topThree[0]["point"] }}</div>
          </div>
          <div class="topThree">
            <img class="bgc" src="../../static/new/rank3.png" alt="" />
            <img
              v-if="topThree[2]['profile']"
              :src="topThree[2]['profile'] | active"
              class="avator"
              alt=""
            />
            <div class="name ellipsis">{{ topThree[2]["userName"] }}</div>
            <div class="amount">{{ topThree[2]["point"] }}</div>
          </div>
        </view>

        <div class="rule">
          <img src="../../static/new/rule.png" alt="" />
          <view
            @click="
              goto('/pages/common/rulepop', { val: 'LuckExpRankingRules' })
            "
            >规则</view
          >
        </div>
        <div @click="toRankRewards" class="reward">奖品列表</div>
      </div>
      <div class="countDown" v-if="residuetime > 0">
        <span v-if="countDown">活动开始倒计时：</span>
        <span v-else>本期活动倒计时：</span>
        <u-count-down :time="residuetime" @change="rtimeChange">
          <view class="timetxt">
            <text>{{ timeData.days }}天</text>
            <text>{{ timeData.hours }}小时</text>
            <text>{{ timeData.minutes }}分</text>
            <text>{{ timeData.seconds }}秒</text>
          </view>
        </u-count-down>
      </div>
      <scroll-view scroll-y class="rankList">
        <div class="list">
          <div v-for="value in rank" :key="value.no" class="item">
            <div class="leftInfo">
              <div class="rank">{{ value.no }}</div>
              <img :src="value.profile | active" alt="" />
              <div class="name ellipsis">  {{ value.userName }}</div>
            </div>
            <div class="count">星光积分{{ value.point }}</div>
          </div>
         
        </div>
      </scroll-view>
    </div>

    <div v-if="rankDetail" class="otherRank">
      <div class="leftInfo">
        <div class="rank">{{ myrank.no || "-" }}</div>
        <img src="../../static/bg1.png" alt="" />
        <div>
          <div class="name ellipsis">{{ myrank.userName }}</div>
          <div class="notListed" v-if="myrank.no > 1">距上一名差 {{ gap }}</div>
          <div class="notListed" v-if="myrank.no > 1">
            领先下一名 {{ gapNext }}
          </div>
          <div class="notListed" v-if="myrank.no == 1">
            第二名与你相差 {{ gapNext }}
          </div>
          <div class="notListed" v-else-if="myrank.no == 0">
            暂未上榜,距上榜还差{{ gap }}
          </div>
        </div>
      </div>
      <div class="count">星光积分{{ myrank.point }}</div>
    </div>
  </view>
</template>
<script>
import xNavbar from "@/components/modules/x-navbar";
import { post, activityLIst } from "@/utils/api.js";

// import autonym from "@/components/autonym/index.vue";
import { mapState, mapActions } from "vuex";

import { getSourceXcoinPoint, formatDate } from "@/utils/mgtv";
export default {
  data() {
    return {
      residuetime: 0,
      timeData: {},
      awards: [],
      rankDetail: "",
      myrank: "",
      gap: "",
      gapNext: "",
      topThree: [],
       rank: [],
    };
  },
  components: {
    xNavbar,

    // autonym,
  },
  onLoad(da) {
    this.loadDetail();
    // this.refund = JSON.parse(da.itemJson);
  },
  onShow() {},
  computed: {},

  methods: {
    toRankRewards(){
        uni.setStorageSync('rankRewads', this.awards)
        this.goto('/page-activity/rank/rankRewards')
    },
    rtimeChange(e) {
      this.timeData = e;
    },
    formatRankList(rawList = []) {
      const defaultRankItems = {
        2: {
          no: 2,
          point: 0,
          rankLabel: "永恒之光",
          userId: "0",
          userName: "虚位以待",
          class: "title2",
          rahmen: "",
        },
        1: {
          no: 1,
          point: 0,
          rankLabel: "奢华之光",
          userId: "0",
          userName: "虚位以待",
          class: "title1",
          rahmen: " rahmen1",
        },
        3: {
          no: 3,
          point: 0,
          rankLabel: "璀璨之光",
          userId: "0",
          userName: "虚位以待",
          class: "title3",
          rahmen: " rahmen3",
        },
      };

      // 2. 将原始数据转为对象映射（仅保留no=1/2/3，覆盖默认数据）
      const rankMap = rawList.reduce(
        (map, item) => {
          if ([1, 2, 3].includes(item.no)) {
            // 后端返回的有效数据覆盖默认值（保持后端返回的name/imgUrl）
            map[item.no] = { ...defaultRankItems[item.no], ...item };
          }
          return map;
        },
        { ...defaultRankItems },
      ); // 先复制默认数据，再用后端数据覆盖

      // 3. 按固定顺序（2→1→3）生成最终数组（必返回3项）
      const finalRankList = [
        rankMap[2], // 第一位：no=2（亚军）
        rankMap[1], // 第二位：no=1（冠军）
        rankMap[3], // 第三位：no=3（季军）
      ];

      return finalRankList;
    },
    async loadDetail() {
      //   let a = await activityLIst({ key: ["CostRank"] });
      //    this.imageUrlMap = a.activities[0].imageUrlMap;
      //         this.colorList = a.activities[0].paramsMap;
      //         this.message = a.activities[0];
      post("v1/activity/cost-rank/rank").then((res) => {
        if (!res.code) {
          this.rankDetail = res;
          this.gap = res.gap;
          this.gapNext = res.gapNext;
          this.myrank = res.current;
          this.rank = res.list.slice(3);
          this.topThree = res.list.slice(0, 3);

          this.topThree = this.formatRankList(res.list.slice(0, 3));
        }
      });
      post("v1/activity/cost-rank/config").then((res) => {
        if (!res.code) {
          for (const it of res.config.award) {
            let arr = new Array(it.noLimit - it.noStart + 1).fill(it);
            this.awards = [...this.awards, ...arr];
          }


          let startDate = res.config.startTime.replace(/-/g, "/");
          let start = new Date(startDate).getTime();
          let currentTime = new Date().getTime();
          if (currentTime < start) {
            this.residuetime = this.remainingTime(res.config.startTime);
            this.countDown = true;
          } else {
            this.residuetime = this.remainingTime(res.config.endTime);
            this.countDown = false;
          }
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.rankContent {
  background-color: #030401;
  width: 100%;
  height: 100vh;
}
.balance_con {
  position: absolute;
  // padding: 0 36rpx;
  width: 100%;
  height: 100%;
  bottom: 0;
  overflow: hidden;
  z-index: 3;
  .topContent {
    width: 750rpx;
    height: 800rpx;
    background: url("../../static/new/rankBgc.png");
    background-size: 100% 100%;
    position: relative;
    .topOne {
      width: 380rpx;

      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 176rpx;
      padding-top: 27%;
      .bgc {
        width: 380rpx;
        height: 380rpx;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
      }
      .avator {
        width: 108rpx;
        height: 108rpx;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 50%;
        top: 27%;
      }
      div {
        color: #a33500;
        font-size: 28rpx;
        text-align: center;
        position: relative;
        z-index: 4;
        font-weight: 600;
        &.name {
          max-width: 150rpx;
          margin: auto;
        }
        &.amount {
          width: 160rpx;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 40rpx;
          background: linear-gradient(
            90deg,
            rgba(245, 172, 40, 0) 0%,
            #f5ac28 40%,
            #f5ac28 60%,
            rgba(245, 172, 40, 0) 100%
          );
          border-radius: 0rpx 0rpx 0rpx 0rpx;
          border: 2rpx solid;
          border-image: linear-gradient(
              90deg,
              rgba(255, 217, 135, 0),
              rgba(255, 188, 42, 1),
              rgba(255, 188, 42, 0.86),
              rgba(255, 217, 135, 0)
            )
            2 2;
        }
      }
    }
    .topTwo {
      width: 272rpx;
      height: 272rpx;

      position: absolute;
      left: 10rpx;
      top: 390rpx;
      padding-top: 18%;
      .bgc {
        width: 272rpx;
        height: 272rpx;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
      }
      .avator {
        width: 100rpx;
        height: 100rpx;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 50%;
        top: 8%;
      }
      div {
        color: #003b76;
        font-size: 28rpx;
        text-align: center;
        position: relative;
        z-index: 4;
        font-weight: 600;
        &.name {
          max-width: 150rpx;
          margin: auto;
        }
        &.amount {
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 160rpx;
          height: 40rpx;
          background: linear-gradient(
            90deg,
            rgba(101, 165, 230, 0) 0%,
            rgba(101, 165, 230, 0.8) 40%,
            rgba(101, 165, 230, 0.8) 60%,
            rgba(101, 165, 230, 0) 100%
          );
          border-radius: 0rpx 0rpx 0rpx 0rpx;
          border: 2rpx solid;
          border-image: linear-gradient(
              90deg,
              rgba(151, 212, 255, 0),
              rgba(151, 212, 255, 1),
              rgba(151, 212, 255, 0.86),
              rgba(151, 212, 255, 0)
            )
            2 2;
        }
      }
    }
    .topThree {
      width: 272rpx;
      height: 272rpx;

      position: absolute;
      right: 10rpx;
      top: 390rpx;
      padding-top: 18%;
      .bgc {
        width: 272rpx;
        height: 272rpx;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
      }
      .avator {
        width: 100rpx;
        height: 100rpx;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 50%;
        top: 8%;
      }
      div {
        color: #841024;
        font-size: 28rpx;
        text-align: center;
        position: relative;
        z-index: 4;
        font-weight: 600;
        &.name {
          max-width: 150rpx;
          margin: auto;
        }
        &.amount {
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 160rpx;
          height: 40rpx;
          background: linear-gradient(
            90deg,
            rgba(241, 113, 137, 0) 0%,
            rgba(241, 113, 137, 0.7) 40%,
            rgba(241, 113, 137, 0.7) 60%,
            rgba(241, 113, 137, 0) 100%
          );
          border-radius: 0rpx 0rpx 0rpx 0rpx;
          border: 2rpx solid;
          border-image: linear-gradient(
              90deg,
              rgba(255, 191, 203, 0),
              rgba(255, 191, 203, 1),
              rgba(255, 191, 203, 0.86),
              rgba(255, 191, 203, 0)
            )
            2 2;
        }
      }
    }

    .rule {
      position: absolute;
      right: 0;
      top: 208rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      // width: 100rpx;
      padding: 0 8rpx;
      border-radius: 20rpx 0 0 20rpx;
      height: 40rpx;
      background: rgba(105, 75, 51, 0.6);
      font-size: 24rpx;
      color: #fff;
      color: 24rpx;
      line-height: 40rpx;
      img {
        width: 32rpx;
        height: 32rpx;
        margin-right: 4rpx;
        vertical-align: middle;
      }
    }
    .reward {
      width: 128rpx;
      display: flex;
      position: absolute;
      right: 0;
      top: 280rpx;
      border-radius: 24rpx 0 0 24rpx;

      align-items: center;
      justify-content: center;
      font-size: 24rpx;
      color: #fde27d;
      font-weight: bold;
      height: 48rpx;
      background: linear-gradient(180deg, #623c1d 0%, #c87a3b 100%);
      border: 2rpx solid rgba(253, 226, 125, 0.6);
      // border-image: linear-gradient(90deg, rgba(253, 226, 125, 1), rgba(253, 226, 125, 0)) 2 2;
    }
  }
  .countDown {
    width: 686rpx;
    height: 48rpx;
    background: linear-gradient(
      90deg,
      rgba(97, 51, 28, 0) 0%,
      #61331c 30%,
      #61331c 70%,
      rgba(97, 51, 28, 0) 100%
    );
    border-radius: 0rpx 0rpx 0rpx 0rpx;
    margin: auto;
    display: flex;
    align-items: center;
    line-height: 48rpx;
    justify-content: center;
    color: #ffc882;
    font-size: 24rpx;
    margin-top: -140rpx;
    position: relative;
    z-index: 3;
  }
  .rankList {
    width: 100%;
    margin-top: 16rpx;
    // margin-top: -120rpx;
    height: calc(100% - 730rpx);
    position: relative;
    z-index: 3;

    .list {
      width: 702rpx;
      margin: auto;
      padding-bottom: 160rpx;
      .item {
        width: 702rpx;
        height: 120rpx;
        background: url("../../static/new/otherBg.png");
        background-size: 100% 100%;
        padding: 0 32rpx;
        display: flex;
        align-items: center;
        color: #fcceb6;
        margin-bottom: 16rpx;
        &:last-child {
          margin-bottom: 0rpx;
        }

        justify-content: space-between;

        .leftInfo {
          display: flex;
          align-items: center;
          img {
            width: 80rpx;
            height: 80rpx;
            border-radius: 50%;
            margin-left: 32rpx;
            margin-right: 16rpx;
          }
        }
        .rank {
          font-size: 32rpx;
          font-weight: bold;
        }
        .name {
          font-size: 28rpx;
          max-width: 230rpx;
        }
        .count {
          font-size: 24rpx;
        }
      }
    }
  }
}

.otherRank {
  position: fixed;
  width: 718rpx;
  height: 120rpx;
  background: url("../../static/new/myBg.png");
  background-size: 100% 100%;
  left: 50%;
  transform: translateX(-50%);
  bottom: 50rpx;
  z-index: 88;
  display: flex;
  align-items: center;
  padding: 0 32rpx;
  color: #ffd7b4;
  justify-content: space-between;

  .leftInfo {
    display: flex;
    align-items: center;
    img {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      margin-left: 32rpx;
      margin-right: 16rpx;
    }
  }
  .rank {
    font-size: 32rpx;
    font-weight: bold;
  }
  .name {
    font-size: 28rpx;
    max-width: 300rpx;
  }
  .count {
    font-size: 24rpx;
  }
  .notListed {
    color: #ffd7b4;
    opacity: 0.5;
    font-size: 20rpx;
  }
}
</style>
