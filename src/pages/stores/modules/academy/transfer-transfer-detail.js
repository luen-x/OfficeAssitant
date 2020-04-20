const initialState = {
	data: ''
};

const mutations = {
	ACADEMY_TRANSFER_TRANSFER_DETAIL_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const academyTransferTransferDetail = {
	state: { ...initialState },
	mutations,
};
