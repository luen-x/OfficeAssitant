import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		count: [0, 0, 0, 0, 0],
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
		}
	}
};

const mutations = {
	ACADEMY_TRANSFER_STATISTICS_TEACHER_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
			count: [data.train_count, data.try_pass_count, data.try_by_pass_count,
				data.entry_and_leave_count, data.leave_by_fifteen_day_count]
		};
	},
	ACADEMY_TRANSFER_STATISTICS_TEACHER_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	ACADEMY_TRANSFER_STATISTICS_TEACHER_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	ACADEMY_TRANSFER_STATISTICS_TEACHER_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const academyTransferStatisticsTeacher = {
	state: { ...initialState },
	mutations
};