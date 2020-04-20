<template>
	<i-drawer
		v-model="closable"
		:mask="false"
		:mask-closable="false"
		class="v-sc-customer-distribute-detail"
		@on-close="handleCancel"
	>
		<div class="g-pd-b-20 g-fs-18 g-bb">
			{{ +type === 1 ? staff_name : contract_company_name }}
		</div>

		<div class="g-m-t-20">
			<i-input
				v-if="+type === 2"
				v-model="search.staff_name"
				clearable
				placeholder="请输入员工姓名"
				style="width: 220px;"
				class="g-m-r-10"
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>

			<i-date-picker
				v-if="+type === 1 || +type === 2"
				v-model="search.month"
				clearable
				transfer
				type="month"
				placeholder="请选择月份"
				style="width: 220px;"
				@on-change="handleSearch"
			/>

			<vc-debounce-click
				:tag="Button"
				type="primary"
				class="g-m-l-10 g-red-btn-small"
				style="width: 60px;height:32px"
				@click="handleSearch"
			>
				搜索
			</vc-debounce-click>
		</div>

		<i-table
			:columns="columns"
			:data="tableData" 
			class="g-m-t-20"
			stripe
		/>
	</i-drawer>
</template>

<script>
import { Drawer, Table, Input, DatePicker, Button } from "iview";
import { CreatePortal } from "wya-vc";
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import moment from "moment";
import { Confirm } from "@components/_common/confirm/confirm";
import { WorkRegister } from "./work-register";

export default {
	name: "sc-cooperate-distribute-detail-drawer",

	components: {
		"i-drawer": Drawer,
		"i-table": Table,
		"i-input": Input,
		"i-date-picker": DatePicker
	},

	props: {
		type: String,
		staff_id: Number,
		contract_company_id: Number,
		staff_name: String,
		contract_company_name: String
	},

	data() {
		return {
			closable: false,
			search: {
				staff_name: "",
				month: ""
			},
			columns: [
				{
					title: "姓名",
					key: "staff_name",
					minWidth: 120
				},
				{
					title: "日期",
					key: "complete_time",
					minWidth: 120
				},
				{
					title: "服务公司",
					key: "contract_company_name",
					minWidth: 160,
					render: (h, params) => {
						return (
							<AutoToolTip 
								content={params.row.contract_company_name}
								width="140px"
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				},
				{
					title: "品牌名称",
					key: "brand_name",
					minWidth: 100
				},
				{
					title: "海报张数",
					key: "poster_num",
					minWidth: 120
				},
				{
					title: "海报文案完成数",
					key: "poster_copy_num",
					minWidth: 120
				},
				{
					title: "朋友圈文案完成数",
					key: "circle_copy_num",
					minWidth: 140
				},
				{
					title: "操作",
					key: "",
					minWidth: 120,
					render: (h, params) => {
						let isEdit = params.row.is_edit;
						let editShow = (+this.$route.query.flag === 1 && this.$auth[1471]) || (+this.$route.query.flag === 2 && this.$auth[1478]);
						let deleteShow = (+this.$route.query.flag === 1 && this.$auth[1472]) || (+this.$route.query.flag === 2 && this.$auth[1479]);

						return (
							<div class="g-c-blue-mid g-flex">
								{
									isEdit
										? <div class="g-flex">
											{
												editShow 
													? <div class="g-flex">
														<div class="g-pointer" onClick={() => this.handleEdit(params.row.staff_work_id)}>编辑</div>
														<div class="g-m-lr-10">|</div>
													</div> : null
											}
											{
												deleteShow 
													? <div class="g-pointer" onClick={() => this.handleDel(params.row.staff_work_id)}>删除</div>
													: null
											}
										</div> : null
								}
							</div>
						);
					}
				}
			],
			tableData: []
		};
	},
    
	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},

	mounted() {	
		this.loadData();
		this.closable = true;
	},

	methods: {
		loadData() {
			this.tableData = [];

			this.$request({
				url: "_SC_CUSTOMER_COOPERATE_WORK_RECORD_GET",
				type: "GET",
				param: {
					staff_id: +this.type === 1 ? this.staff_id : "",
					contract_company_id: +this.type === 2 ? this.contract_company_id : "",
					...this.search,
					month: this.search.month && moment(this.search.month).format("YYYY-MM")
				},
				loading: false
			}).then(res => {
				this.tableData = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		handleSearch() {
			this.loadData();
		},

		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
        
		handleEdit(staff_work_id) {
			WorkRegister.popup({
				staff_work_id: Number(staff_work_id)
			}).then(res => {
				this.loadData();
			});
		},

		handleDel(staff_work_id) {
			Confirm.popup({
				title: "删除提示",
				msg: "是否确认删除该条数据？",
				showIcon: true
			}).then(() => {
				this.$request({
					url: '_SC_CUSTOMER_COOPERATE_WORK_DEL_POST',
					type: 'POST',
					loading: false,
					param: {
						staff_work_id
					}
				}).then(res => {
					this.$Message.success(res.msg);
					this.loadData();
				}).catch(error => {});
			}).catch(error => {});
		},

		handleCancel() {
			this.$emit("close");
		}
	}
};

export const DetailDrawer = CreatePortal({
	alive: true
}, module.exports.default);
</script>

<style lang="scss">
.v-sc-customer-predistribute-detail {
    .ivu-drawer-body{
        padding: 0px;
    }
}
</style>