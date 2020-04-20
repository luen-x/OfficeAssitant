<template>
	<div>
		<vc-paging
			v-if="status"
			ref="tableTarget"
			:data-source="listInfo.data" 
			:total="listInfo.total"
			:reset="listInfo.reset"
			:history="true"
			:load-data="loadData"
			:page-opts="pageOpts"
			mode="piece"
			class="g-m-t-20 v-hr-personnel-member-member-staff"
			@page-size-change="handleChangePageSize"
		>
			<oa-item slot-scope="it" v-bind="it"/>
		</vc-paging>
		<div v-else class="g-m-t-20">
			暂无数据
		</div>
	</div>
</template>

<script>
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
// item
import Item from './item';

export default {
	name: 'hr-personnel-member-member-staff',
	components: {
		'vc-paging': Paging,
		"oa-item": Item
	},
	data() {
		const { query } = this.$route;
		return {
			status: true,
			pageOpts: {
				"show-sizer": true,
			},
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrPersonnelMemberMemberStaff.listInfo;
		}
	},
	watch: {
		$route(to, from) {
			this.loadData();
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_PERSONNEL_MEMBER_MEMBER_STAFF_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize
				},
			}).then((res) => {
				this.status = !!res.data.list.length;
			}).catch((error) => {
				console.error(error);
			});
		},
		handleChangePageSize() {
			this.$store.commit('HR_PERSONNEL_MEMBER_MEMBER_STAFF_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
