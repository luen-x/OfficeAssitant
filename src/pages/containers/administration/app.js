import { getIndexRoute, getRedirectRoute } from '@utils/utils';
import { getAdminRoutes } from '@components/layout/left/administration';

export const administrationConfig = [
	{
		path: '/administration',
		beforeEnter: (to, from, next) => {
			let redirect = getIndexRoute(getAdminRoutes(_global.auth, _global.staff));
			next({ path: getRedirectRoute(redirect) });
		},
	},
	{
		path: '/administration/matter/my',
		name: 'administration-matter-my',
		component: () => import('./modules/administration-matter-my.vue')
	},
	{
		path: '/administration/application/mine',
		name: 'administration-application-mine',
		component: () => import('./modules/administration-application-mine.vue')
	},
	{
		path: '/administration/application/wait',
		name: 'administration-application-wait',
		component: () => import('./modules/administration-application-wait.vue')
	},
	{
		path: '/administration/matter/setting/apply',
		name: 'administration-matter-setting-apply',
		component: () => import('./modules/administration-matter-setting-apply.vue')
	},
	{
		path: '/administration/matter/setting/type',
		name: 'administration-matter-setting-type',
		component: () => import('./modules/administration-matter-setting-type.vue')
	},
	{
		path: '/administration/matter/sea',
		name: 'administration-matter-sea',
		component: () => import('./modules/administration-matter-sea.vue')
	},
	{
		path: '/administration/phone',
		name: 'administration-phone',
		component: () => import('./modules/administration-phone.vue')
	}
];
