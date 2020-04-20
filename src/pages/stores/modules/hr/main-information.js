const initialState = {
	data: ''
};

const mutations = {
	HR_MAIN_INFORMATION_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrMainInformation = {
	state: { ...initialState },
	mutations,
};
