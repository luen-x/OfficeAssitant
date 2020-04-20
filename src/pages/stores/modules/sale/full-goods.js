const initialState = {
	data: ''
};

const mutations = {
	SALE_FULL_GOODS_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const saleFullGoods = {
	state: { ...initialState },
	mutations,
};
