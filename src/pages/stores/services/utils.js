import { Socket } from 'wya-socket';
import { URL_WEBSOCKET } from '@constants/constants';
import { isEqualWith } from 'lodash';
import { getItem, setItem, objRegex } from '@utils/utils';
import API_ROOT from '@stores/apis/root';

export const serviceObj = {
	param: {},
	res: undefined
};
export const serviceCompare = (newParam, localObj) => {
	return isEqualWith(newParam, localObj.param)
		? localObj.res
		: undefined;
};

export const serviceManager = {
	cbs: [],
	add(cb) {
		this.cbs.push(cb);
	},
	clear() {
		this.cbs.forEach(cb => cb());
		// this.cbs = [];
	}
};

export const createService = (defaultOptions = {}) => {
	const {
		key,
		url,
		parser = null,
		cache = false,
		vuex = false,
		param: defaultParam = {},
		getParam = (instance) => ({})
	} = defaultOptions;
	let store;
	cache && (store = getItem(`${key}_${_global.version}`));
	store = store || { ...serviceObj };

	// clear, 这块代码只会执行一次，所以退出登录后不应该吧cbs清空
	!cache && serviceManager.add(() => {
		store = { ...serviceObj };
	});
	let loadPromise;

	return {
		[key]: (userOptions = {}) => {
			const options = { ...defaultOptions, ...userOptions };
			// 具体看哪些参数可以被重置的
			const { autoLoad = true } = options;

			// 方法首字母大写
			const strFn = key.charAt(0).toUpperCase() + key.slice(1);

			const loadKey = `load${strFn}`;
			const clearKey = `clear${strFn}`;
			const loadingKey = `loading${strFn}`;

			return {
				data() {
					return {
						[key]: (store.res || {}).data ? (parser ? parser(store.res.data) : store.res.data) : [],
						[loadingKey]: false
					};
				},
				created() {
					autoLoad && (this[loadKey + 'Promise'] = (this[loadKey]({ ...defaultParam, ...getParam(this) })));
				},
				methods: {
					[loadKey](param, opts = {}) { // eslint-disable-line
						this[loadingKey] = true;
						let ajax = vuex ? this.request : this.$request;
						const localData = serviceCompare(param, store);
						const wrapPromise = (p) => {
							return p.then((res) => {
								store = {
									param,
									res
								};
								this[key] = parser ? parser(store.res.data) : store.res.data;
								cache && setItem(`${key}_${_global.version}`, store);
								return res;
							}).catch((res) => {
								console.error(res);
								this.$Message.error(res.msg);
								return Promise.reject(res);
							}).finally(() => {
								this[loadingKey] = false;
							});
						};
						if (!localData && loadPromise && isEqualWith(store.param, param)) {
							return wrapPromise(loadPromise);
						}
						store.param = param;
						loadPromise = ajax({
							url, // 必须是mutationType
							type: 'GET',
							localData,
							loading: false,
							param,
							...opts
						});
						return wrapPromise(loadPromise);
					},
					[clearKey]() {
						store = { ...serviceObj };
						loadPromise = undefined;
					}
				}
			};
		}
	};
};

/**
 * 创建socket
 * @param {*} defaultOptions
 */
export const createSocket = (defaultOptions = {}) => {
	const {
		key,
		url = URL_WEBSOCKET,
		bindUrl,
		param = {},
		getParam = (instance) => ({}),
		parser,
	} = defaultOptions;

	let socket;

	

	return {
		[key]: (userOptions = {}) => {

			const options = { ...defaultOptions, ...userOptions };
			// 具体看哪些参数可以被重置的
			const { isNeedDestroy = true } = options;

			return {
				data() {
					return {
						socket
					};
				},
				created() {
					this.socket = socket || this.initWebSocket();
				},
				methods: {
					initWebSocket() {
						socket = new Socket({ parser });
						socket.connect(objRegex.validURLScheme.regex.test(url) ? url : API_ROOT[url]);
						// 链接成功后获取client_id
						bindUrl && socket.on('connect', (res) => {
							const { data = {} } = res.data || {};
							this.$request({
								url: bindUrl,
								type: 'GET',
								param: {
									...data,
									...param,
									...getParam(this)
								},
							}).then((res) => { // eslint-disable-line
							}).catch((error) => {
								this.$Message.error(error.msg);
							});
							// 绑定id，后端要求
						});
						socket.on('error', (res) => {
							this.$Message.error('服务器连接失败,请刷新页面');
						});
						// clear
						serviceManager.add(() => {
							socket && socket.close();
							socket = undefined;
						});

						// 存储
						return socket;
					}
				},
				beforeDestroy() {
					isNeedDestroy && socket && socket.close();
					isNeedDestroy && (socket = undefined);
				}
			};
		}
	};
};
