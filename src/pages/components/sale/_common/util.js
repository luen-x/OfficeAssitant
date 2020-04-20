export const getLevel = () => {
	const staff = _global.staff;
	if (staff.is_charge == 1) {
		return 1; // 超管
	} else if (staff.depart_is_charge == 1 && staff.depart_lowest == 1) {
		return 3; // 经理

	} else if (staff.depart_is_charge == 1 && staff.depart_lowest == 0) {
		return 2; // 总监
	} else if (staff.is_charge == 0) {
		return 4; // 员工
	}
};
export const getAuth = (context, allNum, ownNum) => {
	if (typeof context == 'boolean') {
		if (context) {
			return _global.auth[ownNum];
		} else {
			return _global.auth[allNum];
		}
	} else if (context.isOwn) {
		return _global.auth[ownNum];
	} else {
		return _global.auth[allNum];
	}
};
export const setData = (to, from) => {
	for (let key in to) {
		if (from[key] !== undefined) {
			to[key] = from[key];
		}
	}
};
export const saleDataStore = {};
export const log = (...arg) => {
	if (window._debug_) {
		console.log(...arg);
	}
};
export const getLocationStr = (data, value, result = []) => {
	const cur = data.find(item => item.value == value[0]);
	if (cur) {
		result.push(cur.label);
		value.shift();
		if (cur.children && cur.children.length && value.length) {
			getLocationStr(cur.children, value, result);
		}
	}
	return result.join('');
};
const htmlRegex = /<.+?>/g;
const whiteSpaceRegex = /&nbsp;/ig;
const gtRegex = /&gt;/ig;
export const getPlainText = (html = '') => {
	return html.replace(htmlRegex, '').replace(whiteSpaceRegex, ' ').replace(gtRegex, '>');// 替换html标签为空字符
};
const imgRegx = /<img.*?(?:>|\/>)/gi;
const srcRegx = /src=['"]?([^'"]*)['"]?/i;
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
 * 
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



	
