<template>
	<i-modal 
		ref="modal" 
		v-model="visible" 
		:loading="true"
		:mask-closable="false"
		class="v-sc-pre-distribute-modal"
		width="680px"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			分配制作
		</div>

		<div style="margin:4px 0 20px 0;">
			<i-input 
				v-model="staff_name" 
				placeholder="请输入姓名" 
				style="width: 220px;"
				clearable
				@on-enter="handleSearch" 
				@on-change="handleInputChange"
			/>

			<vc-debounce-click
				:tag="Button"
				type="primary"
				class="g-red-btn-small"
				style="margin-left: 8px;"
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
			stripe 
			@on-select="handleSelect"
			@on-select-cancel="handleSelectCancel"
			@on-row-click="handleRowClick"
		/>
	</i-modal>
</template>

<script>
import { Modal, Input, Button, Table } from "iview";
import API_ROOT from "@stores/apis/root";
import { CreatePortal } from "wya-vc";

export default {
	name: "sc-allocate-people",

	components: {
		"i-modal": Modal,
		"i-input": Input,
		"i-button": Button,
		"i-table": Table
	},

	props: {
		assign_id: Number
	},

	data() {
		return {
			spin: false,
			visible: false,
			ids: [],
			count: 0, // 计算是否超过5个人
			staff_name: "",
			columns: [
				 {
					type: 'selection',
					align: 'center',
					minWidth: 50
				},
				{
					title: "姓名",
					key: "staff_name",
					minWidth: 120,
					tooltip: true
				},
				{
					title: "部门",
					key: "depart_name",
					minWidth: 100,
					tooltip: true
				},
				{
					title: "职位",
					key: "position_name",
					minWidth: 140,
					tooltip: true
				}
			],
			tableData: [],
			flag: false, // 判断请求的数组是否为空
			page: 1,
			select_arr: [] // 选中的数据
		};
	},
    
	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},

	async mounted() {
		await this.handleGetdata("", 1);

		// 添加滚动事件
		this.$refs.table.$el.addEventListener("scroll", this.scrollBottom);
		this.visible = true;
	},

	methods: {
		handleSelect(ids, row) {
			// 设置被选中的_checked值
			this.handleSetChecked(true, row);
			this.select_arr = [...this.select_arr, ...ids];

			let hash = {};

			this.select_arr.forEach(v => {
				if (!hash[v.staff_id]) {
					hash[v.staff_id] = v;
				}
			});

			this.select_arr = Array.from(Object.values(hash));
		},
        
		// 搜索
		handleSearch() {
			// 添加滚动事件
			this.$refs.table.$el.addEventListener("scroll", this.scrollBottom);
			this.page = 1;
			this.tableData = [];
			this.handleGetdata(this.staff_name, 1);
		},
        
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},

		handleSelectCancel(selection, row) {
			// 取消被选中的_checked值
			this.handleSetChecked(false, row);

			let arr = [];

			this.select_arr.forEach(elemment => {
				if (row.staff_id != elemment.staff_id) {
					arr.push(elemment);
				}
			});

			this.select_arr = [...arr];
		},

		handleGetdata(staff_name, page) {
			this.$request({
				url: API_ROOT._SC_CUSTOMER_PREDISTRIBUTE_STAFF_LIST_GET,
				type: "GET",
				param: {
					staff_name,
					assign_id: this.assign_id,
					page
				}
			}).then(res => {
				this.flag = false;

				if (res.data.length == 0) {
					// 移除滚动事件
					this.$refs.table.$el.removeEventListener("scroll", this.scrollBottom);
				}

				this.count = 0;
				this.ids = [];

				res.data.forEach(item => {
					if (this.select_arr.length != 0) {
						item._checked = false;

						this.select_arr.forEach(elemment => {
							if (item.staff_id == elemment.staff_id) {
								item._checked = true;
							}
						});
					}

					if (item._checked) {
						this.ids.push(item);
					}
				});

				if (this.select_arr.length == 0) {
					this.select_arr = [...this.ids];
				}

				this.tableData.push(...res.data);
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		
		scrollBottom(e) {
			if (this.flag) {
				return;
			}

			if (e.target.scrollTop + e.target.clientHeight > e.target.scrollHeight - 10) {
				this.flag = true;
				this.page++; 
				this.handleGetdata(this.staff_name, this.page);
			}
		},

		handleSetChecked(bool, row) {
			for (let item of this.tableData) {
				if (item.staff_id == row.staff_id) {
					item._checked = bool;
					break;
				}
			}
		},
        
		handleCancel() {
			this.$emit("close");
		},

		handleRowClick(row, index) {
			this.$refs.table.toggleSelect(index);
		},
        
		handleOk() {
			if (this.select_arr.length === 0) {
				this.$Message.warning("请先选择分配制作人员");
				this.$refs.modal.buttonLoading = false;

				return;
			}

			this.$emit("sure", this.select_arr);
		}
	}
};
export const PreDistributeModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-sc-pre-distribute-modal{
	.ivu-table-wrapper {
		border: 0px;
		max-height: 251px;
		overflow-x: hidden;
		overflow-y: auto;
	}

	.ivu-table-overflowX {
		overflow-x: hidden;
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

	.ivu-table {
		th:nth-of-type(1) {
			.ivu-checkbox-wrapper {
				display: none;
			}
		}
	}
}
</style>