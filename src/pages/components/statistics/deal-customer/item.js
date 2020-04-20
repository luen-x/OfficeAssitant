const MONTH = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
export const tooltipFormatter = (unit, nowYear) => params => {
	let htmlStr = '';
	for (let i = 0; i < params.length; i++) {
		// x轴的名称  图例名称  y轴值  图例颜色
		let { name, seriesName, value, color } = params[i];
		if (i == 0) {
			const lastYear = nowYear - 1 + '年';
			htmlStr += lastYear + name + '<br/>';
		} else if (i == 3) {
			htmlStr += nowYear + '年' + name + '<br/>';
		}
		htmlStr += '<div>';
		// 为了保证和原来的效果一样，这里自己实现了一个点的效果
		htmlStr += `<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;
		background-color:${color};"></span>`;
		// 圆点后面显示的文本
		htmlStr += seriesName + '：' + value + unit;
		htmlStr += '</div>';
	}
	return htmlStr;
};

export default {
	data() {
		return {
			show: true,
			style: {
				transform: 'scale(.5)'
			},
			areasColumns: [
				{
					title: '排名',
					minWidth: 70,
					key: 'sort',
				}, 
				{
					title: '战区',
					minWidth: 100,
					key: 'depart_name',
					ellipsis: true,
				},
				{
					title: '成交客户',
					minWidth: 90,
					key: 'count',
					render(h, param) {
						return h('div', param.row.count + '人');
					}
				},
				{
					title: '排名升降',
					minWidth: 100,
					key: 'up_down',
					render: (h, params) => {
						return (
							<div class="v-deal-customer-rank">
								{
									params.row.up_down == 1 // 1上升 2下降
										? params.row.diff_sort // 0 不上不下 > 0 上升
											? <i class="iconfont icon-triangle-up">{params.row.diff_sort}</i>
											: <i class="iconfont icon-chengguojishanghenggang"></i>
										: <i class="iconfont icon-triangle-down">{params.row.diff_sort}</i>
								}
							</div>
						);
					}
				}
			],
			departmentColumns: [
				{
					title: '排名',
					minWidth: 70,
					key: 'sort',
				}, 
				{
					title: '部门',
					minWidth: 100,
					key: 'depart_name',
					ellipsis: true,
				},
				{
					title: '成交客户',
					minWidth: 90,
					key: 'count',
					render(h, param) {
						return h('div', param.row.count + '人');
					}
				},
				{
					title: '排名升降',
					minWidth: 100,
					key: 'up_down',
					render: (h, params) => {
						return (
							<div class="v-deal-customer-rank">
								{
									params.row.up_down == 1 // 1上升 2下降
										? params.row.diff_sort // 0 不上不下 > 0 上升
											? <i class="iconfont icon-triangle-up">{params.row.diff_sort}</i>
											// : <i class="iconfont icon-chengguojishanghenggang">{params.row.diff_sort}</i>
											: <i class="iconfont icon-chengguojishanghenggang"></i>
										: <i class="iconfont icon-triangle-down">{params.row.diff_sort}</i>
								}
							</div>
						);
					}
				}
			],
			staffColumns: [
				{
					title: '排名',
					minWidth: 70,
					key: 'sort',
				}, 
				{
					title: '员工',
					minWidth: 100,
					key: 'staff_name',
					ellipsis: true,
				},
				{
					title: '成交客户',
					minWidth: 90,
					key: 'count',
					render(h, param) {
						return h('div', param.row.count + '人');
					}
				},
				{
					title: '排名升降',
					minWidth: 100,
					key: 'diff_sort',
					render: (h, params) => {
						return (
							<div class="v-deal-customer-rank">
								{
									params.row.up_down == 1 // 1上升 2下降
										? params.row.diff_sort // 0 不上不下 > 0 上升
											? <i class="iconfont icon-triangle-up">{params.row.diff_sort}</i>
											: <i class="iconfont icon-chengguojishanghenggang"></i>
										: <i class="iconfont icon-triangle-down">{params.row.diff_sort}</i>
								}
							</div>
						);
					}
				}
			],
			// 成交客户数量统计柱状图
			customerMountBar: {
				grid: {
					left: 50,
				},
				tooltip: {
					trigger: "axis", 
					type: 'line',
					axisPointer: {
						type: 'shadow',
						shadowStyle: {
							color: 'rgba(150,150,150,0.1)'
						}
					},
					// formatter: tooltipFormatter('人')
					formatter: () => {},
					
				},
				legend: {
					left: 430,
					top: 10,
					// itemWidth: 10,
					// itemHeight: 10,
					selectedMode: false,
					data: [
						{	
							name: '老客户付款人数',
							icon: 'circle',
							textStyle: {
								color: '#000'
							}
						}, {
							name: '新客户付款人数',
							icon: 'circle',
							textStyle: {
								color: '#000'
							} 
						}
					],
				},
				xAxis: { 
					type: 'category',
					data: MONTH,
					nameGap: 50,
					axisLabel: { show: true, color: "000", fontSize: 14, margin: 15 },
					splitLine: { lineStyle: { color: '#ebeef1' } },
					axisLine: { lineStyle: { color: '#d4d7db' } },
					axisTick: { show: false }
				},
				yAxis: {
					type: 'value',
					axisLabel: { show: true, color: "000" },
					splitLine: { lineStyle: { color: '#ebeef1' } },
					axisLine: { lineStyle: { color: '#d4d7db' } },
					axisTick: { show: false }
				},
				animationDurationUpdate: 1000,
				series: [
					{
						name: "总计付款人数",
						type: "scatter",
						step: false,
						cursor: 'none',
						color: "#fff",
						symbolSize: 1,
						hoverAnimation: false,
						data: new Array(12).fill(0),
					},
					{
						type: 'bar',
						name: '老客户付款人数',
						stack: '去年',
						data: new Array(12).fill(0),
						itemStyle: {
							normal: {
								color: '#1f90ef'
							}
						}
					}, 
					{
						type: 'bar',
						name: '新客户付款人数',
						stack: '去年',
						data: new Array(12).fill(0),
						itemStyle: {
							color: 'rgb(88, 176, 250)'
						},
						label: {
							show: true,
							position: "top",
							color: '#000',
							fontSize: 14,
							formatter() {
								return '';
							}
						}
					}, 
					{
						name: "总计付款人数",
						type: "scatter",
						cursor: 'none',
						color: "#fff",
						symbolSize: 1,
						hoverAnimation: false,
						data: new Array(12).fill(0),
					},
					 {
						type: 'bar',
						name: '老客户付款人数',
						stack: '今年',
						data: new Array(12).fill(0),
						itemStyle: {
							normal: {
								color: '#1f90ef'
							}
						}
					}, 
					{
						type: 'bar',
						name: '新客户付款人数',
						stack: '今年',
						data: new Array(12).fill(0),
						itemStyle: {
							color: 'rgb(88, 176, 250)'
						},
						label: {
							show: true,
							position: "top",
							color: '#000',
							fontSize: 14,
							formatter() {
								return '';
							}
						}
					}	
				]
			},
			// 成交客户到账金额统计
			customerMoneyBar: {
				grid: {
					left: 60,
				},
				tooltip: {
					trigger: "axis", 
					type: 'line',
					axisPointer: {
						type: 'shadow',
						shadowStyle: {
							color: 'rgba(150,150,150,0.1)'
						}
					},
					// formatter: tooltipFormatter('万')
					formatter: () => {}
				},
				legend: {
					left: 430,
					top: 10,
					// itemWidth: 10,
					// itemHeight: 10,
					selectedMode: false,
					data: [
						{
							name: '老客户付款金额',
							icon: 'circle',
							textStyle: {
								color: '#000'
							}
						}, {
							name: '新客户付款金额',
							icon: 'circle',
							textStyle: {
								color: '#000'
							} 
						}
					],
				},
				xAxis: { 
					type: 'category',
					data: MONTH,
					axisLabel: { show: true, color: "000", fontSize: 14, margin: 15 },
					splitLine: { lineStyle: { color: '#ebeef1' } },
					axisLine: { lineStyle: { color: '#d4d7db' } },
					axisTick: { show: false }
				},
				yAxis: {
					type: 'value',
					axisLabel: { show: true, formatter: '{value}万', color: '#000' },
					splitLine: { lineStyle: { color: '#ebeef1' } },
					axisLine: { lineStyle: { color: '#d4d7db' } },
					axisTick: { show: false }
				},
				animationDurationUpdate: 1000,
				series: [
					{
						name: "总计付款金额",
						type: "scatter",
						step: false,
						cursor: 'none',
						color: "#fff",
						symbolSize: 1,
						hoverAnimation: false,
						data: new Array(12).fill(0),
					},
					{
						type: 'bar',
						name: '老客户付款金额',
						stack: '去年',
						data: new Array(12).fill(0),
						itemStyle: {
							normal: {
								color: 'rgb(57, 142, 235)'
							}
						}
					}, 
					{
						type: 'bar',
						name: '新客户付款金额',
						stack: '去年',
						data: new Array(12).fill(0),
						itemStyle: {
							color: 'rgb(88, 176, 250)'
						},
						label: {
							show: true,
							position: "top",
							color: '#000',
							fontSize: 14,
							formatter() {
								return '';
							}
						}
					}, 
					{
						name: "总计付款金额",
						type: "scatter",
						cursor: 'none',
						color: "#fff",
						symbolSize: 1,
						hoverAnimation: false,
						data: new Array(12).fill(0),
					},
					 {
						type: 'bar',
						name: '老客户付款金额',
						stack: '今年',
						data: new Array(12).fill(0),
						itemStyle: {
							normal: {
								color: 'rgb(57, 142, 235)'
							}
						}
					}, 
					{
						type: 'bar',
						name: '新客户付款金额',
						stack: '今年',
						data: new Array(12).fill(0),
						itemStyle: {
							color: 'rgb(88, 176, 250)'
						},
						label: {
							show: true,
							position: "top",
							color: '#000',
							fontSize: 14,
							formatter() {
								return '';
							}
						}
					}	
				]
			},
			// 客户成交比例
			customerOkPie: {
				grid: {
					left: 50
				},
				calculable: true,
				series: [{
					name: '面积模式',
					type: 'pie',
					startAngle: 0,
					radius: ["40%", "55%"],
					center: ["50%", "40%"],
					data: [
						{ value: 0, name: '老客户' },
						{ value: 0, name: '新客户' }
					],
					label: {
						normal: {
							formatter: '{b}：{d}% \n\n',
							borderWidth: 20,
							borderRadius: 4,
							padding: [0, -26],
							rich: {
								b: {
									color: '#333',
									fontSize: 12,
									lineHeight: 20
								},
								c: {
									fontSize: 12,
									lineHeight: 20,
									color: '#333'
								}
							}
						}
					},
					labelLine: {
						length: 20,
						length2: 20
					}
				}],
				top: 150,
				color: [
					'rgb(93, 202, 77)',
					'rgb(88, 176, 250)'
				],
			},
			// 客户金额比例
			customerMoneyPie: {
				calculable: true,
				series: [{
					name: '面积模式',
					type: 'pie',
					startAngle: 0,
					radius: ["40%", "55%"],
					center: ["50%", "40%"],
					data: [
						{ value: 0, name: '老客户' },
						{ value: 0, name: '新客户' }
					],
					label: {
						normal: {
							formatter: ' {b}：{d}% \n\n',
							borderWidth: 20,
							borderRadius: 4,
							padding: [0, -28],
							rich: {
								b: {
									color: '#333',
									fontSize: 12,
									lineHeight: 20
								},
								c: {
									fontSize: 12,
									lineHeight: 20,
									color: '#333'
								}
							}
						}
					},
					labelLine: {
						length: 20,
						length2: 20
					}
				}],
				top: 150,
				color: [
					'rgb(93, 202, 77)',
					'rgb(88, 176, 250)'
				],
			}
		};
	},
	methods: {
	}
};

