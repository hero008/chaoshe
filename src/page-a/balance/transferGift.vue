<template>
    <view class="balance">
        <x-navbar tit="转赠记录" />
        <div class="balance_con" :style="{ height: conHeight }">
            <!-- <div class="top_cord">
                <div class="tit flex_r flex_ac flex_jb">
                    <view
                        class="t_msg1 flex_r flex_ac"
                        @click="
                            goto('/pages/common/rulepop', {
                                val: 'ServiceAgreement',
                            })
                        "
                        >可用金币<view class="ico"></view
                    ></view>
                    <view class="t_msg">1枚金币=1元RMB</view>
                </div>
                <div class="B_num flex_r flex_ac flex_jc">
                    <img
                        src="https://img.shinemang.com/gachaStatic/static/img/pay/gold.png"
                        class="m_ico"
                    />
                    <div class="m_num">{{ balance || "0.00" }}</div>
                </div>
            </div> -->
            <view class="tabs_two flex_r">
                <view class="tab_item" :class="{active:i.type==active}" @click="ontab2(i,s)" v-for="(i,s) in navbar" :key="s">
                    <text>{{i.name}}</text>
                    <view v-if="i.type==active" class="line"></view>
                </view>
            </view>
            <div class="bill_log">
                <!-- <div class="tit flex_r flex_ac flex_jb">
                    <span>存储记录</span>
                </div> -->
                <div class="box">
                    <scroll-view
                        :scroll-y="true"
                        class="list"
                        @scrolltolower="onReachScollBottom"
                        :lower-threshold="400"
                    >
                        <div
                            class="li_item "
                            v-for="(item, index) in transactionList"
                            :key="index"
                        >
                        
                            <view class="listItems">
                                <view  @click="ondetail(value.id)" :key="index" v-for="(value,index) in item.item" class="item">
                                    <div :style="{
                                        backgroundImage:`url(${value.img})`
                                    }" class="img">
                                    
                                  <view class="count">
                                        <text>{{ value.point }}星币</text>
                                        <text>x{{value.num}}</text>
                                    </view>
                                </div>
                                    <!-- <img  :src="value.img" alt=""> -->
                                    <view class="name ellipsis">{{value.name}}</view>
                                  
                                </view>
                            </view>

                             <view class="itb flex_jb flex_r">
                                <view v-if="active ==0" class="itb2">转赠给({{
                                   item.targetUserId
                                }})</view>
                                  <view v-else class="itb2">({{
                                   item.userId
                                }})转赠给我</view>
                                <view class="itb1">{{ item.decomposeXPoint }}星币</view>
                            </view>
                              <view class="itb flex_jb flex_r">
                                <view v-if="active == 0" class="itb1">转赠时间</view>
                                  <view v-else class="itb1">获赠时间</view>
                                <view class="itb1">{{ item.createdAt }}</view>
                            </view>
                            <!-- <view class="itb">{{item.state == 2?'已成功':'待处理'}}</view> -->
                        </div>
                           <u-empty v-if="transactionList.length < 1" text="暂无记录"
                            icon="https://img.shinemang.com/gachaStatic/static/img/home/empty.png" :marginTop="50" />
                    </scroll-view>

                   
                </div>
            </div>
        </div>
        <!-- 身份证信息认证 -->
        <!-- <autonym
            @onAutonym="onClickAutonym"
            ref="autonym"
            :visible="showAutonym"
        /> -->
        <popUpVue ref="popUp" @popUp="onClickPopUp" />
           <gachaDetails ref="gachaDetails" />
    </view>
</template>
<script>
import xNavbar from "@/components/modules/x-navbar";
import { post } from "@/utils/api.js";
import xBtn from "@/components/modules/x-btn";
import xPay from "@/components/x-pay/index.vue";
// import autonym from "@/components/autonym/index.vue";
import { mapState, mapActions } from "vuex";
import popUpVue from "./popUp.vue";
import {groupByItemName1} from '../../utils/mgtv';

