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
		}
	}
};

const mutations = {
	STATISTIC_BUSINESS_SALE_RANK_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			[type]: {
				...state.listInfo[type],
				total: data.totalCount,
				data: {
					...state.listInfo[type || 1].data,
					[page]: data.list
				}
			}
		};
	},
	STATISTIC_BUSINESS_SALE_RANK_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	STATISTIC_BUSINESS_SALE_RANK_LIST_INIT(state, { type }) {
		if (type) {
			state.listInfo = {
				...state.listInfo,
				[type]: {
					...initPage
				}
			};
		} else {
			state.listInfo = {
				...initialState.listInfo
			};
		}
	},
	STATISTIC_BUSINESS_SALE_RANK_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const statisticBusinessSaleRank = {
	state: { ...initialState },
	mutations,
};