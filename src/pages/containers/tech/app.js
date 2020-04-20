export const techConfig = [
	{
		path: '/tech',
		redirect: '/tech/project/plan/overview'
	},
	{
		path: '/tech/project/plan/overview',
		name: 'tech-project-plan-overview',
		component: () => import('./modules/tech-project-plan-overview.vue')
	},
	{
		path: '/tech/project/plan/demand',
		name: 'tech-project-plan-demand',
		component: () => import('./modules/tech-project-plan-demand.vue')
	},
	{
		path: '/tech/project/plan/duty',
		name: 'tech-project-plan-duty',
		component: () => import('./modules/tech-project-plan-duty.vue')
	},
	{
		path: '/tech/project/publish/notice',
		name: 'tech-project-publish-notice',
		component: () => import('./modules/tech-project-publish-notice.vue')
	},
	{
		path: '/tech/project/publish/document',
		name: 'tech-project-publish-document',
		component: () => import('./modules/tech-project-publish-document.vue')
	},
	{
		path: '/tech/project/plan/demand/add',
		name: 'tech-project-plan-demand-add',
		component: () => import('./modules/tech-project-plan-demand-add.vue')
	},
	{
		path: '/tech/project/publish/document/add',
		name: 'tech-project-publish-document-add',
		component: () => import('./modules/tech-project-publish-document-add.vue')
	},
	{
		path: '/tech/project/publish/document/category',
		name: 'tech-project-publish-document-category',
		component: () => import('./modules/tech-project-publish-document-category.vue')
	},
	{
		path: '/tech/project/publish/notice/add',
		name: 'tech-project-publish-notice-add',
		component: () => import('./modules/tech-project-publish-notice-add.vue')
	},
	{
		path: '/tech/share/document',
		name: 'tech-share-document',
		component: () => import('./modules/tech-share-document.vue')
	},
	{
		path: '/tech/share/duty',
		name: 'tech-share-duty',
		component: () => import('./modules/tech-share-duty.vue')
	},
	{
		path: '/tech/share/notice',
		name: 'tech-share-notice',
		component: () => import('./modules/tech-share-notice.vue')
	},
	{
		path: '/tech/share/progress',
		name: 'tech-share-progress',
		component: () => import('./modules/tech-share-progress.vue')
	}
];
