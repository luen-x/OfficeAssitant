<template>
	<div class="v-hr-archives-employee-business-detail">
		<div class="g-tr g-m-t-20 g-fs-14 g-c-black3 g-relative">
			<span class="_divider g-m-r-10">
				<span class="g-m-l-15 g-pointer" @click="handleSelectTitle">选择表头</span>
			</span>
		</div>
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
			class="g-m-t-20 v-hr-archives-employee-business-detail-list"
			@page-size-change="handleChangePageSize"
		/>
	</div>
</template>

<script>
import moment from 'moment';
import { Paging } from 'wya-vc';
import { tableHeight } from '@extends/mixins/table';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { TableTitle } from '../../_common/table-title/table-title';
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
	},
	mixins: [
		item,
		tableHeight({
			footer: true,
			extraHeight: 110
		})
	],
	data() {
		const { query } = this.$route;

		return {
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrArchivesEmployeeBusinessDetail.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_ARCHIVES_EMPLOYEE_BUSINESS_DETAIL_LIST_GET',
				type: 'GET',
				param: {
					...query,
					staff_id: query.staff_id,
					month: query.month ? query.month : moment().format('YYYY-MM'),
					page,
					pageSize
				},
			}).then((res) => {
			}).catch((error) => {
			});
		},
		handleChangePageSize() {
			this.$store.commit('HR_ARCHIVES_EMPLOYEE_BUSINESS_DETAIL_LIST_INIT');
		},
		// 选择表头
		handleSelectTitle() {
			const { query } = this.$route;
			const { title_show: dataShow, title_hide: dataHide } = this.$store.state.hrArchivesEmployeeBusinessDetail.title;
			TableTitle.popup({
				dataShow,
				dataHide,
				saveUrl: '_HR_ARCHIVES_EMPLOYEE_BUSINESS_CONFIG_SAVE_POST',
				mutation: 'HR_ARCHIVES_EMPLOYEE_DETAIL_TITLE_CHANGE',
				params: {
					info_list: 1,
					table_type: query.type,
					staff_id: query.staff_id
				}
			}).then(() => {
				this.$vc.emit('hr-archives-employee-detail-title-change');
				this.$store.commit("HR_ARCHIVES_EMPLOYEE_BUSINESS_DETAIL_LIST_INIT");
			}).catch(err => {
			});
		},
		loadTableTitle(type) {
			const { query } = this.$route;
			return this.$request({
				url: "_HR_ARCHIVES_EMPLOYEE_DETAIL_CONFIG_GET",
				type: "GET",
				param: {
					staff_id: query.staff_id
				},
				loading: false,
			}).then(res => {
				this.$store.commit('HR_ARCHIVES_EMPLOYEE_DETAIL_TITLE_CHANGE', { ...res.data });
				return res;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		}
	}
};

</script>
<style lang="scss">
.v-hr-archives-employee-business-detail {
	._divider:hover {
		color: #2397F9;
	}
	._divider::before {
		content: '';
		display: inline-block;
		width: 1px;
		height: 12px;
		position: absolute;
		top: 5px;
		background: #E8E8E8;
	}
}
</style>
