const initialState = {
	data: ''
};

const mutations = {
	HR_ACADEMY_COURSE_EXAM_VIEW_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrAcademyCourseExamView = {
	state: { ...initialState },
	mutations,
};
