<template>
    <view class="l-dialer" :style="{ getStyle, 'pointer-events': forbid }">
        <view class="l-dialer__inner" :style="getDialStyle">
            <view class="l-dialer__inner-border" v-if="$slots.border">
                <slot name="border" />
            </view>
            <view
                class="l-dialer__inner-wrap"
                :style="{ border: ` 8rpx solid ${styleOpt.borderColo}` }"
            >
                <view
                    class="l-dialer__inner-item"
                    v-for="(item, index) in prizeList"
                    :key="index"
                    :style="[
                        getRotateAngle(index),
                        { pointerEvents: !isTurnIng ? 'auto' : 'none' },
                        { border: ` 4rpx solid  ${styleOpt.borderColo}` },
                    ]"
                >
                    <view
                        class="l-dialer__inner-content"
                        :style="[getCorrectAngle(index)]"
                    >
                        <slot
                            v-if="$slots.prize"
                            name="prize"
                            :item="item"
                            :even="index % 2"
                        ></slot>
                        <block v-else>
                            <view
                                class="l-dialer__inner-name ellipsis"
                                :style="[
                                    {
                                        fontSize: styleOpt.fontSize,
                                        color: styleOpt.textColor,
                                    },
                                ]"
                                @click="getThumb(item)"
                                >{{ item.name }}</view
                            >
                            <image
                                class="l-dialer__inner-img"
                                :src="item.thumb"
                                @click="getThumb(item)"
                            ></image>
                        </block>
                    </view>
                </view>
            </view>
        </view>
        <!--  -->
        <view class="l-dialer__pointer">
            <slot v-if="$slots && $slots.pointer" name="pointer" />
            <image
                :class="!isTurnIng ? 'heart' : ''"
                :src="btnImg"
                style="width: 208rpx; height: 208rpx"
                :style="pointerStyle"
                mode="widthFix"
                @tap="$emit('click')"
            />
        </view>
        <gachaDetails ref="gachaDetails" />
    </view>
</template>
<script>
import { post } from "@/utils/api.js";
export default {
    name: "l-dialer",
    emits: ["click", "done"],
    props: {
        size: {
            type: [String, Number],
            default: 300,
        },
        prizeList: {
            type: Array,
        },
        forbid: {
            type: String,
        },
        turns: {
            type: Number,
            default: 10,
        },
        duration: {
            type: Number,
            default: 3,
        },
        styleOpt: {
            type: Object,
            default: () => ({
                // 每一块扇形的背景色,默认值,可通过父组件来改变
                // $primary-1 $primary-2
                prizeBgColors: ["#fff0a3", "#fffce6"],
                // 每一块扇形的外边框颜色,默认值,可通过父组件来改变
                // primary-4
                borderColor: "#ffd752",
                textColor: "#000",
            }),
        },
        customStyle: {
            type: String,
        },
        btnImg: {
            type: String,
        },
        dialStyle: {
            type: String,
        },
        textColor: {
            type: String,
        },
        pointerStyle: {
            type: String,
            default: `width: 30%`,
        },
        showClick: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            // 开始转动的角度
            startRotateDegree: 0,
            // 设置指针默认指向的位置,现在是默认指向2个扇形之间的边线上
            rotateAngle: 0,
            rotateTransition: "",
            isTurnIng: false,
            forbidName: "pointervents",
        };
    },
    computed: {
        getStyleOpt() {
            const style = {
                // 每一块扇形的背景色,默认值,可通过父组件来改变
                prizeBgColors: ["#fff0a3", "#fffce6"],
                // 每一块扇形的外边框颜色,默认值,可通过父组件来改变
                borderColor: "#ffd752",
                textColor: "#000",
            };
            return Object.assign(style, this.styleOpt);
        },
        getRotateAngle() {
            return (index) => {
                const style = {
                    transform: `rotate(${
                        (360 / this.prizeList.length) * index
                    }deg) skewX(0deg) skewY(${
                        360 / this.prizeList.length - 90
                    }deg)`,
                    backgroundColor: `${
                        this.getStyleOpt.prizeBgColors[
                            index % this.getStyleOpt.prizeBgColors.length
                        ]
                    }`,
                    border: `${
                        this.getStyleOpt.borderColor &&
                        "1rpx solid " + this.getStyleOpt.borderColor
                    }`,
                };
                if (this.prizeList.length == 2) {
                    style["transform"] = index == 0 ? 0 : `rotate(270deg)`; //`rotate(${(360 / this.prizeList.length) * index}deg)`
                    style["top"] = 0;
                }
                return style;
                // return {
                // 	transform: `rotate(${(360 / this.prizeList.length) * index}deg) skewX(0deg) skewY(${360 / this.prizeList.length - 90}deg)`,
                // 	backgroundColor: `${this.styleOpt.prizeBgColors[index % this.styleOpt.prizeBgColors.length]}`,
                // 	border: `${this.styleOpt.borderColor && '1rpx solid ' + this.styleOpt.borderColor }`
                // }
            };
        },
        getCorrectAngle() {
            return (index) => {
                const style = {
                    transform: `skewY(${
                        90 - 360 / this.prizeList.length
                    }deg) skewX(0deg) rotate(${
                        180 / this.prizeList.length
                    }deg)`,
                };
                if (this.prizeList.length == 2) {
                    if (index == 0) {
                        style["transform"] = `rotate(90deg)`;
                        style["bottom"] = 0;
                    } else {
                        style["transform"] = `rotate(0deg)`;
                        style["left"] = 0;
                        style["bottom"] = "-50%";
                    }
                }
                return style;
            };
        },
        getStyle() {
            let { size, customStyle, forbid } = this;
            //addUnit(size)//
            size = /\d$/.test(size) ? size + "px" : size;
            return `width: ${size}; height: ${size}; ${customStyle}`;
        },
        getDialStyle() {
            return `
				padding: ${this.getStyleOpt.padding};
				transform: ${this.rotateAngle};
				transition: ${this.rotateTransition};
				${this.dialStyle}
			`;
        },
    },
    methods: {
        // 转动起来
        run(index) {
            if (this.isTurnIng) return;
            const duration = this.duration;
            const length = this.prizeList.length;
            const rotateAngle =
                this.startRotateDegree +
                this.turns * 360 +
                360 -
                (180 / length + (360 / length) * index) -
                (this.startRotateDegree % 360);
            this.startRotateDegree = rotateAngle;
            this.rotateAngle = `rotate(${rotateAngle}deg)`;
            this.rotateTransition = `transform ${duration}s cubic-bezier(0.250, 0.460, 0.455, 0.995)`;
            this.isTurnIng = true;
            setTimeout(() => {
                this.$emit("done", index);
                this.isTurnIng = false;
            }, duration * 1000 + 500);
        },
        getThumb(item) {
            if (["Coupon", "Coin"].includes(item.type)) return;
            this.gachaDetailsMethod(this, item.value);
        },
        someMethod() {
            this.startRotateDegree = 0;
            this.rotateAngle = 0;
            this.rotateTransition = "";
            this.isTurnIng = false;
        },
    },
};
</script>
<style lang="scss" scoped>
@import "./index";
.l-dialer__inner-item {
    // border: 4rpx solid #edca8c !important;
    pointer-events: auto;
}
.forbid {
    pointer-events: none;
    opacity: 0.6;
}
</style>
