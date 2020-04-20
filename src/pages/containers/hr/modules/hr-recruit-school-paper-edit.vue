<template>
	<set-title :routes="routes" :before-back="beforeBack" title="积分单选">
		<oa-tpl ref="content" />
	</set-title>
</template>

<script>

import Tpl from '@components/hr/recruit-school-paper-edit';
import { Confirm } from '@components/_common/confirm/confirm';

export default {
	name: 'oa-hr-recruit-school-paper-edit',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		return {
			tabs: 'dimensions',
			routes: [
				{
					path: '',
					name: '积分单选'
				}
			]
		};
	},
	methods: {
		beforeBack() {
			this.tabs = this.$refs.content['tabs'];
			let last = this.$refs.content.$refs[this.tabs][this.tabs];
			let curr = this.$refs.content.$refs[this.tabs].formData[this.tabs];
			if (this.tabs === 'questions') curr = this.$refs.content.formatArray(curr, this.tabs);
			if (this.tabs === 'results') curr = curr.map(it => ({ ...it, match_progress: it.match_progress * 2 }));
			last = this.$refs.content.formatArray(last, this.tabs);
			if (JSON.stringify(last) !== JSON.stringify(curr)) { 
				return Confirm.popup( 
					{
						title: "",
						msg: '试卷内容已经修改是否进行保存？',
						showIcon: true
					}
				).then(async (res) => {
					const flag = await this.$refs.content.$refs[this.tabs].handleSave();
					if (flag) {
						return true;
					} else {
						return false;
					}
				}).catch(res => {
					return new Promise((resolve, reject) => {
						resolve(true);
					});
				});
			} else {
				return new Promise((resolve, reject) => {
					resolve(true);
				});
			}
		}
	},
};
</script>

<style lang="scss" scoped>
</style>
