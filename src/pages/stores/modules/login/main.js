const initialState = {
	user: ''
};

const mutations = {
	LOGIN_MAIN_POST_SUCCESS(state, { data, param }) {
		state.user = data.user;
	}
};

export const loginMain = {
	state: { ...initialState },
	mutations,
};