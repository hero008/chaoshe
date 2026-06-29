<!-- 赏柜界面 -->
<template>
    <view class="shanggui" :class="{ mpWeixin: ISmp() }" :style="{ paddingTop: MBInfo().top + 36 + 'px' }">
        <view class="top_tabs">
            <!-- <u-tabs :list="navbar" @click="ontab" lineColor="#333" :activeStyle="activeStyl"></u-tabs> -->
            <!-- <view class="top_btn" @click="goto('/pages/common/rulepop', { val: 'ShippingRules' })">
                <span>星仓规则</span>
                <img class="ico" src="https://img.shinemang.com/gachaStatic/static/img/shanggui/group_3.png" />
            </view> -->
        </view>
        <div :style="{ paddingTop: MBInfo().top + 36 + 'px' }"  class="shanggui_con">
            <view class="flex_r flex_jb">
                <view class="tabs_two flex_r flex_jb">
                    <view class="tab_item" :class="{ active: i == active }" @click="ontab2(i, s)"
                        v-for="(i, s) in navbar2" :key="s">{{ i }}</view>
                </view>
               
               <!-- v-if="recycleState" -->
                <view class="recycle flex_r flex_ac" @click="onGoRecycle()" >
                    <img class="icon" src="https://img.shinemang.com/gachaStatic/static/img/shanggui/recycle.png" />
                    <view class="text">放生</view>
                </view> 
                <view  @click="goto('/pages/common/rulepop', { val: 'ShippingRules' })" class="rules">

                </view>
            </view>
            <view class="p_lists">
                <view class="tab flex_r flex_ac flex_jb">
                   
                    <view class="flex_r flex_ac">
                        <view class="btn " :class="{ active: data.hasOwnProperty('order_by_create_time') }"
                            @click="onBtn(0)">时间
                          <image
                            :src="data.hasOwnProperty('order_by_create_time')?'https://img.shinemang.com/gachaStatic/chaogui/up.png':'https://img.shinemang.com/gachaStatic/chaogui/down.png'"
                            mode="scaleToFill"
                          />
                        </view>
                        <view class="btn" :class="{ active: data.hasOwnProperty('order_by_inner_price') }"
                            @click="onBtn(1)">价值
                          <image
                            :src="data.hasOwnProperty('order_by_inner_price')?'https://img.shinemang.com/gachaStatic/chaogui/up.png':'https://img.shinemang.com/gachaStatic/chaogui/down.png'"
                            mode="scaleToFill"
                          />
                        </view>
                    </view>
                    <view class="flex_r">
                       <view class="teg">赏品共{{ totalReward || 0 }}个</view>
                       <view @click='toSendOther' class="teg" style='width:150rpx;background:linear-gradient(90deg, #31E597 0%, #40E0EA 100%)'>转赠</view>
                    </view>
                </view>
                <scroll-view @scrolltolower="onReachScollBottom" v-if="cabinetData && cabinetData.length"
                    class="ListScroll" :lower-threshold="400" :scroll-y="true">
                    <view class="lists_box">
                        <view class="lists">
                            <view class="item" v-for="(item, index) in cabinetData" :key="index">
                                <view class="item_img_box">
                                 <view class="item_img" :style="{
                                    backgroundImage: `url(${item.item.coverThumb})`,
                                }" @click="ondetail(item.itemId)">
                                    <!-- <view class="box_ico frame" v-if="item.state == 'CabinetStockState_InStock'"></view> -->
                                    <!-- <img src="https://img.shinemang.com/gachaStatic/static/img/shanggui/group_1.png"  class="box_ico" v-if="item.state =='CabinetStockState_InStock' " /> -->
                                    <!-- <view class="" v-if="
                                        item.state ==
                                        'CabinetStockState_OnDeal' ||
                                        item.state ==
                                        'CabinetStockState_Delivered'
                                    ">
                                        <img src="https://img.shinemang.com/gachaStatic/static/img/shanggui/group_2.png"
                                            class="box_ico" />
                                        <view class="item_txt">{{
                                            item.state ==
                                                "CabinetStockState_OnDeal"
                                                ? "发布中"
                                                : "发货中"
                                        }}
                                        </view>
                                    </view> -->
                                    <!-- {{
                                        item.item.saleType == 1
                                            ? "现货"
                                            : "预售"
                                    }} -->
                                    <view :style="{
                                        backgroundImage: `url(${item.item.saleType == 1?'https://img.shinemang.com/gachaStatic/chaogui/xianhuo.png':'https://img.shinemang.com/gachaStatic/chaogui/yushou.png'})`,
                                    }" class="item_txt1"></view>
                                </view>
                                </view>
                               
                                <view class="item_name ellipsis">{{
                                    item.item.name
                                    }}</view>
                                <view class="item_no ellipsis">{{
                                    item.itemId
                                    }}</view>
                            </view>
                        </view>
                    </view>
                </scroll-view>
                <u-empty v-else text="暂无赏品~" icon="https://img.shinemang.com/gachaStatic/static/img/home/empty.png"
                    :marginTop="50" />
            </view>
            <view class="foot_btn">

                <view v-show="userInfo.showMarket"  @click="goto('/pages/transaction/index')" class="selectToExchange"></view>
                <view @click="goto('/pages/shipments/selectGoods')" class="selectToSend"></view>
          
                <!-- <x-btn v-show="!userInfo.showMarket" txt="选择交易" cor="2" @click="goto('/pages/transaction/index')" />
            
                <x-btn txt="选择发货" cor="3" @click="goto('/pages/shipments/selectGoods')" /> -->
            </view>
        </div>
        <gachaDetails ref="gachaDetails" />
        <select-goods ref="addStock" @totalNums="(va) => { totalNums = va; }" @confirmSelect="SelectIds" isfilt="1"
            typeClass="0" />

        <show-modal></show-modal>

          <u-popup mode='center' :show="confirmSendOthers" @close="confirmSendOthers = false"  :closeable="true" round="20"
            bgColor="#fff">
            <div class="send_con">
                <div class="title">确认将一下商品转赠?</div>
                <scroll-view
                    class="sendList"
                    scroll-y
                >
                <view class="list">
                     <view v-for="value in sendInfo.info" :key="value.itemId" class="item">
                         <view class="name over">{{value.name}}</view>
                         <view class="count">x{{value.num}}</view>
                     </view>

                </view>
                    
                </scroll-view>

                <input v-model="sendOtherId" type="text" placeholder="请输入转赠用户ID">
                
                <div class="random_btn" @click="sureSend">确认转赠</div>
            </div>
        </u-popup>
    </view>
