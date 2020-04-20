<template>
	<i-tabs
		:value="type"
		:animated="false"
		type="card"
		style="margin-top:20px"
		@on-click="handleChange"
	>
		<div v-if="!type||type==1" slot="extra" class="g-red-btn-line " @click="handlePKRecord">
			PK业绩记录
		</div>
		<i-tab-pane v-for="(item) in tabs" :key="item.value" :label="item.label" :name="item.value">
			<vc-paging
				ref="tableTarget"
				:columns="columns"
				:show="item.value == type"
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				:table-opts="{height: tableHeight,highlightRow:true}"
				class="v-sale-achievement-staff-list"
				mode="table"
				@row-click="handleRowDetail"
				@page-size-change="handleChangePageSize"
			/>
		</i-tab-pane>
		<i-tab-pane :label="'提成明细'" :name="'5'">
			<oa-commission/>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import moment from 'moment';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/table';
import Commission from './_common/achievement/commission';
import CommissionDetiled from './_common/achievement/commission-detailed';
// item
import item from './item';
import { PKRecord } from './popup/pk-record';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'oa-commission': Commission,
		'oa-commission-detiled': CommissionDetiled
	},
	mixins: [
		item,
		tableHeight({
			filter: true,
			tabs: true,
			footer: true,
			extraHeight: 27
		})
	],
	data() {
		const { query } = this.$route;
		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '到账记录', value: '1' },
				{ label: '下单记录', value: '2' },
				{ label: '补款记录', value: '3' },
				{ label: '退款记录', value: '4' }
			],
			month: ''
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.saleAchievementStaff.listInfo;
		}
	},
	created() {
		let i = moment().format('YYYY-MM');
		this.month = i;
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'SALE_ACHIEVEMENT_STAFF_LIST_GET',
				type: 'GET',
				param: {
					month: this.month,
					...query,
					type: this.type,
					page,
					pageSize,
				},
			}).then(res => {
			}).catch(err => {
			});
		},
		handleChange(type) {
			this.type = type;

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/sale/achievement/staff', { ...query }));
			if (type < 5) {
				this.$nextTick(() => {
					this.$refs.tableTarget[+type - 1].$refs.tableTarget.handleResize();
				});
			}
		},
		handleChangePageSize() {
			this.$store.commit('SALE_ACHIEVEMENT_STAFF_LIST_INIT');
		},
		handlePKRecord() {
			PKRecord.popup({
				data: {
					staff_id: this.$route.query.staff_id ? this.$route.query.staff_id : '',
					month: this.$route.query.month ? this.$route.query.month : '',
					change_type: '2'
				}
			}).then(() => {});
		},

	}
};

</script>

<style lang="scss">
	.v-sale-achievement-staff-list{
		._name{
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}
	}
</style>
