// -- 微一案工具库 --
export * from 'wya-utils';
import { getItem, changeObjRegex, setItem } from 'wya-utils';
import moment from 'moment';
import { getChunks } from '@components/layout/chunks';


// -- end --
/**
 * 改写wya-utils里表单验证的正则
 */
changeObjRegex({
	validURLScheme: {
		regex: /[a-zA-z]+:\/\/[^\s]*/,
		error: "请填写正确网页地址协议"
	},
	validUrl: {
		regex: /^.{3,150}$/,
		error: "请填写正确网页地址"

	},
	validLetterAndNumber: {
		regex: /^[A-Za-z0-9]{1,}$/,
		error: "请输入字母和数字"
	},
	validSocialCode: {
		regex: /^[A-Za-z0-9-]{1,50}$/,
		error: "请输入字母和数字"
	},
	validPhone: {
		regex: /^([0][0-9]{2,3}-?)?[2-8]{1}[0-9]{6,7}$/,
		error: "请填写正确的电话号码"
	},
	validMobile: {
		regex: /^(13[0-9]|14[5|7]|15[^4|^\D]|17[0-9]|19[1|8|9]|16[5-7]|18[0-9])\d{8}$/,
		error: "请填写正确的手机号码"
	},
	validTel: {
		// eslint-disable-next-line max-len
		regex: /(^([0][0-9]{2,3}-?)?[2-8]{1}[0-9]{6,7}$)|(^(13[0-9]|14[5|7]|15[^4|^\D]|17[0-9]|19[1|8|9]|16[5-7]|18[0-9])\d{8}$)|(^[48][0-9]{2,3}-?[0-9]{3,4}-?[0-9]{2,4}$)/,
		error: "请填写正确的电话号码"
	},
	validHotLine: {
		regex: /^[48][0-9]{2,3}-?[0-9]{3,4}-?[0-9]{2,4}$/,
		error: "电话号码不正确"
	},
	validSiteNum: {
		regex: /^[0-9]{4,5}$/,
		error: '坐席号格式不正确'
	},
	validCompellation: {
		regex: /^[A-Za-z\u4e00-\u9fa5_-]{1,}$/,
		error: "请不要输入数字和特殊字符"
	},
	validIDCards: {
		regex: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
		error: "身份证输入有误"
	},
	validName: {
		regex: /^[\u4e00-\u9fa5a-zA-Z]*$/,
		error: "只能输入中文和字母"
	},
	validEmail: {
		// regex: /^[a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-zA-Z0-9]+$/,
		regex: /^.{1,80}@.{1,20}$/,
		error: "邮箱格式不正确"
	},
	validWeChat: {
		regex: /^[-_a-zA-Z0-9]{6,30}$/,
		error: "请输入正确的微信号"
	},
	validTrainNum: {
		regex: /^[a-zA-Z]{1}[0-9]{1,9}$/,
		error: "车次格式不正确"
	},
	validName10: {
		regex: /^[\u4e00-\u9fa5a-zA-Z0-9]{1,10}$/,
		error: "名称格式不正确"
	},
	validNumber: {
		regex: /^([1-9]\d*|[0]{1,1})$/,
		error: "代理人数格式不正确"
	},
	validEnChNum: {
		regex: /^[\u4e00-\u9fa5a-zA-Z0-9]*$/,
		error: "只能输入中英文和数字"
	},
	validCh: {
		regex: /^[\u4e00-\u9fa5a-zA-Z0-9]*$/,
		error: "只能输入中文"
	},
	validPositive: {
		regex: /^[1-9]\d*$/,
		error: "只能输入正整数"
	},
	validContact: {
		regex: /^[0-9-]+$/,
		error: "只能输入数字或中划线"
	},
	validCompanyName: {
		regex: /[\u4e00-\u9fa5()（）]{5,30}/,
		error: "公司名称格式不正确"
	}
});

// -- 业务相关 --

