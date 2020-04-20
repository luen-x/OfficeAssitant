const initialState = {
	list: [],
	canSocket: true // 是否将 socket 数据加入 list
};

const mutations = {
	SALE_MAIN_SCENE_GET_SUCCESS(state, { data: { list }, param }) {
		state.list.push(...list);
	},
	SALE_MAIN_SCREEN_INIT(state) {
		state.list = [];
	},
	SALE_MAIN_SCENE_PRAISE(state, { interact_id }) {
		state.list.forEach(v => {
			if (v.interact_id != interact_id) return;
			v.is_praise = v.is_praise ? 0 : 1;
			v.is_praise ? ++v.praise_num : --v.praise_num;
		});
	},
	SALE_MAIN_SCREEN_COLLECT(state, { interact_id }) {
		state.list.forEach(v => {
			if (v.interact_id != interact_id) return;
			v.is_collect = v.is_collect ? 0 : 1;
		});
	},
	SALE_MAIN_SCREEN_WITHDRAW(state, { interact_id }) {
		state.list = state.list.filter(v => v.interact_id != interact_id);
	},
	SALE_MAIN_SCREEN_CAN_SOCKET(state, { bool }) {
		state.canSocket = bool;
	},
	SALE_MAIN_SCREEN_ADD_MSG(state, { message }) {
		state.list.unshift(message);
	},
	SALE_MAIN_SCREEN_SOCKET_PRAISE(state, { interact_id, number }) {
		state.list.forEach(v => {
			if (v.interact_id == interact_id) {
				v.praise_num = number;
			}
		});
	}
};

export const saleMainScene = {
	state: { ...initialState },
	mutations,
};
