<template>
	<div>
		<oa-information :status="'6'" />
	</div>
</template>

<script>
import information from '../../sale/full-information';

export default {
	name: 'oa-tpl',
	components: {
		'oa-information': information
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
