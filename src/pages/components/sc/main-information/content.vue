<template>
	<div>
		<oa-information :status="'7'"/>
	</div>
</template>

<script>
import information from '../../sale/full-information';

export default {
	name: 'sc-main-information',
	components: {
		'oa-information': information
	}
};
</script>

<style lang="scss" scoped>
</style>