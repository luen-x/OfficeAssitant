
<template>
	<div
		v-if="echartsData.length"
		class="v-finance-count-achi-echarts-collapse"
	>
		<div v-if="echartsData.length&&echartsData[0].is_empty==0">
			<i-collapse v-model="value2" accordion>
				<i-panel
					v-show="echartsData.length&&echartsData[0].is_empty==0"
					name="1"
				>
					{{ echartsData.length&&echartsData[0].depart_name }}
					<div slot="content">
						<div
							v-if="status"
							class="g-operation"
							@click="handleTip"
						>查看员工业绩</div>
						<div
							v-else
							:style="{ width:'100%',height:'420px'}"
						>
							<vc-echarts
								v-if="echartsData.length"
								ref="echarts"
								:options="echartsData[0].ooption"
								:auto-resize="true"
								class="g-m-t-10"
							/>
						</div>
					</div>
				</i-panel>
				<i-panel 
					v-show="echartsData.length>1&&echartsData[1].is_empty==0"
					name="2"
				>
					{{ echartsData.length>1&&echartsData[1].depart_name }}
					<div slot="content">
						<div :style="{ width:'100%',height:'420px'}">
							<vc-echarts
								v-if="echartsData.length>1"
								ref="echarts"
								:options="echartsData.length>1&&echartsData[1].ooption"
								:auto-resize="true"
								class="g-m-t-10"
							/>
						</div>
					</div>
				</i-panel>
			</i-collapse>
		</div>
		<div
			v-else
			style="margin:30px 10px"
		>
			<div>暂无数据</div>
		</div>
	</div>
	<div
		v-else
		style="margin:30px 10px"
	>
		<div>暂无数据</div>
	</div>
</template>

<script>
import { Collapse, Panel } from "iview";
import { Echarts } from "wya-vc";
import { getParseUrl, getHashUrl } from "@utils/utils";
import API_ROOT from "@stores/apis/root";

export default {
	name: "oa-tpl",
	components: {
		"vc-echarts": Echarts,
		"i-collapse": Collapse,
		"i-panel": Panel
	},
	props: {
		month: String,
		depart_id: Array
	},
	data() {
		return {
			value2: "1",
			status: false,
			echartsData: [
				{
					depart_name: "",
					ooption: {
						legend: {},
						xAxis: {},
						yAxis: {},
						series: []
					}
				}
			]
		};
	},
	watch: {
		$route(to, from) {
			if (
				to.query.month != from.query.month
        || to.query.depart_id != from.query.depart_id
			) {
				this.loadEchartData();
			}
		}
	},
	mounted() {
		this.loadEchartData();
		window.addEventListener("resize", this.selfAdaption);
		// this.selfAdaption();
	},
	beforeDestroy() {
		window.removeEventListener("resize", this.selfAdaption);
	},
	methods: {
		handleProcessingData(data) {
			this.status = false;
			let newArr = [];
			data.forEach((item, index) => {
				newArr.push({
					depart_name: item.depart_name,
					is_empty: item.is_empty,
					ooption: {
						color: ["#ff8134", "#aea658", "#877b60", "#9fc1bd"],
						tooltip: {
							show: true
						},
						legend: {
							data: item.performance_label
						},
						xAxis: {
							type: "category",
							axisLabel: {
								padding: 6
							},
							data: item.label
						},
						yAxis: {
							type: "value",
							axisLabel: {
								formatter: "{value}"
							},
							axisLine: {
								// show: false, // 隐藏Y轴网格线
							}
						},
						grid: {
							top: "50px",
							left: "100px",
							right: "30px",
							bottom: "30px"
						},
						series: [
							{
								name: item.performance_label[0],
								type: "bar",
								data: item.pay_performance
							},
							{
								name: item.performance_label[1],
								type: "bar",
								data: item.received_performance
							},
							{
								name: item.performance_label[2],
								type: "bar",
								data: item.refund_amount
							},
							{
								name: item.performance_label[3],
								type: "bar",
								data: item.real_performance
							}
						]
					}
				});
			});
			this.echartsData = newArr;
		},

		loadEchartData() {
			this.$request({
				url: API_ROOT._FINANCE_COUNT_ACHI_ECHARTS_POST,
				type: "POST",
				param: {
					month: this.month,
					depart_id: this.depart_id
				}
			})
				.then(res => {
					if (res.data.msgCode == 400) {
						this.status = true;
						return;
					} else {
						this.handleProcessingData(res.data);
					}
					
				})
				.catch(err => {
					this.$Message.error(err.msg);
				});
		},
		handleTip() {
			let { query = {} } = getParseUrl();
			this.$router.push(getHashUrl("/finance/count/staff", { ...query }));
		},
		selfAdaption() {
			this.$refs.echarts.resize();
		}
	}
};
</script>

<style lang="scss" >
.v-finance-count-achi-echarts-collapse {
  .ivu-collapse {
    border: none;
  }
}
</style>
