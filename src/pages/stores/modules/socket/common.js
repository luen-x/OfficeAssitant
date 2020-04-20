import { initPage } from '@utils/utils';

const initialState = {
	'/sc/service/pause': 0, // 服务暂停申请
	'/sc/service/close': 0, // 服务项关闭申请
	'/sc/service/appeal': 0, // 服务申诉
};

const mutations = {
	SOCKET_COMMON_NOTICE_UNREAD(state, payload = {}) {
		let { remind_type } = payload;
		switch (remind_type) {
			case 1:
				state['/sc/service/pause'] = 1;
				break;
			case 2:
				state['/sc/service/close'] = 1;
				break;
			case 3:
				state['/sc/service/appeal'] = 1;
				break;
			default:
				break;
		}
	},
	SOCKET_COMMON_NOTICE_READ(state, { route, status }) {
		state[route] = status;
	}
};

export const socketCommon = {
	state: { ...initialState },
	mutations,
};
