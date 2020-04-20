const initialState = {
	data: ''
};

const mutations = {
	HR_ACADEMY_TRAIN_ARRANGEMENT_ADD_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrAcademyTrainArrangementAdd = {
	state: { ...initialState },
	mutations,
};
