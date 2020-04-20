<template>
	<div class="v-statistics-customer-employee-new">
		<div class="g-pd-lr-10 g-pd-t-5 g-pd-b-10 g-lh-40">
			<i-date-picker 
				v-model="mouth"
				:clearable="false" 
				type="daterange"
				placeholder="请选择日期"
				style="width: 220px;display: inline-block"
				class="g-m-r-5"
				@on-change="handleSearch"
			/>
			<vc-debounce-click
				:tag="Button"
				type="primary"
				@click="handleSearch"
			>
				搜索
			</vc-debounce-click>
		</div>
		<div class="__table-wrapper g-m-10">
			<div class="__table-item">
				<div class="__rank">员工排名</div>
				<oa-loading v-show="!isRerender" />
				<vc-paging
					v-if="isRerender"
					ref="table"	
					:data-source="staffListInfo.data"
					:columns="staffColumns" 
					:total="staffListInfo.total"
					:reset="false"
					:page-opts="page"
					:table-opts="table"
					:history="false"
					:load-data="loadStaffData"
					:show="show"
					:current.sync="pages['0']"
				/>
			</div>
			<div class="__table-item">
				<div class="__rank">部门排名</div>
				<oa-loading v-show="!isRerender" />
				<vc-paging
					v-if="isRerender"
					ref="table"	
					:data-source="departmentListInfo.data"
					:columns="departmentColumns" 
					:total="departmentListInfo.total"
					:reset="false"
					:page-opts="page"
					:table-opts="table"
					:history="false"
					:load-data="loadDepartmentData"
					:show="show"
					:current.sync="pages['1']"
				/>
			</div>
			<div class="__table-item">
				<div class="__rank">战区排名</div>
				<oa-loading v-show="!isRerender" />
				<vc-paging
					v-if="isRerender"
					ref="table"	
					:data-source="areasListInfo.data"
					:columns="areasColumns" 
					:total="areasListInfo.total"
					:reset="false"
					:page-opts="page"
					:table-opts="table"
					:history="false"
					:load-data="loadAreasData"
					:show="show"
					:current.sync="pages['2']"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import { DatePicker, Button } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import moment from 'moment';
import item from './item';

export default {
	name: 'oa-statistics-customer-employee-new',
	components: {
		"i-date-picker": DatePicker,
		'i-button': Button,
		'vc-paging': Paging,
	},
	mixins: [item],
	data() {
		return {
			pages: {
				'0': 1,
				'1': 1,
				'2': 1
			},
			isRerender: true,
			mouth: []
		};
	},
	computed: {
		staffListInfo() {
			return this.$store.state.statisticsCustomerEmployeeNew.listInfo['0'];
		},
		departmentListInfo() {
			return this.$store.state.statisticsCustomerEmployeeNew.listInfo['1'];
		},
		areasListInfo() {
			return this.$store.state.statisticsCustomerEmployeeNew.listInfo['2'];
		},
	},
	beforeCreate() {
		this.Button = Button;
	},
	created() {
		const curDate = new Date();
		this.mouth[0] = moment(curDate).format('YYYY.MM.DD');
		this.mouth[1] = moment(curDate).format('YYYY.MM.DD');
		this.handleSearch();
	},
	methods: {
		handleSearch() {
			this.isRerender = false;
			this.pages = {
				'0': 1,
				'1': 1,
				'2': 1
			};
			Promise.all([this.loadStaffData(), this.loadDepartmentData(), this.loadAreasData()]).then(() => {
				this.isRerender = true;
			});
		},
		// 员工排名数据
		loadStaffData() {
			const query = this.$route.query;
			return this.request({
				url: 'STATISTICS_CUSTOMER_EMPLOYEE_NEW_STAFF_GET',
				type: 'GET',
				param: {
					page: this.pages['0'],
					pageSize: 10,
					start_time: moment(this.mouth[0]).format('YYYY-MM-DD'),
					end_time: moment(this.mouth[1]).format('YYYY-MM-DD')
				}
			}).then(res => {
			});
		},
		// 部门排名数据
		loadDepartmentData() {
			const query = this.$route.query;
			return this.request({
				url: 'STATISTICS_CUSTOMER_EMPLOYEE_NEW_DEPARTMENT_GET',
				type: 'GET',
				param: {
					page: this.pages['1'],
					pageSize: 10,
					start_time: moment(this.mouth[0]).format('YYYY-MM-DD'),
					end_time: moment(this.mouth[1]).format('YYYY-MM-DD')
				}
			}).then(res => {
			});
		},
		// 战区排名数据
		loadAreasData() {
			const query = this.$route.query;
			return this.request({
				url: 'STATISTICS_CUSTOMER_EMPLOYEE_NEW_AREAS_GET',
				type: 'GET',
				param: {
					page: this.pages['2'],
					pageSize: 10,
					start_time: moment(this.mouth[0]).format('YYYY-MM-DD'),
					end_time: moment(this.mouth[1]).format('YYYY-MM-DD')
				}
			}).then(res => {
			});
		},
	},
};
</script>

<style lang="scss">
.v-statistics-customer-employee-new {
	padding: 15px 0 0 20px;
	width: 100%;
	.__table-wrapper {
		display: flex;
		.__table-item {
			position: relative;
			display: inline-block;
			margin-right: 50px;
			min-height: 535px;
			width: 380px;
			// flex: 1;
			.__rank {
				color: #000;
				font-size: 14px;
				line-height: 50px;
				margin-right: 40px;
			}
		}
	}
	.ivu-table:after {
		width: 0px;
	}
	.ivu-table-wrapper > .ivu-spin-fix {
		border: 0px solid #dcdee2;
	}
	.ivu-table-wrapper {
		border: none;
	}
	.ivu-table td {
		border-bottom: 1px solid #eee;
	}
	.vc-paging .__footer {
		position: absolute;
		box-shadow: none;
		width: 100% !important;
		z-index: 500;
		bottom: -20px;
		padding-left: 10px !important;
		:nth-child(2) {
			margin: 0 auto;
		}
	}
	.ivu-page-next .ivu-icon-ios-arrow-forward:before,
			.ivu-page-prev .ivu-icon-ios-arrow-back:before {
			content: "\F11F";
			display: inline-block;
			width: 22px;
			height: 22px;
			line-height: 21px;
			border-radius: 50%;
			text-align: center;
			color: #e74854;
			border: 1px solid #e74854;
			}
			.ivu-page-prev .ivu-icon-ios-arrow-back:before {
			content: "\F115";
		}
		.ivu-page-disabled {
			.ivu-icon-ios-arrow-forward:before,
			.ivu-icon-ios-arrow-back:before {
			color: #bbb;
			border: 1px solid #bbb;
		}
		}
	.ivu-table th {
		// background-color: #fff !important;
		border-bottom: none;
	}
	.ivu-table-header {
		position: relative;
		width: 378px!important;
	}
	.ivu-page-item-active {
		background-color: #fff !important;
	}
	.ivu-page-item-active a {
		color: #e84854 !important;
		border-bottom: 2px solid #e84854;
	}
	.ivu-page.mini .ivu-page-item {
		min-width: 10px !important;
	}
}
</style>
