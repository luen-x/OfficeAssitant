<template>
	<set-title 
		:routes="routes" 
		title="OA意见反馈箱" 
		class="g-tabs-card" 
		style="padding: 20px"
	>
		<oa-filter class="g-m-t-20"/>
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/sc/reply-answer/tabs-list';
import Filter from '@components/sc/reply-answer/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sc-reply-answer',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('SC_REPLY_ANSWER')],
	data() {
		return {
			routes: [
				{
					path: "/sc/views?from=avatar",
					name: "OA意见反馈箱"
				}, {
					path: "",
					name: "去回复问题"
				}
			]
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
