const initialState = {
	data: ''
};

const mutations = {
	HR_ARCHIVES_PERSON_RECOMMEND_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrArchivesPersonRecommend = {
	state: { ...initialState },
	mutations,
};