export default {
    data() {
        return {
              navbar: [ {
                name:"转赠记录",
                type:0
              },{
                name:"获赠记录",
                type:1
              },],
            active: 0,
            balance: 0,
            pageda: {
                page: 1,
                page_size: 20,
                total: 20,
            },
            transactionList: [],
            showAutonym: false,
            closeAutonym: false,
            refund: { refundAmountLimit: "0", refundResidueCnt: 0 }, //单日退款次数上限
        };
    },
    components: {
        xNavbar,
        xBtn,
        xPay,
        // autonym,
        popUpVue,
    },
    onLoad(da) {
        // this.refund = JSON.parse(da.itemJson);
    },
    onShow() {
        this.getTransaction();
    },
    computed: {
        ...mapState(["userInfo"]),
        padTop() {
            let da = this.MBInfo();
            return da.top + da.height + "px";
        },
           conHeight() {
            let h = this.SystemInfo.screenHeight;
            let va = this.MBInfo();
            let th = va.height + va.top + 10;
            let str = h - th + "px";
            return str;
        },
    },
    mounted() {
        this.closeAutonym = this.userInfo.isAuthenticated;
    },
    watch: {
        svgaData() {
            this.userInfo.isAuthenticated;
        },
    },
    methods: {
          ondetail(id) {
            this.gachaDetailsMethod(this, id);
        },
       ontab2(i, s) {
            this.transactionList = [];
            this.active = i.type;
            this.pageda.page = 1;
            this.getTransaction();
        },
        ...mapActions(["asyncUpdateInfo", "asyncUpBalance"]),
        async onClickAutonym() {
            this.showAutonym = false;
            let a = await post("v1/user/self/get", {
                user_id: this.userInfo.id,
            });
            this.closeAutonym = a.isAuthenticated;
            if (this.closeAutonym) this.onClickWithdrawal();
        },
        // 获取流水
        getTransaction() {
            this.balance = this.userInfo.gold;
            post("v1/cabinet/donation/record/list", {
                mode:this.active == 0 ? 1:2, 
                ...this.pageda,
            }).then((res) => {
                if (this.pageda.page == 1) this.transactionList = [];
                if(res.list && res.list.length>0){
                   res.list.forEach((item)=>{
                    item.item = groupByItemName1(item.item)
                 })
                }
                
         
                this.transactionList = this.transactionList.concat(
                    res.list
                );

                console.log(this.transactionList)
                this.pageda.total = res.total;
            });
        },
        onReachScollBottom() {
            if (this.pageda.total > this.pageda.page * this.pageda.page_size) {
                this.pageda.page++;
                this.getTransaction();
            }
        },
        onClickWithdrawal() {
            // if (!this.userInfo.isAuthenticated && !this.closeAutonym) {
            //     this.showAutonym = !this.userInfo.isAuthenticated; // 是否已实名认证;
            //     return;
            // }
            // if (!this.refund.refundResidueCnt) {
            //     uni.$u.toast("今日提现次数已达上限！");
            //     return;
            // }

            // if (this.balance) {
            //     this.$refs.popUp.open(this.refund);
            // } else uni.$u.toast("金币不足！");
        },

        getOpraType(type) {
            return getApp().globalData.RechargeTypeMean[type];
        },
        onClickPopUp() {
            (this.pageda = {
                page: 1,
                page_size: 20,
                total: 20,
            }),
                this.getTransaction();
        },
    },
    watch: {
        "$store.state.userInfo.gold": {
            handler(newVal) {
                this.balance = newVal;
            },
        },
    },
};
</script>
<style lang='scss' scoped>
.tabs_two {
    margin-bottom: 24rpx;
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
       padding-left: 24rpx;
    // padding-right: 62rpx;

    .tab_item {
      width: 136rpx;
height: 56rpx;
// background: #EEEEEE;
// border-radius: 28rpx 28rpx 28rpx 28rpx;
display: flex;
color: #8D8D94;
font-weight: bold;
align-items: center;
justify-content: center;
line-height: 56rpx;
margin-right: 16rpx;
position: relative;
.line{
    width: 64rpx;
height: 12rpx;
background: linear-gradient( 90deg, #31E597 0%, #40E0EA 100%);
border-radius: 6rpx 6rpx 6rpx 6rpx;
position: absolute;
left: 50%;
transform: translateX(-50%);
bottom: 4rpx;
}
text{
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
            color: #1A1A1A;
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
::v-deep .u-form-item__body__left__content__label {
    font-weight: bold;
    font-size: 28rpx;
    color: #000000;
}
::v-deep .u-form-item__body__left {
    margin-right: 0;
}
::v-deep .u-input--square {
    width: 390rpx;
    height: 80rpx;
    background: #ebeef3;
    border-radius: 16rpx;
    border: 0;
}
::v-deep .u-form-item__body {
    margin-bottom: 40rpx;
}
.balance {
    width: 100vw;
    height: 100vh;
    &::after {
        content: "";
        width: 100vw;
        height: 600rpx;
        left: 0;
        top: 0;
        position: absolute;
        z-index: 1;
        background: url('https://img.shinemang.com/gachaStatic/chaogui/topBg.png');
        background-size: 100% 100%;
      }
}
.navbar_x {
    position: relative;
}
.balance_con {
    position: absolute;
    padding: 0 36rpx;
    width: 100%;
    height: calc(100% - 70rpx);
    bottom: 0;
    overflow: hidden;
    z-index: 3;
    .top_cord {
        width: 686rpx;
        height: 308rpx;
        background: linear-gradient(118deg, #845af1 0%, #78efe9 100%);
        border-radius: 32rpx;
        padding: 32rpx;
        margin-bottom: 16rpx;
        color: #fff;

        .tit {
            font-weight: 500;
            font-size: 28rpx;
            .t_msg1 {
                .ico {
                    margin-left: 8rpx;
                    width: 32rpx;
                    height: 32rpx;
                    background-image: url("https://img.shinemang.com/gachaStatic/matt/static/img/index/group_3.png");
                    background-size: 100% 100%;
                }
            }
            .t_msg {
                font-weight: 500;
                font-size: 24rpx;
                .ico {
                    margin-left: 8rpx;
                    width: 32rpx;
                    height: 32rpx;
                    background-image: url("https://img.shinemang.com/gachaStatic/static/img/home/group_4.png");
                    background-size: 100% 100%;
                }
            }
        }

        .B_num {
            margin: 40rpx 0;

            .m_ico {
                width: 48rpx;
                height: 48rpx;
                margin-right: 16rpx;
            }

            .m_num {
                font-size: 48rpx;
                font-weight: 700;

                &::after {
                    content: "枚";
                    font-weight: 500;
                    font-size: 24rpx;
                    margin-left: 8rpx;
                }
            }
        }

        .btns {
            margin: auto;
            width: 220rpx;
            height: 64rpx;
            line-height: 64rpx;
            text-align: center;
            font-weight: bold;
            font-size: 28rpx;
            color: #000000;
            background: #fff;
            border-radius: 32rpx;
        }
    }
}

.bill_log {
    width: 100%;
     height: calc(100% - 80rpx);
    background-color: #fff;
    border-radius: 32rpx 32rpx 0 0;

    .tit {
        padding: 32rpx;
        font-weight: 800;
        font-size: 32rpx;
    }

    .box {
        width: 100%;
        height: calc(100%);
        border-radius: 32rpx;
        padding: 0 32rpx;

        .list {
            height: calc(100% - 30rpx);

            .li_item {
                // height: 112rpx;
                width: 100%;
                font-weight: 500;
                font-size: 20rpx;
                color: #383228;
                border-bottom: 2rpx solid #e2e1e3;
                padding: 16rpx 0;
                &:last-child{
                	border: none;
                }
                .listItems{
                   
                    display: flex;
                    flex-wrap: nowrap;
                    overflow-x: auto;
                    .item{
                        margin-right: 24rpx;
                        &:last-child{
                            margin-right: 0;
                        }
                        // display: flex;
                        // justify-content: space-between;
                        // align-items: center;
                        // line-height: 36rpx;
                        width: 160rpx;
                        // height: 160rpx;
                        .img{
                            width: 160rpx;
                            height: 160rpx;
                            border-radius: 12rpx;
                            background-size: 100% 100%;
                            position: relative;
                            .count{
                                position: absolute;
                                bottom: 0;
                                border-radius: 0 0 12rpx 12rpx;
                                width: 100%;
                                background-color: rgba(0,0,0,.3);
                                padding: 6rpx 6rpx;
                                font-size: 18rpx;

                                color: #fff;
                                display: flex;
                                align-items: center;
                                justify-content: space-between;
                            }
                        }
                        .name{
                            font-size: 24rpx;
                            color: #1A1A1A;
                            // max-width: 500rpx;
                        }
                        .count{
                            font-size: 22rpx;

                        }
                    }
                }
            }
        }
        .itb {
            margin-top: 20rpx;
            .itb1 {
                font-weight: 500;
                font-size: 24rpx;
                color: #aaacbb;
            }

            .itb2 {
                font-weight: bold;
                font-size: 28rpx;
                color: #000000;
            }
        }

        .itb3 {
            font-weight: bold;
            font-size: 28rpx;
            color: #000000;
        }
    }
}

.before {
    &::before {
        content: "*";
        font-weight: 500;
        font-size: 24rpx;
        color: #fa80c7;
        margin-right: 4rpx;
    }
}
</style>