const initialState = {
	data: ''
};

const mutations = {
	HR_PERSONNEL_MEMBER_STAFF_INFO_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrPersonnelMemberStaffInfo = {
	state: { ...initialState },
	mutations,
};
