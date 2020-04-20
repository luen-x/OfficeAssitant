<template>
	<i-modal 
		ref="modal" 
		v-model="visible" 
		:loading="true"
		:mask-closable="false"
		class="v-sc-cooperate-pre"
		width="680px"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			选择主要负责人
		</div>

		<div style="width: 100%; min-height: 200px;padding-top: 14px;">
			<div class="g-m-b-20">
				<i-input 
					v-model="staff_name" 
					placeholder="请输入姓名" 
					clearable
					style="width: 300px;" 
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>

				<vc-debounce-click 
					:tag="Button"
					type="primary"
					class="g-m-l-10 g-red-btn-small"
					@click="handleSearch" 
				>
					搜索
				</vc-debounce-click>
			</div>
			
			<div>
				<i-table 
					ref="table"
					:columns="columns" 
					:data="tableData" 
					:border="false" 
					stripe
					@on-row-click="handleRowClick"
				/>
			</div>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Input, Button, Table, Radio } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";

export default {
	name: "sc-pre-select-charge-person",

	components: {
		"i-modal": Modal,
		"i-input": Input,
		"i-button": Button,
		"i-table": Table
	},

	props: {
		name: String,
		order_product_id: Number
	},

	data() {
		return {
			currentId: "",
			visible: false,
			staff_name: "", // 	主要负责人姓名
			columns: [
				{
					title: " ",
					key: "radio",
					mimWidth: 50,
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
								}
							}
						});
					}
				},
				{
					title: "姓名",
					key: "staff_name",
					minWidth: 150,
					tooltip: true
				},
				{
					title: "部门",
					key: "depart_name",
					minWidth: 150,
					tooltip: true
				},
				{
					title: "职位",
					key: "position_name",
					minWidth: 150,
					tooltip: true
				}
			],
			tableData: [],
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
		// 添加滚动事件
		this.$refs.table.$el.addEventListener(
			"scroll",
			this.scrollBottom
		);

		this.handleGetData(this.page);

		this.visible = true;
	},

	methods: {
		handleInputChange(e) {
			if (!e.target.value) {
				this.page = 1;
				this.tableData = [];
				this.handleGetData(this.page);
			}
		},

		handleSearch() {
			// 添加滚动事件
			this.$refs.table.$el.addEventListener("scroll", this.scrollBottom);
			this.page = 1;
			this.tableData = [];
			this.handleGetData(this.page);
		},

		handleGetData(page) {
			this.$request({
				url: API_ROOT._SC_CUSTOMER_PREDISTRIBUTE_STAFF_LIST_GET,
				type: "GET",
				param: {
					order_product_id: this.order_product_id,
					staff_name: this.staff_name,
					page
				}
			}).then(res => {
				this.flag = false;

				if (res.data == 0) {
					// 移除滚动事件
					this.$refs.table.$el.removeEventListener("scroll", this.scrollBottom);

					return;
				}

				this.tableData = [...this.tableData, ...res.data];

				this.tableData.forEach(item => {
					item._checked ? this.currentId = item.staff_id : "";
				});
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		handleOk() {
			if (!this.currentId) {
				this.$Message.error("请选择主要负责人");
				this.$refs.modal.buttonLoading = false;

				return;
			}

			this.handleSave();
		},

		handleSave() {
			this.$request({
				url: API_ROOT._SC_CUSTOMER_PREDISTRIBUTE_ASSIGN_MAIN_POST,
				type: "GET",
				param: {
					order_product_id: this.order_product_id,
					main_person_id: this.currentId
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.$refs.modal.buttonLoading = false;
				this.visible = false;
				this.$emit("sure", true);
			}).catch(error => {
				this.$Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
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
				this.handleGetData(this.page);
			}
		},

		handleRowClick(row) {
			this.currentId = row.staff_id;
		}
	}
};
export const PreChargePersonModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
	.v-sc-cooperate-pre {
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

		.ivu-table:after {
			width: 0;
		}

		.ivu-table:before {
			height: 0;
		}

		.ivu-table-overflowX{
			overflow-x: hidden;
		}
	}
</style>