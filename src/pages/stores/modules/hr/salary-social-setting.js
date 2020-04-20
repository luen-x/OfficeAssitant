const initialState = {
	data: ''
};

const mutations = {
	HR_SALARY_SOCIAL_SETTING_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrSalarySocialSetting = {
	state: { ...initialState },
	mutations,
};
