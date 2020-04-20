import { getParseUrl, getHashUrl, initPage, getItem, setItem } from "@utils/utils";


const initialState = {
	listInfo: {
		...initPage,
	},
	uploadStatus: {
		status: 0, // 0 不显示进度，1显示进度
		process: '', // 进度提示字符串
		deal_type: 1, // 处理类型 1 导入 2 重新查询 3 重新载入 0 未知
	},
};

const mutations = {
	SALE_CUSTOMER_INTENTION_PRIVATE_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			total: data.totalCount,
			data: {
				...state.listInfo.data,
				[page]: data.list
			}
		};
	},
	SALE_CUSTOMER_INTENTION_PRIVATE_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			reset: true
		};
	},
	SALE_CUSTOMER_INTENTION_PRIVATE_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SALE_CUSTOMER_INTENTION_PRIVATE_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SALE_CUSTOMER_INTENTION_PRIVATE_PERCENT_UPDATE(state, payload) {
		const needFilter = getItem('sale_customer_private_need_filter' + _global.version);
		
		const { percent, process, total, tip, deal_type } = payload;
		if (tip !== undefined) {
			state.uploadStatus = { status: 1, process: tip, deal_type };
			return;
		}
		if (needFilter && total > 0) {
			if (process > 20) {
				return;
			} else {
				setItem('sale_customer_private_need_filter' + _global.version, '');
			}
		}
		if (payload.status == 2 || payload.status == 0) {
			state.uploadStatus = { status: 0, process: '', deal_type: 0 };
			
		} else {
			// eslint-disable-next-line no-lonely-if
			if (+total > 0) { // 展示数量
				state.uploadStatus = { status: 1, process: process + '/' + total, deal_type };
			} else { // 展示百分比
				state.uploadStatus = { status: 1, process: percent + '%', deal_type };
			}
		}
	}
};

export const saleCustomerIntentionPrivate = {
	state: { ...initialState },
	mutations,
};
