<!-- 交易详情 -->
<template>
    <view class="marketDetails" :style="{ paddingTop: MBInfo().top + 'px' }">
        <div class="navbar_x flex_r flex_jb flex_ac" :style="{ height: MBInfo().height + 'px' }">
            <view class="top_Back" @click.stop="gateBack">
                <text class="icof Back_ico">&#xe72c;</text>
                <text class="txt">返回</text>
            </view>
        </div>
        <div class="transaction_Details" :style="{ height: conHeight }">
            <scroll-view :scroll-y="true" class="transaction_scroll" :refresher-enabled="true"
                refresher-background="rgba(0,0,0,0)" :refresher-triggered="triggered" @refresherrefresh="onRefresh"
                @refresherrestore="onRestore" :refresher-threshold="60">
                <div class="info_Box">
                    <div class="user flex_r flex_ac">
                        <img class="user_img" :src="orderinfo.userAvatar | active" />
                        <div class="user_name">
                            <div>{{ orderinfo.userName }}</div>
                            <div class="c_time">{{ orderinfo.createTime }}</div>
                        </div>
                    </div>
                    <div class="goods_remark flex_r flex_ac flex_jb" v-if="orderinfo.content">
                        <img src="https://img.chaoshewang.com/static/img/market/ico2.png" class="m_ico big" />
                        <span>{{ orderinfo.content }}</span>
                    </div>
                    <div class="goods flex_r flex_jb flex_ac">
                        <div class="goods_li">
                            <template v-if="orderinfo.wantItem">
                                <img class="goods_img" :src="orderinfo.wantItem.coverThumb" :class="[
                                    myRewardData.length ? 'bore' : 'bor9',
                                ]" @click="ondetail(orderinfo.wantItem.itemId)" />
                                <img src="https://img.chaoshewang.com/static/img/transaction/ico3.png"
                                    v-if="myRewardData.length" class="ico3" />
                            </template>
                            <img v-for="(cont, i) in myRewardData" :key="i" class="goods_img" :src="cont.coverThumb"
                                @click="ondetail(cont.itemId)" />
                        </div>
                        <div class="goods_num flex_r flex_jc flex_ac" v-if="myRewardData.length > 0">
                            x{{ myRewardData.length }}
                        </div>
                    </div>
                    <div class="bottom_btn flex_r flex_je flex_ac">
                        <template v-if="orderinfo.wantItem">
                            <div class="btnE flex_r flex_ac flex_jc" v-if="
                                !myRewardData.length && orderinfo.askPrice
                            ">
                                <img src="https://img.chaoshewang.com/static/img/market/ico3.png" class="m_ico" />
                                <span>求购：{{ orderinfo.askPrice }}</span>
                            </div>
                            <template v-else>
                                <div class="btnE flex_r flex_ac flex_jc">
                                    <img src="https://img.chaoshewang.com/static/img/market/ico4.png" class="m_ico" />
                                    <span>以物换物</span>
                                </div>
                                <div class="btnE flex_r flex_ac flex_jc" v-if="orderinfo.askPrice">
                                    <img src="https://img.chaoshewang.com/static/img/market/ico3.png" class="m_ico" />
                                    <span>加价：{{ orderinfo.askPrice }}</span>
                                </div>
                            </template>
                        </template>
                        <template v-else>
                            <div class="btnE flex_r flex_ac flex_jc" v-if="orderinfo.buyPrice">
                                <img src="https://img.chaoshewang.com/static/img/market/ico5.png" class="m_ico" />
                                <span>一口价：{{ orderinfo.buyPrice }}</span>
                            </div>
                        </template>
                        <div class="btn" @click="onclickDeal" v-if="
                            !ishistory &&
                            orderinfo.state == 'MarketOrderState_Open'
                        ">
                            {{
                                orderinfo.userId == userInfo.id
                                    ? "撤回赏品"
                                    : "参与交易"
                            }}
                        </div>
                    </div>
                </div>
                <div class="users_list">
                    <div class="user_item" v-for="(item, index) in otherList" :key="index">
                        <div class="flex_r flex_ac flex_jb">
                            <div class="user flex_r flex_ac">
                                <img class="user_img" :src="item.userAvatar | active" />
                                <div class="user_name">
                                    <div>{{ item.userName }}</div>
                                    <div class="c_time">
                                        {{ item.createTime }}
                                    </div>
                                </div>
                            </div>
                            <div class="btnE flex_r flex_ac flex_jc" v-show="item.userId != userInfo.id ||
                                (item.offerPrice > 0 &&
                                    item.userId == userInfo.id)
                                ">
                                <img src="https://img.chaoshewang.com/static/img/market/ico5.png" class="m_ico" />
                                <span v-if="
                                    item.offerPrice > 0 ||
                                    (item.userId != orderinfo.userId &&
                                        orderinfo.userId == userInfo.id &&
                                        item.offerPrice >= 0)
                                ">{{ item.offerPrice }}</span>
                                <span v-else class="hide">***</span>
                            </div>
                        </div>
                        <div class="Records" v-if="item.offerItems">
                            <img :src="i.cover" class="Record_img" v-for="(i, s) in item.offerItems" :key="s"
                                @click="ondetail(i.itemId)" />
                        </div>
                        <div class="u_btns flex_r flex_ac flex_je">
                            <div class="btn_item" v-if="
                                orderinfo.userId == userInfo.id &&
                                !ishistory &&
                                item.state != 'UserOfferState_Done' &&
                                item.state != 'UserOfferState_Failed'
                            " @click="onclickRefuse(item.id)">
                                拒绝
                            </div>
                            <div class="btn_item corb" v-if="
                                orderinfo.userId == userInfo.id &&
                                !ishistory &&
                                item.state != 'UserOfferState_Done' &&
                                item.state != 'UserOfferState_Failed'
                            " @click="onclickSure(item.id)">
                                交易
                            </div>
                            <div class="btn_item" v-if="
                                item.userId == userInfo.id &&
                                !ishistory &&
                                item.state != 'UserOfferState_Done' &&
                                item.state != 'UserOfferState_Failed'
                            " @click="onclickCancel(item.id)">
                                撤回交易
                            </div>
                            <div class="btn_item corb" v-if="item.state == 'UserOfferState_Done'">
                                交易成功
                            </div>
                        </div>
                    </div>
                </div>
            </scroll-view>
        </div>
        <!-- 选品 | 出价 -->
        <u-popup :show="popupShow" bgColor="transparent" :safeAreaInsetBottom="false">
            <div class="select_product_popup">
                <view class="tabs_two flex_r flex_jb">
                    <view class="tab_item" :class="{ active: i == active2 }" @click="ontab2(i, s)"
                        v-for="(i, s) in navbar2" :key="s">{{ i }}</view>
                </view>
                <img @click="popupShow = false" src="https://img.chaoshewang.com/static/img/transaction/close.png"
                    class="close_btn" />
                <view class="p_lists">
                    <div class="flex_r flex_jb">
                        <view>
                            <view class="teg cor_g">已选{{ selectRewardIds.length || 0 }}个</view>
                            <view class="teg">赏品共{{ typeTotReward || 0 }}个</view>
                        </view>
                    </div>
                    <scroll-view scroll-y="true" class="list_box" @scrolltolower="onReachScollBottom"
                        :lower-threshold="400">
                        <div class="lists">
                            <view class="item" v-for="(item, index) in allRewardInfo" :key="index"
                                @click="onClickSelectReward(item)">
                                <view class="item_img" :style="{
                                    backgroundImage: `url(${item.item.coverThumb})`,
                                }">
                                    <img v-if="selectRewardIds.includes(item.id)"
                                        src="https://img.chaoshewang.com/static/img/shanggui/xuanzhong.png"  class="box_ico" />
                                    <view class="box_ico frame" v-else></view>
                                    <!-- <img v-else src="https://img.chaoshewang.com/static/img/shanggui/group_1.png"
                                        class="box_ico" /> -->
                                    <view class="item_txt1">{{ item.item.saleType == 1 ? "现货": "预售" }}</view>
                                </view>
                                <view class="item_name ellipsis">{{ item.item.name}}</view>
                            </view>
                        </div>
                    </scroll-view>
                    <view class="mt20 flex_r flex_ac flex_jb">
                        <div class="money_input">
                            <img src="https://img.chaoshewang.com/static/img/market/ico5.png" class="m_ico" />
                            <!-- @input="keymoney = keymoney.replace(/[^\d]/g,'') " -->
                            <input v-model="keymoney" maxlength="5" max="50000" type="number" placeholder="请输入金额"
                                @input="onKeymoney" class="input" />
                        </div>
                        <x-btn txt="确认" @click="confirmSure" cor="1" />
                    </view>
                </view>
            </div>
        </u-popup>
        <!-- 确认出价 -->
        <u-popup :show="popupShow3" mode="center" bgColor="transparent" :safeAreaInsetBottom="false">
            <div class="preview_product">
                <div class="head_tit">
                    <img @click="popupShow3 = false" src="https://img.chaoshewang.com/static/img/transaction/close2.png"
                        class="close_btn" />
                    <div class="title">请您确定交易信息</div>
                    <div class="txt">确认交易信息，避免给您带来经济损失</div>
                </div>
                <div class="products_info">
                    <div class="tit">交易赏品：</div>
                    <div class="products">
                        <div class="product_list">
                            <div class="img" v-for="(item, index) in selectRewardsInfo" :key="index">
                                <view class="item_img" :style="{ backgroundImage: `url(${item.item.coverThumb})`}">
                                    <view class="box_ico frame"></view>
                                    <!-- <img
                                        src="https://img.chaoshewang.com/static/img/shanggui/group_1.png"
                                        class="box_ico"
                                    /> -->
                                    <view class="item_txt1">{{item.item.saleType == 1? "现货": "预售"}}</view>
                                </view>
                            </div>
                        </div>
                    </div>
                    <div class="money_box flex_r flex_ac">
                        <div class="tit">交易金额：</div>
                        <div class="money">{{ Number(keymoney) || "无" }}</div>
                    </div>
                </div>
                <div class="popup_btn flex_r flex_jc">
                    <x-btn txt="确认" @click="confirmSelect" cor="1" />
                </div>
            </div>
        </u-popup>
        <!-- 支付 -->
            <!-- 调用open 打开弹框  交易详情-->
        <x-pay @success="confirmOrder" ref="xPay" mtype="6" :probabilityShow="[]" />
        <gachaDetails ref="gachaDetails" />
        <!-- 通用提示框 -->
        <show-modal></show-modal> 
        <autonym @onAutonym="onAutonym" ref="autonym" :visible="showAutonym" />
    </view>
