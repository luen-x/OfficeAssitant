import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {}
};

const mutations = {
	TECH_SHARE_PROGRESS_LIST_GET_SUCCESS(state, { data, param: { rate_id, page } }) {
		state.listInfo = {
			...state.listInfo,
			[rate_id]: {
				...state.listInfo[rate_id],
				total: data.totalCount,
				data: {
					...state.listInfo[rate_id].data,
					[page]: data.list
				}
			}
		};
	},
	_TECH_SHARE_PROGRESS_TABS_GET_SUCCESS(state, data = []) {
		state.listInfo = {};
		data.forEach(item => {
			state.listInfo['' + item.rate_id] = {
				...initPage
			};
		});
	},
	TECH_SHARE_PROGRESS_LIST_RESET(state, { rate_id }) {
		Object.keys(state.listInfo).forEach(key => {
			state.listInfo[key] = {
				...initialState.listInfo,
				[rate_id]: {
					...initPage,
					reset: true
				}
			};
		});
	},
	TECH_SHARE_PROGRESS_LIST_INIT(state, payload) {
		Object.keys(state.listInfo).forEach(key => {
			state.listInfo[key] = { ...initPage };
		});
	},
	TECH_SHARE_PROGRESS_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const techShareProgress = {
	state: { ...initialState },
	mutations,
};
