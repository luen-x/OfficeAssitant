import { getIndexRoute, getRedirectRoute } from '@utils/utils';
import { getFinanceRoutes } from '@components/layout/left/finance';

export const financeConfig = [
	{
		path: '/finance',
		beforeEnter: (to, from, next) => {
			let redirect = getIndexRoute(getFinanceRoutes(_global.auth, _global.staff));
			next({ path: getRedirectRoute(redirect) });
		},
	},
	{
		path: '/finance/main',
		name: 'finance-main',
		component: () => import('./modules/finance-main.vue')
	},
	{
		path: '/finance/main/information',
		name: 'finance-main-information',
		component: () => import('./modules/finance-main-information.vue')
	},
	{
		path: '/finance/customer',
		name: 'finance-customer',
		component: () => import('./modules/finance-customer.vue')
	},
	{
		path: '/finance/count',
		name: 'finance-count',
		component: () => import('./modules/finance-count.vue')
	},
	{
		path: '/finance/ballot',
		name: 'finance-ballot',
		component: () => import('./modules/finance-ballot.vue')
	},
	{
		path: '/finance/bill',
		name: 'finance-bill',
		component: () => import('./modules/finance-bill.vue')
	},
	{
		path: '/finance/customer/achi',
		name: 'finance-customer-achi',
		component: () => import('./modules/finance-customer-achi.vue')
	},
	{
		path: '/finance/customer/contract',
		name: 'finance-customer-contract',
		component: () => import('./modules/finance-customer-contract.vue')
	},
	{
		path: '/finance/customer/elec',
		name: 'finance-customer-elec',
		component: () => import('./modules/finance-customer-elec.vue')
	},
	{
		path: '/finance/customer/refund',
		name: 'finance-customer-refund',
		component: () => import('./modules/finance-customer-refund.vue')
	},
	{
		path: '/finance/customer/nego',
		name: 'finance-customer-nego',
		component: () => import('./modules/finance-customer-nego.vue')
	},
	{
		path: '/finance/customer/remain',
		name: 'finance-customer-remain',
		component: () => import('./modules/finance-customer-remain.vue')
	},
	{
		path: '/finance/services/complain',
		name: 'finance-customer-complain',
		component: () => import('./modules/finance-customer-complain.vue')
	},
	{
		path: '/finance/count/staff',
		name: 'finance-count-staff',
		component: () => import('./modules/finance-count-staff.vue')
	},
	{
		path: '/finance/count/staff/sale',
		name: 'finance-count-staff-sale',
		component: () => import('./modules/finance-count-staff.vue')
	},
	{
		path: '/finance/count/staff/collage',
		name: 'finance-count-staff-collage',
		component: () => import('./modules/finance-count-staff-collage.vue')
	},
	{
		path: '/finance/count/achi',
		name: 'finance-count-achi',
		component: () => import('./modules/finance-count-achi.vue')
	},
	{
		path: '/finance/bill/in',
		name: 'finance-bill-in',
		component: () => import('./modules/finance-bill-in.vue')
	},
	{
		path: '/finance/bill/out',
		name: 'finance-bill-out',
		component: () => import('./modules/finance-bill-out.vue')
	},
	{
		path: '/finance/customer/nego/detail',
		name: 'finance-customer-nego-detail',
		component: () => import('./modules/finance-customer-nego-detail.vue')
	},
	{
		path: '/finance/main/schedule',
		name: 'finance-main-schedule',
		component: () => import('./modules/finance-main-schedule.vue')
	},
	{
		path: '/finance/main/playment/more',
		name: 'finance-main-playment-more',
		component: () => import('./modules/finance-main-playment-more.vue')
	},
	{
		path: '/finance/count/staff/detail',
		name: 'finance-count-staff-detail',
		component: () => import('./modules/finance-count-staff-detail.vue')
	},
	{
		path: '/finance/count/staff/collage/detail',
		name: 'finance-count-staff-collage-detail',
		component: () => import('./modules/finance-count-staff-collage-detail.vue')
	},
	{
		path: '/finance/customer/supplement',
		name: 'finance-customer-supplement',
		component: () => import('./modules/finance-customer-supplement.vue')
	},
	{
		path: '/finance/services/commission',
		name: 'finance-services-commission',
		component: () => import('./modules/finance-services-commission.vue')
	},
	{
		path: '/finance/consultation',
		name: 'finance-consultation',
		component: () => import('./modules/finance-consultation.vue')
	},
	{
		path: '/finance/customer/achi/edit',
		name: 'finance-customer-achi-edit',
		component: () => import('./modules/finance-customer-achi-edit.vue')
	},
	{
		path: '/finance/customer/discount',
		name: 'finance-customer-discount',
		component: () => import('./modules/finance-customer-discount.vue')
	}
];
