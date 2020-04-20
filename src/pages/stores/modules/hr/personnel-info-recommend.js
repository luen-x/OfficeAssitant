const initialState = {
	data: ''
};

const mutations = {
	HR_PERSONNEL_INFO_RECOMMEND_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrPersonnelInfoRecommend = {
	state: { ...initialState },
	mutations,
};
