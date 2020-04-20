const initialState = {
	data: ''
};

const mutations = {
	HR_ARCHIVES_ACHIE_TREND_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrArchivesAchieTrend = {
	state: { ...initialState },
	mutations,
};
