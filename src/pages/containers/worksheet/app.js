export const worksheetConfig = [
	{
		path: '/worksheet',
		redirect: '/worksheet/control/bug'
	},
	{
		path: '/worksheet/control/bug',
		name: 'worksheet-control-bug',
		component: () => import('./modules/worksheet-control-bug.vue')
	},
	{
		path: '/worksheet/control/project',
		name: 'worksheet-control-project',
		component: () => import('./modules/worksheet-control-project.vue')
	},
	{
		path: '/worksheet/control/bug/add',
		name: 'worksheet-control-bug-add',
		component: () => import('./modules/worksheet-control-bug-add.vue')
	},
	{
		path: '/worksheet/control/bug/detail',
		name: 'worksheet-control-bug-detail',
		component: () => import('./modules/worksheet-control-bug-detail.vue')
	},
	{
		path: '/worksheet/control/project/add',
		name: 'worksheet-control-project-add',
		component: () => import('./modules/worksheet-control-project-add.vue')
	},
	{
		path: '/worksheet/control/project/detail',
		name: 'worksheet-control-project-detail',
		component: () => import('./modules/worksheet-control-project-detail.vue')
	}
];
