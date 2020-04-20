export const collectConfig = [
	{
		path: '/collect',
		redirect: '/collect/main'
	},
	{
		path: '/collect/main',
		name: 'collect-main',
		component: () => import('./modules/collect-main.vue')
	},
	{
		path: '/collect/main/case/edit',
		name: 'collect-main-case-edit',
		component: () => import('./modules/collect-main-case-edit.vue')
	},
	{
		path: '/collect/main/case/detail',
		name: 'collect-main-case-detail',
		component: () => import('./modules/collect-main-case-detail.vue')
	}
];
