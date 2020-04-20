import { getIndexRoute, getRedirectRoute } from '@utils/utils';
import { getStatisticsRoutes } from '@components/layout/left/statistics';

export const statisticsConfig = [
	{ 
		path: "/statistics",
		beforeEnter: (to, from, next) => {
			let redirect = getIndexRoute(getStatisticsRoutes(_global.auth, _global.staff));
			next({ path: getRedirectRoute(redirect) });
		},
	},
	{
		path: '/statistics/customer/distribution',
		name: 'statistics-customer-distribution',
		component: () => import('./modules/statistics-customer-distribution.vue')
	},
	{
		path: '/statistics/customer/employee/new',
		name: 'statistics-customer-employee-new',
		component: () => import('./modules/statistics-customer-employee-new.vue')
	},
	{
		path: '/statistics/customer/employee/type',
		name: 'statistics-customer-employee-type',
		component: () => import('./modules/statistics-customer-employee-type.vue')
	},
	{
		path: '/statistics/deal/customer',
		name: 'statistics-deal-customer',
		component: () => import('./modules/statistics-deal-customer.vue')
	},
	{
		path: '/statistics/deal/refund',
		name: 'statistics-deal-refund',
		component: () => import('./modules/statistics-deal-refund.vue')
	},
	{
		path: '/statistics/deal/switch',
		name: 'statistics-deal-switch',
		component: () => import('./modules/statistics-deal-switch.vue')
	},
	{
		path: '/statistics/quality/data',
		name: 'statistics-quality-data',
		component: () => import('./modules/statistics-quality-data.vue')
	},
	{
		path: '/statistics/quality/rank',
		name: 'statistics-quality-rank',
		component: () => import('./modules/statistics-quality-rank.vue')
	}
];
