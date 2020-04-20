<template>
	<div class="v-hr-archives-employee-target">
		<oa-filter :type="type" @load="loadData"/>
		<i-tabs
			:value="type"
			:animated="false"
			type="card"
			style="margin-top: 20px"
			class="g-tabs-card"
			@on-click="handleChange"
		>
			<i-tab-pane
				v-for="(item) in tabs"
				:key="item.value"
				:label="item.label"
				:name="item.value"
			>
				<div v-if="item.value === '1'">
					<oa-employee
						v-if="employeeData.length"
						:info="employeeData"
						:show-btn="showBtn"
						@load="loadData" />
					<span v-else>暂无数据</span>
				</div>
				<div v-if="item.value === '2'">
					<oa-depart
						v-if="departData.length"
						:info="departData"
						:show-btn="showBtn"
						@load="loadData" />
					<span v-else>暂无数据</span>
				</div>
				<div v-if="item.value === '3'">
					<oa-manager
						v-if="managerData.length"
						:info="managerData"
						:show-btn="showBtn"
						@load="loadData" />
					<span v-else>暂无数据</span>
				</div>
			</i-tab-pane>
		</i-tabs>
		<div class="v-hr-archives-employee-target-footer g-flex-ac g-jc-fe g-pd-r-20">
			<i-paging
				:page-size="pageSize"
				:total="total"
				:current="page"
				show-total
				show-elevator
				@on-change="handlePageChange">
				<div>共{{ total }}条</div>
			</i-paging>
		</div>
	</div>
</template>

<script>
import { Tabs, TabPane, Page } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import Filter from './filter';
import Employee from './tabs/employee';
import Depart from './tabs/depart';
import Manager from './tabs/manager';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		"i-paging": Page,
		'oa-employee': Employee,
		'oa-depart': Depart,
		'oa-manager': Manager,
		'oa-filter': Filter
	},
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			total: 0,
			page: 1,
			showBtn: false,
			employeeData: [],
			departData: [],
			managerData: [],
			tabs: [
				{ label: '员工', value: '1' },
				{ label: '部门', value: '2' },
				{ label: '战区', value: '3' }
			],
		};
	},
	computed: {
		pageSize() {
			switch (this.type) {
				case '1':
					return 5;
				case '2':
				case '3':
					return 6;
				default:
					return 5;
			}
		}
	},
	mounted() {
		this.loadData(this.$route.query.type, this.$route.query.page || 1);
		this.$request({
			url: 'HR_ARCHIVES_EMPLOYEE_TARGET_SHOW_EDIT_GET',
			type: 'GET',
			param: {
			},
		}).then(res => {
			this.showBtn = res.data.is_open === 1;
		}).catch(err => {});
	},
	methods: {
		loadData(type = '1', page = 1) {
			this.page = +page;
			let { query = {} } = getParseUrl();
			this.$request({
				url: 'HR_ARCHIVES_EMPLOYEE_TARGET_LIST_POST',
				type: 'POST',
				param: {
					...query,
					list_type: type,
					page,
					pageSize: type === '1' ? 5 : 6,
					depart_id: type === '2' ? query.depart_id : ''
				},
			}).then(res => {
				this.total = res.data.totalCount;
				if (type === '1') {
					this.employeeData = res.data.list;
				} else if (type === '2') {
					this.departData = res.data.list;
				} else if (type === '3') {
					this.managerData = res.data.list;
				}
			}).catch(err => {});
		},
		// tab切换
		handleChange(type) {
			this.type = type;
			this.page = 1;

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				// ...query,
				type,
				page: 1
			};
			this.$router.replace(getHashUrl('/hr/archives/employee/target', { ...query }));
			this.loadData(type, 1);
		},
		// 页数改变
		handlePageChange(page) {
			this.page = page;
			this.loadData(this.type, page);
		},
	}
};

</script>

<style lang="scss" scoped>
.v-hr-archives-employee-target-footer {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	width: 100%;
	height: 60px;
	background-color: #fff;
	box-shadow:0px -2px 10px 0px rgba(0, 0, 0, 0.08);

}
</style>

// <style lang="scss">
// .v-hr-archives-employee-target {
// 	.ivu-tabs {
// 		overflow: visible;
// 	}
// }
// </style>
