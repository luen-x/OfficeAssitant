export const getSettingsRoutes = (auth) => [
	{
		name: '路由设置',
		icon: 'icon-home',
		show: true,
		route: '/settings/router',
		children: [{
			name: '路由设置',
			show: true,
			route: "/settings/router/set"
		}]
	}
];