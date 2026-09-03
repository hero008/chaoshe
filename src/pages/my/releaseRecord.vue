<template>
    <view  :style="{ paddingTop: MBInfo().top + 'px' }" class="releaseRecord">
        <div :style="{ height: MBInfo().height + 'px' }" class="navbar_x flex_r flex_jb flex_ac">
            <view class="top_Back" @click.stop="gateBack">
                <text class="icof Back_ico">&#xe72c;</text>
                <text class="txt">发货订单</text>
            </view>
        </div>
        <div class="shanggui_con" :style="{ height: conHeight }">
            <view class="tabs_two flex_r flex_jb">
                <view class="tab_item" :class="{active:i.type==active}" @click="ontab2(i,s)" v-for="(i,s) in navbar" :key="s">
                    <text>{{i.name}}</text>
                    <view v-if="i.type==active" class="line"></view>
                </view>
            </view>
            <view class="p_lists">
                <div class="order_list" v-if="orderlist.length">
					<scroll-view class="product-scroll" @scrolltolower="onReachScollBottom" :lower-threshold="400"
						:scroll-y="true">
                    <div class="order_item" v-for="(item,index) in orderlist" :key="index" @click="goto('/pages/my/releaseDetails',{id:item.id})">
                        <div class="head_tit flex_r flex_jb flex_ac">
                            <div class="l_tit flex_r flex_jb">
                              
                                <div class="addr">
                                    <image
                                        src="https://img.shinemang.com/gachaStatic/my/locationIcon.png"
                                        mode="scaleToFill"
                                    />
                                    {{setTxtLength(item)}}
                                </div>
                                  <div class="tag isSend" v-if="item.state == 4">发货中</div>
                                <div class="tag" v-if="item.state == 5">已签收</div>
                                <div class="tag corg" v-if="item.state == 3">备货中</div>
                            </div>
                            <!-- -->
                        </div>
                        <div class="goods flex_r flex_jb flex_ac">
                            <div class="goods_li">
                                <view :style="{
                                    backgroundImage:`url(${v.cover})`,
                                    backgroundSize:'cover',
                                    display:'inline-block'
                                }" v-for="(v,k) in formateList(item.items)" :key="k" class="goods_img">
                                <view class="num">x{{ v.num }}</view></view>
                                <!-- <img v-for="(v,k) in item.items" :key="k" class="goods_img" :src="v.cover"> -->
                            </div>
                          
                        </div>

                        <div class="goodsBottom flex_r flex_jb flex_ac">
                              <div class="goods_num">共 <text>{{item.items.length}}</text>件赏品</div>
                               <div class="detail"><span>查看订单</span></div>
                        </div>
                        <!-- <div class="bottom_btn flex_r flex_ac flex_jb">
                            <div class="no">订单号：{{item.id}}</div>
                            <img src="https://img.shinemang.com/gachaStatic/static/img/market/copy.png" class="copy" @click.stop="copy(item.id)" />
                        </div> -->
                    </div>
					</scroll-view>
                </div>
                <u-empty v-else text="暂无发货记录~" icon="https://img.shinemang.com/gachaStatic/static/img/home/empty.png" :marginTop="50" />
            </view>
        </div>
    </view>
