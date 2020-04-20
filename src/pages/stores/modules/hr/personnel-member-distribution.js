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
	},
	title: {
		'1': {
			title_show: [],
			title_hide: []
		},
		'2': {
			title_show: [],
			title_hide: []
		},
		'3': {
			title_show: [],
			title_hide: []
		},
	},
	count: [0, 0, 0]
};

const mutations = {
	HR_PERSONNEL_MEMBER_DISTRIBUTION_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
	HR_PERSONNEL_MEMBER_DISTRIBUTION_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	HR_PERSONNEL_MEMBER_DISTRIBUTION_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},

	HR_PERSONNEL_MEMBER_DISTRIBUTION_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_PERSONNEL_MEMBER_DISTRIBUTION_COUNT_INIT(state, count) {
		state.count = [
			...count
		];
	},
	HR_PERSONNEL_MEMBER_DISTRIBUTION_TITLE_CHANGE(state, payload) {
		state.title[payload.type].title_show = payload.title_show;
		state.title[payload.type].title_hide = payload.title_hide;
	},
};

export const hrPersonnelMemberDistribution = {
	state: { ...initialState },
	mutations,
};
