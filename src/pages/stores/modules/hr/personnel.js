const initialState = {
	data: ''
};

const mutations = {
	HR_PERSONNEL_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrPersonnel = {
	state: { ...initialState },
	mutations,
};
