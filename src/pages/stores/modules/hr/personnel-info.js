const initialState = {
	data: ''
};

const mutations = {
	HR_PERSONNEL_INFO_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrPersonnelInfo = {
	state: { ...initialState },
	mutations,
};
