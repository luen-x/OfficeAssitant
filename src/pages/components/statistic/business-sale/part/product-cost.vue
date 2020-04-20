<template>
	<div>
		<oa-panel
			:tabs="dateLabel"
			title="产品成本统计"
			more-label="进入看板"
			@tab-change="handleTabChange"
			@more="handleGoRank"
		>
			<div class="g-flex g-jc-sb g-m-b-30">
				<oa-mix-picker
					v-model="time"
					:type="currentTab"
					@change="handleChange"
				/>

				<div>
					<i 
						v-if="$auth[1784]"
						class="iconfont icon-download g-fs-18 g-m-r-20 g-pointer"
						style="color: #2397F9;"
						@click="handleExport"
					/>
					<i 
						:class="isEchars ? 'icon-table' : 'icon-pie'"
						class="iconfont icon-table g-fs-18 g-pointer"
						style="color: #2397F9;"
						@click="isEchars = !isEchars"
					/>
				</div>
			</div>

			<oa-product-echars 
				v-if="isEchars"
				:data-source="histogramData"
			/>
			<oa-product-table 
				v-else
				:data-source="histogramData"
			/>
		</oa-panel>
	</div>
</template>

<script>
import API_ROOT from '@stores/apis/root';
import { getHashUrl } from '@utils/utils';
import Panel from '../../_common/panel';
import MixPicker, { getInitTime } from '../../_common/mix-picker';
import ProductEcharts from './product-echarts'; 
import ProductTable from './product-table';

export default {
	components: {
		'oa-panel': Panel,
		'oa-mix-picker': MixPicker,
		'oa-product-echars': ProductEcharts,
		'oa-product-table': ProductTable
	},
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
			isEchars: true,
			histogramData: {}
		};
	},
	created() {
		this.loadHistogramData();
	},
	methods: {
		loadHistogramData() {
			this.$request({
				url: '_STATISTIC_BUSINESS_SALE_COST_GET',
				type: "GET",
				param: {
					type: this.currentTab,
					year: +this.currentTab === 2 ? this.time.year : '',
					season: +this.currentTab === 3 ? this.time.season[1] : '',
					month: +this.currentTab === 4 ? this.time.month : ''
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
			this.loadHistogramData();
		},
		handleChange() {
			this.loadHistogramData();
		},
		handleGoRank() {
			if (!this.$auth[1783]) return this.$Message.warning('暂无权限查看');
			this.$router.push({
				path: '/statistic/business/sale/cost',
				query: {
					...this.time,
					season: this.time.season[1],
					currentTab: this.currentTab
				}
			});
		},
		handleExport() {
			window.open(getHashUrl(API_ROOT["_STATISTIC_BUSINESS_SALE_EXPORT_GET"], {
				type: this.currentTab,
				year: +this.currentTab === 2 ? this.time.year : '',
				season: +this.currentTab === 3 ? this.time.season[1] : '',
				month: +this.currentTab === 4 ? this.time.month : '',
				'-token': this.$global.token
			}));
		}
	}
};
</script>

<style lang="scss">
</style>