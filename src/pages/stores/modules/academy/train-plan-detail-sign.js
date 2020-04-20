const initialState = {
	data: '',
	title: {
		title_show: [],
		title_hide: []
	},
};

const mutations = {
	ACADEMY_TRAIN_PLAN_DETAIL_SIGN_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	},
	ACADEMY_TRAIN_PLAN_DETAIL_SIGN_TITLE_CHANGE(state, payload) { 
		state.title.title_show = payload.title_show;
		state.title.title_hide = payload.title_hide;
	},
};

export const academyTrainPlanDetailSign = {
	state: { ...initialState },
	mutations,
};
