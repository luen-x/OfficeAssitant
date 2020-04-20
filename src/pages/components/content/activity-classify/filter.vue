<template>
	<div class="js-filter">
		<div style="height: 30px">
			<vc-debounce-click 
				class="g-fr g-red-btn-line" 
				@click="handleNewClassify">新增分类</vc-debounce-click>
		</div>
	</div>
</template>

<script>
import { Input, Button } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { PModalAddNew } from './popup/add-new';

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
				'/content/activity/classify', 
				{
					...this.$route.query, 
					keyword: this.keyword,
					name: this.name
				}
			));
			this.$store.commit('CONTENT_ACTIVITY_CLASSIFY_LIST_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleNewClassify() {
			PModalAddNew.popup({}).catch(() => {});
		},
	}
};
</script>


