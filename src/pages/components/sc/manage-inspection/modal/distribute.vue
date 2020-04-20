<template>
	<i-modal 
		ref="modal" 
		v-model="visible" 
		:loading="true"
		:mask-closable="false"
		class="v-sc-manage-inspection-distribute"
		width="900px"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			分配客户
		</div>

		<div style="width: 100%; min-height: 200px;" >
			<div class="g-m-b-20" style="padding-top: 14px;">
				<i-input 
					v-model="search" 
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
	name: "sc-manage-inspection-distribute",

	components: {
		"i-modal": Modal,
		"i-input": Input,
		"i-button": Button,
		"i-table": Table
	},

	props: {
		name: String,
		quality_id: Number,
		quality_ids: Array
	},

	data() {
		return {
			assign_staff_id: "",
			visible: false,
			search: "", // 	主要负责人姓名
			columns: [
				{
					title: " ",
					key: "radio",
					minWidth: 50,
					render: (h, params) => {
						let id = params.row.staff_id;
						let defaultS = false;

						if (this.assign_staff_id == id || (!this.assign_staff_id && params.row._checked)) {
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
									self.assign_staff_id = id;
								}
							}
						});
					}
				},
				{
					title: "姓名",
					key: "staff_name",
					minWidth: 80,
					tooltip: true
				},
				{
					title: "部门",
					key: "depart_name",
					minWidth: 80,
					tooltip: true
				},
				{
					title: "职位",
					key: "position_name",
					minWidth: 80,
					tooltip: true
				},		
				{
					title: "待回访客户",
					key: "wait_quality",
					minWidth: 100,
					tooltip: true
				},
				{
					title: "本月回访次数",
					key: "month_quality",
					minWidth: 90,
					tooltip: true
				},
				{
					title: "本年度回访次数",
					key: "year_quality",
					minWidth: 100,
					tooltip: true
				},
				{
					title: "最近回访时间",
					key: "last_quality_time",
					minWidth: 110,
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
		this.$refs.table.$el.addEventListener("scroll", this.scrollBottom);
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
			this.page = 1;
			this.tableData = [];
			this.handleGetData(this.page);
		},

		handleGetData(page) {
			this.$request({
				url: API_ROOT._SC_MANAGE_INSPECTION_ASSIGN_LIST_GET,
				type: "GET",
				param: {
					search: this.search,
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
					item._checked ? this.assign_staff_id = item.staff_id : "";
				});
			}).catch(error => {
			});
		},

		handleOk() {
			if (!this.assign_staff_id) {
				this.$Message.error("请选择主要负责人");
				this.$refs.modal.buttonLoading = false;
				return;
			}

			this.handleSave();
		},

		handleSave() {
			this.$request({
				url: API_ROOT._SC_MANAGE_INSPECTION_OPERATE_POST,
				type: "POST",
				param: {
					quality_ids: this.quality_ids ? this.quality_ids.join(",") : this.quality_id,
					operate_type: 2,
					assign_staff_id: this.assign_staff_id
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.$refs.modal.buttonLoading = false;
				this.visible = false;
				this.$emit('sure', true);
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
			this.assign_staff_id = row.staff_id;
		}
	}
};
export const DistributeModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-sc-manage-inspection-distribute {
	.ivu-table-wrapper {
		border: none;
		max-height: 294px;
		overflow-x: hidden;
		overflow-y: auto;
	}

	.ivu-table {
		th,td {
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