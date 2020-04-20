<template>
	<div class="js-filter">
		<i-input
			v-model="process_name"
			clearable
			placeholder="请输入项目需求名称"
			style="width: 300px"
			@on-enter="handleSearch"
			@on-change="handleInputChange"
		/>
		<i-button
			type="primary"
			class="g-m-l-5"
			@click="handleSearch"
		>
			搜索
		</i-button>
		<router-link
			v-if="this.$auth[33]"
			class="g-red-btn-line g-fr"
			to="/content/product/newproject"
		>
			新建项目需求
		</router-link>
	</div>
</template>

<script>
import { Input, Button } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { debounce } from 'lodash';

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
			process_name: String(query.process_name || ''),
		};
	},
	methods: {
		handleSearch: debounce(function (value) {
			this.$router.replace(getHashUrl(
				'/content/product/set/project',
				{
					...this.$route.query,
					process_name: this.process_name,
				}
			));
			this.$store.commit('CONTENT_PRODUCT_SET_PROJECT_LIST_INIT');
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
	}
};

</script>

<style lang="scss" scoped>
</style>
