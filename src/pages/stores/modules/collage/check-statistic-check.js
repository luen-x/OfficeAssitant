import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		count: [0, 0, 0],
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
	listInfoDetail: {
		...initPage
	}
};

const mutations = {
	COLLAGE_CHECK_STATISTIC_CHECK_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
			count: [data.tab_data.on_line_count, data.tab_data.off_line_count,
				data.tab_data.company_count]
		};
	},

	COLLAGE_CHECK_STATISTIC_QUALITY_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfoDetail = {
			...state.listInfoDetail,
			total: data.totalCount,
			data: {
				...state.listInfoDetail.data,
				[page]: data.list
			}
		};
	},

	COLLAGE_CHECK_STATISTIC_CHECK_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	COLLAGE_CHECK_STATISTIC_CHECK_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	COLLAGE_CHECK_STATISTIC_CHECK_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	COLLAGE_STATICSTIC_CHECK_QUALITY_LIST_INIT(state, payload) {
		state.listInfoDetail = {
			...initialState.listInfoDetail
		};
	},
	COLLAGE_STATICSTIC_CHECK_QUALITY_LIST_RESET(state, payload) {
		state.listInfoDetail = {
			...initialState.listInfoDetail
		};
	},
};

export const collageCheckStatisticCheck = {
	state: { ...initialState },
	mutations,
};
