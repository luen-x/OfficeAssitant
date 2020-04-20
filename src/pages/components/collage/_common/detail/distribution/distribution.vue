<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:mask-closable="false"
		:loading="true"
		class="v-collage-cooperate-distribute"
		width="680px"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			选择部门
		</div>

		<div style="margin:4px 0 20px 0;">
			<i-input
				v-model="search"
				placeholder="请输入部门或主管名字"
				style="width: 300px;height: 32px;"
				class="g-m-r-10"
				clearable
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>

			<vc-debounce-click
				:tag="Button"
				type="primary"
				class="g-red-btn-small"
				@click="handleSearch"
			>
				搜索
			</vc-debounce-click>

		</div>

		<i-table
			ref="table"
			:columns="columns"
			:data="tableData"
			:border="false"
			@on-row-click="handleRowClick"
		/>
	</i-modal>
</template>

<script>
import { Modal, Input, Button, Table, Radio } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";

export default {
	name: "collage-allocation-production",

	components: {
		"i-modal": Modal,
		"i-input": Input,
		"i-button": Button,
		"i-table": Table
	},

	props: {
		project_id: [Number, Array]
	},

	data() {
		return {
			visible: false,
			search: "",
			currentId: "",
			columns: [
				{
					title: " ",
					key: "radio",
					minWidth: 45,
					render: (h, params) => {
						let id = params.row.depart_id;
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
					title: "部门",
					key: "depart_name",
					tooltip: true,
					minWidth: 120
				},
				{
					title: "主管",
					key: "manager",
					tooltip: true,
					minWidth: 120
				}
			],
			tableData: []
		};
	},

	mounted() {
		this.loadData();
		this.visible = true;
	},

	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},

	methods: {
		handleInputChange(e) {
			if (!e.target.value) {
				this.tableData = [];
				this.loadData();
			}
		},
		
		handleOk() {
			if (!this.currentId) {
				this.$Message.warning("请选择需分配的部门!");
				this.$refs.modal.buttonLoading = false;
				this.visible = true;
				return;
			}

			this.$request({
				url: API_ROOT._COLLAGE_CUSTOMER_COOPERATE_ASSIGN_POST,
				type: "POST",
				param: {
					project_id: this.project_id,
					depart_id: this.currentId,
					has_auth: 1
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.$emit("sure", true);
				this.$store.commit("COLLAGE_CUSTOMER_COOPERATE_LIST_RESET", {
					type: ""
				});
			}).catch(error => {
				this.$Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
			
		},

		handleCancel() {
			this.$emit("close");
		},

		handleSearch() {
			this.tableData = [];
			this.loadData();
		},

		// 得到数据
		loadData() {
			this.$request({
				url: API_ROOT._COLLAGE_CUSTOMER_COOPERATE_DEPART_GET,
				type: "GET",
				param: {
					search: this.search,
					project_id: this.project_id
				}
			}).then(res => {
				this.tableData = res.data;
				this.tableData.forEach(item => {
					item._checked ? this.currentId = item.depart_id : "";
				});
			}).catch(error => {});
		},

		handleRowClick(row) {
			this.currentId = row.depart_id;
		}
	}
};

export const DistributionModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-collage-cooperate-distribute {
	.ivu-table-wrapper {
		border: none;
		max-height: 294px;
		overflow-x: hidden;
		overflow-y: auto;
	}

	.ivu-table-overflowX {
		overflow-x: hidden;
	}
	
	.ivu-table-overflowY{
		max-height: 250px;
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

    .ivu-table {
        th:nth-of-type(1) {
            .ivu-checkbox-wrapper {
                display: none;
            }
        }
    }
}
</style>