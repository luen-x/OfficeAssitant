<template>
	<div class="v-statistic-seal-customer">
		<div>
			<i-date-picker
				v-model="nowMonth"
				:clearable="false"
				type="month"
				placeholder="请选择时间"
				format="yyyy-MM"
				style="width: 220px"
			/>
			<vc-debounce-click
				:tag="Button"
				type="primary"
				class="g-red-btn-small"
				style="margin-left: 6px"
				@click="handleSearch"
			>
				搜索
			</vc-debounce-click>
		</div>

		<div class="__table-wrapper g-m-10">
			<div class="__table-item">
				<div class="__rank">员工成交客户数排行榜</div>
				<oa-loading v-show="!isRerender" />
				<vc-paging
					v-if="isRerender"
					:data-source="listInfo['0'].data"
					:columns="staffColumns"
					:total="listInfo['0'].total"
					:reset="false"
					:page-opts="pageOption"
					:table-opts="tableOption"
					:history="false"
					:load-data="loadStaffData"
					:show="show"
					:current.sync="pages['0']"
			/></div>
			<div class="__table-item">
				<div class="__rank">部门成交客户数排行榜</div>
				<oa-loading v-show="!isRerender" />
				<vc-paging
					v-if="isRerender"
					:data-source="listInfo['1'].data"
					:columns="departmentColumns"
					:total="listInfo['1'].total"
					:reset="false"
					:page-opts="pageOption"
					:table-opts="tableOption"
					:history="false"
					:load-data="loadDepartmentData"
					:show="show"
					:current.sync="pages['1']"
			/></div>
			<div class="__table-item">
				<div class="__rank">战区成交客户数排行榜</div>
				<oa-loading v-show="!isRerender" />
				<vc-paging
					v-if="isRerender"
					:data-source="listInfo['2'].data"
					:columns="areasColumns"
					:total="listInfo['2'].total"
					:reset="false"
					:page-opts="pageOption"
					:table-opts="tableOption"
					:history="false"
					:load-data="loadAreasData"
					:show="show"
					:current.sync="pages['2']"
			/></div>
		</div>

		<div 
			:class="['_customer-request', { '__box-shadow': isEnter }]"
			@mouseenter="isEnter = true"
			@mouseleave="isEnter = false"
		>
			<div class="__header">每月成交客户统计表</div>
			<div style="padding: 10px 20px 0 20px">
				<div class="__filter">
					<!-- <i-select
						:remote-method="loadStaff"
						:loading="staffLoading"
						v-model="staff"
						filterable
						clearable
						remote
						class="__short g-m-b-10"
						placeholder="请输入员工姓名/手机号搜索"
						style="display: inline-block; margin: 10px 8px 0 0">
						<i-option v-for="(option, index) in staffData" :value="option.value" :key="index">{{ option.label }}</i-option>
					</i-select> -->
					<i-input
						v-model="keyword"
						class="__short g-m-b-10"
						placeholder="请输入员工姓名/手机号搜索"
						style="display: inline-block; margin: 10px 8px 0 0"
					/>
					<i-date-picker
						v-model="nowYear"
						:clearable="false"
						:options="option"
						type="year"
						placeholder="请选择时间"
						format="yyyy年"
						style="width: 220px;"
					/>
					<i-cascader
						:data="departAllOfSale"
						v-model="depart_id"
						trigger="hover"
						style="display: inline-block; width: 220px"
						clearable
						change-on-select
						placeholder="请选择组织"
						class="g-m-l-5"
					/>
					<vc-debounce-click
						:tag="Button"
						type="primary"
						class="g-red-btn-small"
						style="margin-left: 6px"
						@click="handleEchartsData"
					>
						搜索
					</vc-debounce-click>
				</div>
				<div class="__customer-mount">
					<div class="__bar g-relative">
						<div class="g-absolute __title">
							<span class="g-c-black1">成交客户数量统计柱状图&nbsp;&nbsp;</span>
							<i class="iconfont g-fs-12">&#xe64d;</i>
							<span class="__sub-title">月份左侧为去年数据，右侧为今年数据</span>
						</div>
						<vc-echarts
							:options="customerMountBar"
							:auto-resize="true"
						/>
					</div>
					<div class="__line" />
					<div class="__pie" style="margin-top: 50px;">
						<div class="g-c-black1 g-tc" style="min-width: 440px; margin: -35px 0 30px 0">{{ nowYearPie }}年客户成交比例</div>
						<vc-echarts
							:options="customerOkPie"
							:auto-resize="true"
						/>
					</div>
				</div>

				<div class="__customer-money">
					<div class="__bar g-relative">
						<div class="g-absolute __title g-lh-14">
							<span class="g-c-black1">成交客户到账金额统计柱状图&nbsp;&nbsp;</span>
							<i class="iconfont g-fs-12">&#xe64d;</i>
							<span class="__sub-title">月份左侧为去年数据，右侧为今年数据</span>
						</div>
						<vc-echarts
							:options="customerMoneyBar"
							:auto-resize="true"
						/>
					</div>
					<div class="__line"/>
					<div class="__pie" style="margin-top: 50px">
						<div class="g-c-black1 g-tc" style="min-width: 440px; margin: -35px 0 30px 0">{{ nowYearPie }}年客户付款金额比例</div>
						<vc-echarts
							:options="customerMoneyPie"
							:auto-resize="true"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Echarts, Paging } from "wya-vc";
