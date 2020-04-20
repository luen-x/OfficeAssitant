const initialState = {
	data: ''
};

const mutations = {
	CONTENT_RULES_SALE_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const contentRulesSale = {
	state: { ...initialState },
	mutations,
};
