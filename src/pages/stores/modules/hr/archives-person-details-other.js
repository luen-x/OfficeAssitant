import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		...initPage
	}
};

const mutations = {
	HR_ARCHIVES_PERSON_DETAIL_PERSON_OTHER_RECOMMEND_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		let { totalCount, totalPage, list, currentPage, ...rest } = data;
		state.listInfo = {
			...state.listInfo,
			total: totalCount,
			count: rest,
			data: {
				...state.listInfo.data,
				[page]: list
			}
		};
	},
	HR_ARCHIVES_PERSON_DETAIL_PERSON_OTHER_RECOMMEND_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			reset: true
		};
	},
	HR_ARCHIVES_PERSON_DETAIL_PERSON_OTHER_RECOMMEND_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_ARCHIVES_PERSON_DETAIL_PERSON_OTHER_RECOMMEND_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const hrArchivesPersonDetailsOther = {
	state: { ...initialState },
	mutations,
};
