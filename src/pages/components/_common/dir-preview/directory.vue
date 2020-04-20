<template>
	<div class="c-dir-preview-directory  g-flex g-fd-c">
		<div class="g-col" style="overflow: auto;">
			<slot :active-value="activeNodeValue" name="top" />
			<i-tree ref="tree" :data="rebuildData" />
		</div>
	</div>
</template>
<script>
import { Input, Button, Tree, Tooltip } from 'iview';
import { cloneDeep } from 'lodash';

export default {
	name: 'oa-toolkit-directory',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-tree': Tree
	},
	props: {
		data: Array,
		formater: Function,
		// treeRender: Function,
		titleKey: String,
		valueKey: String,
		value: [Number, String]
	},
	data() {
		return {
			rebuildData: [],
			activeNodeValue: this.value,
		};
	},
	watch: {
		data(newVal) {
			this.rebuildData = this.getRebuildData();
		},
		value(val) {
			this.activeNodeValue = val;
		}
	},
	mounted() {
		if (this.data.length) {
			this.rebuildData = this.getRebuildData();
		}
		// setTimeout(() => {
		// 	this.expand({ value: 17 });
		// }, 1000);
	},
	methods: {
		getRebuildData() {
			const dataCopy = cloneDeep(this.data);
			this.formatData(dataCopy);
			return dataCopy;
		},
		formatData(data) {
			for (let index = 0; index < data.length; index++) {
				if (this.formater) {
					data[index] = this.formater[data[index]];
				} else if (this.titleKey && this.valueKey) {
					data[index] = this.defaultFormater(data[index]); 
				}
				if (!data[index].render) data[index].render = this.treeRender;
				if (data[index].children && data[index].children.length) {
					this.formatData(data[index].children);
				}
			}
		},
		defaultFormater(item) {
			item = { ...item };
			item.title = item[this.titleKey];
			item.value = item[this.valueKey];
			item.expand = false;
			return item;
		},
		treeRender(h, param) {
			return (
				<div 
					class={{ "_item g-pointer": true, "_item-active": param.data.value == this.activeNodeValue }} 
					style={!param.data.children && 'padding-left: 0'}
					onClick={(event) => this.handleClickNode(param)} 
				>
					{param.data.children && param.data.children.length ? (
						<i 
							onClick={(event) => this.handleClickArrow(param, event)} 
							class={`icon iconfont icon-triangle-right g-fs-12`}
							style={`display: inline-block;transition: transform .1s linear;${
								param.node.node.expand ? 'transform: rotate(90deg);' : ""
							}`}
						/>
					) : <span style="margin-left: 7px;"></span>}
					{
						param.data.title.length > 15 ? <Tooltip
							content={param.data.title}
							maxWidth="250"
						>
							<span class="g-m-l-5">{param.data.title.substr(0, 15) + '...'}</span>
						</Tooltip> : <span class="g-m-l-5">{param.data.title}</span>
					}
				</div>
			);
		},
		handleClickNode(param) {
			this.activeNodeValue = param.data.value;
			this.$emit('input', this.activeNodeValue);
			this.$emit('click-node', param);
		},
		handleClickArrow(param, event) {
			event.stopPropagation();
			this.$set(param.node.node, 'expand', !param.node.node.expand);
		},
		findNode(data, value) {
			for (let i = 0; i < data.length; i++) {
				if (data[i].value === value) {
					return data[i];
				}
				if (data[i].children && data[i].children.length) {
					const exist = this.findNode(data[i].children, value);
					if (exist) return exist;
				}
			}
		},
		goParent() {
			const curNode = this.findNode(this.rebuildData, this.activeNodeValue);
			if (curNode && curNode.pid) {
				const parentNode = this.findNode(this.rebuildData, curNode.pid);
				if (parentNode) this.handleClickNode({ data: parentNode });
			}
		},
		expand({ value }) {
			const chain = this.findNodeChain(value);
			if (chain && chain.length) {
				chain.forEach(item => item.expand = true);
				this.activeNodeValue = chain[chain.length - 1].value;
				// this.$emit('input', this.activeNodeValue);
			}
		},
		findNodeChain(value, data = this.$refs.tree.stateTree, result = []) {
			for (let i = 0; i < data.length; i++) {
				const resultCopy = [...result, data[i]];
				if (data[i].value === value) {
					return resultCopy; 
				} else if (data[i].children && data[i].children.length) {
					const exist = this.findNodeChain(value, data[i].children, resultCopy);
					if (exist) return exist;
				}
				
			}
			// this.$refs.tree.stateTree.forEach(item => {
			// 	item.expand = true;
			// });

		}
	}
};
</script>
<style lang="scss">
.c-dir-preview-directory {
	background-color: #fff;
	padding-top: 10px;
	.ivu-tree {
		width: 100%;
		._item {
			line-height: 40px;
			font-size: 14px;
			padding-left: 10px;
			padding-right: 20px;
			&:hover {
				color: rgb(35, 151, 249);
			}
			&._item-active {
				color: rgb(35, 151, 249);
				background: rgba(35, 151, 249,0.1);	
			}
		}
		ul li {
			margin: 0;
		}
	}
	.ivu-tree-arrow {
		display: none;
	}
	.ivu-tree-empty {
		text-align: center;
		line-height: 30px;
	}
}
</style>