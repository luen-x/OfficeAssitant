const initialState = {
	data: ''
};

const mutations = {
	HR_RECRUIT_SOCIAL_SUMMARY_ADD_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrRecruitSocialSummaryAdd = {
	state: { ...initialState },
	mutations,
};
