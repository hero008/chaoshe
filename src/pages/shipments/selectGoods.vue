<template>
    <view
        class="selectGoods"
        :class="{ mpWeixin: ISmp() }"
        :style="{ paddingTop: MBInfo().top + 'px' }"
    >
        <div
            class="navbar_x flex_r flex_jb flex_ac"
            :style="{ height: MBInfo().height + 'px' }"
        >
            <view class="top_Back" @click.stop="gateBack">
                <text class="icof Back_ico">&#xe72c;</text>
                <text class="txt">返回</text>
            </view>
            <img
                src="https://img.shinemang.com/gachaStatic/static/img/shipments/btn.png"
                class="btn_r"
                @click="goto('/pages/common/rulepop', { val: 'ShippingRules' })"
            />
        </div>
        <div class="selectGoods_con" :style="{ height: conHeight }">
            <div class="con_box">
                <div class="form_box">
                    <div class="form_item">
                        <div class="txt" style="margin-bottom: 0">
                            <span class="icof">&#xe641;</span>收货地址
                        </div>
                        <div
                            class="address_box flex_r flex_jb flex_ac"
                            @click="toList"
                        >
                            <div class="address_info" v-if="selectAddr.name">
                                <div class="flex_r flex_ac">
                                    <div class="tags flex_r flex_ac">
                                        <div
                                            class="tag corr"
                                            v-if="selectAddr.isDefault"
                                        >
                                            默认
                                        </div>
                                        <div
                                            class="tag corb"
                                            v-if="selectAddr.addressTag"
                                        >
                                            {{ selectAddr.addressTag }}
                                        </div>
                                    </div>
                                    <div class="address">
                                        {{ selectAddr.province
                                        }}{{ selectAddr.city
                                        }}{{ selectAddr.area
                                        }}{{ selectAddr.subArea }}
                                    </div>
                                </div>
                                <div class="userAddr">
                                    {{ selectAddr.address }}
                                </div>
                                <div class="userName">
                                    <span>{{ selectAddr.name }}</span
                                    ><span>{{ selectAddr.phoneNum }}</span>
                                </div>
                            </div>
                            <div class="address_info" v-else>
                                <div class="on_addr flex_r flex_ac">
                                    <img
                                        src="https://img.shinemang.com/gachaStatic/static/img/shipments/addr_ico.png"
                                        class="addr_ico"
                                    />
                                    <span class="addr_txt">选择收货地址</span>
                                </div>
                            </div>
                            <div class="addr_r_ico icof">&#xe72b;</div>
                        </div>
                    </div>
                    <div class="form_item">
                        <div class="txt">
                            <span class="icof">&#xe641;</span>选择赏品
                        </div>
                        <div class="lists">
                            <view
                                class="item"
                                v-for="(item, index) in selectRewardsInfo"
                                :key="index"
                            >
                                <view
                                    class="item_img"
                                    :style="{
                                        backgroundImage: `url(${item.item.coverThumb})`,
                                    }"
                                >
                                 <view class="box_ico frame"></view>
                                    <!-- <img
                                        src="https://img.shinemang.com/gachaStatic/static/img/shanggui/group_1.png"
                                        class="box_ico"
                                    /> -->
                                    <view class="item_txt1">{{
                                        item.item.saleType == 1
                                            ? "现货"
                                            : "预售"
                                    }}</view>
                                </view>
                                <view class="item_name ellipsis">{{
                                    item.item.name
                                }}</view>
                                <!-- <view class="item_no ellipsis">{{item.itemId}}</view> -->
                                <img
                                    @click="removeItem(item)"
                                    class="remove_btn"
                                    src="https://img.shinemang.com/gachaStatic/static/img/transaction/close2.png"
                                />
                            </view>
                            <div
                                class="SelectProduct flex_r flex_jc flex_ac"
                                @click="addStock"
                            >
                                <img
                                    src="https://img.shinemang.com/gachaStatic/static/img/transaction/ico1.png"
                                    class="ico"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="form_item">
                        <div class="txt">发货备注</div>
                        <u--textarea
                            v-model="remark"
                            maxlength="50"
                            placeholder="请输入发货备注(最大长度50字)"
                        ></u--textarea>
                    </div>
                    <div class="form_item">
                        <div class="txt">发货信息</div>
                        <div class="freight">
                            <div class="p flex_r flex_ac flex_jb">
                                <span>· 快递公司</span>
                                <span>快递</span>
                            </div>

                            <div class="p flex_r flex_ac flex_jb">
                                <div>
                                    <span>· 运费</span>
                                </div>
                                <span>{{
                                    selectRewardsInfo.length >= 5
                                        ? "包邮"
                                        : "￥10"
                                }}</span>
                            </div>
                            <div class="p flex_r flex_ac flex_jb">
                                <div
                                    class="msg"
                                    @click="
                                        goto('/pages/common/rulepop', {
                                            val: 'ShippingRules',
                                        })
                                    "
                                >
                                    (下单后会在3-7天内完成发货，邮费10元，一次发货五件商品免邮费;更多详情请点击<span
                                        class="a_msg"
                                        >“发货规则”</span
                                    >)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="foot_btn flex_r flex_jc">
                    <x-btn
                        txt="提交订单"
                        v-if="!isTransaction || !selectAddr.id"
                    />
                    <x-btn txt="提交订单" v-else @click="onpay" cor="3" />
                </div>
            </div>
        </div>
        <!-- 支付  付邮费12-->
        <x-pay @success="confirmOrder" ref="xPay" mtype="12" :probabilityShow=[]  />
        <select-goods ref="addStock" @confirmSelect="SelectIds" typeClass="1" />
    </view>
