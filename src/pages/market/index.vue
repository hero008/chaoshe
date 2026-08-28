    <!-- <!-- 集市界面 -->
<template>
    <view class="market" :class="{ mpWeixin: ISmp() }" :style="{ paddingTop: MBInfo().top + 'px' }">
        <!-- 热门交易搜索框 -->
        <view class="notice">
            <u-search style="width: 60%;" placeholderColor="#8D8D94" :inputStyle="{
            color:'#1A1A1A'}" searchIconColor="#1A1A1A" placeholder="搜索热门交易" @search="searchKey" v-model="keyword" :showAction="false"
                bgColor="transparent" :height="MBInfo().height" />
            <!-- <view class="notice_btn"></view> -->
        </view>
        <!-- 二级tab -->
      <div class="navbarSubclass" :style="{
        height:`calc(100% - 282rpx - ${MBInfo().top}px)`,
        top:`calc(282rpx + ${MBInfo().top}px)`
      }" v-if='Object.keys(childList).length'>
            <view class='subclass'>
                <view :class="[text.name == i.name ? ' subclass-tiem ' : 'subclass-tiem tiem1']"
                    v-for="(i, s) in childList.child" :key="s" @click="onChild(i, childList.id)">{{ i.name }}</view>
            </view>
            <view class='subclass-bottom' @click="onSsubclass" />
        </div>
         <div class="exchangeRules tag flex_r flex_ac" @click="goto('/pages/common/rulepop', { val: 'MarketRules' })">
                        <!-- <span>交易规则</span> -->
                        <!-- <img
                            src="https://img.shinemang.com/gachaStatic/static/img/pay/ico5.png"> -->
                            <!-- <span class="icof">&#xe6cd;</span> -->
        </div>
        <scroll-view :style="{
            height:`calc(100%  - 74rpx)`,
        }" @scrolltolower="onReachScollBottom" class="market_con" :scroll-y="true" :refresher-enabled="true"
            refresher-background="rgba(0,0,0,0)" :refresher-triggered="triggered" @refresherrefresh="onRefresh"
            @refresherrestore="onRestore" :refresher-threshold="60">
            <div>
                <!-- 我的余额 左边的tab 分类 -->
                <view class="tobBox">
                    <u-tabs :list="navbar"  :inactiveStyle="{
                        color: '#8D8D94',
                        transform: 'scale(1)'
                    }" @click="ontab" :lineColor="lineColor"  lineHeight="7"  lineWidth="32" :activeStyle="activeStyl" />
                    <view @click=" goto('/page-a/balance/index')" class="balance">
                        <!-- <view class="imgbalance gold_coin" />
                        <view >余额</view> -->
                    </view>
       
                </view>
                <!-- 交易规则部分 -->
                <view class="filtrate-bar ">
                    <div class="lBox ">
                        <view class="l " v-for="(i, s) in navbarChild" :key="s">
                            <view class="fil-item" @click="onChildList(i)">
                                <view class="name">{{ i.name }}</view>
                                <view :class="[childList.id == i.id ? 'sim1' : 'sim']"></view>
                                <!-- <image :src="`https://img.shinemang.com/gachaStatic/static/img/pay/${text.id == i.id?"shouqi":'zhankai'}.png`" class="sim"></image> -->
                            </view>
                        </view>
                        <!-- <view v-if="active == 0" class="trendsetter"
                            :style="{ backgroundImage: `url(https://img.shinemang.com/gachaStatic/static/img/transaction/${userType ? 'optFor1' : 'trendsetter1'}.png)` }"
                            @click="onTrendsetter"></view> -->
                    </div>
                  
                </view>
            </div>
      
            <div class="transaction_list">
                <div class="lists" v-if="orderList.length">
                    <div class="t_item" v-for="(item, a) in orderList" :key="a">
                        <div class="placeOrderUser flex_r flex_ac flex_jb">
                            <div class="user flex_r flex_ac">
                                <image class="user_img" :src="item.userAvatar | active" />
                                <div class="user_name ">
                                    <div  class="flex_r flex_ac "> <span class="ellipsis" style="display: inline-block;max-width: 300rpx;">{{ item.userName }}</span> <div v-if="item.userType == 2"
                                            class="official flex_center">官方</div>
                                    </div>
                                    <div class="c_time">{{ item.createTime }}</div>
                                </div>
                            </div>
                           <div class="tag " :class="[stateType.includes(item.state) ? 'core' : '']">{{ item.state }}
                            </div> 
                        </div>
                        <div class="goods_remark flex_r flex_ac flex_jb" v-if="item.content">
                            <img src="https://img.shinemang.com/gachaStatic/static/img/market/ico2.png" class="m_ico big">
                            <span>{{ item.content }}</span>
                        </div>
                        <div class="goods flex_r  flex_ac">
                            <scroll-view scroll-x class="goods_li flex_r" :hrottle="false"
                                @scrolltolower="onScrollX(item.id, a)" :lower-threshold="200">
                                <template v-if="item.type == 'MarketOrderType_Ask'">
                             
                                         <image
                                           :style="{
                                            position:'absolute',
                                            width:'60rpx',
                                            height:'40rpx',
                                            bottom:0,
                                            left:0,

                                           }"
                                         
                                            src="https://img.shinemang.com/gachaStatic/market/qg.png"
                                            mode="scaleToFill"
                                        />

                                       <img  v-if="item.wantItem" class="goods_img" :src="item.wantItem.coverThumb"
                                        :class="[item.items.length ? 'bore' : 'bor9']"
                                        @click="ondetail(item.wantItem.itemId)">
                                  
                                    <img v-else src="https://img.shinemang.com/gachaStatic/static/img/transaction/random1.png"
                                        class=" goods_img bor5">
                                    <!-- <view v-else class="  random"></view> -->
                                     <img src="https://img.shinemang.com/gachaStatic/static/img/transaction/ico3.png"
                                        v-if="item.items.length" class="ico3">
                                </template>
                               <!-- <view style="display: flex;flex-shrink: 0;"> -->

                                   <view :style="{
                                    backgroundImage:`url(${cont.coverThumb})`,
                                    backgroundSize:'cover',
                                    position:'relative',
                                    display:'inline-block'
                                }"  v-for="(cont, i) in formateList(item.items)"  @click="ondetail(cont.itemId)" :id="i + 1"  :key="i" :class="['goods_img',item.type == 'MarketOrderType_Ask'?'imgAsk':'']">
                                    <view class="num">x{{ cont.num }}</view>
                                </view>
                               <!-- </view> -->
                                <!-- <img  :src="cont.coverThumb"
                                   /> -->
                            </scroll-view>
                            <div style="margin-left: 10rpx;color: #8D8D94;" class="goods_num flex_c flex_jc flex_ac" v-if="item.items.length > 1">
                                <div>共</div>
                                <div>{{ item.nus }}</div>
                                <div>件</div>
                            </div>
                        </div>
                        <div class="bottom_btn flex_r flex_je flex_ac">
                            <template v-if="item.wantItem">
                                <div class="btnE flex_r flex_ac flex_jc" v-if="!item.items.length && item.askPrice">
                                    <!-- <img src="https://img.shinemang.com/gachaStatic/static/img/market/ico3.png" class="m_ico"> -->
                                    <span>求购：<span class="price">{{ item.askPrice }}</span></span>
                                </div>

                                <template v-else>
                                    <div class="btnE flex_r flex_ac flex_jc">
                                        <!-- <img src="https://img.shinemang.com/gachaStatic/static/img/market/ico4.png" class="m_ico"> -->
                                        <span style="color: #EA4CA4;">以物换物</span>
                                    </div>

                                </template>
                            </template>
                            <div class="btnE flex_r flex_ac flex_jc" v-if="item.items.length && item.askPrice">
                                <!-- <img src="https://img.shinemang.com/gachaStatic/static/img/market/ico3.png" class="m_ico"> -->
                                <span>加价：<span class="price">{{ item.askPrice }}</span></span>
                            </div>
                            <template v-else>
                                <div class="btnE flex_r flex_ac flex_jc" v-if="item.buyPrice">
                                    <!-- <view class="m_ico gold_coin" /> -->
                                    <span>一口价：<span class="price">{{ item.buyPrice }}</span></span>
                                </div>
                            </template>
                            <div :class="[active == 0 ? 'btn' : 'btn1']"
                                @click="onClickBuy(item.buyPrice, item.id, item.userId, a)">
                                <div>{{ active != 0 ? '查看' : "查看交易" }}</div>
                                <div class="icof" v-if="active !== 0">&#xe72b;</div>
                                <u-badge max="99" :value="item.joinNums"></u-badge>
                            </div>
                        </div>
                    </div>
                </div>
                <u-empty v-else :text="emptyTxt" icon="https://img.shinemang.com/gachaStatic/static/img/home/empty.png"
                    :marginTop="50" />
            </div>
        </scroll-view>
        <!-- 详情组件 -->
        <gachaDetails ref="gachaDetails" />
        <!-- 发布按钮 -->
        <movable-area class="movable-area">
            <movable-view class="movable-view" direction="all" :style="`left: ${leftt}; top: ${topp};`"
                @change="onChange" @click="onClick">
            </movable-view>
        </movable-area>


    </view>
