import { getFinanceRoutes } from './finance';
import { getHRRoutes } from './hr';
import { getSCRoutes } from './sc';
import { getCollageRoutes } from './collage';
import { getSaleRoutes } from './sale';
import { getContentRoutes } from './content';
import { getSettingsRoutes } from './settings';
import { getStatisticsRoutes } from './statistics';
import { getAdminRoutes } from './administration';
import { getTechRoutes } from './tech';
import { getWorksheetRoutes } from './worksheet';
import { getAcademyRoutes } from './academy';
import { getMaterialRoutes } from './material';
import { getCollectRoutes } from './collect';
import { getStatisticRoutes } from './statistic';


/**
 * key值跟chunks中的value值对应
 */
// [getHRRoutes].forEach(item => {
// 	item = item(_global.auth);
// 	let route = item[0].route;
// 	const index = route.lastIndexOf('/');
// 	route = route.substr(0, index);
// 	item.push({
// 		name: '',
// 		show: false,
// 		route: route + '/employee',
// 		children: [
// 			{
// 				name: '详情',
// 				show: true,
// 				route: route + '/employee/summary/details'
// 			}
// 		]
// 	});
// });
export default {
	finance: getFinanceRoutes,
	hr: getHRRoutes,
	sc: getSCRoutes,
	collage: getCollageRoutes,
	sale: getSaleRoutes,
	content: getContentRoutes,
	settings: getSettingsRoutes,
	statistics: getStatisticsRoutes,
	administration: getAdminRoutes,
	tech: getTechRoutes,
	worksheet: getWorksheetRoutes,
	academy: getAcademyRoutes,
	material: getMaterialRoutes,
	collect: getCollectRoutes,
	statistic: getStatisticRoutes
};