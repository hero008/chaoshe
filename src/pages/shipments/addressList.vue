<template>
    <view class="addressList" :style="{ paddingTop: MBInfo().top + 'px' }">
        <div class="navbar_x flex_r flex_jb flex_ac">
            <view class="top_Back" @click.stop="gateBack">
                <text class="icof Back_ico">&#xe72c;</text>
                <text class="txt">收货地址</text>
            </view>
        </div>
        <div class="selectGoods_con">
            <!-- <div class="top_tit">地址列表</div> -->
            <div class="addr_list">
                <div
                    class="addr_item"
                    v-for="(i, s) in addrList"
                    :key="s"
                    @click="onselect(i.id)"
                >
                    <img
                        v-if="selectId == i.id"
                        src="https://img.shinemang.com/gachaStatic/static/img/shipments/pitch_on.png"
                        class="pitch_on"
                    />
                    <div class="address_info flex_r flex_jb flex_ac">
                        <div style="flex:1;display: flex;" class="flex_r flex_jb flex_ac">
                            <div class="addr_da">
                            <div class="p1 flex_r  flex_ac">
                                <span>{{ i.name }}</span
                                ><span style="font-size: 28rpx;font-weight: normal;">{{ i.phoneNum }}</span>
                                  <div class="tags flex_r flex_ac">
                            <div class="tag corr" v-if="i.isDefault">默认</div>
                            <div class="tag corb" v-if="i.addressTag">
                                {{ i.addressTag }}
                            </div>
                        </div>
                            </div>
                            <div class="p2">
                                {{ i.province }}{{ i.city }}{{ i.area
                                }}{{ i.subArea }}{{ i.address }}
                            </div>
                            
                        </div>
                    </div>
                        <div @click.stop="editAddr(i.id)" style="width: 48rpx;height: 48rpx;">
                            <image
                            style="width: 48rpx;height: 48rpx;"
                                src="https://img.shinemang.com/gachaStatic/my/modifyEditIcon.png"
                                mode="scaleToFill"
                            />
                        </div>
                    </div>
                    <!-- <div class="address_btn flex_r flex_jb flex_ac">
                      
                        <div class="btns flex_r flex_ac">
                            <div
                                class="btn flex_r flex_ac"
                                @click.stop="editAddr(i.id)"
                            >
                                <img
                                    src="https://img.shinemang.com/gachaStatic/static/img/shipments/edit.png"
                                    class="del_ico"
                                />
                                <span>编辑</span>
                            </div>
                            <div
                                class="btn flex_r flex_ac"
                                @click.stop="ondelAddr(i.id)"
                            >
                                <img
                                    src="https://img.shinemang.com/gachaStatic/static/img/shipments/delete.png"
                                    class="del_ico"
                                />
                                <span>删除</span>
                            </div>
                        </div>
                    </div> -->
                </div>
                <div class="addAddress flex_r flex_jc flex_ac" @click="addr">
                   <img
                        src="https://img.shinemang.com/gachaStatic/my/addAddressIcon.png"
                      
                    /> 
                    <div class="add_txt">新增收货地址</div>
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
    border-radius: 32rpx 32rpx 0 0;
    background: #fff;
    padding: 30rpx 32rpx;
    padding-top: 16rpx;
    padding-bottom: 180rpx;

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
    // padding: 30rpx 0 80rpx;

    .addr_item {
        width: 686rpx;
        min-height: 230rpx;
        background: #ffffff;
        border-radius: 16rpx;
        margin-bottom: 20rpx;
        padding: 32rpx 0rpx;
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
        // border-bottom: 2rpx solid #e2e1e3;

        .addr_da {
            // width: calc(100% - 130rpx);

            .p1 {
                font-weight: 800;
                font-size: 32rpx;
                margin-bottom: 12rpx;

                span {
                    margin-right: 20rpx;
                }
                  .tag {
            width: 72rpx;
            height: 36rpx;
            line-height: 36rpx;
            text-align: center;
            font-size: 24rpx;
            background-color:#F1E3FF;
            border-radius: 8rpx;
            margin-right: 8rpx;

            &.corr {
                color: #A156EF;
                // background: rgba(255, 0, 92, 0.1);
            }

            &.corb {
                color: #0052f2;
                background: rgba(0, 82, 242, 0.1);
            }
        }
            }

            .p2 {
                font-size: 28rpx;
                line-height: 30rpx;
                color: #8D8D94;
            }
        }
    }
.addAddress{
    position: fixed;
width: 686rpx;
height: 88rpx;
background: #1A1A1A;
border-radius: 44rpx 44rpx 44rpx 44rpx;
bottom: 60rpx;
left: 50%;
transform: translateX(-50%);
color: #fff;
font-size: 32rpx;
img{
    width: 32rpx;
    height: 32rpx;
    margin-right: 16rpx;
}

}
    .address_btn {
        padding-top: 16rpx;

      

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