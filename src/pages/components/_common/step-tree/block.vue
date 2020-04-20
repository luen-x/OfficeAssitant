<template>
	<div 
		:style="{width:outSize,height:outSize,padding:size/6+'px'}"
		class="c-tree-step-block"
	>	
		<template v-if="!hideInner">
			<!-- 线条都按顺时针排 -->
			<div 
				v-if="outTen[0]" 
				:style="{width:'1px',height:size/6 + 'px',left:size/2+'px',background:lineColor}" 
				class="_ten g-absolute" 
				style="top:0px"
			/>
			<div 
				v-if="outTen[1]" 
				:style="{width:size/6 + 'px',height:'1px',top:size/2+'px',background:lineColor}" 
				class="_ten g-absolute" 
				style="right:0;" 
			/>
			<div 
				v-if="outTen[2]" 
				:style="{width:'1px',height:size/6 + 'px',left:size/2+'px',background:lineColor}" 
				class="_ten g-absolute" 
				style="bottom:0"
			/>
			<div 
				v-if="outTen[3]" 
				:style="{width:size/6 + 'px',height:'1px',top:size/2+'px',background:lineColor}" 
				class="_ten g-absolute" 
				style="left:0;" 
			/> 

			<div v-if="border[0]" :style="{width:borderSize,height:'1px',background:lineColor}" class="g-absolute _border" style="left:0;top:0px" /> 
			<div v-if="border[1]" :style="{width:borderSize,height:'1px',background:lineColor}" class="g-absolute _border" style="right:0;top:0px"/>
			<div v-if="border[2]" :style="{width:'1px',height:borderSize,background:lineColor}" class="g-absolute _border" style="right:0;top:0"/>
			<div v-if="border[3]" :style="{width:'1px',height:borderSize,background:lineColor}" class="g-absolute _border" style="right:0;bottom:0"/>
			<div v-if="border[4]" :style="{width:borderSize,height:'1px',background:lineColor}" class="g-absolute _border" style="right:0;bottom:0"/> 
			<div v-if="border[5]" :style="{width:borderSize,height:'1px',background:lineColor}" class="g-absolute _border" style="left:0;bottom:0"/>
			<div v-if="border[6]" :style="{width:'1px',height:borderSize,background:lineColor}" class="g-absolute _border" style="left:0px;bottom:0"/>
			<div v-if="border[7]" :style="{width:'1px',height:borderSize,background:lineColor}" class="g-absolute _border" style="left:0px;top:0px"/>
		</template>
		<div v-if="!hideInner" :style="{width:innerSize,height:innerSize}" class="_inner" style="background:lightblue" >
			<slot name="inner" />
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
		border: {
			type: Array,
			default: () => [0, 0, 0, 0, 0, 0, 0, 0]
		},
		outTen: {
			type: Array,
			default: () => [0, 0, 0, 0]

		},
		hideInner: Boolean,
		size: {
			type: Number,
			default: 150
		},
		lineColor: {
			type: String,
			default: 'dodgerblue'
		}

		

	},
	data() {
		return {
			
			
		};
	},
	computed: {
		outSize() {
			return this.size + 'px';
		},
	
		innerSize() {
			return this.size / 3 * 2 + 'px';
		},
		borderSize() {
			return this.size / 2 + 'px';
		},
		


	},
	methods: {
	}
};
</script>
<style lang="scss">
.c-tree-step-block {
	display:inline-block;
	position: relative;
	background:rgb(245, 245, 246);
}
</style>