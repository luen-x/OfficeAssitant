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
		'4': {
			...initPage
		},
		'5': {
			...initPage
		},
		count: [0, 0, 0, 0, 0],
		initType: '1',
		fixPosition: false
	},
};

const mutations = {
	ADMINISTRATION_MATTER_MY_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
			count: [data.await_me_audit_count, data.dealing_count, data.success_count, data.finish_count, data.refuse_count]
		};
		if (state.listInfo.count.findIndex(num => num) != -1) {
			state.listInfo.initType = state.listInfo.count.findIndex(num => num) + 1 + '';
		}
	},
	ADMINISTRATION_MATTER_MY_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	ADMINISTRATION_MATTER_MY_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo,
		};
	},
	ADMINISTRATION_MATTER_MY_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	ADMINISTRATION_MATTER_MY_SET_POSITION(state, payload) {
		state.listInfo = {
			...state.listInfo,
			fixPosition: payload
		};
	},
};

export const administrationMatterMy = {
	state: { ...initialState },
	mutations,
};
