<template>
	<div class="v-hr-position-analyze">
		<vc-paging
			ref="tableTarget"
			:columns="columns"
			:data-source="listInfo.data"
			:total="listInfo.total"
			:reset="listInfo.reset"
			:history="true"
			:load-data="loadData"
			:table-opts="{height: tableHeight}"
			mode="table"
			class="g-m-t-20 v-hr-position-analyze-list"
			@page-size-change="handleChangePageSize"
		/>
		<!-- :table-opts="{height: tableHeight}" -->
	</div>
</template>

<script>
import { Paging } from 'wya-vc';
import { Button, Checkbox } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import API_ROOT from "@stores/apis/root";
import { tableHeight } from '@extends/mixins/tableHeight';
import moment from 'moment';

export default {
	name: 'oa-table',
	components: {
		'i-button': Button,
		'i-checkbox': Checkbox,
		'vc-paging': Paging,
	},
	mixins: [
		tableHeight()
	],
	props: {
		columns: {
			type: Array,
			default() {
				return [];
			},
		},
	},
	data() {
		const { query } = this.$route;
		return {
			option: {},
			label: [],
			value: [],
			percent: [],
			show: false
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrRecruitSocialStatistics.paList;
		}
	},
	
	created() {
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			this.show = true;
			return this.request({
				url: 'HR_RECRUIT_SOCIAL_POSITION_ANALYZE_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize,
				},
				loading: false
			}).then((res) => {
			}).catch((error) => {
				console.error(error);
			});
		},
		handleChangePageSize() {
			this.$store.commit('HR_RECRUIT_SOCIAL_POSITION_ANALYZE_LIST_INIT');
		}
	}
};

</script>

<style lang="scss" scoped>
</style>

