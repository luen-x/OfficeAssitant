<template>
	<div class="v-statistic-common-panel">
		<div class="_header g-flex g-jc-sb">
			<span class="g-pd-tb-10 g-pd-l-20">
				<span class="g-c-black1 g-fs-14">{{ title }}</span>
				<slot name="more">
					<span v-if="moreLabel" class="g-operation g-m-l-20 g-fs-14" @click="$emit('more',$event)">
						{{ moreLabel }}<i class="icon iconfont icon-right g-operation"/>
					</span>
				</slot>
			</span>
			<span class="g-m-r-10">
				<slot name="extra">
					<span 
						v-for="(item,index) in tabs" 
						:class="{_tab:true,_active:item.value===curTab.value}" 
						:key="index" 
						class="" 
						@click="handleClickTab(item)">
						<span class="g-pd-lr-5">{{ item.label }}</span>
					</span>
				</slot>
			</span>
		</div>
		<div :style="'padding:'+padding" class="_content">
			<slot/>
		</div>

	</div>
</template>
<script>
import { Input, Button } from 'iview';

export default {
	name: 'oa-',
	components: {
		'i-input': Input,
		'i-button': Button,
	},
	props: {
		title: String,
		tabs: {
			type: Array, // label,value数组
			default: () => []
		},
		moreLabel: String,
		value: [String, Number],
		padding: String

	},
	data() {
		return {
			curTab: this.tabs.find(it => it.value === this.value) || this.tabs[0] || {},
		};
	},
	watch: {
		value(val) {
			this.curTab = (this.tabs.find(it => it.value === val) || {});
		}
	},
	methods: {
		handleClickTab(item) {
			if (this.curTab.value === item.value) return;
			this.curTab = item;
			this.$emit('tab-change', item);
			this.$emit('input', item.value);
		}
	}
};
</script>
<style lang="scss">
.v-statistic-common-panel {
	border-radius: 4px;
	border:1px solid #D4D7DB;
	._header {
		background: #F8F8F8;
		border-radius: 4px 0px 0px 4px;
		._tab {
			display: inline-block;
			color: #818794;
			border-bottom:#F8F8F8;
			margin-left: 15px;
			margin-right: 15px;
			font-size: 14px;
			padding-top: 10px;
			padding-bottom: 4px;
			cursor: pointer;
			&._active {
				color: #E74854;
				border-bottom: 2px solid #E74854;
			}

		}

	}
	._content {
		padding: 20px;
		
	}

}
</style>