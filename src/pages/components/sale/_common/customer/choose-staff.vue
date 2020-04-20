<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		:title="title"
		class="v-hr-course-choose-staff"
		width="720"
		@on-ok="handleConfirm"
		@on-cancel="handleCancel"
	>
		<div style="height:440px">
			<div class="g-flex g-jc-c g-m-b-20">
				<i-input
					v-model="query.search"
					placeholder="请输入员工姓名或手机号"
					style="width: 300px"
					@on-enter="handleSearch"
					@on-change="handleClear"
				/>
				<i-button type="primary" class="g-m-l-10" @click="handleSearch">搜索</i-button>
			</div>
			<vc-paging
				ref="tableTarget"
				:show="showList"
				:columns="columns"
				:data-source="listInfo.data" 
				:total="listInfo.total"
				:reset="listInfo.reset"
				:history="false"
				:load-data="loadData"
				:footer="!inLoading"
				:table-opts="{height: tableHeight}"
				:page-opts="{
					showTotal: false,
					showSizer: true,
					showElevator: false,
					placement: 'top',
					pageSizeOpts: [10, 20, 30]
				}"
				mode="table"
				class="g-m-t-20"
				@page-change="handlePageChange"
				@page-size-change="handleChangePageSize"
				@selection-change="handleSelectionChange"
				@select="handleSelect"
				@row-click="handleRowClick"

			/>
		</div>
		<div v-if="type=='sharePerformance'" slot="footer">
			<div class=" g-fl g-m-l-20" style="margin-top:7px;font-size:13px">
				已选择：
				<span v-for="(staff,index) in selectsShow" :key="staff.staff_id" class="g-c-blue-mid" >
					{{ staff.staff_name +(index== selectsShow.length-1 ?'':'，') }} 
				</span>
			</div>
			<i-button size="large" type="text" @click="handleCancel">取消</i-button>
			<i-button type="primary" size="large" @click="handleConfirm">确定</i-button>
		</div>
		
		
	</i-modal>
</template>

<script>
import { Modal, Button, Input, Table, Checkbox, Icon, Select, Option, Poptip, Page, Cascader } from 'iview';
import { debounce } from 'lodash';
import API from '@stores/apis/root';
import { Paging, CreatePortal } from 'wya-vc';
import { getParseUrl, getHashUrl, getItem } from '@utils/utils';
import keepSelect from '@extends/mixins/keepSelects';
import checkAll from '@extends/mixins/checkAll';
import { Confirm } from '@common/confirm/confirm';
import { services } from '@stores/services/sale';
import orderModal from '@extends/mixins/orderModal';


