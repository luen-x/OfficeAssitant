import tpl from './modules/login';

export const loginConfig = [
	{ 
		path: '/login',
		name: 'login',
		component: () => import('./modules/login.vue'),
		// 此设计暂不推行
		meta: {
			title: '登录',
			auth: undefined
		}
	}
];
