<template>
	<div class="v-auto-tooltip ">
		<i-tooltip
			v-if="showTooltip||forceShow"
			:content="content"
			:placement="placement"
			:theme="theme"
			style="width:100%;"
			transfer
		>
			<span
				ref="content"
				:style="{width}"
				:class="'_ecllips '+labelClass"
				style="position: relative;top: 0;vertical-align: bottom;"
				@click="$emit('click-label',$event)"
			>
				<slot>{{ content }}</slot>
			</span>
			<div
				slot="content"
				:style="{maxWidth:maxWidth+'px'}"
				class="g-dark-scroll"
				style="
				max-height: 300px;
				overflow-y: auto;
				white-space: normal;
				word-break: break-all;
				white-space: pre-wrap;
				margin-right:-10px;
				padding-right:5px
				"
			>{{ content }}</div>
		</i-tooltip>
		<span
			v-else
			ref="content"
			:style="{width}"
			:class="'_ecllips '+labelClass"
			style="position: relative;top: 0;vertical-align: bottom;"
			@click="$emit('click-label',$event)"
		>
			<slot>{{ content }}</slot>
		</span>
	</div>
</template>
<script>
import { Tooltip } from 'iview';

export default {
	name: 'oa-',
	components: {
		'i-tooltip': Tooltip,
	},
	props: {
		content: String,
		width: {
			type: String,
			default: 'inherit'
		},
		maxWidth: {
			type: Number,
			default: 300
		},
		placement: {
			type: String,
			default: 'top'
		},
		theme: {
			validator(value) {
				return ['dark', 'light'].includes(value);
			},
			default: 'light'
		},
		labelClass: {
			type: String,
			default: 'g-operation'
		},
		show: true,
		forceShow: false
	},
	data() {
		return {
			showTooltip: false
		};
	},
	computed: {
	},
	watch: {
		content: {
			handler() {
				this.updateShowTooltip();
			},
			immediate: true
		},
		show() {
			this.updateShowTooltip();
		}
	},
	mounted() {

	},
	methods: {
		updateShowTooltip() {
			setTimeout(() => {
				this.$nextTick(() => {
					const $content = this.$refs.content;
					if (!$content) this.showTooltip = false;
					else this.showTooltip = $content.scrollWidth > $content.offsetWidth;
				});
			}, 100);
		}
	}
};
</script>
<style lang="scss">
.v-auto-tooltip {
	display: inline-block;
	position:relative;
	width:100%;
	._ecllips {
		display: inline-block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}

</style>