</template>
<script>
import { mapState } from "vuex";
import { post } from "@/utils/api.js";

import xBtn from "@/components/modules/x-btn";
import selectGoods from "@/components/selectGoods/index";
import { groupByItemId ,groupByItemName} from '../../utils/mgtv';
export default {
    data() {
        return {
            sendOtherId:'',
            sendInfo:{
               ids:[],
               info:[],
            },
            confirmSendOthers:false,
            selectType:1, //1,转赠,2,放生
            ISmp: this.ISmp,
            activeStyl: {
                color: "#333",
                fontWeight: "bold",
                fontSize: "18px",
                transform: "scale(1.05)",
            },
            navbar: [
                {
                    name: "全部",
                },
                {
                    name: "待交易",
                },
                {
                    name: "发布中",
                },
            ],
            active_m: 0,
            navbar2: ["全部", "现货", "预售"],
            active: "全部",
            totalReward: 0, // 赏品总量
            cabinetData: [], // 赏品数据
            firstCondition: 0, // 一级筛选条件
            secondCondition: 0, // 二级筛选条件
            pageda: {
                page: 1,
                page_size: 40,
                total: 40,

            },
            data: { order_by_create_time: 2, },// order_by_inner_price:2
            recycleState: 0,
        };
    },
    components: {
        xBtn,
        selectGoods
    },
    watch: {},
    computed: {
        ...mapState(["userInfo"]),
        conHeight() {
            let h = this.SystemInfo.screenHeight;
            let va = this.MBInfo();
            let th = va.height + va.top + 18;
            let str = h - th + "px";
            return str;
        },
    },
    created() {
        this.loadDetail();
        if (!this.userInfo.showMarket) this.navbar = [{ name: "全部" }];
    },
    methods: {
        sureSend(){
             if(!this.sendOtherId){
                uni.$u.toast("请输入用户ID");
                return;
             }
             post('v1/cabinet/donation',{
                target_user_id:this.sendOtherId,
                stock_id:this.sendInfo.ids
             }).then(res=>{
                if(!res.code){
                  uni.$u.toast("转赠成功");
                  this.confirmSendOthers = false;
                    this.pageda.page = 1;
                     this.loadDetail(1);
                     // 刷新 selectGoods 组件数据
                     this.$refs.addStock.getSubclassReward()
                }else{
                     uni.$u.toast(res.message);
                }

             })
        },
        toSendOther(){
            this.selectType = 1
          this.$refs.addStock.open([], -1);
        },
        ontab(item) {
            this.pageda.page = 1;
            this.secondCondition = item.index;
            this.loadDetail(1);
        },
        ontab2(item, index) {
            this.pageda.page = 1;
            this.active = item;
            this.firstCondition = index;
            this.loadDetail(1);
        },
        loadDetail(page) {
            if (page == 1) this.cabinetData = [];
            post("v1/cabinet/stock/list", {
                sale_type: this.firstCondition,
                state: this.secondCondition,
                order_by_award_level: 1,
                order_by_theme_type: 1,
                ...this.pageda, ...this.data,
            }).then((res) => {
                if (!res.code) {
                    this.totalReward = res.totalNums;
                    if (page == 1) {
                        this.cabinetData = res.cabinetStocks;
                    } else {
                        this.cabinetData = [
                            ...this.cabinetData,
                            ...res.cabinetStocks,
                        ];
                    }
                    this.pageda.total = res.totalNums;
                    this.recycleState = res.recycleState
                }
            });
        },
        ondetail(id) {
            this.gachaDetailsMethod(this, id);
        },
        onReachScollBottom() {
            if (this.pageda.total > this.pageda.page * this.pageda.page_size) {
                this.pageda.page++;
                this.loadDetail();
            }
        },
        onBtn(num) {
            if (num) this.data = { order_by_inner_price: 2 }
            else this.data = { order_by_create_time: 2, }

            this.pageda = { page: 1, page_size: 40, total: 40, },
                this.loadDetail(1)
        },
        onGoRecycle() {
            this.selectType = 2
            this.$refs.addStock.open([], -1);
            // uni.navigateTo({ url: "/pages/transaction/index?openStock=true" });
        },
          SelectIds(ids, infos) {
            const that = this;

            if(this.selectType == 1){
                console.log(infos,ids)
                this.confirmSendOthers = true;
                let sendInfo = groupByItemName(infos);
                 console.log(sendInfo)
                this.sendInfo = {
                    ids:ids,
                    info:sendInfo
                }
                return;

            }
            const result = groupByItemId(infos);
           post('v1/cabinet/decompose/cal-obtained',{item_dict:result}).then((res) => {
            if(!res.code){
                     that.$showModal({
                        title: "放生",
                        content: `本次放生共获得${res.balance}星币`,
                        hint: '温馨提示：回收后将无法恢复，请谨慎操作~',
                        success:(res1)=> {
                            if (res1.confirm) {
                                post("v1/cabinet/decompose/by-stock", {
                                    stock_id: ids,
                                }).then((res2) => {
                                    if (res2.code) {
                                        uni.$u.toast(res2.message);
                                    } else {
                                        uni.$u.toast("放生成功");
                                        that.pageda.page = 1;
                                        that.loadDetail(1);
                                        // 刷新 selectGoods 组件数据
                                        that.$refs.addStock.getSubclassReward()
                                    }
                                });
                            }
                        },
                    });
              }
           })


            return;
            // let that = this;
            // const data =ids.length==that.totalReward?[]:ids
            // post("v1/cabinet/stock/recycle/preview", {
            //     stock_id: data,
            // }).then((res) => {
            //     if (res.code) {
            //         uni.$u.toast(res.message);
            //     } else {
            //         that.$showModal({
            //             title: "物品二次回收确认",
            //             content: `本次将回收${res.itemNum}件赏品<br/>共获得${res.recyclingPrice}余额`,
            //             hint: '温馨提示：回收后将无法恢复，请谨慎操作~',
            //             success(res1) {
            //                 if (res1.confirm) {
            //                     post("v1/cabinet/stock/recycle", {
            //                         stock_id: data,
            //                     }).then((res2) => {
            //                         if (res2.code) {
            //                             uni.$u.toast(res2.message);
            //                         } else {
            //                             uni.$u.toast("回收成功！");
            //                             // 刷新列表
            //                             that.pageda.page = 1;
            //                             that.loadDetail(1);
            //                             // 刷新 selectGoods 组件数据
            //                             that.$refs.addStock.getSubclassReward();
            //                         }
            //                     });
            //                 }
            //             },
            //         });
            //     }
            // });

        }
    },
};
</script>
<style lang='scss' scoped>
.shanggui {
    height: 100vh;
    padding-top: 80rpx;
    position: relative;
    background-color: #F5F6F8;
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

.frame {
    background: url("@/static/homePage/frame.png");
    background-size: 100% 100%;
}

.shanggui_con {
    width: 100%;
    height: calc(100%);
    position: absolute;
    // padding-top: 70px;
    bottom: 0;
    left: 0;
    z-index:5;
    
}

.top_tabs {
    position: relative;
    z-index: 6;

    .top_btn {
        position: absolute;
        right: 32rpx;
        top: 20rpx;
        width: 154rpx;
        height: 40rpx;
        line-height: 40rpx;
        text-align: center;
        background: linear-gradient(90deg, #5859b6 0%, #4878b6 100%);
        border-radius: 16rpx 20rpx 20rpx 6rpx;
        font-size: 24rpx;
        font-weight: bold;
        color: #ffffff;

        .ico {
            width: 26rpx;
            height: 26rpx;
            padding-left: 8rpx;
        }
    }
}
.rules{
    width: 144rpx;
    height: 48rpx;
    background: url('https://img.shinemang.com/gachaStatic/chaogui/rule.png');
    background-size: 100% 100%;
    margin-right: 32rpx;
}
.tabs_two {
    width: 372rpx;
    height: 76rpx;
    // background: url("https://img.shinemang.com/gachaStatic/static/img/shanggui/tabs_bg.png");
    // background-size: 100% 100%;
    font-size: 28rpx;
    color: #ffffff;
    line-height: 28rpx;
    padding-left: 32rpx;

    .tab_item {
        width: 136rpx;
        line-height: 56rpx;
        height: 56rpx;
        text-align: center;
background: #EEEEEE;
border-radius: 28rpx;
color: #666666;
margin-right: 16rpx;
        &:first-child {
            margin-left: -16rpx;
        }

        &.active {
            background: linear-gradient( 90deg, #31E597 0%, #40E0EA 100%);
            color: #000;
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

.recycle {
    padding: 0 16rpx;
    height: 48rpx;
    background: linear-gradient(0deg, #4FEF5F 0.01%, #1BAB04 100%);
    box-shadow: inset 0rpx 4rpx 4rpx 0rpx rgba(255, 255, 255, 0.25);
    border-radius: 40rpx;
    margin-right: 32rpx;
    font-weight: bold;
    font-size: 24rpx;
    color: #FFFFFF;

    .icon {
        width: 40rpx;
        height: 40rpx;

    }

    .text {
        //  width: 40rpx;
        height: 40rpx;
        line-height: 40rpx;
    }
}

.p_lists {
    height: calc(100% - 62rpx);
    margin-top: -16rpx;
    // border-radius: 0 50rpx 0 0;
    // background: #f4f4f4;
    padding: 32rpx 32rpx;
    position: relative;
    padding-right: 0;
    padding-bottom: 0;

    // overflow-y: auto;
    .tab {
        .teg {
            // width: 178rpx;
            padding: 0 16rpx;
            height: 48rpx;
            text-align: center;
            background: #FFFFFF;
            border-radius: 8rpx;
            line-height: 48rpx;
            color: #1A1A1A;
            margin-right: 32rpx;

            font-size: 24rpx;
        }

        .btn {
            display: flex;
            font-size: 24rpx;
            color: #1A1A1A;
            align-items: center;
            margin-right: 40rpx;
            &:last-child{
                margin-right: 0;
            }
            image{
                width: 24rpx;
                height: 24rpx;
                margin-left: 4px;
            }
            // width: 88rpx;
            // height: 44rpx;
            // line-height: 44rpx;
            // font-weight: 500;
            // font-size: 24rpx;
            // color: #343434;
            // background: #E2E1E3;
            // border-radius: 8rpx;
            // text-align: center;
            // margin-left: 16rpx;

            &.active {
                // color: #6652CF;
                // background: #CEC3ED;
            }
        }

    }

}

.lists_box {
    padding-bottom: 160rpx;
    // height: 100%;
    // overflow-y: auto;
}

.ListScroll {
    height: calc(100% - 76rpx);
    margin-top: 28rpx;
}

.lists {
    // @include grid(152rpx);
    display: flex;
    flex-wrap: wrap;


    .item {
        width: 224rpx;
        height: 300rpx;
        background-color: #fff;
        margin-right: 8rpx;
        border-radius: 24rpx 24rpx 24rpx 24rpx;
        padding: 12rpx;
        &:nth-child(3n) {
            margin-right: 0;
            
        }
        margin-bottom: 18rpx;
        // .item_img_box{
       
        // }
        .item_img_box{
                  width: 200rpx;
height: 200rpx;
background: linear-gradient( 180deg, #D6E5FF 0%, #FFFFFF 100%);
border-radius: 16rpx 16rpx 16rpx 16rpx;
            background-size: 100% 100%;
            position: relative;
        }
        .item_img {
               width: 200rpx;
height: 200rpx;
border-radius: 16rpx 16rpx 16rpx 16rpx;
position: relative;
background-size: cover;

        }

        .item_name {
            margin: 5rpx 0;
            font-size: 24rpx;
            font-weight: bold;
            color: #1A1A1A;
        }

        .item_no {
            font-size: 20rpx;
            color: #8D8D94;
        }

        .box_ico {
            width: 152rpx;
            height: 152rpx;
        }

        .item_txt {
            color: #ffffff;
            font-size: 22rpx;
            position: absolute;
            left: 6rpx;
            bottom: 2rpx;
        }

        .item_txt1 {
            color: #ffffff;
            font-size: 20rpx;
            position: absolute;
            right: -12rpx;
            top: -12rpx;
            width: 60rpx;
            height: 32rpx;
            background-size: 100% 100%;
        }
    }
}

.foot_btn {
    width: 120rpx;
    position: fixed;
    bottom: 204rpx;
    right: 0;
    view{
        width: 120rpx;
        height: 120rpx;
    }
    .selectToExchange{
       background: url('https://img.shinemang.com/gachaStatic/chaogui/selectExchangeIcon.png');
       background-size: 100% 100%;
    }
    .selectToSend{
          background: url('https://img.shinemang.com/gachaStatic/chaogui/selectSendIcon.png');
       background-size: 100% 100%;
    }

}

.mpWeixin {
    .top_tabs .top_btn {
        top: 108rpx;
        z-index: 12000;
    }
}

.send_con{
    width: 676rpx;
    padding: 36rpx 24rpx;
  .title{
    color: #1A1A1A;
    font-size: 32rpx;
    font-weight: bold;
    text-align: center;
    margin-bottom: 24rpx;
  }
  .sendList{
   max-height: 800rpx;
   margin-bottom: 40rpx;
    .list{
        .item{
          display: flex;
          justify-content: space-between;
          margin: 12rpx 0;
          align-items: center;
          background: rgba(0, 0, 0, 0.03);
          padding: 24rpx 24rpx;
          border-radius: 12rpx;
          .name{
            font-size: 28rpx;
            color: #1A1A1A;
            font-weight: bold;
            max-width: 500rpx;
          }
          .count{
            font-size: 24rpx;
            color: #8D8D94;
          }
        }
    }
   
  }
  input{
     border:1px solid rgba(0, 0, 0, 0.1);
     height: 72rpx;
      width: calc(100% - 5px);
     text-align: center;
     background: #F5F6F8 !important;
     padding-left: 16rpx;
     border-radius: 12rpx;
     margin-bottom: 24rpx;

  }
   .random_btn{
        color: #1A1A1A;
    background: linear-gradient(90deg, #31E597 0%, #40E0EA 100%);
        width: calc(100% - 5px);
    height: 40px;
    line-height: 40px;
    text-align: center;
    background: linear-gradient(90deg, #31E597 0%, #40E0EA 100%);
    border-radius: 20px;
    font-weight: bold;
    font-size: 16px;
    }
}
</style>