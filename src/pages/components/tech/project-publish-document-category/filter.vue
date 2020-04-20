<template>
	<div>
		<div class="g-flex g-fd-rr g-m-t-20">
			<vc-debounce-click
				class="g-m-l-10 g-red-btn-line"
				@click="handleAddCategory"
			>
				添加类目
			</vc-debounce-click>
		</div>
	</div>
</template>

<script>
import { Button } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { CategoryModal } from './modal/category';

export default {
	name: 'oa-filter',
	components: {
		'i-button': Button
	},
	data() {
		const { query = {} } = this.$route;

		return {};
	},
	computed: {
		tabs() {
			return this.$store.state.techProjectPublishDocumentCategory.tabs;
		}
	},
	methods: {
		handleAddCategory() {
			CategoryModal.popup({
				name: '1',
				flag: 2,
				v: this.tabs[this.$route.query.type || '0']
			}).then(res => {
				res && this.$parent.$children[2].loadData();
			});
		}
	}
};
</script>

<style lang="scss" scoped>
</style>