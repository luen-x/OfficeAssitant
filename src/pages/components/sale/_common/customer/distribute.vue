<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="选择指派人"
		class="v-sale-customer-distribute g-tabs-card"
		width="720"
		@on-ok="handleConfirm"
		@on-cancel="handleCancel"
	>
		<div style="height:450px">
			<div class="g-flex g-jc-c">
				<i-input
					v-model="query.search"
					placeholder="请输入员工姓名或手机号"
					style="width: 300px"
					clearable
					@on-enter="handleSearch"
					@on-change="handleClear"
				/>
				<i-button type="primary" class="g-m-l-10" @click="handleSearch">搜索</i-button>
			</div>
			<i-radio-group v-model="currentStaffId" style="display:block">
				<i-tabs
					:value="type"
					:animated="false"
					type="card"
					style="margin-top: 20px"
					@on-click="handleChange"
				>
					<i-tab-pane
						v-for="(item) in tabs"
						:key="item.value"
						:label="item.label"
						:name="item.value"
					>
						<vc-paging
							ref="tableTarget"
							:columns="columns"
							:show="item.value == type"
							:type="item.value"
							:data-source="listInfo[item.value].data"
							:total="listInfo[item.value].total"
							:reset="listInfo[item.value].reset"
							:history="false"
							:load-data="loadData"
							:table-opts="{height: tableHeight,highlightRow: true}"
							:page-opts="{
								showTotal: true,
								showSizer: true,
								showElevator: false,
								placement: 'top',
								pageSizeOpts: [10, 20, 30]
							}"
							:current.sync="current[item.value]"
							style="margin-bottom:0"
							mode="table"
							@row-click="handleRowClick"
							@page-size-change="handlePageSizeChange"
						/>
					</i-tab-pane>
				</i-tabs>
			</i-radio-group>
		</div>
	</i-modal>
</template>
<script>
import { Input, Button, Tabs, TabPane, Radio, RadioGroup, Modal } from 'iview';
import { Paging, CreatePortal } from 'wya-vc';
import { debounce } from 'lodash';
import { getParseUrl, getHashUrl, getItem } from '@utils/utils';
import { Confirm } from '@common/confirm/confirm';
import orderModal from '@extends/mixins/orderModal';




