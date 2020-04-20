import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		...initPage
	}
};

const mutations = {
	HR_ARCHIVES_PERSON_DETAIL_PERSON_OTHER_FOLLOW_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			total: data.totalCount,
			data: {
				...state.listInfo.data,
				[page]: data.list
			}
		};
	},
	HR_ARCHIVES_PERSON_DETAIL_PERSON_OTHER_FOLLOW_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			reset: true
		};
	},
	HR_ARCHIVES_PERSON_DETAIL_PERSON_OTHER_FOLLOW_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_ARCHIVES_PERSON_DETAIL_PERSON_OTHER_FOLLOW_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const hrArchivesPersonDetailsOtherFollow = {
	state: { ...initialState },
	mutations,
};
