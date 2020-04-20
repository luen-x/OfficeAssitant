<template>
	<div class="c-sale-achieve-staff-block">
		<div v-if="title" class="g-m-l-20 g-m-t-20 g-c-black1 g-fs-14 _title" >
			{{ title }}
		</div>
		<div class="g-flex g-fw-w">
			<slot/>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
export default {
	components: {

	},
	props: {
		title: {
			type: String,
			default() {
				return '';
			}
		}
	},
	data() {
		return {

		};
	},
};
</script>

<style lang="scss">
.c-sale-achieve-staff-block{
	._title::before{
		content: "|";
		color:#E84C57;
	}
}
</style>
