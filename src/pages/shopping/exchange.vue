<template>
  <view  class="exchange" :style="{ pointerEvents: forbid ? 'none' : 'auto',paddingTop: MBInfo().top + 'px' }">
    <view class="commodity">
      <view class="top_Back flex_r flex_jb flex_ac" @click.stop="gateBack">
        <view>
          <text class="icof Back_ico">&#xe72c;</text>
          <text class="txt">返回</text>
        </view>
        <view class="header">商品兑换</view>
        <view style="width: 70px"></view>
      </view>
      <view class="box">
        <!-- <view class="header">商品兑换</view> -->
        <div class="formItem" v-if="onlyShipment">
          <div class="txt bo"><span class="icof">&#xe641;</span>收货地址</div>
          <div class="address_box flex_r flex_jb flex_ac" @click="toList">
            <div class="address_info" v-if="selectAddr.name">
              <div class="flex_r flex_ac">
                <div class="tags flex_r flex_ac">
                  <div class="tag corr" v-if="selectAddr.isDefault">默认</div>
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
        <div class="form_item" :class="{ active: !onlyShipment }">
          <div class="commodityBox">
            <div class="particulars">
              <image :src="img" class="img" />
              <div class="right">
                <div class="text">{{ commodityName }}</div>
                <div class="priceBox">
                  <div class="price">
                    <div class="number">
                      {{ stock == "" ? 0 : point }}
                    </div>
                    <div class="EuropeanGas" :style="{ marginLeft: '4rpx' }">
                      {{ coinText }}
                    </div>
                  </div>
                  <div class="increase">
                    <u-number-box
                      v-model="number"
                      :disabled="stock == 0"
                      :min="1"
                      :max="stock"
                      integer
                    >
                      <view
                        slot="minus"
                        class="minus"
                        :class="[number < 2 ? 'minusA' : 'minusB']"
                      >
                        <u-icon name="minus" color="transparent"></u-icon>
                      </view>
                      {{ number }}
                      <view
                        slot="plus"
                        class="plus"
                        :class="[number == stock ? 'addA' : 'add']"
                      >
                        <u-icon name="plus" color="transparent"></u-icon>
                      </view>
                    </u-number-box>
                  </div>
                </div>
              </div>
            </div>
            <div class="freight">
              <div>合计</div>
              <div class="sumUp">
                <div class="sum">
                  {{ stock == "" ? 0 : totalPrice * number }}
                </div>
                <div>{{ coinText }}</div>
              </div>
            </div>
            <div class="freight">
              <div>付款方式</div>
              <div>{{ coinText }}兑换</div>
            </div>
            <div class="freight" v-if="!onlyShipment">
              <div>兑换方式</div>
              <div>兑换至星仓</div>
            </div>
            <div class="freight">
              <div>我的{{ coinText }}</div>
              <div>{{ myPrice }} {{ coinText }}</div>
            </div>
            <div class="freight" v-if="onlyShipment">
              <div class="orderForm">订单备注</div>
              <div class="remarka flex_je" @click="downShow = true">
                <div class="textc">{{ text }}</div>
                <div class="addr_r_ico icof" @click="downShow = true">
                  &#xe72b;
                </div>
              </div>
            </div>
          </div>
          <div class="hint">
            1、商品的实时价格会因为市场波动而产生变化,具体成交价以平台为准;<br />
            2、由于显示器、拍照和做图的过程中,产品可能发生颜色偏差，具体请以实物为准;<br />3、如有任何疑问请随时联系在线客服咨询。
          </div>
        </div>
        <x-btn
          :txt="`${coinText}兑换`"
          cor="3"
          class="btn"
          :style="[stock == 0 ? { opacity: 0.5 } : '']"
          @click="onBtn"
        />
      </view>
    </view>
    <show-modal></show-modal>
    <!-- 留言 -->
    <remark
      :visible.sync="downShow"
      @childEvent="handleChildEvent"
      typeClass="0"
    />
  </view>
