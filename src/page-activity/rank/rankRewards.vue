.
<template>
  <view class="rankContent">
    <x-navbar :whiteBack="true" tcolor="#fff" tit="奖品列表" />
    <div class="balance_con" :style="{ height: conHeight }">
      <div class="topContent">
        <div class="title">
          <img src="../../static/new/leftIcon.png" alt="" />
          <span>排名奖励</span>
          <img src="../../static/new/rightIcon.png" alt="" />
        </div>
        <div class="topRewards">
          <div @click="ondetail(towAwards.itemList[0].id)" v-if="towAwards" class="topTwo">
            <img :src="towAwards.thumb" alt="" />
            <div class="name ellipsis">{{ towAwards.itemList[0].name }}</div>
            <div class="rank">TOP2</div>
          </div>
          <div   @click="ondetail(oneAwards.itemList[0].id)" v-if="oneAwards"  class="topOne">
             <img :src="oneAwards.thumb" alt="" />
            <div class="name ellipsis">{{ oneAwards.itemList[0].name }}</div>
            <div class="rank">TOP1</div>
          </div>
          <div @click="ondetail(threeAwards.itemList[0].id)"  v-if="threeAwards"  class="topThree">
            <img :src="threeAwards.thumb" alt="" />
            <div class="name ellipsis">{{ threeAwards.itemList[0].name }}</div>
            <div class="rank">TOP3</div>
          </div>
        </div>
      </div>
      <scroll-view scroll-y class="rankList">
        <div class="list">
          <div @click="ondetail(value.itemList[0].id)" v-for="(value,index) in otherAwards" :key="index" class="item">
            <div class="top">TOP{{ index+4 }}</div>
            <img :src="value.thumb" alt="" />
            <div class="name ellipsis">{{ value.itemList[0].name }}</div>
          </div>
        </div>
      </scroll-view>
    </div>
     <gachaDetails ref="gachaDetails" />
  </view>
</template>
<script>
import xNavbar from "@/components/modules/x-navbar";

