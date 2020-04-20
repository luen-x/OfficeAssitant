import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {

	},
	tabs: [],
};

const mutations = {
	HR_STAIR_DEPART_GET_SUCCESS(state, { data }) {
		state.tabs = data;
		data.forEach(item => {
			state.listInfo = {
				...state.listInfo,
				[item.depart_id]: []
			};
		});
	},
	HR_SYSTEM_ASSESS_UP_GET_SUCCESS(state, { data, param: { first_depart_id } }) {
		state.listInfo = {
			...state.listInfo,
			[first_depart_id]: data
		};
	}
};

export const hrSystemAssessUp = {
	state: { ...initialState },
	mutations,
};
