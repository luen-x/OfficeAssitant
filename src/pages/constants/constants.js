let userConfig;
if (process.env.NODE_ENV === 'development') {
	userConfig = require('../../../config/user.config');
}

/**
 * 目前在开发环境可以使用Redux Devtools。
 * 可以在src/page/xxx/constatns/constants.js中的DEBUG里控制开关
 * true开启，false关闭。
 */
export const DEBUG = !0;
/**
 * 开发模式结合PHP后端
 * true开启，false关闭
 * 即!0后端。!1前端:3000端口
 */
export const DEV_WITH_SERVER = !0;

/**
 * 根路由
 */
export const PRE_ROUTER_URL = process.env.NODE_ENV === 'development'
	? '/'
	: '/';
/**
 * 开发环境后端BaseUrl
 */
export const devBaseUrl = {
	dev: 'https://oa2.ruishan666.com',
	'dev-test': 'https://oa2-test.ruishan666.com',
	pre: 'https://oa2-pre.ruishan666.com',
	master: 'https://oa.weiyian.com'
};


/**
 * websocket地址
 */
const prodUrl = {
	'testoa': 'ws://114.55.42.199:7273',
	'oa': 'ws://pk-oa.weiyian.com/wss/',
	'wyaoa-new': 'wss://oa2.ruishan666.com/socket/',
	'oa2': 'wss://oa2.ruishan666.com/socket/',
	'oa3': 'wss://oa3.ruishan666.com/socket/',
};
const prodOSSUrl = {
	'oa': 'https://wya-oa.oss-cn-hangzhou.aliyuncs.com',
	'default': 'https://wyatest.oss-cn-hangzhou.aliyuncs.com',
};
// 文件上传地址
export const OSS_FILE_URL = process.env.NODE_ENV === 'production'
	? prodOSSUrl[location.host.split('.')[0]] || prodOSSUrl.default
	: prodOSSUrl.default;

export const URL_WEBSOCKET = (function () {
	if (process.env.NODE_ENV === 'production') return `wss://${location.host}/socket/`;
	else if (userConfig.env === 'dev') return `wss://oa2.ruishan666.com/socket/`;
	else if (userConfig.env === 'dev-test') return `wss://oa2-test.ruishan666.com/socket/`;
	
}()); 
	
// export const CALL_WEBSOCKET = "wss://pk-oa.ruishan666.com/yscrm/";
export const CALL_WEBSOCKET = "wss://oa-call.weiyian.com/yscrm/";

// export const M_PK_URL = 'https://oa2-pk.ruishan666.com/mpk/scene';
const mPKUrl = {
	'oa': "https://pk-oa.weiyian.com/mpk/scene",
	'oa2-pre': 'https://oa2-pre-pk.ruishan666.com/mpk/scene',
	"default": 'https://oa2-pk.ruishan666.com/mpk/scene'
};
export const M_PK_URL = process.env.NODE_ENV === 'production'
	? mPKUrl[location.host.split('.')[0]] || mPKUrl.default
	: mPKUrl.default;

const mHRUrl = {
	'oa': "https://m.weiyian.com",
	"default": 'https://oa2-zp.ruishan666.com'
};
export const M_HR_URL = process.env.NODE_ENV === 'production'
	? mHRUrl[location.host.split('.')[0]] || mHRUrl.default
	: mHRUrl.default;
/**
 * OSS 阿里云图片地址
 */
