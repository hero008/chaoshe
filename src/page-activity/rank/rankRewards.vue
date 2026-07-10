.<template>
    <view class="rankContent">
        <x-navbar :whiteBack=true tcolor="#fff" tit="奖品列表" />
        <div :style="{ height: conHeight }" class="balance_con">
           <div class="topContent">
               <div class="topOne">
                <div class="name">234</div>
                <div class="amount">234</div>
               </div>
               <div class="topTwo">
                 <div class="name">234</div>
                <div class="amount">234</div>
               </div>
               <div class="topThree">
                 <div class="name">234</div>
                 <div class="amount">234</div>
               </div>

               <div class="rule">
                  <img src="../../static/new/rule.png" alt="">
                  <view>规则</view>
               </div>
               <div class="reward">奖品列表</div>
           </div>
           <div class="countDown">本期活动倒计时：8天8小时8分8秒</div>
           <scroll-view scroll-y  class="rankList">
               <div class="list">
                   <div class="item">
                       <div class="leftInfo">
                           <div class="rank">5</div>
                           <img src="../../static/bg1.png" alt="">
                           <div class="name">234234</div>
                       </div>
                       <div class="count">星光积分434</div>
                   </div>
                    <div class="item">
                       <div class="leftInfo">
                           <div class="rank">5</div>
                           <img src="../../static/bg1.png" alt="">
                           <div class="name">234234</div>
                       </div>
                       <div class="count">星光积分434</div>
                   </div>
                    <div class="item">
                       <div class="leftInfo">
                           <div class="rank">5</div>
                           <img src="../../static/bg1.png" alt="">
                           <div class="name">234234</div>
                       </div>
                       <div class="count">星光积分434</div>
                   </div>
                    <div class="item">
                       <div class="leftInfo">
                           <div class="rank">5</div>
                           <img src="../../static/bg1.png" alt="">
                           <div class="name">234234</div>
                       </div>
                       <div class="count">星光积分434</div>
                   </div>
                    <div class="item">
                       <div class="leftInfo">
                           <div class="rank">5</div>
                           <img src="../../static/bg1.png" alt="">
                           <div class="name">234234</div>
                       </div>
                       <div class="count">星光积分434</div>
                   </div>
                    <div class="item">
                       <div class="leftInfo">
                           <div class="rank">5</div>
                           <img src="../../static/bg1.png" alt="">
                           <div class="name">234234</div>
                       </div>
                       <div class="count">星光积分434</div>
                   </div>
                    <div class="item">
                       <div class="leftInfo">
                           <div class="rank">5</div>
                           <img src="../../static/bg1.png" alt="">
                           <div class="name">234234</div>
                       </div>
                       <div class="count">星光积分434</div>
                   </div>
                    <div class="item">
                       <div class="leftInfo">
                           <div class="rank">5</div>
                           <img src="../../static/bg1.png" alt="">
                           <div class="name">234234</div>
                       </div>
                       <div class="count">星光积分434</div>
                   </div>
                    <div class="item">
                       <div class="leftInfo">
                           <div class="rank">5</div>
                           <img src="../../static/bg1.png" alt="">
                           <div class="name">234234</div>
                       </div>
                       <div class="count">星光积分434</div>
                   </div>
                    <div class="item">
                       <div class="leftInfo">
                           <div class="rank">5</div>
                           <img src="../../static/bg1.png" alt="">
                           <div class="name">234234</div>
                       </div>
                       <div class="count">星光积分434</div>
                   </div>
               </div>
           </scroll-view>
        </div>

       
      
    </view>
</template>
<script>
import xNavbar from "@/components/modules/x-navbar";
import { post } from "@/utils/api.js";

// import autonym from "@/components/autonym/index.vue";
import { mapState, mapActions } from "vuex";