export const initSelect = (res, value, label, children, level = 1) => {
	let __arr = [];
	const __child = [];
	if (res instanceof Array && level > 0) {
		for (let j = 0; j < res.length; j++) {
			__arr = [...__arr, {
				value: res[j][value] || j,
				label: res[j][label] || res[j],
				children: initSelect(res[j][children], value, label, children, level - 1)
			}];
		}
		return __arr;
	}
	return level == 0 ? undefined : [];
};
/**
 *
 */
export const initTreeData = (obj, value, label, children) => {
	if (typeof obj === 'object') {
		return JSON.parse(
			JSON.stringify(obj)
				.replace(new RegExp(value, 'g'), 'value')
				.replace(new RegExp(label, 'g'), 'label')
				.replace(new RegExp(`children|${children}`, 'g'), 'children')
		);
	}
	console.error('参数错误');
	return [];
};

/**
 * 初始化数据
 * @param  {String} res 传入的数据
 * @param  {String} id  数组是已str区分 ，默认'id'
 * @param  {String} _count
 * @param  {Object} initObj 判断是否有init
 * @param  {Array} initArr 判断是否有init
 * @return {String}
 * 参考reducers中的使用
 */
export const initItem = (res, str, count, initObj, initArr) => {
	let itemArr = [];
	let itemObj = {};
	let targetArr;
	const id = str || 'id';
	if (typeof res == "object" && res.data && res.data instanceof Array) { // 传入的不是数组。res.data是数组
		targetArr = res.data;
	} else if (res instanceof Array) { // 传入的是数组
		targetArr = res;
	} else {
		return console.error('初始化参数错误');
	}
	for (let i = 0; i < targetArr.length; i++) {
		itemArr = [...itemArr, targetArr[i][id]];
		itemObj = {
			...itemObj,
			[targetArr[i][id]]: initObj || targetArr[i]
		};
	}
	/* 判断是否有_count*/
	if (count) {
		const { _count } = res;
		return { itemArr, itemObj, _count };
	}
	return { itemArr, itemObj };
};
/**
 * 作为分页初始数据
 * for mobile
 */
export const initObj = {
	currentPage: 0, // 当前页数
	totalPage: 1, // 总页数
	isEnd: 0, // 是否正在加载 0 上拉加载，1为加载中，2为已全部加载,3数据异常
	itemArr: [],
	itemObj: {},

};
/**
 * 作为分页初始数据
 * for pc
 */
export const initPage = {
	total: 0,
	reset: false,
	data: {}
};
/**
 * 对自定义链接做处理
 */
export const diyLink = (event, type = 'shop') => {
	const url = event.currentTarget.getAttribute('href');
	if (/^((https|http|ftp|rtsp|mms)?:\/\/)/.test(url) && !url.includes(`weiyianws.com/${type}/`) && !url.includes(`m.ruishan666/${type}/`)) {
		window.location.href = url;
		event.preventDefault();
		return false;
	}
	_global.scroll[url] = 0;
};
/**
 * 记忆滚动监听需要初始化
 */
export const initLink = (event) => {
	const url = event.currentTarget.getAttribute('href');
	_global.scroll[url] = 0;
	if (url === window.location.pathname) {
		document.body.scrollTop = 0;
	}
};

/**
 * 处理base64 前最
 */
export const filterBase64 = (data) => {
	const changeStr = (imgUrl) => {
		imgUrl = imgUrl.replace(/data:image\/[^;]+;base64,/g, '');
		return imgUrl;
	};
	if (!(data instanceof Array)) {
		data = changeStr(data);
	} else {
		for (let i = 0; i < data.length; i++) {
			data[i] = changeStr(data[i]);
		}
	}
	return data;
};

/**
 * 处理项目中rtf（富文本中的图片）
 */
export const rtfImages = (rtfData) => {
	if (!data) {
		return data;
	}
	data = data
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<").replace(/&gt;/g, ">")
		.replace(/&nbsp;/g, " ")
		.replace(/&#39;/g, "'")
		.replace(/&quot;/g, "\"");
	data = data
		.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, '<img src="$1" />')
		.replace(/<img [^>]*src=['"][^'"]+img\.baidu\.com([^'"]+)[^>]*>/gi, '<img style="width:auto;" src="https://img.baidu.com$1" />')
		.replace(/<img [^>]*src=['"][^'"]+osscdn\.weiyian\.com([^'"]+)[^>]*>/gi, '<img src="http://osscdn.weiyian.com$1!1-0" />');
	return data;
};

