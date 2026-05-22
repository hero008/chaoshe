<template>
    <view class="releaseRecord">
        <div class="navbar_x flex_r flex_jb flex_ac">
            <view class="top_Back" @click.stop="gateBack">
                <text class="icof Back_ico">&#xe72c;</text>
                <text class="txt">返回</text>
            </view>
        </div>
        <div class="shanggui_con">
            <view class="tabs_two flex_r">
                <view class="tab_item" :class="{active:i==active}" @click="ontab2(i,s)" v-for="(i,s) in navbar" :key="s">{{i}}</view>
            </view>
            <view class="p_lists">
                <div class="order_list" v-if="orderlist.length">
					<scroll-view class="product-scroll" @scrolltolower="onReachScollBottom" :lower-threshold="400"
						:scroll-y="true">
                    <div class="order_item" v-for="(item,index) in orderlist" :key="index" @click="goto('/pages/my/releaseDetails',{id:item.id})">
                        <div class="head_tit flex_r flex_jb flex_ac">
                            <div class="l_tit flex_r flex_ac">
                                <div class="tag corg" v-if="item.state == 4">发货中</div>
                                <div class="tag" v-if="item.state == 5">已签收</div>
                                <div class="tag corg" v-if="item.state == 3">备货中</div>
                                <div class="addr">
                                    {{setTxtLength(item)}}
                                </div>
                            </div>
                            <div class="detail"><span>查看详情</span><span class="icof">&#xe72b;</span></div>
                        </div>
                        <div class="goods flex_r flex_jb flex_ac">
                            <div class="goods_li">
                                <img v-for="(v,k) in item.items" :key="k" class="goods_img" :src="v.cover">
                            </div>
                            <div class="goods_num flex_r flex_jc flex_ac">x{{item.items.length}}</div>
                        </div>
                        <!-- <div class="bottom_btn flex_r flex_ac flex_jb">
                            <div class="no">订单号：{{item.id}}</div>
                            <img src="https://img.chaoshewang.com/static/img/market/copy.png" class="copy" @click.stop="copy(item.id)" />
                        </div> -->
                    </div>
					</scroll-view>
                </div>
                <u-empty v-else text="暂无发货记录~" icon="https://img.chaoshewang.com/static/img/home/empty.png" :marginTop="50" />
            </view>
        </div>
    </view>
</template>
<script>
import { post } from "@/utils/api.js"

export default {
    data() {
        return {
            navbar: ["全部", "备货中", "发货中", "已签收"],
            active: "全部",
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
    methods: {
        ontab2(item, index) {
            this.active = item
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
          &::after {
        content: "";
        width: 100vw;
        height: 600rpx;
        left: 0;
        top: 0;
        position: absolute;
        z-index: 1;
        background: url('../../static/gachaStatic/chaogui/topBg.png');
        background-size: 100% 100%;
      }
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
    // background: url("https://img.chaoshewang.com/static/img/shanggui/tabs_bg.png");
    // background-size: 100% 100%;
    font-size: 28rpx;
    color: #666666;
    line-height: 28rpx;
    padding-left: 32rpx;

    .tab_item {
      width: 136rpx;
height: 56rpx;
background: #EEEEEE;
border-radius: 28rpx 28rpx 28rpx 28rpx;
display: flex;
align-items: center;
justify-content: center;
line-height: 56rpx;
margin-right: 16rpx;

        &:first-child {
            // margin-left: -16rpx;
        }
        &:last-of-type {
            // margin-right: 10rpx;
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
            // background: url("https://img.chaoshewang.com/static/img/shanggui/tab_bg.png");
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
        padding: 32rpx;
    }
}

.order_list {
    height: 100%;
    overflow-y: auto;
}

.order_item {
    background-color: #fff;
    border-radius: 16rpx;
    padding: 20rpx 26rpx;
    margin-bottom: 20rpx;

    .head_tit {
        font-size: 24rpx;
        padding-bottom: 20rpx;
        border-bottom: 2rpx solid #E2E1E3;

        .tag {
            padding: 2rpx 10rpx;
            border-radius: 4rpx;
            color: #FFFFFF;
            background: #A9A9A9;
            margin-right: 10rpx;

            &.corg {
                background: #78BF72;
            }
        }

        .detail {
            color: #818181;
        }
    }

    .goods {
        margin: 20rpx 0;

        .goods_li {
            height: 120rpx;
            width: calc(100% - 60rpx);
            overflow-x: auto;
            overflow-y: hidden;
            white-space: nowrap;

            .goods_img {
                height: 110rpx;
                width: 110rpx;
                border-radius: 16rpx;
                border: 2rpx solid #fff;
                box-shadow: 0 0 2rpx 2rpx #CACACA;
                margin: 2rpx;
                /* background-color: rgba($color: $motif-color, $alpha: 0.5); */
                margin-right: 12rpx;

                &:last-child {
                    margin-right: 0;
                }
            }
        }

        .goods_num {
            font-size: 24rpx;
            font-weight: 500;
            padding: 0 4rpx;
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