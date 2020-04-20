const initialState = {
	data: ''
};

const mutations = {
	HR_ACADEMY_COURSE_QUESTION_ADD_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrAcademyCourseQuestionAdd = {
	state: { ...initialState },
	mutations,
};
