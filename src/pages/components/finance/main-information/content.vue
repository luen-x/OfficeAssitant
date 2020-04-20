<template>
	<div>
		<oa-information :status="'5'" />
	</div>
</template>

<script>
import information from '../../sale/full-information';

export default {
	name: 'oa-tpl',
	components: {
		'oa-information': information
	}
};
</script>

<style lang="scss" scoped>
</style>