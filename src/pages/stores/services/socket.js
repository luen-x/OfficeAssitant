/**
 * socket管理
 */
import { createSocket } from './utils';

export const sockets = {
	...createSocket({
		key: "notice",
		param: { bind_type: 1 },
		bindUrl: '_COMMON_SOCKET_BIND_GET'
	}),
	...createSocket({
		key: "pkScene",
		param: { bind_type: 2 },
		bindUrl: '_COMMON_SOCKET_BIND_GET'
	})
};