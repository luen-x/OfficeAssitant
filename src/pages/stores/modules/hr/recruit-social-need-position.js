// import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		list: [],
		isFetched: false
	}
};

const mutations = {
	HR_RECRUIT_SOCIAL_SOCIAL_NEED_POSITION_LIST_GET_SUCCESS(state, { data, param }) {
		state.listInfo = {
			...state.listInfo,
			list: data,
			isFetched: true
		};
	},
	
	HR_RECRUIT_SOCIAL_SOCIAL_NEED_POSITION_LIST_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_RECRUIT_SOCIAL_SOCIAL_NEED_POSITION_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const hrNeedPostion = {
	state: { ...initialState },
	mutations,
};
