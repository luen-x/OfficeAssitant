const initialState = {
	data: ''
};

const mutations = {
	HR_SYSTEM_POSITION_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrSystemPosition = {
	state: { ...initialState },
	mutations,
};