export default {
	name: "oa-choose",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-input': Input,
		'i-table': Table,
		'i-icon': Icon,
		'i-select': Select,
		'i-option': Option,
		'i-page': Page,
		'i-checkbox': Checkbox,
		'vc-paging': Paging,
		'i-cascader': Cascader
	},
	mixins: [
		keepSelect({ rowKey: 'staff_id' }),
		orderModal,
		services.firstDepartId()
	],
	props: {
		customer_ids: Array,
		contract_company_id: Number,
		distributeCompany: Boolean,
		type: String, // distribute , sharePerformance,
		title: String,
		selected: {
			type: Array,
			default: () => []
		},
		inviteStaffId: Number,
		param: {
			type: Object,
			default: () => ({})
		}
		
	},

	data() {
		const query = { 
			search: '',
			is_page: 1,
			...this.param,
		};
		if (this.type == 'distribute') {
			query.depart_id = this.$global.staff.depart_id;
			query.not_in_staff_ids = [this.$global.staff.staff_id];	
		}
		return {
			visible: false,
			query,
			checkAll: false,
			showList: false,
			inLoading: false,
			selects: [...this.selected],
			selectsShow: [...this.selected],
			curPage: 0,
			columns: [
				{
					type: "selection",
					width: 60,
					fixed: "left",
					className: "g-pd-l-10",
					renderHeader: (h, params) => {
						return <span></span>;
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
			
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.contentConfigMaterialBank.listInfo;
		},
		tableHeight() {
			if (this.listInfo.data[this.curPage] && this.listInfo.data[this.curPage].length > 7) {
				return 340;
			} else {
				return undefined;
			}
		},
	}, 
	watch: {
		selects(newVal) {
			this.setSelectsShow(newVal);
		}
	
	},
	created() {
	},
	mounted() {
		this.visible = true;
		setTimeout(() => {
			this.showList = true;
		}, 100); 
	},
	destroyed() {
		this.handleResetFirst();
	},
	methods: {
		handleOk(res) {
			this.visible = false;
			this.$emit('sure', res);
		},
		handleConfirm: debounce(function () {
			this.$refs.modal.buttonLoading = false;
			if (this.type == 'sharePerformance') {
				if (this.selects.length == 0) {
					this.$Message.error('请选择分单人');
					this.$refs.modal.buttonLoading = false;
				} else {
					this.handleOk(this.selects);
				}
			} else if (this.type == 'distribute') {
				const staff = this.selects[0];
				if (!staff) {
					this.$Message.error("请选择要指派的员工");
					this.$refs.modal.buttonLoading = false;
					return;
				}
				Confirm.popup({ title: '提示', msg: '确认指派给该员工吗？' })
					.then(() => {
						// 进行指派
						this.handleDistribute(staff);
					})
					.catch(() => {
						this.$refs.modal.buttonLoading = false;
					});
			}
			
		}, 200),
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		loadData(page, pageSize) {
			this.isAll = false;
			const query = this.query;
			this.inLoading = true;
			return this.request({
				url: '_SALE_PAYMENT_STAFF_LIST_GET',
				redirect: 'CONTENT_CONFIG_MATERIAL_BANK_LIST_GET_SUCCESS',
				type: 'GET',
				param: {
					...query,
					page: this.curPage ? page : 1,
					pageSize,

				}
			}).then((res) => {
				this.afterLoadData(res);
			}).catch((error) => {
				console.error(error, 'error');
			}).finally(() => {
				this.inLoading = false;
			});
		},
		beforeChangePageSize() {
			this.$store.commit('CONTENT_CONFIG_MATERIAL_BANK_LIST_INIT');
		},
		handleIsAll(val) {
			this.$refs.tableTarget.$refs.tableTarget.selectAll(val);
		},
		beforePageChange(page) {
			this.curPage = page;
		},
		handleSearch() {
			this.handleResetFirst();
		},
		handleClear(val) {
			val = val.target.value;
			if (val == undefined || val == '') {
				this.handleSearch();
			}
		},
		handleResetFirst() {
			this.$store.commit('CONTENT_CONFIG_MATERIAL_BANK_LIST_INIT');
		},
		handleSelect(selection, row) {
			if (this.type == "sharePerformance") {
				setTimeout(() => {
					const ok = this.checkSharePeson(row);
					if (!ok) {
						this.selects.pop();
						this.toggleSelect();
					}
				}, 10);
			} else if (this.type == 'distribute') {
				setTimeout(() => {
					if (this.selects.length > 1) {
						this.selects = [this.selects[this.selects.length - 1]];
						this.toggleSelect();
					}
				}, 10);
			}
		},
		checkSharePeson(staff) {
			if (staff.staff_id == this.inviteStaffId) {
				this.$Message.error('不能分单给邀约人');
				return false;
			}
			const isSale = this.firstDepartId.sale == staff.first_depart_id;
			if (isSale) {
				if (this.selects.filter(_staff => _staff.first_depart_id == this.firstDepartId.sale).length >= 3) {
					this.$Message.error('最多可以跟市场部两位同事进行分单');
					return false;
				}
			} else {
				const a = 1;
				if (this.selects.filter(_staff => _staff.first_depart_id != this.firstDepartId.sale).length >= 3) {
					this.$Message.error('最多可以跟市场部之外两位同事进行分单');
					return false;
				}
			}
			return true;
			
			
		},
		handleDistribute(staff) {
			const url = this.distributeCompany ? '_SALE_DEAL_CUSTOMER_ASSIGN_POST' : '_SALE_INTENTION_DISTRIBUTE_POST';
			const param = this.distributeCompany ? {
				contract_company_id: this.contract_company_id,
				other_staff_id: staff.staff_id

			} : {
				customer_id: this.customer_ids,
				other_staff_id: staff.staff_id

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
				this.$refs.modal.buttonLoading = false;
				this.$Message.error(res.msg);
			});
		},
		handleRowClick(row, index) {
			this.$refs.tableTarget.$refs.tableTarget.toggleSelect(index);
			
		},
		setSelectsShow: debounce(function (arr) {
			this.selectsShow = [...arr];
		}, 50)
		
	}
};
export const ChooseStaff = CreatePortal({}, module.exports.default);
</script>
<style lang="scss" >
.v-hr-course-choose-staff{
	.vc-paging {
		margin-bottom: 0px;
		.__footer {
			position: relative;
			width: auto !important ; 
			// border: 1px solid lightgrey;		
			box-shadow: none;
			border-top: none;
			padding-left: 28px !important;
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
	
}
</style>

