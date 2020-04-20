<template>
	<set-title title="人才盘点" class="g-tabs-card g-of-h" style="padding: 20px 20px 0 20px;">
		<oa-tabs-list ref="list"/>
	</set-title>
</template>

<script>
import TabsList from '@components/hr/academy-elite-talent/tabs-list';
// import Filter from '@components/hr/academy-elite-talent/filter';
import API_ROOT from '@stores/apis/root';
import navigator from '@extends/mixins/navigator';
import Vue from 'vue';

export default {
	name: 'oa-hr-academy-elite-talent',
	components: {
		"oa-tabs-list": TabsList,
		// "oa-filter": Filter,
	},
	mixins: [navigator('HR_ACADEMY_ELITE_TALENT')],
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

<style lang="scss">
.hr-academy-elite-talent {
	position: fixed;
    width: 90%;
    height: 100%;
    z-index: 999;
}
</style>
