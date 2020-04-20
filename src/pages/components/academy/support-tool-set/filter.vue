<template>
	<div v-if="this.$auth[1611]" style="height: 36px;">
		<div class="g-red-btn-line g-fr" @click="handleCategory">添加类目</div>
	</div>
</template>

<script>
import { Input, Button } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { AddCategory } from './popup/add-category';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand
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
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/academy/support/tool/set',
				{
					...this.$route.query,
					keyword: this.keyword,
					name: this.name
				}
			));
			this.$store.commit('ACADEMY_SUPPORT_TOOL_SET_LIST_INIT');
		},
		handleCategory() {
			AddCategory.popup({
				store: this.$store
			}).then(() => {
				this.$store.commit('ACADEMY_SUPPORT_TOOL_SET_LIST_INIT');
			}).catch(() => {

			});
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