</template>
<script>
import { post } from "@/utils/api.js";
import xPay from "@/components/x-pay/index";
import xBtn from "@/components/modules/x-btn";
import selectGoods from "@/components/selectGoods/index";
import { mapMutations, mapState } from "vuex";
import { callPayment } from "@/utils/pay.js";
export default {
    data() {
        return {
            selectRewardIds: [],
            selectRewardsInfo: [],
            remark: undefined, //备注
            selectAddr: {}, //选择的地址
            selectId: undefined,
            typeId: 0,
        };
    },
    components: {
        xBtn,
        xPay,
        selectGoods,
    },
    computed: {
        isTransaction() {
            return this.selectRewardsInfo.length > 0;
        },
        conHeight() {
            let h = this.SystemInfo.screenHeight;
            let va = this.MBInfo();
            let th = va.height + va.top + 10;
            let str = h - th + "px";
            return str;
        },
        ...mapState(["payMessage"]),
    },
    onLoad(da) {
        if (da.selectAddrId) this.selectId = da.selectAddrId;
        if (da.from) {
            let sl = this.$gl("selectGoodsShip");
            if (sl && sl.GoodsIds) {
                this.selectRewardIds = sl.GoodsIds;
                this.selectRewardsInfo = sl.stocks || [];
                this.remark = sl.remark;
            }
        }
    },
    onShow() {
        this.loadAddrList();
    },
    methods: {
        ...mapMutations(["UppayMessage"]),
        loadAddrList() {
            post("v1/delivery_address/list").then((res) => {
                if (!res.code) {
                    let Def = {};
                    for (const i of res.addresses) {
                        if (i.isDefault) Def = i;
                        if (i.id == this.selectId) this.selectAddr = i;
                    }
                    if (!this.selectId) this.selectAddr = Def;
                }
            });
        },
        addStock() {
            this.$refs.addStock.open(this.selectRewardIds);
        },
        SelectIds(ids, infos) {
            this.selectRewardIds = ids;
            this.selectRewardsInfo = infos;
        },
        removeItem(item) {
            let id = item.id;
            this.selectRewardIds = this.remove(this.selectRewardIds, id);
            this.selectRewardsInfo = this.remove(this.selectRewardsInfo, item);
        },
        async onpay() {
            this.UppayMessage({
                url: "v1/order/create",
                message: {
                    stock_ids: this.selectRewardIds,
                    address_id: this.selectAddr.id,
                    remark: this.remark,
                    type: 1,
                },
            });
            if (this.selectRewardIds.length > 1000) {
                uni.$u.toast("选择赏品超过100！请重新选择");
                return;
            }
            if (this.selectRewardIds.length < 5) {
                // #ifdef MP-WEIXIN
                uni.$u.toast(
                    "微信不支持支付运费！如需少于5件商品发货请联系客服，或者下载APP进行发货!"
                );
                return;
                // #endif
                this.$refs.xPay.open(
                    10,
                    1,
                    getApp().globalData.RechargeType.Freight,
                    0,
                    "0"
                );
            } else {
                let res = await callPayment(
                    this.payMessage.url,
                    this.payMessage.message,
                    0
                );
                if (!res.code) {
                    this.confirmOrder(res);
                }
            }
        },
        confirmOrder(res) {
            if (!res.code) {
                uni.$u.toast("赏品发货成功！");
                setTimeout(() => {
                    uni.redirectTo({
                        url: "/pages/my/releaseRecord",
                    }); // 关闭当前页面跳转到发货记录页
                }, 2000);
            }
        },

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
                address: "shipments/selectGoods",
            });
        },
    },
};
</script>
<style lang='scss' scoped>
.selectGoods {
    height: 100vh;
    position: relative;
     background-color: #F5F6F8;
    padding-top: 106rpx;
    // background: linear-gradient(104deg, #e1d6f8 0%, #f8e7ed 100%);
    overflow-y: auto;
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
    padding: 0 36rpx;
    position: relative;
    z-index: 9;

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

.selectGoods_con {
    width: 100%;
    height: calc(100% - 190rpx);
    border-radius: 0 50rpx 0 0;
    // background: #f4f4f4;
    padding: 30rpx 0;
    overflow-y: auto;
    position: absolute;
    left: 0;
    z-index: 9;
    bottom: 0;

    .con_box {
        height: 100%;
        overflow-y: auto;
        padding: 0 36rpx 80rpx;
    }
}
.frame {
    background: url("@/static/homePage/frame.png");
    background-size: 100% 100%;
}

.lists {
    @include grid(152rpx);

    .item {
        width: 152rpx;
        margin-bottom: 18rpx;
        position: relative;

        .item_img {
            width: 152rpx;
            height: 152rpx;
            /* background-color: rgba($color: #9064FF, $alpha: 1); */
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

.form_box {
    .SelectProduct {
        width: 152rpx;
        height: 152rpx;
        border-radius: 12rpx;
        background: #e2e1e3;
        border: 2rpx dashed #aca9bc;

        .ico {
            width: 48rpx;
            height: 48rpx;
        }
    }

    .remove_btn {
        position: absolute;
        right: -20rpx;
        top: -20rpx;
        width: 50rpx;
        height: 50rpx;
    }

    .form_item {
        margin-bottom: 60rpx;

        .txt {
            font-size: 32rpx;
            color: #383228;
            font-weight: bold;
            margin-bottom: 20rpx;

            .icof {
                color: #f20;
            }
        }

        .txt2 {
            margin-right: 20rpx;
            font-size: 24rpx;
            color: #383228;
        }

        .item_img {
            width: 152rpx;
            height: 152rpx;
            /* background-color: rgba($color: #9064FF, $alpha: 1); */
            border-radius: 16rpx;
            background-size: 100% 100%;
            position: relative;
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
    }

    .freight {
        font-weight: 500;
        font-size: 28rpx;

        .msg {
            font-size: 30rpx;
            color: #f23a13;
            margin-left: 10rpx;

            .a_msg {
                font-size: 30rpx;
                color: blue;
            }
        }

        .p {
            padding: 18rpx 0;
            border-bottom: 2rpx dashed #aca9bc;

            &:last-child {
                border: none;
            }

            &:first-child {
                padding-top: 10rpx;
            }
        }
    }
}

.address_box {
    .addr_r_ico {
        font-size: 40rpx;
        color: #aca9bc;
    }
}

.address_info {
    padding: 30rpx 0;
    border-bottom: 2rpx solid #e2e1e3;

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
    width: 100%;
    position: fixed;
    bottom: 60rpx;
    left: 0;
}

.mpWeixin {
    .navbar_x .btn_r {
        position: relative;
        top: 92rpx;
        right: 0;
        z-index: 12000;
    }
}
</style>