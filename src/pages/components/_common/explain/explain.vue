<template>
	<i-poptip 
		v-if="type === 'icon'"
		:trigger="trigger"
		:title="title"
		:content="content"
		:placement="placement"
		:width="width"
		:transfer="transfer"
		:word-wrap="true"
		popper-class="c-explain-icon"
	>
		<slot v-if="$slots.default" />
		<i 
			v-else
			:class="`iconfont g-pointer icon-${icon}`" 
			:style="{color: color || '#c5c5c7'}"
			style="font-size: 13px" 
		/>
		<slot v-if="$slots.content" slot="content" name="content"/>
	</i-poptip>
	<div 
		v-else 
		:style="{padding: isExpand ? '10px 0' : '2px 0'}" 
		class="c-explain-collapse g-pointer"
	>
		<div 
			:class="isExpand ? '_content-block g-flex-ac' : '_content-line'" 
			style="width: 100%" 
			@click="handleToggle"
		>
			<i 
				:class="`iconfont g-fs-12 icon-${isExpand ? 'pack-down' : 'pack-up'}`" 
				style="color: #bfbfc7; margin-right: 4px; transform: translateY(1px)" 
			/>
			<div v-show="isExpand">
				<span v-if="title" class="g-c-black2 g-m-r-20">{{ title }}</span>
				<span class="g-c-black4">{{ content }}</span>
			</div>
		</div>
	</div>
</template>

<script>
import { Poptip } from "iview";

export default {
	name: 'c-explain',
	components: {
		'i-poptip': Poptip
	},
	props: {
		type: {
			type: String,
			default: 'icon',
			validator(value) {
				return ['collapse', 'icon'].indexOf(value) !== -1;
			}
		}, 
		trigger: {
			type: String,
			default: 'hover'
		},
		title: String,
		content: String,
		placement: {
			type: String,
			default: 'bottom'
		},
		width: {
			type: Number,
			default: 230
		},
		transfer: {
			type: Boolean,
			default: true
		},
		wordWrap: Boolean,
		icon: {
			type: String,
			default: 'info'
		},
		color: String
	},
	data() {
		return {
			isExpand: true
		};
	},
	computed: {

	},
	watch: {
		
	},
	created() {

	},
	methods: {
		handleToggle() {
			this.isExpand = !this.isExpand;
		}
	},
};
</script>

<style lang="scss">
.c-explain-icon {
	.ivu-poptip-title:after {
		display: none !important;
	}
	.ivu-poptip-title {
		padding: 8px 10px 0px 10px !important;
		line-height: 18px !important;
	}
	.ivu-poptip-title-inner {
		font-size: 12px !important;
		color: #333333 !important;
		white-space: normal;
	}
	.ivu-poptip-body {
		padding: 6px 10px 8px 10px !important;
		color: #8c909c !important;
		line-height: 18px !important;
	}
}
.c-explain-collapse {
	margin-top: -16px;
	line-height: 13px;
	transition: all .2s linear;
	._content-line {
		display: table;
		transition: all .2s linear;
		&:after {
			content: "";
			display: table-cell;
			position: relative;
			top: 50%;
			width: 100%;
			border-top: 1px solid #ececec;
			-webkit-transform: translateY(50%);
			transform: translateY(50%);
		}
	}
	._content-block {
		background-color: #fafafa;
		padding: 10px;
		transition: all .2s linear;
	}
}
</style> 
