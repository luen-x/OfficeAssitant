import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		'1': {
			...initPage
		},
		'2': {
			...initPage
		},
		'3': {
			...initPage
		},
	}
};

const mutations = {
	SALE_MAIN_WORK_DATA_DETAIL_LIST_GET_SUCCESS(state, { data, param: { type, page, redirectType } }) {
		if (redirectType) {
			type = redirectType;
		}
		state.listInfo = {
			...state.listInfo,
			[type]: {
				...state.listInfo[type],
				total: data.totalCount,
				data: {
					...state.listInfo[type].data,
					[page]: data.list
				}
			}
		};
	},
	SALE_MAIN_WORK_DATA_DETAIL_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	SALE_MAIN_WORK_DATA_DETAIL_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SALE_MAIN_WORK_DATA_DETAIL_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const saleMainWorkDataDetail = {
	state: { ...initialState },
	mutations,
};
