<template>
	<span @click.stop="handleCollect">
		<slot>
			<i 
				:class="{
					'g-c-orange-mid icon-star1':!!collectionId,
					'g-c-black7 icon-star':!collectionId,
					'g-pointer':!disabled
				}" 
				class="icon iconfont g-fs-12"
			/>
		</slot>
	</span>
</template>
<script>

import { Confirm } from '@common/confirm/confirm.vue';
import { ChangeCategory } from '@components/collect/_common/modals/change-category';

export default {
	name: 'oa-collect-star',
	props: {
		sourceType: {
			type: Number,
			default: 1 // 1- 案例  2- 发圈素材
		},
		sourceId: [Number, String],
		disabled: Boolean,
		collectionId: [Number, String]
	},
	data() {
		return {
			sourceName: {
				1: '案例',
				2: '素材'
			}
		};
	},
	methods: {
		handleCollect() {
			if (this.disabled) return;
			if (this.collectionId) {
				Confirm.popup({
					title: '取消收藏',
					msg: "确定取消收藏该" + this.sourceName[this.sourceType] + "吗？"
				}).then(() => {
					this.$request({
						url: "_SALE_MAIN_CASE_COLLECT_DELETE_POST",
						type: "GET",
						param: { collection_id: this.collectionId },
						loading: false,
					}).then(res => {
						this.$emit("change", { changed: true, collection_id: undefined });
					}).catch((res) => {
						this.$Message.error(res.msg);
					});
				});
			} else {
				if (!this.sourceId) return console.error('缺少sourceId');
				ChangeCategory.popup({
					sourceId: this.sourceId,
					sourceType: this.sourceType,
					mode: 'addCollect'

				}).then(res => {
					if (res && res.changed) {
						this.$emit("change", res);
					}
				}).catch(res => {
					console.error(res);
					if (res && res.changed) {
						this.$emit("change", res);
					}
				});
			}
		},
	}
};
</script>
<style lang="scss">
</style>