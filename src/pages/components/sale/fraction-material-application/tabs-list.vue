<template>
	<i-tabs 
		:value="type" 
		:animated="false"
		type="card" 
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<i-tab-pane 
			v-for="(item, index) in tabs"
			:key="item.value"
			:label="item.label + listInfo.count[index]"
			:name="item.value"
		>
			<vc-paging
				:columns="currentColumns"
				:show="item.value == type" 
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				:table-opts="{height: tableHeight, highlightRow: false}"
				class="v-sale-material-application-list"
				mode="table"
				@page-size-change="handleChangePageSize"
			/>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import { tableHeight } from '@extends/mixins/tableHeight';
import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import { autoFix } from '@extends/mixins/auto-fix';
import { getParseUrl, getHashUrl } from '@utils/utils';
// item
import item from './item';

export default {
	name: 'oa-material-application-list',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
	},
	mixins: [
		item,
		tableHeight({
			nav1: true,
			nav2: true
		}),
		autoFix()
	],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {}
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.saleFractionMaterialApplication.listInfo;
		},
		tabs() {
			const { query } = this.$route;

			if (query.tab === '0' || !query.tab) {
				return [
					{ label: '待上级审核', value: '1' }, 
					{ label: '待三立学府确认', value: '2' }, 
					{ label: '已通过', value: '3' },
					{ label: '已驳回', value: '4' }
				];
			} else {
				return [
					{ label: '待我审核', value: '1' }, 
					{ label: '待三立学府确认', value: '2' }, 
					{ label: '已通过', value: '3' },
					{ label: '已驳回', value: '4' }
				];
			}
		},
		currentColumns() {
			return this.handleColumns();
		}
	},
	methods: {
		loadData(page, pageSize) {
			let count = [];
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'SALE_FRACTION_MATERIAL_APPLICATION_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.resetType('1', this.listInfo.count, '/sale/fraction/material/application');
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		handleChange(type) {
			this.type = type;

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				fixPosition: false,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/sale/fraction/material/application', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('SALE_FRACTION_MATERIAL_APPLICATION_LIST_INIT');
		},
		handleColumns() {
			const { query = {} } = this.$route;
			const tab = this.tab || query.tab;
			const type = this.type || query.type;
			let temp1 = [...this.baseColumns];
			let temp2 = [...this.baseColumns];

			if (tab === '1' && type === '1') {
				temp1.splice(8, 0, {
					title: '申请理由',
					key: 'apply_reason',
					minWidth: 120,
					render: (h, params) => {
						return (
							<div>
								<AutoTooltip 
									content={params.row.apply_reason}
									theme="dark"
									placement="bottom"
									labelClass="g-c-black3"
								/>
							</div>
						);
					}
				});
				this.showColumns = [...temp1];
			} else {
				this.showColumns = [...temp2];
			}
			return this.showColumns;
		}
	}
};

</script>

<style lang="scss">
.v-sale-material-application-list {
	.ivu-table-cell {
		white-space: nowrap;
	}
}
</style>
