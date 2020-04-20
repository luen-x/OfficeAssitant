<template>
	<div>
		<div class="c-detail-title g-flex g-ai-c">
			<span 
				v-if="type === 'expand'"
				class="g-m-l-20 g-c-black-dark g-pointer"
				@click="handleToggle" 
			>
				<i 
					:class="show ? 'icon-triangle-up' : 'icon-triangle-down'" 
					class="iconfont g-fs-12 g-c-black-mid g-m-r-10"
				/>
			</span>
			<slot name="title" class="_right" />
		</div>
		<vc-expand
			v-if="type === 'expand'"
			ref="expand"
			v-model="show"
		>
			<slot name="content"/>
		</vc-expand>
		<slot v-else name="content"/>
	</div>
</template>

<script>
import { Expand } from 'wya-vc';

export default {
	name: 'sc-detail-title',
	components: {
		'vc-expand': Expand,
	},
	props: {
		title: String,
		type: String,
		showType: Boolean,
		showButton: Boolean,
		auditList: Array
	},
	data() {
		return {
			show: this.showType || true
		};
	},
	methods: {
		handleToggle() {
			this.$refs.expand.toggle();
		}
	}
};
</script>

<style lang="scss" >
.c-detail-title {
	position: relative;
	left: -12px;
	._left {
		background: #e84854;
		width: 2px;
		height: 14px;
		display: inline-block;
		margin-right: 10px;
	}
	._right {
		color: #4b4f54;
		font-size: 14px;
	}
	._batch {
		position: absolute;
		right: 0;
	}
}
</style>


