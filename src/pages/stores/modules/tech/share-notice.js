const initialState = {
	data: ''
};

const mutations = {
	TECH_SHARE_NOTICE_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const techShareNotice = {
	state: { ...initialState },
	mutations,
};
