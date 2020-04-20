
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
		'3': {
			...initPage
		},
	},




	data: '',
	pkSummary: '',
	nowIndex: 0,
	label: '员工PK',
	routes: [],
	hasRequest: false,
	role: '',
};

const mutations = {
	SALE_MAIN_PK_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			reset: true
		};
	},
	SALE_MAIN_PK_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SALE_MAIN_PK_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	},
	SALE_MAIN_PK_SUMMARY_DATA(state, { pkSummary }) {
		state.pkSummary = {
			...pkSummary
		};
	},
	SALE_MAIN_PK_NOW_INDEX(state, { nowIndex }) {
		state.nowIndex = nowIndex;
	},
	SALE_MAIN_PK_ROUTE(state, { routes, role }) {
		state.routes = routes;
		state.hasRequest = true;
		state.role = role;
	},
};

export const saleMainPk = {
	state: { ...initialState },
	mutations,
};
