<template>
	<div class="v-statistic-sale-company-goal">
		<oa-panel
			:tabs="dateLabel"
			title="公司目标"
			@tab-change="handleTabChange"
		>
			<div class="g-pd-r-20 g-pd-b-20">
				<div class="g-flex">
					<i-radio-group 
						v-model="amountType" 
						type="button"
						@on-change="handleChange"
					>
						<i-radio label="1">
							成交金额
						</i-radio>
						<i-radio label="2">
							实际业绩
						</i-radio>
					</i-radio-group>

					<oa-mix-picker
						v-model="time"
						:type="currentTab"
						:season-tree="seasonTree"
						class="g-m-l-20"
						@change="handleDateChange"
					/>
				</div>

				<oa-goal 
					:data-source="companyGoal"
					:amount-type="amountType"
					:type="currentTab"
				/>
			</div>
		</oa-panel>
	</div>
</template>

<script>
import { RadioGroup, Radio } from 'iview';
import moment from 'moment';
import { services } from '@stores/services/sale';
import Goal from '../../_common/goal';
import Panel from '../../_common/panel';
import MixPicker, { getInitTime, getTargetSeasonTree } from '../../_common/mix-picker';

export default {
	components: {
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'oa-goal': Goal,
		'oa-panel': Panel,
		'oa-mix-picker': MixPicker
	},
	mixins: [services.targetSeason()],
	data() {
		return {
			dateLabel: [
				{
					label: '年度',
					value: 2
				},
				{
					label: '季度',
					value: 3
				},
				{
					label: '月度',
					value: 4
				}
			],
			time: getInitTime(),
			currentTab: 2,
			seasonTree: [],
			companyGoal: {},
			amountType: '1', // 金额类型 1成交金额 2实际业绩
			year: moment().format("YYYY"),
			configId: '',
			month: ''
		};
	},
	async created() {
		await this.loadTargetSeasonPromise;
		const season = getTargetSeasonTree(this.targetSeason);
		this.seasonTree = season.tree;
		this.time = { ...this.time, season: season.value };
	},
	mounted() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: '_STATISTIC_BUSINESS_SALE_TARGET_GET',
				type: "GET",
				param: {
					whose: 1,
					amount_type: this.amountType,
					time_type: this.currentTab,
					year: this.year,
					config_id: this.configId,
					month: this.month
				},
				loading: false
			}).then(res => {
				this.companyGoal = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		handleTabChange(tab) {
			this.currentTab = tab.value;
			this.handleData();
		},
		handleChange() {
			this.loadData();
		},
		handleDateChange(time) {
			this.handleData(time);
		},
		handleData(time) {
			this.year = '';
			this.configId = '';
			this.month = '';

			if (this.currentTab === 2) {
				this.year = time ? time.year : this.time.year;
			} else if (this.currentTab === 3) {
				this.configId = time ? time.season[1] : this.time.season[1];
			} else {
				this.month = moment(time ? time.month : this.time.month).format('YYYY-MM');
			}


			this.loadData();
		}
	}
};
</script>

<style lang="scss">
.v-statistic-sale-company-goal {
	.ivu-radio-wrapper:first-child{
		margin-right: 0px;
	}

	.ivu-radio-group-button {
		.ivu-radio-wrapper {
			padding: 0px 20px;
			height: 36px;
			line-height: 36px;
		}
	}
}
</style>