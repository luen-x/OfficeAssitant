<template>
	<div>
		<div class="c-detail-title g-flex g-jc-sb">
			<div class="g-flex g-ai-c" @click="handleToggle">
				<span class="_left" />
				<span class="_right">
					<slot name="title" />
				</span>
				<span
					v-if="type === 'expand'"
					class="g-c-black-dark g-pointer"
					style="margin-left: 5px"
				>
					<i
						:class="show ? 'icon-triangle-up' : 'icon-triangle-down'"
						class="iconfont g-fs-12 g-c-black-mid"
					/>
				</span>
			</div>
			<div>
				<slot name="extra" />
			</div>
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
	name: 'finance-detail-title',
	components: {
		'vc-expand': Expand,
	},
	props: {
		title: String,
		type: String,
		showType: Boolean
	},
	data() {
		return {
			show: this.showType || false
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
	._left {
		background: #e84854;
		width: 2px;
		height: 14px;
		display: inline-block;
		margin-right: 10px;
	}
	._right {
		color: #333;
		font-size: 14px;
	}
}
</style>


