const initialState = {
	data: ''
};

const mutations = {
	HR_RECRUIT_SCHOOL_PAPER_PREVIEW_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrRecruitSchoolPaperPreview = {
	state: { ...initialState },
	mutations,
};
