import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		count: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		'0': {
			...initPage
		},
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
		}
	}
};

const mutations = {
	HR_RECRUIT_SCHOOL_STATISTICS_INFO_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			count: [
				data.entering_count, 
				data.send_offer_count, 
				data.reply_students_count, 
				data.register_students_count,
				data.try_post_count,
				data.entry_students_count,
				data.weed_out_count, 
				data.leave_count, 
				data.lose_students_one_count,
				data.lose_students_three_count
			],
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
	HR_RECRUIT_SCHOOL_STATISTICS_INFO_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	HR_RECRUIT_SCHOOL_STATISTICS_INFO_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_RECRUIT_SCHOOL_STATISTICS_INFO_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const hrRecruitSchoolStatisticsInfo = {
	state: { ...initialState },
	mutations,
};
