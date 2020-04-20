const initialState = {
	data: ''
};

const mutations = {
	SALE_FULL_CASEDETAIL_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const saleFullCasedetail = {
	state: { ...initialState },
	mutations,
};
