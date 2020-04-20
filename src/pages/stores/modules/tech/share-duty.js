const initialState = {
	data: ''
};

const mutations = {
	TECH_SHARE_DUTY_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const techShareDuty = {
	state: { ...initialState },
	mutations,
};
