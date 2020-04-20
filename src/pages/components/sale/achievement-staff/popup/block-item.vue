<template>
	<div class="c-sale-achievement-staff-block-item g-flex g-m-t-20" style="width:50%">
		<div class="g-tr" style="min-width:80px;">{{ labels }}:</div>
		<div :style="{color:bule?'#2296f9':''}" class="g-m-l-10">
			<slot>
				<div>{{ content }}</div>
			</slot>
		</div>
	</div>
</template>
<script type="text/ecmascript-6">
export default {
	components: {

	},
	props: {
		labels: {
			type: String,
			default() {
				return "标签";
			}
		},
		content: [String, Number],
		bule: {
			type: Boolean,
			default() {
				return false;
			}
		}
	},
	data() {
		return {

		};
	},
};
</script>

<style scoped lang="">
</style>
