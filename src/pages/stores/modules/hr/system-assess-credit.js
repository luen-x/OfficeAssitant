import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {

	},
	tabs: []
};

const mutations = {
	HR_STAIR_DEPART_GET_SUCCESS(state, { data }) {
		state.tabs = data;
		data.forEach(item => {
			state.listInfo = {
				...state.listInfo,
				[item.depart_id]: {

				}
			};
		});
	},
	HR_SYSTEM_ASSESS_CREDIT_GET_SUCCESS(state, { data, param: { type } }) {
		state.listInfo = {
			...state.listInfo,
			[type]: data
		};
	}
};

export const hrSystemAssessCredit = {
	state: { ...initialState },
	mutations,
};
