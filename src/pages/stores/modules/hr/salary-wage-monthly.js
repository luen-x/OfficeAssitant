import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		...initPage
	},
	depart_id: [],
	month: '',
	title: {
		title_show: [],
		title_hide: []
	}
};

const mutations = {
	HR_SALARY_WAGE_MONTHLY_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			total: data.totalCount,
			data: {
				...state.listInfo.data,
				[page]: data.list
			}
		};
	},
	HR_SALARY_WAGE_MONTHLY_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			reset: true
		};
	},
	HR_SALARY_WAGE_MONTHLY_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_SALARY_WAGE_MONTHLY_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_SALARY_WAGE_MONTHLY_SET_DEPART_ID(state, payload) {
		state.depart_id = payload;
	},
	HR_SALARY_WAGE_MONTHLY_SET_MONTH(state, payload) {
		state.month = payload;
	},
	HR_SALARY_WAGE_MONTHLY_TITLE_CHANGE(state, payload) {
		state.title.title_show = payload.title_show;
		state.title.title_hide = payload.title_hide;
	}
};

export const hrSalaryWageMonthly = {
	state: { ...initialState },
	mutations,
};
