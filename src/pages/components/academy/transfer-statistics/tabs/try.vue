<template>
	<div class="v-academy-transfer-statistics-try">
		<div class="_statistic g-flex">
			<div
				v-for="(item, index) in staticList"
				:key="item.key"
				:class="index !== staticList.length - 1 ? '_line' : ''"
				class="_item g-flex g-ai-c g-jc-c"
			>
				<div class="g-tc g-pointer" @click="handleClick(index)">
					<div class="g-m-b-15" style="color: #818794">{{ item.key }}</div>
					<div class="g-fs-24 g-c-black2">{{ item.value }}</div>
				</div>
			</div>
		</div>
		<i-tabs
			:value="subtype"
			:animated="false"
			:class="subtype === 'organization' ? '_actived-tabs' : ''"
			style="margin-top: 20px;"
			class="g-tabs _tabs"
			name="try"
			@on-click="handleChange"
		>
			<i-tab-pane
				v-for="(item) in tabs"
				:key="item.value"
				:label="item.label"
				:name="item.value"
				tab="try"
			>
				<div style="width: 100%;border: 1px solid rgba(212, 215, 219, 1)">
					<div class="g-pd-l-20 g-lh-40 g-fs-14 g-c-black" style="height: 40px;background: #FAFAFA">
						{{ subtype === 'recruit' ? '招聘来源' : '组织部门' }}
					</div>
					<oa-charts :data="chartData" :name="subtype" />
				</div>
				<i-table
					:data="tableData"
					:columns="getColumns(`${subtype}`)"
					:loading="loading"
					stripe
					class="_table g-m-t-10"
				/>
			</i-tab-pane>
		</i-tabs>
	</div>
</template>

<script>
import moment from 'moment';
import { Table, Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import Chart from '../charts/oa-try-chart';
import item from '../item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'i-table': Table,
		'oa-charts': Chart
	},
	mixins: [item],
	data() {
		const { query } = this.$route;
		return {
			subtype: query.subtype || 'recruit',
			chartData: {},
			tableData: [],
			loading: false,
			staticList: [
				{ key: '试岗人数', value: 0 },
				{ key: '试岗流失人数', value: 0 },
				{ key: '入职流失人数', value: 0 },
				{ key: '入职人数', value: 0 },
				{ key: '入职在职人数', value: 0 }
			],
			tabs: [
				{ label: '招聘来源', value: 'recruit' },
				{ label: '组织部门', value: 'organization' }
			]
		};
	},
	mounted() {
		this.loadData();
	},
	methods: {
		loadData() {
			const { query } = this.$route;
			let url = this.subtype === 'recruit'
				? 'ACADEMY_TRANSFER_STATISTIC_TRY_RECRUIT_GET'
				: 'ACADEMY_TRANSFER_STATISTIC_TRY_ORGANIZATION_GET';

			this.$request({
				url,
				type: 'GET',
				param: {
					try_month: query.try_month ? query.try_month : moment().format("YYYY-MM")
				},
				loading: false
			}).then((res) => {
				this.chartData = res.data;
				this.tableData = res.data.list;

				let list = [res.data.all_try_count, res.data.all_try_pass_count, res.data.all_leave_count,
					res.data.all_entry_and_leave_count, res.data.all_entry_count];
				this.staticList.forEach((value, index) => {
					this.staticList[index].value = list[index];
				});
			}).catch((error) => {});
		},
		handleChange(type) {
			const { query } = this.$route;
			this.subtype = type;
			this.$router.replace(getHashUrl(
				'/academy/transfer/statistics',
				{
					...query,
					type: query.type ? query.type : 'try',
					subtype: type
				}
			));
			this.loadData();
		},
		// 点击进入详情
		handleClick(index) {
			const { query } = this.$route;
			if (this.$auth[1577]) {
				this.$router.push({
					path: '/academy/transfer/statistics/try/detail',
					query: {
						index: this.getTabType(index),
						try_month: query.try_month ? query.try_month : moment().format('YYYY-MM')
					}
				});
			}
		},
		// 获取对应详情tab
		getTabType(index) {
			switch (index) {
				case 0:
				case 1:
					return index + 1;
				case 2:
					return 5;
				case 3:
				case 4:
					return index;
				default:
					break;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.v-academy-transfer-statistics-try {
	._statistic {
		width: 100%;
		height: 114px;
		padding-top: 20px;
		padding-bottom: 20px;
		background: #F5F5F6;
		._item {
			flex: 1;
			height: 100%;
		}
		._line {
			border-right: 1px solid #D4D7DB;
		}
	}
}
</style>

<style lang="scss">
.v-academy-transfer-statistics-try {
	._tabs {
		.ivu-tabs-bar {
			border: none;
			.ivu-tabs-nav-container {
				.ivu-tabs-tab {
					width: 100px;
					padding-left: 21px;
					padding-right: 21px;
				}
				.ivu-tabs-ink-bar {
					width: 66px !important;
					height: 3px;
					margin-left: 17px;
					margin-right: 17px;
					z-index: 10;
				}
				.ivu-tabs-nav-wrap {
					margin-left: -17px;
				}
			}
		}
	}
	._actived-tabs {
		.ivu-tabs-ink-bar:first-of-type {
			left: 100px !important;
		}
	}
}
</style>




