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
				class="v-sale-credit-application-list"
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
	name: 'oa-credit-application-list',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane
	},
	mixins: [
		item,
		tableHeight({
			nav1: true,
			nav2: false,
			extra: 50
		}),
		autoFix()
	],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.status || "0"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '待审核', value: '0' }, 
				{ label: '已评分', value: '1' },
				{ label: '未通过', value: '2' }
			]
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.saleFractionCreditApplication.listInfo;
		},
		currentColumns() {
			return this.handleColumns();
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'SALE_FRACTION_CREDIT_APPLICATION_LIST_GET',
				type: 'GET',
				param: {
					...query,
					status: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.resetType('0', this.listInfo.count, '/sale/fraction/credit/application');
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		handleChange(status) {
			this.type = status;

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				fixPosition: false,
				status,
				page: this.current[status]
			};

			this.$router.replace(getHashUrl('/sale/fraction/credit/application', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('SALE_FRACTION_CREDIT_APPLICATION_LIST_INIT');
		},
		handleColumns() {
			let temp1 = [...this.baseColumns];
			let temp2 = [...this.baseColumns];

			if (this.type == '0') {
				this.showColumns = [...this.baseColumns];
			} else if (this.type == '1') {
				temp1.splice(5, 1);
				temp1.splice(5, 0, {
					title: '获得学分',
					key: 'point',
					minWidth: 120
				});
				this.showColumns = temp1;
			} else {
				temp2.splice(5, 1);
				temp2.splice(5, 0, {
					title: '驳回人',
					key: 'audit_staff',
					minWidth: 120
				});
				temp2.splice(6, 0, {
					title: '驳回理由',
					key: 'audit_remarks',
					minWidth: 120,
					render: (h, params) => {
						return (
							<div>
								<AutoTooltip 
									content={params.row.audit_remarks}
									theme="dark"
									placement="bottom"
									labelClass="g-c-black3"
								/>
							</div>
						);
					}
				});
				this.showColumns = temp2;
			}
			return this.showColumns;
		}
	}
};

</script>

<style lang="scss">

</style>
