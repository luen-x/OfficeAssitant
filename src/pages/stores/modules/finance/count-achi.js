import {
	initPage
} from '@utils/utils';

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
	}
};

const mutations = {
	FINANCE_COUNT_STAFF_DETAIL_SORT_SUPER_LIST_GET_SUCCESS(state, {
		data,
		param: {
			page
		}
	}) {
		let type = "1";
		let departArr = data.map(item => { return item.depart_name; }) || [];
		state.listInfo = {
			...state.listInfo,
			departArr,
			[type]: {
				...state.listInfo[type],
				total: data[0].totalCount,
				data: {
					...state.listInfo[type].data,
					[page]: data[0].list,
					depart_name: data[0].depart_name,
					sort_name: data[0].sort_name,
				}
			},
		};
		type = "2";
		state.listInfo = {
			...state.listInfo,
			[type]: {
				...state.listInfo[type],
				total: data[1].totalCount,
				data: {
					...state.listInfo[type].data,
					[page]: data[1].list,
					depart_name: data[1].depart_name,
					sort_name: data[1].sort_name,
				}
			},

		};
	},
	FINANCE_COUNT_STAFF_DETAIL_SORT_SUPER_LIST_RESET(state) {
		state.listInfo = {
			...initialState.listInfo,
			"1": {
				...initPage,
				reset: true
			},
			"2": {
				...initPage,
				reset: true
			},
		};
	},
	FINANCE_COUNT_STAFF_DETAIL_SORT_SUPER_LIST_INIT(state, payload) {
		state.listInfo = {
			...state.listInfo,
			"1": JSON.parse(JSON.stringify(initPage)),
			"2": JSON.parse(JSON.stringify(initPage)),
		};
		// state.listInfo = {
		// 	...initialState.listInfo
		// };
	},
	FINANCE_COUNT_STAFF_DETAIL_SORT_SUPER_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	// *****************第二张表
	FINANCE_COUNT_STAFF_DETAIL_SORT_DEPART_LIST_GET_SUCCESS(state, {
		data,
		param: {
			page
		}
	}) {
		let type = "3";
		state.listInfo = {
			...state.listInfo,
			[type]: {
				...state.listInfo[type],
				total: data[0].totalCount,
				data: {
					...state.listInfo[type].data,
					[page]: data[0].list,
					depart_name: data[0].depart_name,
					sort_name: data[0].sort_name,
				}
			},
		};
		type = "4";
		state.listInfo = {
			...state.listInfo,
			[type]: {
				...state.listInfo[type],
				total: data[1].totalCount,
				data: {
					...state.listInfo[type].data,
					[page]: data[1].list,
					depart_name: data[1].depart_name,
					sort_name: data[1].sort_name,
				}
			},

		};
	},
	FINANCE_COUNT_STAFF_DETAIL_SORT_DEPART_LIST_RESET(state) {
		state.listInfo = {
			...initialState.listInfo,
			"3": {
				...initPage,
				reset: true
			},
			"4": {
				...initPage,
				reset: true
			},
		};
	},
	FINANCE_COUNT_STAFF_DETAIL_SORT_DEPART_LIST_INIT(state, payload) {
		state.listInfo = {
			...state.listInfo,
			"3": JSON.parse(JSON.stringify(initPage)),
			"4": JSON.parse(JSON.stringify(initPage)),
		};
	},
	FINANCE_COUNT_STAFF_DETAIL_SORT_DEPART_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	// **********************v 第三张表
	FINANCE_COUNT_STAFF_DETAIL_SORT_STAFF_LIST_GET_SUCCESS(state, {
		data,
		param: {
			page
		}
	}) {
		let type = "5";
		state.listInfo = {
			...state.listInfo,
			[type]: {
				...state.listInfo[type],
				total: data[0].totalCount,
				data: {
					...state.listInfo[type].data,
					[page]: data[0].list,
					depart_name: data[0].depart_name,
					sort_name: data[0].sort_name,
				}
			},
		};
		type = "6";
		state.listInfo = {
			...state.listInfo,
			[type]: {
				...state.listInfo[type],
				total: data[1].totalCount,
				data: {
					...state.listInfo[type].data,
					[page]: data[1].list,
					depart_name: data[1].depart_name,
					sort_name: data[1].sort_name,
				}
			},

		};
	},
	FINANCE_COUNT_STAFF_DETAIL_SORT_STAFF_LIST_RESET(state) {
		state.listInfo = {
			...initialState.listInfo,
			"5": {
				...initPage,
				reset: true
			},
			"6": {
				...initPage,
				reset: true
			},
		};
	},
	FINANCE_COUNT_STAFF_DETAIL_SORT_STAFF_LIST_INIT(state, payload) {
		state.listInfo = {
			...state.listInfo,
			"5": JSON.parse(JSON.stringify(initPage)),
			"6": JSON.parse(JSON.stringify(initPage)),
		};
	},
	FINANCE_COUNT_STAFF_DETAIL_SORT_STAFF_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const financeCountAchi = {
	state: { ...initialState
	},
	mutations,
};
