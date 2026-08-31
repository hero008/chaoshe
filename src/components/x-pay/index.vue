<template>
  <u-popup
    :show="show"
    @close="close"
    :safeAreaInsetBottom="false"
    :closeable="false"
    round="20"
    bgColor="#fff"
  >
    <view class="pay_module">
      <div class="title">
        确认订单 <span v-if="gachaInfo">({{ payNum }}{{showMultiple?'倍':'抽'}})</span>
      </div>
      <div @click="close" class="closeBtn"></div>

      <view v-if="gachaInfo" class="buyProduct">
        <view>
          <image :src="gachaInfo.coverImage" mode="scaleToFill" />
        </view>
        <view>
          <view class="productTitle ellipsis">{{ gachaInfo.themeName }}</view>
          <view class="price">
            <view>
              <view v-if="gachaInfo.discount > 0"
                >￥{{ gachaInfo.discountPrice }}/抽</view
              >
              <view v-else>￥{{ gachaInfo.price }}/抽</view>
              <view v-if="gachaInfo.discount > 0" class="discountPrice"
                >￥{{ item.price }}/抽</view
              >
            </view>
            <view v-if="mtype == 7" class="quantity flex_r flex_jb flex_ac">
              <view class="flex_r flex_ac" v-if="showQuantity">
                <view class="quantity_btn reduce" @click="onChangeQuantity(-1)"
                  ></view
                >
                <input
                  class="quantity_input"
                  type="number"
                  :value="payQuantity"
                  @input="onInputQuantity"
                  @blur="onBlurQuantity"
                />
                <view class="quantity_btn add" @click="onChangeQuantity(1)"></view>
              </view>
              <view class="txt" v-if="showMultiple">x1</view>
            </view>
          </view>
        </view>
      </view>

      <!-- <div class="title">{{ title }}</div>
            <div class="msg flex_r flex_jc flex_ac">
                <img src="https://img.shinemang.com/gachaStatic/static/img/pay/ico.png" class="ico1" />
                <span>请核对支付信息无误后再支付</span>
            </div> -->

      <!-- <div class="pay_money" :class="{ active: mtype == '13' && allDiscount.discount }">
                {{amount }}
            </div> -->
      <!-- 一网打进 -->
      <!-- <view v-if="mtype == '13' && allDiscount.original" class="all_discount">
                {{ allDiscount.original }}元</view> -->
      <div style="margin-bottom: 40rpx" class="pay_info">
        <!-- 
                <view v-if="showMultiple" class="multiple flex_r flex_jb flex_ac">
                    <view class="multiple_list flex_r flex_ac">
                        <view class="multiple_item" :class="{ active: payMultiple == i }"
                            v-for="(i, s) in multipleOptions" :key="s" @click="onSelectMultiple(i)">x{{ i }}</view>
                    </view>
                </view> -->
        <!-- 对对碰普通模式：购买次数加减 -->
        <!-- <view v-if="showQuantity" class="quantity flex_r flex_jb flex_ac">
                    <view class="txt">购买次数</view>
                    <view class="quantity_ctrl flex_r flex_ac">
                        <view class="quantity_btn" :class="{ disabled: payQuantity <= 1 }"
                            @click="onChangeQuantity(-1)"> - </view>
                        <view class="quantity_num">{{ payQuantity }}</view>
                        <view class="quantity_btn" @click="onChangeQuantity(1)">+</view>
                    </view>
                </view> -->

        <!-- 一网打进 -->
        <!-- <view v-if="mtype == '13' && allDiscount.discount" class="subjoin_info flex_r flex_jb flex_ac">
                    <view class="txt">支付优惠：</view>
                    <view class="all_txt">{{ allDiscount.discount }}折扣</view>
                </view> -->
        <!-- amount: goMitigate ? Number(amount) + Number(mitigate) : amount, -->
        <div
          v-if="
            ['1', '2', '3', '4', '5', '7'].includes(mtype) &&
            discount == 0 &&
            payMessage.discount
          "
          class="subjoin_info flex_r flex_jb flex_ac"
          @click="
            goto('/pages/my/cardpack', {
              gacha_id: source_id,
              nums: payNum,
              gacha_type: mtype,
              state: 1,
              amount: oldamount,
              price: unitPrice,
              gacha_theme_id: theme_id,
            })
          "
        >
          <span class="txt">支付优惠：</span>
          <div v-if="!fetchCoupon" class="tickets flex_r flex_ac">
            <span v-if="selectTicket.id" class="ticket_item">{{
              selectTicket.name
            }}</span>
            <span v-else-if="severalPieces" style="color: red" class="no_msg"
              >您有{{ severalPieces }}张优惠券可以使用</span
            >
            <span v-else class="no_msg">暂无优惠券</span>
            <span class="icof" style="color: #8d8d94; font-weight: normal"
              >&#xe72b;</span
            >
          </div>
        </div>

        <!-- 没有折扣,没有优惠券 开启了欧气抵扣,才能使用 -->
        <view
          class="integral flex_r flex_jb"
          v-if="
            offsetInfo.status &&
            oldamount &&
            couponId == 0 &&
            ['1', '2', '3', '4', '5', '7'].includes(mtype) &&
            discount == 0
          "
        >
          <span class="txt">星光积分抵扣</span>
          <view class="integral_r flex_r flex_ac">
            <view class="integral_num"
              >({{
                timesAmount(mitigate, offsetInfo.config[0].offsetAmount)
              }}星光积分)</view
            >
            <view class="integral_nums" v-if="Number(mitigate) > 0.0"
              >-￥{{ mitigate }}</view
            >
            <view
              class="integral_btn"
              :class="{ av: goMitigate }"
              @click="onGoMitigate"
            >
              <view></view>
            </view>
          </view>
        </view>

        <view
          class="integral flex_r flex_jb"
          v-if="
            userInfo.xCoin &&
            oldamount &&
            couponId == 0 &&
            ['1', '2', '3', '4', '5', '7'].includes(mtype) &&
            discount == 0
          "
        >
          <span class="txt">星币抵扣</span>
          <view class="integral_r flex_r flex_ac">
            <view class="integral_num" v-if="xCoinDisountPrice"
              >({{ xCoinDisountPrice.consume }}星币)</view
            >
            <view class="integral_nums" v-if="xCoinDisountPrice"
              >-￥{{ xCoinDisountPrice.discount }}</view
            >
            <view
              class="integral_btn"
              :class="{ av: goXcoin }"
              @click="onGoXcoin"
            >
              <view></view>
            </view>
          </view>
        </view>
        <!-- 惊趣赏 满足条件赠送/ last赏最后一抽赠送/ lucky赏参与抽赏玩家随机赠送  -->
        <!-- #ifndef MP-WEIXIN -->
        <view class="pays payHw" v-if="probabilityShow.length">
          <view class="paysTips">
            ·开箱说明：盲盒商品存在概率性，请谨慎消费<br />
            ·发货邮费：<br />
            部分商品享受包邮偏远地区除外，支持充值余额退款<br />
            ·开箱概率：<br />
            <view
              class="flex_r flex_ac"
              v-for="item in probabilityShow"
              :key="item.levelName"
            >
              {{
                item.levelName +
                " : " +
                (typeof item.text == "string" ? item.text : item.text + "%")
              }}
            </view>
          </view>
        </view>
        <view class="pay_multiple" v-if="showMultiple">
          <view>选择倍数</view>
          <view class="pay_list flex_r flex_ac">
            <view
              class="multiple_item"
              :class="{ active: payMultiple == i }"
              v-for="(i, s) in multipleOptions"
              :key="s"
              @click="onSelectMultiple(i)"
              >x{{ i }}</view
            >
          </view>
        </view>
        <!-- #endif -->
        <div class="pays" v-if="pays.length">
          <!--    1一番赏、 2扭蛋 、3潮玩、 4洞乐、 5芒星赏、 6集市参与交易 发布 、11是潮币、 12发货转盘  13是一网打尽 -->
          <div
            class="pay_item flex_r flex_jb flex_ac"
            @click="onPaytype(i)"
            v-for="(i, s) in pays"
            :key="s"
            v-show="i.show"
          >
            <div class="pay_name flex_r flex_ac">
              <img :src="payIco(i.img)" class="pay_ico" />
              <span>{{
                [0, 4].includes(i.type)
                  ? i.name + "（" + i.number + "）"
                  : i.name
              }}</span>
              <img
                v-if="
                  (mtype !== '6' && i.type == 4) ||
                  (mtype == '6' && i.type == 0 && userInfo.allowCoinBet)
                "
                src="https://img.shinemang.com/gachaStatic/static/img/pay/ico2.png"
                class="ico2"
              />
            </div>
            <div class="reduce_pay flex_r flex_je">
              <!-- <div class="reduce"
                                v-if="['1', '2', '3', '4', '5'].includes(mtype) && subtract && i.randomShow">随机立减</div> -->
              <view class="consume" v-if="i.type && i.consume"
                >支付￥{{ i.consume }}</view
              >
              <!-- 默认金币 -->
              <div
                class="select"
                :class="{
                  active: paytypeList.includes(i.type),
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <!-- '3', -->
      <div
        class="appoint flex_r flex_ac"
        @click="onAnimationChange"
        v-if="['1', '2', '4', '5'].includes(mtype)"
      >
        <div class="select" :class="{ active: showAnimation }"></div>
        <div>跳过抽赏动画（内存较小的机型建议勾选）</div>
      </div>
      <div class="appoint flex_r flex_ac" @click="onAgreeChange">
        <div class="select" :class="{ active: showAgree }"></div>
        <div class="selectBox">
          <span class="red">本产品仅面向成年用户，</span>
          <span class="red">未成年人请勿下单，</span>
          <span>已阅读并同意</span>
          <span
            class="cory"
            @click.stop="
              goto('/pages/common/rulepop', {
                val: 'UserAgreement',
              })
            "
            >《用户协议》</span
          >
          <span>及</span>
          <span
            class="cory"
            @click.stop="
              goto('/pages/common/rulepop', {
                val: 'ExplanationOfConsumerRightsProtectionMeasures',
              })
            "
            >《消费者权益保障措施说明》</span
          >
        </div>
      </div>
      <view v-if="couponId !== '0'">
        <!-- <div class="btn" v-if="selectTicket.type" @click="$u.debounce(onPay, 1000)">支付</div> -->
        <div
          class="btn"
          v-if="selectTicket.type"
          @click="$noMultipleClicks(onPay)"
        >
          确认信息并支付
        </div>
        <div v-else class="btn disabled" @click="onHint">确认信息并支付</div>
      </view>
      <!-- <div class="btn" v-else @click="$u.debounce(onPay, 1000)">支付</div> -->
      <div class="btn" v-else @click="$noMultipleClicks(onPay)">
        确认信息并支付 ￥{{ amount }}
      </div>
    </view>
    <mp-privacy
      title="授权手机号"
      ref="mpPrivacy"
      type="2"
      @authChange="authChange"
    />

    <u-modal
      :closeOnClickOverlay="true"
      @close="showToRecharge = false"
      :show="showToRecharge"
      @confirm="confirmToRecharge"
      title="金币不足"
      content="快去充值吧"
    ></u-modal>
  </u-popup>
