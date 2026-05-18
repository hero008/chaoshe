<template>
    <u-popup :show="show" @close="close" :safeAreaInsetBottom="false" :closeable="true" round="20" bgColor="#F4F4F4">
        <view class="pay_module">
            <div class="title">{{ title }}</div>
            <div class="msg flex_r flex_jc flex_ac">
                <img src="https://img.chaoshewang.com/static/img/pay/ico.png" class="ico1" />
                <span>请核对支付信息无误后再支付</span>
            </div>
            <div class="pay_money" :class="{ active: mtype == '13' && allDiscount.discount }">
                {{ amount }}
            </div>
            <view v-if="mtype == '13' && allDiscount.original" class="all_discount">
                {{ allDiscount.original }}元</view>
            <div class="pay_info">
                <view v-if="mtype == '13' && allDiscount.discount" class="subjoin_info flex_r flex_jb flex_ac">
                    <view class="txt">支付优惠：</view>
                    <view class="all_txt">{{ allDiscount.discount }}折扣</view>
                </view>
                <!-- amount: goMitigate ? Number(amount) + Number(mitigate) : amount, -->
                <div v-if="
                    ['1', '2', '3', '4', '5'].includes(mtype) && discount == 0 && payMessage.discount
                " class="subjoin_info flex_r flex_jb flex_ac" @click="
                    goto('/pages/my/cardpack', {
                        gacha_id: source_id,
                        nums: payNum,
                        gacha_type: mtype,
                        state: 1,
                        amount: oldamount,
                        price: unitPrice,
                        gacha_theme_id: theme_id,
                    })">
                    <span class="txt">支付优惠：</span>
                    <div class="tickets flex_r flex_ac">
                        <span v-if="selectTicket.id" class="ticket_item">{{ selectTicket.name }}</span>
                        <span v-else-if="severalPieces" style="color: red" class="no_msg">您有{{ severalPieces
                            }}张优惠券可以使用</span>
                        <span v-else class="no_msg">暂无优惠券</span>
                        <span class="icof">&#xe72b;</span>
                    </div>
                </div>
                <view class="integral flex_r flex_jb" v-if="
                    offsetInfo.status &&
                    amount &&
                    couponId == 0 && ['1', '2', '3', '4', '5'].includes(mtype) && discount == 0">
                    <span class="txt">欧气值抵扣</span>
                    <view class="integral_r flex_r flex_ac">
                        <view class="integral_num">{{ mitigate * offsetInfo.config[0].offsetAmount }}欧气值</view>
                        <view class="integral_nums" v-if="Number(mitigate) > 0.0">-￥{{ mitigate }}</view>
                        <view class="integral_btn" :class="{ av: goMitigate }" @click="onGoMitigate"></view>
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
                        <view class=" flex_r flex_ac" v-for="item in probabilityShow" :key="item.levelName">
                            {{ item.levelName + ' : ' + (typeof item.text == 'string' ? item.text : item.text + '%') }}
                        </view>
                    </view>
                </view>
                <!-- #endif -->
                <div class="pays" v-if="pays.length">
                    <!--    1一番赏、 2扭蛋 、3潮玩、 4洞乐、 5潮社、 6集市参与交易 发布 、11是潮币、 12发货转盘  13是一网打尽 -->
                    <div class="pay_item flex_r flex_jb flex_ac" @click="onPaytype(i)" v-for="(i, s) in pays" :key="s"
                        v-show="i.show">
                        <div class="pay_name flex_r flex_ac">
                            <img :src="payIco(i.img)" class="pay_ico" />
                            <span>{{ [0, 4].includes(i.type) ? i.name + "（" + i.number + "）" : i.name }}</span>
                            <img v-if="
                                (mtype !== '6' && i.type == 4) ||
                                (mtype == '6' &&
                                    i.type == 0 &&
                                    userInfo.allowCoinBet)
                            " src="https://img.chaoshewang.com/static/img/pay/ico2.png" class="ico2" />
                        </div>
                        <div class="reduce_pay flex_r flex_je">
                            <div class="reduce"
                                v-if="['1', '2', '3', '4', '5'].includes(mtype) && subtract && i.randomShow">随机立减</div>
                            <view class="consume" v-if="i.type && i.consume">支付￥{{ i.consume }}</view>
                            <div class="select" :class="{
                                active: paytypeList.includes(i.type),
                            }"></div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- '3', -->
            <div class="appoint  flex_r flex_ac" @click="onAnimationChange" v-if="['1', '2', '4', '5'].includes(mtype)">
                <div class="select" :class="{ active: showAnimation }"></div>
                <div>跳过抽赏动画（内存较小的机型建议勾选）</div>
            </div>
            <div class="appoint flex_r flex_ac" @click="onAgreeChange">
                <div class="select" :class="{ active: showAgree }"></div>
                <div class="selectBox">
                    <span>我已满18岁，已阅读并同意</span>
                    <span class="cory" @click.stop="
                        goto('/pages/common/rulepop', {
                            val: 'UserAgreement',
                        })
                        ">《用户协议》</span>
                    <span>及</span>
                    <span class="cory" @click.stop="
                        goto('/pages/common/rulepop', {
                            val: 'ExplanationOfConsumerRightsProtectionMeasures',
                        })
                        ">《消费者权益保障措施说明》</span>
                </div>
            </div>
            <view v-if="couponId !== '0'">
                <!-- <div class="btn" v-if="selectTicket.type" @click="$u.debounce(onPay, 1000)">支付</div> -->
                <div class="btn" v-if="selectTicket.type" @click="$noMultipleClicks(onPay)">支付</div>
                <div v-else class="btn disabled" @click="onHint">支付</div>
            </view>
            <!-- <div class="btn" v-else @click="$u.debounce(onPay, 1000)">支付</div> -->
            <div class="btn" v-else @click="$noMultipleClicks(onPay)">支付</div>
        </view>
        <mp-privacy title="授权手机号" ref="mpPrivacy" type="2" @authChange="authChange" />
    </u-popup>
