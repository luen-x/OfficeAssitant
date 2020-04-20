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
	HR_ARCHIVES_ACHIE_PK_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			[type]: {
				...state.listInfo[type],
				total: data.totalCount,
				month: data.month,
				data: {
					...state.listInfo[type].data,
					[page]: data.list,
					enable_add: data.enable_add
				}
			}
		};
	},
	HR_ARCHIVES_ACHIE_PK_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	HR_ARCHIVES_ACHIE_PK_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_ARCHIVES_ACHIE_PK_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const hrArchivesAchiePk = {
	state: { ...initialState },
	mutations,
};
