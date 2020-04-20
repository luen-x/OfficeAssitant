import Vue from 'vue';
import { getItem, setItem, delItem } from '@utils/utils';
import { setAjax } from '@utils/net';
import { Vc } from 'wya-vc';
import { getChunks } from '@components/layout/chunks';
import { serviceManager } from '@stores/services/utils';
import callService from '@components/sale/call-manage/call/service';
import rootRoute from "@components/layout/left/root";
import freeRouter from '@components/layout/hack/free-router';

/**
 * 无权限可进去的页面
 */
export const hackRoutes = [
	'/hr/form/enter-register',
	"/hr/academy/course/exam"

];

/**
 * 表单页面需登录
 */
export const formRoutes = [
	'/hr/form/interview',
	'/hr/form/enter-talk',
	'/hr/form/regular-apply',
	'/hr/form/regular-talk',
	'/hr/form/dimission-apply',
	'/hr/form/dimission-talk'
];

// const noAuthRoutes = [
// 	'/content/preview',
// 	'/sale/call',
// 	'/content/search',
// 	'/worksheet',
// 	'/sc/views',
// 	'/settings/router',
// 	'/tech/share',
// 	'/sale/full',
// 	'/administration/application/mine',
// 	'/administration/application/wait',
// 	'/hr/rank/setting',
// 	'/hr/rank/info',
// 	'/material/material',
// 	...freeRouter
// ];
let loginChunks = [];
let loginRoute = {};

/**
 * 是否已经登录
 */
const isLoggedIn = (nextState) => {
	let state = false; // 未登录
	let user = getItem(`staff_${_global.version}`);
	if (user) {
		state = true;
	}
	return state;
};

export const beforeEach = ((to, from, next) => {
	// hack内的可页面直接进入
	if (hackRoutes.indexOf(to.path) > -1) {
		next();
		return;
	}
	if (to.path === '/login' || to.path == "/404" || to.path == '/test') {
		next();
		return;
	}
	// 已下都是需要登录的页面
	if (isLoggedIn()) {
		if (formRoutes.indexOf(to.path) > -1) {
			next();
			return;
		}
		if (freeRouter.find(i => to.path.includes(i))) {
			// 这些个路由暂时不处理
			next();
			return;

		}
		const pathArr = to.path.split('/').filter(i => i).map(i => (i.includes('?') ? i.split('?')[0] : i));
		const baseChunk = loginChunks.find(ch => ch.value == pathArr[0]);
		if (baseChunk && baseChunk.show) {
			const secondChunks = loginRoute[baseChunk.value];
			if (!pathArr[1]) {
				next();
				return;
			}
			const secondChunk = secondChunks.find(ch => to.path.includes(ch.route));
			if (secondChunk && secondChunk.show) {
				next();
				return;
			}
		}
		const showChunks = loginChunks.filter((item) => item.show)[0];
		next((showChunks && showChunks[0]) ? showChunks[0].route : '/login');
		return;
	}

	// 没有登录时将登录后需跳转的页面带到路径中
	if (formRoutes.indexOf(to.path) > -1) {
		next(`/login?redirect=${to.path}&params=${encodeURIComponent(JSON.stringify(to.query))}`);
		return;
	}
	next('/login');
});
const MAX_FULLPATH_LENGTH = 100;

export const afterEach = ((to, from) => {
	const fullPaths = getItem('history_' + _global.version) || [];
	let path = fullPaths[0] && fullPaths[0].split('?')[0];
	// path = path && path.split('#')[0];
	
	if (path == to.path) {
		fullPaths.shift();
	}
	fullPaths.unshift(to.fullPath);
	if (fullPaths.length > MAX_FULLPATH_LENGTH) {
		fullPaths.splice(MAX_FULLPATH_LENGTH, fullPaths.length - MAX_FULLPATH_LENGTH);
	}
	setItem('history_' + _global.version, fullPaths);


});

/**
 * 设置登录状态
 *
 * @param {*} data
 * @param {*} opts
 */

export const createLoginAuth = (data = {}, replace = true, opts = {}) => {
	const { redirect } = opts;
	_global.staff = data.staff || {};
	_global.auth = data.auth || {};
	_global.token = data.token;
	_global.safe = data.safe;
	// 同步
	Vue.prototype.$global = _global;
	Vue.prototype.$auth = _global.auth;

	// 筛选有权限的页面
	let chunks = getChunks(_global.auth).filter((item) => item.show) || [];
	loginChunks = chunks;
	loginRoute = {};
	Object.keys(rootRoute).forEach(key => {
		loginRoute[key] = rootRoute[key](_global.auth);

	});
	replace && setItem(`staff_${_global.version}`, data);
	replace && app.$router.push(redirect || (chunks[0] || {}).route);
};

/**
 * 清除登录状态
 * @param {*} opts
 */
export const clearLoginAuth = (opts = {}) => {
	_global.staff = {};
	_global.auth = {};
	_global.token = '';
	_global.safe = '';

	loginChunks = [];
	loginRoute = {};
	// 同步
	Vue.prototype.$global = _global;
	Vue.prototype.$auth = _global.auth;

	Vc.instance.cleanAll();

	delItem(`staff_${_global.version}`);
	delItem('not_first');
	serviceManager.clear();
	// callService.close();
	app.$router.replace('/login');
};

/**
 * 清除之前所有版本的缓存
 */
export const clearLocalStorage = (version) => {
	let keys = Object.keys(localStorage);
	for (let i = 0; i < keys.length; i++) {
		// wya-vc 为vc组件库缓存，不清除
		if (!keys[i].includes(version) && !keys[i].includes('wya-vc')) {
			delItem(keys[i]);
		}
	}
};
