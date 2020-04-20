import { initPage } from '@utils/utils';

const initialState = {
	tabs: [],
	ic_system_id: '',
	listInfo: {},
};

const mutations = {
	SALE_FRACTION_CREDIT_SUB_TABS_GET_SUCCESS(state, { data, ic_system_ids }) {
		state.tabs = data;
		state.ic_system_id = '' + ic_system_ids[0];
		ic_system_ids.forEach(key => {
			state.listInfo['' + key] = {
				...initPage
			};
		});
	},
	SALE_FRACTION_CREDIT_SUB_LIST_GET_SUCCESS(state, { data, param: { ic_system_id, page } }) {
		state.listInfo = {
			...state.listInfo,
			[ic_system_id]: {
				...state.listInfo[ic_system_id],
				total: data.totalCount,
				data: {
					...state.listInfo[ic_system_id].data,
					[page]: data.list
				}
			}
		};
	},
	SALE_FRACTION_CREDIT_SUB_LIST_RESET(state, { ic_system_id }) {
		state.listInfo = {
			...initialState.listInfo,
			[ic_system_id]: {
				...initPage,
				reset: true
			}
		};
	},
	SALE_FRACTION_CREDIT_SUB_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SALE_FRACTION_CREDIT_SUB_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	}
};

export const saleFractionCreditSub = {
	state: { ...initialState },
	mutations,
};
