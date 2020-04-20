<template>
	<div class="js-filter">
		<div class="g-m-t-15">
			<i-input
				v-model="search" 
				size="large" 
				clearable
				placeholder="请输入姓名/手机号码" 
				style="width: 320px" 
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
			<vc-debounce-click
				v-if="$auth[1005]"
				class="g-red-btn-line g-fr"
				@click="handleOutput">
				导出
			</vc-debounce-click>
		</div>
	</div>
</template>

<script>
import { Input, Button } from 'iview';
import { Expand } from 'wya-vc';
import API_ROOT from "@stores/apis/root";
import { getParseUrl, getHashUrl, getItem } from '@utils/utils';

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
			search: String(query.search || ''),
			show: false
		};
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/hr/recruit/social/social-transform-details', 
				{ 
					...this.$route.query, 
					search: this.search,
				}
			));
			this.$store.commit('HR_RECRUIT_SOCIAL_SOCIAL_TRANSFORM_DETAILS_LIST_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleOutput() {
			let { query = {} } = getParseUrl();
			const url = getHashUrl(API_ROOT['HR_RECRUIT_SOCIAL_SOCIAL_TRANSFORM_DETAILS_LIST_GET'], {
				...query,
				is_export: 1,
				type: query.type || '1',
				'-token': getItem(`staff_${this.$global.version}`).token
			});
			window.open(url);
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
