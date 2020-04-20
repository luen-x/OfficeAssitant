<template>
	<div class="v-sale-customer-intention-test g-pd-20 g-m-b-30">
		<h2>galary</h2>
		<!-- <oa-galary /> -->

		<h2>抢资料组件</h2>
		<i-button @click="handleGrab"> 抢资料</i-button>
		<i-button @click="handleGrabResult"> 抢资料结果</i-button>
		<i-button @click="handleAddAttention">添加关注</i-button>
		<h2>文件上传组件Upload</h2>
		<h4>未上传</h4>
		<oa-upload v-model="files1" placeholder="请上传凭证请上传凭证请上传凭证请上传凭证"/><br>
		<h4>已上传</h4>
		<oa-upload v-model="files2" placeholder="请上传凭证请上传凭证请上传凭证请上传凭证"/><br>
		<h4>禁用状态（只查看）</h4>
		<oa-upload v-model="files3" disabled placeholder="请上传凭证请上传凭证请上传凭证请上传凭证"/><br>
		<h4>无文件时禁用状态</h4>
		<oa-upload v-model="files4" disabled placeholder="请上传凭证请上传凭证请上传凭证请上传凭证"/><br>
		<h4>无title</h4>
		<oa-upload v-model="files2" :show-title="false" placeholder="请上传凭证请上传凭证请上传凭证请上传凭证"/><br>
		<h4>无提示</h4>
		<oa-upload v-model="files2" /><br>

		<h2>自定义的滚动条</h2>
		<div class="g-dark-scroll g-dp-ib g-m-r-10" style="height:100px;width:300px;overflow:auto">
			<div>
				实打实的阿森大是的啊实打实的阿森大是的啊实打实的阿森大是的啊实打实的阿森大是的啊实打实的阿森大是的啊实打实的阿森大是的啊实打实的阿森大是的啊实打实的阿森大是的啊
				实打实的阿森大是的啊实打实的阿森大是的啊实打实的阿森大是的啊v实打实的阿森大是的啊实打实的阿森大是的啊实打实的阿森大是的啊实打实的阿森大是的啊实打实的阿森大是的啊
				实打实的阿森大是的啊实打实的阿森大是的啊实打实的阿森大是的啊实打实的阿森大是的啊实打实的阿森大是的啊实打实的阿森大是的啊
				实打实的阿森大是的啊实打实的阿森大是的啊实打实的阿森大是的啊实打实的阿森大是的啊实打实的阿森大是的啊实打实的阿森大是的啊
			</div>
		</div>
		<div class="g-blue-scroll g-dp-ib g-m-r-10" style="height:100px;width:300px;overflow:auto">
			<div>
				实打实的阿森大是的啊实打实的阿森大是的啊实打实的阿森大是的啊实打实的阿森大是的啊实打实的阿森大是的啊实打实的阿森大是的啊实打实的阿森大是的啊实打实的阿森大是的啊
				实打实的阿森大是的啊实打实的阿森大是的啊实打实的阿森大是的啊v实打实的阿森大是的啊实打实的阿森大是的啊实打实的阿森大是的啊实打实的阿森大是的啊实打实的阿森大是的啊
				实打实的阿森大是的啊实打实的阿森大是的啊实打实的阿森大是的啊实打实的阿森大是的啊实打实的阿森大是的啊实打实的阿森大是的啊
				实打实的阿森大是的啊实打实的阿森大是的啊实打实的阿森大是的啊实打实的阿森大是的啊实打实的阿森大是的啊实打实的阿森大是的啊
			</div>
		</div>
		<h2>标题 Title</h2>
		<div><oa-title>标题</oa-title></div>
		<div><oa-title title="标题"/></div>
		<div><oa-title mode="red">标题</oa-title></div>
		<br>
		<h2>详情显示条 InfoItem</h2>
		<oa-info-item label="标题" content="内容"/>
		<oa-info-item label="长文本内容" content="长文本内容内容内容内容内容内容内容内容内容"/>
		<oa-info-item label="长文本悬浮" content="长文本悬浮 内容内容内容内容内容内容内容内容内容" tooltip/>
		<oa-info-item label="自定义宽度" width="600px" content="自定义宽度 长文本内容内容内容内容内容内容内容容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内内容内容内容内容内容内容内容内容内容内容内容"/>
		<oa-info-item :content="files2" label="图片与文件" type="files"/>
		<br>
		<h2>详情块（组织详情条的容器） info-block</h2>
		<oa-info-block title="大标题">
			<oa-info-item label="标题" content="内容"/>
			<oa-info-item label="标题" content="内容"/>
			<oa-info-item label="标题" content="内容"/>
			<oa-info-item label="标题" content="内容"/>
		</oa-info-block>
		<br>
		<oa-info-block title="大标题（可展开）" expandable>
			<oa-info-item label="标题" content="内容"/>
			<oa-info-item label="标题" content="内容"/>
			<oa-info-item label="标题" content="内容"/>
			<oa-info-item label="标题" content="内容"/>
		</oa-info-block>
		<br>
		<oa-info-block title="大标题 插入自定义内容">
			<span slot="extra" class="g-operation">标签1</span>
			<oa-info-item label="标题" content="内容"/>
			<oa-info-item label="标题" content="内容"/>
			<oa-info-item label="标题" content="内容"/>
			<oa-info-item label="标题" content="内容"/>
		</oa-info-block>
		<br>
		无标题
		<oa-info-block :show-title="false">
			<oa-info-item label="标题" content="内容"/>
			<oa-info-item label="标题" content="内容"/>
			<oa-info-item label="标题" content="内容"/>
			<oa-info-item label="标题" content="内容"/>
		</oa-info-block>

		<h2>确认弹窗 Confirm</h2>
		<i-button @click="handleConfirm({title:'提示',msg:'确认删除？'})">普通确认</i-button>
		<i-button @click="handleConfirm({title:'提示',msg:'你是认真的吗？',showIcon:true,status:'success'})">带图标确认 success</i-button>
		<i-button @click="handleConfirm({title:'提示',msg:'你是认真的吗？',showIcon:true,status:'error'})">带图标确认 error</i-button>
		<i-button @click="handleConfirm({title:'提示',msg:'你是认真的吗？',showIcon:true,status:'question'})">带图标确认 question</i-button>
		<i-button @click="handleConfirm({title:'提示',msg:'你是认真的吗？',showIcon:true,status:'info'})">带图标确认 info</i-button>
		<i-button @click="handleConfirm({title:'提示',msg:'你是认真的吗？',showIcon:true,status:'info',okText:'知道了',cancelText:'不是'})">自定义底部按钮</i-button>
		<i-button @click="handleConfirm2">自定义确认内容</i-button>
		<vc-echarts
			ref="chart"
			:options="chartOption"
			:auto-resize="true"
			style="height:600px;"
		/>
		<transition name="g-transition-fade">
			<span v-if="showFade" class="g-transition-fade-item" style="background:blue;">测试测试测试</span>

		</transition>
		<i-button @click="showFade=!showFade">fade</i-button>
		<div class="g-flex">
			<transition-group 
				tag="div" 
				class="g-m-r-20" 
				name="g-transition-fade"
				style="min-height:50px;padding:10px;border:1px solid"
				@drop.native="handleDrop($event,{},arr1,0)"
				@dragover.native.prevent

			>
				
				<div 
					v-for="(item,index) in arr1" 
					:key="item.value"
					:style="{opacity:(dragingItem && (dragingItem.value===item.value))?'0.1':'1'}"
					class="g-transition-fade-item"
					draggable 
					@dragstart="handleDragStart($event,item,arr1,index)"
					@dragenter="handleDragEnter($event,item,arr1,index)"
					@dragend="handleDragEnd"
					@dragover.prevent >
					{{ item.label }}
				</div>
				
			</transition-group >

			<transition-group 
				tag="div" 
				class="g-m-r-20" 
				name="g-transition-fade" 
				style="min-height:50px;padding:10px;border:1px solid"
				@drop.native="handleDrop($event,{},arr2,0)"
				@dragover.native.prevent
			>
				<div 
					v-for="(item,index) in arr2" 
					:key="item.value" 
					:style="{opacity:(dragingItem && (dragingItem.value===item.value))?'0.1':'1'}"
					class="g-transition-fade-item"
					draggable 
					@dragstart="handleDragStart($event,item,arr2,index)"
					@dragenter="handleDragEnter($event,item,arr2,index)"
					@dragend="handleDragEnd"
					@dragover.prevent >
					{{ item.label }}
				</div>

			</transition-group>
			

		</div>
		<i-button @click="list.push('A'+list.length)">add</i-button>
		<i-button @click="list.pop()">reduce</i-button>
		<transition-group tag="div" name="g-transition-fade" class="g-relative" >
			<div v-for="(item,index) in list" :key="item" class="g-dp-ib" @click="list.splice(index,1)">{{ item }}ZZZ</div>
		</transition-group>

		<!-- <i-button @click="insertWf">add</i-button>
		<div class="_waterfall">
			<span v-for="(item,index) in wf" :key="index" :style="{width:'100px',height:item.height+'px'}" class="_wf-item">{{ item.name }}</span>
		</div> -->
		<oa-graph/>

	</div>
