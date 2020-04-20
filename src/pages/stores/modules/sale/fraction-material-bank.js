const initialState = {
	data: ''
};

const mutations = {
	SALE_FRACTION_MATERIAL_BANK_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const saleFractionMaterialBank = {
	state: { ...initialState },
	mutations,
};
