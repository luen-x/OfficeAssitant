import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
	},
	tabs: []
};

const mutations = {
	TECH_PROJECT_PUBLISH_DOCUMENT_CATEGORY_TABS_GET(state, tabs) {
		const listInfo = tabs.reduce((init, cur, index) => {
			init[index] = {
				...initPage
			};
			return init;
		}, {});
		state.listInfo = {
			...listInfo
		};
		state.tabs = [
			...tabs
		];
	},
	TECH_PROJECT_PUBLISH_DOCUMENT_CATEGORY_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			[type]: {
				...state.listInfo[type],
				total: 1,
				data: {
					...state.listInfo[type].data,
					'1': Array.isArray(data) ? data : []
				}
			}
		};
	},
	TECH_PROJECT_PUBLISH_DOCUMENT_CATEGORY_LIST_RESET(state, { type }) {
		state.listInfo = {
			...state.listInfo,
			[type]: {
				...state.listInfo[type],
				total: 1,
				data: {
					...initPage
				},
				reset: true
			}
		};
	},
	TECH_PROJECT_PUBLISH_DOCUMENT_CATEGORY_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	TECH_PROJECT_PUBLISH_DOCUMENT_CATEGORY_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const techProjectPublishDocumentCategory = {
	state: { ...initialState },
	mutations,
};
