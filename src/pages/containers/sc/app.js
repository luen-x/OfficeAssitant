import { getIndexRoute, getRedirectRoute } from '@utils/utils';
import { getSCRoutes } from '@components/layout/left/sc';

export const scConfig = [
	{ 
		path: "/sc",
		beforeEnter: (to, from, next) => {
			let redirect = getIndexRoute(getSCRoutes(_global.auth, _global.staff));
			next({ path: getRedirectRoute(redirect) });
		},
	},
	{
		path: '/sc/main',
		name: 'sc-main',
		component: () => import('./modules/sc-main.vue')
	},
	{
		path: '/sc/main/information',
		name: 'sc-main-information',
		component: () => import('./modules/sc-main-information.vue')
	},
	{
		path: '/sc/main/schedule',
		name: 'sc-main-schedule',
		component: () => import('./modules/sc-main-schedule.vue')
	},
	{
		path: '/sc/customer/cooperate',
		name: 'sc-customer-cooperate',
		component: () => import('./modules/sc-customer-cooperate.vue')
	},
	{
		path: '/sc/customer/cooperate/export',
		name: 'sc-customer-cooperate-export',
		component: () => import('./modules/sc-customer-cooperate-export.vue')
	},
	{
		path: '/sc/customer/cooperate/send/email',
		name: 'sc-customer-cooperate-send-email',
		component: () => import('./modules/sc-customer-cooperate-send-email.vue')
	},
	{
		path: '/sc/product/send/email',
		name: 'sc-product-send-email',
		component: () => import('./modules/sc-customer-cooperate-send-email.vue')
	},
	{
		path: '/sc/customer/cooperate/outbox',
		name: 'sc-customer-cooperate-outbox',
		component: () => import('./modules/sc-customer-cooperate-outbox.vue')
	},
	{
		path: '/sc/product/outbox',
		name: 'sc-product-outbox',
		component: () => import('./modules/sc-customer-cooperate-outbox.vue')
	},
	{
		path: '/sc/customer/cooperate/look/mail',
		name: 'sc-customer-cooperate-look-mail',
		component: () => import('./modules/sc-customer-cooperate-look-mail.vue')
	},
	{
		path: '/sc/product/look/mail',
		name: 'sc-product-look-mail',
		component: () => import('./modules/sc-customer-cooperate-look-mail.vue')
	},
	{
		path: '/sc/customer/refund',
		name: 'sc-customer-refund',
		component: () => import('./modules/sc-customer-refund.vue')
	},
	{
		path: '/sc/product',
		name: 'sc-product',
		component: () => import('./modules/sc-product.vue')
	},
	/**
	 * 服务质检
	 */
	{
		path: '/sc/customer/cooperate/exporttask',
		name: 'sc-customer-cooperate-exporttask',
		component: () => import('./modules/sc-customer-cooperate-exporttask.vue')
	},
	{
		path: '/sc/customer/cooperate/distribute',
		name: 'sc-customer-cooperate-distribute',
		component: () => import('./modules/sc-customer-cooperate-distribute.vue')
	},
	{
		path: '/sc/product/distribute',
		name: 'sc-product-distribute',
		component: () => import('./modules/sc-customer-cooperate-distribute.vue')
	},
	{
		path: '/sc/views',
		name: 'sc-views',
		component: () => import('./modules/sc-views.vue')
	},
	{
		path: '/sc/reply/answer',
		name: 'sc-reply-answer',
		component: () => import('./modules/sc-reply-answer.vue')
	},
	{
		path: '/sc/manage/inspection',
		name: 'sc-manage-inspection',
		component: () => import('./modules/sc-manage-inspection.vue')
	},
	{
		path: '/sc/customer/predistribute',
		name: 'sc-customer-/predistribute',
		component: () => import('./modules/sc-customer-predistribute.vue')
	},
	{
		path: '/sc/service/inspection',
		name: 'sc-service-inspection',
		component: () => import('./modules/sc-service-inspection.vue')
	},
	{
		path: '/sc/service/inspection/record',
		name: 'sc-service-inspection-record',
		component: () => import('./modules/sc-service-inspection-record.vue')
	},
	{
		path: '/sc/customer/handover',
		name: 'sc-customer-handover',
		component: () => import('./modules/sc-customer-handover.vue')
	},
	{
		path: '/sc/consultation',
		name: 'sc-consultation',
		component: () => import('./modules/sc-consultation.vue')
	},
	{
		path: '/sc/manage/inspection/grade',
		name: 'sc-manage-inspection-grade',
		component: () => import('./modules/sc-manage-inspection-grade.vue')
	},
	{
		path: '/sc/manage/statistics/data',
		name: 'sc-manage-statistics-data',
		component: () => import('./modules/sc-manage-statistics-data.vue')
	},
	{
		path: '/sc/manage/statistics/market',
		name: 'sc-manage-statistics-market',
		component: () => import('./modules/sc-manage-statistics-market.vue')
	},
	{
		path: '/sc/manage/statistics/market/export',
		name: 'sc-manage-statistics-market-export',
		component: () => import('./modules/sc-manage-statistics-market-export.vue')
	},
	{
		path: '/sc/manage/statistics/market/detail',
		name: 'sc-manage-statistics-market-detail',
		component: () => import('./modules/sc-manage-statistics-market-detail.vue')
	}
];
