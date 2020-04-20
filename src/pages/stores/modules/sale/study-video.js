const initialState = {
	data: ''
};

const mutations = {
	SALE_STUDY_VIDEO_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const saleStudyVideo = {
	state: { ...initialState },
	mutations,
};
