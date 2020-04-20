<template>
	<div @keyup.enter="handleSearch">
		<i-input
			v-model="rule_name"
			placeholder="请输入规则名称"
			style="width: 220px"
			@on-change="handleInputChange"
		/>
		<i-button
			type="primary"
			class="g-m-l-5"
			@click="handleSearch"
		>
			搜索
		</i-button>
		<div
			v-if="$auth[1493]"
			class="g-fr g-red-btn-line"
			@click="handleCreateWarn">
			新增规则
		</div>
	</div>
</template>

<script>
import { Input, Button } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { createWarn } from './popup/createWarn';

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
			rule_name: String(query.rule_name || ''),
		};
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/content/config/statistics/warning',
				{
					...this.$route.query,
					rule_name: this.rule_name,
				}
			));
			this.$store.commit('CONTENT_CONFIG_STATISTICS_WARNING_LIST_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleCreateWarn() {
			createWarn.popup({}).then(() => {
				this.handleSearch();
			}).catch();
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