</template>

<script>
import Vue from 'vue';
import { SortList, Echarts } from 'wya-vc';
import { Button } from 'iview';
import Upload from '@common/upload/upload';
import Title from '@common/title/title';
import { GrabCustomer } from '@components/sale/_common/customer/grab-customer';
import { GrabResult } from '@components/sale/_common/customer/grab-result';
import { AddAttention } from '@components/sale/customer-intention-add/add-attention';
import InfoItem from "@common/info-item/info-item";
import InfoBlock from "@common/info-block/info-block";
import { Confirm } from "@common/confirm/confirm";

import Galary from './galary/galary';
import Photo from "./galary/photo";
import Graph from './graph';

export default {
	name: 'oa-tpl',
	components: {
		'oa-upload': Upload,
		'i-button': Button,
		'oa-title': Title,
		'oa-info-item': InfoItem,
		'oa-info-block': InfoBlock,
		"vc-echarts": Echarts,
		'oa-galary': Galary,
		'oa-photo': Photo,
		'vc-sort-list': SortList,
		'oa-graph': Graph



		
	},
	data() {
		const wf = [];
		for (let i = 0; i < 10; i++) {
			wf.push({ height: parseInt(Math.random() * 100, 10), name: i });
		}
		return {
			list: [],
			showFade: true,
			wf,
			files1: [],
			files2: [
				'http://wyatest.oss-cn-hangzhou.aliyuncs.com/20191217/16565534502b7208ae8.xlsx',
				'http://wyatest.oss-cn-hangzhou.aliyuncs.com/20191217/165632897e43acf8887.xmind',
				'http://wyatest.oss-cn-hangzhou.aliyuncs.com/20191217/165651437b398698b4e.png',
				'http://wyatest.oss-cn-hangzhou.aliyuncs.com/20191217/165651437b398698b4e.xls',
				'http://wyatest.oss-cn-hangzhou.aliyuncs.com/20191217/165651437b398698b4e.doc'
			],
			files3: [
				'http://wyatest.oss-cn-hangzhou.aliyuncs.com/20191217/16565534502b7208ae8.xlsx',
				'http://wyatest.oss-cn-hangzhou.aliyuncs.com/20191217/165632897e43acf8887.xmind',
				'http://wyatest.oss-cn-hangzhou.aliyuncs.com/20191217/165651437b398698b4e.png',
				'http://wyatest.oss-cn-hangzhou.aliyuncs.com/20191217/165651437b398698b4e.xls',
				'http://wyatest.oss-cn-hangzhou.aliyuncs.com/20191217/165651437b398698b4e.doc'

			],
			files4: [],
			chartOption: this.getChartOption(),
			arr1: [{ label: 'A', value: 1, }, { label: 'B', value: 2, }, { label: 'C', value: 3, }, { label: 'D', value: 4, }],
			arr2: [{ label: 'AA', value: 11, }, { label: 'BB', value: 22, }, { label: 'CC', value: 33, }, { label: 'DD', value: 44, }],
			dragingItem: undefined,

			
			 
		};
	},
	beforeCreate() {

	},
	created() {
		setTimeout(() => {
			this.addChartListener();
			
		}, 1000);
	},
	methods: {
		insertWf() {
			this.wf.push({ height: parseInt(Math.random() * 100, 10) });

		},
		handleDragStart(event, item, arr, index) {
			// event.dataTransfer.setData('item', item);
			this.dragingItem = item;
			this.fromArr = arr;
			this.fromIndex = index;
			// event.dataTransfer.effectAllowed = "move";
			event.target.style.opacity = 0.1;

		},
		handleDragEnter(event, item, arr, index) {

			if (this.dragingItem.value === item.value) return;
			const arr2 = [...arr];
			const arrs = [this.arr1, this.arr2];
			arrs.forEach(list => {
				for (let i = 0; i < list.length; i++) {
					if (list[i].value === this.dragingItem.value) {
						list.splice(i, 1);
						i--;
					}
				}
			});
			// this.fromArr = this.fromArr.filter(i => i.value !== this.dragingItem.value);

			const index2 = arr2.findIndex(i => i.value === item.value);
			arr.splice(index2, 0, this.dragingItem);

		},
		handleDragEnd(event) {

			event.target.style.opacity = 1;
			this.dragingItem = undefined;
			this.fromArr = undefined;

		},
		handleDrop(event, item, arr, index) {

			if (arr.find(i => i.value == this.dragingItem.value)) return;
			const arrs = [this.arr1, this.arr2];
			arrs.forEach(list => {
				for (let i = 0; i < list.length; i++) {
					if (list[i].value === this.dragingItem.value) {
						list.splice(i, 1);
						i--;
					}
				}
			});
			arr.push(this.dragingItem);

			// let data = event.dataTransfer.getData('item');
			// this.dragingItem;
			// event.target.style.opacity = 1;
			//  this.fromArr.splice(this.fromIndex, 1);
			// arr.splice(index, 0, this.dragingItem);



		},
		handleClick() {
			this.files2 = ['http://wyatest.oss-cn-hangzhou.aliyuncs.com/20191217/165651437b398698b4e.doc'];
		},
		handleGrab() {
			GrabCustomer.popup({ 
				customerList: [
					{ company_name: 'xxxxxx公司', customer_id: 1 },
					 { company_name: 'yyyyyy公司', customer_id: 2 }
					//  { company_name: 'xxxxxx公司', customer_id: 3 },
					//  { company_name: 'yyyyyy公司', customer_id: 4 },
					//  { company_name: 'xxxxxx公司', customer_id: 5 },
					//  { company_name: 'yyyyyy公司', customer_id: 6 }
				] 
			});

		},
		handleGrabResult() {
			GrabResult.popup({
				list: [
					{ company_name: 'xxxxxx公司', customer_id: 1, status: 1 },
					 { company_name: 'yyyyyy公司', customer_id: 2, status: 1 },
					 { company_name: 'xxxxxx公司', customer_id: 3, status: 1 },
					 { company_name: 'yyyyyy公司', customer_id: 4, status: 2 },
					 { company_name: 'xxxxxx公司', customer_id: 5, status: 2 },
					 { company_name: 'yyyyyy公司', customer_id: 6, status: 2 }
				]
			});

		},
		handleAddAttention() {
			AddAttention.popup({
				msg: '客户ccccc已被YYY领取，预计121212312掉入公海',
				customerId: 234245,
			});
		},
		handleConfirm(opt) {
			Confirm.popup(opt);
		},
		handleConfirm2() {
			Confirm.popup({ title: '提示', renderContent: (h) => <div><h2 class="g-c-red-mid">你是认真的吗</h2></div> });
		},
		addChartListener() {
			this.$refs.chart.chart.on('click', function (param) {
				console.log(param);// 这里根据param填写你的跳转逻辑
			});

		},
		getChartOption() {
			const graph = { 
				nodes: [{ id: "0",
					name: "name0",
					itemStyle: null,
					symbolSize: 10,
					x: null,
					y: null,
					attributes: { modularity_class: 0 },
					value: 11,
					category: 0,
					draggable: true 
				},
				{ id: "1",
					name: "name1",
					itemStyle: null,
					symbolSize: 10,
					x: null,
					y: null,
					attributes: { modularity_class: 0 },
					value: 12,
					category: 1,
					draggable: true 
				}, { id: "2",
					name: "name2",
					itemStyle: null,
					symbolSize: 10,
					x: null,
					y: null,
					attributes: { modularity_class: 0 },
					value: 13,
					category: 3,
					draggable: true 
				}],
				links: [{ id: "0",
					name: null,
					source: "1",
					target: "0",
					lineStyle: { normal: {} },
					// value: 10,
				},
				{ id: "1",
					name: null,
					source: "1",
					target: "2",
					lineStyle: { normal: {} },
					// value: 20,
				},
				{ id: "3",
					name: null,
					source: "0",
					target: "2",
					lineStyle: { normal: {} },
					// value: 20,
				}
				] 
			};
			let categories = [];
			for (let i = 0; i < 9; i++) {
				categories[i] = {
					name: '类目' + i
				};
			}
			graph.nodes.forEach(function (node) {
				node.symbol = "circle";
				node.itemStyle = null;
				node.symbolSize = 10;
				node.label = {
					show: true,
					// position: 'inside'
				};
				// node.value = node.symbolSize;
				// node.category = node.attributes.modularity_class;
				// Use random x, y
				node.x = null;
				node.y = null;
				// node.draggable = true;
			});
			graph.links.forEach(function (link) {
				link.value = 0; // 无效？
				link.color = "green";
				link.width = 10;
			});
			let option = {
				// symbol: "arrow",
				// symbolSize: 30,
				title: {
					text: 'Les Miserables',
					subtext: 'Default layout',
					top: 'bottom',
					left: 'right'
				},
				tooltip: {},
				focusNodeAdjacency: true,
				legend: [{
					// selectedMode: 'single',
					data: categories.map(function (a) {
						return a.name;
					})
				}],
				animation: false,
				series: [
					{
						name: 'Les Miserables',
						type: 'graph',
						layout: 'force',
						data: graph.nodes,
						links: graph.links,
						categories,
						roam: true,
						label: {
							position: 'right'
						},
						force: {
							repulsion: 100
						}
					}
				]
			};
			return option;
		}
		
	},
};
</script>

<style lang="scss" >
.v-sale-customer-intention-test {
	.g-transition-fade-enter {
		opacity: 0;
		transition:all .5s ease;
	}
	.g-transition-fade-enter-active {
		transition:all .5s ease;
	}
	.g-transition-fade-move {
		transition:all .5s ease;
	}
	.g-transition-fade-leave {
		position: absolute;
		transition:all .5s ease;
	}
	.g-transition-fade-leave-active {
		position: absolute;
		transition:all .5s ease;
	}
	.g-transition-fade-leave-to {
		position: absolute;
		transition:all .5s ease;
		opacity: 0;
	}
	
	._waterfall {
            width: 1200px;
            margin: 0 auto;
            column-count: 4;
            column-gap: 1;
    }
	._wf-item {
		background: lightblue;
		width:100px;
		//padding: 10px 5px;
		margin-bottom: 10px;
		display: block;
		break-inside: avoid;
	}
}
</style>
