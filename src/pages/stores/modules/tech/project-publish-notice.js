import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		count: [0, 0],
		'1': {
			...initPage
		},
		'2': {
			...initPage
		},
	}
};

const mutations = {
	TECH_PROJECT_PUBLISH_NOTICE_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			[type]: {
				...state.listInfo[type],
				total: data.totalCount,
				data: {
					...state.listInfo[type].data,
					[page]: data.list
				}
			},
			count: [
				data.publish_count, 
				data.under_count
			]
		};
	},
	TECH_PROJECT_PUBLISH_NOTICE_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	TECH_PROJECT_PUBLISH_NOTICE_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	TECH_PROJECT_PUBLISH_NOTICE_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const techProjectPublishNotice = {
	state: { ...initialState },
	mutations,
};