import moment from 'moment';
import { Input, Button, DatePicker, Select, Option, Cascader, Page } from 'iview';
import { staffByMutiTerm, services } from '@stores/services/hr';
import API_ROOT from '@stores/apis/root';
import item, { tooltipFormatter } from './item';

const MONTH = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

export default {
	name: 'oa-statistic-deal-customer',
	components: {
		'i-date-picker': DatePicker,
		'i-input': Input,
		'i-button': Button,
		'i-select': Select,
		'i-option': Option,
		'i-cascader': Cascader,
		"vc-echarts": Echarts,
		'vc-paging': Paging,
		'i-page': Page
	},
	mixins: [staffByMutiTerm, services.departAll(), item],
	data() {
		const getNowMonth = () => {
			const date = new Date();
			const year = date.getFullYear();
			let month = date.getMonth() + 1;
			month = month < 10 ? '0' + month : month;
			return year + '-' + month;
		};
		const self = this;
		return {
			pages: {
				'0': 1,
				'1': 1,
				'2': 1
			},
			isRerender: true,
			isEnter: false,
			nowMonth: getNowMonth(),
			nowYear: new Date(),
			staff: '',
			depart_id: [],
			keyword: '',
			option: {
				disabledDate(date) {
					return date && date.valueOf() < 1514735999000; // 2017-12-31 23:59:59
				}
			},
			nowYearPie: (new Date()).getFullYear(),
			pageOption: {
				pageSize: 5,
				size: 'small'
			},
			tableOption: {
				stripe: false
			}
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.statisticsDealCustomer.listInfo;
		},
		departAllOfSale() {
			if (this.departAll == undefined || !this.departAll.length || !this.departAll[0].label) return [];
			const departTree = this.departAll.filter(v => v.label.includes('营销'))[0].children;
			departTree.forEach(v => {
				if (!v.children) {
					v.disabled = true;
				}
			});
			return departTree;
		}
	},
	beforeCreate() {
		this.Button = Button;
	},
	created() {
		this.handleSearch();
		this.handleEchartsData();
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
		handleEchartsData() {
			this.$request({
				url: API_ROOT['STATISTICS_DEAL_CUSTOMER_TABLE_GET'],
				type: 'GET',
				// loading: false,
				param: {
					keyword: this.keyword,
					depart_id: this.depart_id.length && this.depart_id[this.depart_id.length - 1],
					year: this.nowYear && this.nowYear.getFullYear()
				}
			}).then(res => {
				const nowYear = this.nowYear.getFullYear();
				this.nowYearPie = nowYear;
				// this.$Message.success(res.msg);
				const data = res.data;

				// 成交客户数量圆环图
				this.$set(this.customerOkPie.series, 0, {
					...this.customerOkPie.series[0],
					data: [
						{ value: data.customer_count.old_count, name: '老客户' },
						{ value: data.customer_count.new_count, name: '新客户' }
					]
				});

				// 成交客户金额圆环图
				this.$set(this.customerMoneyPie.series, 0, {
					...this.customerMoneyPie.series[0],
					data: [
						{ value: data.customer_money.old_money, name: '老客户' },
						{ value: data.customer_money.new_money, name: '新客户' }
					]
				});

				// 成交客户数量统计柱状图
				let lastYearAllCount = []; // 去年成交总数
				let nowYearAllCount = []; // 今年成交总数
				let lastYearNewCount = []; // 去年新客户数
				let nowYearNewCount = []; // 今年新客户数
				let lastYearOldCount = []; // 去年老客户数
				let nowYearOldCount = []; // 今年老客户数
				data.list_count.now_year.forEach(v => {
					nowYearAllCount.push(v.total_count);
					nowYearNewCount.push(v.new_count);
					nowYearOldCount.push(v.old_count);
				});
				data.list_count.last_year.forEach(v => {
					lastYearAllCount.push(v.total_count);
					lastYearNewCount.push(v.new_count);
					lastYearOldCount.push(v.old_count);
				});
				const listCount = [
					lastYearAllCount, lastYearOldCount, lastYearNewCount,
					nowYearAllCount, nowYearOldCount, nowYearNewCount];
				this.customerMountBar.series = this.customerMountBar.series.map((v, i) => {
					let newValue = {
						...v,
						data: listCount[i]
					};

					// 设置顶部数据
					if (i == 2) {
						newValue.label.formatter = function (params) {
							const { dataIndex } = params;
							return lastYearAllCount[dataIndex];
						};
					}
					if (i == 5) {
						newValue.label.formatter = function (params) {
							const { dataIndex } = params;
							return nowYearAllCount[dataIndex];
						};
					}
					return newValue;
				});

				// 成交金额数量统计柱状图
				let lastYearAllMoney = []; // 去年成交总额
				let nowYearAllMoney = []; // 今年成交总额
				let lastYearNewMoney = []; // 去年新客总额
				let nowYearNewMoney = []; // 今年新客总额
				let lastYearOldMoney = []; // 去年老客总额
				let nowYearOldMoney = []; // 今年老客总额
				data.list_money.now_year.forEach(v => {
					nowYearAllMoney.push((v.total_money / 10000));
					nowYearNewMoney.push((v.new_money / 10000));
					nowYearOldMoney.push((v.old_money / 10000));
				});
				data.list_money.last_year.forEach(v => {
					lastYearAllMoney.push((v.total_money / 10000));
					lastYearNewMoney.push((v.new_money / 10000));
					lastYearOldMoney.push((v.old_money / 10000));
				});
				const listMoney = [
					lastYearAllMoney, lastYearOldMoney, lastYearNewMoney,
					nowYearAllMoney, nowYearOldMoney, nowYearNewMoney];
				this.customerMoneyBar.series = this.customerMoneyBar.series.map((v, i) => {
					let newValue = {
						...v,
						data: listMoney[i]
					};
					if (i == 2) {
						newValue.label.formatter = function (params) {
							const { dataIndex } = params;
							return lastYearAllMoney[dataIndex];
						};
					}
					if (i == 5) {
						newValue.label.formatter = function (params) {
							const { dataIndex } = params;
							return nowYearAllMoney[dataIndex];
						};
					}
					return newValue;
				});

				// 设置tooltip
				this.customerMountBar.tooltip.formatter = tooltipFormatter('人', nowYear);
				this.customerMoneyBar.tooltip.formatter = tooltipFormatter('万', nowYear);
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		loadStaffData() {
			return this.request({
				url: 'STATISTICS_DEAL_CUSTOMER_STAFF_GET',
				type: 'GET',
				param: {
					page: this.pages['0'],
					month: moment(this.nowMonth).format('YYYY-MM')
				}
			}).then(res => {
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		loadDepartmentData() {
			return this.request({
				url: 'STATISTICS_DEAL_CUSTOMER_DEPARTMENT_GET',
				type: 'GET',
				param: {
					page: this.pages['1'],
					month: moment(this.nowMonth).format('YYYY-MM')
				}
			}).then(res => {
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		loadAreasData() {
			return this.request({
				url: 'STATISTICS_DEAL_CUSTOMER_AREAS_GET',
				type: 'GET',
				param: {
					page: this.pages['2'],
					month: moment(this.nowMonth).format('YYYY-MM')
				}
			}).then(res => {
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		}
	},
};
</script>

<style lang="scss">
.v-statistic-seal-customer {
	padding: 15px 0 0 20px;
	width: 100%;
	._customer-request {
		min-width: 1120px;
		margin-top: 40px;
		margin-bottom: 50px;
		width: 98%;
		height: 1024px;
		border: 1px solid #ebeef1;
		border-radius: 4px;
		.__header {
			height: 45px;
			font-size: 14px;
			color: #333;
			font-weight: bold;
			padding-left: 20px;
			line-height: 45px;
			background-color: #f8f8f8;
			min-width: 1120px;
		}
		.__customer-mount {
			display: flex;
			height: 450px;
			margin-bottom: 15px;
			border-bottom: 1px dashed #ebeef1;
			.__bar {
				flex: 8;
			}
			.__pie {
				flex: 3;
			}
		}
		.__customer-money {
			display: flex;
			height: 450px;
			.__bar {
				flex: 8;
			}
			.__pie {
				flex: 3;
			}
		}
	}
	.__short {
		width: 220px;
	}
	.__title {
		top: 12px;
		left: 2px;
	}
	.__box-shadow {
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.1)
	}
	.__sub-title {
		font-size: 12px;
		color: #bbb;
		padding-left: 5px;
		position: relative;
	}
	.__line {
		height: 80%;
		width: 1px;
		border-left: 1px dashed #ebeef1;
		margin-top: 50px;
		margin-right: 15px;
		margin-left: -45px
	}
	.__table-wrapper {
		display: flex;
		// width: 100%;
		// width: 380px;
		.__table-item {
			display: inline-block;
			position: relative;
			margin-right: 30px;
			min-height: 330px;
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
	.ivu-table::after {
		width: 0px;
	}
	.ivu-table-wrapper {
		border: none;
	}
	.ivu-spin-fix {
		border: none!important
	}
	.ivu-table th {
		// background-color: #fff !important;
		border-bottom: none;
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
<style lang="scss">
.v-deal-customer-rank {

  i {

    font-size: 12px
  }
  i::before {
    font-size: 12px;
    padding-right: 5px;
  }
  .icon-triangle-up,
  .icon-triangle-up::before {
    color: #e84854;
  }
  .icon-triangle-down,
  .icon-triangle-down::before {
    color: #cfd5e2
  }
  .icon-chengguojishanghenggang {
	  margin-left: -5px;
	  &::before {
		font-size: 12px;
		padding-right: 2px!important;
	  }
  }
}
</style>

