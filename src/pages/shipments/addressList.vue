<template>
    <view class="addressList" :style="{ paddingTop: MBInfo().top + 'px' }">
        <div class="navbar_x flex_r flex_jb flex_ac">
            <view class="top_Back" @click.stop="gateBack">
                <text class="icof Back_ico">&#xe72c;</text>
                <text class="txt">返回</text>
            </view>
        </div>
        <div class="selectGoods_con">
            <div class="top_tit">地址列表</div>
            <div class="addr_list">
                <div
                    class="addr_item"
                    v-for="(i, s) in addrList"
                    :key="s"
                    @click="onselect(i.id)"
                >
                    <img
                        v-if="selectId == i.id"
                        src="https://img.chaoshewang.com/static/img/shipments/pitch_on.png"
                        class="pitch_on"
                    />
                    <div class="address_info flex_r flex_jb flex_ac">
                        <div class="addr_da">
                            <div class="p1">
                                <span>{{ i.name }}</span
                                ><span>{{ i.phoneNum }}</span>
                            </div>
                            <div class="p2">
                                {{ i.province }}{{ i.city }}{{ i.area
                                }}{{ i.subArea }}{{ i.address }}
                            </div>
                        </div>
                    </div>
                    <div class="address_btn flex_r flex_jb flex_ac">
                        <div class="tags flex_r flex_ac">
                            <div class="tag corr" v-if="i.isDefault">默认</div>
                            <div class="tag corb" v-if="i.addressTag">
                                {{ i.addressTag }}
                            </div>
                        </div>
                        <div class="btns flex_r flex_ac">
                            <div
                                class="btn flex_r flex_ac"
                                @click.stop="editAddr(i.id)"
                            >
                                <img
                                    src="https://img.chaoshewang.com/static/img/shipments/edit.png"
                                    class="del_ico"
                                />
                                <span>编辑</span>
                            </div>
                            <div
                                class="btn flex_r flex_ac"
                                @click.stop="ondelAddr(i.id)"
                            >
                                <img
                                    src="https://img.chaoshewang.com/static/img/shipments/delete.png"
                                    class="del_ico"
                                />
                                <span>删除</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="addr_item flex_c flex_jc flex_ac" @click="addr">
                    <img
                        src="https://img.chaoshewang.com/static/img/transaction/ico1.png"
                        class="add_ico"
                    />
                    <div class="add_txt">请添加收货地址</div>
                </div>
            </div>
            <div class="foot_btn" v-if="type == 2" @click="affirm">确认</div>
        </div>
        <u-modal
            :show="DelShow"
            content="确认删除吗？"
            width="500rpx"
            @confirm="delAddr"
            @cancel="DelShow = false"
            showCancelButton
        ></u-modal>
    </view>
</template>
<script>
import { post } from "@/utils/api.js";
export default {
    data() {
        return {
            type: 1, // 1地址管理 2选择地址
            addrList: [],
            DelShow: false,
            delId: undefined,
            selectId: "",
            address: "",
        };
    },
    onLoad(da) {
        if (da.type) this.type = da.type;
        if (da.id) this.selectId = da.id;
        if (da.address) this.address = da.address;
    },
    onShow() {
        this.loadList();
    },
    methods: {
        loadList() {
            post("v1/delivery_address/list").then((res) => {
                if (!res.code) {
                    this.addrList = res.addresses;
                    if (this.type == 2 && !this.selectId) {
                        for (const i of res.addresses) {
                            if (i.isDefault) this.selectId = i.id;
                        }
                    }
                }
            });
        },
        ondelAddr(id) {
            this.delId = id;
            this.DelShow = true;
        },
        delAddr() {
            post("v1/delivery_address/delete", {
                delivery_id: this.delId,
            }).then((res) => {
                if (!res.code) {
                    this.loadList();
                    this.DelShow = false;
                    uni.$u.toast("删除成功");
                }
            });
        },
        editAddr(id) {
            this.goto("/pages/shipments/addressAdd", { selectAddrId: id });
        },
        addr() {
            this.goto("/pages/shipments/addressAdd");
        },
        onselect(id) {
            if (this.type == 2) this.selectId = id;
        },
        affirm() {
            let that = this;
            if (that.address == "shopping/purchase"||that.address == "shopping%2Fpurchase") {
                uni.setStorageSync('returnData', JSON.stringify(that.selectId));
                uni.navigateBack({
                    delta: 1,
                });
            } else {
                uni.$u.route({
                    type: "redirect",
                    url: "pages/" + that.address,
                    params: {
                        selectAddrId: that.selectId,
                        from: "list",
                    },
                });
            }
        },
    },
};
</script>
<style lang='scss' scoped>
.addressList {
    height: 100vh;
    padding-top: 80rpx;
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
    padding: 0 36rpx;
    position: relative;
    z-index: 2;

    .btn_r {
        width: 162rpx;
        height: 46rpx;
    }
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

.selectGoods_con {
    width: 100%;
    height: calc(100% - 190rpx);
    border-radius: 0 50rpx 0 0;
    // background: #f4f4f4;
    padding: 30rpx 36rpx;
    overflow-y: auto;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 2;
}

.top_tit {
    font-size: 28rpx;
    font-weight: 500;
}

.addr_list {
    padding: 30rpx 0 80rpx;

    .addr_item {
        width: 686rpx;
        min-height: 230rpx;
        background: #ffffff;
        border-radius: 16rpx;
        margin-bottom: 20rpx;
        padding: 28rpx 30rpx;
        position: relative;

        .add_ico {
            width: 50rpx;
            height: 50rpx;
        }

        .add_txt {
            font-size: 24rpx;
            font-weight: 500;
            color: #818181;
            margin-top: 20rpx;
        }

        .pitch_on {
            width: 92rpx;
            height: 90rpx;
            position: absolute;
            right: 0;
            top: 0;
        }
    }

    .address_info {
        padding-bottom: 20rpx;
        border-bottom: 2rpx solid #e2e1e3;

        .addr_da {
            // width: calc(100% - 130rpx);

            .p1 {
                font-weight: 800;
                font-size: 28rpx;
                margin-bottom: 12rpx;

                span {
                    margin-right: 20rpx;
                }
            }

            .p2 {
                font-size: 24rpx;
                line-height: 30rpx;
                color: #555;
            }
        }
    }

    .address_btn {
        padding-top: 16rpx;

        .tag {
            width: 72rpx;
            height: 36rpx;
            line-height: 36rpx;
            text-align: center;
            font-size: 24rpx;
            background-color: rgba($color: #000, $alpha: 0.16);
            border-radius: 16rpx;
            margin-right: 8rpx;

            &.corr {
                color: #ff005c;
                background: rgba(255, 0, 92, 0.1);
            }

            &.corb {
                color: #0052f2;
                background: rgba(0, 82, 242, 0.1);
            }
        }

        .btn {
            color: #818181;
            font-size: 24rpx;
            font-weight: 500;
            margin-left: 36rpx;

            .del_ico {
                width: 36rpx;
                height: 36rpx;
                margin-right: 6rpx;
                vertical-align: middle;
            }
        }
    }
}

.foot_btn {
    width: 686rpx;
    height: 100rpx;
    line-height: 100rpx;
    text-align: center;
    background: #715cdd;
    border-radius: 16rpx;
    font-size: 32rpx;
    font-weight: 500;
    color: #fff;
    position: absolute;
    left: calc((100% - 686rpx) / 2);
    bottom: 80rpx;
}
</style>