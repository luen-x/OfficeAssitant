<template>
	<div class="v-statistic-business-sale-cost-content">
		<div class="g-m-b-20">
			<i-select
				v-model="currentTab"
				transfer
				style="width:220px;"
				class="g-m-r-10"
				@on-change="handleChange"
			>
				<i-option
					v-for="item in dateLabel"
					:value="String(item.value)"
					:key="item.value"
				>
					{{ item.label }}
				</i-option>
			</i-select>

			<oa-mix-picker
				v-model="time"
				:type="+currentTab"
				@change="handleChangeDate"
			/>

			<i-select
				v-model="departId"
				transfer
				clearable
				style="width:220px;"
				class="g-m-l-10"
				placeholder="请选择组织"
				@on-change="handleDepartChange"
			>
				<i-option
					v-for="item in departAll"
					:value="String(item.value)"
					:key="item.value"
				>
					{{ item.label }}
				</i-option>
			</i-select>
		</div>

		<oa-product-echars
			:data-source="histogramData"
		/>
	</div>
</template>

<script>
import { Select, Option } from 'iview';
import { services } from '@stores/services/sale';
import { getParseUrl, getHashUrl } from "@utils/utils";
import Panel from '../_common/panel';
import MixPicker, { getInitTime } from '../_common/mix-picker';
import ProductEcharts from '../business-sale/part/product-echarts'; 

export default {
	components: {
		'i-select': Select,
		'i-option': Option,
		'oa-panel': Panel,
		'oa-mix-picker': MixPicker,
		'oa-product-echars': ProductEcharts
	},
	mixins: [
		services.departAll(),
		services.firstDepartId()
	],
	data() {
		const { query } = this.$route;

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
			time: {
				year: +query.year,
				season: [+query.season.split(",")[0].split("-")[0], query.season],
				month: query.month
			},
			currentTab: String(query.currentTab || ''),
			departId: String(query.depart_id || ''),
			histogramData: {}
		};
	},
	created() {
		this.loadHistogramData();
	},
	methods: {
		loadHistogramData(depart_id) {
			this.$request({
				url: '_STATISTIC_BUSINESS_SALE_COST_GET',
				type: "GET",
				param: {
					type: this.currentTab,
					year: +this.currentTab === 2 ? this.time.year : '',
					season: +this.currentTab === 3 ? this.time.season[1] : '',
					month: +this.currentTab === 4 ? this.time.month : '',
					depart_id: this.departId
				},
				loading: false
			}).then(res => {
				this.histogramData = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		handleTabChange(tab) {
			this.currentTab = tab.value;
			this.handleSearch();
		},
		handleDepartChange() {
			this.loadHistogramData();
			this.handleSearch();
		},
		handleChange() {
			this.loadHistogramData();
			this.handleSearch();
		},
		handleChangeDate() {
			this.loadHistogramData();
			this.handleSearch();
		},
		handleSearch() {
			this.$router.replace(
				getHashUrl('/statistic/business/sale/cost', {
					...this.$route.query,
					type: this.currentTab,
					currentTab: this.currentTab,
					...this.time,
					season: this.time.season[1],
					depart_id: this.departId
				})
			);

			this.$store.commit("STATISTIC_BUSINESS_SALE_COST_LIST_INIT");
		}
	}
};
</script>