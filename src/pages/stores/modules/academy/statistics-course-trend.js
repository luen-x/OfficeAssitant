const initialState = {
	data: ''
};

const mutations = {
	ACADEMY_STATISTICS_COURSE_TREND_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const academyStatisticsCourseTrend = {
	state: { ...initialState },
	mutations,
};
