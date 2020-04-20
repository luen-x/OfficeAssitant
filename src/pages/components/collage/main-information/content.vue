<template>
	<div>
		<oa-information :status="'4'" />
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