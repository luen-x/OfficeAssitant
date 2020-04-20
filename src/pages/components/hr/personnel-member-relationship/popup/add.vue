<template>
	<i-modal 
		ref="modal" 
		v-model="visible" 
		:loading="true"
		:mask-closable="false"
		class="v-sc-cooperate-scp"
		width="680px"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			新增师傅
		</div>
		<div class="g-fs-14 g-m-b-20" style="color:#E84C57">选择一位员工并作为师傅添加到师徒关系表内</div>
		<div class="g-flex  g-m-b-20">
			<i-input
				v-model="query.search"
				placeholder="请输入员工姓名/手机"
				style="width: 220px"
				class="g-m-r-10"
				@on-enter="handleSearch"
				@on-change="handleSearch"
			/>
			<i-cascader
				v-model="query.depart_id"
				:data="departArr"
				:change-on-select="true"
				style="width: 220px"
				class="g-m-r-10"
				clearable
				transfer
				trigger="click"
				placeholder="请选择部门"
				@on-change="handleChangeDepart"
			/>
			<i-button type="primary" @click="handleSearch">搜索</i-button>
		</div>
		<div>
			<i-table 
				ref="table"
				:columns="columns" 
				:data="data" 
				:border="false" 
				stripe
				@on-row-click="handleRowClick"
			/>
		</div>
		<div slot="footer" style="marginTop:-15px">
			<i-button type="text" @click="handleCancel">取消</i-button>
			<i-button type="primary" @click="handleOk">下一步</i-button>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Input, Button, Table, Radio, Cascader } from "iview";
import { CreatePortal } from "wya-vc";
import { getParseUrl, getHashUrl, initTreeData } from "@utils/utils";
import { services, staffByMutiTermNew } from "@stores/services/hr";
import API_ROOT from "@stores/apis/root";
import { AddApprentice } from "./add-apprentice";

export default {
	name: "sc-select-charge-person",

	components: {
		"i-modal": Modal,
		"i-input": Input,
		"i-button": Button,
		"i-table": Table,
		"i-cascader": Cascader,
	},
	data() {
		return {
			currentId: "",
			staff_name: "", // 主要负责人姓名
			visible: false,
			departArr: [],
			query: {
				depart_id: [],
				search: '',
			},
			columns: [
				{
					title: " ",
					key: "radio",
					width: 30,
					render: (h, params) => {
						let id = params.row.staff_id;
						let defaultS = false;
						if (this.currentId == id || (!this.currentId && params.row._checked)) {
							defaultS = true;
						} else {
							defaultS = false;
						}
						let self = this;
						return h(Radio, {
							style: {
								marginRight: "5px"
							},
							props: {
								value: defaultS
							},
							on: {
								input() {
									self.currentId = id;
									self.staff_name = params.row.staff_name;
								}
							}
						});
					}
				},
				{
					title: '姓名',
					key: 'staff_name',
					align: 'left',
					minWidth: 120,
				},
				{
					title: '手机号码',
					key: 'mobile',
					width: 120,
				},
				{
					title: '部门',
					key: 'depart_name',
					minWidth: 120,
					
				},
				{
					title: '职位',
					key: 'position_name',
					minWidth: 120,
				}
			],
			data: [],
			page: 1,
			flag: false // 判断请求的数组是否为空
		};
	},

	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},

	mounted() {
		this.loadDepart(this.$global.staff.depart_id);
		// 添加滚动事件
		this.$refs.table.$el.addEventListener(
			"scroll",
			this.scrollBottom
		);

		this.loadData(this.page);
		this.visible = true;
	},

	methods: {
		loadDepart(depart_id) {
			this.$request({
				url: "_HR_EMPLOYEE_CI_DEPART_SON_GET",
				type: "GET",
				param: {
					depart_id
				},
				loading: false
			}).then(res => {
				this.departArr = initTreeData(
					res.data,
					"depart_id",
					"depart_name"
				);
			}).catch(err => {});
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.page = 1;
				this.data = [];
				// this.loadData(this.page);
				this.handleSearch(); 
			}
		},

		handleSearch() {
			this.page = 1;
			this.data = [];
			this.$refs.table.$el.addEventListener(
				"scroll",
				this.scrollBottom
			);
			this.loadData(this.page);
		},

		loadData(page) {
			this.$request({
				url: API_ROOT._HR_PERSONNEL_MEMBER_MEMBER_RELATIONSHIP_ADD_MASTER_GET,
				type: "GET",
				param: {
					page: page || 1,
					search: this.query.search,
					depart_id: this.query.depart_id ? this.query.depart_id.map(item => Number(item)) : ''
				}
			}).then(res => {
				this.flag = false;
				if (res.data.list.length == 0) {
					// 移除滚动事件
					this.$refs.table.$el.removeEventListener("scroll", this.scrollBottom);
					return;
				} 
				let staffArr = _.uniqWith([...this.data, ...res.data.list], _.isEqual); // 去重
				this.data = staffArr;
				this.data.forEach(item => {
					item._checked ? this.currentId = item.staff_id : "";
					item._checked ? this.staff_name = item.staff_name : "";
				});
			}).catch(error => {
			});
		},

		handleOk() {
			if (!this.currentId) {
				this.$Message.error("请选择师傅");
				this.$refs.modal.buttonLoading = false;
				return;
			}
			this.handleSave();
		},

		handleSave() {
			this.visible = false;
			AddApprentice.popup({
				master_name: this.staff_name,
				master_id: this.currentId,
				type: 1
			}).then(res => {
			});
		},

		handleCancel() {
			this.$emit("close");
		},

		scrollBottom(e) {
			if (this.flag) {
				return;
			}
			if (e.target.scrollTop + e.target.clientHeight > e.target.scrollHeight - 10) {
				this.flag = true;
				this.page++; 
				this.loadData(this.page);
			}
		},
		handleChangeDepart(val) {
			this.query.depart_id = val;
			// this.loadData();
			this.handleSearch(); 
		},
		handleRowClick(row) {
			this.currentId = row.staff_id;
			this.staff_name = row.staff_name;
		}
	}
};
export const AddModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-sc-cooperate-scp {
	.ivu-table-wrapper {
		border: none;
		max-height: 294px;
		overflow-x: hidden;
		overflow-y: auto;
	}
	.ivu-table {
		th,
		td {
			border: none;
		}
	}
	.ivu-table-overflowX{
		overflow-x:hidden!important;
	}
	.ivu-table:after {
		width: 0;
	}

	.ivu-table:before {
		height: 0;
	}
}
</style>