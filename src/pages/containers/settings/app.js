import { getIndexRoute, getRedirectRoute } from '@utils/utils';
import { getSettingsRoutes } from '@components/layout/left/settings';

export const settingsConfig = [
	{
		path: '/settings',
		beforeEnter: (to, from, next) => {
			let redirect = getIndexRoute(getSettingsRoutes(_global.auth, _global.staff));
			next({ path: getRedirectRoute(redirect) });
		},
	},
	{
		path: '/settings/router/set',
		name: 'settings-router-set',
		component: () => import('./modules/settings-router-set.vue')
	}
];
