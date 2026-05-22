<template>
    <view class="purchase">
        <div class="navbar_x flex_r flex_jb flex_ac">
            <view class="top_Back" @click.stop="gateBack">
                <text class="icof Back_ico">&#xe72c;</text>
                <text class="txt">返回</text>
            </view>
            <view class="header1">订单确认</view>
            <view style="width: 70px"></view>
        </div>
        <div class="selectGoods_con">
            <div class="formItem">
                <div class="txt" style="margin-bottom: 0">
                    <span class="icof">&#xe641;</span>收货地址
                </div>
                <div class="address_box flex_r flex_jb flex_ac" @click="toList">
                    <div class="address_info" v-if="selectAddr.name">
                        <div class="flex_r flex_ac">
                            <div class="tags flex_r flex_ac">
                                <div class="tag corr" v-if="selectAddr.isDefault">
                                    默认
                                </div>
                                <div class="tag corb" v-if="selectAddr.addressTag">
                                    {{ selectAddr.addressTag }}
                                </div>
                            </div>
                            <div class="address">
                                {{ selectAddr.province }}{{ selectAddr.city
                                }}{{ selectAddr.area }}{{ selectAddr.subArea }}
                            </div>
                        </div>
                        <div class="userAddr">
                            {{ selectAddr.address }}
                        </div>
                        <div class="userName">
                            <span>{{ selectAddr.name }}</span><span>{{ selectAddr.phoneNum }}</span>
                        </div>
                    </div>
                    <div class="address_info" v-else>
                        <div class="on_addr flex_r flex_ac">
                            <img src="https://img.shinemang.com/gachaStatic/static/img/shipments/addr_ico.png" class="addr_ico" />
                            <span class="addr_txt">选择收货地址</span>
                        </div>
                    </div>
                    <div class="addr_r_ico icof">&#xe72b;</div>
                </div>
            </div>
            <div class="formItem">
                <div class="commodity">
                    <div class="particulars">
                        <image class="imgc" :src="img" />
                        <div class="rightq">
                            <div class="textc">{{ commodityName }}</div>
                            <div class="priceBox">
                                <div class="price">
                                    <div class="a">￥</div>
                                    <div class="number">{{ price }}</div>
                                </div>
                                <div class="increase">
                                    <u-number-box v-model="number" :disabled="stock == 0" :min="1" :max="stock" integer
                                        @change="bindChange">
                                        <view slot="minus" class="minus" :class="[
                                            number < 2
                                                ? 'minusA'
                                                : 'minusB',
                                        ]">
                                            <u-icon name="minus" color="transparent"></u-icon>
                                        </view>

                                        {{ number }}
                                        <view slot="plus" class="plus" :class="[
                                            number == stock
                                                ? 'addA'
                                                : 'add',
                                        ]">
                                            <u-icon name="plus" color="transparent"></u-icon>
                                        </view>
                                    </u-number-box>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="remarkBox">
                        <div>运费</div>
                        <div>免运费</div>
                    </div>
                    <div class="remarkBox">
                        <div class="orderForm">订单备注</div>
                        <div class="remarka flex_je" @click="downShow = true;">
                            <div class="textc">{{ text }}</div>
                            <div class="addr_r_ico icof" @click="downShow = true;">
                                &#xe72b;
                            </div>
                        </div>
                    </div>
                </div>
                <div class="totalB">
                    <div></div>
                    <div class="totalc">
                        <div style="margin-right: 16rpx">
                            共{{ number }}件 | 总计:
                        </div>
                        <div class="price">
                            <div class="a">￥</div>
                            <div class="number">{{ this.amount }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="formItem">
                <div class="pays">
                    <div class="pay_item flex_r flex_jb flex_ac" v-for="(i, s) in pays" @click="onPaytype(i)" :key="s"
                        v-show="i.show">
                        <div class="pay_name flex_r flex_ac">
                            <img :src="payIco(i.img)" class="pay_ico" />
                            <span>{{
                                i.type == 4
                                    ? i.name + "（" + i.number + "）"
                                    : i.name
                            }}</span>
                        </div>
                        <div class="reduce_pay flex_r flex_je">
                            <view class="consume" v-if="i.type && i.consume">支付￥{{ i.consume }}</view>
                            <div class="select" :class="{
                                active: paytypeList.includes(i.type),
                            }"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tishi">
                <div>
                    1、商品的实时价格会因为市场波动而产生变化,具体成交价以平台为准;
                </div>
                <div></div>
                <div>
                    2、由于显示器、拍照和做图的过程中,产品可能发生颜色偏差，具体请以实物为准;
                </div>
                <div></div>
                <div>3、如有任何疑问请随时联系在线客服咨询。</div>
            </div>
        </div>
        <div class="foot_btn flex_r">
            <div class="totala">
                <div class="b">总计:</div>
                <div class="price">
                    <div class="a">￥</div>
                    <div class="number">{{ amount }}</div>
                </div>
            </div>

            <x-btn txt="提交订单" @click="onHint" :style="{ opacity: '0.5' }" cor="3" v-if="number == 0" />
            <x-btn txt="提交订单" @click="onClickDraw" cor="3" v-else />
        </div>
        <!-- 留言 -->
        <remark :visible.sync="downShow" @childEvent="handleChildEvent" typeClass="0" />
    </view>
