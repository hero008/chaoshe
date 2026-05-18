<template>
    <view class="transaction" :class="{ mpWeixin: ISmp() }" :style="{ paddingTop: MBInfo().top + 'px' }">
        <div class="navbar_x flex_r flex_jb flex_ac" :style="{ height: MBInfo().height + 'px' }">
            <view class="top_Back" @click.stop="gateBack">
                <text class="icof Back_ico">&#xe72c;</text>
                <text class="txt">返回</text>
            </view>
            <img src="https://img.chaoshewang.com/static/img/transaction/btn2.png" class="btn_r" @click="
                goto('/pages/common/rulepop', {
                    val: 'ReleaseTransactionInstructions',
                })
                " />
        </div>
        <div class="transaction_con" :style="{ height: conHeight }">
            <view class="tabs_two flex_r flex_jb">
                <view class="tab_item" :class="{ active: i.val == transactionType }" @click="ontab(i)"
                    v-for="(i, s) in navbar" :key="s">{{ i.txt }}</view>
            </view>
            <view class="p_lists">
                <div class="flex_r flex_ac">
                    <view class="teg">赏品共{{ totalNums || 0 }}个</view>
                    <view class="teg cor_g">已选{{ thickData.length || 0 }}个</view>
                </div>
                <div class="form_box" v-if="transactionType == 1">
                    <div class="form_item">
                        <div class="txt flex_r flex_ac">
                            <span class="icof corr">&#xe641;</span>交易赏品
                            <div class="txt3">是否设置一口价</div>
                            <u-switch v-model="isSetPrice" :size="18" inactiveColor="#E2E1E3"></u-switch>
                        </div>

                        <div class="form_item " style="margin-bottom: 30rpx" v-if="isSetPrice">
                            <div class="txt">设置一口价</div>
                            <div class="inp_box flex_r flex_ac">
                                <u--input placeholder="请输入金额" type="number" maxlength="5" v-model="onePrice"
                                    @change="clickOnePrice" @input="
                                        onePrice = onePrice.replace(/[^\d]/g, '')
                                        " />
                                <img src="https://img.chaoshewang.com/static/img/transaction/ico2.png" class="ico" />
                            </div>
                        </div>
                        <!-- <div class="lists"> -->
                        <scroll-view scroll-y="true" class="listss " @scrolltolower="onReachScollBottom"
                            :lower-threshold="200">
                            <view class="lists">
                                <view class="item" v-for="(item, index) in selectRewardsInfo" :key="index">
                                    <view class="item_img" :style="{ backgroundImage: `url(${item.item.coverThumb})` }">
                                        <view class="box_ico frame"></view>
                                        <!-- <img src="https://img.chaoshewang.com/static/img/shanggui/group_1.png"  class="box_ico" /> -->
                                    </view>
                                    <img @click="removeItem(item)" class="remove_btn"
                                        src="https://img.chaoshewang.com/static/img/transaction/close2.png" />
                                    <view class="item_txt1">{{ item.item.saleType == 1 ? "现货" : "预售" }}</view>
                                </view>
                                <div class="SelectProduct flex_r flex_jc flex_ac" v-show="thickData.length < 600"
                                    @click="addStock">
                                    <img src="https://img.chaoshewang.com/static/img/transaction/ico1.png"
                                        class="ico" />
                                </div>
                                <view class="bottom"></view>
                            </view>
                        </scroll-view>
                        <!-- </div> -->
                    </div>
                    <!-- <div class="form_item flex_r flex_ac">
                        <div class="txt3">是否设置一口价</div>
                        <u-switch v-model="isSetPrice" :size="18" inactiveColor="#E2E1E3"></u-switch>
                    </div>
                    <div class="form_item" v-if="isSetPrice">
                        <div class="txt">设置一口价</div>
                        <div class="inp_box flex_r flex_ac">
                            <u--input placeholder="请输入金额" type="number" maxlength="5" v-model="onePrice"
                                @change="clickOnePrice" @input="
                                    onePrice = onePrice.replace(/[^\d]/g, '')
                                    " />
                            <img src="https://img.chaoshewang.com/static/img/transaction/ico2.png" class="ico" />
                        </div>
                        <div class="auxiliary flex_r flex_ac">
                            <div class="txt2">是否允许赏品交换</div>
                            <u-switch v-model="isExchange" :size="18" inactiveColor="#E2E1E3"></u-switch>
                        </div>
                    </div> -->
                    <!-- <div class="form_item" > -->
                    <div class="form_item" style="width: 708rpx">
                        <!-- <div class="txt flex_r flex_ac flex_jb">
                            <span>留言</span>
                            <img
                                @click="one_leaveMessage = ''"
                                src="https://img.chaoshewang.com/static/img/transaction/ico4.png"
                                class="empty"
                            />
                        </div>
                        <u--textarea
                            placeholder="请输入留言(最大长度50字)"
                            maxlength="50"
                            v-model="one_leaveMessage"
                            :count="true"
                        />
                        <div class="msg">
                            请注意！发布钓鱼、欺诈、广告等违规信息将封禁交易！所有出价物品为总价非单价！
                        </div> -->
                    </div>
                </div>
                <div class="form_box" v-if="transactionType == 2">
                    <div class="form_item">
                        <div class="txt flex_r flex_ac">
                            <span class="icof">&#xe641;</span>交易赏品
                        </div>
                        <div class="SelectProduct2 flex_r flex_jb flex_ac">
                            <div @click="addStock" class="Select_box flex_c flex_jc flex_ac">
                                <template v-if="!selectRewardsInfo.length">
                                    <img src="https://img.chaoshewang.com/static/img/transaction/ico1.png"
                                        class="ico" />
                                    <div class="add_txt">选择你的赏品</div>
                                </template>
                                <div :class="{
                                    buyRewardImgs:
                                        selectRewardsInfo.length > 1,
                                    buyReward_img:
                                        selectRewardsInfo.length == 1,
                                }" v-else>
                                    <img v-for="(i, s) in selectRewardsInfo" :src="i.item.coverThumb" :key="s"
                                        class="img_item" />
                                    <div class="num" v-if="selectRewardsInfo.length > 1">
                                        共{{ selectRewardsInfo.length }}件
                                    </div>
                                </div>
                            </div>
                            <img src="https://img.chaoshewang.com/static/img/transaction/ico3.png" class="ico3" />
                            <div @click="popupShow2 = true" class="Select_box flex_c flex_jc flex_ac">
                                <template v-if="!buyReward[0]">
                                    <view class="random_img random"></view>
                                    <!-- <img
                                        src="https://img.chaoshewang.com/static/img/transaction/ico1.png"
                                        class="ico"
                                    />
                                    <div class="add_txt">添加求换赏品</div>
                                    <div class="add_txt corr">(必填)</div> -->
                                </template>
                                <img v-else :src="buyReward[0].coverImage" class="buyReward_img" />
                            </div>
                        </div>
                    </div>
                    <div class="form_item">
                        <div class="txt">加钱换购</div>
                        <div class="inp_box flex_r flex_ac">
                            <u--input placeholder="请输入金额" type="number" :maxlength="5" v-model="addMoney"
                                @change="onInput" @input="
                                    addMoney = addMoney.replace(/[^\d]/g, '')
                                    " />
                            <img src="https://img.chaoshewang.com/static/img/transaction/ico2.png" class="ico" />
                        </div>
                    </div>
                    <div class="form_item" style="width: 708rpx">
                        <!-- <div class="txt flex_r flex_ac flex_jb">
                            <span>留言</span>
                            <img
                                @click="one_leaveMessage = ''"
                                src="https://img.chaoshewang.com/static/img/transaction/ico4.png"
                                class="empty"
                            />
                        </div>
                        <u--textarea
                            placeholder="请输入留言(最大长度50字)"
                            maxlength="50"
                            v-model="one_leaveMessage"
                            :count="true"
                        />
                        <div class="msg">
                            请注意！发布钓鱼、欺诈、广告等违规信息将封禁交易！所有出价物品为总价非单价！
                        </div> -->
                    </div>
                </div>

            </view>
            <div class="foot_btn flex_r flex_jc">
                <x-btn txt="发布交易" v-if="!isTransaction" />
                <x-btn txt="发布交易" v-else @click="onClickRelTransaction" cor="2" />
            </div>
        </div>
        <u-popup :show="popupShow2" bgColor="transparent" :safeAreaInsetBottom="false">
            <div class="select_product_popup">
                <img @click="popupShow2 = false" src="https://img.chaoshewang.com/static/img/transaction/close.png"
                    class="close_btn" />
                <div class="select_product_con">
                    <u--input prefixIcon="search" @confirm="onClickSearhResult" v-model="searchTxt"
                        placeholder="请输入求换赏品名称" />
                    <div class="result p_lists">
                        <div class="tit" v-if="searchItem.length">
                            搜索结果：
                        </div>
                        <scroll-view scroll-y="true" class="list_box" :lower-threshold="400">
                            <div class="lists">
                                <view class="item" v-for="(item, index) in searchItem" :key="index"
                                    @click="SelectBuyReward(item)">
                                    <view class="item_img" :style="{
                                        backgroundImage: `url(${item.coverThumb})`,
                                    }">
                                        <img v-if="
                                            buyRewardIds.includes(item.id)
                                        " src="https://img.chaoshewang.com/static/img/shanggui/xuanzhong.png"
                                            class="box_ico" />
                                        <view class="box_ico frame" v-else></view>
                                        <!-- <img
                                            v-else
                                            src="https://img.chaoshewang.com/static/img/shanggui/group_1.png"
                                            class="box_ico"
                                        /> -->
                                        <view class="item_txt1">{{
                                            item.saleType == 1 ? "现货" : "预售"
                                        }}</view>
                                    </view>
                                    <view class="item_name ellipsis">{{
                                        item.name
                                    }}</view>
                                </view>
                            </div>
                        </scroll-view>
                    </div>
                    <div class="popup_btn flex_r flex_jc">
                        <!-- <x-btn txt="确认" v-if="!buyRewardIds.length" /> -->
                        <x-btn txt="确认" @click="confirmBuySelect" cor="1" />
                    </div>
                </div>
            </div>
        </u-popup>
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
                            <div class="img" v-for="(item, index) in thickData" :key="index">
                                <view class="item_img" :style="{
                                    backgroundImage: `url(${item.item.coverThumb})`,
                                }">
                                    <view class="box_ico frame"></view>
                                    <view class="item_txt1">{{
                                        item.item.saleType == 1
                                            ? "现货"
                                            : "预售"
                                    }}</view>
                                </view>
                            </div>
                        </div>
                    </div>
                    <div class="money_box flex_r flex_ac">
                        <div class="tit">一口价金额：</div>
                        <div class="money">{{ Number(onePrice) || "无" }}</div>
                    </div>
                    <view class="" v-show="one_leaveMessage.length > 0">
                        <div class="tit">留言：</div>
                        <div class="leave">{{ one_leaveMessage }}</div>
                    </view>
                </div>
                <div class="popup_btn flex_r flex_jc">
                    <x-btn txt="确认" @click="onClickPostTransaction" cor="1" />
                </div>
            </div>
        </u-popup>
        <u-popup :show="popupShow4" mode="center" bgColor="transparent" :safeAreaInsetBottom="false">
            <div class="preview_product2">
                <div class="head_tit">
                    <img @click="popupShow4 = false" src="https://img.chaoshewang.com/static/img/transaction/close2.png"
                        class="close_btn" />
                    <div class="title">请您确定交易信息</div>
                    <div class="txt">确认交易信息，避免给您带来经济损失</div>
                </div>
                <div class="products_info top">
                    <div class="tit">出换赏品：</div>
                    <div class="products">
                        <div class="product_list">
                            <div class="img" v-for="(item, index) in selectRewardsInfo" :key="index">
                                <view class="item_img" :style="{
                                    backgroundImage: `url(${item.item.coverThumb})`,
                                }">
                                    <view class="box_ico frame"></view>
                                    <!-- <img src="https://img.chaoshewang.com/static/img/shanggui/group_1.png"
                                        class="box_ico" /> -->
                                    <view class="item_txt1">{{
                                        item.item.saleType == 1
                                            ? "现货"
                                            : "预售"
                                    }}</view>
                                </view>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="products_info down">
                    <div class="tit">求购赏品：</div>
                    <div class="products">
                        <div class="product_list" v-if="buyReward.length">
                            <div class="img" v-for="(item, index) in buyReward" :key="index">
                                <view class="item_img" :style="{
                                    backgroundImage: `url(${item.coverImage})`,
                                }">
                                    <view class="box_ico frame"></view>
                                    <!-- <img src="https://img.chaoshewang.com/static/img/shanggui/group_1.png"
                                        class="box_ico" /> -->
                                    <view class="item_txt1">{{
                                        item.saleType == 1 ? "现货" : "预售"
                                    }}</view>
                                </view>
                            </div>
                        </div>
                        <view v-else class="random box_ico"></view>
                    </div>
                    <div class="money_box flex_r flex_ac">
                        <div class="tit">出价金额：</div>
                        <div class="money">{{ Number(addMoney) || "无" }}</div>
                    </div>
                    <view class="" v-show="one_leaveMessage.length > 0">
                        <div class="tit">留言：</div>
                        <div class="leave">{{ one_leaveMessage }}</div>
                    </view>
                </div>
                <div class="popup_btn flex_r flex_jc">
                    <x-btn txt="确认" @click="onClickPostTransaction2" cor="1" />
                </div>
            </div>
        </u-popup>
        <!-- 支付  交易6-->
        <x-pay @success="confirmOrder" ref="xPay" mtype="6" :probabilityShow="[]" />
        <select-goods ref="addStock" @totalNums="
            (va) => {
                totalNums = va;
            }
        " @confirmSelect="SelectIds" isfilt="1" typeClass="0" />
        <autonym @onAutonym="onAutonym" ref="autonym" :visible="showAutonym" />
    </view>
