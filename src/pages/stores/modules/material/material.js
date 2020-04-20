const initialState = {
	data: ''
};

const mutations = {
	MATERIAL_MATERIAL_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const materialMaterial = {
	state: { ...initialState },
	mutations,
};
