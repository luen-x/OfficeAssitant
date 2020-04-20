import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		'1': {
			system_function: {
				list: [],
				result: '',
				all: 0,
			},
			service_toolkit: {
				list: [],
				result: '',
				all: 0,
			},
			sale_toolkit: {
				list: [],
				result: '',
				all: 0,
			},
			customer: {
				list: [],
				result: '',
				all: 0,
			},
			staff: {
				list: [],
				result: '',
				all: 0,
			},
			material: {
				list: [],
				result: '',
				all: 0,
			},
			consultation: {
				list: [],
				result: '',
				all: 0,
			},
			product: {
				list: [],
				result: '',
				all: 0,
			},
			case: {
				list: [],
				result: '',
				all: 0,
			},
		},
		'2': {
			...initPage,
			data: {
				"1": ''
			}
		},
		'3': {
			...initPage,
			data: {
				"1": ''
			}
		},
		'4': {
			...initPage,
			data: {
				"1": ''
			}
		},
		'5': {
			...initPage,
			data: {
				"1": ''
			}
		},
		'6': {
			...initPage,
			data: {
				"1": ''
			}
		},
		'7': {
			...initPage,
			data: {
				"1": ''
			}
		},
		'8': {
			...initPage,
			data: {
				"1": ''
			}
		},
		'9': {
			...initPage,
			data: {
				"1": ''
			}
		},
		'10': {
			...initPage,
			data: {
				"1": ''
			}
		},
	},
};

const mutations = {
	CONTENT_SEARCH_RESULT_GET_SUCCESS(state, { data, param: { type, page } }) {
		if (data.list) {
			state.listInfo = {
				...state.listInfo,
				[type]: {
					...state.listInfo[type],
					total: data.totalCount || 10,
					result: data.result_str,
					result_str_top: data.result_str_top,
					data: {
						...state.listInfo[type].data,
						[page]: data.list
					}
				}
			};
		} else {
			state.listInfo = {
				...state.listInfo,
				[type]: {
					...data
				}
			};
		}
	},
	CONTENT_SEARCH_RESULT_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	CONTENT_SEARCH_RESULT_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	CONTENT_SEARCH_RESULT_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	// CONTENT_SEARCH_RESULT_ICON_CHANGE(state, {n, toggle}) {
	// 	state.listInfo[1].service_toolkit.list.map(item => {
	// 		if (item.material_id == n.material_id) {
	// 			item.show = toggle;
	// 		}
	// 		return;
	// 	});
	// }
};

export const contentSearchResult = {
	state: { ...initialState },
	mutations,
};
