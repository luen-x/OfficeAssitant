const initialState = {
	list: [],
	isFetched: false
};

const mutations = {
	HR_TOOL_MODULES_OFFER_GET_SUCCESS(state, { data, param }) {
		state.list = [...data];
		state.isFetched = true;
	},
	HR_TOOL_MODULES_OFFER_INIT(state, payload) {
		state.list = {
			...initialState.list
		};
		state.isFetched = false;
	}
};

export const hrToolModulesOffer = {
	state: { ...initialState },
	mutations,
};
