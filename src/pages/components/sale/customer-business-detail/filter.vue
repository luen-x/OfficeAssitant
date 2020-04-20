<template>
	<div style="height:22px">
		<div >
			<i-input
				v-if="0"
				v-model="keyword"
				:maxlength="50"
				size="large"
				placeholder="请输入客户公司名称"
				style="width: 320px"
			/>
			<i-button
				v-if="0"
				type="primary"
				class="g-m-l-5"
				@click="handleSearch"
			>
				搜索
			</i-button>
			<vc-debounce-click
				v-if="$auth[970]"
				class="g-red-btn-line g-fr g-m-t-10"
				@click="handleExport"
			>
				导出
			</vc-debounce-click>
		</div>
	</div>
</template>

<script>
import { Input, Button } from 'iview';
import { getParseUrl, getHashUrl, getItem } from '@utils/utils';
import API from "@stores/apis/root";
import { SeeDetail } from './popup/see-detail.vue';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
	},
	data() {
		const { query = {} } = this.$route;
		return {
			keyword: String(query.keyword || ''),
			show: false
		};
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/sale/customer/business/detail',
				{
					...this.$route.query,
					keyword: this.keyword,
				}
			));
			this.$store.commit('SALE_CUSTOMER_BUSINESS_DETAIL_LIST_INIT');
		},
		handleExport() {
			const { query } = this.$route;
			window.open(getHashUrl(API.SALE_CUSTOMER_BUSINESS_DETAIL_LIST_GET, {
				type: 1,
				...query,
				keyword: this.keyword,
				export: 1,
				'-token': getItem(`staff_${this.$global.version}`).token
			}));
		},
		handleSeeDetail() {
			SeeDetail.popup({});
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
