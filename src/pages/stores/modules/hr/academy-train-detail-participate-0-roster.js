import { initPage } from '@utils/utils';

let initialListInfo = {};
const initialState = {
	listInfo: {
		'0': {
			...initPage
		},
	},
	tabs: [
		{
			nick_name: '全部',
			course_id: '0'
		}
	],
	type: '0'
};

const mutations = {
	HR_ACADEMY_TRAIN_DETAIL_PARTICIPATE_TABS_GET(state, { tabs }) {
		for (let i = 0; i < tabs.length; i++) {
			state.listInfo = {
				...state.listInfo,
				[tabs[i].course_id]: {
					data: {},
					total: 0,
					reset: false,
				}
			};
		}
		state.tabs = tabs;
	},
	HR_ACADEMY_TRAIN_DETAIL_PARTICIPATE_TABS_GET_SUCCESS(state, res, param) {
		state.listInfo = {
			...initialListInfo
		};
	},
	HR_ACADEMY_TRAIN_DETAIL_PARTICIPATE_0_ROSTER_LIST_GET_SUCCESS(state, { data, param }) {
		state.listInfo = {
			...state.listInfo,
			[param.course_id]: {
				...state.listInfo[param.course_id],
				total: data.totalCount,
				data: {
					...state.listInfo[param.course_id].data,
					[param.page]: data.list
				}
			}
		// [type]: {
		// 	...state.listInfo[type],
		// 	total: data.totalCount,
		// 	data: {
		// 		...state.listInfo[type].data,
		// 		[page]: data.list
		// }
		// }
		};
	},
	HR_ACADEMY_TRAIN_DETAIL_PARTICIPATE_0_ROSTER_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	HR_ACADEMY_TRAIN_DETAIL_PARTICIPATE_0_ROSTER_LIST_INIT(state) {
		for (let i = 0; i < state.tabs.length; i++) {
			state.listInfo = {
				...state.listInfo,
				[state.tabs[i].course_id]: {
					...initPage,
				}
			};
		}
	},
	HR_ACADEMY_TRAIN_DETAIL_PARTICIPATE_0_ROSTER_ROUTE_CHANGE(state, payload) {
		state.listInfo = {};
		// state.tabs = [];
	},
	HR_ACADEMY_TRAIN_DETAIL_PARTICIPATE_0_ROSTER_SELECTED_TAB(state, payload) {
		state.type = payload;
	},
};

export const hrAcademyTrainDetailParticipate0Roster = {
	state: { ...initialState },
	mutations,
};
