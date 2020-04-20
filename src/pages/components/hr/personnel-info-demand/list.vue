<template>
	<vc-paging
		ref="tableTarget"
		:columns="currentColumns"
		:data-source="listInfo.data" 
		:total="listInfo.total"
		:reset="listInfo.reset"
		:history="true"
		:load-data="loadData"
		:table-opts="{height: tableHeight, highlightRow: false}"
		mode="table"
		class="g-m-t-20 v-hr-personnel-info-demand-list"
		@page-size-change="handleChangePageSize"
	/>
</template>

<script>
import { Paging } from 'wya-vc';
import { tableHeight } from '@extends/mixins/tableHeight';
import { getParseUrl, getHashUrl } from '@utils/utils';
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
			nav1: true,
			nav2: false,
			extra: 50
		})
	],
	data() {
		const { query } = this.$route;

		return {
			is_edit: '', // 是否可编辑
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrPersonnelInfoDemand.listInfo;
		},
		currentColumns() {
			return this.handleColumns();
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_PERSONNEL_INFO_DEMAND_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize
				},
			}).then((res) => {
				this.is_edit = res.data.is_edit;
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		handleChangePageSize() {
			this.$store.commit('HR_PERSONNEL_INFO_DEMAND_LIST_INIT');
		},
		handleColumns() {
			let temp1 = [...this.baseColumns];

			if (!this.is_edit) {
				this.showColumns = [...this.baseColumns];
			} else if (this.$auth[1230]) {
				temp1.splice(5, 0, {
					title: '操作',
					key: 'opt',
					fixed: 'right',
					width: 120,
					render: (h, params) => {
						return (
							<div class="g-operation">
								<span 
									onClick={() => {
										this.handleEdit(params.row);
									}}
								>
								编辑
								</span>
							</div>
						);
					}
				});
				this.showColumns = temp1;
			}
			return this.showColumns;
		}
	}
};

</script>

<style lang="scss">
.v-hr-personnel-info-demand-list {
	.ivu-table-cell {
		white-space: nowrap;
	}
}
</style>
