export default {
    uiConfig: {
        // setNavHidden: "true", //是否隐藏导航栏，默认不隐藏（true：隐藏，false：不隐藏）
        // setSloganHidden: "true", //是否隐藏slogan文案，默认不隐藏（true：隐藏，false：不隐藏）
        setSwitchHidden: "true", //是否隐藏“切换方式”按钮（true：隐藏，false：不隐藏）
        setCheckboxHidden: "true", //是否隐藏隐私协议前面的勾选框（true：隐藏，false：不隐藏，如果隐藏代表用户强制同意协议，请谨慎使用）
        setBackgroundUi: {
            imageUrl: "https://img.shinemang.com/gachaStatic/static/login/login_bg.png",
        },
        //导航栏相关设置
        setNavUi: {
            text: "一键登录", //导航栏标题
            bgColor: '#9064FF', //导航栏背景色（注：只针对全屏生效，弹窗时无该属性）
        },
        setLogoUi: {
            imgPath: "static/login/logo.png", //logo图片资源路径
            width: "108", //该控件宽度，注意后面不要加单位（Android默认为dp，iOS默认为pt）
            height: "72" //该控件高度，注意后面不要加单位（Android默认为dp，iOS默认为pt）
        },
        setSloganUi: {
            text: "正品潮玩抽赏娱乐平台", //slogan标题，不设置则使用默认文案
            textColor: "#DFD2FF", //自定义slogan文字颜色
            textSize: "12", //文字大小，注意后面不要加单位（Android默认为sp，iOS默认为pt）
        },
        setNumberUi: {
            textColor: "#FFFFFF", //掩码文字颜色
        },
        setLoginBtnUi: {
            text: "本机号码一键登录", //登录按钮标题，不设置则使用默认
            textColor: "#414852", //登录按钮标题颜色
            imgPath: "static/login/btn_bg.png",
            width: "295",
            height: "62",
        },
    }
}