// 最小高度
const MIN_HEIGHT = 230;
// 底部footer高度
const FOOTER_HEIGHT = 60;
// 默认margin距离
const MARGIN_DIS = 20;
// table距离底部距离
const MARGIN_FOOTER = 0;
// table Header
const TABLE_HEADER = 42;
// explainHeight
const EXPLAIN_HEIGHT = 34;

const getClientHeight = (className, opts = {}) => {
	if (!Object.values(opts).some((opt) => opts)) {
		return 0;
	}
	const {
		filter, footer, tabs, explain
	} = opts;
	let extra = 0;
	if (filter || tabs) {
		extra = MARGIN_DIS;
	} else if (footer) {
		extra = -FOOTER_HEIGHT;
	} else if (explain) {
		extra = -MARGIN_DIS; // 抵消tabs的margin
	}

	return (document.getElementsByClassName(className)[0] || {}).clientHeight + extra || 0;
};

const getTbodyHeight = () => {
	let tbodyArr = document.getElementsByClassName('ivu-table-tbody') || [];
	for (let i = 0; i < tbodyArr.length; i++) {
		if (tbodyArr[i].clientHeight > 0) {
			return tbodyArr[i].clientHeight;
		}
	}
	return 0;
};

export const tableHeight = (opts = {}) => {
	const {
		filter, footer, tabs, explainTabs, tabKey,
		extraEle = []
	} = opts;
	let pageHeight = 0;
	let filterHeight = 0;
	let tabsHeight = 0;
	let tBodyHeight = 0;
	let extraHeight = opts.extraHeight || 0;
	let isFilterExpand = false;

	return {
		data() {
			return {
				tableHeight: MIN_HEIGHT,
			};
		},
		mounted() {
			setTimeout(() => {
				pageHeight = getClientHeight('v-router', { footer });
				filterHeight = getClientHeight('js-filter', { filter });
				tabsHeight = getClientHeight('ivu-tabs-bar', { tabs });
				extraHeight += this.getExtraHeight();

				filter && this.$vc.on('vc-expand', this.handleVcExpand);
			}, 0);
		},
		updated() {
			setTimeout(() => {
				this.resetTableHeight();
			}, 0);
		},
		beforeDestroy() {
			// 销毁组件时还原数据
			pageHeight = 0;
			filterHeight = 0;
			tabsHeight = 0;
			tBodyHeight = 0;
			extraHeight = opts.extraHeight || 0;
			isFilterExpand = false;
			this.$vc.off('vc-expand', this.handleVcExpand);
		},
		methods: {
			resetTableHeight() {
				let filterH = isFilterExpand ? getClientHeight('js-filter', { filter }) : filterHeight;
				tBodyHeight = getTbodyHeight();
				// table高度 = 页面高度 - 搜索栏高度 - tabs高度 - 页面内部的paddingTop - 距离底部距离 - 额外高度
				let height = pageHeight - filterH - tabsHeight - MARGIN_DIS - MARGIN_FOOTER - extraHeight;
				this.getTableHeight(tBodyHeight, height);
			},
			getTableHeight(tbody, height) {
				if (explainTabs && explainTabs.indexOf(this.$route.query[tabKey]) > -1) {
					height -= EXPLAIN_HEIGHT;
				}
				let tableBodyHeight = tbody > 0 ? tbody + TABLE_HEADER : 78;
				if (tableBodyHeight > height) {
					this.tableHeight = height;
				} else {
					// tableBodyHeight较小时，不设固定高度，避免滚动条覆盖
					this.tableHeight = '';
				}
			},
			getExtraHeight() {
				let height = 0;
				for (let i = 0; i < extraEle.length; i++) {
					height += getClientHeight(extraEle[i], { extra: true });

				}
				return height;
			},
			handleVcExpand(res) {
				if (!res.show) {
					isFilterExpand = false;
					this.resetTableHeight();
				} else {
					setTimeout(() => {
						pageHeight = getClientHeight('v-router', { footer });
						filterHeight = getClientHeight('js-filter', { filter });
						tabsHeight = getClientHeight('ivu-tabs-bar', { tabs });
						extraHeight += this.getExtraHeight();
						isFilterExpand = true;
						let height = pageHeight - filterHeight - tabsHeight - MARGIN_DIS - MARGIN_FOOTER - extraHeight;
						this.getTableHeight(tBodyHeight, height);
					}, 250);
					
				}
			}
		}
	};
};
