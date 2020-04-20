/**
 * ajax
 * @param  {[type]} url     地址
 * @param  {[type]} method  请求类型
 * @param  {[type]} body    请求的参数
 * @param  {Object} options 扩展
 *
 */
import { ajaxFn } from 'wya-fetch';
import { Message } from 'iview';
import { clearLoginAuth } from '@routers/hooks';
import { getItem } from '@utils/utils';
import API_ROOT from '@stores/apis/root';

const cnRegx = /^.*[\u4e00-\u9fa5].*$/;// 验证包含中文

const loadingFn = (options) => {
	const { tipMsg } = options; 
	Message.destroy();
	Message.loading(tipMsg || '加载中...', 0);
};
const loadedFn = () => {
	Message.destroy();
};

const otherFn = (res, resolve, reject) => {
	switch (res.status) {
		case -1:
			clearLoginAuth();
			break;
		case -2:
			// 无权限页面
			window.app && window.app.$router.replace('/404');
			break;
		default:
			break;
	}
};

const beforeFn = (options) => {
	if (!window.app) {
		return options;
	}
	let token = (getItem(`staff_${window.app.$global.version}`) || {}).token;
	return {
		...options,
		headers: {
			'-token': token
		}
	};
};
const afterFn = (res, options = {}) => {
	const { autoTip = false, errorMsg, successMsg } = options;
	if (res.msg && !cnRegx.test(res.msg)) {
		res.msg = "网络不稳定，请稍后重试...";
	}
	// 可以是promise，不要随便写return
	switch (res.status) {
		case 0:
			autoTip && Message.error(errorMsg || res.msg);
			// 分页报错转化成正确的数据格式，报错信息自己拿
			if (options.param.page) {
				return {
					status: 1,
					msg: res.msg,
					data: {
						currentPage: 1,
						list: [],
						totalCount: 0,
						totalPage: 0,
					},
					requestError: true // 不屏蔽报错
				};
			}
			break;
		case 1:
			autoTip && Message.success(successMsg || res.msg);
			break;
		default:
			break;
	}
};

const defaultOptions = {
	onLoading: loadingFn,
	onLoaded: loadedFn,
	onOther: otherFn,
	onBefore: beforeFn,
	onAfter: afterFn,
	apis: API_ROOT,
	requestType: 'form-data:json'
};

const ajax = ajaxFn(defaultOptions);
const net = {
	ajax
};

export const setAjax = (extraOptions) => {
	let options = {
		...defaultOptions,
		...extraOptions
	};
	net.ajax = ajaxFn(options);
};
export default net;


