const initialState = {
	data: ''
};

const mutations = {
	HR_ACADEMY_TRAIN_DETAIL_BASIC_2_EDIT_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrAcademyTrainDetailBasic2Edit = {
	state: { ...initialState },
	mutations,
};
