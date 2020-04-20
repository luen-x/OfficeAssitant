<template>
	<div>
		<i-drawer 
			v-model="visible" 
			:mask-closable="false" 
			:mask="false"
			class="v-sale-service-record"
			@on-close="handleCancel">
			<div>
				<h2 class="_detail-header g-fs-16">
					查看服务记录
				</h2>
				<div 
					class="_filter g-m-t-20" 
					style="margin-left:16px;"
				>
					<div>
						<i-input
							v-model.trim="keywords.company_name"
							:maxlength="50"
							clearable
							placeholder="请输入公司名称"
							style="width:300px;height:32px;" 
							@on-enter="handleSearch"
							@on-change="handleInputChange"
						/>
						<i-button
							type="primary"
							class="g-m-l-5"
							@click="handleSearch"
						>
							搜索
						</i-button>
						<span 
							class="g-m-l-20 g-c-black-dark g-fs-12 g-pointer"
							@click="handleToggle" 
						>
							更多搜索条件
							<i 
								:class="show ? 'icon-triangle-up' : 'icon-triangle-down'" 
								class="iconfont g-fs-12 g-c-black-dark"
							/>
						</span>
					</div>
					<vc-expand 
						ref="expand"
						v-model="show"
					>
						<div
							class="g-m-t-10 g-bg-gray-mid g-pd-lr-10 g-lh-42"
							style="padding-top: 3px;padding-bottom: 7px;"
						>
							<i-input
								v-model.trim="keywords.search" 
								clearable
								placeholder="请输入服务人或操作人姓名" 
								style="width:220px" 
								class="g-m-r-5"
								@on-enter="handleSearch"
								@on-change="handleInputChange"
							/>
							<i-date-picker
								format="yyyy-MM-dd"
								type="daterange"
								clearable
								split-panels
								style="width:220px"
								placeholder="请选择开始/结束操作时间"
								class="g-m-r-5"
								@on-change="handleDateChange"
							/>
							<i-select 
								v-model="keywords.service_type" 
								clearable
								transfer
								style="width:220px"
								placeholder="请选择服务类型" 
								class="g-m-r-5"
								@on-change="handleSearch"
							>
								<i-option :value="1">客户服务</i-option>
								<i-option :value="4">客户投诉</i-option>
							</i-select>
							<i-cascader
								v-if="departAll.length"
								:data="departAll"
								clearable
								change-on-select
								placeholder="请选择服务人部门"
								class="g-m-r-5"
								style="width:220px"
								@on-change="handleSearchDepart"
							/>
						</div>
					</vc-expand>
				</div>
				<div
					class="g-m-t-20"
					style="margin-left:16px;"
				>
					<i-table
						:loading="loading"
						:columns="serviceRecord"
						:data="list"
						:height="tableHeight"
						width="100%" 
						stripe
						class="g-m-r-20"
					/>
				</div>
				<div class="_btn-box g-flex g-jc-fe g-ai-c">
					<i-page 
						:total="totalCount"
						:current="currentPage"
						:page-size="keywords.pageSize"
						show-total 
						show-elevator 
						show-sizer
						@on-change="handleChange"
						@on-page-size-change="handlePageSizeChange"
					/>
				</div>
			</div>
		</i-drawer>
	</div>
</template>

<script>
import { Drawer, Input, Button, Select, Option, DatePicker, Cascader, Table, Page, Tooltip } from 'iview';
import { Expand, CreatePortal } from 'wya-vc';
import { debounce } from 'lodash';
import { setTimeout } from 'timers';
import orderModal from '@extends/mixins/orderModal';
import { services } from '@stores/services/sale';
import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import { getParseUrl, getHashUrl, oneLinePipe } from '@utils/utils';
import { ServiceDetail } from "./detail";

