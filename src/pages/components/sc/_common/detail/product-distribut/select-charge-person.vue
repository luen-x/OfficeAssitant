<template>
	<i-modal 
		ref="modal" 
		v-model="visible" 
		:loading="true"
		:mask-closable="false"
		class="v-sc-customer-select-charge-person"
		width="900px"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			选择主要负责人
		</div>

		<div style="width: 100%; min-height: 200px;margin-top: 14px;" >
			<div style="margin-bottom:20px;">
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
					@on-row-dblclick="handleDbClick"
				/>

				<div class="g-flex g-flex-ac">
					<span class="g-inline g-m-t-10">同步产品分工：</span>

					<i-select 
						v-model="child" 
						style="width:220px" 
						class="g-m-t-10"
						multiple
						clearable
					>
						<i-option 
							v-for="(item,index) in assign" 
							:value="item.product_assign_id" 
							:key="index"
						>
							{{ item.child_product_name }}
						</i-option>
					</i-select>
				</div>
			</div>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Input, Button, Table, Radio, Select, Option } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";
import lodash from "lodash";

export default {
	name: "sc-select-charge-person",

	components: {
		"i-modal": Modal,
		"i-input": Input,
		"i-button": Button,
		"i-table": Table,
		"i-select": Select,
		"i-option": Option 
	},

	props: {
		name: String,
		project_id: Number,
		make_id: Number,
		assign: Array
	},

	data() {
		return {
			currentId: "",
			main_person_name: "", // 主要负责人姓名
			visible: false,
			staff_name: "", // 	主要负责人姓名
			columns: [
				{
					title: " ",
					key: "radio",
					minWidth: 45,
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
									self.main_person_name = params.row.staff_name;
								}
							}
						});
					}
				},
				{
					title: "姓名",
					key: "staff_name",
					minWidth: 70,
					tooltip: true
				},
				{
					title: "部门",
					key: "depart_name",
					minWidth: 70,
					tooltip: true
				},
				{
					title: "职位",
					key: "position_name",
					minWidth: 70,
					tooltip: true
				},		
				{
					title: "待完成单量",
					key: "wait_complete_count",
					minWidth: 75,
					tooltip: true
				},
				{
					title: "本月单量",
					key: "month_complete_count",
					minWidth: 70,
					tooltip: true
				},
				{
					title: "今年单量",
					key: "year_complete_count",
					minWidth: 70,
					tooltip: true
				},
				{
					title: "累计单量",
					key: "total_count",
					minWidth: 70,
					tooltip: true
				},
				{
					title: "最近一单时间",
					key: "last_time",
					minWidth: 140,
					tooltip: true
				}
			],
			tableData: [],
			page: 1,
			flag: false, // 判断请求的数组是否为空
			child: "", // 分工的product_assign_id数组 
			cityList: [{
				value: 'New York',
				label: "软文"
			}, {
				value: 'New York',
				label: "关键字"
			}]
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

		this.loadData(this.page);
		this.visible = true;
	},

	methods: {
		handleInputChange(e) {
			if (!e.target.value) {
				this.page = 1;
				this.tableData = [];
				this.loadData(this.page);
			}
		},

		handleSearch: lodash.debounce(function (event) {
			this.page = 1;
			this.tableData = [];
			this.loadData(this.page);
		}, 500),

		loadData(page) {
			this.$request({
				url: API_ROOT._SC_CUSTOMER_COOPERATE_MAIN_PERSON_GET,
				type: "GET",
				param: {
					staff_name: this.staff_name,
					make_id: this.make_id,
					page
				}
			}).then(res => {
				this.flag = false;

				if (res.data.list.length == 0) {
					// 移除滚动事件
					this.$refs.table.$el.removeEventListener("scroll", this.scrollBottom);

					return;
				}

				this.tableData = [...this.tableData, ...res.data.list];

				this.tableData.forEach(item => {
					item._checked == 0 ? item._checked = false : item._checked = true;
					item._checked ? this.currentId = item.staff_id : "";
					item._checked ? this.main_person_name = item.staff_name : "";
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
				url: API_ROOT._SC_CUSTOMER_COOPERATE_SAVE_PERSON_POST,
				type: "POST",
				param: {
					project_id: this.project_id,
					staff_id: this.currentId,
					child: this.child
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
				this.loadData(this.page);
			}
		},

		handleRowClick(row) {
			this.currentId = row.staff_id;
			this.main_person_name = row.staff_name;
		},

		handleDbClick(row) {
			this.currentId = row.staff_id;
			this.main_person_name = row.staff_name;

			this.handleOk();
		}
	}
};
export const SelectChargePersonModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-sc-customer-select-charge-person {
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