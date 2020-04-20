<template>
	<div class="v-distribute-sc">
		<h3>客户类型统计</h3>

		<div class="g-m-t-20 g-m-b-20 g-m-l-20">
			<i-datepicker  
				v-model="query.start_month"
				type="month" 
				clearable
				transfer
				placeholder="时间（起始）"
				style="width: 220px"
				@on-change="handleStartTimeChange"
			/>
			至
			<i-datepicker  
				v-model="query.end_month"
				type="month" 
				clearable
				transfer
				placeholder="时间（结束）"
				style="width: 220px"
				@on-change="handleEndTimeChange"
			/>
			<vc-debounce-click
				:tag="Button"
				type="primary"
				class="g-m-l-10 g-red-btn-small"
				style="width: 60px;height:32px"
				@click="handleSearch"
			>
				搜索
			</vc-debounce-click>
		</div>

		<div class="g-flex _distribute">
			<div :style="{width: width, height: height}">
				<vc-echarts 
					:options="bar"
					:auto-resize="true"
				/>
			</div>

			<div :style="{width: width}">
				<vc-echarts 
					:options="ring"
					:auto-resize="true"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import { Echarts } from "wya-vc";
import { DatePicker, Button } from "iview";
import API_ROOT from "@stores/apis/root";
import moment from 'moment';

