<template>
    <u-popup :show="popupShow" bgColor="transparent" :safeAreaInsetBottom="false">
        <div class="select_product_popup">
            <view class="tabs_two flex_r flex_jb" v-if="isfilt == 1">
                <view class="tab_item" :class="{ active: i.val == selectType }" @click="ontab(i.val)"
                    v-for="i in navbar" :key="i.val">{{ i.txt }}</view>
            </view>
            <img @click="onClose" src="https://img.shinemang.com/gachaStatic/static/img/transaction/close.png"
                class="close_btn" />
            <view class="p_lists">
                <div class="flex_r flex_jb">
                    <view>
                        <view class="teg cor_g">已选{{ selectNums }}个</view>
                        <view class="teg">赏品共{{ totalNums }}个</view>
                    </view>
                </div>
                <scroll-view scroll-y="true" class="list_box" :scroll-into-view="toView" @scroll="onScroll">
                    <template v-for="(i, s) in sliceList">
                        <div class="item_tit_select flex_r flex_ac flex_jb" :id="'a' + s" :key="s + '-' + i.itemId">
                            <div class="tit_l flex_r flex_ac flex_js" @click="SelectMulti(s, i.stockIds, i)">
                                <div class="icof cor" v-if="multiIds[s].length == i.stockIds.length">&#xe673;</div>
                                <div class="icof cor" v-else-if="multiIds[s].length">&#xe670;</div>
                                <div class="icof" v-else>&#xe671;</div>
                                <div class="g_name ellipsis"> {{ i.itemName }}</div>
                            </div>
                            <div class="tit_r flex_r flex_ac flex_je" @click="onShowUnfold(i, s)">
                                <span>{{ multiIds[s].length }}/{{ i.nums }}</span>
                                <span class="txt">{{ !i.unfold ? "展开" : "收起" }}</span>
                                <span :class="['icof', { rotate180: i.unfold }]">&#xe72d;</span>
                            </div>
                        </div>
                        <div :class="['lists', { collect: !i.unfold }]">
                            <view class="item" v-for="it in i.stockIds" :key="it"
                                @click.stop="SelectItem(s, it, i, i.stockIds)">
                                <img class="item_img" :src="i.itemCover" lazy-load="true" />
                              <img v-if="multiIds[s].includes(it)"
                                    src="https://img.shinemang.com/gachaStatic/static/img/shanggui/xuanzhong.png" class="box_ico"
                                    lazy-load="true" />
                                <img v-else src="https://img.shinemang.com/gachaStatic/static/img/shanggui/group_1.png"
                                    class="box_ico" lazy-load="true" /> 
                                    <!-- <div style="color: #9064FF;"  class="box_ico icof cor" v-if="multiIds[s].includes(it)">&#xe673;</div>
                                    <div  class="box_ico icof" v-else >&#xe671;</div> -->
                                   <view :style="{
                                        backgroundImage: `url(${i.saleType == 1?'https://img.shinemang.com/gachaStatic/chaogui/xianhuo.png':'https://img.shinemang.com/gachaStatic/chaogui/yushou.png'})`,
                                    }" class="item_txt1"></view>
                            </view>
                        </div>
                    </template>
                </scroll-view>
                <div class="popup_btn flex_r flex_ac">
                    <view class="all flex_r flex_ac" @click="onSelectAll">
                        <uni-icons v-if="isAllSelected" type="checkbox-filled" size="25" color="#23B408"></uni-icons>
                        <uni-icons v-else type="circle" size="25" color="#CCCEDA"></uni-icons>
                        <view class="text">全选</view>
                    </view>
                    <view class="btn "> <x-btn txt="确认" @click="confirmSelect" cor="1" /></view>
                </div>
            </view>
        </div>
    </u-popup>
