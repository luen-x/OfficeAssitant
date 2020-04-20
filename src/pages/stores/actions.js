import API_ROOT from './apis/root';
/**
 * 根级别actions
 */
import net from '../utils/net';

export const actions = {
	request(store, opts = {}) {
		const {
			url: mutation,
			redirect, // 重定向Mutation
			param = {},
			pending,
			fail,
			loading = true,
			initList,
			emptyToLine = true,
			...rest
		} = opts;

		if (!API_ROOT[mutation]) {
			console.error('[rootActions/request], mutation需要对应的url');
			return !1;
		}
		
		// pending 为 false，则必须要写_PENDING的mutation
		pending && store.commit(redirect || `${mutation}_PENDING`, { param });
		return net.ajax({
			url: API_ROOT[mutation],
			param,
			loading: param.page === undefined ? loading : false,
			...rest
		}).then((res) => {
			if (emptyToLine && Array.isArray(res.data.list)) {
				res.data.list.forEach(it => {
					Object.keys(it).forEach(key => {
						// 不处理0 ， 以“_“开头的字段，_开头的字段有可能是iview关键字
						if (!it[key] && it[key] !== 0 && !key.startsWith('_')) {
							it[key] = '-';
						}
					});
				});
			}
			initList && (res.data.list = initList(res.data.list));
			store.commit(redirect || `${mutation}_SUCCESS`, {
				data: res.data,
				param,
				// ...rest
			});
			return res;
		}).catch((error) => { 
			fail && store.commit(redirect || `${mutation}_FAIL`, { param });
			return Promise.reject(error);
		});
	}
};




