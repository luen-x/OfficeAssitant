<template>
	<set-title title="OA-登录">
		<oa-login />
	</set-title>
</template>

<script>
import Content from '@components/login/content';

export default {
	name: 'login',
	components: {
		'oa-login': Content
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
