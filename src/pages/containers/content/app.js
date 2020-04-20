import { getIndexRoute, getRedirectRoute } from '@utils/utils';
import { getContentRoutes } from '@components/layout/left/content';

export const contentConfig = [
	{
		path: "/content",
		beforeEnter: (to, from, next) => {
			let redirect = getIndexRoute(getContentRoutes(_global.auth, _global.staff));
			next({ path: getRedirectRoute(redirect) });
		},
	},
	{
		path: "/content/activity/list",
		name: "content-activity-list",
		component: () => import("./modules/content-activity-list.vue")
	},
	{
		path: "/content/activity/audit",
		name: "content-activity-audit",
		component: () => import("./modules/content-activity-audit.vue")
	},
	{
		path: "/content/activity/classify",
		name: "content-activity-classify",
		component: () => import("./modules/content-activity-classify.vue")
	},
	{
		path: "/content/config/setoolkit/manage",
		name: "content-setoolkit-manage",
		component: () => import("./modules/content-setoolkit-manage.vue")
	},
	{
		path: "/content/config/setoolkit/set",
		name: "content-setoolkit-set",
		component: () => import("./modules/content-setoolkit-set.vue")
	},
	{
		path: "/content/config/setoolkit/download",
		name: "content-setoolkit-download",
		component: () => import("./modules/content-setoolkit-download.vue")
	},
	{
		path: "/content/config/satoolkit/manage",
		name: "content-satoolkit-manage",
		component: () => import("./modules/content-satoolkit-manage.vue")
	},
	{
		path: "/content/config/satoolkit/set",
		name: "content-satoolkit-set",
		component: () => import("./modules/content-satoolkit-set.vue")
	},
	{
		path: "/content/config/satoolkit/download",
		name: "content-satoolkit-download",
		component: () => import("./modules/content-satoolkit-download.vue")
	},
	{
		path: "/content/product/list",
		name: "content-product-list",
		component: () => import("./modules/content-product-list.vue")
	},
	{
		path: "/content/product/list/recycle",
		name: "content-product-list-recycle",
		component: () => import("./modules/content-product-list-recycle.vue")
	},
	{
		path: "/content/product/group",
		name: "content-product-group",
		component: () => import("./modules/content-product-group.vue")
	},
	{
		path: "/content/product/set",
		name: "content-product-set",
		component: () => import("./modules/content-product-set.vue")
	},
	{
		path: "/content/information/manage",
		name: "content-information-manage",
		component: () => import("./modules/content-information-manage.vue")
	},
	{
		path: "/content/information/classify",
		name: "content-information-classify",
		component: () => import("./modules/content-information-classify.vue")
	},
	{
		path: "/content/notice/inform",
		name: "content-notice-inform",
		component: () => import("./modules/content-notice-inform.vue")
	},
	{
		path: "/content/interaction",
		name: "content-interaction",
		component: () => import("./modules/content-interaction.vue")
	},
	{
		path: "/content/product/new",
		name: "content-product-new",
		component: () => import("./modules/content-product-new.vue")
	},
	{
		path: "/content/preview",
		name: "content-preview",
		component: () => import("./modules/content-preview.vue")
	},
	{
		path: '/content/search/result',
		name: 'content-search-result',
		component: () => import('./modules/content-search-result.vue')
	},
	{
		path: "/content/search",
		name: "content-search",
		component: () => import("./modules/content-search.vue")
	},
	{
		path: '/content/product/set/process',
		name: 'content-product-set-process',
		component: () => import('./modules/content-product-set-process.vue')
	},
	{
		path: '/content/product/set/project',
		name: 'content-product-set-project',
		component: () => import('./modules/content-product-set-project.vue')
	},
	{
		path: '/content/product/set/customer',
		name: 'content-product-set-customer',
		component: () => import('./modules/content-product-set-customer.vue')
	},
	{
		path: '/content/product/newprocess',
		name: 'content-product-newprocess',
		component: () => import('./modules/content-product-newprocess.vue')
	},
	{
		path: '/content/product/newproject',
		name: 'content-product-newproject',
		component: () => import('./modules/content-product-newproject.vue')
	},
	{
		path: '/content/product/newcustomer',
		name: 'content-product-newcustomer',
		component: () => import('./modules/content-product-newcustomer.vue')
	},
	{
		path: '/content/information/manage/preview',
		name: 'content-information-manage-preview',
		component: () => import('./modules/content-information-manage-preview.vue')
	},
	{
		path: '/content/product/newgroup',
		name: 'content-product-newgroup',
		component: () => import('./modules/content-product-newgroup.vue')
	},
	{
		path: '/content/config/material/bank',
		name: 'content-config-material-bank',
		component: () => import('./modules/content-config-material-bank.vue')
	},
	{
		path: '/content/config/material/check',
		name: 'content-config-material-check',
		component: () => import('./modules/content-config-material-check.vue')
	},
	{
		path: '/content/config/material/role',
		name: 'content-config-material-role',
		component: () => import('./modules/content-config-material-role.vue')
	},
	{
		path: '/content/config/material/set',
		name: 'content-config-material-set',
		component: () => import('./modules/content-config-material-set.vue')
	},
	{
		path: '/content/config/material/record',
		name: 'content-config-material-record',
		component: () => import('./modules/content-config-material-record.vue')
	},
	{
		path: "/content/service/setting",
		name: "content-service-setting",
		component: () => import("./modules/content-service-setting.vue")
	},
	{
		path: '/content/config/statistics/manage',
		name: 'content-config-statistics-manage',
		component: () => import('./modules/content-config-statistics-manage.vue')
	},
	{
		path: '/content/config/statistics/manage/detail',
		name: 'content-config-statistics-manage-detail',
		component: () => import('./modules/content-config-statistics-manage-detail.vue')
	},
	{
		path: '/content/config/statistics/warning',
		name: 'content-config-statistics-warning',
		component: () => import('./modules/content-config-statistics-warning.vue')
	},
	{
		path: '/content/notice/wechat',
		name: 'content-notice-wechat',
		component: () => import('./modules/content-notice-wechat.vue')
	},
	{
		path: '/content/information/publish',
		name: 'content-information-publish',
		component: () => import('./modules/content-information-publish.vue')
	},
	{
		path: '/content/information/publish/manage',
		name: 'content-information-publish-manage',
		component: () => import('./modules/content-information-publish-manage.vue')
	},
	{
		path: '/content/information/publish/content',
		name: 'content-information-publish-content',
		component: () => import('./modules/content-information-publish-content.vue')
	},
	{
		path: '/content/reward',
		name: 'content-reward',
		component: () => import('./modules/content-reward.vue')
	},
	{
		path: '/content/prop/set',
		name: 'content-prop-set',
		component: () => import('./modules/content-prop-set.vue')
	},
	{
		path: '/content/rules/sale',
		name: 'content-rules-sale',
		component: () => import('./modules/content-rules-sale.vue')
	},
	{
		path: '/content/circle/list',
		name: 'content-circle-list',
		component: () => import('./modules/content-circle-list.vue')
	},
	{
		path: '/content/circle/list/add',
		name: 'content-circle-add',
		component: () => import('./modules/content-circle-add.vue')
	},
	{
		path: '/content/circle/list/detail',
		name: 'content-circle-list-detail',
		component: () => import('./modules/content-circle-list-detail.vue')
	}
];
