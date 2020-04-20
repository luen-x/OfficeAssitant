const initialState = {
	data: ''
};

const mutations = {
	HR_RECRUIT_SOCIAL_SUMMARY_EDIT_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrRecruitSocialSummaryEdit = {
	state: { ...initialState },
	mutations,
};
