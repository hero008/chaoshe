<template>
    <view class="releaseDetails">
        <div class="navbar_x flex_r flex_jb flex_ac">
            <view class="top_Back" @click.stop="gateBack">
                <text class="icof Back_ico">&#xe72c;</text>
                <text class="txt">返回</text>
            </view>
        </div>
        <div class="releaseCon">
            <div class="addr_row">
                <div class="tit_row flex_r flex_jb flex_ac">
                    <span>收货地址</span>
                    <div class="tag corg" v-if="order_de.state == 4">
                        发货中
                    </div>
                    <div class="tag" v-if="order_de.state == 5">已签收</div>
                    <div class="tag corg" v-if="order_de.state == 3">
                        备货中
                    </div>
                    <!-- <div class="tag">已签收</div> -->
                </div>
                <div class="address_info">
                    <div class="flex_r flex_ac">
                        <div class="tags flex_r flex_ac">
                            <!-- <div class="tag corr" v-if="selectAddr.isDefault">默认</div>
                            <div class="tag corb" v-if="selectAddr.addressTag">家</div> -->
                            <!-- <div class="tag corr" v-if="order_de.isDefault">默认</div> -->
                            <!-- <div class="tag corb">{{ addressInfos.addressTag }}</div> -->
                        </div>
                        <div class="address">{{ order_de.receiveAddress }}</div>
                    </div>
                    <div class="userAddr">
                        {{ order_de.receiveAddressDetail }}
                    </div>
                    <div class="userName">
                        <span>{{ order_de.receiveName }}</span
                        ><span>{{ order_de.receivePhone }}</span>
                    </div>
                </div>
            </div>
            <div v-if="logisticsInfos.length">
                <div
                    class="addr_row"
                    v-for="(item, index) in logisticsInfos"
                    :key="index"
                >
                    <div class="tit_row line">物流信息</div>
                    <div class="info_row line">
                        <div class="p flex_r flex_jb flex_ac">
                            <span>快递单号</span>
                            <div class="flex_r flex_ac">
                                <span>{{ item.logisticsOrderId }}</span>
                                <img
                                    @click.stop="copy(item.logisticsOrderId)"
                                    src="https://img.chaoshewang.com/static/img/market/copy.png"
                                    class="copy"
                                />
                            </div>
                        </div>
                        <div class="p flex_r flex_jb flex_ac">
                            <span>快递公司</span>
                            <span>{{ item.logisticsCompany }}</span>
                        </div>
                        <div class="p flex_r flex_jb flex_ac">
                            <span>快递运费</span>
                            <span>{{
                                order_de.freightAmount > 0 && index == 0
                                    ? order_de.freightAmount + "元"
                                    : "免运费"
                            }}</span>
                        </div>
                    </div>
                    <div class="info_row">
                        <div class="goods flex_r flex_jb flex_ac">
                            <div class="goods_li flex_r">
                                <view
                                    class="imgBox"
                                    v-for="(v, k) in item.logisticsItems"
                                    :key="k"
                                >
                                    <img
                                        class="goods_img"
                                        :src="v.coverImage"
                                        @click="ondetail(v.itemId)"
                                    />
                                    <view class="number">x{{ v.nums }}</view>
                                </view>
                            </div>
                            <div class="goods_num flex_r flex_jc flex_ac">
                                x{{ item.all }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="addr_row" v-else>
                <div class="tit_row line">物流信息</div>
                <div class="info_row line">
                    <div class="p flex_r flex_jb flex_ac">
                        <span>快递单号</span>
                        <div class="flex_r flex_ac">
                            <span>暂无</span>
                            <!-- <img @click.stop="copy('123')" src="https://img.chaoshewang.com/static/img/market/copy.png"
								class="copy" /> -->
                        </div>
                    </div>
                    <div class="p flex_r flex_jb flex_ac">
                        <span>快递公司</span>
                        <span>暂无</span>
                    </div>
                    <div class="p flex_r flex_jb flex_ac">
                        <span>快递运费</span>
                        <span>{{
                            order_de.freightAmount > 0
                                ? order_de.freightAmount + "元"
                                : "免运费"
                        }}</span>
                    </div>
                </div>
                <div class="info_row">
                    <div class="goods flex_r flex_jb flex_ac">
                        <div class="goods_li">
                            <img
                                v-for="(v, k) in rewardInfos"
                                :key="k"
                                class="goods_img"
                                :src="v.cover"
                                @click="ondetail(v.itemId)"
                            />
                        </div>
                        <div class="goods_num flex_r flex_jc flex_ac">
                            x{{ rewardInfos.length }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="addr_row" style="padding-bottom: 20rpx">
                <div class="tit_row">备注</div>
                <div class="remark">{{ order_de.remark }}</div>
            </div>
        </div>
        <gachaDetails ref="gachaDetails" />
    </view>
</template>
<script>
import { post } from "@/utils/api.js";
export default {
    data() {
        return {
            order_de: {},
            logisticsInfos: [], // 快递信息
            addressInfos: {}, //地址信息
            rewardInfos: [], // 赏品信息
        };
    },
    onLoad(da) {
        this.getreleaseDetail(da.id);
    },
    methods: {
        getreleaseDetail(id) {
            post("v1/order/detail", {
                order_id: id,
            }).then((res) => {
                this.order_de = res.order;
                this.addressInfos = res.order.address;
                this.rewardInfos = res.order.items;
                if (res.order.logisticsInfos.length) {
                    res.order.logisticsInfos.map((item) => {
                        item.all = item.logisticsItems.reduce(
                            (sum, item) => sum + item.nums,
                            0
                        );
                    });
                }
                this.logisticsInfos = res.order.logisticsInfos;
            });
        },
        ondetail(id) {
            this.gachaDetailsMethod(this,id);
        },
    },
};
</script>
<style lang='scss' scoped>
.releaseDetails {
    width: 100vw;
    height: 100vh;
    position: relative;
    padding: 100rpx 0 0;
    // background: linear-gradient(104deg, #e1d6f8 0%, #f8e7ed 100%);
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

.releaseCon {
    position: relative;
    padding: 36rpx;
    height: calc(100vh - 180rpx);
    overflow-y: auto;
    z-index: 2;

    .addr_row {
        padding: 0 30rpx;
        background-color: #fff;
        border-radius: 16rpx;
        margin-bottom: 16rpx;
    }

    .line {
        border-bottom: 2rpx solid #e2e1e3;
    }

    .tit_row {
        font-size: 28rpx;
        font-weight: bold;
        padding: 24rpx 0;

        .tag {
            font-size: 24rpx;
            padding: 0 10rpx;
            border-radius: 4rpx;
            color: #fff;
            background: #a9a9a9;
            margin-right: 10rpx;

            &.corg {
                background: #78bf72;
            }
        }
    }

    .address_info {
        padding: 30rpx 0;

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

    .info_row {
        font-size: 24rpx;
        font-weight: 500;
        padding-bottom: 20rpx;

        .copy {
            width: 100rpx;
            height: 36rpx;
            margin-left: 25rpx;
        }

        .p {
            margin-top: 22rpx;
        }
    }

    .goods {
        margin: 20rpx 0;

        .goods_li {
            height: 110rpx;
            width: calc(100% - 60rpx);
            overflow-x: auto;
            overflow-y: hidden;
            white-space: nowrap;
            .imgBox {
                position: relative;
                width: 110rpx;
                margin-right: 12rpx;
                .number {
                    position: absolute;
                    right: 0rpx;
                    bottom: 6rpx;
                    font-size: 24rpx;
                    color: #ffffff;
                    height: 32rpx;
                    text-align: center;
                    line-height: 32rpx;
                    padding: 0 10rpx;
                    background: rgba(0, 0, 0, 0.5);
                    border-radius: 8rpx;
                }
            }
            .goods_img {
                height: 110rpx;
                width: 110rpx;
                border-radius: 16rpx;
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

    .remark {
        margin-top: 16rpx;
        background: #f9f9f9;
        border-radius: 16rpx;
        padding: 20rpx;
        min-height: 150rpx;
    }
}
</style>