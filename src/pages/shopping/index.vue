<template>
    <view  :style="{ paddingTop: MBInfo().top + 'px' }" class="releaseRecord">
        <div :style="{ height: MBInfo().height + 'px' }" class="navbar_x flex_r flex_jb flex_ac">
            <view class="top_Back" @click.stop="gateBack">
                <text class="icof Back_ico">&#xe72c;</text>
                <text class="txt"></text>
            </view>
        </div>
        <div class="shanggui_con" :style="{ height: conHeight }">
            <view class="tabs_two flex_r">
                <view class="tab_item" :class="{active:i==active}" @click="ontab2(i,s)" v-for="(i,s) in navbar" :key="s">
                    <text>{{i}}</text>
                    <view v-if="i==active" class="line"></view>
                </view>
            </view>
            <view class="filter">
               <view @click="sort(0)" :class="['mr',  order_price == 0? 'active' : '']">默认</view>
               <!-- <view class="sortFilter">
                  <span>销量</span>
               </view> -->
                <view :class="['sortFilter',order_price == 1 || order_price == 2 ? 'active':'']">
                  <span>价格</span>
                  <img @click="sort(1)" v-if="order_price == 0" src="@/static/sort0.png" alt="">
                  <img @click="sort(2)" v-else-if="order_price == 1" src="@/static/sort2.png" alt="">
                  <img @click="sort(1)" v-if="order_price == 2" src="@/static/sort1.png" alt="">
               </view>
            </view>
            <view class="p_lists">
                <div class="order_list" v-if="orderlist.length">
					<scroll-view class="product-scroll" @scrolltolower="onReachScollBottom" :lower-threshold="400"
						:scroll-y="true">
                        <div class="list">
                            <div class="order_item" v-for="(item,index) in orderlist" :key="index" @click="goto('/pages/shopping/commodity',{id:item.configId,type:order_state})">
                                <img  :src="item.thumb" alt="">
                                <view class="name ellipsis">{{ item.name }}</view>
                                <view class="stock">库存:{{ item.stock? item.stock:'99999' }}</view>
                                <view class="price">
                                    <view v-if="order_state == 2">￥{{ item.price }}</view>
                                    <view  style="color: #A156EF;" v-else-if="order_state == 1">{{ item.value }} <span style="font-size: 24rpx;">积分</span> </view>
                                    <view style="color: #FF932B;" v-else-if="order_state == 3">{{ item.xCoin }}<span style="font-size: 24rpx;">星币</span> </view>
                                    <view class="btn">{{ order_state == 2 ? '购买':"兑换" }}</view>
                                </view>
                            </div>
                        </div>
                       
					</scroll-view>
                </div>
                <u-empty v-else text="暂无商品~" icon="https://img.shinemang.com/gachaStatic/static/img/home/empty.png" :marginTop="50" />
            </view>
        </div>
    </view>
