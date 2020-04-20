<template>
	<div class="c-hr-detail-item">
		<span class="_label">{{ label }}</span>
		<div v-if="content" class="_content">
			<i-tooltip
				v-if="content.length > 19" 
				:content="content" 
				:transfer="true"
				placement="bottom"
				max-width="250"
			>
				{{ content.substr(0, 19) + "..." }}
			</i-tooltip>
			<span v-else>{{ content }}</span>
		</div>
		<div v-else class="_content">
			--
		</div>
	</div>
</template>

<script>
export default {
	name: 'hr-detail-item',
	props: {
		label: String,
		content: String
	},
	data() {
		return {

		};
	}
};
</script>

<style lang="scss">
.c-hr-detail-item {
	display: inline-block;
	border-bottom: 1px solid #e7e7e7;
	width: 350px;
	padding-bottom: 5px;
	margin-right: 50px;
	margin-bottom: 20px;
	._label {
		display: inline-block;
		color: #818794;
		width: 100px;
	}
	._content {
		display: inline-block;
		color: #333;
	}
}
</style>