</template>
<script>
let that;
import { post } from "@/utils/api.js";
import xBtn from "@/components/modules/x-btn";
import remark from "./remark.vue";
import { mapState, mapActions } from "vuex";
import { callPayment } from "@/utils/pay.js";
export default {
    data() {
        return {
            selectRewardIds: [],
            selectRewardsInfo: [],
            remark: undefined, //备注
            selectAddr: {}, //选择的地址
            selectId: undefined,
            amount: 0, // 支付总额
            oldamount: 0, //未优惠的初始价格
            payNum: 0, // 数量（抽赏次数）
            source_type: 0, // 充值类型（用户在什么地方支付：玩法、集市、快递...）
            // device_id: "", // 设备id
            source_id: 0, // GachaID, MarketOrder, MarketOffer, 0（钱包）
            pays: [
                // #ifdef MP-WEIXIN
                {
                    name: "微信支付",
                    type: 3,
                    img: "WeChat",
                    show: true,
                    msg: "微信小程序支付",
                },
                // #endif
                // #ifndef MP-WEIXIN
                // {
                //     name: "微信支付",
                //     type: 2,
                //     img: "WeChat",
                //     show: true,
                //     msg: "微信APP支付",
                // },
                {
                    name: "金币余额",
                    type: 4,
                    img: "gold",
                    show: true,
                    msg: "金币支付",
                    randomShow: false,
                    consume: 0,
                    number: this.$gl("userInfo").gold,
                    payType: 3,
                },
                {
                    name: "支付宝",
                    type: 1,
                    img: "Ali",
                    show: true,
                    msg: "支付宝APP支付",
                    consume: 0,
                },
                // #endif
            ],
            // #ifndef MP-WEIXIN
            paytypeList: [4], // 0潮币 1支付宝 2微信 3微信小程序
            // #endif
            // #ifdef MP-WEIXIN
            paytypeList: [3], // 0潮币 1支付宝 2微信 3微信小程序
            // #endif
            providers: [],
            showAgree: false, //是否选择协议
            showAnimation: false, //是否跳过动画
            gachaInfo: {}, // 赏池信息
            downShow: false,
            text: "无备注",
            itemId: "",
            price: 0,
            totalPrice: 0,
            stock: 0,
            img: "",
            commodityName: "",
            number: 1,
            myPrice: 0,
            inputStyle: {
                pointerEvents: "none",
            },
            isDisabled: false,
            saleType: 1,
            id: "",
            address_id: "",
            gold: this.$gl("userInfo").gold,
        };
    },
    components: {
        xBtn,
        remark,
    },
    watch: {
        "$store.state.userInfo.gold": {
            handler(newVal) {
                this.pays.forEach((user) => {
                    if (user.type == 4) {
                        user.number = newVal; // 直接修改原对象
                    }
                });
                this.gold = newVal;
            },
        },
    },
    computed: {
        ...mapState(["userInfo"]),
    },
    onLoad(da) {
        this.itemId = da.id;
        this.price = da.price;
        this.totalPrice = da.price;
        this.amount = Number(da.price);
        this.stock = da.stock || 9999;
        this.id = da.itemId;
        this.getBalance();
        uni.setStorageSync("returnData", JSON.stringify(""));
        // #ifndef MP-WEIXIN
        this.paytypeList = [this.$gl("userInfo").gold > this.amount ? 4 : 1];
        // #endif
    },

    onShow() {
        const data = JSON.parse(uni.getStorageSync("returnData"));
        this.address_id = data;
        this.loadAddrList();
    },
    created() {
        that = this;
    },
    methods: {
        ...mapActions(["asyncUpBalance"]),
        onPaytype(item) {
            if (this.gold >= this.amount || !this.gold) {
                this.paytypeList = [item.type];
                this.pays.forEach((i) => (i.consume = 0));
            } else {
                if (
                    this.paytypeList.length == 1 &&
                    this.paytypeList.includes(item.type)
                ) {
                    return;
                }
                if (this.paytypeList.includes(item.type)) {
                    this.paytypeList = this.paytypeList.filter(
                        (x) => x !== item.type
                    );
                    item.consume = 0;
                } else {
                    this.paytypeList = [...this.paytypeList, item.type];
                }
                if (
                    this.paytypeList.includes(1) &&
                    this.paytypeList.length == 1
                )
                    this.pays.forEach((i) => (i.consume = 0));
                this.getPay();

            }
        },
        bindChange(e) {
            let a = this.totalPrice * e.value;
            this.amount = Number(a.toFixed(2));

            if (this.paytypeList.includes(4)) {
                if (this.amount > this.gold) this.getPay();
                else {
                    this.pays.forEach((i) => (i.consume = 0));
                }
            }
        },
        // 图片
        payIco(va) {
            return `https://img.shinemang.com/gachaStatic/static/img/pay/${va}.png`;
        },
        async getBalance() {
            await post("v1/goods/item/get", {
                item_id: this.id,
            }).then((res) => {
                this.img = res.item.coverImage;
                this.commodityName = res.item.name;
                this.saleType = res.item.saleType;
            });
        },
        onHint() {
            if (this.stock == 0) uni.$u.toast("库存不足~");
            else {
                uni.$u.toast("购买数量不能为0~");
                this.number = 1;
            }
        },
        async onClickDraw() {
            let that = this;
            let type = that.paytypeList.includes(1) || that.paytypeList.includes(3) ? 1 : 0;
            let data = {
                config_id: that.itemId,
                address_id: that.selectAddr.id, // 收货地址ID
                remark: that.text == "无备注" ? "" : that.text, // 备注
                nums: that.number,
            };
            if (
                this.paytypeList.length < 2 &&
                that.paytypeList.includes(4) &&
                that.amount > that.gold
            ) {
                let a =
                    that.gold == 0
                        ? "您的金币额度为0请充值或使用支付宝购买！"
                        : "您的金币不足，可进行组合支付！";
                uni.$u.toast(a);
                return;
            } else if (that.paytypeList.includes(1) || that.paytypeList.includes(3)) {
                let allNum = 0;
                this.pays.map((i) => {
                    if (i.type == 4) allNum = i.consume;
                });
                data = {
                    ...data,
                    create_payment_request: {
                        platform_id: 1,
                        amount: this.floatingPoint(that.amount, "-", allNum),
                        device_id: "",
                        source_type: 100004,
                        source_id: that.itemId,
                        balance_amount: allNum,
                    },
                };
            }

            let res = await callPayment("v1/activity/cost-award/buy", data, type);
            let orderInfo = res.orderInfo;
            if (!res.code) {
                if (type == 0) {
                    uni.$u.toast("商品购买成功！");
                    let url = that.saleType == 1 ? "/pages/my/releaseRecord" : "/pages/index/index";
                    if (that.saleType == 2) uni.setStorageSync("currentChange", 3);
                    setTimeout(() => {
                        uni.reLaunch({
                            url: url,
                        }); // 关闭当前页面跳转到发货记录页
                    }, 2000);
                } else {
                    uni.requestPayment({
                        provider: type == 1 ? "alipay" : "wxpay",
                        // #ifndef MP-WEIXIN
                        orderInfo,
                        // #endif
                        // #ifdef MP-WEIXIN
                        ...orderInfo,
                        // #endif
                        success: function (res) {
                            // console.log("success:" + JSON.stringify(res));
                            uni.$u.toast("商品购买成功！");
                            let url = that.saleType == 1 ? "/pages/my/releaseRecord" : "/pages/index/index";
                            if (that.saleType == 2) uni.setStorageSync("currentChange", 3);
                            setTimeout(() => {
                                uni.reLaunch({
                                    url: url,
                                }); // 关闭当前页面跳转到发货记录页
                            }, 2000);
                        },
                        fail: function (err) {
                            // console.log("fail:" + JSON.stringify(err));
                            if (err.errCode == -8) uni.$u.toast("客户端未安装");
                            if (err.errCode == -100)
                                uni.$u.toast("您中途取消了支付");
                            if (err.errMsg == "requestPayment:fail cancel")
                                uni.$u.toast("您中途取消了支付");
                        },
                    });
                }
                that.asyncUpBalance();
            } else {
                uni.$u.toast(res.message);
            }
        },
        fail() {
            this.$emit("fail");
        },
        payIco(va) {
            return `https://img.shinemang.com/gachaStatic/static/img/pay/${va}.png`;
        },
        // 获取地址
        loadAddrList() {
            let adId = this.address_id;
            post("v1/delivery_address/list").then((res) => {
                if (!res.code) {
                    if (adId !== "") {
                        let filteredNumbers = res.addresses.filter(
                            (number) => number.id == adId
                        );
                        this.selectAddr = filteredNumbers[0];
                    } else {
                        let Def = {};
                        for (const i of res.addresses) {
                            if (i.isDefault) Def = i;
                            if (i.id == this.selectId) this.selectAddr = i;
                        }
                        if (!this.selectId) this.selectAddr = Def;
                    }
                }
            });
        },
        // 收获地址
        toList() {
            this.$sl(
                "selectGoodsShip",
                {
                    GoodsIds: this.selectRewardIds,
                    stocks: this.selectRewardsInfo,
                    remark: this.remark,
                },
                60 * 10
            );
            this.goto("/pages/shipments/addressList", {
                type: 2,
                id: this.selectAddr.id,
                address: "shopping/purchase",
            });
        },
        // 留言
        handleChildEvent(a, b) {
            this.downShow = a;
            this.text = b;
        },
        getPay() {
            this.pays.forEach((user) => {
                if (user.type == 4 && this.paytypeList.includes(4))
                    user.consume = this.gold;
                if (
                    user.type == 1 &&
                    this.paytypeList.includes(1) &&
                    this.paytypeList.length > 1
                )
                    user.consume = this.floatingPoint(
                        this.amount,
                        "-",
                        this.gold
                    );
            });
        },
        onGoldPay() {
            if (this.paytypeList.includes(4)) {
                let index1 = 0; //金币
                let index2 = 0; //支付宝
                this.pays.map((i, j) => {
                    if (i.type == 4) index1 = j;
                    if (i.type == 1) index2 = j;
                });
                let num = this.floatingPoint(
                    this.amount,
                    "-",
                    this.pays[index1].number
                );
                if (num > 0) {
                    if (this.paytypeList.includes(4)) {
                        this.pays[index1].consume = this.pays[index1].number;
                    }
                    if (
                        this.paytypeList.includes(1) &&
                        this.paytypeList.length > 1
                    ) {
                        this.pays[index2].consume = num;
                    } else {
                        this.pays[index2].consume = 0;
                    }
                } else {
                    this.pays[index1].consume = 0;
                    this.pays[index2].consume = 0;
                    if (this.paytypeList.includes(4)) {
                        this.paytypeList = [4];
                    }
                }
            }
        },
    },
};
</script>
<style lang='scss' scoped>
::v-deep .u-number-box__input {
    background: #fff !important;
}

