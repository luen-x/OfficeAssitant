<template>
	<div class="v-sale-main-service-popup-head-item g-flex g-m-t-20">
		<div style="white-space: nowrap;">{{ labels }}：</div>
		<div class="g-c-black2">
			<slot>
				{{ values }}
			</slot>
		</div>
	</div>
</template>

<script>
export default {
	components: {

	},
	props: {
		labels: {
			type: String,
			default: '标签'
		},
		values: {
			type: [String, Number],
			default: '内容'
		}
	},
	data() {
		return {

		};
	},
};
</script>

<style  lang="scss">
	.v-sale-main-service-popup-head-item{
		width:229.5px;
	}
</style>
