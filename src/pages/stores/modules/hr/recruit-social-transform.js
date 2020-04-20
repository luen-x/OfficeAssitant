import { initPage } from '@utils/utils';

const initialState = {
	type: '',
	ssList: {
		...initPage
	},
	entryList: {
		...initPage
	},
	sfList: {
		...initPage
	},
	isList: {
		...initPage
	},
	paList: {
		...initPage
	},
};

const mutations = {
	// 社招转化表
	HR_RECRUIT_SOCIAL_TRANSFORM_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.ssList = {
			...state.ssList,
			total: data.totalCount,
			data: {
				...state.ssList.data,
				[page]: data.list
			}
		};
	},
	HR_RECRUIT_SOCIAL_TRANSFORM_LIST_INIT(state, payload) {
		state.ssList = {
			...initialState.ssList
		};
	},
	HR_RECRUIT_SOCIAL_TRANSFORM_ROUTE_CHANGE(state, payload) {
		state.ssList = {
			...initialState.ssList
		};
	},
	// 社招跟进表
	HR_RECRUIT_SOCIAL_FOLLOW_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.sfList = {
			...state.sfList,
			total: data.totalCount,
			data: {
				...state.sfList.data,
				[page]: data.list
			}
		};
	},
	HR_RECRUIT_SOCIAL_FOLLOW_LIST_INIT(state, payload) {
		state.sfList = {
			...initialState.sfList
		};
	},
	// 面试官统计表
	HR_RECRUIT_INTERVIEWER_STATISTICS_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.isList = {
			...state.isList,
			total: data.totalCount,
			data: {
				...state.isList.data,
				[page]: data.list
			}
		};
	},
	HR_RECRUIT_INTERVIEWER_STATISTICS_LIST_INIT(state, payload) {
		state.isList = {
			...initialState.isList
		};
	},
	HR_RECRUIT_INTERVIEWER_STATISTICS_ROUTE_CHANGE(state, payload) {
		state.isList = {
			...initialState.isList
		};
	},
	// HR_RECRUIT_SOCIAL_TRANSFORM_LIST_RESET(state, { type }) {
	// 	state.ssList = {
	// 		...initialState.ssList,
	// 		[type]: {
	// 			...initPage,
	// 			reset: true
	// 		}
	// 	};
	// },
	HR_RECRUIT_SOCIAL_TRANSFORM_SET_TYPE(state, payload) {
		
		state.type = payload;
	},
	// 社招跟进表
	HR_RECRUIT_SOCIAL_STATISTICS_DETAIL_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.sfList = {
			...state.sfList,
			total: data.totalCount,
			data: {
				...state.sfList.data,
				[page]: data.list
			}
		};
	},
	HR_RECRUIT_SOCIAL_STATISTICS_DETAIL_LIST_INIT(state, payload) {
		state.sfList = {
			...initialState.sfList
		};
	},
	HR_RECRUIT_SOCIAL_STATISTICS_DETAIL_ROUTE_CHANGE(state, payload) {
		state.sfList = {
			...initialState.sfList
		};
	},
	// 职位分析
	HR_RECRUIT_SOCIAL_POSITION_ANALYZE_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.paList = {
			...state.paList,
			total: data.totalCount,
			data: {
				...state.paList.data,
				[page]: data.list
			}
		};
	},
	HR_RECRUIT_SOCIAL_POSITION_ANALYZE_LIST_INIT(state, payload) {
		state.paList = {
			...initialState.paList
		};
	},
	HR_RECRUIT_SOCIAL_POSITION_ANALYZE_ROUTE_CHANGE(state, payload) {
		state.paList = {
			...initialState.paList
		};
	},
};

export const hrRecruitSocialStatistics = {
	state: { ...initialState },
	mutations,
};