</template>
<script>
import { post } from "@/utils/api.js";
import xPay from "@/components/x-pay/index";
import xBtn from "@/components/modules/x-btn";
import selectGoods from "@/components/selectGoods/index";
import autonym from "@/components/autonym/index.vue";
import { callPayment } from "@/utils/pay.js";
import { mapState, mapMutations } from "vuex";
export default {
    data() {
        return {
            navbar: [
                { txt: "一口价", val: 1 },
                { txt: "以物换物", val: 2 },
            ],
            transactionType: 1, // 交易类型（一口价1/以物换物2）

            popupShow2: false,
            popupShow3: false,
            popupShow4: false,

            isExchange: false, // 是否允许赏品交换
            totalNums: 0, // 待交易赏品总数量
            selectRewardsInfo: [], // 已选赏品信息
            selectRewardIds: [], // 已选赏品的id
            buyReward: [], // 求购赏品
            buyRewardIds: [],
            searchTxt: undefined, // 搜索赏品名称
            searchItem: [], // 搜索到的赏品结果
            isSetPrice: false, // 是否设置一口价
            onePrice: undefined, // 一口价
            addMoney: undefined, // 加钱换购
            one_leaveMessage: "", // 留言
            stock_ids: [],
            item_ids: [],
            type: 0,
            device: "",
            amount: 0,
            showAutonym: false,
            userInfo: this.$gl("userInfo") || {},
            closeAutonym: false,
            thickData: [],//原数据
            pageSize: 50, // 每次加载50条
            currentPage: 1,// 当前加载的页数
        };
    },
    components: {
        xBtn,
        xPay,
        selectGoods,
        autonym,
    },
    computed: {
        ...mapState(["payMessage"]),
        isTransaction() {
            if (this.transactionType == 1) {
                return (
                    this.selectRewardsInfo.length > 0 &&
                    (this.isSetPrice
                        ? this.onePrice && this.onePrice > 0
                        : true)
                );
            } else {
                // return (
                //     this.buyReward.length > 0 &&
                //     !(
                //         (!this.addMoney || this.addMoney < 1) &&
                //         this.selectRewardsInfo.length < 1
                //     )
                // );
                return (
                    this.selectRewardsInfo.length > 0 ||
                    (this.buyReward.length > 0 &&
                        !(
                            (!this.addMoney || this.addMoney < 1) &&
                            this.selectRewardsInfo.length < 1
                        ))
                );
            }
        },
        conHeight() {
            let h = this.SystemInfo.screenHeight;
            let va = this.MBInfo();
            let th = va.height + va.top + 10;
            let str = h - th + "px";
            return str;
        },
    },
    onLoad(options) {
        // if (options.openStock === "true") {
        //     // 加个微延时，保证组件渲染完成（必加，否则$refs找不到）
        //     setTimeout(() => {
        //         this.addStock();
        //     }, 100);
        // }
    },
    mounted() { this.closeAutonym = this.userInfo.isAuthenticated; },
    methods: {
        ...mapMutations(["UppayMessage"]),
        async onAutonym() {
            this.showAutonym = false;
            let a = await post("v1/user/self/get", {
                user_id: this.userInfo.id,
            });
            this.closeAutonym = a.isAuthenticated;
            if (this.closeAutonym) this.onClickRelTransaction();
        },
        onInput(e) {
            e > 50000 ? (this.addMoney = 50000) : "";
        },
        clickOnePrice(e) {
            e > 50000 ? (this.onePrice = 50000) : "";
        },
        ontab(da) {
            this.transactionType = da.val;
            this.resetForm();
        },
        addStock() {
            this.$refs.addStock.open(this.selectRewardIds); 
        },
        SelectIds(ids, infos) {
            this.pageSize = 50; // 每次加载50条
            this.currentPage = 1; // 当前加载的页数
            this.selectRewardIds = ids;
            this.thickData = infos;
            if (this.transactionType == 1) {
                this.selectRewardsInfo = infos.slice(0, 50);
            } else {
                this.selectRewardsInfo = infos
            }

        },
        removeItem(item) {
            let id = item.id;
            this.selectRewardIds = this.remove(this.selectRewardIds, id);
            this.selectRewardsInfo = this.remove(this.selectRewardsInfo, item);
            this.thickData = this.remove(this.thickData, item);
        },
        SelectBuyReward(item) {
            let id = item.id;
            if (this.buyRewardIds.includes(id)) {
                this.buyRewardIds = [];
            } else {
                this.buyRewardIds = [id];
            }
        },
        confirmBuySelect() {
            this.buyReward = [];
            for (const da of this.searchItem) {
                if (this.buyRewardIds.includes(da.id)) {
                    this.buyReward.push(da);
                }
            }
            this.popupShow2 = false;
        },
        onClickRelTransaction() {
            if (!this.userInfo.isAuthenticated && !this.closeAutonym) {
                this.showAutonym = !this.userInfo.isAuthenticated; // 是否已实名认证;
                return;
            }
            if (this.transactionType == 1) {
                // 一口价
                if (!this.isTransaction) return;
                this.onePrice = this.isSetPrice ? this.onePrice : undefined;
                this.popupShow3 = true;
            } else {
                // 以物换物
                this.popupShow4 = true;
            }
        },
        onClickPostTransaction2() {
            this.getUp();
            if (this.addMoney && this.addMoney > 0) {
                this.$refs.xPay.open(
                    this.addMoney, 1, getApp().globalData.RechargeType.MarketOrder, 0, "0"
                );
            } else {
                this.onClickPostTransaction();
            }
        },
        async onClickPostTransaction() {
            this.getUp();
            let stock_ids = [],
                item_ids = [];
            for (let index of this.thickData) {
                stock_ids.push(index.id);
                item_ids.push(index.itemId);
            }
            if (stock_ids.length > 600) {
                uni.$u.toast("选择赏品超过600！请重新选择");
                return;
            }
            let res = await callPayment(
                this.payMessage.url,
                this.payMessage.message,
                0
            );
            if (!res.code) {
                this.onClickPay();
            } else {
                this.popupShow3 = false;
                this.popupShow4 = false;
                uni.$u.toast(res.message);
            }
        },
        getUp() {
            let item_ids = [];
            for (let index of this.thickData) {
                item_ids.push(index.itemId);
            }
            this.UppayMessage({
                url: "v1/market/order/create",
                message: {
                    stock_ids: this.selectRewardIds,
                    item_ids,
                    type: this.transactionType,
                    buy_price: this.onePrice ? Number(this.onePrice) : 0,
                    ask_price: this.addMoney ? Number(this.addMoney) : 0,
                    want_item_id: this.buyRewardIds[0],
                    content: this.one_leaveMessage,
                    allow_barter: false,
                },
            });
        },
        confirmOrder(res, showAnim, type) {
            if (!res.code) {
                this.onClickPay();
            } else {
                this.popupShow3 = false;
                this.popupShow4 = false;
                uni.$u.toast(res.message);
            }
        },

        onClickPay() {
            this.popupShow3 = false;
            this.popupShow4 = false;
            this.resetForm();
            uni.$u.toast("赏品发布成功！");
            setTimeout(() => {
                uni.setStorageSync("currentChange", 1);
                uni.reLaunch({
                    url: "/pages/index/index",
                });
            }, 300);
        },
        resetForm() {
            this.selectRewardIds = [];
            this.selectRewardsInfo = [];
            this.buyReward = [];
            this.onePrice = undefined; // 一口价
            this.addMoney = undefined; // 加钱换购
            this.one_leaveMessage = ""; // 留言
            this.pageSize = 50; // 每次加载50条
            this.currentPage = 1; // 当前加载的页数
            this.thickData = [];
        },
        onClickSearhResult() {
            if (this.searchTxt) {
                post("v1/goods/item/search", {
                    text: this.searchTxt,
                }).then((res) => {
                    if (!res.code) {
                        if (res.items.length < 1) {
                            uni.$u.toast("未搜索到赏品信息！");
                        } else {
                            this.searchItem = res.items;
                        }
                    }
                });
            } else {
                uni.$u.toast("请输入您要搜索的信息！");
            }
        },
        onReachScollBottom() {
            const nextStart = this.currentPage * this.pageSize;
            const nextEnd = (this.currentPage + 1) * this.pageSize;
            if (nextStart >= this.thickData.length) {
                return;
            }
            const newData = this.thickData.slice(nextStart, nextEnd);
            this.selectRewardsInfo = [...this.selectRewardsInfo, ...newData];
            this.currentPage += 1;

        },
    },
};
</script>
<style lang='scss' scoped>
.transaction {
    height: 100vh;
    position: relative;
    padding-top: 106rpx;
    background: linear-gradient(104deg, #e1d6f8 0%, #f8e7ed 100%);
    overflow: hidden;
    // overflow-y: auto;
}

.frame {
    background: url("@/static/homePage/frame.png");
    background-size: 100% 100%;
}

.navbar_x {
    padding: 0 36rpx;

    .btn_r {
        width: 162rpx;
        height: 48rpx;
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

.transaction_con {
    width: 100%;
    height: calc(100% - 200rpx);
    position: absolute;
    bottom: 0;
    right: 0;
}

.tabs_two {
    color: #fff;
    width: 318rpx;
    height: 76rpx;
    font-size: 28rpx;
    line-height: 28rpx;
    background: url("https://img.chaoshewang.com/static/img/transaction/Rectangle.png");
    background-size: 100% 100%;
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
    margin-top: -16rpx;
    height: calc(100% - 60rpx);
    border-radius: 0 50rpx 0 0;
    background: #f4f4f4;
    padding: 30rpx 40rpx 10rpx 20rpx;
    position: relative;
    // overflow-y: auto;

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

    .listss {
        height: 850rpx;

    }

    .lists {
        width: 100%;
        @include grid(170rpx);

        .item {
            width: 152rpx;
            margin-bottom: 18rpx;
            margin-top: 18rpx;
            margin-right: 18rpx;

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

            .item_txt {
                color: #ffffff;
                font-size: 22rpx;
                position: absolute;
                left: 6rpx;
                bottom: 2rpx;
            }
        }

        .bottom {
            width: 100%;
            height: 500rpx;
            margin-top: 18rpx;
        }

    }
}

.form_box {
    .lists {
        padding: 0;

        .item {
            position: relative;
        }
    }

    .SelectProduct {
        width: 152rpx;
        height: 152rpx;
        border-radius: 12rpx;
        background: #e2e1e3;
        border: 2rpx dashed #aca9bc;
        margin-top: 18rpx;

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
        z-index: 16;
    }

    .form_item {
        margin-top: 60rpx;

        .txt {
            font-size: 32rpx;
            color: #383228;
            font-weight: bold;
            margin-bottom: 20rpx;

            .corr {
                color: #f20;
            }

            .empty {
                width: 40rpx;
                height: 40rpx;
            }
        }

        .auxiliary {
            margin-top: 20rpx;
        }

        .txt3 {
            font-weight: bold;
            margin-right: 36rpx;
            font-size: 32rpx;
            color: #383228;
            margin-left: 36rpx;
        }

        .txt2 {
            margin-right: 20rpx;
            font-size: 24rpx;
            color: #383228;
        }

        .msg {
            color: #f23a13;
            line-height: 28rpx;
            font-size: 20rpx;
            margin-top: 8rpx;
        }

        .inp_box {
            width: 460rpx;

            .ico {
                width: 40rpx;
                height: 40rpx;
                margin-left: 22rpx;
            }
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

    .SelectProduct2 {
        position: relative;

        .Select_box {
            width: 316rpx;
            height: 316rpx;
            border-radius: 12rpx;
            background: #e2e1e3;
            font-size: 24rpx;
            color: #818181;
            overflow: hidden;

            .ico {
                width: 48rpx;
                height: 48rpx;
            }

            .add_txt {
                margin-top: 10rpx;

                &.corr {
                    color: #f23a13;
                }
            }
        }

        .ico3 {
            width: 82rpx;
            height: 82rpx;
            position: absolute;
            left: calc((100% - 82rpx) / 2);
            top: calc((100% - 82rpx) / 2);
            border: 8rpx solid #f4f4f4;
            border-radius: 50%;
        }

        .buyRewardImgs {
            width: 100%;
            height: 100%;
            padding: 12rpx;
            position: relative;
            @include grid(146rpx);

            .img_item {
                width: 146rpx;
                height: 146rpx;
                border-radius: 8rpx;
            }

            .num {
                position: absolute;
                right: 0;
                bottom: 0;
                font-size: 24rpx;
                font-weight: 800;
                color: #fff;
                padding: 0 16rpx;
                border-radius: 30rpx;
                background: rgba(0, 0, 0, 0.7);
            }
        }

        .buyReward_img {
            width: 100%;
            height: 100%;

            .img_item {
                width: 100%;
                height: 100%;
            }
        }

        .random_img {
            width: 100%;
            height: 100%;
        }
    }
}

.random {
    background: url("https://img.chaoshewang.com/static/img/transaction/random1.png");
    background-size: 100% 100%;
}

.foot_btn {
    // margin-top: 120rpx;
    position: relative;
    bottom: 200rpx;
    z-index: 999;

}

.select_product_popup {
    height: 80vh;
    position: relative;

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
}

.preview_product {
    height: 916rpx;
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
                // background: #AC8AFC;
                border-radius: 16rpx;
                display: inline-block;
                margin-right: 20rpx;

                &:last-child {
                    margin-right: 0;
                }

                .item_img {
                    width: 152rpx;
                    height: 152rpx;
                    // background-color: rgba($color: #9064FF, $alpha: 1);
                    border-radius: 16rpx;
                    background-size: 100% 100%;
                    position: relative;
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

.preview_product2 {
    height: 1212rpx;
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

        &.top {
            padding-bottom: 0rpx;
        }

        &.down {
            padding-top: 0rpx;
        }

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
                // background: #AC8AFC;
                border-radius: 16rpx;
                display: inline-block;
                margin-right: 20rpx;

                &:last-child {
                    margin-right: 0;
                }

                .item_img {
                    width: 152rpx;
                    height: 152rpx;
                    // background-color: rgba($color: #9064FF, $alpha: 1);
                    border-radius: 16rpx;
                    background-size: 100% 100%;
                    position: relative;
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

.popup_btn {
    margin-top: 20rpx;
}

.mpWeixin {
    .navbar_x .btn_r {
        display: none;
    }
}

.item_txt1 {
    color: #ffffff;
    font-size: 20rpx;
    position: absolute;
    right: 6rpx;
    top: 0rpx;
}

.box_ico {
    width: 152rpx;
    height: 152rpx;
}
</style>