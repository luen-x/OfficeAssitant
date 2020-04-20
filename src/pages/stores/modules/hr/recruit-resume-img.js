const initialState = {
	data: ''
};

const mutations = {
	HR_RECRUIT_RESUME_IMG_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrRecruitResumeImg = {
	state: { ...initialState },
	mutations,
};
