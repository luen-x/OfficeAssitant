// import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		list: [],
		isFetched: false
	}
};

const mutations = {
	HR_ORGANIZATION_LIST_GET_SUCCESS(state, { data, param }) {
		state.listInfo = {
			...state.listInfo,
			list: data,
			isFetched: true
		};
	},
	HR_ORGANIZATION_ADD_POST_SUCCESS(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_ORGANIZATION_DEL_POST_SUCCESS(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_ORGANIZATION_EDIT_POST_SUCCESS(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_ORGANIZATION_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const hrOrganization = {
	state: { ...initialState },
	mutations,
};
