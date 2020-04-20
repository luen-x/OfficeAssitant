const initialState = {
	data: ''
};

const mutations = {
	HR_ACADEMY_TRANSFER_DETAIL_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrAcademyTransferDetail = {
	state: { ...initialState },
	mutations,
};
