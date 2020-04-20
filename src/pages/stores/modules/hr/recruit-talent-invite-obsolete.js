const initialState = {
	data: ''
};

const mutations = {
	HR_RECRUIT_TALENT_INVITE_OBSOLETE_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrRecruitTalentInviteObsolete = {
	state: { ...initialState },
	mutations,
};
