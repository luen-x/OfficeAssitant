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
		'4': {
			...initPage
		},
	}
};

const mutations = {
	FINANCE_COUNT_STAFF_COLLAGE_DETAIL_ALL_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
	FINANCE_COUNT_STAFF_COLLAGE_DETAIL_ALL_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	FINANCE_COUNT_STAFF_COLLAGE_DETAIL_ALL_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo,
		};
		
	},
	FINANCE_COUNT_STAFF_COLLAGE_DETAIL_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const financeCountStaffCollageDetail = {
	state: { ...initialState },
	mutations,
};