</template>
<script>
import { post } from "@/utils/api.js"
import { marketGroupByItemId } from "@/utils/mgtv";
import { mapState } from "vuex";
export default {
    data() {
        return {
            navbar: ["商城", "星光积分", "星币", ],
            active: "商城",
            orderlist: [],
            order_state: 2,
			pageda: {
				page: 1,
				page_size: 20,
				total: 20,
			},
            order_price:0
        };
    },
    onLoad(da) {
      
    },
    onShow(){
        this.loadList()
    },
    computed: {
        ...mapState(["userInfo"]),
        conHeight() {
            let h = this.SystemInfo.screenHeight;
            let va = this.MBInfo();
            let th = va.height + va.top + 10;
            let str = h - th + "px";
            return str;
        },
    },
    methods: {
        sort(value){
           this.order_price = value;
           this.loadList()
        },
         formateList(value){

             let   data = marketGroupByItemId(value);

            return data;
                  
        },
        ontab2(item, index) {
            this.active = item
			this.pageda.page = 1
            if (index == 0) {
                this.order_state = 2;
            } else if (index == 1) {
                this.order_state = 1
            } else if (index == 2) {
                this.order_state = 3
            } else if (index == 3) {
                this.order_state = 5
            }
            this.loadList()
        },
                        // user_id: this.userInfo.id,
// 
        loadList() {
            post('v1/activity/cost-award/list', {
                type: this.order_state,
                order_price:this.order_price
                // ...this.pageda
            }).then(res => {
				this.orderlist =res.config
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
			// if (this.pageda.total > this.pageda.page * this.pageda.page_size) {
			// 	this.pageda.page++;
			// 	this.loadList()
			// }
		},
    },
};
</script>
<style lang='scss' scoped>

.filter{
    display: flex;
    align-items: center;
    padding-left: 32rpx;
    margin-top: 30rpx;

    view{
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40rpx;
        padding: 0 16rpx;
        color: #1A1A1A;
        font-size: 24rpx;
        line-height: 40rpx;
        background: #F5F6F8;
        border-radius: 4rpx;
        margin-right: 8rpx;

        &.active{
            color: #01C2D0;
            background: #E6F9FB;
        }

        img{
            width: 24rpx;
            height: 24rpx;
            margin-left: 4rpx;
        }
    }

}
.product-scroll {
    height: calc(100%);
    .list{
        display: flex;
        flex-wrap: wrap;
    }
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
        height: 240rpx;
        left: 0;
        top: 0;
        position: absolute;
        z-index: 1;
        background:  linear-gradient( 180deg, #BAFFF9 0%, #F5F6F8 100%);
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
    // background: url("https://img.shinemang.com/gachaStatic/static/img/shanggui/tabs_bg.png");
    // background-size: 100% 100%;
    font-size: 28rpx;
    color: #666666;
    line-height: 28rpx;
    //    padding-left: 62rpx;
    padding-right: 62rpx;

    .tab_item {
      width: 150rpx;
height: 56rpx;
// background: #EEEEEE;
// border-radius: 28rpx 28rpx 28rpx 28rpx;
display: flex;
color: #8D8D94;

align-items: center;
justify-content: center;
line-height: 56rpx;
// margin-right: 16rpx;
position: relative;
font-size: 32rpx;
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
            font-weight: bold;
            font-size: 36rpx;
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
    position: absolute;
    background: #fff;
    border-radius: 32rpx 32rpx 0 0;
    bottom: 0;
    padding-top: 24rpx;
    left: 0;
    z-index: 2;

    .p_lists {
        height: calc(100% - 128rpx);
        // background: #F4F4F4;
  
       padding-left: 32rpx;
       padding-bottom: 20rpx;
        padding-top: 30rpx;
    }
}

.order_list {
    height: 100%;
    overflow-y: auto;
}

.order_item {
  width: 336rpx;
height: 520rpx;
background: linear-gradient( 180deg, #CCFFF4 0%, #FFFFFF 60%);
border-radius: 24rpx 24rpx 24rpx 24rpx;
border: 2rpx solid #A1FAE3;
padding-top: 2rpx;

img{
    width: 332rpx;
height: 332rpx;
margin-left: 2rpx;

}
.name{
    padding: 0 16rpx;
    margin-top: 18rpx;
    font-size: 28rpx;
    font-weight: bold;
}
.stock{
    padding-left: 16rpx;
    color: #B3B3B3;
    font-size: 24rpx;
    margin-top: 8rpx;
}

.price{
    display: flex;
    align-items: center;
    padding: 0 16rpx;
    justify-content: space-between;
    font-size: 24rpx;
    color: #EE4326;
    font-weight: bold;
    .btn{
        width: 104rpx;
height: 48rpx;
background: linear-gradient( 90deg, #31E597 0%, #40E0EA 100%);
border-radius: 24rpx 24rpx 24rpx 24rpx;
display: flex;
align-items: center;
justify-content: center;
font-size: 28rpx;
color: #1A1A1A;



    }

}

}
</style>