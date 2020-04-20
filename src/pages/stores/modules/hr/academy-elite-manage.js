const initialState = {
	data: ''
};

const mutations = {
	HR_ACADEMY_ELITE_MANAGE_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrAcademyEliteManage = {
	state: { ...initialState },
	mutations,
};
