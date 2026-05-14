<template>
    <u-overlay :show="visible">
        <view class="pop_bg">
            <div class="p_head flex_c flex_jse">
                <image
                    @click="onClickClose"
                    class="ico_img"
                    src="https://img.chaoshewang.com/static/img/transaction/close2.png"
                ></image>
                <view class="t_title">认证信息</view>
            </div>
            <view class="bottom_bg">
                <view
                    class="search_list flex_r flex_ac"
                    v-for="(i, s) in formList"
                    :key="s"
                >
                    <view class="text">{{ i.title }}</view>
                    <view class="search_box flex_r flex_ac">
                        <input
                            :placeholder="i.placeholder"
                            placeholder-class="pcs"
                            class="input"
                            :id="s"
                            :value="i.inputValue"
                            @input="clearInput"
                            @blur="clearOnblur"
                        />
                        <view
                            class="delete_icon flex_r flex_ac"
                            @click="clearIcon(i)"
                            ><view
                                class="delete_img"
                                v-show="i.showClearIcon"
                            ></view
                        ></view>
                        <view class="mistake" v-show="i.mistakeShow"
                            >请输入正确的{{ i.title }}</view
                        >
                    </view>
                </view>
            </view>
            <div class="appoint flex_r flex_ac" @click="onAgreeChange">
                <div class="select" :class="{ active: showAgree }"></div>
                <div class="selectBox">
                    <span>我已同意</span>
                    <span
                        class="cory"
                        @click.stop="
                            goto('/pages/common/rulepop', {
                                val: 'Authentication',
                            })
                        "
                        >《敏感信息处理征求同意函》</span
                    >
                </div>
            </div>
            <div class="pop_btn flex_r flex_jc">
                <x-btn
                    v-if="showAgree && !btn"
                    txt="确认"
                    cor="1"
                    @click="$noMultipleClicks(onClickSave)"
                />
                <x-btn txt="确认" v-else />
            </div>
        </view>
    </u-overlay>
</template>
<script>
import { post } from "@/utils/api.js";
import xBtn from "@/components/modules/x-btn";
import {mapActions } from "vuex";
export default {
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            inputValue: "",
            showAgree: false, //是否跳过动画
            formList: [
                {
                    title: "真实姓名",
                    placeholder: "请输入真实姓名",
                    inputValue: "",
                    showClearIcon: false,
                    mistakeShow: false,
                },
                {
                    title: "身份证号",
                    placeholder: "请输入身份证号",
                    inputValue: "",
                    showClearIcon: false,
                    mistakeShow: false,
                },
                {
                    title: "手机号码",
                    placeholder: "请输入手机号码",
                    inputValue: "",
                    showClearIcon: false,
                    mistakeShow: false,
                },
            ],
            btn: false,
            noClick: true, //防抖挂载
            noClickTime: 3000, //防抖挂载
        };
    },
    components: {
        xBtn,
    },
    watch: {},
    computed: {},
    onLoad(da) {
        this.showBtn();
    },
    onShow() {},
    created() {},
    mounted() {},
    methods: {
        ...mapActions(["asyncUpdateInfo", "asyncUpBalance"]),
        clearInput(event) {
            let i = event.currentTarget.id;
            this.formList[i].inputValue = event.detail.value;
            if (event.detail.value.length > 0) {
                this.formList[i].showClearIcon = true;
                this.onVerify(i, event.detail.value);
                this.showBtn();
            } else {
                this.formList[i].showClearIcon = false;
            }
        },
        clearOnblur(event) {
            let i = event.currentTarget.id;
            if (event.detail.value == "") this.formList[i].mistakeShow = false;
            else this.onVerify(i, event.detail.value);
            this.showBtn();
        },
        showBtn() {
            this.btn = this.formList.find(
                (i) => i.mistakeShow == true || i.inputValue == ""
            );
        },
        clearIcon(i) {
            i.inputValue = "";
            i.showClearIcon = false;
            i.mistakeShow = false;
            this.showBtn();
        },
        onAgreeChange() {
            this.showAgree = !this.showAgree;
            this.$sl("IsAgree", this.showAgree);
            this.showBtn();
        },
        onVerify(i, e) {
            let iphoneReg;
            if (i == 0) iphoneReg = /^([\u4e00-\u9fa5]{2,15})$/;
            if (i == 1)
                iphoneReg =/^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
            if (i == 2)
                iphoneReg = /^1[3-9]\d{9}$/;
            if (!iphoneReg.test(e)) this.formList[i].mistakeShow = true;
            else this.formList[i].mistakeShow = false;
        },
        onClickClose() {
            this.$emit("onAutonym");
        },
        async onClickSave() {
            post("/v1/user/authentication", {
                card_no: this.formList[1].inputValue,
                card_type: 1,
                name: this.formList[0].inputValue,
                tel: this.formList[2].inputValue,
            }).then((res) => {
                if (res.code) {
                    uni.$u.toast(res.message);
                } else {
                    uni.$u.toast("认证成功");
                    this.$emit("onAutonym");
                    this.asyncUpdateInfo();
                }
            });
        },
    },
};
</script>
<style lang='scss' scoped>
.pop_bg {
    width: 686rpx;
    height: 772rpx;
    margin: 0 auto;
    margin-top: 300rpx;
    background-color: #fff;
    border-radius: 16rpx;

    .p_head {
        position: relative;
        height: 136rpx;
        padding: 26rpx 36rpx;
        border-radius: 16rpx 16rpx 0 0;
        background: linear-gradient(104deg, #e1d6f8 0%, #f8e7ed 100%);
        .ico_img {
            position: absolute;
            top: 16rpx;
            right: 16rpx;
            width: 52rpx;
            height: 52rpx;
        }
        .t_title {
            font-weight: 800;
            font-size: 40rpx;
            color: #1c1c1c;
        }
    }

    .bottom_bg {
        padding: 60rpx 30rpx 0;
        position: relative;
        .search_list {
            margin-bottom: 32rpx;
            .text {
                white-space: nowrap;
                font-weight: 500;
                font-size: 28rpx;
                color: #1c1c1c;
            }
            .search_box {
                position: relative;
                margin-left: 32rpx;
                .input {
                    width: 420rpx;
                    height: 80rpx;
                    background: #e2e1e3;
                    padding-left: 20rpx;
                    border-radius: 16rpx 0 0 16rpx;
                    color: #383228;
                }
                .delete_icon {
                    width: 50rpx;
                    height: 80rpx;
                    background: #e2e1e3;
                    border-radius: 0 16rpx 16rpx 0;
                    .delete_img {
                        width: 42rpx;
                        height: 42rpx;
                        background: url("https://img.chaoshewang.com/matt/static/img/index/cha.png");
                        background-size: 100% 100%;
                    }
                }
                .pcs {
                    font-weight: bold;
                    font-size: 28rpx;
                    color: #ccceda;
                }
                .mistake {
                    position: absolute;
                    bottom: -34rpx;
                    left: 20rpx;
                    font-size: 28rpx;
                    color: red;
                }
            }
        }
    }
    .appoint {
        font-size: 24rpx;
        font-weight: 500;
        color: #615e74;
        margin: 36rpx 0 64rpx 30rpx;
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

        &.mar30 {
            margin-top: 38rpx;
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
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 24rpx;
        color: #615e74;
    }
}
</style>