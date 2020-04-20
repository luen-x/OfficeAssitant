import { initPage } from '@utils/utils';

let initialListInfo = {};
const initialState = {
	stairList: [],	// 一级部门
	listInfo: {},
	tabs: [],
	// selectedList: [],
	stair_depart_id: ''
};

const mutations = {
	// 一级部门获取成功
	HR_STAIR_DEPART_GET_SUCCESS(state, res, param) {
		state.stairList = [
			...res.data
		];
		// if (state.stairList.length) {
		// 	state.stair_depart_id = state.stairList[0].depart_id;
		// }
	},
	// 获取体系成功
	HR_SALARY_RANK_SYS_GET_SUCCESS(state, res, param) {
		state.tabs = [
			...res.data
		];

		for (let i = 0; i < state.tabs.length; i++) {
			initialListInfo = {
				...initialListInfo,
				[state.tabs[i].rank_system_id]: {
					...initPage
				}
			};
		}
		state.listInfo = {
			...initialListInfo
		};
	},
	HR_EMPLOYEE_RANK_TITLE_LIST_GET_SUCCESS(state, { data, param: { rank_system_id: type, page } }) {
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
	HR_EMPLOYEE_RANK_TITLE_LIST_RESET(state, { rank_system_id: type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	HR_EMPLOYEE_RANK_TITLE_LIST_INIT(state, payload) {
		for (let i = 0; i < state.tabs.length; i++) {
			initialListInfo = {
				...initialListInfo,
				[state.tabs[i].rank_system_id]: {
					...initPage
				}
			};
		}
		state.listInfo = {
			...initialListInfo
		};
	},
	HR_EMPLOYEE_RANK_TITLE_ROUTE_CHANGE(state, payload) {
		state.listInfo = {};
		state.tabs = [];
	},
	// 设置初始选中一级部门
	HR_EMPLOYEE_RANK_TITLE_SET_STAIR(state, payload) {
		state.stair_depart_id = payload;
	},
	// 设置选中表头
	HR_EMPLOYEE_RANK_TITLE_SET_SELECTED(state, payload) {
		state.selectedList = [
			...payload
		];
	}
};

export const hrEmployeeRankTitle = {
	state: { ...initialState },
	mutations,
};
