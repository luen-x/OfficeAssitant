const initialState = {
	data: ''
};

const mutations = {
	HR_RANK_SETTING_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrRankSetting = {
	state: { ...initialState },
	mutations,
};
