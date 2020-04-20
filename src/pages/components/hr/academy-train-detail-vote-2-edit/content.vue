<template>
	<div>
		<oa-edit-vote ref="vote"/>
	</div>
</template>

<script>
import editVote from '../academy-train-detail-vote-1-add/common/add-edit-vote';

export default {
	name: 'oa-tpl',
	components: {
		'oa-edit-vote': editVote
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