.purchase {
    width: 100vw;
    height: 100vh;
    position: relative;
    background: linear-gradient(104deg, #e1d6f8 0%, #f8e7ed 100%);
    overflow-y: auto;

    &::before {
        content: "";
        width: 100vw;
        height: 100vh;
        position: absolute;
        top: 212rpx;
        // left: 0;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #f0f0f0 50%);
    }
}

.navbar_x {
    padding: 0 36rpx;
    margin-bottom: 64rpx;
    margin-top: 64rpx;

    .header1 {
        font-weight: 800;
        font-size: 36rpx;
        color: #383228;
        line-height: 36rpx;
        text-align: center;
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

.selectGoods_con {
    // width: 686rpx;
    // height: calc(100% - 190rpx);
    position: absolute;
    // bottom: 0;
    padding: 0 32rpx;
    // margin-bottom: 196rpx;
    border-radius: 16rpx 16rpx 16rpx 16rpx;
}

.tishi {
    height: 400rpx;
    text-transform: none;
    font-weight: 500;
    font-size: 24rpx;
    color: #7f7a88;
    margin-bottom: 100rpx;

    div {
        height: 36rpx;
        line-height: 36rpx;
    }
}

.formItem {
    margin-bottom: 16rpx;
    width: 686rpx;
    background: #ffffff;
    border-radius: 16rpx;
    padding: 24rpx 24rpx 0;

    .pays {
        font-weight: 500;
        font-size: 28rpx;
        color: #383228;

        .way {
            font-weight: bold;
            font-size: 32rpx;
        }

        .pay_item {
            padding: 20rpx 0;
        }

        .pay_name {
            font-size: 28rpx;
            font-weight: 500;
        }

        .pay_ico {
            width: 56rpx;
            height: 56rpx;
            margin-right: 20rpx;
        }

        .ico2 {
            width: 72rpx;
            height: 36rpx;
            margin-left: 8rpx;
        }
    }

    .totalB {
        width: 100%;
        height: 84rpx;
        line-height: 84rpx;
        display: flex;
        font-weight: 500;
        font-size: 24rpx;
        color: #383228;
        justify-content: space-between;

        .totalc {
            display: flex;

            .price {
                display: flex;
                font-weight: 800;

                .a {
                    height: 36rpx;

                    font-size: 24rpx;
                }

                .number {
                    font-family: Binance PLEX, Binance PLEX;
                    font-size: 36rpx;
                }
            }
        }
    }

    .txt {
        font-size: 32rpx;
        color: #383228;
        font-weight: bold;
        margin-bottom: 20rpx;
        height: 92rpx;
        line-height: 92rpx;
        border-bottom: 2rpx solid #e2e1e3;

        .icof {
            color: #f20;
        }
    }

    .commodity {
        border-bottom: 2rpx solid #e2e1e3;

        .particulars {
            height: 190rpx;
            display: flex;

            .imgc {
                width: 160rpx;
                height: 160rpx;
                border-radius: 8rpx 8rpx 8rpx 8rpx;
                margin-right: 16rpx;
            }

            .rightq {
                color: #383228;

                .textc {
                    width: 462rpx;
                    height: 120rpx;
                    font-weight: 500;
                    font-size: 28rpx;
                }

                .priceBox {
                    display: flex;
                    justify-content: space-between;

                    .increase {
                        width: 168rpx;
                        height: 48rpx;
                        display: flex;
                        justify-content: space-between;

                        .minus {
                            width: 48rpx;
                            height: 48rpx;
                        }

                        .minusB {
                            background: url("https://img.shinemang.com/gachaStatic/static/img/home/icon--.png");
                            background-size: 100% 100%;
                        }

                        .minusA {
                            background: url("https://img.shinemang.com/gachaStatic/static/img/home/icon-.png");
                            background-size: 100% 100%;
                        }

                        .plus {
                            width: 48rpx;
                            height: 48rpx;
                        }

                        .add {
                            background: url("https://img.shinemang.com/gachaStatic/static/img/home/icon++.png");
                            background-size: 100% 100%;
                        }

                        .addA {
                            background: url("https://img.shinemang.com/gachaStatic/static/img/home/icon+.png");
                            background-size: 100% 100%;
                        }
                    }
                }
            }
        }

        .remarkBox {
            display: flex;
            justify-content: space-between;
            margin-bottom: 24rpx;
            height: 40rpx;
            font-weight: 500;
            font-size: 24rpx;
            color: #383228;

            .orderForm {
                width: 120rpx;
                margin-right: 40rpx;
            }

            .remarka {
                display: flex;
                width: 490rpx;
                font-weight: 500;
                font-size: 24rpx;
                color: #b7b6b9;
                height: 40rpx;
                line-height: 40rpx;

                .addr_r_ico {
                    font-size: 35rpx;
                    margin-left: 4rpx;
                }

                .textc {
                    width: 440rpx;
                    text-align: end;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
        }
    }
}

.reduce_pay {
    margin-left: auto;
    align-items: center;
    font-weight: 500;
    font-size: 24rpx;

    .select {
        width: 36rpx;
        height: 36rpx;
        background: #eee;
        border-radius: 50%;

        &.active {
            background-image: url("https://img.shinemang.com/gachaStatic/static/img/pay/ico3.png") !important;
            background-size: 100% 100% !important;
        }
    }

    .consume {
        color: #383228;
        margin-right: 16rpx;
    }
}

.price {
    display: flex;
    font-weight: 800;

    .a {
        height: 36rpx;

        font-size: 24rpx;
    }

    .number {
        font-family: Binance PLEX, Binance PLEX;
        font-size: 36rpx;
    }
}

.select {
    width: 36rpx;
    height: 36rpx;
    background: #eee;
    border-radius: 50%;

    &.active {
        background-image: url("https://img.shinemang.com/gachaStatic/static/img/pay/ico3.png") !important;
        background-size: 100% 100% !important;
    }
}

.address_box {
    // height: 104rpx;
    padding: 24rpx 0;

    .addr_r_ico {
        font-size: 40rpx;
        color: #aca9bc;
    }
}

.address_info {
    .on_addr {
        .addr_ico {
            width: 40rpx;
            height: 40rpx;
            margin-right: 20rpx;
        }

        .addr_txt {
            font-size: 32rpx;
            font-weight: 500;
        }
    }

    .tag {
        width: 72rpx;
        height: 36rpx;
        line-height: 36rpx;
        text-align: center;
        font-size: 24rpx;
        background-color: rgba($color: #000, $alpha: 0.16);
        border-radius: 16rpx;
        margin-right: 15rpx;

        &.corr {
            color: #ff005c;
            background: rgba(255, 0, 92, 0.1);
        }

        &.corb {
            color: #0052f2;
            background: rgba(0, 82, 242, 0.1);
        }
    }

    .address {
        font-size: 28rpx;
    }

    .userAddr {
        font-size: 32rpx;
        font-weight: 800;
        margin: 16rpx 0;
    }

    .userName {
        font-size: 24rpx;

        span {
            margin-right: 20rpx;
        }
    }
}

.foot_btn {
    width: 750rpx;
    height: 196rpx;
    background: #ffffff;
    position: fixed;
    justify-content: space-between;
    left: 0;
    bottom: 0;
    padding: 20rpx 32rpx 0;

    .totala {
        display: flex;

        .b {
            width: 72rpx;
            margin-right: 8rpx;
            height: 88rpx;
            line-height: 88rpx;
            font-weight: 500;
            font-size: 24rpx;
            color: #383228;
        }

        .price {
            display: flex;
            color: #ff6a16;
            font-weight: 800;

            .a {
                height: 88rpx;
                line-height: 88rpx;

                font-size: 24rpx;
            }

            .number {
                height: 88rpx;
                line-height: 88rpx;
                font-family: Binance PLEX, Binance PLEX;

                color: #ff6a16;
                font-size: 56rpx;
            }
        }
    }
}
</style>