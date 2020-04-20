const initialState = {
	data: ''
};

const mutations = {
	HR_PERSONNEL_MEMBER_DETAIL_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrPersonnelMemberDetail = {
	state: { ...initialState },
	mutations,
};
