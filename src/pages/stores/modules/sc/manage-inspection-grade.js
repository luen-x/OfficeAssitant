import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		...initPage
	}
};

const mutations = {
	SC_MANAGE_INSPECTION_GRADE_LIST_GET_SUCCESS(state, { data }) {
		state.listInfo = {
			...state.listInfo,
			total: data.length,
			data: {
				...state.listInfo.data,
				1: data
			}
		};
	},
	SC_MANAGE_INSPECTION_GRADE_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			reset: true
		};
	},
	SC_MANAGE_INSPECTION_GRADE_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SC_MANAGE_INSPECTION_GRADE_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const scManageInspectionGrade = {
	state: { ...initialState },
	mutations,
};
