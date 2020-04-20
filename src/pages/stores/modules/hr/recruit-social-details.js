const initialState = {
	data: ''
};

const mutations = {
	HR_RECRUIT_SOCIAL_DETAILS_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrRecruitSocialDetails = {
	state: { ...initialState },
	mutations,
};
