import { getIndexRoute, getRedirectRoute } from '@utils/utils';
import { getCollageRoutes } from '@components/layout/left/collage';

export const collageConfig = [
	{
		path: '/collage',
		beforeEnter: (to, from, next) => {
			let redirect = getIndexRoute(getCollageRoutes(_global.auth, _global.staff));
			next({ path: getRedirectRoute(redirect) });
		},
	},
	{
		path: '/collage/main',
		name: 'collage-main',
		component: () => import('./modules/collage-main.vue')
	},
	{
		path: '/collage/main/information',
		name: 'collage-main-information',
		component: () => import('./modules/collage-main-information.vue')
	},
	{
		path: '/collage/main/schedule',
		name: 'collage-main-schedule',
		component: () => import('./modules/collage-main-schedule.vue')
	},
	{
		path: '/collage/customer/cooperate',
		name: 'collage-customer-cooperate',
		component: () => import('./modules/collage-customer-cooperate.vue')
	},
	{
		path: '/collage/customer/refund',
		name: 'collage-customer-refund',
		component: () => import('./modules/collage-customer-refund.vue')
	},
	{
		path: '/collage/service',
		name: 'collage-service',
		component: () => import('./modules/collage-service.vue')
	},
	{
		path: '/collage/check/service/export',
		name: 'collage-check-service-export',
		component: () => import('./modules/collage-check-service-export.vue')
	},
	{
		path: '/collage/record/outline',
		name: 'collage-record-outline',
		component: () => import('./modules/collage-record-outline.vue')
	},
	{
		path: '/collage/record/online',
		name: 'collage-record-online',
		component: () => import('./modules/collage-record-online.vue')
	},
	{
		path: '/collage/record/lesson',
		name: 'collage-record-lesson',
		component: () => import('./modules/collage-record-lesson.vue')
	},
	{
		path: '/collage/check/service',
		name: 'collage-check-service',
		component: () => import('./modules/collage-check-service.vue')
	},
	// {
	// 	path: '/collage/check/service',
	// 	name: 'collage-check-service',
	// 	component: () => import('./modules/collage-check-service.vue')
	// },
	{
		path: '/collage/check/statistic/data',
		name: 'collage-check-statistic-data',
		component: () => import('./modules/collage-check-statistic-data.vue')
	},
	{
		path: '/collage/check/statistic/check',
		name: 'collage-check-statistic-check',
		component: () => import('./modules/collage-check-statistic-check.vue')
	},
	{
		path: '/collage/setting/course',
		name: 'collage-setting-course',
		component: () => import('./modules/collage-setting-course.vue')
	},
	{
		path: '/collage/setting/subsidy',
		name: 'collage-setting-subsidy',
		component: () => import('./modules/collage-setting-subsidy.vue')
	},
	{
		path: '/collage/setting/promoting',
		name: 'collage-setting-promoting',
		component: () => import('./modules/collage-setting-promoting.vue')
	},
	{
		path: '/collage/setting/team',
		name: 'collage-setting-team',
		component: () => import('./modules/collage-setting-team.vue')
	},
	{
		path: '/collage/salary',
		name: 'collage-salary',
		component: () => import('./modules/collage-salary.vue')
	},
	{
		path: '/collage/salary/month',
		name: 'collage-salary-month',
		component: () => import('./modules/collage-salary-month.vue')
	},
	{
		path: '/collage/consultation',
		name: 'collage-consultation',
		component: () => import('./modules/collage-consultation.vue')
	}
];
