<template>
	<set-title title="编辑投票">
		<oa-tpl ref="vote"/>
	</set-title>
</template>

<script>

import Tpl from '@components/hr/academy-train-detail-vote-2-edit/content';
import { ModalTip } from '@components/hr/academy-train-detail/_common/popup/model-tips';

export default {
	name: 'oa-hr-academy-train-detail-vote-2-edit',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		return {
			confimInfo: {
				show: true
			}
		};
	},
	provide() {
		return {
			confimInfo: this.confimInfo
		};
	},
	beforeRouteLeave(to, from, next) {
		if (this.confimInfo.show) {
			ModalTip.popup({ content: '内容还没有保存，是否要进行保存？' }).then(() => {
				this.$refs.vote.$refs.vote.handleSubmit();
			}).catch(() => {
				next();
			});
		} else {
			next();
		}
	},
	created() {
	},
	methods: {
	},
};
</script>

<style lang="scss" scoped>
</style>
