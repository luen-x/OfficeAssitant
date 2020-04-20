import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		count: [0, 0, 0, 0, 0, 0, 0, 0],
		'1': {
			...initPage
		},
		'2': {
			...initPage
		},
		'3': {
			...initPage
		},
		'4': {
			...initPage
		},
		'5': {
			...initPage
		},
		'6': {
			...initPage
		},
		'7': {
			...initPage
		},
		'8': {
			...initPage
		},
	}
};

const mutations = {
	SC_MANAGE_STATISTICS_MARKET_DETAIL_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			[type]: {
				...state.listInfo[type],
				total: data.totalCount,
				data: {
					...state.listInfo[type].data,
					[page]: data.list
				}
			},
			count: data.count
		};
	},
	SC_MANAGE_STATISTICS_MARKET_DETAIL_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	SC_MANAGE_STATISTICS_MARKET_DETAIL_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SC_MANAGE_STATISTICS_MARKET_DETAIL_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const scManageStatisticsMarketDetail = {
	state: { ...initialState },
	mutations,
};