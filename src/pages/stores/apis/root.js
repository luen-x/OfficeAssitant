import { objRegex } from '@utils/utils';
import { DEV_WITH_SERVER, devBaseUrl } from '../../constants/constants';
import _common from './_common';
import login from './login';
import hr from './hr';
import finance from './finance';
import sc from './sc';
import collage from './collage';
import sale from './sale';
import content from './content';
import settings from './settings';
import statistics from './statistics';
import administration from './administration';
import tech from './tech';
import worksheet from './worksheet';
import academy from './academy';
import material from './material';
import collect from './collect';
import statistic from './statistic';

const API = {
	..._common,
	...login,
	...hr,
	...finance,
	...sc,
	...collage,
	...sale,
	...content,
	...settings,
	...statistics,
	...administration,
	...tech,
	...worksheet,
	...academy,
	...material,
	...collect,
	...statistic
};

let baseUrl;
/* global __DEV__ */
if (__DEV__) {
	const userConfig = require('../../../../config/user.config');

	// 开发环境
	if (!DEV_WITH_SERVER) { // 开发环境-前端自模拟
		baseUrl = 'http://localhost:3000';
	} else { // 开发环境-后端数据
		baseUrl = devBaseUrl[userConfig.env];
	}
} else {
	// 生产环境
	baseUrl = `${location.origin}`;
}
for (let i in API) {
	if (objRegex.validURLScheme.regex.test(API[i])) {
		API[i] = API[i];
	} else {
		API[i] = baseUrl + API[i];
	}
}
export default API;
