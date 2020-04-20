const initialState = {
	data: {},
	color: '#333333'
};

const mutations = {
	HR_TOOL_MODULES_OFFER_ADD_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	},
	HR_TOOL_MODULES_OFFER_ADD_COLOR(state, { color }) {
		state.color = color;
	},
	HR_TOOL_MODULES_OFFER_ADD_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const hrToolModulesOfferAdd = {
	state: { ...initialState },
	mutations,
};
