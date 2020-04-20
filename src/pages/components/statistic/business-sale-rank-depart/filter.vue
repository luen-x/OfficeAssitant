<template>
	<div>
		<div>
			<i-select
				v-model="search.time_type"
				transfer
				style="width:220px;"
				class="g-m-r-10"
				@on-change="handleSelectChange"
			>
				<i-option
					v-for="item in date"
					:value="item.value"
					:key="item.value"
				>
					{{ item.label }}
				</i-option>
			</i-select>

			<oa-mix-picker
				v-model="time"
				:type="+search.time_type"
				:season-tree="seasonTree"
				class="g-m-r-10"
				style="width: 220px;"
				@change="handleChange"
			/>
				
			<vc-debounce-click
				:tag="Button"
				type="primary"
				class="g-m-l-5 g-red-btn-small"
				style="width: 60px;height:32px"
				@click="handleSearch"
			>
				搜索
			</vc-debounce-click>
		</div>

		<div v-if="+companyGoal.is_business === 0" class="g-b g-pd-lr-20 g-pd-tb-20 g-m-tb-20">
			<i-radio-group 
				v-model="amountType" 
				type="button"
				@on-change="handleRadioChange"
			>
				<i-radio label="1">
					成交金额
				</i-radio>
				<i-radio label="2">
					实际业绩
				</i-radio>
			</i-radio-group>
			<oa-goal
				:data-source="companyGoal"
				:amount-type="amountType" 
				class="_goal"
			/>
		</div>
	</div>
</template>

<script>
import { Button, Select, Option, RadioGroup, Radio } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import moment from 'moment';
import { services } from '@stores/services/sale';
import Goal from '../_common/goal';
import MixPicker, { getInitTime, getTargetSeasonTree } from '../_common/mix-picker';

export default {
	name: 'oa-filter',
	components: {
		'i-select': Select,
		'i-option': Option,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'oa-goal': Goal,
		'oa-mix-picker': MixPicker
	},
	mixins: [services.targetSeason()],
	data() {
		const { query = {} } = this.$route;
		return {
			search: {
				time_type: String(query.time_type || "2") // 时间类型 4月度 3季度 2年度
			},
			time: {
				year: +(query.year || moment().format("YYYY")),
				month: query.month || moment().format("YYYY-MM"),
				season: [query.season.split(",")[0], +query.season.split(",")[1]]
			},
			date: [
				{
					label: '年度',
					value: '2'
				},
				{
					label: '季度',
					value: '3'
				},
				{
					label: '月度',
					value: '4'
				}
			],
			seasonTree: [],
			amountType: String(query.amount_type || '1'),
			companyGoal: {}
		};
	},
	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},
	async created() {
		await this.loadTargetSeasonPromise;
		const season = getTargetSeasonTree(this.targetSeason);
		this.seasonTree = season.tree;
		
		this.loadGoalData();
	},
	methods: {
		loadGoalData() {
			const { query } = this.$route;

			this.$request({
				url: '_STATISTIC_BUSINESS_SALE_TARGET_GET',
				type: "GET",
				param: {
					whose: query.whose,
					amount_type: this.amountType,
					time_type: this.search.time_type,
					year: +this.search.time_type === 2 ? this.time.year : '',
					config_id: +this.search.time_type === 3 ? this.time.season[1] : '',
					month: +this.search.time_type === 4 ? moment(this.month).format("YYYY-MM") : '',
					depart_id: query.depart_id
				},
				loading: false
			}).then(res => {
				this.companyGoal = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		handleSearch(event) {
			this.$store.commit('STATISTIC_BUSINESS_SALE_RANK_DEPART_LIST_INIT');
		},
		handleChange(time) {
			this.time = time;

			this.handleSearch();
			this.loadGoalData();
		},
		handleRadioChange() {
			this.loadGoalData();
		},
		handleSelectChange() {
			this.handleSearch();
			this.loadGoalData();	
		}
	}
};
</script>

<style lang="scss" scoped>
</style>