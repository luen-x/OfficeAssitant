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
	STATISTICS_CUSTOMER_EMPLOYEE_NEW_GET_SUCCESS(state, { data, param }) {
		state = {
			...initialState
		};
	},
	STATISTICS_CUSTOMER_EMPLOYEE_NEW_STAFF_GET_SUCCESS(state, { data, param }) {
		state.listInfo['0'] = {
			...state.listInfo['0'],
			data: {
				[data.currentPage]: data.list 
			},
			total: data.totalCount
		};
	},
	STATISTICS_CUSTOMER_EMPLOYEE_NEW_DEPARTMENT_GET_SUCCESS(state, { data, param }) {
		state.listInfo['1'] = {
			...state.listInfo['1'],
			data: {
				[data.currentPage]: data.list 
			},
			total: data.totalCount
		};
	},
	STATISTICS_CUSTOMER_EMPLOYEE_NEW_AREAS_GET_SUCCESS(state, { data, param }) {
		state.listInfo['2'] = {
			...state.listInfo['2'],
			data: {
				[data.currentPage]: data.list 
			},
			total: data.totalCount
		};
	},
};

export const statisticsCustomerEmployeeNew = {
	state: { ...initialState },
	mutations,
};
