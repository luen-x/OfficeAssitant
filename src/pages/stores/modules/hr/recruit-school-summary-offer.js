const initialState = {
	data: ''
};

const mutations = {
	HR_RECRUIT_SCHOOL_SUMMARY_OFFER_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrRecruitSchoolSummaryOffer = {
	state: { ...initialState },
	mutations,
};