</template>
<script>
import { post } from "@/utils/api.js";
import xBtn from "@/components/modules/x-btn.vue";
import xPay from "@/components/x-pay/index.vue";
import autonym from "@/components/autonym/index.vue";
import { mapMutations } from "vuex";
import { callPayment } from "@/utils/pay.js";
let that;
export default {
    data() {
        return {
            order_id: 0,
            orderinfo: {},
            otherList: [],
            myRewardData: [],
            userInfo: this.$gl("userInfo") || {},
            popupShow: false,
            popupShow3: false,
            selectType: 0, // 添加待交易赏品的子分类（全部、现货、预售）
            navbar2: ["全部", "现货", "预售"],
            active2: "全部",
            typeTotReward: 0, // 待交易分类赏品总数
            allRewardInfo: [], // 所有待交易赏品信息
            selectRewardIds: [], // 已选赏品的id
            selectRewardsInfo: [],
            keymoney: undefined,
            ishistory: false,
            pageda: {
                page: 1,
                page_size: 20,
                total: 20,
            },
            triggered: true,
            typeId: 0,
            showAutonym: false,
            closeAutonym: false,
            recycleState:0,
        };
    },
    components: {
        xBtn,
        xPay,
        autonym,
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
    onLoad(da) {
        this.order_id = da.id;
        if (da.history) {
            this.ishistory = da.history;
        }
        this.getOrderDetail();
    },
    onShow() { },
    created() {
        that = this;
    },
    mounted() {
        this.closeAutonym = this.userInfo.isAuthenticated;
    },
    methods: {
        ...mapMutations(["UppayMessage"]),
        async onAutonym() {
            this.showAutonym = false;
            let a = await post("v1/user/self/get", {
                user_id: this.userInfo.id,
            });
            this.closeAutonym = a.isAuthenticated;
            if (this.closeAutonym) this.onclickDeal();
        },
        onKeymoney(e) {
            this.keymoney = e.target.value.replace(/[^\d]/g, "");
            e.target.value > 50000 ? (this.keymoney = 50000) : "";
        },
        onRefresh() {
            this.getOrderDetail();
            setTimeout(() => {
                this.triggered = false;
            }, 600);
        },
        onRestore() {
            this.triggered = "restore"; // 需要重置
        },
        getOrderDetail() {
            // 获取详情
            uni.showLoading({
                title: "加载中",
            });
            post("v1/market/order/detail", {
                order_id: this.order_id,
            }).then((res) => {
                this.orderinfo = res.order;
                this.otherList = res.offerRecords;
                this.myRewardData = res.order.items;
                uni.hideLoading();
            });
        },
        onclickDeal() {
            if (this.orderinfo.userId == this.userInfo.id) {
                this.$showModal({
                    title: "操作提示",
                    content: "您确定要撤回当前赏品么？",
                    success(res) {
                        if (res.confirm) {
                            post("v1/market/order/close", {
                                order_id: that.order_id,
                            }).then((res) => {
                                if (res.code) {
                                    uni.$u.toast(res.message);
                                } else {
                                    uni.$u.toast("赏品撤回成功！");
                                    setTimeout(() => {
                                        that.gateBack();
                                    }, 1000);
                                }
                            });
                        }
                    },
                });
            } else {
                if (!this.userInfo.isAuthenticated && !this.closeAutonym) {
                    this.showAutonym = !this.userInfo.isAuthenticated; // 是否已实名认证;
                    return;
                }
                let enable = true;
                for (let v of this.otherList) {
                    if (v.userId == this.userInfo.id) enable = false;
                }
                if (enable) {
                    if (
                        this.orderinfo.type == "MarketOrderType_Ask" ||
                        this.orderinfo.type == "MarketOrderType_Buy"
                    ) {
                        // 以物换物
                        this.getRewardsInfo();
                    } else {
                        post("v1/market/offer/create", {
                            order_id: this.orderinfo.id,
                            offer_price: Math.random() * 100,
                        }).then((res) => {
                            this.getOrderDetail();
                        });
                    }
                } else uni.$u.toast("您已参与当前交易，请先撤回交易");
            }
        },
        onclickRefuse(id) {
            // 拒绝交易
            this.$showModal({
                title: "操作提示",
                content: "您确定要拒绝当前交易么？",
                success(res) {
                    if (res.confirm) {
                        post("v1/market/offer/reject", {
                            offer_id: id,
                        }).then((res) => {
                            that.getOrderDetail();
                            uni.$u.toast("拒绝成功~");
                        });
                    }
                },
            });
        },
        onclickSure(id) {
            // 确认交易
            this.$showModal({
                title: "操作提示",
                content: "您确定要同意当前交易么？",
                success(res) {
                    if (res.confirm) {
                        post("v1/market/offer/deal", {
                            order_id: that.orderinfo.id,
                            offer_id: id,
                        }).then((res) => {
                            if (res.code) {
                                uni.$u.toast(res.message);
                            } else {
                                that.getOrderDetail();
                                setTimeout(() => {
                                    // that.gateBack()
                                    uni.$u.toast("赏品交易成功！");
                                }, 500);
                            }
                        });
                    }
                },
            });
        },
        onclickCancel(id) {
            // 撤回交易
            this.$showModal({
                title: "操作提示",
                content: "您确定要撤回当前交易么？",
                success(res) {
                    if (res.confirm) {
                        post("v1/market/offer/cancel", {
                            offer_id: id,
                        }).then((res) => {
                            that.getOrderDetail();
                            uni.$u.toast("撤回成功！");
                        });
                    }
                },
            });
        },
        getRewardsInfo() {
            this.pageda.page = 1;
            this.popupShow = true;
            this.getSubclassReward();
        },
        ontab2(item, index) {
            this.pageda.page = 1;
            this.active2 = item;
            this.selectType = index;
            this.allRewardInfo = [];
            this.getSubclassReward();
        },
        // 获取次级页面的赏品的信息
        getSubclassReward() {
            post("v1/cabinet/stock/list", {
                sale_type: this.selectType,
                state: 1,
                order_by_create_time: 2,
                order_by_award_level: 1,
                order_by_theme_type: 1,
                ...this.pageda,
            }).then((res) => {
                if (!res.code) {
                    if (this.pageda.page == 1) {
                        this.allRewardInfo = [];
                    }
                    this.typeTotReward = res.totalNums;
                    this.allRewardInfo = [
                        ...this.allRewardInfo,
                        ...res.cabinetStocks,
                    ];
                    this.pageda.total = Number(res.totalNums);
                }
            });
        },
        onClickSelectReward(item) {
            let id = item.id;
            if (this.selectRewardIds.includes(id)) {
                let val = this.selectRewardIds.indexOf(id);
                this.selectRewardIds = this.remove(this.selectRewardIds, id);
                this.selectRewardsInfo.splice(val, 1);
            } else {
                this.selectRewardIds.push(id);
                this.selectRewardsInfo.push(item);
            }
            if (this.selectRewardIds.length > 16) {
                let val = this.selectRewardIds.indexOf(id);
                this.selectRewardIds = this.remove(this.selectRewardIds, id);
                this.selectRewardsInfo.splice(val, 1);
            }
        },
        onReachScollBottom() {
            if (this.pageda.total > this.pageda.page * this.pageda.page_size) {
                this.pageda.page++;
                this.getSubclassReward();
            }
        },
        confirmSure() {
            this.popupShow = false;
            if (
                this.selectRewardsInfo.length < 1 &&
                (!this.keymoney || this.keymoney <= 0)
            ) {
                uni.$u.toast("您未选择赏品或出价");
            } else {
                if (this.selectRewardsInfo.length < 1) {
                    this.confirmSelect();
                } else {
                    this.popupShow3 = true;
                }
            }
        },

        async confirmSelect() {
            this.keymoney == "" ? (this.keymoney = 0) : this.keymoney;
            let data = {
                order_id: this.orderinfo.id,
                offer_price: this.keymoney,
                offer_stock_ids: this.selectRewardIds,
            };
            if (this.keymoney && this.keymoney > 0) {
                this.$refs.xPay.open(
                    this.keymoney,
                    1,
                    getApp().globalData.RechargeType.MarketOffer,
                    0,
                    "0"
                );
                this.UppayMessage({
                    url: "v1/market/offer/create",
                    message: data,
                });
            } else {
                let res = await callPayment("v1/market/offer/create", data, 0);
                if (!res.code) {
                    this.confirmOrder();
                }
            }
        },
        confirmOrder() {
            this.getOrderDetail();
            this.popupShow3 = false;
            this.selectRewardIds = [];
            this.selectRewardsInfo = [];
            this.selectNums = 0;
        },

        ondetail(id) {
            this.gachaDetailsMethod(this, id)
        },
    },
};
</script>
<style lang='scss' scoped>
.marketDetails {
    width: 100vw;
    height: 100vh;
    position: relative;
    padding: 100rpx 0 0;
    background: linear-gradient(104deg, #e1d6f8 0%, #f8e7ed 100%);
    overflow-y: auto;

    &::before {
        content: "";
        width: 100vw;
        height: calc(100vh - 212rpx);
        left: 0;
        top: 212rpx;
        position: absolute;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #f0f0f0 50%);
    }
}

.frame {
    background: url("@/static/homePage/frame.png");
    background-size: 100% 100%;
}

.navbar_x {
    padding: 0 32rpx;

    .btn_r {
        width: 162rpx;
        height: 46rpx;
    }

    .top_Back {
        color: #1c1c1c;

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

.transaction_Details {
    width: calc(100% - 64rpx);
    height: calc(100vh - 180rpx);
    background-color: #fff;
    border-radius: 16rpx;
    padding: 28rpx 36rpx;
    position: absolute;
    bottom: 0;
    left: 32rpx;
    overflow-y: auto;
}

.transaction_scroll {
    height: 100%;
}

.user {
    .user_img {
        width: 84rpx;
        height: 84rpx;
        border-radius: 50%;
        border: 2rpx solid #383228;
        margin-right: 12rpx;
    }

    .user_name {
        font-size: 28rpx;
        font-weight: bold;

        .c_time {
            font-size: 24rpx;
            font-weight: 500;
            color: #615e74;
            margin-top: 12rpx;
        }
    }
}

.info_Box {
    border-bottom: 2rpx solid #e2e1e3;
    padding-bottom: 30rpx;

    .goods {
        margin-top: 20rpx;

        .goods_li {
            height: 158rpx;
            width: calc(100% - 60rpx);
            overflow-x: auto;
            overflow-y: hidden;
            white-space: nowrap;

            .goods_img {
                height: 150rpx;
                width: 150rpx;
                border-radius: 16rpx;
                box-sizing: border-box;
                border: 6rpx solid #fff;
                box-shadow: 0 0 4rpx 4rpx #cacaca;
                margin: 4rpx;
                margin-right: 20rpx;

                &:last-child {
                    margin-right: 4rpx;
                }

                &.bor9 {
                    box-shadow: 0 0 4rpx 4rpx $motif-color;
                }

                &.bore {
                    box-shadow: 0 0 4rpx 4rpx #ed780c;
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
        margin-top: 26rpx;

        .btn {
            color: #fff;
            width: 134rpx;
            height: 60rpx;
            line-height: 60rpx;
            text-align: center;
            font-size: 24rpx;
            font-weight: bold;
            background: #282828;
            box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(0, 0, 0, 0.25);
            border-radius: 36rpx 24rpx 4rpx 36rpx;
            position: relative;
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

.btnE {
    width: 220rpx;
    height: 60rpx;
    background: #f9f9f9;
    border-radius: 40rpx;
    border: 2rpx solid #f4f4f4;
    font-weight: bold;
    font-size: 20rpx;
    margin-right: 16rpx;
}

.m_ico {
    width: 32rpx;
    height: 28rpx;
    margin-right: 12rpx;

    &.big {
        width: 40rpx;
        height: 40rpx;
    }
}

.hide {
    font-size: 26rpx;
    height: 24rpx;
    line-height: 34rpx;
}

.users_list {
    height: 1200rpx;

    .user_item {
        padding: 28rpx 0;
        border-bottom: 2rpx dashed #e2e1e3;
    }

    .u_btns {
        margin-top: 16rpx;
    }

    .btn_item {
        padding: 8rpx 26rpx;
        border-radius: 40rpx;
        font-size: 24rpx;
        background: #d0d0d0;
        margin-left: 12rpx;

        &.corb {
            color: #fff;
            background: #715cdd;
        }
    }
}

.Records {
    margin-top: 20rpx;
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;

    .Record_img {
        width: 150rpx;
        height: 150rpx;
        margin-right: 16rpx;
        border-radius: 12rpx;
    }
}

.tabs_two {
    margin-top: 40rpx;
    width: 318rpx;
    height: 76rpx;
    background: url("https://img.chaoshewang.com/static/img/transaction/Rectangle.png");
    background-size: 100% 100%;
    font-size: 28rpx;
    color: #ffffff;
    line-height: 28rpx;
    position: relative;

    .tab_item {
        width: 182rpx;
        line-height: 60rpx;
        text-align: center;
        position: absolute;

        &:first-child {
            left: -16rpx;
        }

        &:last-child {
            right: -6rpx;
        }

        &.active {
            top: -8rpx;
            color: #333;
            height: 84rpx;
            line-height: 70rpx;
            font-weight: bold;
            background: url("https://img.chaoshewang.com/static/img/transaction/tab_bg1.png");
            background-size: 100% 100%;
            font-size: 30rpx;
        }
    }
}

.p_lists {
    height: calc(100vh - 230rpx);
    position: relative;
    top: -16rpx;
    left: 0;
    border-radius: 0 50rpx 0 0;
    background: #f4f4f4;
    padding: 30rpx 36rpx;
    overflow-y: auto;

    .teg {
        height: 36rpx;
        text-align: center;
        background: rgba(102, 82, 207, 0.1);
        border-radius: 16rpx;
        line-height: 36rpx;
        color: #6652cf;
        font-size: 24rpx;
        margin-right: 16rpx;
        display: inline-block;
        padding: 0 16rpx;

        &:last-child {
            margin-right: 0;
        }
    }

    .cor_g {
        color: #23b408;
        background: rgba(35, 180, 8, 0.1);
    }

    .lists {
        @include grid(152rpx);
        padding: 28rpx 0 120rpx;

        .item {
            width: 152rpx;
            margin-bottom: 18rpx;

            .item_img {
                width: 152rpx;
                height: 152rpx;
                border-radius: 16rpx;
                background-size: 100% 100%;
                position: relative;

                .item_txt1 {
                    color: #ffffff;
                    font-size: 20rpx;
                    position: absolute;
                    right: 6rpx;
                    top: 0rpx;
                }
            }

            .item_name {
                margin: 5rpx 0;
                font-size: 20rpx;
                font-weight: bold;
                color: #343434;
            }

            .item_no {
                font-size: 16rpx;
                color: #343434;
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
        }
    }
}

.select_product_popup {
    height: 1200rpx;
    position: relative;

    .tabs_two {
        background: url("https://img.chaoshewang.com/static/img/shanggui/tabs_bg.png");
        background-size: 100% 100%;
        width: 372rpx;
        margin-top: 0;

        .tab_item {
            width: 156rpx;

            &:nth-child(2) {
                right: 120rpx;
            }
        }
    }

    .close_btn {
        position: absolute;
        right: 36rpx;
        top: 0;
        width: 56rpx;
        height: 56rpx;
    }

    .p_lists {
        height: calc(100% - 60rpx);

        .lists {
            padding: 0;
        }
    }

    .list_box {
        height: calc(100% - 200rpx);
        margin-top: 20rpx;
    }

    .select_product_con {
        border-radius: 0 50rpx 0 0;
        width: 100%;
        height: calc(100% - 70rpx);
        background: #f4f4f4;
        position: absolute;
        left: 0;
        top: 70rpx;
        padding: 50rpx 36rpx;

        .result {
            margin-top: 20rpx;
            padding: 0;
            top: 0;
            height: calc(100% - 200rpx);

            .tit {
                font-size: 28rpx;
            }

            .list_box {
                height: calc(100% - 60rpx);
            }
        }
    }

    .mt20 {
        margin-top: 30rpx;
    }

    .money_input {
        position: relative;

        .m_ico {
            width: 52rpx;
            height: 52rpx;
            position: absolute;
            top: calc((100% - 52rpx) / 2);
            left: 30rpx;
        }

        .input {
            border: none;
            height: 88rpx;
            width: 220rpx;
            background-color: #fff;
            border-radius: 88rpx;
            font-size: 24rpx;
            padding-left: 100rpx;
        }
    }
}

.preview_product {
    height: 680rpx;
    width: 686rpx;
    border-radius: 16rpx;
    background-color: #fff;

    .head_tit {
        height: 188rpx;
        background: linear-gradient(104deg, #e1d6f8 0%, #f8e7ed 100%);
        border-radius: 16rpx 16rpx 0 0;
        position: relative;
        padding: 46rpx 40rpx;

        .title {
            font-size: 40rpx;
            font-weight: 800;
            color: #1c1c1c;
        }

        .txt {
            margin-top: 8rpx;
            color: #9e91ac;
            font-size: 28rpx;
        }
    }

    .close_btn {
        width: 52rpx;
        height: 52rpx;
        position: absolute;
        right: 16rpx;
        top: 12rpx;
    }

    .products_info {
        padding: 30rpx 36rpx;

        .tit {
            font-size: 28rpx;
            color: #1c1c1c;
        }

        .products {
            padding: 20rpx 26rpx;
            border-radius: 16rpx;
            background: #f4f4f4;
            margin: 16rpx 0 26rpx;

            .product_list {
                overflow-x: auto;
                white-space: nowrap;
                height: 152rpx;
            }

            .img {
                width: 152rpx;
                height: 152rpx;
                border-radius: 16rpx;
                display: inline-block;
                margin-right: 20rpx;

                &:last-child {
                    margin-right: 0;
                }

                .item_img {
                    width: 152rpx;
                    height: 152rpx;
                    border-radius: 16rpx;
                    background-size: 100% 100%;
                    position: relative;

                    .box_ico {
                        height: 152rpx;
                        width: 152rpx;
                    }

                    .item_txt1 {
                        color: #ffffff;
                        font-size: 20rpx;
                        position: absolute;
                        right: 6rpx;
                        top: 0rpx;
                    }
                }
            }
        }

        .leave {
            color: #343434;
            font-size: 24rpx;
            padding: 16rpx 30rpx;
            border-radius: 16rpx;
            background: #e2e1e3;
            margin-top: 16rpx;
        }

        .money_box {
            margin-bottom: 30rpx;
        }

        .money {
            font-size: 35rpx;
            color: #343434;
            font-weight: 800;

            &::before {
                content: "￥";
                font-size: 24rpx;
            }
        }
    }

    .popup_btn {
        margin-top: 0;
        position: absolute;
        left: calc((686rpx - 270rpx) / 2);
        bottom: 38rpx;
    }
}
</style>