const OSS_BASE_URL = 'https://wya-oa.oss-cn-hangzhou.aliyuncs.com/common/';
export const OSS_LOGIN_BG01 = `${OSS_BASE_URL}login-bg-01.jpg`;
export const OSS_LOGIN_BG02 = `${OSS_BASE_URL}login-bg-02.jpg`;
export const OSS_LOGIN_BG03 = `${OSS_BASE_URL}login-bg-03.jpg`;
export const OSS_LOGIN_BG04 = `${OSS_BASE_URL}login-bg-04.jpg`;
export const OSS_ACTIVE = `${OSS_BASE_URL}activity.png`;
export const OSS_CALENDAR_BG = `${OSS_BASE_URL}calendar-bg.png`;
export const OSS_EMPTY = `${OSS_BASE_URL}empty.png`;
export const OSS_ENERGY_BALL = `${OSS_BASE_URL}energy-ball.png`;
// export const OSS_FILE = `${OSS_BASE_URL}file.png`;
export const OSS_FLOW = `${OSS_BASE_URL}flow.png`;// 招商引流班
export const OSS_INVOICE_EMPTY = `${OSS_BASE_URL}invoice-empty.png`;

export const OSS_NO_MESSAGE = `${OSS_BASE_URL}no-message.png`;
export const OSS_NO_MESSAGE01 = `${OSS_BASE_URL}no-message-01.png`;
export const OSS_NO_MESSAGE02 = `${OSS_BASE_URL}no-message-02.png`;
export const OSS_NO_MESSAGE03 = `${OSS_BASE_URL}no-message-03.png`;
export const OSS_NO_MESSAGE04 = `${OSS_BASE_URL}no-message-04.png`;
export const OSS_NO_MESSAGE05 = `${OSS_BASE_URL}no-message-05.png`;
export const OSS_NO_MESSAGE06 = `${OSS_BASE_URL}no-message-06.png`;
export const OSS_NO_MESSAGE07 = `${OSS_BASE_URL}no-message-07.png`;
export const OSS_NO_MESSAGE08 = `${OSS_BASE_URL}no-message-08.png`;

export const OSS_NOBASE = `${OSS_BASE_URL}nobase.png`;
export const OSS_PIC_BG_DARK = `${OSS_BASE_URL}pic-bg-dark.png`;
export const OSS_PIC_BG_LIGHT = `${OSS_BASE_URL}pic-bg-light.png`;
export const OSS_PIC_JIN = `${OSS_BASE_URL}pic-jin.png`;
export const OSS_PIC_YIN = `${OSS_BASE_URL}pic-yin.png`;
export const OSS_PK = `${OSS_BASE_URL}pk.png`;
export const OSS_SEARCH_LOGO = `${OSS_BASE_URL}search_logo.png`;
export const OSS_SEARCH_EMPTY = `${OSS_BASE_URL}search-empty.png`;
export const OSS_STAFF_EMPTY = `${OSS_BASE_URL}staff-empty.png`;
export const OSS_NOTICE_EMPTY = `${OSS_BASE_URL}notice-empty.png`;
export const OSS_START = `${OSS_BASE_URL}start.png`;
export const OSS_TEST = `${OSS_BASE_URL}test.png`;
export const OSS_WYA_LOGO_WDS = `${OSS_BASE_URL}wya-logo-wds.png`;
export const OSS_WYA_LOGO_R = `${OSS_BASE_URL}wya-logo-r.png`;
export const OSS_WYA_LOGO = `${OSS_BASE_URL}wya-logo.png`;
export const OSS_WYA_LOGO01 = `${OSS_BASE_URL}wya-logo01.png`;
export const OSS_SERVICE = `${OSS_BASE_URL}service.jpg`;
export const OSS_SEARCH_CUSTOMER = `${OSS_BASE_URL}search-customer.png`;
export const OSS_NOT_FOUND = `${OSS_BASE_URL}bear.png`;
export const OSS_PIC_PK = `${OSS_BASE_URL}pic-pk.jpg`;
export const OSS_RED_BG_PK = `${OSS_BASE_URL}red-bg.png`;
export const OSS_SLOGAN = `${OSS_BASE_URL}serve.png`;
export const OSS_TIP_TAG = `${OSS_BASE_URL}tip-tag.png`;
export const OSS_EMPTY1 = `${OSS_BASE_URL}empty1.png`;
export const OSS_NO = `${OSS_BASE_URL}no.png`;
export const OSS_REJECT = `${OSS_BASE_URL}reject.png`;
export const OSS_PASS = `${OSS_BASE_URL}pass.png`;
export const OSS_WAIT_CONFIRM = `${OSS_BASE_URL}wait-confirm.png`;
export const OSS_IOS_QRCODE = `${OSS_BASE_URL}IOS.png`;
export const OSS_ANDROID_QRCODE = `${OSS_BASE_URL}Android.png`;
export const OSS_TIP_BG01 = `${OSS_BASE_URL}tip-bg-01.png`;
export const OSS_PLAYING = `${OSS_BASE_URL}playing.gif`;
export const OSS_UPLOAD01 = `${OSS_BASE_URL}upload01.png`;

