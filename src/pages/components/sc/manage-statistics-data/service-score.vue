<template>
	<div class="g-m-30">
		<div>
			<i-date-picker
				v-model="placeOrderStart"
				clearable
				transfer
				type="daterange"
				split-panels
				placeholder="请选择客户合作时间段"
				style="width: 220px;"
				formate="yyyy-MM-dd"
				class="g-m-r-10"
				@on-change="handleSearch"
			/>

			<i-select
				v-model="search.customer_type"
				transfer
				style="width:220px;"
				placeholder="请选择查看范围"
				class="g-m-r-10"
				@on-change="handleSearch"
			>
				<i-option
					v-for="item in limits"
					:value="item.value"
					:key="item.value"
				>
					{{ item.label }}
				</i-option>
			</i-select>

			<vc-debounce-click
				:tag="Button"
				type="primary"
				class="g-red-btn-small"
				style="width: 60px;height:32px"
				@click="handleSearch"
			>
				搜索
			</vc-debounce-click>

			<div class="g-flex g-pd-t-30">
				<div class="g-relative" style="width: 50%;height: 350px;">
					<div class="g-fs-14 g-c-black g-pd-t-25 g-absolute" style="margin-left: 15%;">
						服务评分统计
					</div>

					<vc-echarts
						:options="ring"
						:auto-resize="true"
					/>
				</div>
				<div class="g-flex g-jc-sb" style="width: 50%;">
					<div class="g-tc" style="width: 50%;">
						<div class="g-fs-14 g-c-black g-pd-t-25" style="margin-bottom: 42px;">
							8分率
						</div>

						<i-circle :percent="+rateStatic.score_step_two_rate" :size="160" :stroke-width="12" :trail-width="12">
							<span class="demo-Circle-inner g-fs-18">
								{{ rateStatic.score_step_two_rate }}%
							</span>
						</i-circle>
					</div>
					<div class="g-tc" style="width: 50%;">
						<div class="g-fs-14 g-c-black g-pd-t-25" style="margin-bottom: 42px;">
							9分率
						</div>

						<i-circle :percent="+rateStatic.score_step_three_rate" :size="160" :stroke-width="12" :trail-width="12">
							<span class="demo-Circle-inner g-fs-18">
								{{ rateStatic.score_step_three_rate }}%
							</span>
						</i-circle>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Button, DatePicker, Select, Option, Circle } from 'iview';
import { Echarts } from "wya-vc";
import moment from "moment";

export default {
	components: {
		"i-button": Button,
		"i-date-picker": DatePicker,
		"i-select": Select,
		"i-option": Option,
		"i-circle": Circle,
		"vc-echarts": Echarts
	},

	data() {
		const { query = {} } = this.$route;

		return {
			search: {
				customer_type: String(query.company_info || "3"), // 客户类型
			},
			placeOrderStart: [query.place_order_start_time, query.place_order_end_time], // 客户合作时间
			rateStatic: {},
			limits: [
				{
					value: "1",
					label: "查看所有（包含到期、退款）"
				},
				{
					value: "2",
					label: "只看未退款客户"
				},
				{
					value: "3",
					label: "只看未退款未到期客户"
				}
			],
			ring: {
				color: ['#2E9DFA', '#FFB42B', '#5DCA4D', '#EC505B', '#8453C8'],
			    tooltip: {
					trigger: 'item',
					formatter: (val) => {
						let arr = val.name.split(",");

						return ["＜6分总数   |    ", "6≤x＜8分总数  |    ", "8≤x＜9分总数  |    ", "9≤x＜10分总数  |    ", "10分总数  |    "][arr[0] - 1]
						+ arr[1] + "     " + arr[2];
					}
				},
				legend: {
					show: true, // 关闭悬浮提示
					orient: 'vertical',
					right: "9%", // 图例距离右侧距离
					top: "middle", // 图例垂直居中
					data: [],
					formatter: (name) => {
						let str = name.split(",");
						let arr = [];
						arr = [
							["{a|＜6分总数}", "{a|6≤x＜8分总数}", "{a|8≤x＜9分总数}", "{a|9≤x＜10分总数}", "{a|10分总数}"][str[0] - 1],
							`{b|${'|'}}`,
							`{c|${str[1]}}`,
							`{d|${str[2]}}`
						];

						return arr.join(' ');
					},
					textStyle: {
						rich: {
							a: {
								fontSize: "12",
								color: "#333333",
								width: 100,
								padding: [0, 20, 0, 0]
							},
							b: {
								fontSize: "12",
								color: "#E8E8E8",
								width: 20
							},
							c: {
								fontSize: "13",
								color: "#333333",
								width: 60
							},
							d: {
								fontSize: "12",
								color: "#818794"
							}
						}
					}
				},
				series: [{
					name: '',
					type: 'pie',
					radius: ['40%', '60%'],
					center: ["20%", "50%"],
					avoidLabelOverlap: false,
					hoverAnimation: true, // 是否开启 hover 在扇形上的放大动画效果
					silent: false, // 图形是否不响应和触发鼠标事件，默认为false,即响应和触发鼠标事件
					label: {
						normal: {
							show: true,
							position: 'center',
							formatter(v) {
								let arr = [
									'{a|平均分}',
									`{b|${(+v.name.split(",")[3]).toFixed(2)}}`
								];

								return arr.join('\n');
							},
							textStyle: {
								rich: {
									a: {
										fontSize: "20",
										color: "#000000",
										height: "42",
										lineHeight: "42"
									},
									b: {
										fontSize: "16",
										color: '#333333'
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
			}
		};
	},

	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},

	mounted() {
		this.loadData();
	},

	methods: {
		loadData() {
			this.$request({
				url: "_SC_MANAGE_STATISTICS_SERVICE_SCORE",
				type: "GET",
				param: {
					...this.search,
					place_order_start_time: this.placeOrderStart[0] && moment(this.placeOrderStart[0]).format("YYYY-MM-DD"),
					place_order_end_time: this.placeOrderStart[1] && moment(this.placeOrderStart[1]).format("YYYY-MM-DD"),
				}
			}).then(res => {
				this.ring.legend.data = [];
				this.ring.series[0].data = [];
				res.data.service_score_step_static.forEach(item => {
					this.ring.legend.data.push({
						name: item.score_step + "," + item.num + '次,' + item.point + "%," + res.data.average_score,
						// 强制设置图形为圆。
						icon: 'circle'
					});

					this.ring.series[0].data.push({
						value: item.num,
						name: item.score_step + "," + item.num + '次,' + item.point + "%," + res.data.average_score // 平均分
					});
				});

				this.rateStatic = res.data.service_score_step_rate_static;
			});
		},

		handleSearch() {
			this.loadData();
		}
	}
};
</script>

<style lang="scss">
</style>