// import { initPage } from '@utils/utils';

let initialListInfo = {};
const initialState = {
	listInfo: {
	},
	tabs: []
};

const mutations = {
	HR_STAIR_DEPART_GET_SUCCESS(state, res, param) {
		state.tabs = [
			...res.data
		];
		for (let i = 0; i < state.tabs.length; i++) {
			initialListInfo = {
				...initialListInfo,
				[state.tabs[i].depart_id]: {
					isFetched: false
				}
			};
		}
		state.listInfo = {
			...initialListInfo
		};
	},
	HR_RANK_LIST_GET_SUCCESS(state, { data, param: { depart_id: type, } }) {
		state.listInfo = {
			...state.listInfo,
			[type]: {
				isFetched: true,
				list: [...data]
			}
		};
	},
	HR_RANK_DEL_POST_SUCCESS(state, { depart_id: type }) {
		state.listInfo = {
			...initialListInfo
		};
	},
};

export const hrRank = {
	state: { ...initialState },
	mutations,
};