const initialState = {
	data: ''
};

const mutations = {
	TECH_PROJECT_PUBLISH_NOTICE_ADD_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const techProjectPublishNoticeAdd = {
	state: { ...initialState },
	mutations,
};
