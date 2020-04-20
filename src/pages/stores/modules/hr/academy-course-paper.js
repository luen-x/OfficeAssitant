import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		...initPage
	},
	title: {
		title_show: [],
		title_hide: []
	},
	importStatus: {
		status: 0, // 0 未上传，1 上传中， 2 上传成功， 3 上传失败 
		percent: 0,
		msg: '',
	}
};

const mutations = {
	HR_ACADEMY_COURSE_PAPER_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			total: data.totalCount,
			data: {
				...state.listInfo.data,
				[page]: data.list
			}
		};
	},
	HR_ACADEMY_COURSE_PAPER_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			reset: true
		};
	},
	HR_ACADEMY_COURSE_PAPER_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_ACADEMY_COURSE_PAPER_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_ACADEMY_COURSE_PAPER_TITLE_CHANGE(state, payload) {
		state.title.title_show = payload.title_show;
		state.title.title_hide = payload.title_hide;
	},
	HR_ACADEMY_COURSE_PAPER_PERCENT_UPDATE(state, payload) {
		state.importStatus = { ...state.importStatus, ...payload };
	}
};

export const hrAcademyCoursePaper = {
	state: { ...initialState },
	mutations,
};
