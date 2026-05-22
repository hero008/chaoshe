import { post } from "@/utils/api.js"
let levels = []
post("v1/gacha/level/list").then(res => {
    levels = res.levels
})

// 赏级
function levelNum(va) {
    for (const it of levels) {
        if (it.index == va) return it.name
    }
}

// 优惠券使用条件
function userange(da) {
    let playType = ['一番赏', '扭蛋机', '潮游赏', '洞洞乐', '芒盒赏']
    switch (da.va) {
        case 2:
            return '仅' + playType[da.target - 1] + '可用'
        case 3:
            return '仅' + da.name + '可用'
        case 4:
            return '仅' + da.name + '可用'
        default:
            return "无限制"
    }
}
// 头像适应
function active(va) {
    if (!va) return;
    let str = process.env.VUE_APP_IMG_URL;
    let prefix = va.slice(0, 7); // "avatars"
    return prefix == "avatars" ? str + va : va
}
//*姓名脱敏
function tmName(val) {
    if (!val) return;
    val = val.replace(/^\s+|\s+$/g, "");
    if (val && val.length == 2) {
        return val.replace(/^(.{1}).*(.{1})$/, "$1*");
    } else if (val && val.length > 2) {
        return val.replace(/^(.{1}).*(.{1})$/, "$1***$2");
    } else {
        return val;
    }
}

export default {
    levelNum,
    userange,
    active,
    tmName,
};