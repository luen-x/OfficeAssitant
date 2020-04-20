import API_ROOT from '@stores/apis/root';
import { initTreeData, getItem, setItem } from '@utils/utils';
import { createService, serviceObj, serviceCompare } from './utils';

export const services = {
	// 二级地址，保存至localstroge
	...createService({
		key: "region",
		url: '_COMMON_SECOND_REGION_GET',
		cache: true,
		param: { type: 'two' },
		parser: (data) => initTreeData(data, 'national_code', 'region_name')
	}),
	...createService({
		key: "areaMap",
		url: '_COMMON_REGION_AREA_MAP_GET',
	// 	parser: (data) => initTreeData(data, 'national_code', 'region_name')
	}),
};
export const aliasService = {
	areaRegion: () => {
		return {
			data() {
				return {
					areaRegion: []
				};	
			},
			mixins: [services.region(), services.areaMap()],
			mounted() {
				Promise.all([this.loadRegionPromise, this.loadAreaMapPromise]).then(() => {
					this.areaRegion = this.areaMap.map(area => {
						return { 
							label: area.area_name, 
							value: area.area_code, 
							children: area.mapping.map(code => this.region.find(it => it.value === code))
						};
					});
				});
			},
		};
	}
};

/**
 * 是否
 */
export const singleData = {
	data() {
		return {
			singleData: [
				{ label: '是', value: 1 },
				{ label: '否', value: 0 }
			]
		};
	}
};
