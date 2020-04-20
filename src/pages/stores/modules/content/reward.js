const initialState = {
	data: ''
};

const mutations = {
	CONTENT_REWARD_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const contentReward = {
	state: { ...initialState },
	mutations,
};
