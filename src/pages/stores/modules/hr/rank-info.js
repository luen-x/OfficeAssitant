const initialState = {
	data: ''
};

const mutations = {
	HR_RANK_INFO_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrRankInfo = {
	state: { ...initialState },
	mutations,
};
