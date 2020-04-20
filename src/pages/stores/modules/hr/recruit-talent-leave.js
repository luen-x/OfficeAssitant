import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		count: []
	},
	tabs: []
};

const mutations = {
	HR_STAIR_DEPART_GET_SUCCESS(state, { data }) {
		state.tabs = data;
		data.forEach(item => {
			state.listInfo.count.push(0);
			state.listInfo = {
				...state.listInfo,
				[item.depart_id]: {
					...initPage
				}
			};
		});
	},
	HR_RECRUIT_TALENT_LEAVE_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo.count = state.tabs.map(item => {
			let count = data.counts.filter(info => info.depart_id === item.depart_id);
			return count[0].count;
		});
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
	HR_RECRUIT_TALENT_LEAVE_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	HR_RECRUIT_TALENT_LEAVE_LIST_INIT(state, payload) {
		state.tabs.forEach(item => {
			state.listInfo = {
				...state.listInfo,
				[item.depart_id]: {
					...initPage
				}
			};
		});
	},
	HR_RECRUIT_TALENT_LEAVE_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const hrRecruitTalentLeave = {
	state: { ...initialState },
	mutations,
};
