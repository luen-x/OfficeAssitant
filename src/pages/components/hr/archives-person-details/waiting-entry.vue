<template>
	<div class="v-archive-person-details">
		<oa-header/>
		<div class="g-m-t-20 g-fs-16 g-c-red-mid">{{ query.add_type==3? "校园招聘":"社会招聘" }}</div>
		<oa-recruit/>
	</div>
</template>
<script>
import header from './person/details/header';
import recruit from './person/details/recruit';

export default {
	components: {
		"oa-header": header,
		"oa-recruit": recruit
	},
	data() {
		const { query } = this.$route;
		return {
			query,
		};
	},
};
</script>

<style lang="scss">
.v-archive-person-details{
	height: inherit;
}
</style>