export default {
	name: 'oa-success-customer', 

	components: {
		"vc-echarts": Echarts,
		"i-datepicker": DatePicker
	}, 
    
	data() {
		let _this = this;

		return {
			arr: [{ title: "领取客户", num: 0 }, { title: "归还客户", num: 0 }, { title: "新增客户", num: 0 }, { title: "成交客户", num: 0 }],
			total: "",
			query: {
				start_month: moment().subtract(11, 'months').toDate(),
				end_month: new Date()
			},
			bar: {
				color: ['#2397F9', '#ffb42b', '#5dca4d', '#ec505b'],
			    tooltip: {
					trigger: 'axis'
				},
				legend: {
					data: [{
						name: '领取客户',
						// 强制设置图形为圆。
						icon: 'circle',		
					},
					{
						name: '归还客户',
						// 强制设置图形为圆。
						icon: 'circle',
					},
					{
						name: '新增客户',
						// 强制设置图形为圆。
						icon: 'circle',
					},
					{
						name: '成交客户',
						// 强制设置图形为圆。
						icon: 'circle',
					}]
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: {
					type: 'category',
					boundaryGap: false,
					data: []
				},
				yAxis: {
					type: 'value',
					splitLine: {
						lineStyle: {
							type: 'dashed'
						}
					},
					// max: 10
				},
				series: [
					{
						name: '领取客户',
						type: 'line',
						data: []
					},
					{
						name: '归还客户',
						type: 'line',
						data: []
					},
					{
						name: '新增客户',
						type: 'line',
						data: []
					},
					{
						name: '成交客户',
						type: 'line',
						data: []
					}
				]
			},
			ring: {
				color: ['#2397F9', '#e8dc46', '#5dca4d', '#ec505b', '#ffb42b'],
			    tooltip: {
					trigger: 'item',
					formatter: (val) => {
						let arr = val.name.split(",");
						
						return arr[0] + "：" + arr[2];
					}
				},
				legend: {
					show: true, // 关闭悬浮提示
					orient: 'vertical',
					right: "10%", // 图例距离右侧距离
					top: "middle", // 图例垂直居中
					data: [],
					formatter: (name) => {
						let str = name.split(",");

						let arr = [
							'{a|' + str[0] + '}',
							'{b|' + str[1] + '}',
							'{c|' + str[2] + '}'
						];

						return arr.join(' ');
					},
					textStyle: {
						rich: {
							a: {
								fontSize: "14",
								color: "#333333",
								width: 60
							},
							b: {
								color: "#d4d7db",
								height: 11
							},
							c: {
								fontSize: "16",
								color: "#333333",
								width: 60,
								padding: [0, 12, 0, 12]
							}
						}
					}
				},
				series: [{
					name: '',
					type: 'pie',
					radius: ['40%', '58%'],
					center: ["28%", "50%"],
					avoidLabelOverlap: false,
					hoverAnimation: true, // 是否开启 hover 在扇形上的放大动画效果
					silent: false, // 图形是否不响应和触发鼠标事件，默认为false,即响应和触发鼠标事件
					label: {
						normal: {
							show: true,
							position: 'center',
							formatter() {
								let arr = [
									'{a|' + _this.total + '}'
								];

								return arr.join('\n');
							},
							textStyle: {
								rich: {
									a: {
										fontSize: "18",
										color: "#000000",
										height: "42",
										lineHeight: "42"
									}
								}
							}
						},
						emphasis: {
							show: true,
							position: 'center'
						}
					},
					labelLine: {
						normal: {
							show: false
						}
					},
					data: []
				}]
			},
			width: '50%',
			height: '80%'
		};
	},
    
	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},

	mounted() {
		this.handleGetData();
	},
    
	methods: {
		handleSearch() {
			let start_month = this.formatQuery(this.query).start_month;
			let end_month = this.formatQuery(this.query).end_month;

			this.handleGetData(start_month, end_month);
		},

		handleGetData(start_month, end_month) {
			this.$request({
				url: API_ROOT.STATISTICS_CUSTOMER_TYPES_GET,
				type: "GET",
				param: {
					type: 1,
					total: 1,
					start_month,
					end_month
				}
			}).then(res => {
				this.ring.legend.data = [];
				this.ring.series[0].data = [];
				this.bar.series[0].data = [];
				this.bar.series[1].data = [];
				this.bar.series[2].data = [];
				this.bar.series[3].data = [];
				this.bar.xAxis.data = [];
				
				this.bar.xAxis.data = res.data.time_line;
				this.total = res.data.total ? res.data.total.total : 0;

				res.data.total ? res.data.total.info.forEach(item => {
					this.ring.legend.data.push({
						name: item.title + ",丨," + item.num + "人",
						// 强制设置图形为圆。
						icon: 'circle'
					});

					this.ring.series[0].data.push({
						value: item.num,
						name: item.title + ",丨," + item.num + "人" 
					});
				}) : this.arr.forEach(item => {
					this.ring.legend.data.push({
						name: item.title + ",丨," + item.num + "人",
						// 强制设置图形为圆。
						icon: 'circle'
					});

					this.ring.series[0].data.push({
						value: item.num,
						name: item.title + ",丨," + item.num + "人" 
					});
				});

				res.data.info.forEach(item => {
					item.forEach(element => {
						if (element.type == 1) {
							this.bar.series[0].data.push(element.num);
						} else if (element.type == 2) {
							this.bar.series[1].data.push(element.num);
						} else if (element.type == 3) {
							this.bar.series[2].data.push(element.num);
						} else {
							this.bar.series[3].data.push(element.num);
						}
					});
				});
			}).catch(error => {});
		},

		formatQuery() {
			const _query = {};

			Object.keys(this.query).forEach(key => {
				if (this.query[key] instanceof Date) {
					_query[key] = moment(this.query[key]).format('YYYY-MM');
				} else {
					_query[key] = this.query[key];
				}

			});
			return _query;
		},

		handleStartTimeChange() {
			if (!this.query.start_month) {
				this.query.start_month = moment().subtract(11, 'months').toDate();

			}

			this.query.end_month = moment(this.query.start_month).add(11, 'months').toDate();
			this.handleSearch();

		},

		handleEndTimeChange() {
			if (!this.query.end_month) {
				this.query.end_month = new Date();
			}

			this.query.start_month = moment(this.query.end_month).subtract(11, 'months').toDate();
			this.handleSearch();
		}
	}
};
</script>


<style lang="scss" scoped>
    .v-distribute-sc{
        height: 500px;
        border: 1px solid #ebeef1;

		&:hover{
			box-shadow: 0 0 7px 0 rgba(0,0,0,0.1);
		}

        h3{
            height: 50px;
            line-height: 50px;
            padding-left: 20px;
            font-size: 14px;
            color: #333333;
            background: #f8f8f8;
        }

        ._distribute{
            height: 100%;
            padding-bottom: 30px;


            div:nth-of-type(2){
                width: 100%;
                height: 80%;
                position: relative;
                padding-right: 2%;
                border-left: 1px dashed #ebeef1;
            }
        }
    }
</style>