import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		count: [0, 0, 0, 0],
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
		}
	}
};

const mutations = {
	ACADEMY_STATISTICS_COURSE_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
			count: [data.pre_count, data.train_count,
				data.practice_count, data.recycle_count]
		};
	},
	ACADEMY_STATISTICS_COURSE_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	ACADEMY_STATISTICS_COURSE_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	ACADEMY_STATISTICS_COURSE_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	ACADEMY_STATISTICS_COURSE_SELECTED_TAB(state, payload) {
		state.type = payload;
	},
};

export const academyStatisticsCourse = {
	state: { ...initialState },
	mutations
};