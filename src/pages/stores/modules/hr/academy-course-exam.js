const initialState = {
	data: ''
};

const mutations = {
	HR_ACADEMY_COURSE_EXAM_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrAcademyCourseExam = {
	state: { ...initialState },
	mutations,
};
