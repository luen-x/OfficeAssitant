<template>
	<div class="g-tr">
		<vc-debounce-click
			v-if="$auth[58]" 
			class="g-red-btn-line"
			@click="handleAddClass"
		>
			新增分类
		</vc-debounce-click>
	</div>
</template>

<script>
import { Button } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { AddClassModal } from "../_common/popup/add-class";

export default {
	name: 'oa-filter',
	components: {
		'i-button': Button
	},
	data() {
		const { query = {} } = this.$route;
		return {
			keyword: String(query.keyword || ''),
			name: String(query.name || ''),
			show: false
		};
	},
	methods: {
		// 新增分类
		handleAddClass() {
			AddClassModal.popup({
				material_type: 2
			}).then(res => {});
		}
	}
};
</script>

<style lang="scss" scoped>
</style>