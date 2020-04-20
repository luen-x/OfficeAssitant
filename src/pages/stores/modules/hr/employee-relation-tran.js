import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		count: [0, 0],
		'1': {
			...initPage
		},
		'2': {
			...initPage
		},
		'3': {
			...initPage
		},
	},
	msg: ''
};

const mutations = {
	HR_EMPLOYEE_RELATION_TRAN_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
			count: [data.transfer_wait, data.transfer_has]
		};
	},
	HR_EMPLOYEE_RELATION_TRAN_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	HR_EMPLOYEE_RELATION_TRAN_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_EMPLOYEE_RELATION_TRAN_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_EMPLOYEE_RELATION_TRAN_SET_MSG(state, payload) {
		state.msg = payload;
	}
};

export const hrEmployeeRelationTran = {
	state: { ...initialState },
	mutations,
};
