import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		count: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
		role: '',
	}
};

const mutations = {
	WORKSHEET_CONTROL_BUG_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
			count: [
				data.tab_data.all_count, 
				data.tab_data.has_assign_count,
				data.tab_data.processing_count,
				data.tab_data.has_solve_count,
				data.tab_data.verify_pass_count,
				data.tab_data.close_count
			],
			role: data.role
		};
	},
	WORKSHEET_CONTROL_BUG_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	WORKSHEET_CONTROL_BUG_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	WORKSHEET_CONTROL_BUG_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const worksheetControlBug = {
	state: { ...initialState },
	mutations,
};
