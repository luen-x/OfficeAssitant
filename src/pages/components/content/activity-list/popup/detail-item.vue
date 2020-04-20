<template>
	<div class="g-bb v-activity-list-item g-m-t-10" style="height: 35px; line-height: 35px">
		<span style="width: 130px; display: inline-block" class="g-c-black4">{{ label }}</span>
		<div style="display: inline-block;" class="g-c-black2">
			<slot/>
		</div>
	</div>
</template>
<script>
export default {
	name: 'oa-detail-item',
	props: {
		label: String,
	}
};
</script>

<style lang="scss" scoped>
.v-activity-list-item {
  width: 40%;
  margin-right: 50px;
  margin-left: 15px;
}
</style>

 