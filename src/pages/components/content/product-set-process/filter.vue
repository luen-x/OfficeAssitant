<template>
	<div class="js-filter">
		<i-input
			v-model="keyword"
			clearable
			placeholder="请输入流程名称"
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
			v-if="this.$auth[30]"
			class="g-m-l-10 g-fr g-red-btn-line"
			to="/content/product/newprocess"
		>
			新建流程
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
			keyword: String(query.process_name || ''),
			name: String(query.name || ''),
			show: false
		};
	},
	computed: {
		auth() {
			return this.$auth;
		}
	},
	methods: {
		handleSearch: debounce(function (value) {
			this.$router.replace(getHashUrl(
				'/content/product/set/process',
				{
					...this.$route.query,
					process_name: this.keyword,
					name: this.name
				}
			));
			this.$store.commit('CONTENT_PRODUCT_SET_PROCESS_LIST_INIT');
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
