const initialState = {
	data: ''
};

const mutations = {
	SALE_TICKET_APPLY_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const saleTicketApply = {
	state: { ...initialState },
	mutations,
};
