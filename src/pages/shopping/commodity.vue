<template>
  <view class="shoppingBox">
    <text class="icof Back_ico" @click.stop="gateBack">&#xe72c;</text>
    <image :src="goodsInfo.coverImage" class="img" />
    <view class="price">
      <block v-if="type == 2">
        <view style="color: #EE4326;font-size: 32rpx;" class="a">￥</view>
        <view style="color: #EE4326;" class="number">{{ itemPrice }}</view>
      </block>
      <block v-if="type == 1">
      
        <view style="color: #A156EF;margin-left: 32rpx;" class="number">{{ itemValue }}</view>
          <view style="color: #A156EF;margin-left: 0;font-size: 32rpx;height: auto;margin-top: 6rpx;" class="a">星光积分</view>
      </block>
      <block v-if="type == 3">
       
        <view style="color: #FF932B;margin-left: 32rpx;" class="number">{{ itemValue }}</view>
         <view style="color: #FF932B;margin-left: 0;font-size: 32rpx;height: auto;margin-top: 6rpx;" class="a">星币</view>
      </block>
      <!-- <view class="integral" v-if="type == 1">
                <view class="integralImg"></view>
                <view class="">{{ itemValue }}</view>
            </view>
            <view class="integral" v-else-if="type == 3">
                <view class="integralImg">星币</view>
                <view class="">{{ itemValue }}</view>
            </view> -->
    </view>
    <view class="particulars">{{ goodsInfo.name }}</view>
    <div
      class="gacha_info"
      v-if="goodsInfo.itemParams && goodsInfo.itemParams.length"
    >
      <div class="tit">商品参数</div>
      <div class="arguments">
        <div
          class="arg_item flex_r flex_ac flex_jb"
          v-for="(item, i) in goodsInfo.itemParams"
          :key="i"
        >
          <div class="arg_name ellipsis">{{ item.key }}</div>
          <div class="arg_va arg_name ellipsis">{{ item.value }}</div>
        </div>
      </div>
    </div>
    <div class="gacha_info">
      <div class="tit">商品详情</div>
      <div>{{ goodsInfo.detailContent }}</div>
      <div class="gacha_img_detail">
        <image
          mode="widthFix"
          v-for="(item, index) in goodsInfo.detailUrls"
          :src="item"
          :key="index"
        ></image>
      </div>
    </div>

    <view class="foot-btn flex_r flex_ac flex_jse" v-if="isShow">
      <!-- #ifndef MP-WEIXIN -->

      <view
        @click="(showBuyGoodsModal = true), (number = 1)"
        v-if="type == 2"
        class="confirmBtn"
      >
        立即购买
      </view>
      <view
        @click="(showExchangeGoodsModal = true), (number = 1)"
        v-if="type == 1"
        class="confirmBtn"
      >
        星光积分兑换
      </view>
      <view
        @click="(showExchangeGoodsModal = true), (number = 1)"
        v-if="type == 3"
        class="confirmBtn"
      >
        星币兑换
      </view>
    </view>
    <view class="foot-btn flex_r flex_ac flex_jse" v-else>
      <view @click="onTime" v-if="type == 2" class="confirmBtn diasble">
        立即购买
      </view>
      <!-- <x-btn
               v-if="type == 2"
                txt="立即购买"
                cor="2"
                @click="onTime"
                :style="{ opacity: '0.5' }"
            /> -->
      <view @click="onTime" v-if="type == 1" class="confirmBtn diasble">
        星光积分兑换
      </view>
      <!-- <x-btn
              v-if="type == 1"
                txt="星光积分兑换"
                cor="3"
                @click="onTime"
                :style="{ opacity: '0.5' }"
            /> -->
      <view @click="onTime" v-if="type == 3" class="confirmBtn diasble">
        星币兑换
      </view>
      <!-- <x-btn
               v-if="type == 3"
                txt="星币兑换"
                cor="3"
                @click="onTime"
                :style="{ opacity: '0.5' }"
            /> -->
    </view>

    <!-- 订单购买弹框 -->
    <u-popup
      round="16"
      :show="showBuyGoodsModal"
      @close="showBuyGoodsModal = false"
    >
      <view class="confirmOrder">
        <div class="title">订单确认</div>
        <div class="close" @click="showBuyGoodsModal = false"></div>

        <div class="contentInfo">
          <div @click="toList" class="address">
            <div class="info">
              <img src="@/static/addressIcon.png" alt="" />
              <div>
                <div class="top">
                  {{ selectAddr.province }}{{ selectAddr.city
                  }}{{ selectAddr.area }}{{ selectAddr.subArea }}
                </div>
                <div v-if="selectAddr.address" class="center">
                  {{ selectAddr.address }}
                </div>
                <div v-else class="center">
                  请选择收货地址
                </div>
                <div class="bottom">
                  <span>{{ selectAddr.name }} {{ selectAddr.phoneNum }}</span>
                  <div v-if="selectAddr.isDefault" class="default">默认</div>
                </div>
              </div>
            </div>
            <u-icon color="#B3B3B3" name="arrow-right"></u-icon>
          </div>
          <div class="goodsInfo">
            <div class="goods">
              <img :src="img" alt="" />
              <div>
                <div class="name ellipsis">{{ goodsInfo.name }}</div>
                <div class="stock">库存: &nbsp;{{ stock || 9999 }}</div>
                <div class="price">￥{{ itemPrice }}</div>
              </div>
            </div>

            <div class="count">
              <div class="subTitle">数量</div>
              <div class="increase">
                <u-number-box
                  v-model="number"
                  :disabled="stock == 0"
                  :min="1"
                  :max="stock"
                  integer
                  @change="bindChange"
                  bgColor="#fff"
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

            <div class="mark">
              <div class="subTitle">订单备注</div>
              <div class="markInfo">
                <div @click="downShow = true" class="rightInfo">
                  <span class="ellipsis" :style="{
                    display:'inline-block',
                    maxWidth:'400rpx',
                    color:text=='无备注'?'#B3B3B3':'#1A1A1A'
                  }">{{ text }}</span>
                  <u-icon color="#B3B3B3" name="arrow-right"></u-icon>
                </div>
              </div>
            </div>
            <div class="totalPrice">
              <span>总计：</span>
              <span class="amount">￥{{ amount }}</span>
            </div>
          </div>
          <div class="payType">
            <div class="payTitle">选择支付方式</div>
            <div class="payBox">
              <div
                v-for="(i, s) in pays"
                @click="onPaytype(i)"
                :key="s"
                v-show="i.show"
                class="item"
              >
                <div class="leftType">
                  <img :src="payIco(i.img)" alt="" />
                  <span>
                    {{
                      i.type == 4 ? i.name + "（" + i.number + "）" : i.name
                    }}</span
                  >
                </div>
                <div
                  class="select"
                  :class="{
                    active: paytypeList.includes(i.type),
                  }"
                ></div>
              </div>
            </div>
          </div>

          <div class="tips">
            <div>
              1、商品的实时价格会因为市场波动而产生变化,具体成交价以平台为准;
            </div>
            <div>
              2、由于显示器、拍照和做图的过程中,产品可能发生颜色偏差，具体请以实物为准;
            </div>
            <div>3、如有任何疑问请随时联系客服咨询。</div>
          </div>
        </div>
        <div class="confirmBtn">
          <view @click="onClickDraw" class="btn">确认信息并支付 ￥{{ amount }}</view>
        </div>
      </view>
    </u-popup>
    <remark
      :visible.sync="downShow"
      @childEvent="handleChildEvent"
      typeClass="0"
    />

    <u-popup
      round="16"
      :show="showExchangeGoodsModal"
      @close="showExchangeGoodsModal = false"
    >
      <view class="exchangeGoods">
        <div class="title">商品兑换</div>
        <div class="close" @click="showExchangeGoodsModal = false"></div>

        <div class="contentInfo">
          <!-- <div  @click="toList" v-if="selectAddr.name" class="address">
            <div  class="info">
              <img src="@/static/addressIcon.png" alt="" />
              <div>
                <div class="top"> {{ selectAddr.province }}{{ selectAddr.city
                }}{{ selectAddr.area }}{{ selectAddr.subArea }}</div>
                <div class="center">
                   {{ selectAddr.address }}
                </div>
                <div class="bottom">
                    <span>{{ selectAddr.name }} {{ selectAddr.phoneNum }}</span>
                    <div v-if="selectAddr.isDefault" class="default">默认</div>
                </div>
              </div>
            </div>
            <u-icon color="#B3B3B3" name="arrow-right"></u-icon>
          </div> -->
          <div class="goodsInfo">
            <div class="goods">
              <img :src="img" alt="" />
              <div>
                <div class="name ellipsis">{{ goodsInfo.name }}</div>
                <div class="stock">库存: &nbsp;{{ stock || 9999 }}</div>
                <div class="price">
                  <span>{{ itemValue }} </span
                  ><span style="font-size: 24rpx; margin-top: 10rpx">{{
                    exchangeText
                  }}</span>
                </div>
              </div>
            </div>

            <div class="count">
              <div class="subTitle">数量</div>
              <div class="increase">
                <u-number-box
                  v-model="number"
                  :disabled="stock == 0"
                  :min="1"
                  :max="stock"
                  integer
                  @change="bindChange"
                  bgColor="#fff"
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

            <!-- <div class="mark">
              <div class="subTitle">订单备注</div>
              <div class="markInfo">
                <div @click="downShow = true" class="rightInfo">
                  <span>{{ text }}</span>
                  <u-icon color="#B3B3B3" name="arrow-right"></u-icon>
                </div>
              </div>
            </div> -->
            <div class="totalPrice">
              <span>总计：</span>
              <span
                :style="{
                  color: type == 1 ? '#A156EF' : '#FF932B',
                }"
                class="amount"
              >
                {{ stock == "" ? 0 : getTotalValue(itemValue, number) }}
                <span style="font-size: 24rpx">{{ exchangeText }}</span></span
              >
            </div>
          </div>
          <div class="payType">
            <div class="payTitle">兑换方式</div>
            <div class="payBox">
              <div class="item">
                <div class="leftType">
                  <img :src="type==1?'https://img.shinemang.com/gachaStatic/star.png':'https://img.shinemang.com/gachaStatic/xb.png'" alt="" />
                  <span> {{ exchangeText }}</span>
                  <span
                    style="
                      color: #8d8d94;
                      font-size: 24rpx;
                      font-weight: normal;
                    "
                    >(我的{{ exchangeText }}:{{ myPrice }})</span
                  >
                </div>
                <div class="select active"></div>
              </div>
            </div>
          </div>

          <div class="tips">
            <div>
              1、商品的实时价格会因为市场波动而产生变化,具体成交价以平台为准;
            </div>
            <div>
              2、由于显示器、拍照和做图的过程中,产品可能发生颜色偏差，具体请以实物为准;
            </div>
            <div>3、如有任何疑问请随时联系客服咨询。</div>
          </div>
        </div>
        <div class="confirmBtn">
          <view @click="onClickExchange" class="btn">确认兑换</view>
        </div>
      </view>
    </u-popup>

    <u-popup
      :overlayStyle="{ zIndex: 88887 }"
      zIndex="88888"
      mode="center"
      :show="exchangeConfirmModal"
      @close="exchangeConfirmModal = false"
      round="20"
    >
      <div class="confirmSureModal">
        <div class="title">兑换确认</div>
        <div style="font-size: 28rpx" class="tips">
          您确定要兑换当前赏品么？
        </div>

        <div class="actionBtns">
          <div @click="exchangeConfirmModal = false" class="btn cancel">
            取消
          </div>
          <div @click="onBtn" class="btn confirm">确认</div>
        </div>
      </div>
    </u-popup>
  </view>