/**
 * ios微信支付的坑
 * 重载页面
 */
export const urlReLoad = () => {
	const firstUrl = ['shop', 'train']; // 根路由无视
	/**
	 * ios设备，微信端，长度，当前页
	 */
	if (
		_global.device.ios
		&& (
			_global.landingPage.split('/').length > 3
			|| (_global.landingPage.split('/').length > 2 && !firstUrl.includes(_global.landingPage.split('/')[1]))
		)
	) {
		// 如： "/shop/goods/2" length: 4
		window.location.reload();
		return !0;
	}
	return !1;
};
/**
 * 重构验证路由
 */
export const vaildRoute = (routes) => {
	let obj = {};
	for (let i = 0; i < routes.length; i++) {
		const { rule = [] } = routes[i] || {};
		if (process.env.NODE_ENV === 'development' && !(rule instanceof Array)) {
			return console.error("rule must be Array");
		}
		for (let j = 0; j < rule.length; j++) {
			if (process.env.NODE_ENV === 'development' && typeof rule[j] !== "number") {
				return console.error("rule's child must be Number");
			}
			obj = {
				...obj,
				[rule[j]]: [...obj[rule[j]] || [], routes[i].path]
			};
		}
	}
	return obj;
};

/**
 * css in js
 */
export const loadCssCode = (code) => {
	const style = document.createElement('style');
	style.type = 'text/css';
	style.rel = 'stylesheet';
	try {
		style.innerHTML = code;
	} catch (ex) {
		style.styleSheet.cssText = code;
	}
	const head = document.getElementsByTagName('head')[0];
	head.appendChild(style);
};

export const formatDate = (date, type = "day") => {
	let y = date.getFullYear();
	let m = date.getMonth() + 1;
	m = m < 10 ? ('0' + m) : m;
	let d = date.getDate();
	d = d < 10 ? ('0' + d) : d;
	if (type === "day") return y + '-' + m + '-' + d;
	else if (type === "minute") {
		let h = date.getHours();
		h = h < 10 ? ('0' + h) : date.getHours();
		let minute = date.getMinutes();
		minute = minute < 10 ? ('0' + minute) : minute;
		return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
	}
};

export const formatMoment = (date, format) => {
	return date && moment(date).format(format || 'YYYY-MM-DD');
};

/**
 * 获取有效的动态首页信息
 */
export const getIndexRoute = (arr) => {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].show && !arr[i].children) {
			return arr[i].route;
		} else if (arr[i].show && arr[i].children) {
			return getIndexRoute(arr[i].children);
		}
	}
};

export const getRedirectRoute = (redirect) => {
	return redirect || (_global.token ? '/404' : '/login');
};

/**
 * oneline
 */
export const oneLinePipe = (content, end = 10) => {
	if (typeof content !== 'string') {
		console.error('【oneLine】-- 参数不正确');
		return;
	}
	if (content.length > end) {
		content = content.substring(0, end) + '...';
	}
	return content;
};
/**
 * 唯一id
 */
let id = 1;
export const uid = () => {
	 return id++;
};
export const enCode = num => {
	const Secrit1 = _global.staff.staff_id * 1234;
	const Secrit2 = _global.staff.staff_id + 56;
	if ((num + '').endsWith('_code')) return num;
	else return +num * Secrit1 + Secrit2 + '_code';
};
export const unCode = num => {
	const Secrit1 = _global.staff.staff_id * 1234;
	const Secrit2 = _global.staff.staff_id + 56;
	if ((num + '').endsWith('_code')) {
		return (+num.replace('_code', '') - Secrit2) / Secrit1;
	} else return num;
	
};
/**
 * 回退到某一个url
 * @param {string} url 
 * @param {Object} option {ignoreQuery:回寻url时忽略query，只对path进行匹配}
 */