</template>
<script>
let that;
import { post } from "@/utils/api.js";
import { integralPrice } from "@/utils/getData.js";
import { mapState, mapMutations, mapActions } from "vuex";
import mpPrivacy from "@/components/modules/mp-privacy.vue";
import { callPayment } from "@/utils/pay.js";

//   GachaType_Nil = 0;
//     GachaType_Kuji = 1;         // 一番赏
//     GachaType_Gashapon = 2;     // 彩蛋机
//     GachaType_ChaoPlay = 3;     // 潮玩赏
//     GachaType_SurpriseBox = 4;  // 洞洞乐
//     GachaType_ChaoShe = 5;      // 潮社赏
//     GachaType_ShareBill = 6;    // 一网打尽
export default {
    name: "x-pay",
    props: {
        title: {
            type: String,
            default: "选择支付方式",
        },
        mtype: {
            type: String, // 1一番赏 2扭蛋机 3潮游赏 4洞洞乐 （调起支付）5 潮社赏  //游戏方式
            default: "",
        },
        probabilityShow: {
            type: Array, // 1一番赏 2扭蛋机 3潮游赏 4洞洞乐 （调起支付）5 潮社赏
            default: [],
        },
    },
    components: { mpPrivacy },
    data() {
        return {
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
                // },
                {
                    name: "潮币余额",
                    type: 0,
                    img: "chao",
                    show: false,
                    msg: "潮币支付",
                    randomShow: false,
                    consume: 0,
                    // number: this.$gl("userInfo").coin,
                    number: 0,
                    payType: 1,
                },
                {
                    name: "金币余额",
                    type: 4,
                    img: "gold",
                    show: false,
                    msg: "金币支付",
                    randomShow: false,
                    consume: 0,
                    // number: this.$gl("userInfo").gold,
                    number: 0,
                    payType: 3,
                },
                {
                    name: "支付宝",
                    type: 1,
                    img: "Ali",
                    show: true,
                    msg: "支付宝APP支付",
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
                    img: "Ali",
                    show: true,
                    msg: "支付宝APP支付",
                    randomShow: true,
                },
                // #endif
            ],
            // #ifndef MP-WEIXIN
            paytypeList: [4],
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
            theme_id: ''
        };
    },
    computed: {
        ...mapState(["userInfo", "selectTicket", "offsetInfo", "payMessage", 'subtract']),
    },
    created() {
        that = this;
        this.UpselectTicket({});
        this.showAnimation = this.$gl("IsAnimation") || false;
        this.showAgree = this.$gl("IsAgree") || false;
    },
    methods: {
        ...mapMutations(["UpselectTicket", "UppayMessage"]),
        ...mapActions(["asyncUpBalance"]),
        onAnimationChange() {
            this.showAnimation = !this.showAnimation;
            this.$sl("IsAnimation", this.showAnimation);
        },
        onAgreeChange() {
            this.showAgree = !this.showAgree;
            this.$sl("IsAgree", this.showAgree);
        },
        async open(amount, num, source_type, source_id, couponId, box_index, original = 0, discount = 0, theme_id
        ) {
            // #ifndef MP-WEIXIN
            // 0潮币 1支付宝 2微信 3微信小程序 推荐使用this.mtype !== "12"
            if (this.userInfo.allowCoinBet && !["12", "13"].includes(this.mtype)) this.paytype;
            else this.paytype = this.mtype !== "6" ? 1 : 0;
            // #endif
            if (!this.userInfo.id) {
                this.goto("/pages/login/login");
                return;
            }
            this.goldNumber = this.userInfo.gold; // 金币
            this.goMitigate = false;
            this.amount = amount;
            this.oldamount = amount;
            this.payNum = num;
            this.source_type = source_type;
            this.source_id = source_id;
            this.couponId = couponId;
            this.show = true;
            this.box_index = box_index;
            this.theme_id = theme_id
            if (this.mtype == "13") this.allDiscount = { discount: discount || 0, original: original, };
            else this.discount = discount;
            this.pays.forEach((user) => {
                user.consume = 0;
                if (this.mtype !== "12" && this.userInfo.allowCoinBet && !user.type) user.show = true; // 显示潮币支付
                if (user.type == 4 && this.mtype !== "6") user.show = true;  //显示金币支付
                if (user.type == 4) user.number = this.userInfo.gold;  // 赋值金币
                if (user.type == 0) user.number = this.userInfo.coin; //赋值潮币
            });
            // 游客 绑定邮箱
            if (this.userInfo.isGuest) {
                // #ifdef MP-WEIXIN
                // this.$refs.mpPrivacy.open();
                // #endif
                // #ifndef MP-WEIXIN  可以不用
                this.goto("/pages/login/binding");
                // #endif
            } else {
                this.asyncUpBalance();//获取金币
                if (["1", "2", "3", "4", "5"].includes(this.mtype)) {
                    if (!discount && this.payMessage.discount) {
                        this.unitPrice = this.$h.Div(amount, num).toFixed(2)
                    }
                    this.integralAll = await integralPrice();//获取欧气值-
                    this.getBalance(); // 查优惠
                    this.getDiscounts(); //查看欧气值优惠金额
                }
            }
            if (this.mtype == "6" && this.userInfo.allowCoinBet) {
                this.paytypeList = [0];
            } else if (this.mtype == "6" && !this.userInfo.allowCoinBet) {
                this.paytypeList = [1];
            } else {
                // #ifndef MP-WEIXIN
                this.paytypeList = [4];
                // #endif
            }
        },
        authChange(bo) {
            if (bo) this.getBalance();
            else this.close();
        },
        close() {
            this.show = false;
            this.UpselectTicket({});
            this.UppayMessage({ url: "", message: {}, discount: true });
            this.pays.forEach((i) => (i.consume = 0));
        },
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
            if (['1', '2', '3', '4', '5'].includes(this.mtype) && this.discount == 0 && this.payMessage.discount) {
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
                        gacha_theme_id: this.theme_id
                    },
                });
                this.severalPieces = a.tableData.length;
                if (a.tableData.length > 0) {
                    this.UpselectTicket(a.tableData[0].id ? a.tableData[0] : {})
                }
            }
            // 欧气值抵扣
            if (this.amount && this.offsetInfo.status) {
                this.mitigate = 0;
                const { offsetAmount, offsetMax } = this.offsetInfo.config[0];
                let pc = this.integralAll.point / Number(offsetAmount) > this.amount * (offsetMax / 100) ? this.amount * (offsetMax / 100) : this.integralAll.point / Number(offsetAmount);
                this.mitigate = pc > 1 ? Math.floor(pc) : (Math.floor(pc * 10) / 10).toFixed(1);
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
                    if (i.consume) allNum = this.goMitigate ? this.floatingPoint(i.consume, "+", this.mitigate) : i.consume;
                    else allNum = this.goMitigate ? this.floatingPoint(this.amount, "+", this.mitigate) : this.amount;
                }
            });
            this.selectTicket.type == "COUPON_TYPE_FREE" ? (this.amount = 0) : this.amount;
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
                uni.$u.toast("金币不足，可与支付宝组合付款！");
                return;
            } else {
                let res, orderInfo;
                let click_type = this.amount == 0 ? 0 : this.paytype;
                // 潮币单独支付 潮币和欧气值支付
                // 金币单独支付  金币和欧气值支付 金币和支付宝支付 金币和欧气值和支付宝支付
                // 支付宝支付 支付宝和金币支付 支付宝和金币和欧气值支付
                // 开启欧气值总金额
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
                            is_offset: this.goMitigate ? 1 : 0,
                            offset_money: this.goMitigate ? this.mitigate : 0,
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
                        },
                    });
                }
                if (click_type == 0) {
                    res = await callPayment(
                        this.payMessage.url == "ddl"? "v1/gacha/open" : this.payMessage.url,
                        this.payMessage.message,
                        click_type
                    );
                    this.$emit("success", res, this.showAnimation, click_type);
                    this.close();
                } else {
                    let that = this;
                    res = await callPayment(
                        this.payMessage.url == "ddl" ? "v1/gacha/open" : this.payMessage.url,
                        {
                            ...this.payMessage.message,
                            create_payment_request: {
                                platform_id: click_type,
                                amount: (this.paytypeList.includes(3) ? this.amount : allNum) + "",
                                device_id: this.device_id,
                                source_type: this.source_type,
                                source_id: this.source_id,
                                balance_amount: goldNum, //金币支付的金额
                            },
                        },
                        click_type
                    );
                    orderInfo = res.orderInfo;
                    uni.requestPayment({
                        provider: this.paytypeList.includes(3) ? "wxpay" : "alipay",
                        // #ifndef MP-WEIXIN
                        orderInfo,
                        // #endif
                        // #ifdef MP-WEIXIN
                        ...orderInfo,
                        // #endif
                        success: function (res1) {
                            that.$emit( "success", res,  that.showAnimation, click_type );
                            that.close();
                        },
                        fail: function (err) {
                            if (err.errCode == -8) uni.$u.toast("客户端未安装");
                            if (err.errCode == -100)
                                uni.$u.toast("您中途取消了支付");
                            if (err.errMsg == "requestPayment:fail cancel")
                                uni.$u.toast("您中途取消了支付");
                            that.fail();
                        },
                    });
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
            return `https://img.chaoshewang.com/static/img/pay/${va}.png`;
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
        onGoMitigate() {
            if (Number(this.mitigate) < 0.1) {
                if (
                    Number(this.integralAll.point) <
                    Number(this.offsetInfo.config[0].offsetAmount)
                ) {
                    uni.$u.toast("欧气值不足，暂时无法抵扣！");
                    return;
                }
                uni.$u.toast("不参与欧气值活动！");
                return;
            }
            this.goMitigate = !this.goMitigate;
            this.amount = this.goMitigate ? this.floatingPoint(this.amount, "-", this.mitigate) : this.floatingPoint(this.amount, "+", this.mitigate);
            this.onGoldPay();
        },
        async getDiscounts() {
            if (this.amount && ["1", "2", "3", "4", "5"].includes(this.mtype) && Object.keys(this.offsetInfo).length
            ) {
                const { offsetAmount, offsetMax } = this.offsetInfo.config[0];
                let pc = this.integralAll.point / offsetAmount > this.amount * (offsetMax / 100) ? this.amount * (offsetMax / 100) : this.integralAll.point / offsetAmount;
                this.mitigate = pc > 1 ? Math.floor(pc) : (Math.floor(pc * 10) / 10).toFixed(1);
                if (this.goMitigate) this.amount = this.floatingPoint(this.amount, "-", this.mitigate);
            } else {
                this.goMitigate = false;
                this.mitigate = 0;
                this.pays.forEach((i) => (i.consume = 0));
            }
            this.onGoldPay();
        },
        onPaytype(item) {
            // 0的时候只能选0
            // 一个的时候 不能取消选中当前的那个
            // 选中两个的时候 可以取消一个
            // 当金币足够的时候 单选
            // 金币不够的时候可以选两个paytype
            if (
                this.goldNumber >= this.amount ||
                !item.type ||
                !this.goldNumber
            ) {
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
                if (this.paytypeList.includes(0) && item.type)
                    this.paytypeList = [];
                // 已选中就取消
                if (this.paytypeList.includes(item.type)) {
                    this.paytypeList = this.paytypeList.filter(
                        (x) => x !== item.type
                    );
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
                            this.goldNumber
                        );
                });
                // 仅选中支付宝就删除支付金额显示
                if (
                    this.paytypeList.includes(1) &&
                    this.paytypeList.length == 1
                )
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
    watch: {
        "selectTicket.discountPrice": {
            immediate: true,
            deep: true,
            handler(va) {
                va = va || 0;
                let a = this.$h.Sub(this.oldamount, va);
                this.amount = a > 0 ? a : 0;
                this.amount = this.selectTicket.type == "COUPON_TYPE_FREE" ? 0 : this.amount;
                this.getDiscounts();
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
    padding: 0 36rpx 160rpx;
    position: relative;
}

.title {
    padding: 30rpx 0;
    text-align: center;
    font-size: 32rpx;
    font-weight: 500;
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
    font-weight: 500;
    font-size: 32rpx;
    margin-bottom: 20rpx;
    color: #818181;

    .no_msg {
        color: #999;
        font-size: 28rpx;
    }

    .all_txt {
        font-weight: 500;
        font-size: 28rpx;
        color: #ff6a16;
    }

    .tickets {
        .ticket_item {
            color: #ff5070;
        }

        .icof {
            margin-left: 16rpx;
            font-size: 38rpx;
        }
    }
}

.integral {
    color: #818181;
    margin-bottom: 20rpx;

    .integral_r {
        font-weight: 500;
        font-size: 28rpx;

        .integral_num {
            color: #000000;
        }

        .integral_nums {
            color: #fa80c7;
            margin-left: 8rpx;
        }

        .integral_btn {
            margin-left: 16rpx;
            width: 88rpx;
            height: 48rpx;
            background-image: url("https://img.chaoshewang.com/matt/static/img/index/integral_btn1.png");
            background-size: 100% 100%;

            &.av {
                background-image: url("https://img.chaoshewang.com/matt/static/img/index/integral_btn.png");
                background-size: 100% 100%;
            }
        }
    }
}

.pays {
    padding: 20rpx 24rpx;
    background: #fff;
    border-radius: 16rpx;

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
        background: #eee;
        border-radius: 50%;

        &.active {
            background-image: url("https://img.chaoshewang.com/static/img/pay/ico3.png") !important;
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
    background: #eee;
    border-radius: 50%;

    &.active {
        background-image: url("https://img.chaoshewang.com/static/img/pay/ico3.png") !important;
        background-size: 100% 100% !important;
    }
}

.selectBox {
    width: 600rpx;
}

.appoint {
    font-size: 24rpx;
    font-weight: 500;
    color: #615e74;
    margin-top: 25rpx;

    span {
        vertical-align: middle;
    }

    .select {
        background: #d9d9d9;
        margin-right: 18rpx;
    }

    .cory {
        color: #ff6a16;
    }

}

.btn {
    color: #fff;
    width: calc(100vw - 72rpx);
    height: 100rpx;
    line-height: 100rpx;
    text-align: center;
    font-size: 32rpx;
    font-weight: 500;
    background: #715cdd;
    border-radius: 16rpx;
    position: absolute;
    left: 36rpx;
    bottom: 50rpx;
}

.disabled {
    opacity: 0.2;
}
</style>