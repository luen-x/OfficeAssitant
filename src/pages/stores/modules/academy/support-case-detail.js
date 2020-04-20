const initialState = {
	data: ''
};

const mutations = {
	ACADEMY_SUPPORT_CASE_DETAIL_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const academySupportCaseDetail = {
	state: { ...initialState },
	mutations,
};