export const OSS_TEMPLATE_FILE01 = `${OSS_BASE_URL}导入客户模版.xlsx`;
export const OSS_TEMPLATE_FILE02 = `${OSS_BASE_URL}梯队人员名单导入模板.xlsx`;
export const OSS_TEMPLATE_FILE03 = `${OSS_BASE_URL}试卷库导入模板.xls`;
export const OSS_TEMPLATE_FILE04 = `${OSS_BASE_URL}题库导入模板.xls`;


// 抽奖
export const OSS_LUCKDRAW_BG01 = `${OSS_BASE_URL}luckdraw-bg01.png`;
export const OSS_LUCKDRAW_BG02 = `${OSS_BASE_URL}luckdraw-bg02.png`;
export const OSS_LUCKDRAW_BG03 = `${OSS_BASE_URL}luckdraw-bg03.png`;
export const OSS_LUCKDRAW_BG04 = `${OSS_BASE_URL}luckdraw-bg04.png`;
export const OSS_LUCKDRAW_BG05 = `${OSS_BASE_URL}luckdraw-bg05.png`;
export const OSS_LUCKDRAW_BG06 = `${OSS_BASE_URL}luckdraw-bg06.png`;
export const OSS_LUCKDRAW_ICON01 = `${OSS_BASE_URL}luckdraw-icon01.png`;
export const OSS_LUCKDRAW_ICON02 = `${OSS_BASE_URL}luckdraw-icon02.png`;
export const OSS_LUCKDRAW_ICON03 = `${OSS_BASE_URL}luckdraw-icon03.png`;
export const OSS_LUCKDRAW_ICON04 = `${OSS_BASE_URL}luckdraw-icon04.png`;
export const OSS_LUCKDRAW_ICON05 = `${OSS_BASE_URL}luckdraw-icon05.png`;
export const OSS_LUCKDRAW_ICON06 = `${OSS_BASE_URL}luckdraw-icon06.png`;
export const OSS_LUCKDRAW_ICON07 = `${OSS_BASE_URL}luckdraw-icon07.png`;
export const OSS_LUCKDRAW_ICON08 = `${OSS_BASE_URL}luckdraw-icon08.png`;

// 考试
export const OSS_EXAM_ICON01 = `${OSS_BASE_URL}exam-icon01.png`;
export const OSS_EXAM_ICON02 = `${OSS_BASE_URL}exam-icon02.png`;
export const OSS_EXAM_ICON03 = `${OSS_BASE_URL}exam-icon03.png`;
export const OSS_EXAM_ICON04 = `${OSS_BASE_URL}exam-icon04.png`;
export const OSS_EXAM_BG01 = `${OSS_BASE_URL}exam-bg01.png`;

