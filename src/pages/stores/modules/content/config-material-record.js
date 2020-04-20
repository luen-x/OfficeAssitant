import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		'1': {
			...initPage
		},
		'2': {
			...initPage
		},
		'3': {
			...initPage
		},
	}
};

const mutations = {
	CONTENT_CONFIG_MATERIAL_RECORD_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		if (type == 3) { type = 1; }
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
	CONTENT_CONFIG_MATERIAL_RECORD_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	CONTENT_CONFIG_MATERIAL_RECORD_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	CONTENT_CONFIG_MATERIAL_RECORD_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const contentConfigMaterialRecord = {
	state: { ...initialState },
	mutations,
};
