import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		'1': {
			...initPage
		},
		'2': {
			...initPage
		}
	}
};

const mutations = {
	SALE_CALL_RECORD_LIST_GET_SUCCESS(state, { data, param: { tab_type, page } }) {
		state.listInfo = {
			...state.listInfo,
			[tab_type]: {
				...state.listInfo[tab_type],
				total: data.totalCount,
				data: {
					...state.listInfo[tab_type].data,
					[page]: data.list
				}
			}
		};
	},
	SALE_CALL_RECORD_LIST_RESET(state, { tab_type }) {
		state.listInfo = {
			...initialState.listInfo,
			[tab_type]: {
				...initPage,
				reset: true
			}
		};
	},
	SALE_CALL_RECORD_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SALE_CALL_RECORD_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const saleCallRecord = {
	state: { ...initialState },
	mutations,
};
