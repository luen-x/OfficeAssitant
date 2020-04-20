const initialState = {
	data: ''
};

const mutations = {
	COLLAGE_SETTING_SUBSIDY_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const collageSettingSubsidy = {
	state: { ...initialState },
	mutations,
};
