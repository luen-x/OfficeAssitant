const initialState = {
	data: ''
};

const mutations = {
	HR_RECRUIT_ENTRY_DETAIL_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrRecruitEntryDetail = {
	state: { ...initialState },
	mutations,
};
