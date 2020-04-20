import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		...initPage
	}
};

const mutations = {
	SALE_FRACTION_MATERIAL_UPLOAD_MY_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			total: data.totalCount,
			data: {
				...state.listInfo.data,
				[page]: data.list
			}
		};
	},
	SALE_FRACTION_MATERIAL_UPLOAD_MY_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			reset: true
		};
	},
	SALE_FRACTION_MATERIAL_UPLOAD_MY_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SALE_FRACTION_MATERIAL_UPLOAD_MY_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const saleFractionMaterialUploadMy = {
	state: { ...initialState },
	mutations,
};
