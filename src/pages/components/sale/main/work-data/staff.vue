<template>
	<div class="v-sale-mian-customer-statistics-staff">
		<div class="g-tabs">
			<i-tab :value="type" v-model="type" class="g-tc " @on-click="handleTabs">
				<i-tab-pane label="添加" name="3" class="_p-lr-20">
					<div
						v-if="option.series[0].data.length>0 "
						:style="{ minWidth: '400px',maxWidth:'1000px', height:'260px'}"
					>
						<oa-echarts :options="option" :auto-resize="true"/>
					</div>
					<div
						v-else
						:style="{ minWidth: '400px',maxWidth:'1000px', height:'260px'}"
						class="g-flex-cc g-flex-ac g-fd-c"
					>
						<img :src="OSS_SEARCH_EMPTY">
						<div class="g-tc">暂无数据，赶快添加一条吧~</div>
					</div>
				</i-tab-pane>
				<i-tab-pane label="领取" class="_p-lr-20" name="1">
					<div
						v-if="option.series[0].data.length>0"
						:style="{ minWidth: '400px',maxWidth:'1000px', height:'260px'}"
					>
						<oa-echarts :options="option" :auto-resize="true"/>
					</div>
					<div
						v-else
						:style="{ minWidth: '400px',maxWidth:'1000px', height:'260px'}"
						class="g-flex-cc g-flex-ac g-fd-c"
					>
						<img :src="OSS_SEARCH_EMPTY">
						<div class="g-tc">暂无数据，赶快添加一条吧~</div>
					</div>
				</i-tab-pane>
			</i-tab>
		</div>
	</div>
</template>

<script>
import { Modal, Form, FormItem, Input, Button, DatePicker, Tabs, TabPane } from 'iview';
import moment from 'moment';
import { OSS_SEARCH_EMPTY } from '@constants/constants';
import API from '@stores/apis/root';
import { Echarts } from "wya-vc";

export default {
	name: "ed-target",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-date-picker": DatePicker,
		'i-tab': Tabs,
		'i-tab-pane': TabPane,
		'oa-echarts': Echarts,
	},
	data() {
		const date = moment().format('YYYY');
		return {
			OSS_SEARCH_EMPTY,
			type: '3',
			option: {
				color: '#2397f9',
				tooltip: {
					trigger: 'axis',
					axisPointer: { // 坐标轴指示器，坐标轴触发有效
						type: 'line' // 默认为直线，可选为：'line' | 'shadow'
					},
					formatter(params) {
						let relVal = params;
						for (let i = 0, l = params.length; i < l; i++) {
							relVal = date + '-' + params[i].name + '<br/>' + params[i].marker + '添加个数:' + params[i].value;
						}
						return relVal;
					}
				},
				xAxis: {
					type: 'category',
					data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
				},
				yAxis: {
					type: 'value'
				},
				series: [{
					data: [],
					type: 'line',
				}]
			}
		};
	},
	computed: {},
	created() {
		this.loadData();
	},
	mounted() {},
	methods: {
		handleTabs() {
			this.loadData();
		},
		loadData() {
			this.$request({
				url: API._SALE_MAIN_STATISTICS_CUSTOMER_PAGE_GET,
				type: "GET",
				loading: false,
				param: {
					type: this.type
				}
			}).then((res) => {
				this.option.series[0].data = res.data.info || [];
				this.option.xAxis.data = res.data.time_line || [];
				if (this.type == 1) {
					this.option.tooltip = {
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'line' // 默认为直线，可选为：'line' | 'shadow'
						},
						formatter(params) {
							let relVal = params;
							const date = moment().format('YYYY');
							for (let i = 0, l = params.length; i < l; i++) {
								relVal = date + '-' + params[i].name + '<br/>' + params[i].marker + '领取个数:' + params[i].value;
							}
							return relVal;
						}
					};
				} else {
					this.option.tooltip = {
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'line' // 默认为直线，可选为：'line' | 'shadow'
						},
						formatter(params) {
							let relVal = params;
							const date = moment().format('YYYY');
							for (let i = 0, l = params.length; i < l; i++) {
								relVal = date + '-' + params[i].name + '<br/>' + params[i].marker + '添加个数:' + params[i].value;
							}
							return relVal;
						}
					};
				}
			}).catch((err) => {
				console.error(err);
			});
		},
	},
};
</script>

<style  lang="scss">
    .v-sale-mian-customer-statistics-staff {
        .ivu-tabs-nav-scroll {
            text-align: center !important;
        }
        .ivu-tabs-nav {
            float: none !important;
        }
        .ivu-tabs-ink-bar {
            background: none !important;
        }
        .ivu-tabs-tab-active {
            border-bottom: 3px solid #d9444f !important;
        }
		._p-lr-20{
			padding: 0 20px;
		}
    }
</style>