export default {
	name: 'oa-sale-distribute',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'i-radio': Radio,
		'i-radio-group': RadioGroup,
		'i-modal': Modal,
		'vc-paging': Paging
	},
	mixins: [orderModal],
	props: {
		customerIds: {
			type: Array,
			default: () => []
		},
		distributeCompany: Boolean,
		contractCompanyId: Number

	},
	data() {
		return {
			visible: false,
			type: '1',
			tabs: [
				{ label: '部门员工', value: '1' },
				{ label: '所有员工', value: '0' }
			],
			columns: [
				{
					width: 60,
					fixed: "left",
					className: "g-pd-l-10",
					renderHeader: (h, params) => {
						return <span>
						
						</span>;
					},
					render: (h, { row }) => {
						return (
							<Radio label={row.staff_id}> {' '}</Radio>
						);

					}
				},
				{
					title: '头像',
					key: 'head_img',

					render: (h, params) => {
						return (
							<div style="padding: 5px 0">
								<div class="_head-img">{params.row.staff_name.substr(params.row.staff_name.length - 2, 2)}</div>
							</div>
						);
					},
				},
				{
					title: '员工',
					key: 'staff_name'
				},
				{
					title: '手机号',
					key: 'mobile'
				},
				{
					title: '部门/战区',
					key: 'depart_name'
				}
			],
			query: {
				search: '',
				is_page: 1
			},
			current: { 0: 0, 1: 0 },
			currentStaffId: ''
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.saleCustomerIntentionDistribute.listInfo;
		},
		tableHeight() {
			const length = (this.listInfo[this.type].data[this.current[this.type]] || []).length;
			return length > 5 ? 300 : '';
			// // if (this.listInfo.data[this.curPage] && this.listInfo.data[this.curPage].length > 7) {
			// return 300;
			// // } else {
			// // 	return undefined;
			// // }
		},
	}, 
	mounted() {
		this.visible = true;
		// setTimeout(() => {
		// 	this.showList = true;
		// }, 100); 
	},
	destroyed() {
		this.$store.commit('SALE_CUSTOMER_INTENTION_DISTRIBUTE_LIST_INIT');

	},
	methods: {
		loadData(page, pageSize) {
			return this.request({
				url: 'SALE_CUSTOMER_INTENTION_DISTRIBUTE_LIST_GET',
				type: 'GET',
				param: {
					...this.query,
					type: 0,
					tab: this.type,
					depart_id: (this.type == '1' && !this.$global.staff.is_charge) ? this.$global.staff.depart_id : '',
					not_in_staff_ids: [this.$global.staff.staff_id],
					page,
					pageSize
				}
			}).then((res) => {
				
			}).catch((error) => {
				console.error(error);
			});
		},
		handleSearch() {
			this.handleResetFirst();
		},
		handleResetFirst() {
			this.$store.commit('SALE_CUSTOMER_INTENTION_DISTRIBUTE_LIST_INIT');
		},
		handleClear(val) {
			val = val.target.value;
			if (val == undefined || val == '') {
				this.handleSearch();
			}
		},
		handleChange(type) {
			this.type = type;
		},
		handleRowClick(row) {
			this.currentStaffId = row.staff_id;
		},
		handleConfirm: debounce(function () {
			this.$refs.modal.buttonLoading = false;
			if (!this.currentStaffId) {
				this.$Message.error("请选择要指派的员工");
				this.$refs.modal.buttonLoading = false;
				return;
			}
			Confirm.popup({ title: '提示', msg: '确认指派给该员工吗？' })
				.then(() => {
					// 进行指派
					this.handleDistribute(this.currentStaffId);
				})
				.catch(() => {
					this.$refs.modal.buttonLoading = false;
				});
		}, 200),
		handleDistribute(staffId) {
			const url = this.distributeCompany ? '_SALE_DEAL_CUSTOMER_ASSIGN_POST' : '_SALE_INTENTION_DISTRIBUTE_POST';
			const param = this.distributeCompany ? {
				contract_company_id: this.contractCompanyId,
				other_staff_id: staffId
			} : {
				customer_id: this.customerIds,
				other_staff_id: staffId
			};
			this.$request({
				url,
				type: "POST",
				loading: true,
				param
			}).then(res => {
				this.$Message.success(res.msg);
				this.handleOk();
			}).catch(res => {
				console.error(res);
				this.$refs.modal.buttonLoading = false;
				this.$Message.error(res.msg);
			});
		},
		handleCancel(res) {
			this.visible = false;
			this.$emit('cancel', res);
			
		},
		handleOk(res) {
			this.visible = false;
			this.$emit('sure', res);
		},
		handlePageSizeChange(size) {

			this.handleSearch();

		}

	}
};
export const Distribute = CreatePortal({}, module.exports.default);

</script>
<style lang="scss">
.v-sale-customer-distribute {
	.vc-paging {
		margin-bottom: 0px;
		.__footer {
			position: relative;
			width: auto !important ; 
			// border: 1px solid lightgrey;		
			box-shadow: none;
			border-top: none;
			padding-right: 0px !important;
		}
		
		.ivu-table {
			.ivu-table-fixed-header {
				.ivu-checkbox-wrapper {
					display: none;
				}
			}
		}
	}
	 ._head-img {
		background: #e84c57 ;
		color: #fff;
        height: 35px;
        width: 35px;
        border-radius: 20px;
        text-align: center;
        vertical-align: middle;
        line-height: 35px;
	}
	.ivu-modal-body {
		padding-bottom: 0;
	}
	.ivu-modal-footer {
		padding-top: 10px !important;
	}

}
</style>