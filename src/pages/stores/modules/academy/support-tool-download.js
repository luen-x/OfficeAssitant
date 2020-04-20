import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		...initPage
	}
};

const mutations = {
	ACADEMY_SUPPORT_TOOL_DOWNLOAD_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			total: data.totalCount,
			data: {
				...state.listInfo.data,
				[page]: data.list
			}
		};
	},
	ACADEMY_SUPPORT_TOOL_DOWNLOAD_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			reset: true
		};
	},
	ACADEMY_SUPPORT_TOOL_DOWNLOAD_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	ACADEMY_SUPPORT_TOOL_DOWNLOAD_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const academySupportToolDownload = {
	state: { ...initialState },
	mutations,
};
