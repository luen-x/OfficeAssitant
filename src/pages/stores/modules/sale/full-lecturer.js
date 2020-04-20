const initialState = {
	data: ''
};

const mutations = {
	SALE_FULL_LECTURER_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const saleFullLecturer = {
	state: { ...initialState },
	mutations,
};
