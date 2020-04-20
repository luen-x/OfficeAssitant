const initialState = {
	data: ''
};

const mutations = {
	ADMINISTRATION_MATTER_SETTING_APPLY_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const administrationMatterSettingApply = {
	state: { ...initialState },
	mutations,
};