export default {
	name: "oa-sale-service-record",
	components: {
		'i-drawer': Drawer,
		'i-input': Input,
		'i-button': Button,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		'i-cascader': Cascader,
		'vc-expand': Expand,
		'i-table': Table,
		'i-page': Page
	},
	mixins: [orderModal, services.departAll()],
	props: {
		contractCompanyId: [String, Number]
	},
	data() {
		return {
			show: false,
			visible: false,
			loading: false,
			totalCount: 0,
			currentPage: 1,
			list: [], // 服务记录列表
			tableHeight: 84,
			keywords: {
				page: 1,
				pageSize: 10,
				company_name: '', // 公司名称
				search: '', // 服务人或操作人姓名
				start_time: '', // 开始时间
				end_time: '', // 结束时间,
				service_type: '', // 服务类型
				depart_id: '', // 服务人部门
			},
			serviceRecord: [
				{
					title: '公司名称',
					key: 'company_name',
					minWidth: 150,
					render: (h, { row }) => {
						return (
							<div>
								<AutoTooltip 
									content={row.company_name}
									theme="dark"
									placement="bottom"
									labelClass="g-c-black3"
								/>
							</div>
						);
					}
				},
				{
					title: '服务类型',
					key: 'service_type',
					minWidth: 90,
					render: (h, { row }) => {
						return (
							<span>
								{['客户服务', '服务反馈', '服务审核', '客户投诉'][+row.service_type - 1]}
							</span>
						);
					}
				},
				{
					title: '服务摘要',
					key: 'describe',
					minWidth: 150,
					render: (h, { row }) => {
						return (
							<div>
								<AutoTooltip 
									content={row.describe}
									theme="dark"
									placement="bottom"
									labelClass="g-c-black3"
								/>
							</div>
						);
					}
				},
				{
					title: '服务人',
					key: 'service_staff_name',
					minWidth: 120,
					render: (h, { row }) => {
						return (
							<div>
								<AutoTooltip 
									content={row.service_staff_name}
									theme="dark"
									placement="bottom"
									labelClass="g-c-black3"
								/>
							</div>
						);
					}
				},
				{
					title: '操作人',
					key: 'staff_name',
					minWidth: 120,
					render: (h, { row }) => {
						return (
							<div>
								<AutoTooltip 
									content={row.staff_name}
									theme="dark"
									placement="bottom"
									labelClass="g-c-black3"
								/>
							</div>
						);
					}
				},
				{
					title: '操作时间',
					key: 'create_time',
					minWidth: 160
				},
				{
					title: '查看',
					key: 'view',
					minWidth: 90,
					render: (h, { row }) => {
						return (
							<div 
								class="g-operation"
								onClick={() => { this.handleView(row); }}
							>
								<span>查看</span>
							</div>
						);
					}
				}
			]
		};
	},
	mounted() {
		this.visible = true;
		this.loadData(this.keywords);
	},
	methods: {
		/**
		 * 监听Input组件的change事件
		 */
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		/**
		 * 监听操作时间的on-change事件
		 */
		handleDateChange(arr) {
			this.keywords.start_time = arr[0];
			this.keywords.end_time = arr[1];
			this.handleSearch();
		},
		/**
		 * 初始化加载
		 */
		loadData(obj) {
			this.loading = true;
			this.list = [];

			this.$request({
				url: '_SALE_SERVICE_RECORD_GET',
				type: 'GET',
				loading: false,
				param: { ...obj },
				autoTip: false
			}).then(res => {
				this.loading = false;
				this.totalCount = res.data.totalCount;
				this.currentPage = res.data.currentPage;
				
				if (res.data.list.length) {
					this.list = res.data.list.map(item => ({ 
						...item, 
						service_staff_name: `${item.service_staff_name}（${item.service_depart_name}）`,
						staff_name: `${item.staff_name}（${item.depart_name}）`,
					}));

					this.$nextTick(() => {
						if (obj.pageSize > 10) {
							this.handleTableHeight();
						} else {
							this.tableHeight = this.list.length * 40 + 44;
						}
					});
				} else {
					this.tableHeight = 84;
				}
			}).catch(error => {
				this.loading = false;
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 点击取消
		 */
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		/**
		 * 搜索
		 */
		handleSearch: debounce(function () {
			this.loadData(this.keywords);
		}, 300),
		/**
		 * 服务人部门
		 */
		handleSearchDepart(arr) {
			this.keywords.depart_id = arr[arr.length - 1];
			this.loadData(this.keywords);
		},
		/**
		 * 更多搜索条件
		 */
		handleToggle() {
			this.$refs.expand.toggle();
			if (this.list.length) {
				if (this.keywords.pageSize > 10) {
					this.handleTableHeight();
				} else {
					this.tableHeight = this.list.length * 40 + 44;
				}
			} else {
				this.tableHeight = 84;
			}
		},
		/**
		 * 监听页码的变化
		 */
		handleChange(page) {
			this.keywords.page = page;
			this.loadData(this.keywords);
		},
		/**
		 * 监听每页显示条数的变化
		 */
		handlePageSizeChange(size) {
			this.keywords.pageSize = size;
			this.loadData(this.keywords);
		},
		/**
		 * 计算表格的高度
		 */
		handleTableHeight() {
			if (this.show) {
				if ((this.list.length * 40 + 44) >= window.innerHeight - 350) {
					this.tableHeight = window.innerHeight - 350;
				} else {
					this.tableHeight = this.list.length * 40 + 44;
				}
			} else if ((this.list.length * 40 + 44) >= window.innerHeight - 250) {
				this.tableHeight = window.innerHeight - 250;
			} else {
				this.tableHeight = this.list.length * 40 + 44;
			}
		},
		/**
		 * 查看
		 */
		handleView(row) {
			this.visible = false;
			this.$emit('close');
			setTimeout(() => {
				if (row.service_type === 1) {
					this.$router.push({ 
						name: "sale-service-customer-do",
						query: {
							customerServiceId: row.customer_service_id,
							contractCompanyId: row.contract_company_id,
							pathName: 'sale-service-customer-do'
						}
					});
				} else if (row.service_type === 4) {
					ServiceDetail.popup({
						fromOther: true,
						customerServiceId: row.customer_service_id,
						contractCompanyId: row.contract_company_id,
						tabName: 'complain',
						pathName: 'sale-service-customer-do'
					}).catch(error => {
						error && console.error(error);
					});
				}
			});
		}
	}
};

export const ServiceRecord = CreatePortal({ alive: true }, module.exports.default);
</script>
<style lang="scss">
.v-sale-service-record {
	height: 100%;
	._detail-header {
		color: #000;
		padding: 12px 16px;
		font-weight: normal;
		border-bottom: 1px solid #e8e8e8;
	}
	._btn-box {
		width: 100%;
		height: 60px;
		position: absolute;
		bottom: 1px;
		left: 0;
		padding: 0 16px;
		background-color: #fff;
		border-top: 1px solid #e8e8e8;
		-webkit-box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
		box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
	}
	.ivu-input-large {
		height: 32px;
	}
	.ivu-drawer-body {
		overflow: hidden;
		padding: 0;
	}
	.ivu-table th {
		font-weight: normal;
	}
}
</style>