</template>
<script>
import { post } from "@/utils/api.js";
import { marketGroupByItemId } from "@/utils/mgtv";
export default {
    data() {
        return {
            userInfo: this.$gl("userInfo"),
            activeStyl: {
                color: "#1A1A1A",
                fontWeight: "bold",
                fontSize: "18px",
            },
            lineColor: "linear-gradient( 90deg, #31E597 0%, #40E0EA 100%)",
            navbar: [
                { name: "集市广场" },
                { name: "我的摊位" },
                { name: "我的交易" },
            ],
            active: 0,
            navbar2: [
                { txt: "最新", val: 1 },
                { txt: "最热", val: 2 },
                { txt: "一口价", val: 3 },
            ],
            navbar3: [
                { txt: "全部", val: 0 },
                { txt: "一口价", val: 1 },
                // { txt: "以物换物", val: 2 },
            ],
            state_type: [1, 0, 0], // 1最新、2最热、3一口价
            order_type: [0, 0, 0], // 1所有、2最热、3一口价
            keyword: undefined, //搜索热门交易
            orderList: [], //交易列表
            pageda: {
                page: 1,
                page_size: 16,
                total: 16,
            },
            oldInx: {},
            triggered: true,
            navbarList: [
                {
                    name: "集市广场",
                    id: 0,
                    txt: [
                        {
                            name: "最新",
                            child: [
                                { name: "最新", val: 1 },
                                { name: "最热", val: 2 },
                            ],
                            id: 1,
                        },
                        {
                            name: "全部",
                            child: [
                                { name: "全部", val: 0 },
                                { name: "一口价", val: 1 },
                                // { name: "以物换物", val: 2 },
                            ],
                            id: 2,
                        },
                    ],
                },
                {
                    name: "我的摊位",
                    id: 1,
                    txt: [
                        {
                            name: "全部",
                            child: [
                                { name: "全部", val: 0 },
                                { name: "一口价", val: 1 },
                                // { name: "以物换物", val: 2 },
                            ],
                            id: 1,
                        },
                        {
                            name: "全部",
                            child: [
                                { name: "全部", val: 0 },
                                { name: "交易中", val: 1 },
                                { name: "已完成", val: 2 },
                                { name: "已关闭", val: 3 },
                            ],
                            id: 2,
                        },
                    ],
                },
                {
                    name: "我的交易",
                    id: 2,
                    txt: [
                        {
                            name: "全部",
                            child: [
                                { name: "全部", val: 0 },
                                { name: "一口价", val: 1 },
                                // { name: "以物换物", val: 2 },
                            ],
                            id: 1,
                        },
                        {
                            name: "全部",
                            child: [
                                { name: "全部", val: 0 },
                                { name: "交易中", val: 1 },
                                { name: "已完成", val: 2 },
                                { name: "已关闭", val: 3 },
                            ],
                            id: 2,
                        },
                    ],
                },
            ],
            navbarChild: [
                {
                    name: "最新",
                    child: [
                        { name: "最新", val: 1 },
                        { name: "最热", val: 2 },
                    ],
                    id: 1,
                },
                {
                    name: "全部",
                    child: [
                        { name: "全部", val: 0 },
                        { name: "一口价", val: 1 },
                        // { name: "以物换物", val: 2 },
                    ],
                    id: 2,
                },
            ],
            childList: {},
            img: "shouqi", //shouqi zhankai
            text: {},
            topp: "1500rpx",
            leftt: "3000rpx",
            stateType: ["已关闭", "已完成", "已过期"],
            rawData: [], //原素据
            userType: false,
            pageSize: 10, // 每次加载50条
            currentPage: 1,// 当前加载的页数
        };
    },

    watch: {},
    computed: {
        emptyTxt() {
            switch (this.active) {
                case 1:
                    return "您当前未发布交易订单~";
                case 2:
                    return "您当前没有交易订单~";
                default:
                    return "暂无交易订单~";
            }
        },
    },
    onLoad(da) { },
    onShow() { },
    created() {
        this.getSquareInfos();
    },
    mounted() { },
    methods: {
        onRefresh() {
            this.pageda.page = 0;
            this.onReachScollBottom();
            setTimeout(() => {
                this.triggered = false;
            }, 600);
        },
        onRestore() {
            this.triggered = "restore"; // 需要重置
        },
        onTrendsetter() {
            this.userType = !this.userType;
            this.pageda.page = 1
            this.getSquareInfos();
        },
        getSquareInfos() {
            let url, data;
            if (this.active == 0) {
                url = "v1/market/order/list";
                const user_type = this.userType ? 2 : 0;
                data = {
                    keyword: this.keyword,
                    list_order_type: this.state_type[0],
                    order_type: this.order_type[0],
                    user_type,
                    ...this.pageda,
                };
            } else if (this.active == 1) {
                url = "v1/market/order/my_publish";
                data = {
                    market_order_client_state: this.order_type[1],
                    order_type: this.state_type[1],
                    ...this.pageda,
                };
            } else {
                url = "v1/market/order/my_partake";
                data = {
                    market_order_client_state: this.order_type[2],
                    order_type: this.state_type[2],
                    ...this.pageda,
                };
            }
            post(url, data).then((res) => {
                if (!res.code) {
                    if (this.pageda.page == 1) this.orderList = [];
                    this.rawData = JSON.parse(JSON.stringify(res.orders));
                    this.rawData = [...this.rawData, ...res.orders];
                    let list = res.orders;
                    list.map((i) => {
                        i.state = getApp().globalData.MarketOrderState[i.state];
                        i.nus = i.items.length;
                        i.items = i.items
                        // i.items =
                        //     i.items.length < 20
                        //         ? i.items
                        //         : i.items.slice(0, 10);
                    });

                  




                    this.orderList = [...this.orderList, ...list];


                    this.pageda.total = res.total;
                }
            });
        },

        formateList(value){

             let   data = marketGroupByItemId(value);

            return data;
                  
        },

        searchKey() {
            this.pageda.page = 1;
            this.getSquareInfos();
        },
        ontab(item) {
            let a = [0, 1, 2].includes(item.index) ? item.index : item;
            this.navbarChild = [];
            this.text = {};
            this.childList = {};
            this.pageda.page = 1;
            this.active = a;
            this.navbarChild = this.navbarList[a].txt;
            this.getSquareInfos();
        },
        refresh() {
            if (this.oldInx.id) {
                post("v1/market/order/detail", {
                    order_id: this.oldInx.id,
                }).then((res) => {
                    if (!res.code) {
                        // if(res.order.state = getApp().globalData.MarketOrderState[res.order.state]){
                             
                        // }
                    
                       
                        res.order.map((i) => { i.state = getApp().globalData.MarketOrderState[i.state]; });
                        this.orderList.splice(this.oldInx.inx, 1, res.order);
                    }
                });
            }
        },
        onClickNavbar(cont) {
            this.pageda.page = 1;
            this.state_type = cont.val;
            this.getSquareInfos();
        },
        onClickNavbar2(da) {
            this.pageda.page = 1;
            this.order_type = da.val;
            this.getSquareInfos();
        },
        onReachScollBottom() {
            if (this.pageda.total > this.pageda.page * this.pageda.page_size) {
                this.pageda.page++;
                this.getSquareInfos();
            }
        },
        onClickBuy(money, id, userId, inx) {
            this.oldInx = { id, inx };
            this.goto("/pages/market/marketDetails", { id });
        },
        ondetail(id) {
            this.gachaDetailsMethod(this, id);
        },
        // 点开最小层级
        onChildList(i) {
            if (
                Object.keys(this.childList).length !== 0 &&
                this.childList.id == i.id
            ) {
                this.childList = {};
            } else {
                this.childList = i;
            }
            this.text = i.child.filter((item) => item.name == i.name)[0];
        },
        // 单选
        onChild(i, id) {
            this.text = i;
            this.navbarChild.map((item, index) => {
                if (item.id == this.childList.id) {
                    return (item.name = i.name);
                }
            });
            this.navbarList[this.active].txt = this.navbarChild;
            id == 1
                ? (this.state_type[this.active] = i.val)
                : (this.order_type[this.active] = i.val);
            this.ontab(this.active);
        },
        onChange() {
            // console.log('可移动事件');
        },
        onClick() {
            this.goto("/pages/transaction/index");
        },
        onSsubclass() {
            this.childList = {};
        },
        onScrollX(id, index) {
            let all = this.rawData[index].items.length;
            let now = this.orderList[index].items.length;
            console.log(all,now);
            if (now < all) {
                const nus = all - now < 10 ? all : 10 + now;
                this.orderList[index].items = [
                    ...this.orderList[index].items,
                    ...this.rawData[index].items.slice(now, nus),
                ];
            }
        },
    },
};
</script>
<style lang='scss' scoped>
.movable-area {
    // 保持在右下角
    height: calc(100vh - 100rpx);
    width: calc(100vw - 0rpx);
    right: 0;
    bottom: 220rpx;
    position: fixed;
    z-index: 10;
    pointer-events: none; //此处要加，鼠标事件可以渗透

    .movable-view {
        width: 112rpx;
        height: 112rpx;
        background-image: url("https://img.shinemang.com/gachaStatic/market/publish.png");
        background-size: 100% 100%;
        pointer-events: auto; //恢复鼠标事件
    }
}

