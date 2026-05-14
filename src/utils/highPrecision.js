export default {
    //加法函数
    Add: function (arg1, arg2) {
        let r1, r2, m, n;
        // 获取每个参数的小数的位数
        try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
        try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
        // 计算底数为10以最大小数位数为次幂的值
        m = Math.pow(10, Math.max(r1, r2));
        //精度长度以最大小数位数为长度
        n = (r1 >= r2) ? r1 : r2;
        // 把所有参数转为整数后相加再除以次幂的值
        return ((arg1 * m + arg2 * m) / m).toFixed(n);
    },
    //减法函数
    Sub: function (arg1, arg2) {
        let r1, r2, m, n;
        // 获取每个参数的小数的位数
        try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
        try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
        // 计算底数为10以最大小数位数为次幂的值
        m = Math.pow(10, Math.max(r1, r2));
        //精度长度以最大小数位数为长度
        n = (r1 >= r2) ? r1 : r2;
        return ((arg1 * m - arg2 * m) / m).toFixed(n);
    },
    //乘法函数
    Mul: function (arg1, arg2) {
        arg1 = Number(arg1)
        arg2 = Number(arg2)
        let m = 0, s1 = arg1.toString(), s2 = arg2.toString();
        // 获取所有参数小数位长度之和
        try { m += s1.split(".")[1].length } catch (e) { }
        try { m += s2.split(".")[1].length } catch (e) { }
        // 替换掉小数点转为数字相乘再除以10的次幂值
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    },
    //除法函数
    Div: function (arg1, arg2) {
        let t1 = 0, t2 = 0, r1, r2;
        // 获取每个参数的小数的位数
        try { t1 = arg1.toString().split(".")[1].length } catch (e) { }
        try { t2 = arg2.toString().split(".")[1].length } catch (e) { }
        // 把所有参数的小数点去掉转为整数
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return (r1 / r2) * Math.pow(10, t2 - t1);
    },
}