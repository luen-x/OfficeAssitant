const initialState = {
	data: '',
	title: {
		title_show: [],
		title_hide: []
	},
};

const mutations = {
	HR_ACADEMY_TRAIN_DETAIL_SIGN_4_RESULT_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	},
	HR_ACADEMY_TRAIN_DETAIL_SIGN_4_RESULT_TITLE_CHANGE(state, payload) {
		state.title.title_show = payload.title_show;
		state.title.title_hide = payload.title_hide;
	},
};

export const hrAcademyTrainDetailSign4Result = {
	state: { ...initialState },
	mutations,
};