export const goBack = (url, option = {}) => {
	const { ignoreQuery } = option;
	const list = getItem('history_' + _global.version);
	let index;
	if (ignoreQuery) {
		const listWithoutQuery = list.map(i => i.split('?')[0]);
		index = listWithoutQuery.indexOf(url);
	} else {
		index = list.indexOf(url);
	}
	console.log('goBack', index);
	// setItem('history_' + _global.version, list.slice(index));
	if (window.history.length < index + 2) {
		let chunks = getChunks(_global.auth).filter((item) => item.show) || [];
		chunks[0] && app.$router.replace(chunks[0].route);
	} else {
		app.$router.go(index * -1);
	}
	return index;
};

const htmlRegex = /<.+?>/g;
const whiteSpaceRegex = /&nbsp;/ig;
const gtRegex = /&gt;/ig;
/**
 * 从富文本中抽取纯文本
 * @param {string} html 
 */
export const getPlainText = (html = '') => {
	return html.replace(htmlRegex, '').replace(whiteSpaceRegex, ' ').replace(gtRegex, '>');// 替换html标签为空字符
};

const imgRegx = /<img.*?(?:>|\/>)/gi;
const srcRegx = /src=['"]?([^'"]*)['"]?/i;
/**
 * 从富文本抽取出图片的url
 * @param {string} html 
 */
export const getImgUrl = (html = '') => {
	const imgArr = html.match(imgRegx) || [];
	const dataSource = [];
	imgArr.forEach(item => {
		const matchs = item.match(srcRegx);
		matchs && dataSource.push(matchs[1]);
	});
	return dataSource;
};

const keyWordRegex = /[\u4e00-\u9fa5a-zA-Z0-9]+/g;
/**
 * 获取高亮的html
 * @param {string} text  文本字符串
 * @param {string} keyword 要高亮的关键字
 * @param {string} color 高亮的颜色
 */
export const getHeighLightHtml = (text = '', keyword = '', color = "red") => {
	keyword = (keyword.match(keyWordRegex) || []).join('');
	const charArr = text.split('');
	charArr.forEach((c, index) => {
		if (keyword.includes(c)) {
			charArr[index] = c.fontcolor(color);
		}
	});
	return charArr.join('');
};

const thousandRegex = /(\d)(?=(\d{3})+\.)/g;
/**
 * 
 * @param {number,string} num 
 */
export const getFormatNum = (num, precision = 2, prefix = '', suffix = '') => {
	let num2 = +num;
	if (isNaN(num2)) {
		// console.error('getFormatNum：不是一个数字或数字格式的字符串 ' + num);
		return num;
	}
	return prefix + num2.toFixed(precision).replace(thousandRegex, '$1,') + suffix;
};
/**
 * 
 * @param {Array} data 
 * @param {Array} keys 
 * @param {Object} option 
 * formatNumBatch(list,['key1','key2'] || [{key,precision,prefix,suffix}])
 */
export const formatNumBatch = (data, keys, option = { clone: false }) => {
	const { clone } = option;
	if (clone) {
		data = JSON.parse(JSON.stringify(data));
	}
	data.forEach((it) => {
		keys.forEach(key => {
			if (typeof key == 'object') {
				it[key.key] = getFormatNum(it[key.key], key.precision, key.prefix, key.suffix);
			} else {
				it[key] = getFormatNum(it[key]);
			}
		});
	});
	return data;
};
const seasons = [
	{ label: '1月-3月', value: ['01', '03'] },
	{ label: '4月-6月', value: ['04', '06'] },
	{ label: '7月-9月', value: ['07', '09'] },
	{ label: '10月-12月', value: ['10', '12'] }
];
export const getSeasonTree = (startMonth, endMonth, option) => {
	const startYear = moment(startMonth).get('year');
	const endYear = moment(endMonth).get('year');
	const endMon = moment(endMonth).get('month');
	const result = [];
	for (let i = startYear; i <= endYear; i++) {
		if (i < endYear) {
			result.push({ label: i + '年',
				value: i,
				children: seasons.map(it => ({
					label: it.label, 
					value: `${i}-${it.value[0]},${i}-${it.value[1]}`
				}))
			 });
		} else {
			const year = { label: i + '年', value: i, children: [] };
			const s = seasons.filter((it, index) => index < ((endMon + 1) / 3));
			year.children.push(...s.map(it => ({
				label: it.label, 
				value: `${i}-${it.value[0]},${i}-${it.value[1]}`
			})));
			result.push(year);
		}
	}
	return result;
};
export const getYearList = (startYear = 2018, endYear = moment().get('year')) => {
	const result = [];
	for (let i = startYear; i <= endYear; i++) {
		result.push({ label: i + '年', value: i });
	}
	return result;
};
/**
 * 主要用于给echart的series，xAxis设值
 * @param {Array} series [{data:[]}]格式的数组
 * @param {Array} list []
 * @param {Array} option 字符串格式 ['key1', 'key2'] , 对象格式 [{index:0,key:'key1'},{index:1,key:'key2'}]
 */
