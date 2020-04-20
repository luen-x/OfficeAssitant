const initialState = {
	data: ''
};

const mutations = {
	HR_PERSONNEL_MEMBER_MEMBER_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrPersonnelMemberMember = {
	state: { ...initialState },
	mutations,
};
