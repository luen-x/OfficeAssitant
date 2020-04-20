import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		'0': {
			...initPage
		},
		'1': {
			...initPage
		},
		'2': {
			...initPage
		},
		count: [0, 0, 0],
		fixPosition: false
	}
};

const mutations = {
	SALE_FRACTION_CREDIT_APPLICATION_LIST_GET_SUCCESS(state, { data, param: { status, page } }) {
		let count = [];
		if (Array.isArray(data.count)) {
			data.count.forEach(it => {
				count[it.status] = it.count;
			});
		}
		state.listInfo = {
			...state.listInfo,
			[status]: {
				...state.listInfo[status],
				total: data.totalCount,
				data: {
					...state.listInfo[status].data,
					[page]: data.list
				}
			},
			count
		};
	},
	SALE_FRACTION_CREDIT_APPLICATION_LIST_RESET(state, { status }) {
		state.listInfo = {
			...initialState.listInfo,
			[status]: {
				...initPage,
				reset: true
			}
		};
	},
	SALE_FRACTION_CREDIT_APPLICATION_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SALE_FRACTION_CREDIT_APPLICATION_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const saleFractionCreditApplication = {
	state: { ...initialState },
	mutations,
};
