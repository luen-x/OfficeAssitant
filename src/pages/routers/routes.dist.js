import Vue from 'vue';
import layout from '@components/layout/layout';
import { PRE_ROUTER_URL } from '../constants/constants';
import { loginConfig } from '../containers/login/app';
import { otherConfig } from '../containers/other/app';
import { academyConfig, academyOtherConfig } from '../containers/academy/app';
import { administrationConfig, administrationOtherConfig } from '../containers/administration/app';
import { collageConfig, collageOtherConfig } from '../containers/collage/app';
import { collectConfig, collectOtherConfig } from '../containers/collect/app';
import { contentConfig, contentOtherConfig } from '../containers/content/app';
import { financeConfig, financeOtherConfig } from '../containers/finance/app';
import { hrConfig, hrOtherConfig } from '../containers/hr/app';
import { materialConfig, materialOtherConfig } from '../containers/material/app';
import { saleConfig, saleOtherConfig } from '../containers/sale/app';
import { scConfig, scOtherConfig } from '../containers/sc/app';
import { settingsConfig, settingsOtherConfig } from '../containers/settings/app';
import { statisticsConfig, statisticsOtherConfig } from '../containers/statistics/app';
import { techConfig, techOtherConfig } from '../containers/tech/app';
import { worksheetConfig, worksheetOtherConfig } from '../containers/worksheet/app';
import { statisticConfig } from '../containers/statistic/app';

export default {
	base: PRE_ROUTER_URL,
	mode: 'history',
	routes: [
		...loginConfig,
		...otherConfig,
		...(academyOtherConfig || {}),
		...(administrationOtherConfig || {}),
		...(collageOtherConfig || {}),
		...(collectOtherConfig || {}),
		...(contentOtherConfig || {}),
		...(financeOtherConfig || {}),
		...(hrOtherConfig || {}),
		...(materialOtherConfig || {}),
		...(saleOtherConfig || {}),
		...(scOtherConfig || {}),
		...(settingsOtherConfig || {}),
		...(statisticsOtherConfig || {}),
		...(techOtherConfig || {}),
		...(worksheetOtherConfig || {}),
		{
			path: '/',
			component: layout,
			redirect: '/sale',
			children: [
				...academyConfig,
				...administrationConfig,
				...collageConfig,
				...collectConfig,
				...contentConfig,
				...financeConfig,
				...hrConfig,
				...materialConfig,
				...saleConfig,
				...scConfig,
				...settingsConfig,
				...statisticsConfig,
				...techConfig,
				...worksheetConfig,
				...statisticConfig
			]
		},
		{
			path: '*',
			redirect: (to) => {
				return '/404';
			}
		}
	]
};
