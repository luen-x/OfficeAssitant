const initialState = {
	data: ''
};

const mutations = {
	HR_ACADEMY_TRAIN_DETAIL_SIGN_3_PROVIDE_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrAcademyTrainDetailSign3Provide = {
	state: { ...initialState },
	mutations,
};
