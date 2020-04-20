const initialState = {
	data: ''
};

const mutations = {
	HR_SYSTEM_ORGANIZATION_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrSystemOrganization = {
	state: { ...initialState },
	mutations,
};
