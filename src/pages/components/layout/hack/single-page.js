import { getItem, setItem, delItem } from '@utils/utils';

export const singlePageLinks = [
	'/administration',
	'/sale/call',
	'/content/search',
	'/content/search',
	'/worksheet',
	'/sc/views',
	'/material/material',
	'collect/main'
];
export const setClosePath = () => {
	if (singlePageLinks.find(link => app.$route.path.includes(link))) { 
		return;
	} else {
		setItem('closePath_' + _global.version, app.$route.fullPath);
	}
};