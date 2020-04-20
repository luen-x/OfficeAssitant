
import { debounce } from 'lodash';

const PAGE_TITLE = 57; // 页面头部
const NAV1 = 47; // 一级导航
const NAV2 = 40; // 二级导航
const FILTER = 52; // filter 32 + margin-top 20
const TAB = 78; // tab 42 + margin-top 20 + margin-bottom 16
const FOOTER = 65; // footer 45 + margin-top 20
const EXTRA = 0; // 全局高度补正

const MIN_HEIGHT = 230; // 最小高度

const TABLEHEAD = 44;

const getTbodyHeight = () => {
	let tbodyArr = document.getElementsByClassName('ivu-table-tbody') || [];
	for (let i = 0; i < tbodyArr.length; i++) {
		if (tbodyArr[i].clientHeight > 0) {
			return tbodyArr[i].clientHeight;
		}
	}
	return 0;
};
export const tableHeight = (opts = { extra: 0 }) => {
	let pageTitle = opts.pageTitle === false ? 0 : PAGE_TITLE;
	let nav1 = opts.nav1 === false ? 0 : NAV1;
	let nav2 = opts.nav2 === false ? 0 : NAV2;
	let filter = opts.filter === false ? 0 : FILTER;
	let tab = opts.tab === false ? 0 : TAB;
	let footer = opts.footer === false ? 0 : FOOTER;
	let extra = EXTRA + (+opts.extra || 0);
	let minHeight = opts.minHeight || MIN_HEIGHT;
	let tableHead = opts.tableHead === false ? 0 : TABLEHEAD;

	return {
		data() {
			return {
				tableHeight: minHeight
			};
		},
		mounted() {
			setTimeout(() => {
				this.$nextTick(() => {
					this.updateTableHeight();
					window.addEventListener('resize', this.updateTableHeight);
					this.$vc.on('vc-expand', this.updateTableHeightDelay);
				});
			}, 0);
		},
		updated() {
			setTimeout(() => {
				this.updateTableHeight();
			}, 0);
		},
		beforeDestroy() {
			window.removeEventListener('resize', this.updateTableHeight);
			this.$vc.off('vc-expand', this.updateTableHeightDelay);	
		},
		methods: {
			updateTableHeight: debounce(function () {
				const windowHeight = document.body.clientHeight;
				const expand = (document.getElementsByClassName('vc-expand')[0] || {}).clientHeight || 0;
				const height = windowHeight - pageTitle - nav1 - nav2 - filter - tab - footer - expand - extra;
				const tbody = getTbodyHeight() + tableHead;
				if (tbody > height) {
					this.tableHeight = height < minHeight ? minHeight : height;
				} else {
					// tableBodyHeight较小时，不设固定高度，避免滚动条覆盖
					this.tableHeight = null;
				}
			}, 100),
			updateTableHeightDelay: debounce(function () {
				this.updateTableHeight();
			}, 200),
		}
	};
};