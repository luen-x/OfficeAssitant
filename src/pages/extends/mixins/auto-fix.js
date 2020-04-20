import { getHashUrl } from '@utils/utils';

// 当前需求：只有搜索时才自动定位，且搜索时当前tab有数据不自动定位，无数据时自动定位。
// 第一次进来默认第一个tab，刷新页面保持在上一个tab下
export const autoFix = () => {
	return {
		data() {
			return {};
		},
		methods: {
			resetType(defaultType = '1', count, url, { tabs, type } = {}) {
				const initTabs = tabs || this.tabs;
				const initType = type || 'type';
				let { fixPosition = 'false' } = this.$route.query;
				fixPosition = fixPosition === 'true';	// 是否定位
				const isAllZero = count.some(it => it !== 0); // 全部tab不为0
				const selfTypeCount = count[initTabs.findIndex(it => it.value === this[initType])]; // 当前tab是否有数据
				const id = count.findIndex(num => num);	// 找到第一个有数据的tab
				if (id !== -1) {
					defaultType = initTabs[id].value;
				}
				if (fixPosition && isAllZero && !selfTypeCount) {
					this[initType] = defaultType;
					this.$nextTick(() => {
						this.$router.replace(getHashUrl(
							url,
							{ ...this.$route.query, [initType]: this[initType], fixPosition: false }
						));
					});
				}
			}
		}
	};
};