</template>
<script>
let that;
import xBtn from "@/components/modules/x-btn";
import { post } from "@/utils/api.js";
import remark from "./remark.vue";
import { timesAmount } from "../../utils/mgtv.js";
import { mapState, mapActions } from "vuex";
import { callPayment } from "@/utils/pay.js";
import color from "uview-ui/libs/config/color.js";
export default {
  //  id: configId,
  //             price: itemPrice,
  //             stock: stock,
  //             itemId: itemId,
  //             type: 2,
  data() {
    return {
      itemId: "",
      goodsInfo: {},
      itemValue: 0,
      itemPrice: 0,
      stock: 0,
      configId: "",
      endTime: "",
      startTime: "",
      isShow: false,
      warning: "预售",
      objId: 0,
      filteredNumbers: {},
      type: 0,

      showBuyGoodsModal: false,
      address_id: "",
      selectRewardIds: [],
      selectRewardsInfo: [],
      remark: undefined, //备注
      selectAddr: {}, //选择的地址
      selectId: undefined,
      amount: 0, // 支付总额
      pays:
        process.env.NODE_ENV === "development"
          ? [
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
                name: "芒果支付",
                type: 1,
                img: "xjzf",
                show: true,
                msg: "芒果支付",
                consume: 0,
              },
            ]
          : [
              {
                name: "芒果支付",
                type: 1,
                img: "xjzf",
                show: true,
                msg: "芒果支付",
                consume: 0,
              },
            ],

      paytypeList: [1], // 0潮币 1支付宝 2微信 3微信小程序
      downShow: false,
      text: "无备注",
      totalPrice: 0,
      img: "",
      commodityName: "",
      number: 1,
      saleType: 1,
      gold: this.$gl("userInfo").gold,

      showExchangeGoodsModal: false, // 兑换
      exchangeText: "",

      myPrice: 0,
      exchangeConfirmModal: false,
    };
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
      "$store.state.userInfo.xCoin": {
      handler(newVal) {
       if(this.type == 3){
         this.myPrice = newVal
       }
      
      },
    },
  },
  components: {
    xBtn,
    remark,
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  onLoad(da) {
    // let obj = JSON.parse(da.itemJson);
    this.objId = da.id;
    this.type = da.type;
    this.exchangeText = this.type == 1 ? "星光积分" : "星币";

    this.onGet();
  },
  created() {
    that = this;
  },
  onShow() {
    const data = JSON.parse(uni.getStorageSync("returnData"));
    this.address_id = data;
    console.log(this.address_id,'324234234')
    this.loadAddrList();
    this.getMessage();
  },
  methods: {
    onClickExchange() {
      let that = this;

      if (that.stock == 0) {
        uni.$u.toast("暂无库存~");
        return;
      }
      if (Number(that.myPrice) < Number(that.itemValue * this.number)) {
        uni.$u.toast("您的" + this.exchangeText + "不足~");
        return;
      }
      this.exchangeConfirmModal = true;
    },

    getTotalValue(value1, value2) {
      return timesAmount(value1, value2);
    },

    // 欧气值
    getMessage() {
      if (this.type == 1) {
        post("v1/activity/cost-award/point").then((res) => {
          this.myPrice = res.point;
        });
      } else {
         this.asyncUpdateInfo()
        this.asyncUpBalance();
       
        this.myPrice = this.userInfo.xCoin;
      }
    },
    ...mapActions(["asyncUpBalance", "asyncUpdateInfo"]),
    onGet() {
      post("v1/activity/cost-award/list", {
        type: this.type,
        order_price: 0,
      }).then((res) => {
        let filteredNumbers = res.config.filter(
          (item) => item.configId == this.objId,
        );
        this.filteredNumbers = filteredNumbers[0];
        this.itemId = filteredNumbers[0].itemList[0].id;
        this.itemValue =
          this.type == 1
            ? Number(filteredNumbers[0].value)
            : Number(filteredNumbers[0].xCoin);

        this.itemPrice = Number(filteredNumbers[0].price);
        this.amount = Number(this.itemPrice);
        this.totalPrice = this.itemPrice;

        this.stock = filteredNumbers[0].stock || 9999;
        this.configId = filteredNumbers[0].configId;
        if (filteredNumbers[0].startTime !== "") {
          this.startTime = this.remainingTime(filteredNumbers[0].startTime);
        }
        if (filteredNumbers[0].endTime !== "") {
          this.endTime = this.remainingTime(filteredNumbers[0].endTime);
        }
        // 按钮可用
        if (this.startTime == "" || this.startTime < 0) {
          this.warning = "购买时间截止";
          if (this.endTime == "" || this.endTime > 0) {
            this.warning = "此商品暂无库存";
            if (this.stock > 0 || this.stock == "") {
              this.isShow = true;
            }
          }
        }

        post("v1/goods/item/get", {
          item_id: this.itemId,
        }).then((req) => {
          req.item.itemParams.unshift({
            key: "赏品状态",
            value:
              req.item.saleType == 1
                ? "现货"
                : `预售（${req.item.bookingTime}）`,
          });
          this.goodsInfo = req.item;
          this.img = req.item.coverImage;
          this.commodityName = req.item.name;
          this.saleType = req.item.saleType;
        });
      });
    },

    onTime() {
      uni.$u.toast(`${this.warning}~`);
      return;
    },

    // 购买
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
          this.paytypeList = this.paytypeList.filter((x) => x !== item.type);
          item.consume = 0;
        } else {
          this.paytypeList = [item.type];
        }
        if (this.paytypeList.includes(1) && this.paytypeList.length == 1)
          this.pays.forEach((i) => (i.consume = 0));
        this.getPay();
      }
    },
    bindChange(e) {
      let a = this.getTotalValue(this.totalPrice , e.value);
      this.amount = (a);

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
    async getBalance() {},
    onHint() {
      if (this.stock == 0) uni.$u.toast("库存不足~");
      else {
        uni.$u.toast("购买数量不能为0~");
        this.number = 1;
      }
    },
    async onClickDraw() {
        if(!this.selectAddr.name){
             uni.$u.toast("请先添加收货地址~");
        return;
        }
      if (this.stock == 0) {
        uni.$u.toast("库存不足~");
        return;
      }
      if (this.number == 0) {
        uni.$u.toast("购买数量不能为0~");
        this.number = 1;
        return;
      }
      let that = this;
      let type =
        that.paytypeList.includes(1) || that.paytypeList.includes(3) ? 1 : 0;
      let data = {
        config_id: that.configId,
        address_id: that.selectAddr.id, // 收货地址ID
        remark: that.text == "无备注" ? "" : that.text, // 备注
        nums: that.number,
        balance_type: "COIN",
      };
      if (
        this.paytypeList.length < 2 &&
        that.paytypeList.includes(4) &&
        that.amount > that.gold
      ) {
        let a = that.gold == 0 ? "您的金币不足！" : "您的金币不足！";
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
            platform_id: 6,
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
      console.log(res);
      if (!res.code) {
        console.log(res);
        if (res.res && res.res.createPaymentReply) {
          if (window.mgtv) {
            mgtv.requestPaymentGameItem({
              signData: res.res.createPaymentReply.signData,
              sign: res.res.createPaymentReply.sign,
              timestamp: Number(res.res.createPaymentReply.timestamp),
              success: (eq) => {
                uni.$u.toast("商品购买成功！可前往我的订单中查看");
                this.showBuyGoodsModal = false;
                this.onGet();
                  this.getMessage()
                // this.asyncUpBalance();
                
              },
              fail: (err) => {},
            });
          }
        } else {
          uni.$u.toast("商品购买成功！可前往我的订单中查看");
          this.showBuyGoodsModal = false;
          this.onGet();
          this.getMessage()
        //   this.asyncUpBalance();
        }
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
    getPay() {
      this.pays.forEach((user) => {
        if (user.type == 4 && this.paytypeList.includes(4))
          user.consume = this.gold;
        if (
          user.type == 1 &&
          this.paytypeList.includes(1) &&
          this.paytypeList.length > 1
        )
          user.consume = this.floatingPoint(this.amount, "-", this.gold);
      });
    },

    handleChildEvent(a, b) {
      this.downShow = a;
      this.text = b;
    },

    loadAddrList() {
      let adId = this.address_id;
      post("v1/delivery_address/list").then((res) => {
        if (!res.code) {
          if (adId !== "") {
            if(res.addresses.length > 0){
                 let filteredNumbers = res.addresses.filter(
              (number) => number.id == adId,
            );
                if(filteredNumbers.length){
                this.selectAddr = filteredNumbers[0];
                }else{
                this.selectAddr = res.addresses[0]
                }
            }else{
                this.selectAddr = {}
            }   
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

    onBtn() {
      let that = this;
      if (that.type == 1) {
        post("v1/activity/cost-award/accept", {
          config_id: that.configId,
          nums: that.number,
          address_id: that.selectAddr.id, // 收货地址ID
          remark: that.text == "无备注" ? "" : that.text, // 备注
        }).then((res) => {
          if (!res.code) {
            this.exchangeConfirmModal = false;
            this.showExchangeGoodsModal = false;
            uni.$u.toast("兑换成功,商品已放入星仓");
            this.getMessage();
            this.onGet();
            //   if (that.onlyShipment) {
            //     uni.$u.toast("商品购买成功！");
            //     // let url = that.saleType == 1 ? "/pages/my/releaseRecord" : "/pages/index/index";
            //     // if (that.saleType == 2) uni.setStorageSync("currentChange", 3);
            //     setTimeout(() => {
            //       uni.reLaunch({
            //         url: "/pages/my/releaseRecord",
            //       }); // 关闭当前页面跳转到发货记录页
            //     }, 2000);
            //   } else {
            //     setTimeout(() => {
            //       uni.hideLoading();
            //       uni.showToast({
            //         title: "兑换成功",
            //         icon: "success",
            //         duration: 2000,
            //       });
            //     }, 1000);
            //     uni.setStorageSync("currentChange", 2);
            //     setTimeout(() => {
            //       that.forbid = false;
            //       uni.navigateTo({
            //         url: "/pages/index/index",
            //       });
            //     }, 3000);
            //   }
          } else {
            uni.hideLoading();
            uni.$u.toast(res.message);
            that.forbid = false;
          }
        });
      } else {
        let data = {
          config_id: that.configId,
          address_id: that.selectAddr.id, // 收货地址ID
          remark: that.text == "无备注" ? "" : that.text, // 备注
          nums: that.number,
          balance_type: "XCoin",
        };
        callPayment("v1/activity/cost-award/buy", data, 0).then((res) => {
          if (!res.code) {
            this.exchangeConfirmModal = false;
            this.showExchangeGoodsModal = false;
            uni.$u.toast("兑换成功,商品已放入星仓");
            this.getMessage();
            this.onGet();
          } else {
            uni.hideLoading();
            uni.$u.toast(res.message);
            that.forbid = false;
          }
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.shoppingBox {
  width: 100vw;
  height: 100vh;
  // background: linear-gradient(104deg, #e1d6f8 0%, #f8e7ed 100%);
  overflow-y: auto;
  background: #f5f6f8;

  .img {
    width: 100%;
    height: 750rpx;
    border-radius: 0rpx 0rpx 0rpx 0rpx;
    vertical-align: middle;
    background: linear-gradient(180deg, #ccfff4 0%, #ffffff 60%);
  }
  .price {
    width: 100%;
    height: 112rpx;
    background: #fff;
    // background: url("https://img.shinemang.com/gachaStatic/static/img/home/bg_plus.png");
    color: #1a1a1a;
    font-weight: 800;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    .a {
    //   height: 56rpx;
      font-size: 24rpx;
      margin-right: 4rpx;
      margin-left: 32rpx;
    }
    .number {
      font-family: Binance PLEX, Binance PLEX;
      font-size: 40rpx;
    }

    .integral {
      height: 56rpx;
      background: #ffffff;
      border-radius: 0rpx 8rpx 8rpx 0rpx;
      font-family: Binance PLEX, Binance PLEX;
      font-size: 40rpx;
      color: #9762e9;
      line-height: 56rpx;
      display: flex;
      margin-left: 24rpx;
      padding-right: 12rpx;
      .integralImg {
        width: 104rpx;
        height: 56rpx;
        background: url("https://img.shinemang.com/gachaStatic/static/img/home/plus.png");
        background-size: 100% 100%;
        font-size: 24rpx;
        color: #ffffff;
        line-height: 56rpx;
        text-align: center;
        margin-right: 8rpx;
      }
    }
  }
  .particulars {
    width: 100%;
    font-weight: 500;
    font-size: 28rpx;
    color: #000;
    padding: 20rpx 32rpx;
    background: #fff;
    border-radius: 0rpx 0rpx 8rpx 8rpx;
    margin-bottom: 16rpx;
    overflow: hidden;
  }
  .gacha_info {
    padding: 28rpx 36rpx;
    margin-top: 16rpx;
    border-radius: 16rpx;
    background-color: #fff;

    .row_l {
      font-size: 20rpx;
      font-weight: 500;

      .tag {
        font-weight: 800;
        font-size: 24rpx;
      }

      .price {
        font-size: 47rpx;
        font-weight: 700;
        height: 56rpx;
        line-height: 56rpx;
        margin: 0 10rpx 0 4rpx;
      }

      .tag2 {
        .Star {
          width: 14rpx;
          height: 14rpx;
        }
      }
    }

    .row_r {
      font-size: 24rpx;
      font-weight: 500;
      color: #7f7a88;

      &.txt_left {
        width: 350rpx;
      }
    }

    .tit {
      font-weight: 500;
      font-size: 28rpx;
      color: #1a1a1a;
      margin-bottom: 28rpx;
    }
    .gacha_img_detail {
      width: 100%;
      margin-top: 10rpx;
      font-size: 0;
      image {
        width: 100%;
      }
    }

    .gacha_name {
      font-weight: 500;
      font-size: 28rpx;
      margin-top: 20rpx;
    }

    .arg_item {
      margin-bottom: 8rpx;

      &:last-child {
        margin-bottom: 0;
      }

      .arg_name {
        height: 50rpx;
        line-height: 50rpx;
        width: 150rpx;
        color: #8d8d94;
        padding: 0 12rpx;
        // background: #f9f9f9;
        font-weight: 500;
        font-size: 24rpx;
        color: #383228;
        border-radius: 4rpx;
      }

      .arg_va {
        width: calc(100% - 162rpx);
        color: #1a1a1a;
      }
    }
  }
  .foot-btn {
    position: fixed;
    bottom: 0rpx;
    left: 0;
    width: 100%;
    padding: 0 28rpx;
    width: 750rpx;
    height: 152rpx;
    background: #ffffff;

    .confirmBtn {
      width: 686rpx;
      height: 80rpx;
      border-radius: 40rpx 40rpx 40rpx 40rpx;
      background: linear-gradient(90deg, #31e597 0%, #40e0ea 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #1a1a1a;
      font-size: 32rpx;
      font-weight: bold;
      &.disable {
        background: #f5f6f8;
      }
    }
  }
  .Back_ico {
    font-size: 50rpx;
    margin-right: 8rpx;
    position: absolute;
    z-index: 1;
    top: 100rpx;
    left: 32rpx;
  }

  .confirmOrder {
    width: 750rpx;
    height: 1388rpx;
    background: #f5f6f8;
    border-radius: 32rpx 32rpx 32rpx 32rpx;
    padding-top: 48rpx;

    &::after {
      content: "";
      width: 100vw;
      height: 210rpx;
      left: 0;
      top: 0;
      position: absolute;
      z-index: 1;
      background: url("@/static/payTop.png");
      background-size: 100% 100%;
    }

    div {
      position: relative;
      z-index: 15;
    }

    .title {
      font-size: 36rpx;
      color: #1a1a1a;
      font-weight: bold;
      text-align: center;
    }
    .close {
      width: 56rpx;
      height: 56rpx;
      background: url("@/static/close.png");
      background-size: 100% 100%;
      position: absolute;
      top: 32rpx;
      right: 32rpx;
      z-index: 109;
    }

    .address {
      width: 718rpx;
      // height: 196rpx;
      background: #ffffff;
      border-radius: 24rpx 24rpx 24rpx 24rpx;
      margin: auto;

      display: flex;
      justify-content: space-between;
      padding: 32rpx;
      .info {
        display: flex;
        align-items: center;
        img {
          width: 48rpx;
          height: 48rpx;
          margin-right: 16rpx;
        }
        .top {
          color: #1a1a1a;
          font-size: 24rpx;
        }
        .center {
          color: #1a1a1a;
          font-size: 32rpx;
          font-weight: bold;
          max-width: 530rpx;
          margin-top: 10rpx;
        }
        .bottom {
          display: flex;
          align-items: center;
          font-size: 24rpx;
          color: #8d8d94;

          .default {
            width: 72rpx;
            height: 36rpx;
            background: #f1e3ff;
            border-radius: 8rpx 8rpx 8rpx 8rpx;
            color: #a156ef;
            font-size: 24rpx;
            line-height: 36rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 12rpx;
          }
          margin-top: 10rpx;
        }
      }
      .arrow {
        width: 32rpx;
        height: 32rpx;
      }
    }
    .contentInfo {
      width: 100%;
      margin-top: 32rpx;
      height: calc(100% - 60rpx);
      overflow-y: auto;
    }
    .goodsInfo {
      width: 718rpx;
      background: #ffffff;
      border-radius: 24rpx 24rpx 24rpx 24rpx;
      margin: auto;
      margin-top: 16rpx;
      padding: 32rpx 24rpx;
      .goods {
        display: flex;
        align-items: center;
        img {
          width: 176rpx;
          height: 176rpx;
          border-radius: 16rpx 16rpx 16rpx 16rpx;
          margin-right: 24rpx;
        }
        .name {
          font-size: 32rpx;
          color: 32rpx;
          font-weight: bold;
          max-width: 470rpx;
        }
        .stock {
          color: #8d8d94;
          font-size: 24rpx;
          margin-top: 8rpx;
          margin-bottom: 24rpx;
        }
        .price {
          color: #1a1a1a;
          font-size: 32rpx;
          font-weight: bold;
          height: auto;
        }
      }
      .subTitle {
        color: #1a1a1a;
        font-size: 28rpx;
        font-weight: bold;
      }
      .count {
        margin: 32rpx 0;
        display: flex;
        justify-content: space-between;
        align-items: center;

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
      .mark {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 32rpx;
        border-bottom: 2rpx dashed #e5e5e5;
        .rightInfo {
          display: flex;
          align-items: center;
          color: #b3b3b3;
          font-size: 28rpx;
          line-height: 40rpx;
          span {
            margin-right: 5rpx;
          }
        }
      }

      .totalPrice {
        margin-top: 32rpx;
        font-size: 28rpx;
        width: 100%;
        color: #1a1a1a;
        font-weight: 600;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .amount {
          color: #ee4326;
          font-size: 32rpx;
        }
      }
    }
    .payType {
      margin-top: 32rpx;
      color: #1a1a1a;
      font-size: 28rpx;
      font-weight: bold;
      .payTitle {
        padding-left: 40rpx;
      }
      .payBox {
        width: 718rpx;
        margin: auto;
        margin-top: 16rpx;
        .item {
          width: 718rpx;
          height: 104rpx;
          background: #ffffff;
          border-radius: 24rpx 24rpx 24rpx 24rpx;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24rpx;
          padding: 0 24rpx;
          .leftType {
            display: flex;
            align-items: center;
            img {
              width: 56rpx;
              height: 56rpx;
              margin-right: 24rpx;
            }
          }

          > img {
            width: 40rpx;
            height: 40rpx;
          }
        }

        .select {
          width: 36rpx;
          height: 36rpx;
          background: #eee;
          border-radius: 50%;
          background: url("https://img.shinemang.com/gachaStatic/notSelect.png");
          background-size: 100% 100%;

          &.active {
            background-image: url("https://img.shinemang.com/gachaStatic/select.png") !important;
            background-size: 100% 100% !important;
          }
        }
      }
    }
    .tips {
      color: #8d8d94;
      font-size: 24rpx;
      padding: 0 40rpx;
      margin-bottom: 220rpx;
    }
    .confirmBtn {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 160rpx;
      z-index: 33;
      background: #fff;
      display: flex;
      justify-content: center;
      padding-top: 24rpx;
      > .btn {
        width: 686rpx;
        height: 80rpx;
        background: linear-gradient(90deg, #31e597 0%, #40e0ea 100%);
        border-radius: 40rpx 40rpx 40rpx 40rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32rpx;
        color: #1a1a1a;
        font-weight: bold;
      }
    }
  }
  .exchangeGoods {
    width: 750rpx;
    height: 1292rpx;
    background: #f5f6f8;
    border-radius: 32rpx 32rpx 32rpx 32rpx;
    padding-top: 48rpx;

    &::after {
      content: "";
      width: 100vw;
      height: 210rpx;
      left: 0;
      top: 0;
      position: absolute;
      z-index: 1;
      background: url("@/static/payTop.png");
      background-size: 100% 100%;
    }

    div {
      position: relative;
      z-index: 15;
    }

    .title {
      font-size: 36rpx;
      color: #1a1a1a;
      font-weight: bold;
      text-align: center;
    }
    .close {
      width: 56rpx;
      height: 56rpx;
      background: url("@/static/close.png");
      background-size: 100% 100%;
      position: absolute;
      top: 32rpx;
      right: 32rpx;
      z-index: 109;
    }

    .address {
      width: 718rpx;
      // height: 196rpx;
      background: #ffffff;
      border-radius: 24rpx 24rpx 24rpx 24rpx;
      margin: auto;

      display: flex;
      justify-content: space-between;
      padding: 32rpx;
      .info {
        display: flex;
        align-items: center;
        img {
          width: 48rpx;
          height: 48rpx;
          margin-right: 16rpx;
        }
        .top {
          color: #1a1a1a;
          font-size: 24rpx;
        }
        .center {
          color: #1a1a1a;
          font-size: 32rpx;
          font-weight: bold;
          max-width: 530rpx;
          margin-top: 10rpx;
        }
        .bottom {
          display: flex;
          align-items: center;
          font-size: 24rpx;
          color: #8d8d94;

          .default {
            width: 72rpx;
            height: 36rpx;
            background: #f1e3ff;
            border-radius: 8rpx 8rpx 8rpx 8rpx;
            color: #a156ef;
            font-size: 24rpx;
            line-height: 36rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 12rpx;
          }
          margin-top: 10rpx;
        }
      }
      .arrow {
        width: 32rpx;
        height: 32rpx;
      }
    }
    .contentInfo {
      width: 100%;
      margin-top: 32rpx;
      height: calc(100% - 60rpx);
      overflow-y: auto;
    }
    .goodsInfo {
      width: 718rpx;
      background: #ffffff;
      border-radius: 24rpx 24rpx 24rpx 24rpx;
      margin: auto;
      margin-top: 16rpx;
      padding: 32rpx 24rpx;
      .goods {
        display: flex;
        align-items: center;
        img {
          width: 176rpx;
          height: 176rpx;
          border-radius: 16rpx 16rpx 16rpx 16rpx;
          margin-right: 24rpx;
        }
        .name {
          font-size: 32rpx;
          color: 32rpx;
          font-weight: bold;
          max-width: 470rpx;
        }
        .stock {
          color: #8d8d94;
          font-size: 24rpx;
          margin-top: 8rpx;
          margin-bottom: 24rpx;
        }
        .price {
          color: #1a1a1a;
          font-size: 32rpx;
          font-weight: bold;
          height: auto;
        }
      }
      .subTitle {
        color: #1a1a1a;
        font-size: 28rpx;
        font-weight: bold;
      }
      .count {
        margin: 32rpx 0;
        display: flex;
        justify-content: space-between;
        align-items: center;

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
      .mark {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 32rpx;
        border-bottom: 2rpx dashed #e5e5e5;
        .rightInfo {
          display: flex;
          align-items: center;
          color: #b3b3b3;
          font-size: 28rpx;
          line-height: 40rpx;
          span {
            margin-right: 5rpx;
          }
        }
      }

      .totalPrice {
        margin-top: 32rpx;
        font-size: 28rpx;
        width: 100%;
        color: #1a1a1a;
        font-weight: 600;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .amount {
          color: #ee4326;
          font-size: 32rpx;
        }
      }
    }
    .payType {
      margin-top: 32rpx;
      color: #1a1a1a;
      font-size: 28rpx;
      font-weight: bold;
      .payTitle {
        padding-left: 40rpx;
      }
      .payBox {
        width: 718rpx;
        margin: auto;
        margin-top: 16rpx;
        .item {
          width: 718rpx;
          height: 104rpx;
          background: #ffffff;
          border-radius: 24rpx 24rpx 24rpx 24rpx;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24rpx;
          padding: 0 24rpx;
          .leftType {
            display: flex;
            align-items: center;
            img {
              width: 56rpx;
              height: 56rpx;
              margin-right: 24rpx;
            }
          }

          > img {
            width: 40rpx;
            height: 40rpx;
          }
        }

        .select {
          width: 36rpx;
          height: 36rpx;
          background: #eee;
          border-radius: 50%;
          background: url("https://img.shinemang.com/gachaStatic/notSelect.png");
          background-size: 100% 100%;

          &.active {
            background-image: url("https://img.shinemang.com/gachaStatic/select.png") !important;
            background-size: 100% 100% !important;
          }
        }
      }
    }
    .tips {
      color: #8d8d94;
      font-size: 24rpx;
      padding: 0 40rpx;
      margin-bottom: 220rpx;
    }
    .confirmBtn {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 160rpx;
      z-index: 33;
      background: #fff;
      display: flex;
      justify-content: center;
      padding-top: 24rpx;
      > .btn {
        width: 686rpx;
        height: 80rpx;
        background: linear-gradient(90deg, #31e597 0%, #40e0ea 100%);
        border-radius: 40rpx 40rpx 40rpx 40rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32rpx;
        color: #1a1a1a;
        font-weight: bold;
      }
    }
  }
}
</style>
