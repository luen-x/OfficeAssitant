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
		list: undefined,
		isFetched: false
	}
};

const mutations = {
	HR_RECRUIT_SCHOOL_STATISTICS_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		let { ...rest } = data;
		type == 2 ? state.listInfo = {
			...state.listInfo,
			list: data,
			isFetched: true
		} : state.listInfo = {
			...state.listInfo,
			count: rest || 0,
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
	HR_RECRUIT_SCHOOL_STATISTICS_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	HR_RECRUIT_SCHOOL_STATISTICS_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_RECRUIT_SCHOOL_STATISTICS_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const hrRecruitSchoolStatistics = {
	state: { ...initialState },
	mutations,
};