export const setSeriesData = (series, list, option) => {
	if (!Array.isArray(series) || !Array.isArray(list) || !Array.isArray(list)) {
		console.error('setSeriesData error 参数必须是数组 ', series, list, option);
	}
	if (option.length == 0) return;
	if (typeof option[0] === 'string') {
		option.forEach((op, i) => {
			series[i].data = list.map(it => it[op]);
		});
	} else {
		option.forEach((op, i) => {
			const { index, key } = op;
			series[index].data = list.map(it => it[key]);
		});
	}
};
// [{includes:[],unIncludes:[],customFn:()=>{},name:''}]
const rules = [
	{ name: "Opera", includes: ['Opera'], },
	{ name: "Edge", includes: ['Edge'], },
	{ name: "Firefox", includes: ['Firefox'], },
	{ name: "Opera", includes: ['Opera'], },
	{ name: "Chrome", includes: ['Chrome', 'Safari'] },
	{ name: "Safari", includes: ['Safari'], unIncludes: ['Chrome'] },
	{ 
		name: "IE",
		includes: ["compatible", 'MSIE'],
		customFn: (userAgent) => {
			let reIE = new RegExp("MSIE (\\d+\\.\\d+);");
			reIE.test(userAgent);
			let fIEVersion = parseFloat(RegExp["$1"]);
			if (fIEVersion == 7) {
				return "IE7";
			} else if (fIEVersion == 8) {
				return "IE8";
			} else if (fIEVersion == 9) {
				return "IE9";
			} else if (fIEVersion == 10) {
				return "IE10";
			} else if (fIEVersion == 11) {
				return "IE11";
			} else {
				return "IE7-";
			}
		} 
	}

];
let cacheBrowserType;
export const getBrowser = (option = { cache: true }) => {
	if (option && option.cache && cacheBrowserType) return cacheBrowserType;
	const userAgent = navigator.userAgent;
	const exist = rules.find(rule => {
		if (rule.includes) {
			for (let i = 0; i < rule.includes.length; i++) {
				if (!userAgent.includes(rule.includes[i])) {
					return false;
				}
			}
		}
		if (rule.unIncludes) {
			for (let i = 0; i < rule.unIncludes.length; i++) {
				if (userAgent.includes(rule.unIncludes[i])) {
					return false;
				}
			}
		}
		if (rule.customFn) {
			const	result = rule.customFn(userAgent);
			if (result) {
				rule.name2 = result;
			} else {
				delete rule.name2;
				return false;
			}
		}
		return true;
	});
	const endResult = (exist && (exist.name2 || exist.name)) || 'unknow';
	cacheBrowserType = endResult;
	return endResult;
};
export const getPlatform = () => {
	const map = { MacIntel: 'mac', Win32: 'win' };
	return map[window.navigator.platform];
};
export const getObjectValue = (obj, prop) => {
	let proArr;
	if (typeof prop === 'string') {
		proArr = prop.split('.');
	} else if (Array.isArray(prop)) {
		proArr = prop;
	} else {
		console.error('getObjectValue  prop must be string or array');
		return undefined;
	}
	let value = obj;
	for (let i = 0; i < proArr.length; i++) {
		const p = proArr[i];
		value = value[p];
		if (value === undefined) {
			return undefined;
		}
		if (value === null && i === proArr.length - 1) {
			return null;
		}
	}
	return value;
};





