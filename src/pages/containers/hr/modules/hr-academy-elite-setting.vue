<template>
	<set-title title="课程梯队设置" class="g-tabs-card" style="padding: 20px">
		<oa-tabs-list ref="list"/>
	</set-title>
</template>

<script>
import TabsList from '@components/hr/academy-elite-setting/tabs-list';

export default {
	name: 'oa-hr-academy-elite-setting',
	components: {
		"oa-tabs-list": TabsList,
	},
	data() {
		return {
		};
	},
	created() {
	},
	methods: {
	},
};
</script>

<style lang="scss" scoped>
</style>
