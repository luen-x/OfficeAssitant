const initialState = {
	data: ''
};

const mutations = {
	SALE_MAIN_CASE_DETAIL_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const saleMainCaseDetail = {
	state: { ...initialState },
	mutations,
};
