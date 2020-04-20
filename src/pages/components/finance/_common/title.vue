<template>
	<div>
		<div v-if="type !== 'expand'" class="c-detail-title g-flex g-jc-sb">
			<div class="g-flex g-ai-c">
				<span class="_left" />
				<span class="_right">
					<slot name="title" />
				</span>
			</div>
			<div>
				<slot name="extra" />
			</div>
		</div>
		<div v-else class="_expand-title g-flex g-jc-sb">
			<div>
				<span 
					class="g-c-black-dark g-pointer"
					@click="handleToggle" 
				>
					<i 
						:class="show ? 'icon-triangle-up' : 'icon-triangle-down'" 
						class="iconfont g-fs-12 g-c-black-mid"
					/>
				</span>
				<span class="_right g-m-l-20">
					<slot name="title" />
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
			style="padding: 0 40px 45px; background: #FAFAFA;"
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
	left: -12px;
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
._expand-title {
	background: #F0F4FC;
	padding: 15px 20px;
}
</style>