</template>
<script>
let that;
import { post } from "@/utils/api.js";
import { integralPrice } from "@/utils/getData.js";
import { mapState, mapMutations, mapActions } from "vuex";
import mpPrivacy from "@/components/modules/mp-privacy.vue";
import { callPayment } from "@/utils/pay.js";
import { isIos } from "../../utils/mgtv";
import { goto } from "../../utils/fun";
import { Parser, Player } from 'svgaplayer-weapp'
//     GachaType_Nil = 0;
//     GachaType_Kuji = 1;         // 一番赏
//     GachaType_Gashapon = 2;     // 彩蛋机
//     GachaType_ChaoPlay = 3;     // 潮玩赏
//     GachaType_SurpriseBox = 4;  // 洞洞乐
//     GachaType_ChaoShe = 5;      // 芒星赏
//     GachaType_ShareBill = 6;    // 一网打尽

// payType
//    OpenGachaPayType_Nil = 0;
//         OpenGachaPayType_Coin = 1;          // 潮币
//         OpenGachaPayType_PostCard = 2;      // 明信片
//         OpenGachaPayType_Gold = 3;          // 金币
export default {
  name: "x-pay",
  props: {
    title: {
      type: String,
      default: "选择支付方式",
    },
    mtype: {
      type: String, // 1一番赏 2扭蛋机 3潮游赏 4洞洞乐 （调起支付）5 芒星赏  //游戏方式  13是一网打尽
      default: "",
    },
    probabilityShow: {
      type: Array, // 1一番赏 2扭蛋机 3潮游赏 4洞洞乐 （调起支付）5 芒星赏  "7" 对对碰
      default: [],
    },
    isMultiple: {
      type: Boolean, // 对对碰疯狂模式（倍速多次支付），仅 mtype 7 生效
      default: false,
    },
    maxNum: {
      type: Number, // 购买次数上限，0 表示不限制（普通模式数量加减时生效）
      default: 0,
    },
  },
  components: { mpPrivacy },
  data() {
    return {
      gachaInfo: "",

      xCoinDisountPrice: null,
      XCoin: 0,
      showToRecharge: false,
      show: false, // 显示组件
      amount: 0, // 支付总额
      oldamount: 0, //未优惠的初始价格
      payNum: 0, // 数量（抽赏次数）
      source_type: 0, // 充值类型（用户在什么地方支付：玩法、集市、快递...）
      device_id: "", // 设备id
      source_id: 0, // GachaID, MarketOrder, MarketOffer, 0（钱包）
      pays: [
        // #ifdef MP-WEIXIN
        // {
        //     name: "微信支付",
        //     type: 3,
        //     img: "WeChat",
        //     show: true,
        //     msg: "微信小程序支付",
        // },
        // #endif
        // #ifndef MP-WEIXIN
        // {
        //     name: "微信支付",
        //     type: 2,
        //     img: "WeChat",
        //     show: false,
        //     msg: "微信APP支付",
        // },  // 是否金币和潮币支付
        {
          name: "余额",
          type: 0,
          img: "chao",
          show: false,
          msg: "余额支付",
          randomShow: false,
          consume: 0,
          // number: this.$gl("userInfo").coin,
          number: 0,
          payType: 1,
        },
        // {
        //     name: "金币余额",
        //     type: 4,
        //     img: "gold",
        //     show: true,
        //     msg: "金币支付",
        //     randomShow: false,
        //     consume: 0,
        //     // number: this.$gl("userInfo").gold,
        //     number: 0,
        //     payType: 3,
        // },
        {
          name: "芒果支付",
          type: 1,
          img: "xjzf",
          show: true,
          msg: "芒果支付",
          randomShow: true,
          consume: 0,
          payType: 0,
        },
        // #endif
      ],
      payss: [
        // #ifdef MP-WEIXIN
        // {
        //     name: "微信支付",
        //     type: 3,
        //     img: "WeChat",
        //     show: true,
        //     msg: "微信小程序支付",
        //     randomShow: false,
        // },
        // #endif
        // #ifndef MP-WEIXIN

        {
          name: "支付宝11",
          type: 1,
          img: "xjzf",
          show: true,
          msg: "支付宝APP支付",
          randomShow: true,
        },
        // #endif
      ],
      // #ifndef MP-WEIXIN
      paytypeList: [1],
      paytype: 0, // 0潮币 1支付宝 2微信 3微信小程序
      // #endif
      // // #ifdef MP-WEIXIN
      // paytypeList: [3],
      // paytype: 3, // 0潮币 1支付宝 2微信 3微信小程序
      // #endif
      providers: [],
      showAgree: false, //是否选择协议
      showAnimation: false, //是否跳过动画
      severalPieces: 0,
      couponId: 0, //福利券
      welfareCoupon: false,
      integralAll: 0,
      mitigate: 0,
      goMitigate: null,
      goXcoin: null,
      box_index: 0,
      goldNumber: 0,
      residue: 0,
      type_Coin: 1,
      allDiscount: {
        discount: 0,
        original: 0,
      },
      noClick: true, //防抖挂载
      noClickTime: 3000, //防抖挂载
      discount: 0,
      unitPrice: 0,
      theme_id: "",

      multipleOptions: [2,3, 5, 10], // 可选的一次性购买倍数
      payMultiple: 1, // 当前选中的购买倍数
      payQuantity: 1, // 普通模式下的购买次数
      baseAmount: 0, // 单份支付总额（未乘倍数/数量）
      baseNum: 0, // 单份购买次数（未乘倍数/数量）
      fetchCoupon: false,
    };
  },

  computed: {
    ...mapState([
      "userInfo",
      "selectTicket",
      "offsetInfo",
      "payMessage",
      "subtract",
    ]),
    showMultiple() {
      return this.mtype == "7" && this.isMultiple;
    },
    // 对对碰普通模式展示购买次数加减
    showQuantity() {
      return this.mtype == "7" && !this.isMultiple;
    },
    // 当前生效的换算系数：疯狂模式取倍数，普通模式取购买次数
    payFactor() {
      if (this.showMultiple) return this.payMultiple;
      if (this.showQuantity) return this.payQuantity;
      return 1;
    },
    // 当前倍数/数量下未优惠的应付总额，作为优惠重算的基数（不改动 oldamount）
    originalAmount() {
      return Number(this.$h.Mul(this.baseAmount, this.payFactor).toFixed(2));
    },
  },
  created() {

    // console.log(this.userInfo);
    that = this;
    this.UpselectTicket({});
    this.showAnimation = this.$gl("IsAnimation") || false;
    this.showAgree = this.$gl("IsAgree") || false;
  },
  methods: {
    confirmToRecharge() {
      goto("/page-a/balance/topUp");
    },
    ...mapMutations(["UpselectTicket", "UppayMessage"]),
    ...mapActions(["asyncUpBalance","asyncUpOffsetInfo"]),
    onAnimationChange() {
      this.showAnimation = !this.showAnimation;
      this.$sl("IsAnimation", this.showAnimation);
    },
    onAgreeChange() {
      this.showAgree = !this.showAgree;
      this.$sl("IsAgree", this.showAgree);
      post("v1/system/user-click", {
        event: "confirmProtocol:" + (this.showAgree ? "isAgree" : "disAgree"),
      }).then((res) => {
        console.log(res);
      });
    },
    async open(
      amount,
      num,
      source_type,
      source_id,
      couponId,
      box_index,
      original = 0,
      discount = 0,
      theme_id,
      gachaInfo = "",
    ) {
      // #ifndef MP-WEIXIN 微信小程序需要
      // 0潮币 1支付宝 2微信 3微信小程序 推荐使用this.mtype !== "12"
      // if (this.userInfo.allowCoinBet && !["12", "13"].includes(this.mtype)) this.paytype;
      // else this.paytype = this.mtype !== "6" ? 1 : 0;
      // #endif  微信小程序需要
      this.asyncUpOffsetInfo()
      this.gachaInfo = gachaInfo;

      // if (!this.userInfo.id) {
      //   this.goto("/pages/login/login");
      //   return;
      // }
      this.preloadAnimation()
      this.goldNumber = this.userInfo.gold; // 金币
      this.goMitigate = false;
      this.goXcoin = false;
      this.amount = amount; // 传过来的金额
      this.oldamount = amount; // 传过来的金额
      this.payNum = num; // 数量

      this.baseAmount = amount;
      this.baseNum = num;
      this.payMultiple = this.showMultiple ? this.multipleOptions[0] : 1;
      this.payQuantity = 1;
      this.applyPayFactor();

      this.source_type = source_type;
      this.source_id = source_id;
      this.couponId = couponId; // 优惠券id
      this.show = true;
      this.box_index = box_index; // 传过来的
      this.theme_id = theme_id; //
      if (this.mtype == "13")
        this.allDiscount = {
          discount: discount || 0,
          original: original,
        }; // 一网打尽
      else this.discount = discount;
      this.pays.forEach((user) => {
        user.consume = 0;
        // if(isIos() && user.type == 1){
        //     user.show =false
        // }
        // 是否容许潮币抽
        if (this.mtype !== "12" && this.userInfo.allowCoinBet && !user.type)
          user.show = true; // 显示潮币支付
        if (user.type == 4 && this.mtype !== "6") user.show = true; //显示金币支付
        if (user.type == 4) user.number = this.userInfo.gold; // 赋值金币
        if (user.type == 0) user.number = this.userInfo.coin; //赋值潮币
      });
      // 游客 绑定邮箱
      if (this.userInfo.isGuest) {
        // #ifdef MP-WEIXIN
        // this.$refs.mpPrivacy.open();
        // #endif
        // #ifndef MP-WEIXIN  可以不用
        // this.goto("/pages/login/binding");
        // #endif
      } else {
        this.asyncUpBalance(); //获取金币
        if (["1", "2", "3", "4", "5", "7"].includes(this.mtype)) {
          if (!discount && this.payMessage.discount) {
            // 获取汇率
            this.unitPrice = this.$h.Div(amount, num).toFixed(2);
          }
          // 获取欧气值
          this.integralAll = await integralPrice(); //获取欧气值-
          // 活血
          this.getBalance(); // 查优惠
          this.getDiscounts(); //查看欧气值优惠金额
        }
      }
      if (this.mtype == "6" && this.userInfo.allowCoinBet) {
        // 可以潮币支付,默认潮币支付
        this.paytypeList = [0];
      } else if (this.mtype == "6" && !this.userInfo.allowCoinBet) {
        this.paytypeList = [1]; //集市不让潮币支付,默认支付宝
      } else {
        // #ifndef MP-WEIXIN
        this.paytypeList = [1];
        // #endif
      }
    },

    applyPayFactor() {
      this.payNum = this.$h.Mul(this.baseNum, this.payFactor);
      this.amount = this.originalAmount;
      console.log(this.amount);
    },
    /** 倍数/数量变化后：重算金额，并重置重新查询依赖金额与次数的优惠信息 */
    refreshPayAmount() {
      this.applyPayFactor();
      this.goMitigate = false;
      this.mitigate = 0;
      this.pays.forEach((i) => (i.consume = 0));
      this.UpselectTicket({});
      this.getBalance();
      this.getDiscounts();
    },
    /** 切换购买倍数：重算总价与次数，并重新获取优惠信息 */
    onSelectMultiple(multiple) {
      // if (!this.showMultiple || this.payMultiple == multiple) return;
      this.payMultiple = multiple;
      this.refreshPayAmount();
    },
    /** 普通模式增减购买次数：最少 1 次，maxNum 大于 0 时不可超过上限 */
    onChangeQuantity(step) {
      if (!this.showQuantity) return;
      const next = this.payQuantity + step;
      if (next < 1) return;

      if (this.maxNum > 0 && next > this.maxNum) {
        uni.$u.toast(`最多可购买${this.maxNum}次`);
        return;
      }
      this.payQuantity = next;
      this.refreshPayAmount();
    },

    /** 普通模式输入框修改购买次数：仅保留正整数，实时校验上限并重算金额 */
    onInputQuantity(e) {
      if (!this.showQuantity) return;
      // 仅允许正整数
      let val = String(e.detail.value).replace(/[^\d]/g, "");
      if (this.maxNum > 0 && Number(val) > this.maxNum) {
        val = String(this.maxNum);
        uni.$u.toast(`最多可购买${this.maxNum}次`);
      }
      // 编辑过程中允许临时为空，待失焦时补齐

        this.payQuantity = val === "" ? 1 : (val);
      if (val !== "" && Number(val) >= 1) this.refreshPayAmount();
    },
    /** 普通模式输入框失焦：兜底校验，空值或小于 1 时归为 1 */
    onBlurQuantity(e) {
      if (!this.showQuantity) return;
      let num = Number(String(e.detail.value).replace(/[^\d]/g, ""));
      if (!num || num < 1) num = 1;
      if (this.maxNum > 0 && num > this.maxNum) num = this.maxNum;
      const changed = this.payQuantity !== num;
      this.payQuantity = num;
      if (changed) this.refreshPayAmount();
    },
    authChange(bo) {
      if (bo) this.getBalance();
      else this.close();
    },
    close() {
      this.show = false;
      this.UpselectTicket({});
      this.xCoinDisountPrice = null;
      this.goXcoin = false;
      this.UppayMessage({ url: "", message: {}, discount: true });
      this.pays.forEach((i) => (i.consume = 0));
    },
    // 获取优惠券
    async getBalance() {
      // 赏品详情
      // if (this.source_id > 0) {
      //     let gres = await post("v1/gacha/detail", { gacha_id: this.source_id });
      //     if (!gres.code) {
      //         this.gachaInfo = {
      //             ...gres.gacha,
      //             ...gres.gachaBox,
      //             ...gres.specialDiscountCount,
      //         };
      //     }
      // }
      // 获取优惠券
      if (
        ["1", "2", "3", "4", "5", "7"].includes(this.mtype) &&
        this.discount == 0 &&
        this.payMessage.discount
      ) {
        this.fetchCoupon = true;
        let a = await post("v1/coupon/list", {
          state: 1,
          ...{
            gacha_id: this.source_id,
            gacha_type: Number(this.mtype),
            nums: this.payNum,
            page: 1,
            page_size: 30,
            state: 1,
            amount: this.amount,
            price: this.unitPrice,
            gacha_theme_id: this.theme_id,
          },
        });
        this.severalPieces = a.tableData.length;
        if (a.tableData.length > 0) {
          this.UpselectTicket(a.tableData[0].id ? a.tableData[0] : {});
        }
        this.fetchCoupon = false;
      }
      // 欧气值抵扣
      if (this.amount && this.offsetInfo.status) {
        this.mitigate = 0;
        // 最大抵扣500                    最多抵扣10
        const { offsetAmount, offsetMax } = this.offsetInfo.config[0];
        let pc =
          this.integralAll.point / Number(offsetAmount) >
          this.amount * (offsetMax / 100)
            ? this.amount * (offsetMax / 100)
            : this.integralAll.point / Number(offsetAmount);
        this.mitigate =
          pc > 1 ? Math.floor(pc) : (Math.floor(pc * 10) / 10).toFixed(1);
      }
    },

    preloadAnimation(){
       if(this.mtype == 3){
         let preloadWsxTime = uni.getStorageSync('preloadWsxTime');
         let now = new Date().getTime();
         if(!preloadWsxTime || (now - preloadWsxTime) > 1296000000 ){
              new Parser().load('https://img.shinemang.com/gachaStatic/svga/wxs_b.svga')
              new Parser().load('https://img.shinemang.com/gachaStatic/svga/wxs_s.svga')
              uni.setStorageSync('preloadWsxTime',now)
          }
      }
      if(this.mtype == 4){
         let preloadDdlTime = uni.getStorageSync('preloadDdlTime');
         let now = new Date().getTime();
          if(!preloadDdlTime || (now - preloadDdlTime) > 1296000000 ){
              new Parser().load('https://img.shinemang.com/gachaStatic/svga/ddl.svga')
              new Parser().load('https://img.shinemang.com/gachaStatic/svga/bomb.svga')
              uni.setStorageSync('preloadDdlTime',now)
          }
      }
      if(this.mtype == 2){
         let preloadNdjTime = uni.getStorageSync('preloadNdjTime');
         let now = new Date().getTime();
          if(!preloadNdjTime || (now - preloadNdjTime) > 1296000000 ){
              new Parser().load('https://img.shinemang.com/gachaStatic/svga/ndj_big.svga')
              new Parser().load('https://img.shinemang.com/gachaStatic/svga/ndj_small.svga')
              uni.setStorageSync('preloadNdjTime',now)
          }
      }
    },

    async onPay() {

     

      // 是否支付宝支付1 其它支付0
      // #小程序不需要ifndef MP-WEIXIN
      this.paytype = this.paytypeList.includes(1) ? 1 : 0;
      // #endif
      // #ifdef MP-WEIXIN
      // this.paytype = 1;
      // #endif
      // 金币支付3 潮币支付1 支付宝支付3 支付宝金币合并支付3
      this.type_Coin = this.paytypeList.includes(0) ? 1 : 3;
      let goldNum = 0; // 金币勾选
      let allNum = 0; // 支付宝勾选
      this.pays.map((i) => {
        if (i.type == 4) goldNum = i.consume;
        if (i.type == 1) {
          //折扣后的金额加上欧气
          if (i.consume)
            allNum = this.goMitigate
              ? this.floatingPoint(i.consume, "+", this.mitigate)
              : i.consume;
          else
            allNum = this.goMitigate
              ? this.floatingPoint(this.amount, "+", this.mitigate)
              : this.amount;

          if (this.goXcoin) {
            allNum = this.floatingPoint(
              allNum,
              "+",
              this.xCoinDisountPrice ? this.xCoinDisountPrice.consume : 0,
            );
          }
        }
      });
      this.selectTicket.type == "COUPON_TYPE_FREE"
        ? (this.amount = 0)
        : this.amount;
      if (!this.showAgree) {
        uni.$u.toast("请先阅读并同意相关协议！");
        return;
      }
      if (
        this.paytype === 0 &&
        this.amount > this.userInfo.coin &&
        this.paytypeList.includes(0)
      ) {
        uni.$u.toast("余额不足！");
        return;
      }
      if (
        this.paytypeList.includes(4) &&
        this.paytypeList.length < 2 &&
        this.goldNumber < this.amount
      ) {
        // if(isIos()){
        //     // uni.$u.toast("金币不足");
        //     // this.showToRecharge = true
        // }else{
        uni.$u.toast("金币不足，可与现金支付组合付款！");
        // }

        return;
      } else {
        // this.amount  == 0   免费抽
        let res, orderInfo;
        let click_type = this.amount == 0 ? 0 : this.paytype;
        // 潮币单独支付 潮币和欧气值支付
        // 金币单独支付  金币和欧气值支付 金币和支付宝支付 金币和欧气值和支付宝支付
        // 支付宝支付 支付宝和金币支付 支付宝和金币和欧气值支付
        // 开启欧气值总金额

        //                 enum PayType {
        //     OpenGachaPayType_Nil = 0;
        //     OpenGachaPayType_Coin = 1;          // 潮币
        //     OpenGachaPayType_PostCard = 2;      // 明信片
        //     OpenGachaPayType_Gold = 3;          // 金币
        // }

        //UppayMessage 只是存储值
        if (this.payMessage.url == "v1/gacha/open") {
          this.UppayMessage({
            url: "v1/gacha/open",
            message: {
              pay_type: this.type_Coin,
              gacha_id: this.source_id,
              box_index: this.box_index,
              nums: this.payNum,
              take_all: this.payNum > 0 ? 0 : 1,
              user_coupon_id: this.selectTicket.id,
              is_offset: this.goMitigate ? 1 : 0, // 欧气值抵扣
              offset_money: this.goMitigate ? this.mitigate : 0, // 欧气值抵扣
              x_coin_discount: this.xCoinDisountPrice
                ? this.xCoinDisountPrice.consume
                : 0,
              ...(this.mtype == "7" && this.isMultiple
                ? { is_multiple: true }
                : {}),
            },
          });
        }
        if (this.payMessage.url == "ddl") {
          this.UppayMessage({
            url: "ddl",
            message: {
              ...this.payMessage.message,
              pay_type: this.type_Coin,
              user_coupon_id: this.selectTicket.id,
              is_offset: this.goMitigate ? 1 : 0,
              offset_money: this.goMitigate ? this.mitigate : 0,
              x_coin_discount: this.xCoinDisountPrice
                ? this.xCoinDisountPrice.consume
                : 0,
            },
          });
        }

        // 这里支付
        if (click_type == 0) {
          // 直接开箱,有免费优惠卷
          res = await callPayment(
            this.payMessage.url == "ddl"
              ? "v1/gacha/open"
              : this.payMessage.url,
            this.payMessage.message,
            click_type,
          );

          // 这里直接开箱,没问题. 过去出动画
          this.$emit("success", res, this.showAnimation, click_type);
          this.close();
        } else {
          //还是要调用支付
          let that = this;
          res = await callPayment(
            this.payMessage.url == "ddl"
              ? "v1/gacha/open"
              : this.payMessage.url,
            {
              ...this.payMessage.message,
              create_payment_request: {
                platform_id: 6,
                amount:
                  (this.paytypeList.includes(3) ? this.amount : allNum) + "",
                device_id: this.device_id,
                source_type: this.source_type,
                source_id: this.source_id,
                balance_amount: goldNum, //金币支付的金额
                x_coin_discount: this.xCoinDisountPrice
                  ? this.xCoinDisountPrice.consume
                  : 0,
              },
            },
            click_type,
          );
          orderInfo = res.orderInfo;
          // 在这里应该拿到 url.
          // 这里需要调支付,有问题.
          console.log(
            res.res.createPaymentReply.signData,
            res.res.createPaymentReply.sign,
            Number(res.res.createPaymentReply.timestamp),
          );
          if (window.mgtv) {
            mgtv.requestPaymentGameItem({
              signData: res.res.createPaymentReply.signData,
              sign: res.res.createPaymentReply.sign,
              timestamp: Number(res.res.createPaymentReply.timestamp),
              success: (eq) => {
                // console.log(res,'成功')
                that.$emit("success", res, that.showAnimation, click_type);
                that.close();
              },
              fail: (err) => {
                that.close();
              },
            });
          }
          // uni.requestPayment({
          //     provider: this.paytypeList.includes(3) ? "wxpay" : "alipay",
          //     // #ifndef MP-WEIXIN
          //     orderInfo,
          //     // #endif
          //     // #ifdef MP-WEIXIN
          //     ...orderInfo,
          //     // #endif
          //     success: function (res1) {
          //         that.$emit( "success", res,  that.showAnimation, click_type );
          //         that.close();
          //     },
          //     fail: function (err) {
          //         if (err.errCode == -8) uni.$u.toast("客户端未安装");
          //         if (err.errCode == -100)
          //             uni.$u.toast("您中途取消了支付");
          //         if (err.errMsg == "requestPayment:fail cancel")
          //             uni.$u.toast("您中途取消了支付");
          //         that.fail();
          //     },
          // });
        }
      }
    },
    succ() {
      let id = this.selectTicket.id;
      this.$emit("success", this.payNum, this.showAnimation, id, "", 0, "");
      this.close(); // 关闭支付会清空selectTicket
    },
    fail() {
      this.close();
      this.$emit("fail");
    },
    payIco(va) {
      return `https://img.shinemang.com/gachaStatic/static/img/pay/${va}.png`;
    },
    onHint() {
      if (this.severalPieces !== 0) {
        uni.$u.toast("请选择优惠券!~");
        return;
      } else {
        uni.$u.toast("您暂无优惠券!~");
        return;
      }
    },

    getUserSelectDiscount() {
      const ticketPrice = this.selectTicket
        ? this.selectTicket.discountPrice
        : 0;
    },
    xCoinBanlance() {
      const ticketPrice = this.selectTicket.id
        ? this.selectTicket.discountPrice
        : 0;
      const discountPrice = this.addAmount(
        ticketPrice,
        this.goMitigate ? this.mitigate : 0,
      );
      const amount = this.subAmount(this.originalAmount, discountPrice);

      post("v1/wallet/x-coin-discount/evaluate", {
        source_type: 100,
        source_id: this.source_id,
        amount: amount,
        discount: 0,
      }).then((res) => {
        this.xCoinDisountPrice = res;
        this.amount = res.discountedAmount;
      });
    },

    onGoXcoin() {
      if (!this.goXcoin) {
        if (this.amount == 0) {
          uni.$u.toast("金额为0,不用抵扣了");
          return;
        }
      }

      this.goXcoin = !this.goXcoin;
      if (this.goXcoin) {
        this.xCoinBanlance();
      } else {
        this.xCoinDisountPrice = null;
        this.amount = this.selectTicket.id
          ? this.subAmount(this.originalAmount, this.selectTicket.discountPrice)
          : this.originalAmount;
        this.getDiscounts();
      }
    },
    onGoMitigate() {
      // if(!this.goMitigate){
      //     if(this.amount == 0){
      //         uni.$u.toast("金额为0,不用抵扣了");
      //         return;
      //     }
      // }

      if (Number(this.mitigate) < 0.1) {
        if (
          Number(this.integralAll.point) <
          Number(this.offsetInfo.config[0].offsetAmount)
        ) {
          uni.$u.toast("星光积分不足，暂时无法抵扣！");
          return;
        }
        uni.$u.toast("不参与星光积分活动！");
        return;
      }
      this.goMitigate = !this.goMitigate;
      if (this.goXcoin) {
        this.xCoinBanlance();
        return;
      }
      this.amount = this.goMitigate
        ? this.floatingPoint(this.amount, "-", this.mitigate)
        : this.floatingPoint(this.amount, "+", this.mitigate);
      this.onGoldPay();
    },
    async getDiscounts(type = false) {
      if (
        this.amount &&
        ["1", "2", "3", "4", "5", "7"].includes(this.mtype) &&
        Object.keys(this.offsetInfo).length
      ) {
        const { offsetAmount, offsetMax } = this.offsetInfo.config[0];
        let pc =
          this.integralAll.point / offsetAmount >
          this.amount * (offsetMax / 100)
            ? this.amount * (offsetMax / 100)
            : this.integralAll.point / offsetAmount;
        this.mitigate =
          pc > 1 ? Math.floor(pc) : (Math.floor(pc * 10) / 10).toFixed(1);
        if (this.goMitigate)
          this.amount = this.floatingPoint(this.amount, "-", this.mitigate); // 减去欧气值
      } else {
        this.goMitigate = false;
        this.mitigate = 0;
        this.pays.forEach((i) => (i.consume = 0));
      }
      if (type) {
        this.xCoinBanlance();
      }
      this.onGoldPay();
    },
    onPaytype(item) {
      // 0的时候只能选0
      // 一个的时候 不能取消选中当前的那个
      // 选中两个的时候 可以取消一个
      // 当金币足够的时候 单选
      // 金币不够的时候可以选两个paytype
      if (this.goldNumber >= this.amount || !item.type || !this.goldNumber) {
        this.paytypeList = [item.type];
        this.pays.forEach((i) => (i.consume = 0));
        return;
      } else if (item.type) {
        // 必须选中一个不能取消
        if (
          this.paytypeList.length == 1 &&
          this.paytypeList.includes(item.type)
        )
          return;
        // 潮币不参与组合支付
        if (this.paytypeList.includes(0) && item.type) this.paytypeList = [];
        // 已选中就取消
        if (this.paytypeList.includes(item.type)) {
          this.paytypeList = this.paytypeList.filter((x) => x !== item.type);
          item.consume = 0;
        } else {
          // 未选中就取消
          this.paytypeList = [...this.paytypeList, item.type];
        }

        this.pays.forEach((user) => {
          if (user.type == 4 && this.paytypeList.includes(4))
            user.consume = this.goldNumber;
          if (
            user.type == 1 &&
            this.paytypeList.includes(1) &&
            this.paytypeList.length > 1
          )
            user.consume = this.floatingPoint(
              this.amount,
              "-",
              this.goldNumber,
            );
        });
        // 仅选中支付宝就删除支付金额显示
        if (this.paytypeList.includes(1) && this.paytypeList.length == 1)
          this.pays.forEach((i) => (i.consume = 0));
      }
    },
    onGoldPay() {
      if (!this.paytypeList.includes(0)) {
        let index1 = 0; //金币
        let index2 = 0; //支付宝
        this.pays.map((i, j) => {
          if (i.type == 4) index1 = j;
          if (i.type == 1) index2 = j;
        });
        let num = this.floatingPoint(
          this.amount,
          "-",
          this.pays[index1].number,
        );
        if (num > 0) {
          if (this.paytypeList.includes(4)) {
            this.pays[index1].consume = this.pays[index1].number;
          }
          if (this.paytypeList.includes(1) && this.paytypeList.length > 1) {
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
  watch: {
    "selectTicket.discountPrice": {
      immediate: true,
      deep: true,
      handler(va) {
        va = va || 0;
        let a = this.$h.Sub(this.originalAmount, va);

        if (this.goXcoin) {
          this.amount = a > 0 ? a : 0;
          this.amount =
            this.selectTicket.type == "COUPON_TYPE_FREE" ? 0 : this.amount;
          this.getDiscounts(true);
        } else {
          this.amount = a > 0 ? a : 0;
          this.amount =
            this.selectTicket.type == "COUPON_TYPE_FREE" ? 0 : this.amount;
          this.getDiscounts();
        }
      },
    },
    "$store.state.userInfo.gold": {
      handler(newVal) {
        this.goldNumber = newVal;
        this.pays.forEach((user) => {
          if (user.type == 4) {
            user.number = newVal; // 直接修改原对象
          }
        });
      },
    },
    "$store.state.userInfo.coin": {
      handler(newVal) {
        this.pays.forEach((user) => {
          if (user.type == 0) {
            user.number = newVal; // 直接修改原对象
          }
        });
      },
    },
    "$store.state.userInfo.xCoin": {
      handler(newVal) {
        this.XCoin = newVal;
      },
    },
  },
};
</script>
<style lang="scss">
.pay_module_box {
  width: 100vw;
  height: 100vh;
}

.pay_module {
  // height: 1060rpx;
  padding: 0 32rpx 180rpx;
  position: relative;
  .closeBtn {
    width: 56rpx;
    height: 56rpx;
    position: absolute;
    right: 32rpx;
    top: 32rpx;
    background: url("@/static/close.png");
    background-size: 100% 100%;
  }
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
    z-index: 2;
    // position: static;
  }
}

.title {
  padding: 48rpx 0 32rpx;
  text-align: center;
  font-size: 36rpx;
  font-weight: 500;
  color: #1a1a1a;
  z-index: 2;
  position: relative;
}
.buyProduct {
  padding: 32rpx 0;
  width: 100%;
  display: flex;
  align-items: center;
  image {
    width: 160rpx;
    height: 160rpx;
    border-radius: 16rpx;
    margin-right: 24rpx;
  }

  .productTitle {
    color: #1a1a1a;
    font-size: 32rpx;
    font-weight: bold;
    max-width: 450rpx;
    margin-bottom: 16rpx;
  }

  .price {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #000000;
    font-size: 32rpx;
    width: 500rpx;
    font-weight: bold;
    .info {
      display: flex;
      align-items: center;
    }
    .discountPrice {
      color: #8d8d94;
      font-weight: normal;
      text-decoration: line-through;
      margin-left: 8rpx;
      font-size: 28rpx;
    }
  }
}

.msg {
  font-size: 24rpx;
  color: #818181;
  font-weight: 500;

  .ico1 {
    width: 40rpx;
    height: 40rpx;
    margin-right: 16rpx;
  }
}

.pay_money {
  font-size: 68rpx;
  font-weight: 800;
  text-align: center;
  margin: 10rpx 0 30rpx;
  // margin-top: 50rpx;

  &.active {
    margin-bottom: 0;
  }

  &::after {
    content: "元";
    font-size: 28rpx;
    font-weight: 500;
    margin-left: 6rpx;
  }
}

.all_discount {
  text-align: center;
  text-decoration: line-through;
  font-weight: 500;
  font-size: 32rpx;
  color: #818181;
}

.subjoin_info {
  font-weight: bold;
  font-size: 28rpx;
  margin-bottom: 32rpx;
  color: #1a1a1a;
  height: 42rpx;

  .no_msg {
    color: #8d8d94;
    font-size: 28rpx;
    font-weight: normal;
  }

  .all_txt {
    font-weight: 500;
    font-size: 28rpx;
    color: #ff6a16;
  }

  .tickets {
    .ticket_item {
      color: #f65c36;
    }

    .icof {
      margin-left: 16rpx;
      font-size: 38rpx;
    }
  }
}
.multiple {
  font-weight: 500;
  font-size: 32rpx;
  margin-bottom: 20rpx;
  color: #818181;

  .multiple_item {
    min-width: 96rpx;
    height: 56rpx;
    line-height: 56rpx;
    text-align: center;
    padding: 0 16rpx;
    margin-left: 16rpx;
    font-size: 28rpx;
    color: #615e74;
    background: #fff;
    border-radius: 28rpx;
    border: 2rpx solid #e5e5e5;

    &.active {
      color: #fff;
      background: #715cdd;
      border-color: #715cdd;
    }
  }
}

.quantity {
  font-weight: bold;
  font-size: 28rpx;
  color: #000000;
  margin: 10rpx 0;

  .quantity_btn {
    width: 48rpx;
    height: 48rpx;
    line-height: 45rpx;
    text-align: center;
    font-size: 36rpx;
    // color: #383228;
    // background: #e2e1e3;
    // border-radius: 50%;

    &.add{
        background: url('https://img.shinemang.com/gachaStatic/static/duiduipeng/icon_add.png');
        background-size: 100% 100%;
    }
   &.reduce{
            background: url('https://img.shinemang.com/gachaStatic/static/duiduipeng/icon_reduce.png');
        background-size: 100% 100%;

   }
    &.disabled {
      color: #d0d0d0;
    }
  }

  .quantity_num {
    min-width: 80rpx;
    text-align: center;
    font-size: 32rpx;
    color: #000;
  }

  .quantity_input {
    width: 72rpx;
    height: 48rpx;
    text-align: center;
    font-weight: 500;
    font-size: 28rpx;
    color: #383228;
  }
}

.pay_multiple {
  font-size: 28rpx;
  font-weight: 600;

  .pay_list {
    margin: 16rpx 0 32rpx 0;
    .multiple_item {
      width: 136rpx;
      height: 48rpx;
      line-height: 44rpx;
      border-radius: 26rpx;
      border: 2rpx solid #01c2d0;
      text-align: center;
      font-size: 24rpx;
      margin-right: 16rpx;
      &:last-child {
        margin-right: 0;
      }
      // margin-right: 16rpx;
      &.active {
        color: #fff;
        background: linear-gradient(90deg, #31e597 0%, #40e0ea 100%);
      }
    }
  }
}
.integral {
  color: #1a1a1a;
  margin-bottom: 20rpx;
  margin-bottom: 32rpx;

  .txt {
    font-weight: bold;
    font-size: 28rpx;
  }

  .integral_r {
    font-weight: 500;
    font-size: 28rpx;

    .integral_num {
      color: #8d8d94;
      font-weight: normal;
    }

    .integral_nums {
      color: #f65c36;
      margin-left: 8rpx;
    }

    .integral_btn {
      margin-left: 16rpx;
      width: 76rpx;
      height: 40rpx;
      background: #ebeef3;
      border-radius: 24rpx 24rpx 24rpx 24rpx;
      position: relative;
      > view {
        width: 32rpx;
        height: 32rpx;
        background: #aaacbb;
        position: absolute;
        left: 4rpx;
        top: 4rpx;
        border-radius: 50%;
      }

      &.av {
        background: linear-gradient(90deg, #31e597 0%, #40e0ea 100%);
        > view {
          left: unset;
          right: 4rpx;
          background: #ffffff;
        }
      }
    }
  }
}

.pays {
  // padding: 16rpx 32rpx;
  background: #fff;
  // border-radius: 24rpx;
  // background-color: #F5F6F8;

  .pay_item {
    padding: 0rpx 32rpx;
    width: 100%;
    height: 104rpx;
    background: #f5f6f8;
    border-radius: 24rpx 24rpx 24rpx 24rpx;
    margin-bottom: 16rpx;
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

.payHw {
  max-height: 220rpx;
  margin-bottom: 24rpx;
  overflow-y: auto;

  .paysTips {
    font-weight: 500;
    font-size: 24rpx;
    color: #818181;
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
    // background: #eee;
    background: url("https://img.shinemang.com/gachaStatic/notSelect.png");
    background-size: 100%;
    border-radius: 50%;

    &.active {
      background: url("https://img.shinemang.com/gachaStatic/select.png") !important;
      background-size: 100% 100% !important;
    }
  }

  .reduce {
    color: #f12c18;
    margin-right: 16rpx;
  }

  .consume {
    color: #383228;
    margin-right: 16rpx;
  }
}

.select {
  width: 36rpx;
  height: 36rpx;
  // background: #eee;
  border-radius: 50%;
  background: url("https://img.shinemang.com/gachaStatic/notSelect.png");
  background-size: 100%;
  border-radius: 50%;

  &.active {
    background: url("https://img.shinemang.com/gachaStatic/select.png") !important;
    background-size: 100% 100% !important;
  }
}

.selectBox {
  width: 600rpx;
  line-height: 32rpx;
  font-size: 24rpx;
  .red {
    color: #ee4326;
    font-weight: bold;
  }
}

.appoint {
  font-size: 24rpx;
  // font-weight: 500;
  color: #8d8d94;
  margin-top: 25rpx;
  display: flex;
  align-items: center;

  span {
    vertical-align: middle;
  }

  .select {
    background: #d9d9d9;
    margin-right: 18rpx;
  }

  .cory {
    color: #01c2d0;
  }
}

.btn {
  width: 686rpx;
  height: 80rpx;
  background: linear-gradient(90deg, #31e597 0%, #40e0ea 100%);
  border-radius: 40rpx 40rpx 40rpx 40rpx;
  position: absolute;
  left: 36rpx;
  color: #1a1a1a;
  font-size: 32rpx;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  bottom: 50rpx;
}

.disabled {
  opacity: 0.2;
}
</style>
