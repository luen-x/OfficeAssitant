
<template>
	<div class="v-finance-echars">
		<ul class="_item">
			<li
				v-for="(c,index) of date"
				:key="index"
				:class="{checked:index==type}"
				@click="changeList(index)"
			>{{ c }}</li>
			<div class="_line"/>
		</ul>
		<vc-echarts :options="ooption" :auto-resize="true"/>
	</div>
</template>

<script>
import { RadioGroup, Radio, Divider } from "iview";
import { Echarts } from "wya-vc";
import API_ROOT from "@stores/apis/root";

export default {
	name: "oa-finance-echarts",
	components: {
		"vc-echarts": Echarts,
		"i-radio-group": RadioGroup,
		"i-radio": Radio,
		"i-divider": Divider
	},
	data() {
		return {
			ooption: {},
			date: ["日", "月"],
			type: 0,
			isActive: "g-c-orange-dark"
		};
	},
	watch: {
		type() {
			this.fetchEchartData();
		}
	},
	created() {
		this.fetchEchartData();
	},
	methods: {
		changeList(index) {
			this.type = index; // this指向app
		},
		handleProcessingData(data) {
			let newData = {
				color: ["#ff8134", "#aea658", "#877b60", "#9fc1bd"],
				tooltip: {
					// show: true
					trigger: "axis"
				},
				legend: {
					data: ["实付业绩", "到账业绩", "退款金额", "实际业绩"]
				},
				xAxis: {
					type: "category",
					data: data.column
				},
				yAxis: {
					type: "value",
					axisLabel: {
						formatter: "{value}"
					}
				},
				series: [
					{
						name: "实付业绩",
						type: "line",
						data: data.data.pay_performance
					},
					{
						name: "到账业绩",
						type: "line",
						data: data.data.received_performance
					},
					{
						name: "退款金额",
						type: "line",
						data: data.data.refund_amount
					},
					{
						name: "实际业绩",
						type: "line",
						data: data.data.real_performance
					}
				]
			};
			return (this.ooption = newData);
		},
		fetchEchartData() {
			this.$request({
				url: API_ROOT._FINANCE_MAIN_STATISTIC_GET,
				type: "GET",
				param: {
					type: this.type + 1
				}
			}).then(res => {
				this.handleProcessingData(res.data);
			}).catch(err => {});
		}
	}
};
</script>

<style lang="scss" scoped>
.v-finance-echars {
    height: 300px;
    width: 100%;
    border-radius: 6px;
    padding-bottom: 20px;
    box-shadow: 0px 0px 10px #6666664f;
    ._item {
        height: 40px;
        line-height: 40px;
        background-color: #f5f5f6;
        vertical-align: middle;
        font-size: 14px;
        position: relative;
        margin-bottom: 10px;
        li {
            color: #636770;
            margin-left: 30px;
            display: inline-block;
            text-align: center;
            cursor: pointer;
        }
        li.checked {
            color: #ef3528 !important;
        }
        ._line {
            position: absolute;
            top: 14px;
            left: 58px;
            width: 1px;
            height: 14px;
            background-color: #636770;
        }
    }
}
</style>