import { getSourceXcoinPoint ,formatDate} from '@/utils/mgtv';
export default {
    data() {
        return {
           
        };
    },
    components: {
        xNavbar,
     
        // autonym,
    },
    onLoad(da) {
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
<style lang='scss' scoped>
.rankContent{
    background-color: #030401;
    width: 100%;
    height: 100vh;
}
.balance_con {
    position: absolute;
    // padding: 0 36rpx;
    width: 100%;
    height:100%;
    bottom: 0;
    overflow: hidden;
    z-index: 3;
    .topContent{
        width: 750rpx;
        height: 800rpx;
        background: url('../../static/new/rankBgc.png');
        background-size: 100% 100%;
        position: relative;
        .topOne{
            width: 380rpx;
            height: 380rpx;
            background: url('../../static/new/rank1.png');
            background-size: 100% 100%;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            top: 176rpx;
            padding-top: 27%;
            div{
                color: #A33500;
                font-size: 28rpx;
                  text-align: center;
                

                  &.amount{
                    width: 160rpx;
                    margin: auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                        height: 40rpx;
                        background: linear-gradient( 90deg, rgba(245,172,40,0) 0%, #F5AC28 40%, #F5AC28 60%, rgba(245,172,40,0) 100%);
                        border-radius: 0rpx 0rpx 0rpx 0rpx;
                        border: 2rpx solid;
                        border-image: linear-gradient(90deg, rgba(255, 217, 135, 0), rgba(255, 188, 42, 1), rgba(255, 188, 42, 0.86), rgba(255, 217, 135, 0)) 2 2;
                  }

            }
        }
         .topTwo{
            width: 272rpx;
            height: 272rpx;
            background: url('../../static/new/rank2.png');
            background-size: 100% 100%;
            position: absolute;
            left: 10rpx;
            top: 390rpx;
            padding-top: 18%;
            div{
                color: #003B76;
                font-size: 28rpx;
                text-align: center;
                &.amount{
                    margin: auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 160rpx;
                    height: 40rpx;
                    background: linear-gradient( 90deg, rgba(101,165,230,0) 0%, rgba(101,165,230,0.8) 40%, rgba(101,165,230,0.8) 60%, rgba(101,165,230,0) 100%);
                    border-radius: 0rpx 0rpx 0rpx 0rpx;
                    border: 2rpx solid;
                    border-image: linear-gradient(90deg, rgba(151, 212, 255, 0), rgba(151, 212, 255, 1), rgba(151, 212, 255, 0.86), rgba(151, 212, 255, 0)) 2 2;                  }

            }
        }
         .topThree{
            width: 272rpx;
            height: 272rpx;
            background: url('../../static/new/rank3.png');
            background-size: 100% 100%;
            position: absolute;
            right: 10rpx;
            top: 390rpx;
            padding-top: 18%;
            div{
                color: #841024;
                font-size: 28rpx;
                text-align: center;
                 &.amount{
                    margin: auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 160rpx;
                    height: 40rpx;
                    background: linear-gradient( 90deg, rgba(241,113,137,0) 0%, rgba(241,113,137,0.7) 40%, rgba(241,113,137,0.7) 60%, rgba(241,113,137,0) 100%);
                    border-radius: 0rpx 0rpx 0rpx 0rpx;
                    border: 2rpx solid;
                    border-image: linear-gradient(90deg, rgba(255, 191, 203, 0), rgba(255, 191, 203, 1), rgba(255, 191, 203, 0.86), rgba(255, 191, 203, 0)) 2 2;                 
                 }
            }
        }

        .rule{
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
            background:rgba(105, 75, 51, .6);
            font-size: 24rpx;
            color: #fff;
            color: 24rpx;
            line-height: 40rpx;
            img{
                width: 32rpx;
                height: 32rpx;
                margin-right: 4rpx;
                vertical-align: middle;
            }


        }
        .reward{
           width: 128rpx;
           display: flex;
           position: absolute;
           right: 0;
           top: 280rpx;
           border-radius: 24rpx 0 0 24rpx;

           align-items: center;
           justify-content: center;
           font-size: 24rpx;
           color: #FDE27D;
           font-weight: bold;
            height: 48rpx;
            background: linear-gradient( 180deg, #623C1D 0%, #C87A3B 100%);
            border: 2rpx solid rgba(253, 226, 125, .6);
            // border-image: linear-gradient(90deg, rgba(253, 226, 125, 1), rgba(253, 226, 125, 0)) 2 2;

        }
    }
    .countDown{
        width: 686rpx;
height: 48rpx;
background: linear-gradient( 90deg, rgba(97,51,28,0) 0%, #61331C 30%, #61331C 70%, rgba(97,51,28,0) 100%);
border-radius: 0rpx 0rpx 0rpx 0rpx;
margin: auto;
display: flex;
align-items: center;
line-height: 48rpx;
justify-content: center;
color: #FFC882;
font-size: 24rpx;
margin-top: -140rpx;
position: relative;
z-index: 3;

    }
    .rankList{
        width: 100%;
        margin-top: 16rpx;
        // margin-top: -120rpx;
        height: calc(100% - 730rpx);
        position: relative;
        z-index: 3;
       
        .list{
            width: 702rpx;
            margin: auto;
             padding-bottom: 160rpx;
            .item{
              width: 702rpx;
              height: 120rpx;
              background: url('../../static/new/otherBg.png');
              background-size: 100% 100%;
              padding: 0 32rpx;
              display: flex;
              align-items: center;
              color: #FCCEB6;
              margin-bottom: 16rpx;
              &:last-child{
                margin-bottom: 0rpx;
              }
             
              justify-content: space-between;

              .leftInfo{
                display: flex;
                align-items: center;
                img{
                    width: 80rpx;
                    height: 80rpx;
                    border-radius: 50%;
                    margin-left: 32rpx;
                    margin-right: 16rpx;
                }
              }
              .rank{
                font-size: 32rpx;
                 font-weight: bold;
              }
              .name{
                font-size: 28rpx;
              }
              .count{
                font-size: 24rpx;
              }
            }
        }
        
    }

}

.otherRank{
    position: fixed;
    width: 718rpx;
    height: 120rpx;
    background: url('../../static/new/myBg.png');
    background-size: 100% 100%;
    left: 50%;transform: translateX(-50%);
    bottom: 50rpx;
    z-index: 88;
    display: flex;
    align-items: center;
    padding: 0 32rpx;
    color: #FFD7B4;
    justify-content: space-between;
    
              .leftInfo{
                display: flex;
                align-items: center;
                img{
                    width: 80rpx;
                    height: 80rpx;
                    border-radius: 50%;
                    margin-left: 32rpx;
                    margin-right: 16rpx;
                }
              }
              .rank{
                font-size: 32rpx;
                 font-weight: bold;
              }
              .name{
                font-size: 28rpx;
              }
              .count{
                font-size: 24rpx;
              }
              .notListed{
                color: #FFD7B4;
                opacity: 0.5;
                font-size: 24rpx;
              }

}

</style>