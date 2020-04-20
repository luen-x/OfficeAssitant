<template>
	<vc-paging
		ref="tableTarget"
		:columns="getColumns(baseType)"
		:data-source="listInfo.data"
		:total="listInfo.total"
		:reset="listInfo.reset"
		:history="true"
		:load-data="loadData"
		mode="table"
		class="g-m-t-20"
		@page-size-change="handleChangePageSize"
	/>
</template>

<script>
import { Paging } from 'wya-vc';
import { Button, Checkbox } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import API_ROOT from "@stores/apis/root";
import moment from 'moment';
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'i-button': Button,
		'i-checkbox': Checkbox,
		'vc-paging': Paging,
	},
	mixins: [item],
	data() {
		const { query } = this.$route;
		return {
			...query,
			baseType: query.baseType || '0'
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrRecruitSocialStatistics.sfList;
		}
	},
	watch: {
		$route(to, from) {
			// this.loadData();
			this.$store.commit('HR_RECRUIT_SOCIAL_STATISTICS_DETAIL_ROUTE_CHANGE');
		}
	},
	destroyed() {
		this.$store.commit('HR_RECRUIT_SOCIAL_STATISTICS_DETAIL_ROUTE_CHANGE');
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_RECRUIT_SOCIAL_STATISTICS_DETAIL_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize,
					all_invite: query.all_invite ? query.all_invite : '1'
				},
				loading: false
			}).then((res) => {
			}).catch((error) => {
			});
		},
		handleChangePageSize() {
			this.$store.commit('HR_RECRUIT_SOCIAL_FOLLOW_LIST_INIT');
		}
	}
};

</script>

