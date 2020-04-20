const initialState = {
	data: ''
};

const mutations = {
	HR_ACADEMY_TRAIN_DETAIL_SIGN_2_EDIT_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrAcademyTrainDetailSign2Edit = {
	state: { ...initialState },
	mutations,
};
