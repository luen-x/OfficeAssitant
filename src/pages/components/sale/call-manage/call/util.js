import { getItem, setItem } from 'wya-utils';
import { objRegex } from '@utils/utils';
// eslint-disable-next-line import/no-cycle
import callService from "./service";

const getS = s => {
	if (s === 0) return "00";
	if (s <= 9) return "0" + s;
	return s;
};
export const getTime = num => {
	num = parseInt(num, 10);
	const s = num % 60;
	const m = parseInt(num / 60, 10) % 60;
	const h = parseInt(num / 3600, 10);
	return `${getS(h)}:${getS(m)}:${getS(s)}`;
};
const pattern = /^0[1-9][0-9]{1,2}[2-8][0-9]{6,7}$/;
export const formatFixdPhone = phone => {
	if (pattern.test(phone)) {
		return phone.substring(0, 4) + "-" + phone.substring(4);
	} else {
		return phone;
	}
};
const phoneRegxs = [
	objRegex.validPhone.regex, // 座机
	objRegex.validMobile.regex, // 手机
	objRegex.validHotLine.regex // 热线
];
export const validatePhone = phone => {
	for (let i = 0; i < phoneRegxs.length; i++) {
		if (phoneRegxs[i].test(phone)) {
			return true;
		}
	}
	return false;
};

export const mousePosition = { x: 0, y: 0 }; // 记录鼠标位置，复制呼出弹框时使用
export const handleCopyPhone = (event, customer) => {
	window.event.stopPropagation();
	let userSelection;
	if (window.getSelection) {
		// 一般浏览器
		userSelection = window.getSelection();
	} else if (document.selection) {
		// IE浏览器、Opera
		userSelection = document.selection.createRange();
	}
	const phone = userSelection.toString().trim();
	if (validatePhone(phone)) {
		const result = callService.prepareToCallOut(phone);
		if (result) {
			if (customer) {
				callService.fixCustomerInfo(customer);
			}
		}
	}
	return true;
};


export const handleMouseMove = event => {
	const windowWidth = document.body.clientWidth;
	const windowHeight = document.body.clientHeight;
	if (event.clientY < 200) {
		mousePosition.y = 200;
	} else if (event.clientY > windowHeight - 200) {
		mousePosition.y = windowHeight - 200;
	} else {
		mousePosition.y = event.clientY;
	}
	if (event.clientX < 200) {
		mousePosition.x = 200;
	} else if (event.clientX > windowWidth - 400) {
		mousePosition.x = windowWidth - 400;
	} else {
		mousePosition.x = event.clientX;
	}
};
export function getCallTabs() {
	return getItem("call_tabs" + _global.version, 'localStorage') || [];
}
export function setCallTabs(obj) {
	setItem("call_tabs" + _global.version, obj, 'localStorage');

}
export function getCallTab(tabId) {
	const tabs = getCallTabs();
	return tabs.find(item => item.id === tabId);
}
export function getFirstDepartName() {
	return getItem("firstDepartName_" + _global.version, 'localStorage') || '';
}
