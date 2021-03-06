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
	}
};

const mutations = {
	HR_ACADEMY_COURSE_QUESTION_AUDIT_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
	HR_ACADEMY_COURSE_QUESTION_AUDIT_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	HR_ACADEMY_COURSE_QUESTION_AUDIT_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_ACADEMY_COURSE_QUESTION_AUDIT_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const hrAcademyCourseQuestionAudit = {
	state: { ...initialState },
	mutations,
};
