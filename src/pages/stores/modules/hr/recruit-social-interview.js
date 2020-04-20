const initialState = {
	data: ''
};

const mutations = {
	HR_RECRUIT_SOCIAL_INTERVIEW_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrRecruitSocialInterview = {
	state: { ...initialState },
	mutations,
};