</template>
<script>
import { post } from "@/utils/api.js";
import xBtn from "@/components/modules/x-btn";
export default {
    data() {
        return {
            navbar: [
                { txt: "全部", val: 0 },
                { txt: "现货", val: 1 },
                { txt: "预售", val: 2 },
            ],
            selectType: 0,
            selectNums: 0,
            totalNums: 0,
            multi: [],
            multiIds: [],
            multiinfo: [],
            popupShow: false,
            totalPrice: 0,
            toView: "a0",
            showList: 4,
            sliceList: [],
            addTotalPrice: 0,
            clientHeight: 0,
            gather: false,
            savedSelectedIds: [], // 跨tab切换时保存的已选stock ID列表
            savedMultiinfoMap: {}, // 跨tab切换时保存已选stock ID对应的商品详情 { [stockId]: { itemId, itemName, ... } }
        };
    },
    computed: {
        isAllSelected() {
            return this.selectNums > 0 && this.selectNums === this.totalNums;
        }
    },
    props: {
        isfilt: {
            type: String,
            default: "0", //0没有预售筛选 1有
        },
        typeClass: {
            type: String,
            default: "0",
        },
    },
    components: { xBtn },
    created() {
        this.getSubclassReward();
    },
    mounted() { },
    onLoad(da) { },

    methods: {
        // 清除所有已选状态
        clearSelectState() {
            this.multiIds = this.multi.map(() => []);
            this.multiinfo = this.multi.map(() => ({}));
            this.selectNums = 0;
            this.addTotalPrice = 0;
            this.savedSelectedIds = [];
            this.savedMultiinfoMap = {};
        },
        // 将当前 multiIds 中的选中项保存到 savedSelectedIds
        _saveCurrentSelections: function() {
            var ids = [];
            for (var i = 0; i < this.multiIds.length; i++) {
                var group = this.multiIds[i];
                for (var j = 0; j < group.length; j++) {
                    if (ids.indexOf(group[j]) === -1) {
                        ids.push(group[j]);
                    }
                }
            }
            this.savedSelectedIds = ids;
        },
        // 根据 savedSelectedIds 在当前列表中恢复选中状态，并补全 savedMultiinfoMap
        _restoreSelections: function() {
            if (!this.savedSelectedIds.length) return;
            this.selectNums = 0;
            this.addTotalPrice = 0;
            for (var i = 0; i < this.multi.length; i++) {
                var matchedIds = [];
                for (var j = 0; j < this.multi[i].stockIds.length; j++) {
                    var id = this.multi[i].stockIds[j];
                    if (this.savedSelectedIds.indexOf(id) !== -1) {
                        matchedIds.push(id);
                        // 补全商品详情映射（切换 tab 后可获取该 tab 商品的详情）
                        if (!this.savedMultiinfoMap[id]) {
                            this.savedMultiinfoMap[id] = {
                                itemId: this.multi[i].itemId,
                                itemName: this.multi[i].itemName,
                                itemCover: this.multi[i].itemCover,
                                saleType: this.multi[i].saleType,
                                recyclingPrice: this.multi[i].recyclingPrice,
                            };
                        }
                    }
                }
                if (matchedIds.length) {
                    this.$set(this.multiIds, i, matchedIds);
                    var da = JSON.parse(JSON.stringify(this.multi[i]));
                    da.stockIds = matchedIds;
                    this.multiinfo[i] = da;
                    this.selectNums += matchedIds.length;
                    if (this.totalPrice > 0) {
                        this.addTotalPrice += matchedIds.length * Number(da.recyclingPrice);
                    }
                }
            }
        },
        // 关闭弹窗
        onClose() {
            // this.clearSelectState();
            this.popupShow = false;
        },
        onScroll(e) {
            // detail.scrollHeight 列表总高度 1000个 高3036
            // detail.scrollTop 列表当前高度  可视高度 357
            // console.log(e, "触发");
            // if(e.target.scrollHeight -e.target.scrollTop <1000){
            // }
        },
        ontab(va) {
            this.selectType = va;
            this.getSubclassReward();
        },
        open(ids = [], nums = 0, index = false) {
            this.gather = index;
            this.totalPrice = nums;
            if (this.totalPrice !== 0) {
                this.popupShow = true;
                if (nums == -1) this.clearSelectState();
                return;
            }
            for (let i in this.multi) {
                this.multiIds[i] = [];
                this.multiinfo[i] = {};
            }
            for (const id of ids) {
                for (let i in this.multi) {
                    if (this.multi[i].stockIds.includes(id)) {
                        this.multiIds[i].push(id);
                        let da = JSON.parse(JSON.stringify(this.multi[i]));
                        da.stockIds = this.multiIds[i];
                        this.multiinfo[i] = da;
                    }
                }
            }

            this.selectNums = ids.length;
            this.savedSelectedIds = ids.slice(); // 同步初始已选ID
            // 根据当前 multi 数据初始化 savedMultiinfoMap
            this.savedMultiinfoMap = {};
            for (var _i = 0; _i < this.multi.length; _i++) {
                for (var _j = 0; _j < this.multi[_i].stockIds.length; _j++) {
                    var _id = this.multi[_i].stockIds[_j];
                    if (ids.indexOf(_id) !== -1) {
                        this.savedMultiinfoMap[_id] = {
                            itemId: this.multi[_i].itemId,
                            itemName: this.multi[_i].itemName,
                            itemCover: this.multi[_i].itemCover,
                            saleType: this.multi[_i].saleType,
                            recyclingPrice: this.multi[_i].recyclingPrice,
                        };
                    }
                }
            }
            this.popupShow = true;
        },
        getSubclassReward() {
            // this.sliceList = [];
            this.multi = [];
            this.multiinfo = [];
            post("v1/cabinet/stock/merge_list", {
                sale_type: this.typeClass > 0 ? this.typeClass : this.selectType,
            }).then((res) => {
                if (!res.code) {
                    this.totalNums = 0;
                    this.multi = JSON.parse(JSON.stringify(res.cabinetStocks));
                    res.cabinetStocks.forEach((it, s) => {
                        this.totalNums += it.stockIds.length;
                        this.multiIds[s] = [];
                        this.multiinfo[s] = {};
                        it.stockIds = it.stockIds.slice(0, 4);
                    });
                    if (this.selectType === 0) this.$emit("totalNums", this.totalNums);
                    this.sliceList = JSON.parse(JSON.stringify(res.cabinetStocks));
                    // 恢复切换前的选中状态
                    this._restoreSelections();
                }
            });
        },
        SelectItem(ix, id, da, list) {
            let ids = JSON.parse(JSON.stringify(this.multiIds[ix]));
            da = JSON.parse(JSON.stringify(da));
            if (ids.includes(id)) {
                let i = ids.indexOf(id);
                ids.splice(i, 1);
                // 实时从 savedSelectedIds 中移除
                var sIdx = this.savedSelectedIds.indexOf(id);
                if (sIdx !== -1) this.savedSelectedIds.splice(sIdx, 1);
                // 从商品详情映射中移除
                delete this.savedMultiinfoMap[id];
                this.selectNums--;
            } else {
                this.selectNums++;
                ids.push(id);
                // 实时添加到 savedSelectedIds
                if (this.savedSelectedIds.indexOf(id) === -1) this.savedSelectedIds.push(id);
                // 保存商品详情到映射
                this.savedMultiinfoMap[id] = {
                    itemId: da.itemId,
                    itemName: da.itemName,
                    itemCover: da.itemCover,
                    saleType: da.saleType,
                    recyclingPrice: da.recyclingPrice,
                };
            }
            this.$set(this.multiIds, ix, ids);
            da.stockIds = ids;
            if (ids.length) this.multiinfo[ix] = da;
            else this.multiinfo[ix] = {};
            
            this.clickTotal();


        },
        SelectMulti(ix) {
            let all = this.multi[ix].stockIds;
            let da = this.multi[ix];
            let ids = JSON.parse(JSON.stringify(this.multiIds[ix]));
            da = JSON.parse(JSON.stringify(da));
            if (ids.length == all.length) {
                // 取消整组：从 savedSelectedIds 和 savedMultiinfoMap 中移除该组所有 ID
                for (var j = 0; j < all.length; j++) {
                    var sIdx = this.savedSelectedIds.indexOf(all[j]);
                    if (sIdx !== -1) this.savedSelectedIds.splice(sIdx, 1);
                    delete this.savedMultiinfoMap[all[j]];
                }
                this.selectNums -= ids.length;
                ids = [];
            } else {
                // 全选该组：向 savedSelectedIds 和 savedMultiinfoMap 添加缺失的 ID
                for (var j = 0; j < all.length; j++) {
                    if (this.savedSelectedIds.indexOf(all[j]) === -1) this.savedSelectedIds.push(all[j]);
                    if (!this.savedMultiinfoMap[all[j]]) {
                        this.savedMultiinfoMap[all[j]] = {
                            itemId: da.itemId,
                            itemName: da.itemName,
                            itemCover: da.itemCover,
                            saleType: da.saleType,
                            recyclingPrice: da.recyclingPrice,
                        };
                    }
                }
                this.selectNums += all.length;
                ids = all;
            }
            this.$set(this.multiIds, ix, ids);
            da.stockIds = ids;
            if (ids.length) this.multiinfo[ix] = da;
            else this.multiinfo[ix] = {};
            this.clickTotal();
        },
        confirmSelect() {
            if (this.gather) {
                // 从 savedMultiinfoMap 按 itemId 分组构建完整跨 tab 数据
                var grouped = {};
                var realTotalPrice = 0;
                for (var k = 0; k < this.savedSelectedIds.length; k++) {
                    var sid = this.savedSelectedIds[k];
                    var info = this.savedMultiinfoMap[sid];
                    if (info) {
                        if (!grouped[info.itemId]) {
                            grouped[info.itemId] = {
                                itemId: info.itemId,
                                itemName: info.itemName,
                                itemCover: info.itemCover,
                                saleType: info.saleType,
                                recyclingPrice: info.recyclingPrice,
                                stockIds: []
                            };
                        }
                        grouped[info.itemId].stockIds.push(sid);
                        if (this.totalPrice > 0) {
                            realTotalPrice += Number(info.recyclingPrice);
                        }
                    }
                }
                var filteredArr = [];
                for (var key in grouped) {
                    filteredArr.push(grouped[key]);
                }
                this.$emit("confirmSelect", filteredArr, realTotalPrice);
                // this.clearSelectState();
                this.popupShow = false;
                return;
            }
            // 使用 savedSelectedIds + savedMultiinfoMap 构建完整的跨页面选中数据
            let ids = this.savedSelectedIds.slice();
            let arr = [];
            for (var k = 0; k < ids.length; k++) {
                var id = ids[k];
                var info = this.savedMultiinfoMap[id];
                if (info) {
                    arr.push({
                        itemId: info.itemId,
                        id: id,
                        item: {
                            name: info.itemName,
                            coverThumb: info.itemCover,
                            saleType: info.saleType,
                            recyclingPrice: info.recyclingPrice,
                        },
                    });
                }
            }
            let list = this.totalPrice > 0 || this.totalPrice === -1 ? arr : arr.slice(0, 600);
            let idList = this.totalPrice > 0 || this.totalPrice === -1 ? ids : ids.slice(0, 600);
            this.$emit("confirmSelect", idList, list);
            // this.clearSelectState();
            this.popupShow = false;
        },
        onShowUnfold(i, s) {
            if (this.sliceList[s].nums <= 4) {
                uni.$u.toast("已显示全部");
                return;
            }
            i.unfold = !i.unfold;
            if (i.unfold) {
                this.sliceList[s].stockIds = this.multi[s].stockIds;
                this.sliceList.map((item) => {
                    if (item.unfold == true && item.itemId !== i.itemId) {
                        item.stockIds.slice(0, 4);
                        item.unfold = false;
                    }
                });
                setTimeout(() => {
                    this.toView = "a" + s;
                }, 10);
            } else {
                this.sliceList[s].stockIds = this.sliceList[s].stockIds.slice(0, 4);
            }
        },
        clickTotal() {
            this.selectNums = 0;
            this.addTotalPrice = 0;
            this.multiinfo.map((item) => {
                if (Object.keys(item).length !== 0) {
                    this.selectNums += item.stockIds.length;
                    if (this.totalPrice > 0) this.addTotalPrice += item.stockIds.length * Number(item.recyclingPrice);
                }
            });
            if (
                this.addTotalPrice >= this.totalPrice + this.totalPrice * 0.1 &&
                this.addTotalPrice !== 0
            ) {
                uni.$u.toast("集赏材料价格已溢出");
                return;
            }
            if (this.selectNums > 2000 && this.addTotalPrice) {
                uni.$u.toast("材料不可超出2000个！");
                return;
            }

        },
        onSelectAll() {
            var i, j, sIdx;
            if (this.isAllSelected) {
                // 取消全选：从 savedSelectedIds 和 savedMultiinfoMap 中移除当前 tab 所有 ID
                for (i = 0; i < this.multi.length; i++) {
                    for (j = 0; j < this.multi[i].stockIds.length; j++) {
                        sIdx = this.savedSelectedIds.indexOf(this.multi[i].stockIds[j]);
                        if (sIdx !== -1) this.savedSelectedIds.splice(sIdx, 1);
                        delete this.savedMultiinfoMap[this.multi[i].stockIds[j]];
                    }
                }
                this.multiIds = this.multi.map(() => []);
                this.multiinfo = this.multi.map(() => ({}));
                this.selectNums = 0;
            } else {
                // 全选：向 savedSelectedIds 和 savedMultiinfoMap 添加当前 tab 所有 ID
                for (i = 0; i < this.multi.length; i++) {
                    var _multiItem = this.multi[i];
                    for (j = 0; j < _multiItem.stockIds.length; j++) {
                        var _stockId = _multiItem.stockIds[j];
                        if (this.savedSelectedIds.indexOf(_stockId) === -1) {
                            this.savedSelectedIds.push(_stockId);
                        }
                        if (!this.savedMultiinfoMap[_stockId]) {
                            this.savedMultiinfoMap[_stockId] = {
                                itemId: _multiItem.itemId,
                                itemName: _multiItem.itemName,
                                itemCover: _multiItem.itemCover,
                                saleType: _multiItem.saleType,
                                recyclingPrice: _multiItem.recyclingPrice,
                            };
                        }
                    }
                }
                this.multiinfo = JSON.parse(JSON.stringify(this.multi));
                this.multiIds = this.multi.map(item => JSON.parse(JSON.stringify(item.stockIds)));
                this.selectNums = this.totalNums;
            }
            this.clickTotal();
        }
    },
};
</script>
<style lang="scss" scoped>
.lists {
    padding-top: 12rpx;
    @include grid(216rpx);

    &.collect {
        height: 216rpx;
        overflow: hidden;
    }

    .item {
        width: 216rpx;
        margin-bottom: 18rpx;
        position: relative;
        height: 216rpx;
        background-color: #fff;
         border-radius: 16rpx;
        .item_img {
            width: 192rpx;
            height: 192rpx;
            margin: 12rpx;
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

        .box_ico {
            position: absolute;
            width: 216rpx;
            height: 216rpx;
            top: 0;
            left: 0;
            z-index: 3;
        }

        .item_txt1 {
             color: #ffffff;
            font-size: 20rpx;
            position: absolute;
            right: -12rpx;
            top: -12rpx;
            z-index: 7;
            width: 60rpx;
            height: 32rpx;
            background-size: 100% 100%;
        }

        .item_txt {
            color: #ffffff;
            font-size: 22rpx;
            position: absolute;
            left: 6rpx;
            bottom: 2rpx;
        }
    }
}

.tabs_two {
    color: #fff;
    width: 372rpx;
    height: 76rpx;
    font-size: 28rpx;
    line-height: 28rpx;
    background: url("https://img.shinemang.com/gachaStatic/static/img/transaction/Rectangle.png");
    background-size: 100% 100%;
    position: absolute;
    top: -60rpx;
    left: 0;

    .tab_item {
        width: 156rpx;
        line-height: 60rpx;
        text-align: center;
        position: absolute;

        &:first-child {
            left: -16rpx;
        }

        &:nth-child(2) {
            right: 120rpx;
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
            background: url("https://img.shinemang.com/gachaStatic/static/img/transaction/tab_bg1.png");
            background-size: 100% 100%;
            font-size: 30rpx;
        }
    }
}

.select_product_popup {
    height: 80vh;
    position: relative;

    .item_tit_select {
        margin: 20rpx 0 12rpx;
        margin-bottom: 0;

        .tit_l {
            width: calc(100% - 180rpx);

            .icof {
                margin-right: 6rpx;
            }
        }

        .tit_r {
            width: 300rpx;
            font-size: 24rpx;
            color: #999;

            .icof {
                margin-top: 4rpx;
                margin-left: 6rpx;
                font-size: 28rpx;
            }

            .txt {
                margin-left: 12rpx;
            }
        }

        &:first-child {
            margin-top: 0;
        }

        .g_name {
            font-size: 26rpx;
            font-weight: bold;
            height: 26rpx;
            line-height: 26rpx;
        }

        .cor {
            color: $motif-color;
        }
    }

    .close_btn {
        position: absolute;
        right: 36rpx;
        top: -68rpx;
        width: 56rpx;
        height: 56rpx;
    }

    .p_lists {
        height: 100%;
        border-radius: 0 50rpx 0 0;
        background: #f4f4f4;
        padding: 30rpx 36rpx;
        position: relative;

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
    }

    .list_box {
        height: calc(100% - 166rpx);
        margin-top: 20rpx;
    }

    .popup_btn {
        margin-top: 20rpx;
        position: relative;
        width: 100%;

        .all {
            margin-right: auto;
            font-weight: bold;
            font-size: 28rpx;

            .text {
                margin-left: 12rpx;
            }
        }

        .btn {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            /* 保证不被左边覆盖 */
            z-index: 1;
        }
    }
}

.rotate180 {
    transform: rotate(180deg);
}
</style>