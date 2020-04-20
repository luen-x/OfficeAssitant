// import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		list: []
	}
};
const findRow = (rows, id) => {
	if (!Array.isArray(rows)) {
		return undefined;
	}
	let exist = rows.find(item => item.menus_id === id);
	if (exist) return exist;
	for (let i = 0; i < rows.length; i++) {
		exist = findRow(rows[i].children, id);
		if (exist) return exist;
	}
	return undefined;
};
const mutations = {
	SETTINGS_ROUTER_SET_LIST_GET_SUCCESS(state, { data, param }) {
		state.listInfo = {
			...state.listInfo,
			list: data
		};
	},
	SETTINGS_ROUTER_SET_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SETTINGS_ROUTER_SET_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SETTINGS_ROUTER_SET_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	_SETTINGS_ROUTER_SET_UPDATE_ROW(state, row) {		
		const exist = findRow(state.listInfo.list, row.menus_id);
		if (exist) {
			exist.frontend_url = row.frontend_url;
			exist.backend_urls = row.backend_urls;
		}
		state.listInfo.list[0] = { ...state.listInfo.list[0] };


	}
};

export const settingsRouterSet = {
	state: { ...initialState },
	mutations,
};
