<template>
	<div :style="{border: border?'1px solid #d4d7db':'none'}" class="c-components-common-expand-panel g-m-t-10">
		<div
			:style="{borderBottom:show&&border?'1px solid #d4d7db':'none'}"
			class="g-bg-light3 g-c-black3 g-pd-10 _expand-top"
			@click="handleToggle">
			<div class="g-fr">
				<slot name="extra"/>
			</div>
			<i
				:class="show?'icon-triangle-down':'icon-triangle-right'"
				class="iconfont g-fs-12 g-c-black-dark"/>
			<div style="display: inline-block">
				<slot name="header"/>
			</div>
		</div>
		<vc-expand ref="expand" v-model="show" style="background:#FAFAFA" >
			<slot/>
		</vc-expand>
	</div>
</template>

<script type="text/ecmascript-6">
import { Expand } from 'wya-vc';

export default {
	components: {
		'vc-expand': Expand,
	},
	props: {
		value: {
			type: Boolean,
			default() {
				return true;
			}
		},
		border: {
			type: Boolean,
			default() {
				return true;
			}
		}
	},
	data() {
		return {
			show: this.value,
		};
	},
	watch: {
		value(v) {
			if (v != this.show) { this.$refs.expand.toggle(); }
		}
	},
	methods: {
		handleToggle() {
			this.$refs.expand.toggle();
			this.$emit('input', this.show);
		},
	}
};
</script>

<style scoped lang="">
</style>