</template>
<script>
import xBtn from "@/components/modules/x-btn";
import { post } from "@/utils/api.js";
import remark from "./remark.vue";
import { mapState, mapActions } from "vuex";
import { callPayment } from "@/utils/pay.js";
export default {
  data() {
    return {
      itemId: "",
      point: 0,
      totalPrice: 0,
      stock: 0,
      img: "",
      commodityName: "",
      number: 1,
      myPrice: 0,
      id: "",
      forbid: false,
      selectAddr: {}, //选择的地址
      selectId: undefined,
      selectRewardIds: [],
      selectRewardsInfo: [],
      remark: undefined, //备注
      downShow: false,
      text: "无备注",
      onlyShipment: 0,
      type: 1,
      coinText: "",
    };
  },
  components: {
    xBtn,
    remark,
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  mounted() {
    this.getMessage();
  },
  onLoad(da) {
    this.type = da.type;
    this.coinText = this.type == 1 ? "星光积分" : "星币";
    this.itemId = da.id;
    this.point = da.value;
    this.totalPrice = da.value;
    this.stock = da.stock || 99999;
    this.id = da.itemId;
    this.onlyShipment = da.onlyShipment;
    this.onGet();
    uni.setStorageSync("returnData", JSON.stringify(""));
  },
  onShow() {
    const data = JSON.parse(uni.getStorageSync("returnData"));
    this.address_id = data;
    this.loadAddrList();
  },
  methods: {
    ...mapActions(["asyncUpdateInfo", "asyncUpBalance"]),

    // 欧气值
    getMessage() {
      if (this.type == 1) {
        post("v1/activity/cost-award/point").then((res) => {
          this.myPrice = res.point;
        });
      } else {
        this.asyncUpBalance();
        this.myPrice = this.userInfo.xCoin;
      }
    },
    onGet() {
      post("v1/goods/item/get", {
        item_id: this.id,
      }).then((res) => {
        this.img = res.item.coverImage;
        this.commodityName = res.item.name;
      });
    },
    onBtn() {
      let that = this;
      if (!that.selectAddr.id && that.onlyShipment) {
        uni.$u.toast("请选择发货地址~");
        return;
      }
      if (that.stock == 0) {
        uni.$u.toast("暂无库存~");
        return;
      }
      if (Number(that.myPrice) < Number(that.totalPrice * this.number)) {
        uni.$u.toast("您的" + this.coinText + "不足~");
        return;
      }
      that.$showModal({
        title: "兑换商品",
        content: "您确定要兑换当前赏品么？",
        success(res) {
          that.forbid = true;
          uni.showLoading({
            title: "兑换中...",
          });
          if (res.confirm) {
            if (that.type == 1) {
              post("v1/activity/cost-award/accept", {
                config_id: that.itemId,
                nums: that.number,
                address_id: that.selectAddr.id, // 收货地址ID
                remark: that.text == "无备注" ? "" : that.text, // 备注
              }).then((res) => {
                if (!res.code) {
                  if (that.onlyShipment) {
                    uni.$u.toast("商品购买成功！");
                    // let url = that.saleType == 1 ? "/pages/my/releaseRecord" : "/pages/index/index";
                    // if (that.saleType == 2) uni.setStorageSync("currentChange", 3);
                    setTimeout(() => {
                      uni.reLaunch({
                        url: "/pages/my/releaseRecord",
                      }); // 关闭当前页面跳转到发货记录页
                    }, 2000);
                  } else {
                    setTimeout(() => {
                      uni.hideLoading();
                      uni.showToast({
                        title: "兑换成功",
                        icon: "success",
                        duration: 2000,
                      });
                    }, 1000);
                    uni.setStorageSync("currentChange", 2);
                    setTimeout(() => {
                      that.forbid = false;
                      uni.navigateTo({
                        url: "/pages/index/index",
                      });
                    }, 3000);
                  }
                } else {
                  uni.hideLoading();
                  uni.$u.toast(res.message);
                  that.forbid = false;
                }
              });
            } else {
                let data = {
                        config_id: that.itemId,
                        address_id: that.selectAddr.id, // 收货地址ID
                        remark: that.text == "无备注" ? "" : that.text, // 备注
                        nums: that.number,
                        balance_type: "XCoin",
                }
                callPayment("v1/activity/cost-award/buy", data, 0).then((req)=>{
                     if (!res.code) {
                  if (that.onlyShipment) {
                    uni.$u.toast("商品购买成功！");
                    // let url = that.saleType == 1 ? "/pages/my/releaseRecord" : "/pages/index/index";
                    // if (that.saleType == 2) uni.setStorageSync("currentChange", 3);
                    setTimeout(() => {
                      uni.reLaunch({
                        url: "/pages/my/releaseRecord",
                      }); // 关闭当前页面跳转到发货记录页
                    }, 2000);
                  } else {
                    setTimeout(() => {
                      uni.hideLoading();
                      uni.showToast({
                        title: "兑换成功",
                        icon: "success",
                        duration: 2000,
                      });
                    }, 1000);
                    uni.setStorageSync("currentChange", 2);
                    setTimeout(() => {
                      that.forbid = false;
                      uni.navigateTo({
                        url: "/pages/index/index",
                      });
                    }, 3000);
                  }
                } else {
                  uni.hideLoading();
                  uni.$u.toast(res.message);
                  that.forbid = false;
                }

                })
            }
          } else {
            that.forbid = false;
            uni.hideLoading();
            uni.$u.toast("您已取消兑换！");
          }
        },
      });
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
      let res = await callPayment(
        this.payMessage.url,
        this.payMessage.message,
        0,
      );
      if (!res.code) {
        this.confirmOrder(res);
      }
    },
    // 添加数量 减数量
    onNumber(value) {
      if (this.number > 1 || (this.number == 1 && value == 1))
        if (this.number < this.stock || value == -1) {
          this.number = this.number + value;
        }
    },
    // 收获地址
    SelectIds(ids, infos) {
      this.selectRewardIds = ids;
      this.selectRewardsInfo = infos;
    },
    // 获取地址
    loadAddrList() {
      let adId = this.address_id;
      post("v1/delivery_address/list").then((res) => {
        if (!res.code) {
          if (adId !== "") {
            let filteredNumbers = res.addresses.filter(
              (number) => number.id == adId,
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
        60 * 10,
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
  },
};
</script>
<style lang="scss" scoped>
::v-deep .u-number-box__input {
  background: #fff !important;
}

.ov {
  opacity: 0.5;
}

.exchange {
  // pointer-events: none;
  width: 100vw;
  height: 100vh;
  position: relative;
  // padding: 0rpx 0 30rpx;
  background: #f5f5f5;
  // background: linear-gradient(104deg, #e1d6f8 0%, #f8e7ed 100%);
  overflow-y: auto;

  &::before {
    content: "";
    // width: 100vw;
    // height: calc(100vh - 212rpx);
    // position: absolute;
    // top: 212rpx;
    // left: 0;
    // background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #f0f0f0 50%);
  }
}

.commodity {
  padding: 0 32rpx;
  height: 100%;
  position: relative;

  .top_Back {
    color: #1A1A1A;

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

.header {
  // width: 100%;
  font-weight: 800;
  font-size: 36rpx;
  color: #1A1A1A;
  text-align: center;
}

.txt {
  font-size: 32rpx;
  color: #1A1A1A;
  font-weight: bold;
  margin-bottom: 20rpx;
  height: 92rpx;
  line-height: 92rpx;
  border-bottom: 2rpx solid #e2e1e3;

  .icof {
    color: #f20;
  }
}

.address_box {
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

.box {
  // margin-top: 64rpx;
  width: 686rpx;
  height: calc(100% - 110rpx);
  position: absolute;
  bottom: 0;
  // padding-top: 24rpx;
  overflow-y: auto;

  // background: #ffffff;
  // padding: 28rpx 24rpx 0 24rpx;
  // &::before {
  //     content: "";
  //     width: 686rpx;
  //     height: 200rpx;
  //     position: absolute;
  //     bottom: 0;
  //     // z-index: -1;
  //     background: #fff;
  // }

  .form_item {
    z-index: 100;
    background: #ffffff;
    border-radius: 16rpx;
    padding: 24rpx 24rpx 0;

    &.active {
      height: 100%;
    }

    .txt {
      font-size: 32rpx;
      color: #1A1A1A;
      font-weight: bold;
      margin-bottom: 20rpx;
      height: 92rpx;
      line-height: 92rpx;
      border-bottom: 2rpx solid #e2e1e3;

      .icof {
        color: #f20;
      }
    }

    .commodityBox {
      border-bottom: 2rpx solid #e2e1e3;

      .particulars {
        height: 190rpx;
        display: flex;

        .img {
          width: 160rpx;
          height: 160rpx;
          border-radius: 8rpx 8rpx 8rpx 8rpx;
          margin-right: 16rpx;
        }

        .right {
          color: #1A1A1A;

          .text {
            width: 462rpx;
            height: 120rpx;
            font-weight: 500;
            font-size: 28rpx;
          }

          .priceBox {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;

            .price {
              color: #9762e9;
              font-weight: 800;
              display: flex;
              align-items: flex-end;

              .EuropeanGas {
                font-size: 24rpx;
              }

              .number {
                height: 48rpx;
                font-size: 40rpx;
              }
            }

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

      .freight {
        display: flex;
        justify-content: space-between;
        margin-bottom: 24rpx;
        font-weight: 500;
        font-size: 24rpx;
        color: #1A1A1A;

        .sumUp {
          display: flex;

          .sum {
            font-weight: 800;
            font-size: 28rpx;
            color: #1A1A1A;
            margin-right: 4rpx;
          }

          div {
            font-size: 28rpx;
          }
        }

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

    .hint {
      width: 638rpx;
      height: 180rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 24rpx;
      color: #7f7a88;
      margin-top: 24rpx;

      div {
        height: 36rpx;
        line-height: 36rpx;
      }
    }
  }

  .formItem {
    margin-bottom: 16rpx;
    width: 686rpx;
    background: #ffffff;
    border-radius: 16rpx;
    padding: 24rpx 24rpx 0;
    z-index: 100;
  }

  .bo {
    bottom: 0rpx;
  }

  .btn {
    position: absolute;
    bottom: 150rpx;
    left: 220rpx;
  }
}
</style>
