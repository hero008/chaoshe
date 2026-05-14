<template>
    <div class="luckEntrance" @click="goto('/page-a/luck/index')" :style="{top:topNum+'rpx'}"  >
        <!-- <img
            src="https://img.chaoshewang.com/static/img/luck/ou_ico.png"
            class="ou_ico"
        />
        <div class="luck_num ellipsis">{{ point }}</div> -->
         <img src="https://img.chaoshewang.com/static/img/luck/jishangzhongxin.png" class="ou_ico1">
    </div>
</template>

<script>
// import { post } from "@/utils/api.js";
// import { mapState } from "vuex";
export default {
    data() {
        return {
            point: 0,
        };
    },
    props: {
        topNum: {
            type: Number,
            default:0,
        },
    },
    computed: {
        // ...mapState(["userInfo"]),
    },
    created() {
        // this.loadDetail();
    },
    mounted() {},
    methods: {
        // loadDetail() {
        //         console.log('测试');
        //     post("v1/activity/cost-award/point", {
        //         user_id: this.userInfo.id,
        //     }).then((res) => {
        //         if (!res.code) {
        //             this.point = res.point;
        //         }
        //     });
        // },
    },
};
</script>

<style lang="scss" scoped>
.luckEntrance {
    width: 120rpx;
    z-index: 999;
    /* #if MP */
    position: fixed;
    right: 0;
    /* #endif */
    .ou_ico {
        width: 120rpx;
        height: 126rpx;
    }
     .ou_ico1{
        width: 136rpx;
        height: 136rpx;
    }
    .luck_num {
        position: absolute;
        width: 86rpx;
        left: 17rpx;
        top: 80rpx;
        font-weight: 800;
        color: #fff;
        font-size: 20rpx;
        text-align: center;
        border-radius: 20rpx;
        border: 2rpx solid #f6c084;
        background: linear-gradient(0deg, #dd91ff, #8c47bb);
        box-shadow: 0rpx 4rpx 4rpx 0rpx #9b2700;
    }
}
</style>