const initialState = {
	data: ''
};

const mutations = {
	ACADEMY_SUPPORT_COURSE_ADD_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const academySupportCourseAdd = {
	state: { ...initialState },
	mutations,
};
