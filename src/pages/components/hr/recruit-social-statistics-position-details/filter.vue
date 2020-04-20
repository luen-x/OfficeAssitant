<template>
	<div class="v-collage-cooperate-header js-filter">
		<div class="g-flex g-fd-r g-jc-sb g-ai-c g-m-t-20">
			<div class="g-flex">
				<i-input
					v-model="search"
					:maxlength="50"
					clearable
					placeholder="请输入姓名/手机号码"
					style="width: 300px"
					@on-enter="handleSearch"
					@on-change="handleSearch"
				/>
				<i-button
					type="primary"
					class="g-m-l-5"
					@click="handleSearch"
				>
					搜索
				</i-button>
			</div>
			<vc-debounce-click
				class="g-red-btn-line g-m-r-10"
				@click="handleExport"
			>
				导出
			</vc-debounce-click>
		</div>
	</div>
</template>

<script>
import { Input, Button } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl, getItem } from '@utils/utils';
import API_ROOT from '@stores/apis/root';

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
			search: (query.search || ''),
			show: false
		};
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/hr/recruit/social/statistics/position/details', 
				{ 
					...this.$route.query, 
					search: this.search,
				}
			));
			this.$store.commit('HR_RECRUIT_SOCIAL_STATISTICS_POSITION_DETAILS_LIST_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleExport() {
			const url = getHashUrl(API_ROOT["HR_RECRUIT_SOCIAL_STATISTICS_POSITION_DETAILS_LIST_GET"], {
				...this.$route.query,
				is_export: 1,
				"-token": getItem(`staff_${this.$global.version}`).token
			});
			window.open(url);
		},
	}
};

</script>

<style lang="scss" scoped>

</style>
