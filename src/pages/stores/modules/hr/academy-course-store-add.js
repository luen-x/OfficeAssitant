const initialState = {
	data: ''
};

const mutations = {
	HR_ACADEMY_COURSE_STORE_ADD_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrAcademyCourseStoreAdd = {
	state: { ...initialState },
	mutations,
};