// import autonym from "@/components/autonym/index.vue";
export default {
  data() {
    return {
        awards:[],
        oneAwards:'',
        towAwards:'',
        threeAwards:'',
        otherAwards:[]
    };
  },
  components: {
    xNavbar,

    // autonym,
  },
  onLoad(da) {
    var awards = uni.getStorageSync('rankRewads')
    this.otherAwards = awards.slice(3)
    this.oneAwards = awards[0]
     this.towAwards = awards[1]
      this.threeAwards = awards[2]
    // this.refund = JSON.parse(da.itemJson);
  },
  onShow() {
    this.getTransaction();
  },
  computed: {
    conHeight() {
      let h = this.SystemInfo.screenHeight;
      let va = this.MBInfo();
      let th = va.height + va.top + 10;
      let str = h - th + "px";
      return str;
    },
  },

  methods: {
      ondetail(id) {
            this.gachaDetailsMethod(this, id);
        },
    // 获取流水
    getTransaction() {
      //     if(this.active == "星光积分"){
      //         post("v1/activity/cost-award/log/list", {
      //             ...this.pageda,
      //         }).then((res) => {
      //             console.log(res);
      //             res.list.forEach((item)=>{
      //                 const data = new Date(item.createdAt)
      //                 item.createdAt = formatDate(data)
      //             })
      //             if (this.pageda.page == 1) this.transactionList = [];
      //             this.transactionList = this.transactionList.concat(
      //                 res.list
      //             );
      //             this.pageda.total = res.total;
      //         });
      //     }else{
      //     post("v1/wallet/transaction/list", {
      //         type: 4,
      //         ...this.pageda,
      //     }).then((res) => {
      //         console.log(res);
      //         if (this.pageda.page == 1) this.transactionList = [];
      //         this.transactionList = this.transactionList.concat(
      //             res.transactions
      //         );
      //         this.pageda.total = res.total;
      //     });
      // }
    },
    onReachScollBottom() {
      if (this.pageda.total > this.pageda.page * this.pageda.page_size) {
        this.pageda.page++;
        this.getTransaction();
      }
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
    width: 702rpx;
    height: 472rpx;
    background: #140c02;
    border-radius: 24rpx 24rpx 24rpx 24rpx;
    border: 1rpx solid #37291e;
    margin: auto;
    .title {
      width: 702rpx;
      height: 124rpx;
      background: linear-gradient(180deg, #462c0f 0%, rgba(31, 23, 12, 0) 100%);
      border-radius: 24rpx 24rpx 24rpx 24rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: #ffd7b4;
      font-size: 32rpx;
      span {
        margin: 0 24rpx;
      }
      img {
        width: 40rpx;
        height: 40rpx;
      }
    }

    .topRewards {
      display: flex;
      justify-content: center;
      align-items: flex-end;
    }
    .topOne {
      width: 254rpx;
      margin: 0 16rpx;
      height: 320rpx;
      padding-top: 32rpx;
      background: linear-gradient(180deg, rgba(31, 23, 12, 0) 0%, #915521 100%);
      border-radius: 24rpx 24rpx 24rpx 24rpx;
      text-align: center;
      img {
        width: 176rpx;
        height: 176rpx;
      }
      .name {
        color: #f8ddb6;
        font-size: 26rpx;
        margin-top: 16rpx;
        line-height: 32rpx;
        padding: 0 8rpx;
      }
      .rank {
        color: #ffca84;
        font-size: 28rpx;
      }
    }
    .topTwo {
      width: 184rpx;
      height: 260rpx;
      background: linear-gradient(180deg, rgba(31, 23, 12, 0) 0%, #59310f 100%);
      border-radius: 24rpx 24rpx 24rpx 24rpx;
      padding-top: 24rpx;
      text-align: center;
      img {
        width: 136rpx;
        height: 136rpx;
      }
      .name {
        color: #f8ddb6;
        font-size: 22rpx;
        margin-top: 16rpx;
          padding: 0 8rpx;
        // line-height: 32rpx;
      }
      .rank {
        color: #ffca84;
        font-size: 20rpx;
      }
    }
    .topThree {
      width: 184rpx;
      height: 260rpx;
      background: linear-gradient(180deg, rgba(31, 23, 12, 0) 0%, #59310f 100%);
      border-radius: 24rpx 24rpx 24rpx 24rpx;
      padding-top: 24rpx;
      text-align: center;
      img {
        width: 136rpx;
        height: 136rpx;
      }
      .name {
        color: #f8ddb6;
        font-size: 22rpx;
        margin-top: 16rpx;
         padding: 0 8rpx;
        // line-height: 32rpx;
      }
      .rank {
        color: #ffca84;
        font-size: 20rpx;
      }
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
    height: calc(100% - 472rpx);
    position: relative;
    z-index: 3;

    .list {
      width: 100%;
      padding-left: 24rpx;
      margin: auto;
      padding-bottom: 30rpx;
      display: flex;
      flex-wrap: wrap;

      .item {
        width: 220rpx;
        height: 324rpx;
        background: #271f17;
        border-radius: 24rpx 24rpx 24rpx 24rpx;
        margin-bottom: 16rpx;
        margin-right: 22rpx;
        padding-top: 16rpx;
        text-align: center;
        &:nth-child(3n) {
          margin-right: 0;
        }
        .top {
          width: 204rpx;
          height: 48rpx;
          background: linear-gradient(
            90deg,
            rgba(122, 103, 85, 0) 0%,
            rgba(122, 103, 85, 0.3) 40.38%,
            rgba(122, 103, 85, 0.3) 60%,
            rgba(122, 103, 85, 0) 100%
          );
          border-radius: 0rpx 0rpx 0rpx 0rpx;
          margin: auto;
          text-align: center;
          line-height: 48rpx;
          color: #c1aa8b;
          font-size: 24rpx;
        }
        img {
          width: 188rpx;
          height: 188rpx;
          margin-top: 8rpx;
        }
        .name {
          color: #b3b3b3;
          font-size: 22rpx;
          padding: 0 16rpx;
          font-weight: 600;
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
  }
  .count {
    font-size: 24rpx;
  }
  .notListed {
    color: #ffd7b4;
    opacity: 0.5;
    font-size: 24rpx;
  }
}
</style>
