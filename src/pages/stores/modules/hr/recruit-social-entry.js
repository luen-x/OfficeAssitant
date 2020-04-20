const initialState = {
	data: ''
};

const mutations = {
	HR_RECRUIT_SOCIAL_ENTRY_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrRecruitSocialEntry = {
	state: { ...initialState },
	mutations,
};
