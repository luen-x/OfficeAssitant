const initialState = {
	count: 0
};

const mutations = {
	NOTICE_COUNT_SET(state, count) {
		state.count = count;
	},
	NOTICE_COUNT_ADD(state) {
		state.count += 1;
	}
};

export const countMain = {
	state: { ...initialState },
	mutations,
};