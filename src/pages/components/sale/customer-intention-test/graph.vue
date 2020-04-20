<template>
	<div>
		<vc-echarts
			ref="chart"
			:options="option"
			:auto-resize="true"
			style="height:600px;"
		/>
	</div>
</template>
<script>
import { Input, Button } from 'iview';
import { SortList, Echarts } from 'wya-vc';


export default {
	name: 'oa-',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-echarts': Echarts
	},
	data() {
		const currentGraph = {
			nodes: {},
			links: {},
		};
		return {
			defaultCategory: "中心教师",
			graphTitle: "力导向关系图--实现点击节点展开折叠",
			currentGraph,
			option: {
				title: {
					text: "力导向关系图--实现点击节点展开折叠",
					top: 'top',
					left: 'center',
				},
				tooltip: {},
				legend: [],
				animation: true,
				

				series: [{
					type: 'graph',
					layout: 'force',
					data: [{
						"name": "A",
						"value": [
							"教授",
							"在职",
							"党委办公室、校长办公室"
						],
						"category": "中心教师",
						"symbolSize": 50,
						"tooltip": {
							"formatter": "{b0}:{c0}"
						},
					}],
					links: [],
					categories: [{
						name: '中心教师',
						itemStyle: {
							color: '#c23531'
						},

					},
					{
						name: '专著专利合作教师',
						itemStyle: {
							color: '#749f83'
						},


					},
					{
						name: '课程合作教师',
						itemStyle: {
							color: '#6e7074'
						},

					},
					{
						name: '论文合作教师',
						itemStyle: {
							color: '#2f4554'
						},

					},
					{
						name: '论文',
						itemStyle: {
							color: '#61a0a8'
						},

					},
					{
						name: '专著专利',
						itemStyle: {
							color: '#91c7ae'
						},

					},
					{
						name: '课程',
						itemStyle: {
							color: '#999ea4'
						},


					},
					{
						name: '项目合作教师',
						itemStyle: {
							color: '#DEB887'
						},

					},
					{
						name: '项目',
						itemStyle: {
							color: '#bda29a'
						},

					}
					],
					roam: 'move', // scale , move, true
					focusNodeAdjacency: false,
					itemStyle: {
						normal: {
							borderColor: '#fff',
							borderWidth: 1,
							shadowBlur: 10,
							shadowColor: 'rgba(0, 0, 0, 0.3)'
						}
					},
					label: {
						position: 'inside',
						formatter: '{b}',
						show: true
					},
					lineStyle: {
						color: 'target',
						opacity: 0.6,
						curveness: 0
					},
					emphasis: {
						lineStyle: {
							width: 10
						}
					},
					force: {
						layoutAnimation: true,
						repulsion: 500,
						// initLayout: 'circular'

					}
				}]
			},
			nodeMap: {},
			allData: {
				 "nodes": [
			   {
						"name": "A",
						"value": [
							"教授",
							"在职",
							"党委办公室、校长办公室"
						],
						"category": "中心教师",
						"symbolSize": 50,
						"tooltip": {
							"formatter": "{b0}:{c0}"
						}
					},
					{
						"name": "B",
						"category": "论文",
						"value": [
							"期刊论文",
							"2005"
						],
						"symbolSize": 30,
						"tooltip": {
							"formatter": "{b0}:{c0}"
						}
					},
					{
						"name": "C",
						"category": "论文合作教师",
						"symbolSize": 50
					},

					{
						"name": "D",
						"category": "项目",
						"value": [
							"信息与通信工程学院",
							"立项日期：20131101"
						],
						"symbolSize": 30,
						"tooltip": {
							"formatter": "{b0}:{c0}"
						}
					},
					{
						"name": "N",
						"category": "项目合作教师",
						"symbolSize": 50
					},
					{
						"name": "Q",
						"category": "项目",
						"symbolSize": 30
					},
         
					{
						"name": "S",
						"category": "项目",
						"symbolSize": 30
					},
					{
						"name": "E",
						"category": "专著专利",
						"symbolSize": 30,
						"value": [
							"专利文献",
							"2009-07-21"
						],
						"tooltip": {
							"formatter": "{b0}:{c0}"
						}
					},
					{
						"name": "W",
						"category": "专著专利",
						"symbolSize": 30
					},
					{
						"name": "Y",
						"category": "专著专利",
						"symbolSize": 30
					},
					{
						"name": "Z",
						"category": "专著专利",
						"symbolSize": 30
					},
					{
						"name": "F",
						"category": "专著专利合作教师",
						"symbolSize": 50
					},
					{
						"name": "O",
						"category": "专著专利合作教师",
						"symbolSize": 50
					},
					{
						"name": "P",
						"category": "专著专利合作教师",
						"symbolSize": 50
					},
					{
						"value": [
							"信息与通信工程学院",
							"信息工程 "
						],
						"name": "G",
						"category": "课程",
						"symbolSize": 30,
						"tooltip": {
							"formatter": "{b0}:{c0}"
						}
					},
					{
						"name": "I",
						"category": "课程",
						"symbolSize": 30
					},
					{
						"name": "L",
						"category": "课程",
						"symbolSize": 30
					},
					{
						"name": "H",
						"category": "课程合作教师",
						"symbolSize": 50
					},
					{
						"name": "M",
						"category": "课程合作教师",
						"symbolSize": 50
					}
             
         
				],
				"links": [{
					"source": "A",
					"target": "B"
				},
				{
					"source": "B",
					"target": "C"
				},
				// ---
				{
					"source": "C",
					"target": "A"
				},
				{
					"source": "Z",
					"target": "C"
				},
				{
					"source": "L",
					"target": "I"
				},
				{
					"source": "G",
					"target": "Y"
				},
				{
					"source": "B",
					"target": "O"
				},
				{
					"source": "L",
					"target": "Z"
				},
				// ---
				{
					"source": "A",
					"target": "D"
				},
				{
					"source": "D",
					"target": "N"
				},
				{
					"source": "N",
					"target": "Q"
				},
				{
					"source": "N",
					"target": "R"
				},
				{
					"source": "A",
					"target": "E"
				},
				{
					"source": "E",
					"target": "F"
				},
				{
					"source": "F",
					"target": "W"
				},
				{
					"source": "F",
					"target": "Y"
				},
				{
					"source": "P",
					"target": "Z"
				},
				{
					"source": "E",
					"target": "O"
				},
				{
					"source": "E",
					"target": "P"
				},
				{
					"source": "A",
					"target": "G"
				},
				{
					"source": "G",
					"target": "H"
				},
				{
					"source": "G",
					"target": "M"
				},
				{
					"source": "M",
					"target": "I"
				},
				{
					"source": "M",
					"target": "L"
				}
				]

			},
	
		};


	},
	created() {
		


	},
	mounted() {
		setTimeout(() => {
			// this.init();
			this.$refs.chart.chart.on('click', (params) => {
				if (params.dataType === "node") {
					

					const clickNode = this.allData.nodes.find(it => it.name === params.data.name);
					
					if (!clickNode.expand) {

						const relateLinks = this.allData.links.filter(it => it.source === params.data.name || it.target === params.data.name);
						let relateNodes = relateLinks.map(link => {
							return [this.allData.nodes.find(it => it.name === link.target), this.allData.nodes.find(it => it.name === link.source)];
						
						});
						const temp = [];

						relateNodes.forEach(it => {
							temp.push(...it);
						});
						relateNodes = temp.filter(Boolean);
						const data = this.option.series[0].data;
						const links = this.option.series[0].links;
						relateNodes.forEach(node => {
							if (!data.find(it => it.name === node.name)) {
								if (!node.parentNames) {
									node.parentNames = [];
								}
								if (!clickNode.parentNames) {
									clickNode.parentNames = [];
								}
								node.parentNames = [...clickNode.parentNames, clickNode.name];
								node.expand = false;
								data.push(node);

							}
						});
						relateLinks.forEach(it => {
							if (!links.find(l => { // 

								if (!(data.find(node => node.name === it.source) && data.find(node => node.name === it.target))) return true;
								return (l.source === it.source && l.target === it.target) || (l.source === it.target && l.target === it.source);
							})) {
								links.push(it);

							}
						});
					// this.option.series = [{ data, links }];
					// this.option.series[0].data;

					// const node = this.nodeMap[params.data.name];
					// if (node.hasAppend === true) {
					// 	this.remove(node.name);
					// } else {
					// 	this.append(node.name);
					// }
					} else {
						const data = this.option.series[0].data;
						const links = this.option.series[0].links;
						const relateLink = links.filter(it => it.source === clickNode.name || it.target === clickNode.name);
						if (clickNode.name === 'A') {
							this.option.series[0].data = data.filter(it => it.name === 'A');
							this.option.series[0].links = [];
						} else {
							const newData = data.filter(it => {
								if (!it.parentNames) {
									it.parentNames = [];
								}
								
							 return !it.parentNames.includes(clickNode.name);
							});
							if (newData.length != this.option.series[0].data.length) {
								this.option.series[0].data = newData;
								this.option.series[0].links = links.filter(it => (
									this.option.series[0].data.find(node => node.name === it.source) 
									&& this.option.series[0].data.find(node => node.name === it.target)
								));
							}
						}

					}
					clickNode.expand = !clickNode.expand;
				}

			});
			
		}, 1000);
		
	},
	methods: {
		// 页面加载时，第一次初始化图
		init() {
			 const { nodeMap, graph, currentGraph, defaultCategory } = this;
			// // 根据定义的常量，产生currentGraph的默认数据
			// // 遍历全部nodes和links，产生node映射map
			// for (let i = 0; i < graph.nodes.length; i++) {
			// 	if (graph.nodes[i].category === defaultCategory) {
			// 		currentGraph.nodes[graph.nodes[i].name] = graph.nodes[i];
			// 	}
			// 	nodeMap[graph.nodes[i].name] = graph.nodes[i];
			// 	nodeMap[graph.nodes[i].name]['links'] = {};
			// 	nodeMap[graph.nodes[i].name]['nodes'] = {};
			// 	nodeMap[graph.nodes[i].name]['hasAppend'] = false;
			// }
			// for (let i = 0; i < graph.links.length; i++) {
			// 	let link = graph.links[i];
			// 	if (nodeMap[link.source] !== undefined && nodeMap[link.target] !== undefined) {
			// 		nodeMap[link.source].links[link.target] = link;
			// 		nodeMap[link.source].nodes[nodeMap[link.target].name] = nodeMap[link.target];
			// 	}
			// }
   
			for (let i = 0; i < graph.nodes.length; i++) {
				graph.nodes[i].itemStyle = null;
				graph.nodes[i].label = {
					normal: {
						show: graph.nodes[i].symbolSize > 15
					}
				};
			}
			this.redrawGraph();
		},
		// 处理点击节点展开
		append(nodeName) {
			const { nodeMap, graph, currentGraph, defaultCategory } = this;
			// 根据nodeName从nodeMap里拿出对应的nodes和links，并append到currentGraph.nodes currentGraph.links
			let node = nodeMap[nodeName];
			if (node.hasAppend === true || Object.keys(node.nodes).length === 0 || Object.keys(node.links).length === 0) {
				alert("无法继续展开");
				return;
			}
			Object.values(node.nodes).forEach(n => {
				currentGraph.nodes[n.name] = n;
			});
			Object.values(node.links).forEach(l => {
				currentGraph.links[l.source + "_" + l.target] = l;
			});
			node.hasAppend = true;
			this.redrawGraph();
		},
		// 处理点击节点收缩
		remove(nodeName) {
			const { nodeMap, graph, currentGraph, defaultCategory } = this;
			// 根据nodeName从nodeMap里拿出对应的nodes和links，从currentGraph.nodes currentGraph.links删除当前节点的nodes和links并且递归
			let node = this.nodeMap[nodeName];
			Object.values(node.nodes).forEach(n => {
				delete currentGraph.nodes[n.name];
				if (n.hasAppend === true && Object.keys(n.nodes).length > 0) {
					this.remove(n.name);
				}
			});
			Object.values(node.links).forEach(l => {
				delete currentGraph.links[l.source + '_' + l.target];
			});
			// 设置flag 等于false
			node.hasAppend = false;

			this.redrawGraph();
		},
		// 根据更新后的option重新画图
		redrawGraph() {
			// const { nodeMap, graph, currentGraph, defaultCategory } = this;
			// this.option.series[0].data = Object.values(this.currentGraph.nodes);
			// this.option.series[0].links = Object.values(this.currentGraph.links);
			// this.$refs.chart.setOption(this.option);
		}
	}

};
</script>
<style lang="scss">
</style>