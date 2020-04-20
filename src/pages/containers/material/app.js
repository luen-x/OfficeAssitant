export const materialConfig = [
	{
		path: '/material',
		redirect: '/material/main'
	},
	{
		path: '/material/material',
		name: 'material-material',
		component: () => import('./modules/material-material.vue')
	}
];
