import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		count: [0, 0, 0, 0, 0],
		'1': {
			...initPage
		},
		'2': {
			...initPage
		},
		'3': {
			...initPage
		},
		'4': {
			...initPage
		},
		'5': {
			...initPage
		}
	},

};

const mutations = {
	HR_PERSONNEL_MEMBER_MASTER_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			[type]: {
				...state.listInfo[type],
				total: data.totalCount,
				data: {
					...state.listInfo[type].data,
					[page]: data.list
				}
			},
		};
	},
	HR_PERSONNEL_MEMBER_MASTER_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	HR_PERSONNEL_MEMBER_MASTER_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo,
		};
		
	},
	HR_PERSONNEL_MEMBER_MASTER_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};


export const hrPersonnelMemberMaster = {
	state: { ...initialState },
	mutations,
};
