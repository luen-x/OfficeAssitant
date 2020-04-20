<template>
	<div class="v-academy-transfer-statistic-loss">
		<i-tabs
			:value="subtype"
			:animated="false"
			:class="subtype === 'entry' ? '_actived-tabs' : ''"
			style="margin-top: 20px"
			class="g-tabs _tabs"
			name="loss"
			@on-click="handleChange"
		>
			<i-tab-pane
				v-for="(item) in tabs"
				:key="item.value"
				:label="item.label"
				:name="item.value"
				tab="loss"
			>
				<i-row class="g-m-b-20">
					<i-col span="24" class="g-m-b-15 g-m-l-30">
						<span class="g-bg-red-mid _circle"/>
						除产品技术部{{ subtype === 'try' ? '试岗' : '入职' }}流失率{{ else_try_lose }}
					</i-col>
					<i-col span="24" class="g-m-l-30">
						<span class="g-bg-red-mid _circle"/>
						除产品技术部及劝退人数{{ subtype === 'try' ? '试岗' : '入职' }}流失率{{ else_home_try_lose }}
					</i-col>
				</i-row>
				<div v-if="subtype === item.value" class="g-flex g-jc-sb g-m-l-30 _chart">
					<oa-charts ref="_charts" :data="lossData" :type="subtype" name="职能部门" />
					<oa-charts ref="_charts" :data="lossData" :type="subtype" name="销售部门" />
				</div>
			</i-tab-pane>
		</i-tabs>
	</div>
</template>

<script>
import moment from 'moment';
import { Row, Col, Table, Tabs, TabPane } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import Chart from '../charts/oa-loss-chart';

export default {
	name: 'oa-chart',
	components: {
		'i-tabs': Tabs,
		'i-row': Row,
		'i-col': Col,
		'i-tab-pane': TabPane,
		'i-table': Table,
		'oa-charts': Chart
	},
	data() {
		const { query } = this.$route;
		return {
			subtype: query.subtype || 'try',
			else_try_lose: '',
			else_home_try_lose: '',
			lossData: [],
			tabs: [
				{ label: '试岗流失', value: 'try' },
				{ label: '入职流失', value: 'entry' }
			]
		};
	},
	mounted() {
		this.loadData();
		window.addEventListener('resize', this.handleScreenChange);
	},
	destroyed() {
		window.removeEventListener('resize', this.handleScreenChange);
	},
	methods: {
		loadData() {
			const { query } = this.$route;
			this.$request({
				url: 'ACADEMY_TRANSFER_STATISTIC_LOSS_GET',
				type: 'GET',
				param: {
					is_lose_leave: this.subtype === 'try' ? 0 : 1,
					try_month: query.try_month ? query.try_month : moment().format("YYYY-MM")
				},
				loading: false
			}).then((res) => {
				this.else_home_try_lose = res.data.else_home_try_lose;
				this.else_try_lose = res.data.else_try_lose;
				this.lossData = res.data.list;
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
		handleScreenChange() {
			this.$refs._charts.length ? this.$refs._charts.forEach(item => {
				item.$refs._charts.resize();
			}) : '';
		},
	}
};
</script>

<style lang="scss" scoped>
.v-hr-academy-transfer-statistic-loss {
	._circle {
		display: inline-block;
		width: 10px;
		height: 10px;
		margin-right: 5px;
		border-radius: 50%;
	}
	._chart {
		background:rgba(255,255,255,0);
		border:1px solid rgba(232, 232, 232, 1)
	}
}
</style>

<style lang="scss">
.v-academy-transfer-statistic-loss {
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