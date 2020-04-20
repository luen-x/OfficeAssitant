<template>
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
import { tableHeight } from '@extends/mixins/table';

export default {
	name: 'oa-table',
	components: {
		'i-button': Button,
		'i-checkbox': Checkbox,
		'vc-paging': Paging,
	},
	mixins: [
		tableHeight({
			filter: true,
			tabs: true,
			footer: true
		})
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
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrRecruitSocialStatistics.sfList;
		}
	},
	watch: {
	},
	created() {
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_RECRUIT_SOCIAL_FOLLOW_LIST_GET',
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
				console.error(error);
			});
		},
		handleChangePageSize() {
			this.$store.commit('HR_RECRUIT_SOCIAL_FOLLOW_LIST_INIT');
		}
	}
};

</script>