.market {
    position: relative;
    padding: 98rpx 32rpx;
    height: 100vh;
    overflow: hidden;
    padding-bottom: 0;
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
    .notice {
        width: 516rpx;
        height: 72rpx;
        background: #ffffff;
        border-radius: 32rpx;
        display: flex;
        align-items: center;
        padding: 0 18rpx 0 0;
        position: relative;
        z-index: 2;
        border: 2rpx solid rgba(0,0,0,0.1);
        .notice_btn {
            height: 44rpx;
            width: 114rpx;
            background-image: url("https://img.shinemang.com/gachaStatic/static/img/market/cheshibanben.png");
            background-size: 100% 100%;
        }
    }
}

.market_con {
    // height: calc(100% - 98rpx);
    // margin-top: 12rpx;
    padding-top: 12rpx;
    position: relative;
    z-index: 2;
}

.up_btn {
    color: #fff;
    font-size: 24rpx;
    font-weight: bold;
    width: 132rpx;
    height: 50rpx;
    background: linear-gradient(180deg, #9181e5 0%, #5a45c8 100%);
    box-shadow: inset 0rpx 4rpx 4rpx 0rpx rgba(255, 255, 255, 0.25);
    border-radius: 40rpx 40rpx 40rpx 40rpx;

    .up_ico {
        width: 28rpx;
        height: 28rpx;
        margin-right: 5rpx;
    }
}

.navbarSubclass {
    position: absolute;
    left: 0;
    top: calc(255rpx);
    width: 100%;
    height: calc(100vh - 255rpx);
    background: rgba(0, 0, 0, 0.5);
    z-index: 6;

    .subclass {
        width: 750rpx;
        height: 120rpx;
        background: #ffffff;
        border-radius: 0 0 24rpx 24rpx;
        display: flex;
        padding-left: 32rpx;
        align-items: center;

        .subclass-tiem {
            width: 160rpx;
            height: 56rpx;
            line-height: 56rpx;
            text-align: center;
            background: rgba(154, 92, 255, 0.2);
            border-radius: 16rpx;
            font-family: PingFang SC, PingFang SC;
            font-weight: bold;
            font-size: 24rpx;
            color: #2f2c47;
            margin-right: 16rpx;
        }

        .tiem1 {
            background: rgba(241, 241, 241, 1);
            font-weight: 400;
            font-size: 24rpx;
            color: #615e74;
        }
    }

    .subclass-bottom {
        height: 1150rpx;
    }
}

.transaction_list {
    min-height: calc(100vh - 460rpx);
    // margin-top: 10rpx;
    // background-color: #fff;
    border-radius: 16rpx;
    padding: 24rpx 0rpx;
    padding-top: 0;
    // padding-bottom: 0;

    .filt_bar {
        .btn_item {
            padding: 8rpx 26rpx;
            font-size: 28rpx;
            color: #615e74;

            &.active {
                color: #333;
                font-weight: bold;
                background: rgba(154, 92, 255, 0.2);
                border-radius: 16rpx 16rpx 16rpx 16rpx;
                animation: myFn1 0.5s;
            }
        }

        .tag {
            font-size: 28rpx;
            color: #615e74;

            img {
                width: 28rpx;
                height: 28rpx;
                margin-left: 10rpx;
            }
        }
    }

    .lists {
        // padding: 20rpx 0 50rpx;
        padding-bottom: 160rpx;
    }

    .t_item {
        // border-bottom: 2rpx solid #e2e1e3;
        background-color: #fff;
        padding: 32rpx 0;
        padding-left: 24rpx;
        border-radius: 24rpx;
        margin-bottom: 16rpx;

        .placeOrderUser {
            height: 84rpx;

            .tag {
                padding: 12rpx 20rpx;
                background:linear-gradient(90deg, #31E597 0%, #40E0EA 100%);
                border-radius: 32rpx;
                font-size: 24rpx;
                color: #fff;

                &.core {
                    background: #bfbfbf;
                }
            }
        }

        .user_img {
            width: 80rpx;
            height: 80rpx;
            border-radius: 50%;
            margin-right: 16rpx;
            // border: 2rpx solid #383228;
            // background-color: rgba($color: $motif-color, $alpha: 0.5);
        }

        .user_name {
            font-size: 28rpx;
            font-weight: bold;
            color: #1A1A1A;

            .official {
                width: 56rpx;
                height: 32rpx;
                background: linear-gradient(135deg, #ffb43d 0%, #ff473f 100%);
                font-size: 20rpx;
                color: #ffffff;
                border-radius: 6rpx;
                margin-left: 8rpx;


            }

            .c_time {
                font-size: 24rpx;
                // font-weight: 500;
                color: #8D8D94;
                margin-top: 4rpx;
            }
        }

        .goods {
            margin-top: 24rpx;
            padding-bottom: 24rpx;
            border-bottom: 2rpx dashed #E5E5E5;

            .goods_li {
                height: 160rpx;
                width: calc(100% - 72rpx);
                overflow-x: auto;
                overflow-y: hidden;
                white-space: nowrap;
                font-size: 0;
                
                display: flex;
                .goods_img {
                    width: 144rpx;
                    height: 144rpx;
                    background: linear-gradient( 0deg, #CCFFF4 0%, #FFFFFF 60%);
                    border-radius: 16rpx 16rpx 16rpx 16rpx;
                    border: 2rpx solid #A1FAE3;
                    box-sizing: content-box;
                    // margin: 4rpx;
                    overflow: scroll;
                    margin-right: 20rpx;

                    .num{
                        position: absolute;
                        right: 0;
                        bottom: 0;
                        min-width: 52rpx;
                         width: fit-content;
                         height: 32rpx;
                         line-height: 32rpx;
                        padding:0 6rpx;
                        
                        color: #fff;
                        font-size: 24rpx;
                        text-align: center;
                        background: rgba(0, 0, 0, 0.5);
                        color: #fff;
                        border-radius: 14rpx 0 14rpx 0;

                    }

                    &:last-child {
                        margin-right: 4rpx;
                    }

                    &.bor9 {
                        // box-shadow: 0 0 4rpx 4rpx $motif-color;
                        background: linear-gradient( 0deg, #FDEEF6 0%, #FFFFFF 60%);
border-radius: 16rpx 16rpx 16rpx 16rpx;
border: 4rpx solid #EA4CA4;
                    }

                    &.bore {
                        // box-shadow: 0 0 4rpx 4rpx #ed780c;
                        background: linear-gradient( 0deg, #FDEEF6 0%, #FFFFFF 60%);
border-radius: 16rpx 16rpx 16rpx 16rpx;
border: 4rpx solid #EA4CA4;
                    }

                    &.bor5 {
                        background: linear-gradient( 0deg, #FDEEF6 0%, #FFFFFF 60%);
border-radius: 16rpx 16rpx 16rpx 16rpx;
border: 4rpx solid #EA4CA4;
                        // box-shadow: 0 0 4rpx 4rpx $motif-color;
                        // box-shadow: 0 0 4rpx 4rpx #ed780c;
                    }

                    &.imgAsk{
                        background: #F5F6F8;
                        border: 4rpx solid #F5F6F8;
                        margin-right: 0;
                     
                        border-radius: unset;
                        vertical-align: top;
                        // vertical-align: middle;
                    }
                }

                .ico3 {
                    width: 40rpx;
                    height: 40rpx;
                    margin: 55rpx 0;
                    margin-right: 12rpx;
                }
            }

            .goods_num {
                font-size: 24rpx;
                font-weight: 500;
                padding: 0 4rpx;
            }
        }

        .bottom_btn {
            margin-top: 24rpx;

            .btnE {
                // width: 220rpx;
                padding: 0 16rpx;
                height: 60rpx;
                background: #F5F6F8;;
                border-radius: 8rpx;
                // border: 2rpx solid #f4f4f4;
                font-weight: bold;
                font-size: 20rpx;
                color: #8D8D94;
                margin-right: 16rpx;
                .price{
                  color: #FF932B;
                }
            }

            .btn {
                color: #fff;
                width: 134rpx;
                height: 56rpx;
                line-height: 56rpx;
                text-align: center;
                font-size: 24rpx;
                font-weight: bold;
                background: #1A1A1A;
                box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(0, 0, 0, 0.25);
                border-radius:32rpx;
                position: relative;
                margin-right: 24rpx;
            }

            .btn1 {
                color: #fff;
                width: 134rpx;
                height: 56rpx;
                line-height: 56rpx;
                text-align: center;
                font-size: 24rpx;
                font-weight: bold;
                background: #1A1A1A;
                // box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(0, 0, 0, 0.25);
                border-radius:32rpx;
                padding-left: 10rpx;
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-right: 24rpx;

                .icof {
                    margin-left: 10rpx;
                    font-size: 35rpx;
                    font-weight: lighter;
                }
            }
        }

        .m_ico {
            width: 32rpx;
            height: 28rpx;
            margin-right: 8rpx;

            &.big {
                width: 40rpx;
                height: 40rpx;
            }
        }

        .goods_remark {
            font-size: 24rpx;
            font-weight: bold;
            margin-top: 20rpx;

            .m_ico {
                width: 40rpx;
                height: 40rpx;
            }

            span {
                width: calc(100% - 56rpx);
            }
        }
    }
}

@keyframes myFn1 {
    0% {
        padding: 0;
        margin: 8rpx 26rpx;
    }

    100% {
        padding: 8rpx 26rpx;
        margin: 0;
    }
}

.tobBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;

    .balance {
        width: 136rpx;
        height: 56rpx;
            background-image: url("https://img.shinemang.com/gachaStatic/market/balance.png");
    background-size: 100% 100%;
        // display: flex;
        // align-items: center;
        // justify-content: center;
        // height: 60rpx;
        // background: #f9f9f9;
        // border-radius: 40rpx 40rpx 40rpx 40rpx;
        // border: 2rpx solid #f4f4f4;
        // padding: 26rpx;

        // .imgbalance {
        //     width: 28rpx;
        //     height: 28rpx;
        //     margin-right: 8rpx;
        // }
    }
}

.gold_coin {
    background-image: url("https://img.shinemang.com/gachaStatic/static/img/my/gold_coin.png");
    background-size: 100% 100%;
}
.exchangeRules{
    width: 56rpx;
    height: 176rpx;
     background-image: url("https://img.shinemang.com/gachaStatic/market/rules.png");
    background-size: 100% 100%;
    position: fixed;
    right: 0;
    top: 270rpx;
    z-index: 55;
}

.filtrate-bar {
    display: flex;
    justify-content: space-between;
    font-size: 26rpx;
    font-family: PingFang SC, PingFang SC;
    font-weight: bold;
    font-size: 28rpx;
    color: #343434;
    padding: 22rpx 22rpx;
    padding-left: 0;


    // margin: 20rpx 0;
    .tag {
        font-size: 28rpx;
        color: #615e74;

        img {
            width: 28rpx;
            height: 28rpx;
            margin-left: 10rpx;
        }
    }

    .lBox {
        display: flex;

        .l {
            height: 68rpx;
            line-height: 68rpx;

            .fil-item {
                display: flex;
                align-content: center;
                margin-right: 24rpx;
                align-items: center;
                width: 128rpx;
                    height: 56rpx;
                    background: #FFFFFF;
                    border-radius: 28rpx 28rpx 28rpx 28rpx;
                    color: #8D8D94;
                    font-size: 24rpx;
                    font-weight: normal;
                    justify-content: center;
            }

            .sim {
                margin-left: 6rpx;
                width: 24rpx;
                height: 24rpx;
                background-image: url("https://img.shinemang.com/gachaStatic/static/img/pay/shouqi.png");
                background-size: 100% 100%;
            }

            .sim1 {
                margin-left: 6rpx;
                width: 24rpx;
                height: 24rpx;
                background-image: url("https://img.shinemang.com/gachaStatic/static/img/pay/zhankai.png");
                background-size: 100% 100%;
            }
        }
    }

    .trendsetter {
        width: 68rpx;
        height: 68rpx;
        background-size: 100% 100%;
    }
}

.uni-swiper-slides {
    width: 128rpx;
    height: 128rpx;
    min-width: 128rpx;
}
</style>