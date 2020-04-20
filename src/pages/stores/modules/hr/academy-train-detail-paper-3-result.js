import { initPage } from '@utils/utils';

const initTabs = [];

const initialState = {
	listInfo: {
		
	},
	tabs: []
};

const mutations = {
	HR_ACADEMY_TRAIN_DETAIL_PAPER_3_RESULT_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
	HR_ACADEMY_TRAIN_DETAIL_PAPER_RESULT_TABS_GET_SUCCESS(state, examTime) {
		let tabs = [
			{ label: '已考', value: '1' }, 
			{ label: '未考', value: '2' }, 
			{ label: '首次考试', value: '3' }, 
			{ label: '待阅', value: '7' }, 
			{ label: '已通过', value: '8' }, 
			{ label: '未通过', value: '9' } 
		];
		switch (examTime) {
			case 1:
				tabs.splice(3, 0, {
					label: '一次补考', value: '4'
				});
				break;
			case 2:
				tabs.splice(3, 0, 
					{ label: '一次补考', value: '4' }, { label: '二次补考', value: '5' });
				break;
			case 3:
				tabs.splice(3, 0, 
					{ label: '一次补考', value: '4' }, 
					{ label: '二次补考', value: '5' }, 
					{ label: '三次补考', value: '6' });
				break;
			default:
				break;
		} 
		state.listInfo = tabs.reduce((init, cur) => {
			init[cur.value] = {
				...initPage,
			};
			return init;
		}, {});
		state.tabs = tabs;
	},
	HR_ACADEMY_TRAIN_DETAIL_PAPER_3_RESULT_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	HR_ACADEMY_TRAIN_DETAIL_PAPER_3_RESULT_TABS_INIT(state) {
		state.tabs = [];
	},
	HR_ACADEMY_TRAIN_DETAIL_PAPER_3_RESULT_LIST_INIT(state, payload) {
		// state.listInfo = {
		// 	...initialState.listInfo
		// };
		state.listInfo = state.tabs.reduce((init, cur) => {
			init[cur.value] = {
				...initPage
			};
			return init;
		}, {});
	},
	HR_ACADEMY_TRAIN_DETAIL_PAPER_3_RESULT_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const hrAcademyTrainDetailPaper3Result = {
	state: { ...initialState },
	mutations,
};