// 道具
export const OSS_PROP_BG_M01 = `${OSS_BASE_URL}prop_bg_m01.png`;
export const OSS_PROP_BG_M02 = `${OSS_BASE_URL}prop_bg_m02.png`;
export const OSS_PROP_BG_M03 = `${OSS_BASE_URL}prop_bg_m03.png`;
export const OSS_PROP_BG_M04 = `${OSS_BASE_URL}prop_bg_m04.png`;
export const OSS_PROP_BG_M05 = `${OSS_BASE_URL}prop_bg_m05.png`;
export const OSS_PROP_BG_M06 = `${OSS_BASE_URL}prop_bg_m06.png`;
export const OSS_PROP_BG_M07 = `${OSS_BASE_URL}prop_bg_m07.png`;
export const OSS_PROP_BG_S01_ = `${OSS_BASE_URL}prop_bg_s01.png`;
export const OSS_PROP_BG_S02 = `${OSS_BASE_URL}prop_bg_s02.png`;
export const OSS_PROP_BG_S03 = `${OSS_BASE_URL}prop_bg_s03.png`;
export const OSS_PROP_BG_S04 = `${OSS_BASE_URL}prop_bg_s04.png`;
export const OSS_PROP_BG_S05 = `${OSS_BASE_URL}prop_bg_s05.png`;
export const OSS_PROP_BG_S06 = `${OSS_BASE_URL}prop_bg_s06.png`;
export const OSS_PROP_BG_S07 = `${OSS_BASE_URL}prop_bg_s07.png`;
export const OSS_PROP_BG_L01 = `${OSS_BASE_URL}prop_bg_l01.png`;
export const OSS_PROP_BG_L02 = `${OSS_BASE_URL}prop_bg_l02.png`;
export const OSS_PROP_BG_L03 = `${OSS_BASE_URL}prop_bg_l03.png`;
export const OSS_PROP_BG_L04 = `${OSS_BASE_URL}prop_bg_l04.png`;
export const OSS_PROP_BG_L05 = `${OSS_BASE_URL}prop_bg_l05.png`;
export const OSS_PROP_BG_L06 = `${OSS_BASE_URL}prop_bg_l06.png`;
export const OSS_PROP_BG_L07 = `${OSS_BASE_URL}prop_bg_l07.png`;

export const OSS_PROP_BG_01 = `${OSS_BASE_URL}prop_bg_01.png`;
export const OSS_PROP_ICON1 = `${OSS_BASE_URL}prop_icon01.png`;
export const OSS_PROP_ICON2 = `${OSS_BASE_URL}prop_icon02.png`;
export const OSS_PROP_ICON3 = `${OSS_BASE_URL}prop_icon03.png`;
export const OSS_PROP_ICON4 = `${OSS_BASE_URL}prop_icon04.png`;
export const OSS_PROP_ICON5 = `${OSS_BASE_URL}prop_icon05.png`;
export const OSS_PROP_ICON6 = `${OSS_BASE_URL}prop_icon06.png`;
export const OSS_PROP_ICON7 = `${OSS_BASE_URL}prop_icon07.png`;

export const OSS_RANK_ICON1 = `${OSS_BASE_URL}rank_icon01.png`;
export const OSS_RANK_ICON2 = `${OSS_BASE_URL}rank_icon02.png`;
export const OSS_RANK_ICON3 = `${OSS_BASE_URL}rank_icon03.png`;
export const OSS_RANK_ICON4 = `${OSS_BASE_URL}rank_icon04.png`;

// 微信授权地址
export const WX_AUTHORIZE = 'https://open.weixin.qq.com/connect/oauth2/authorize';





/**
 * 月份
 */
export const MONTH_EN = {
	'January': '01',
	'February': '02',
	'March': '03',
	'April': '04',
	'May': '05',
	'June': '06',
	'July': '07',
	'August': '08',
	'September': '09',
	'October': '10',
	'November': '11',
	'December': '12',
};
export const MONTH_CN = {
	'一月': '01',
	'二月': '02',
	'三月': '03',
	'四月': '04',
	'五月': '05',
	'六月': '06',
	'七月': '07',
	'八月': '08',
	'九月': '09',
	'十月': '10',
	'十一月': '11',
	'十二月': '12',
};