const initialState = {
	data: ''
};

const mutations = {
	HR_ACADEMY_TRAIN_DETAIL_ENROLL_1_ADD_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrAcademyTrainDetailEnroll1Add = {
	state: { ...initialState },
	mutations,
};
