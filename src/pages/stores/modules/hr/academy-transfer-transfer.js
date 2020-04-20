import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		count: [0, 0, 0, 0, 0, 0],
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
		'6': {
			...initPage
		},
	},
	title: {
		'1': {
			title_show: [],
			title_hide: []
		},
		'2': {
			title_show: [],
			title_hide: []
		},
		'3': {
			title_show: [],
			title_hide: []
		},
		'4': {
			title_show: [],
			title_hide: []
		},
		'5': {
			title_show: [],
			title_hide: []
		},
		'6': {
			title_show: [],
			title_hide: []
		}
	}
};

const mutations = {
	HR_ACADEMY_TRANSFER_TRANSFER_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
			count: [data.before_try_train_count, data.await_train_count, data.training_count,
				data.success_train_count, data.error_train_count, data.pass_train_count]
		};
	},
	HR_ACADEMY_TRANSFER_TRANSFER_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	HR_ACADEMY_TRANSFER_TRANSFER_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_ACADEMY_TRANSFER_TRANSFER_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_ACADEMY_TRANSFER_TRANSFER_TITLE_CHANGE(state, payload) {
		state.title[payload.type].title_show = payload.title_show;
		state.title[payload.type].title_hide = payload.title_hide;
	}
};

export const hrAcademyTransferTransfer = {
	state: { ...initialState },
	mutations,
};
