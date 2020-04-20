<template>
	<div class="c-finance-detail-item">
		<div class="g-flex">
			<div class="_label">{{ label }}</div>
			<div v-if="content && content.length > 19" class="_content">
				<i-tooltip 
					:content="content" 
					:transfer="true"
					max-width="230"
				>
					{{ content.substr(0, 16) + "..." }}
				</i-tooltip>
			</div>
			<div v-else class="_content">
				<span 
					v-if="(!content && content !== undefined) || typeof content === 'object' && content == 0 ">--</span>
				<slot v-else />
			</div>
		</div>
	</div>
</template>

<script>
import { Tooltip } from 'iview';

export default {
	name: 'finance-detail-item',
	components: {
		'i-tooltip': Tooltip
	},
	props: {
		label: String,
		content: String | Array
	},
	data() {
		return {

		};
	}
};
</script>

<style lang="scss">
.c-finance-detail-item {
	display: inline-block;
	border-bottom: 1px solid #ebeef1;
	width: 340px;
	padding-top: 5px;
	padding-bottom: 5px;
	margin-right: 50px;

	._label {
		color: #818794;
		flex: 1;
	}
	._content {
		color: #333;
		flex: 2;
	}
}
</style>


