<template>
    <view class="tabBarBoxs">
       <view
            class="tab_item"
            :style="{
                '--defaultcolor': tabBarStyle.defaultcolor,
                '--selectcolor': tabBarStyle.selectListTxtColor,
                '--defaultfontsizi': tabBarStyle.defaultFontSizi,
            }"
            v-for="item in this.SystemInfo.uniPlatform == 'app'
                ? filteredTodos
                : tabBarStyle.list"
            @tap="change(item.va), pagesChange(item)"
            :key="item.va"
            :class="[
                tabBarStyle.selectIndex == item.va
                    ? animationIcon
                        ? 'animationIcons'
                        : 'animationIconsBig'
                    : '',
            ]"
        >
            <view class="imageBox">
                <image
                    :src="item.image"
                    v-if="tabBarStyle.selectIndex != item.va"
                ></image>
                <image :src="item.selectImage" v-else></image>
                <text
                    class="icons"
                    v-if="item.icon > 0 && tabBarStyle.iconNumber[index] == 1"
                    >{{ item.icon }}</text
                >
            </view>
            <text
                :class="{ listTxtColors: tabBarStyle.selectIndex == item.va }"
                >{{ item.txt }}</text
            >
        </view>
        <mp-privacy
            title="集市服务协议"
            ref="mpPrivacy"
            type="3"
            @authChange="authChange"
        />
    </view>
</template>
<script>
import { mapState } from "vuex";
import mpPrivacy from "@/components/modules/mp-privacy.vue";
import { getWebSocket } from "../../utils/webSocket";
export default {
    props: {
        tbStyle: Object,
        iconNumbers: Object,
        animationIcon: Boolean,
        swiperCurrent: Number,
        onEven: Function,
    },
    name: "tabBar",
    components: { mpPrivacy },
    data() {
        return {
            tabBarStyle: {
                list: [
                    // #ifndef MP-WEIXIN
                    {
                        image: "/static/tabBar/tab1-1.png",
                        selectImage: "/static/tabBar/tab1-2.png",
                        txt: "潮玩",
                        va: 0,
                        isVisible: true,
                    },

                    {
                        image: "/static/tabBar/tab2-1.png",
                        selectImage: "/static/tabBar/tab2-2.png",
                        txt: "集市",
                        va: 1,
                        isVisible: false,
                    },
                    // #endif
                    {
                        image: "/static/tabBar/tab3-1.png",
                        selectImage: "/static/tabBar/tab3-2.png",
                        txt: "首页",
                        va: 2,
                        isVisible: true,
                    },
                    {
                        image: "/static/tabBar/tab4-1.png",
                        selectImage: "/static/tabBar/tab4-2.png",
                        txt: "潮柜",
                        va: 3,
                        isVisible: true,
                    },
                    {
                        image: "/static/tabBar/tab5-1.png",
                        selectImage: "/static/tabBar/tab5-2.png",
                        txt: "我的",
                        va: 4,
                        isVisible: true,
                    },
                ],
                defaultcolor: "#666", //默认字体颜色
                selectListTxtColor: "#9064FF", //选中后字体颜色
                defaultFontSizi: "12px", //字体大小
                selectIndex: 2, //选中之后得下标
                iconNumber: [], //小角标显示的地方，跟list的下标一致
                popupShown: false,
            },
            // iconAnimation: true, //是否动画
        };
    },
    created() {
        this.tabBarStyle = Object.assign(this.tabBarStyle, this.tbStyle); //合并传值对象,没有传值得对象就给已有得默认值
        for (let num of this.tabBarStyle.list) {
            this.tabBarStyle.iconNumber.push(0);
        }
        // this.iconAnimation = this.animationIcon;//动画开关
        // this.getIconNumber(this.iconNumbers);
    },
    onLoad() {},
    methods: {
        //点选事件
        change(index) {
            this.$emit("currentChange", index);
            this.tabBarStyle.selectIndex = index;
            uni.setStorageSync("currentChange", index);
            // 显示集市
            // #ifndef MP-WEIXIN
            this.popupShown = uni.getStorageSync("popupShownTow");
            if (index == 1 && !this.popupShown) {
                this.$refs.mpPrivacy.open();
                uni.getStorageSync("popupShownTow");
            }
            if (
                index == 2 &&
                !this.popupWebSocket &&
                this.SystemInfo.uniPlatform == "app" &&
                uni.getStorageSync("aToken")
            ) {
                getWebSocket(this);
            }
            // #endif
        },
        upindex(index) {
            this.tabBarStyle.selectIndex = index;
        },
        //角标的处理函数
        getIconNumber(data) {
            this.tabBarStyle.iconNumber[data.sort] = 1;
            this.tabBarStyle.list[data.sort].icon = data.num;
        },
        //仿页面切换按钮
        pagesChange(da) {
            this.$emit("pagesChange", da);
        },
        authChange(bo) {
            if (!bo) {
                uni.$u.toast("您拒绝了协议！");
                this.change(2);
            } else {
                uni.setStorageSync("popupShownTow", bo);
                this.popupShown = uni.getStorageSync("popupShownTow");
            }
        },
    },
    computed: {
        // #ifndef MP-WEIXIN
        ...mapState(["userInfo", "popupWebSocket"]),
        filteredTodos() {
            return this.tabBarStyle.list.filter((todo) =>
                todo.txt == "集市"
                    ? (todo.isVisible = this.userInfo.showMarket)
                    : todo.isVisible
            );
        },
        // #endif
    },
};
</script>
<style scoped lang="scss">
.tabBarBoxs {
    position: fixed;
    z-index: 990;
    bottom: 0;
    left: 0;
    height: 130rpx;
    width: 100%;
    background-color: #fff;
    display: flex;
    padding: 5rpx 0 30rpx;
    border-top: 2rpx solid #ddd;
}

.tab_item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    font-size: var(--defaultfontsizi) !important;
    color: var(--defaultcolor) !important;

    .imageBox {
        width: 90rpx;
        height: 60rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    image {
        width: 48rpx;
        height: 48rpx;
    }

    .icons {
        width: 35rpx;
        height: 35rpx;
        border-radius: 50%;
        font-size: 20rpx;
        color: #fff;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        z-index: 99;
        top: 5rpx;
        right: 5rpx;
        background-color: red;
    }

    .listTxtColors {
        color: var(--selectcolor) !important;
        font-weight: 600;
    }
}

@keyframes myFn {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.5);
    }

    100% {
        transform: scale(1);
    }
}

.animationIcons {
    animation: myFn 0.6s;
}

@keyframes myFns {
    0% {
        transform: scale(1);
    }

    100% {
        transform: scale(1.25);
    }
}

@keyframes myFn1 {
    0% {
        transform: scale(1);
    }

    100% {
        padding-bottom: 8rpx;
        transform: scale(1.1);
    }
}

.animationIconsBig {
    .listTxtColors {
        padding-bottom: 8rpx;
        transform: scale(1.1);
        animation: myFn1 0.3s;
    }

    image {
        border-top: 2rpx solid #ddd;
        padding: 15rpx 32rpx;
        transform: scale(1.26);
        position: absolute;
        top: -28rpx;
        background-color: #fff;
        border-radius: 50%;
        animation: myFns 0.3s;
    }
}
</style>