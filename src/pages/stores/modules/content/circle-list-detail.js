const initialState = {
	data: ''
};

const mutations = {
	CONTENT_CIRCLE_LIST_DETAIL_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const contentCircleListDetail = {
	state: { ...initialState },
	mutations,
};
