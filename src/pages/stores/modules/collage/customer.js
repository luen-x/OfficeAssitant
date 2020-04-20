// import * as types from '@mutations/collage';

const initialState = {
	data: ''
};

const mutations = {
	COLLAGE_CUSTOMER_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const collageCustomer = {
	state: { ...initialState },
	mutations,
};
