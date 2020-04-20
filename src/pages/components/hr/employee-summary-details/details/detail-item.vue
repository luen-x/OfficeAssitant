<template>
	<div class="v-hr-detail-items">
		<div class="_titles">
			<slot name="title" />
		</div>
		<div class="g-flex">
			<span class="_label">
				{{ label }}
				<slot name="explain" />
			</span>
			<div :class="{'_content':true,'g-operation' : operation }">
				<template v-if="$slots.default[0].text ||$slots.default[0].tag">
					<slot />
				</template>
				<span v-else>--</span>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "hr-detail-item",
	props: {
		label: String,
		operation: String
	},
	data() {
		return {
		};
	}
};
</script>

<style lang="scss" scoped>
.v-hr-detail-items {
	display: inline-block;
	border-bottom: 1px solid #e7e7e7;
	min-width: 350px;
	margin-right: 50px;
	min-height: 40px;
	padding-bottom: 14px;
	._label {
		display: inline-block;
		color: #818794;
		min-width: 100px;
		max-width: 100px;
	}
	._content {
		display: inline-block;
		color: #333;
	}
	._titles {
		display: inline-block;
		color: #d9444f;
	}
}
</style>


