import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		count: [0, 0, 0, 0],
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
		}
	}
};

const mutations = {
	ACADEMY_TRANSFER_TRANSFER_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		data.list = data.list.map(item => {
			item._disabled = !item.is_new_course;
			return item;
		});

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
				data.training_count, data.success_train_count,
				data.pass_train_count, data.train_count
			]
		};
	},
	ACADEMY_TRANSFER_TRANSFER_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	ACADEMY_TRANSFER_TRANSFER_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	ACADEMY_TRANSFER_TRANSFER_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const academyTransferTransfer = {
	state: { ...initialState },
	mutations
};