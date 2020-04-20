import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		'1': {
			...initPage
		},
		'2': {
			...initPage
		}
	},
};

const mutations = {
	COLLAGE_PROCESS_DOCKER_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
	COLLAGE_PROCESS_DOCKER_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	COLLAGE_PROCESS_DOCKER_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	COLLAGE_PROCESS_DOCKER_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	}
};

export const collageProcessDocker = {
	state: { ...initialState },
	mutations,
};
