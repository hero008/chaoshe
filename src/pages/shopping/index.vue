<template>
    <view  :style="{ paddingTop: MBInfo().top + 'px' }" class="releaseRecord">
        <div :style="{ height: MBInfo().height + 'px' }" class="navbar_x flex_r flex_jb flex_ac">
            <view class="top_Back" @click.stop="gateBack">
                <text class="icof Back_ico">&#xe72c;</text>
                <text class="txt">商场</text>
            </view>
        </div>
        <div class="shanggui_con" :style="{ height: conHeight }">
            <view class="tabs_two flex_r flex_jb">
                <view class="tab_item" :class="{active:i==active}" @click="ontab2(i,s)" v-for="(i,s) in navbar" :key="s">
                    <text>{{i}}</text>
                    <view v-if="i==active" class="line"></view>
                </view>
            </view>
            <view class="p_lists">
                <div class="order_list" v-if="orderlist.length">
					<scroll-view class="product-scroll" @scrolltolower="onReachScollBottom" :lower-threshold="400"
						:scroll-y="true">
                    <div class="order_item" v-for="(item,index) in orderlist" :key="index" @click="goto('/pages/shopping/commodity',{id:item.configId})">
                      
                        <img style="width: 100px;height: 100px;" :src="item.thumb" alt="">
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
import { mapState } from "vuex";
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
               formateList(value){

             let   data = marketGroupByItemId(value);

            return data;
                  
        },
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
            post('v1/activity/cost-award/list', {
                type:2,
                user_id: this.userInfo.id,
                // ...this.pageda
            }).then(res => {
                console.log(res.config)
				if (this.pageda.page == 1) this.orderlist = [];
				this.orderlist = this.orderlist.concat(res.config);
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

}
</style>