import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		count: [0, 0, 0],
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
	HR_ACADEMY_TRAIN_DETAIL_PAPER_0_AUDIT_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
			count: [data.wait_count, data.pass_count, data.not_pass_count]
		};
	},
	HR_ACADEMY_TRAIN_DETAIL_PAPER_0_AUDIT_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	HR_ACADEMY_TRAIN_DETAIL_PAPER_0_AUDIT_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_ACADEMY_TRAIN_DETAIL_PAPER_0_AUDIT_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const hrAcademyTrainDetailPaper0Audit = {
	state: { ...initialState },
	mutations,
};
