import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
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
		},
		'6': {
			...initPage
		},
		'7': {
			...initPage
		},
		'8': {
			...initPage
		},
		'9': {
			...initPage
		},
		'10': {
			...initPage
		}
	}
};

const mutations = {
	HR_RECRUIT_SOCIAL_SOCIAL_TRANSFORM_DETAILS_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			[type]: {
				...state.listInfo[type],
				total: data.totalCount,
				data: {
					...state.listInfo[type].data,
					[page]: data.list
				}
			}
		};
	},
	HR_RECRUIT_SOCIAL_SOCIAL_TRANSFORM_DETAILS_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	HR_RECRUIT_SOCIAL_SOCIAL_TRANSFORM_DETAILS_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_RECRUIT_SOCIAL_SOCIAL_TRANSFORM_DETAILS_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const hrRecruitSocialSocialTransformDetails = {
	state: { ...initialState },
	mutations,
};
