import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		'0': {
			...initPage,
		},
		'1': {
			...initPage
		},
		'2': {
			...initPage
		}
	}
};

const mutations = {
	STATISTICS_DEAL_CUSTOMER_GET_SUCCESS(state, { data, param }) {
		state = {
			...initialState
		};
	},
	STATISTICS_DEAL_CUSTOMER_STAFF_GET_SUCCESS(state, { data, param }) {
		// state.listInfo['0'] = {
		// 	...state.listInfo['0'],
		// 	data: {
		// 		[data.currentPage]: data.list 
		// 	},
		// 	total: data.totalCount
		// };
		state.listInfo = {
			...state.listInfo,
			'0': {
				...state.listInfo['0'],
				data: {
					[data.currentPage]: data.list 
				},
				total: data.totalCount
			}
		};
	},
	STATISTICS_DEAL_CUSTOMER_DEPARTMENT_GET_SUCCESS(state, { data, param }) {
		// state.listInfo['1'] = {
		// 	...state.listInfo['1'],
		// 	data: {
		// 		[data.currentPage]: data.list 
		// 	},
		// 	total: data.totalCount
		// };
		state.listInfo = {
			...state.listInfo,
			'1': {
				...state.listInfo['0'],
				data: {
					[data.currentPage]: data.list 
				},
				total: data.totalCount
			}
		};
	},
	STATISTICS_DEAL_CUSTOMER_AREAS_GET_SUCCESS(state, { data, param }) {
		// state.listInfo['2'] = {
		// 	...state.listInfo['2'],
		// 	data: {
		// 		[data.currentPage]: data.list 
		// 	},
		// 	total: data.totalCount
		// };
		state.listInfo = {
			...state.listInfo,
			'2': {
				...state.listInfo['0'],
				data: {
					[data.currentPage]: data.list 
				},
				total: data.totalCount
			}
		};
	},
	STATISTICS_DEAL_CUSTOMER_LIST_INIT(state) {
		state = {
			...initialState
		};
	}
};

export const statisticsDealCustomer = {
	state: { ...initialState },
	mutations,
};