</template>
<script>
import { post } from "@/utils/api.js"
import { marketGroupByItemId } from "@/utils/mgtv";
export default {
    data() {
        return {
            navbar: [{
                name:"全部",
                type:0,

            }, {
                name:"备货中",
                type:1,
            },{
                name: "发货中",
                type:2
            },{
                name: "已签收",
                type:3
            }],
            active: 0,
            orderlist: [],
            order_state: 0,
			pageda: {
				page: 1,
				page_size: 20,
				total: 20,
			},
        };
    },
    onLoad(da) {
        this.loadList()
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
               formateList(value){

             let   data = marketGroupByItemId(value);

            return data;
                  
        },
        ontab2(item, index) {
            this.active = item.type
			this.pageda.page = 1
            if (index == 0) {
                this.order_state = index;
            } else if (index == 1) {
                this.order_state = 3
            } else if (index == 2) {
                this.order_state = 4
            } else if (index == 3) {
                this.order_state = 5
            }
            this.loadList()
        },
        loadList() {
            post('v1/order/list', {
                type: 0,
                state: this.order_state,
                ...this.pageda
            }).then(res => {
				if (this.pageda.page == 1) this.orderlist = [];
				this.orderlist = this.orderlist.concat(res.orders);
				this.pageda.total =  res.total;
            })
        },
		setTxtLength(item){
			if(item.receiveAddress && item.receiveAddress.length>13){
				return item.receiveAddress.slice(0,13) + '...'
			}else{
				return item.receiveAddress + '...'
			}
		},
		onReachScollBottom() {
			if (this.pageda.total > this.pageda.page * this.pageda.page_size) {
				this.pageda.page++;
				this.loadList()
			}
		},
    },
};
</script>
<style lang='scss' scoped>
.product-scroll {
    height: calc(100% - 60rpx);
}
.releaseRecord {
    width: 100vw;
    height: 100vh;
    position: relative;
    padding: 100rpx 0 30rpx;
    overflow-y: auto;

    background-color: #F5F6F8;
    //       &::after {
    //     content: "";
    //     width: 100vw;
    //     height: 600rpx;
    //     left: 0;
    //     top: 0;
    //     position: absolute;
    //     z-index: 1;
    //     background: url('https://img.shinemang.com/gachaStatic/chaogui/topBg.png');
    //     background-size: 100% 100%;
    //   }
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
        color: #1C1C1C;

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

.shanggui_con {
    width: 100%;
    height: calc(100% - 190rpx);
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 2;

    .p_lists {
        height: calc(100% - 66rpx);
        border-radius: 0 50rpx 0 0;
        // background: #F4F4F4;
        margin-top: -15rpx;
        padding: 24rpx;
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
    padding: 0 24rpx 24rpx 24rpx;
    width: 100%;
    height: 348rpx;
    margin-bottom: 16rpx;

    .head_tit {
        font-size: 24rpx;
        // padding-bottom: 20rpx;
        height: 96rpx;
        width: 100%;
        border-bottom: 2rpx dashed #E5E5E5;

        .tag {
            padding: 2rpx 12rpx;
            border-radius: 8rpx;
            color: #8D8D94;
          background: #F2F2F2;
            // margin-right: 10rpx;

            &.corg {
                background: #FFF5EB;
                color: #FF932B;
            }
            &.isSend{
                background-color: #D6FCFF;
                color: #01C2D0;
            }
        }
        .l_tit{
            width: 100%;
        }
        .addr{
            display: flex;
            align-items: center;
            image{
                width: 32rpx;
                height: 32rpx;
                margin-right: 4rpx;

            }
        }

    }

    .goods {
        margin: 24rpx 0;
// calc(100% - 60rpx);
        .goods_li {
            height: 120rpx;
            width: 100%;
            overflow-x: auto;
            overflow-y: hidden;
            white-space: nowrap;

            .goods_img {
                height: 124rpx;
                width: 124rpx;
                border-radius: 16rpx;
                // border: 2rpx solid #fff;
                // box-shadow: 0 0 2rpx 2rpx #CACACA;
                margin: 2rpx;
                /* background-color: rgba($color: $motif-color, $alpha: 0.5); */
                margin-right: 16rpx;
                position: relative;

                &:last-child {
                    margin-right: 0;
                }

                .num{
                position: absolute;
                bottom: 0px;
                left: 0px;
                padding: 0 4px;
                height: 20px;
                line-height: 20px;
                text-align: center;
                border-radius: 0 12px 0 7px;
                background: rgba(0, 0, 0, 0.5);
                font-weight: bold;
                font-size: 12px;
                color: #ffffff;
                }
            }
        }

    }
    .goodsBottom{
        height: 56rpx;
        
        .detail {
           width: 144rpx;
height: 56rpx;
border-radius: 32rpx 32rpx 32rpx 32rpx;
border: 2rpx solid #1A1A1A;
display: flex;
align-items: center;
justify-content: center;
font-size: 24rpx;
color: #1A1A1A;
        }
    }
        .goods_num {
            font-size: 24rpx;
            font-weight: 500;
            // padding: 0 4rpx;
            color: #8D8D94;
            text{
              color: #FF932B;
            }
        }
    .bottom_btn {
        font-size: 24rpx;
        color: #818181;

        .copy {
            width: 100rpx;
            height: 36rpx;
        }
    }
}
</style>