const initialState = {
	data: ''
};

const mutations = {
	SALE_MAIN_CIRCLE_DETAIL_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const saleMainCircleDetail = {
	state: { ...initialState },
	mutations,
};
