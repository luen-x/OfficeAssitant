const initialState = {
	data: ''
};

const mutations = {
	SALE_FULL_INFORMDETAIL_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const saleFullInformdetail = {
	state: { ...initialState },
	mutations,
};
