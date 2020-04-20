import { getIndexRoute, getRedirectRoute } from '@utils/utils';
import { getStatisticRoutes } from '@components/layout/left/statistic';



export const statisticConfig = [
	{
		path: "/statistic",
		beforeEnter: (to, from, next) => {
			let redirect = getIndexRoute(getStatisticRoutes(_global.auth, _global.staff));
			next({ path: getRedirectRoute(redirect) });
		},
	},
	{
		path: '/statistic/business/sale',
		name: 'statistic-business-sale',
		component: () => import('./modules/statistic-business-sale.vue')
	},
	{
		path: '/statistic/business/customer',
		name: 'statistic-business-customer',
		component: () => import('./modules/statistic-business-customer.vue')
	},
	{
		path: '/statistic/business/customer/deal',
		name: 'statistic-business-customer-deal',
		component: () => import('./modules/statistic-business-customer-deal.vue')
	}, 
	{	path: '/statistic/business/sale/rank',
		name: 'statistic-business-sale-rank',
		component: () => import('./modules/statistic-business-sale-rank.vue')
	},
	{
		path: '/statistic/business/sale/rank/depart',
		name: 'statistic-business-sale-rank-depart',
		component: () => import('./modules/statistic-business-sale-rank-depart.vue')
	},
	{
		path: '/statistic/business/sale/rank/staff',
		name: 'statistic-business-sale-rank-staff',
		component: () => import('./modules/statistic-business-sale-rank-staff.vue')
	},
	{
		path: '/statistic/business/sale/cost',
		name: 'statistic-business-sale-cost',
		component: () => import('./modules/statistic-business-sale-cost.vue')
	},
	{
		path: '/statistic/business/sale/refund',
		name: 'statistic-business-sale-refund',
		component: () => import('./modules/statistic-business-sale-refund.vue')
	},
	{
		path: '/statistic/business/customer/deal/industry',
		name: 'statistic-business-customer-deal-industry',
		component: () => import('./modules/statistic-business-customer-deal-industry.vue')
	},
	{
		path: '/statistic/business/customer/deal/area',
		name: 'statistic-business-customer-deal-area',
		component: () => import('./modules/statistic-business-customer-deal-area.vue')
	},
	{
		path: '/statistic/business/customer/deal/type',
		name: 'statistic-business-customer-deal-type',
		component: () => import('./modules/statistic-business-customer-deal-type.vue')
	},
	{
		path: '/statistic/business/customer/deal/discount',
		name: 'statistic-business-customer-deal-discount',
		component: () => import('./modules/statistic-business-customer-deal-discount.vue')
	},
	{
		path: '/statistic/business/customer/renew',
		name: 'statistic-business-customer-renew',
		component: () => import('./modules/statistic-business-customer-renew.vue')
	},
	{
		path: '/statistic/business/customer/renew/staff',
		name: 'statistic-business-customer-renew-staff',
		component: () => import('./modules/statistic-business-customer-renew-staff.vue')
	},
	{
		path: '/statistic/business/customer/rebuy',
		name: 'statistic-business-customer-rebuy',
		component: () => import('./modules/statistic-business-customer-rebuy.vue')
	},
	{
		path: '/statistic/business/customer/rebuy/staff',
		name: 'statistic-business-customer-rebuy-staff',
		component: () => import('./modules/statistic-business-customer-rebuy-staff.vue')
	},
	{
		path: '/statistic/business/customer/reproduct',
		name: 'statistic-business-customer-reproduct',
		component: () => import('./modules/statistic-business-customer-reproduct.vue')
	},
	{
		path: '/statistic/business/customer/reproduct/zone',
		name: 'statistic-business-customer-reproduct-zone',
		component: () => import('./modules/statistic-business-customer-reproduct-zone.vue')
	},
	{
		path: '/statistic/config/cost',
		name: 'statistic-config-cost',
		component: () => import('./modules/statistic-config-cost.vue')
	},
	{
		path: '/statistic/config/reason',
		name: 'statistic-config-reason',
		component: () => import('./modules/statistic-config-reason.vue')
	},
	{
		path: '/statistic/config/reason/recycle',
		name: 'statistic-config-reason-recycle',
		component: () => import('./modules/statistic-config-reason-recycle.vue')
	},
	{
		path: '/statistic/business/customer/renew/depart',
		name: 'statistic-business-customer-renew-depart',
		component: () => import('./modules/statistic-business-customer-renew-depart.vue')
	},
	{
		path: '/statistic/business/customer/rebuy/depart',
		name: 'statistic-business-customer-rebuy-depart',
		component: () => import('./modules/statistic-business-customer-rebuy-depart.vue')
	}
];
