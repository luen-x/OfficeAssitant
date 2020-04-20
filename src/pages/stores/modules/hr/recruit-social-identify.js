const initialState = {
	data: ''
};

const mutations = {
	HR_RECRUIT_SOCIAL_IDENTIFY_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrRecruitSocialIdentify = {
	state: { ...initialState },
	mutations,
};
