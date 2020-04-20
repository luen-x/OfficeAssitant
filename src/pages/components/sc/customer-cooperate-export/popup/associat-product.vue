<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		class="v-sc-customer-export-associat-product"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			关联产品
		</div>

	
		<div class="g-m-b-20">
			<i-input
				v-model="product_name"
				:maxlength="20"
				placeholder="请输入产品名称"
				class="g-m-r-5"
				style="width: 220px;"
				clearable
				@on-enter="loadData"
				@on-change="handleInputChange"
			/>

			<i-select
				v-model="product_type"
				style="width:220px;"
				class="g-m-r-5"
				clearable
				@on-change="loadData"
			>
				<i-option
					v-for="item in types"
					:value="item.value"
					:key="item.value"
				>
					{{ item.label }}
				</i-option>
			</i-select>

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
			:data="data"
			:border="false"
			:stripe="true"
			@on-select="handleSelect"
			@on-row-click="handleRowClick"
		/>
	</i-modal>
</template>

<script>
import { Modal, Input, Button, Select, Option, Table, Message } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";

export default {
	name: "sc-allocat-product",

	components: {
		"i-table": Table,
		"i-modal": Modal,
		"i-input": Input,
		"i-button": Button,
		"i-select": Select,
		"i-option": Option
	},

	props: {
		template_id: String
	},

	data() {
		return {
			visible: false,
			ids: [],
			product_name: "", // 产品名称
			product_type: "", // 产品类型
			columns: [
				{
					type: "selection",
					align: "center"
				},
				{
					title: "产品名称",
					key: "product_name",
					tooltip: "true"
				},
				{
					title: "产品分类",
					key: "type_name"
				},
				{
					title: "所属部门",
					key: "depart_name"
				},
				{
					title: "导出模板",
					key: "template_name"
				}
			],
			data: [],
			types: [],
			model: ""
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

		this.$request({
			url: API_ROOT._SC_CUSTOMER_COOPERATE_EXPORT_PRODUCT_TYPE_GET,
			type: "GET",
			param: {}
		}).then(res => {
			this.types = res.data;
		}).catch(error => {});

		this.visible = true;
	},

	methods: {
		handleInputChange(e) {
			if (!e.target.value) {
				this.loadData();
			}
		},

		handleSelect(ids) {
			this.ids = ids;
		},

		loadData() {
			this.$request({
				url: API_ROOT._SC_CUSTOMER_COOPERATE_EXPORT_PRODUCT_GET,
				type: "GET",
				param: {
					template_id: this.template_id,
					product_name: this.product_name,
					product_type: this.product_type
				}
			}).then(res => {
				this.data = res.data;

				this.data.forEach(item => {
					item._checked && this.ids.push(item);
				});
			}).catch(error => {});
		},

		handleOk() {
			if (this.ids.length == 0) {
				Message.warning("请先选择你要关联的产品！");

				this.$refs.modal.buttonLoading = false;
				this.visible = true;

				return;
			} else {
				this.$refs.modal.buttonLoading = false;
			}

			let arr = [];

			this.ids.forEach(item => {
				arr.push(item.product_id);
			});

			this.$request({
				url: API_ROOT._SC_CUSTOMER_COOPERATE_EXPORT_TEMPLATE_POST,
				type: "POST",
				param: {
					template_id: this.template_id,
					product_ids: arr.join(",")
				}
			}).then(res => {
				this.$Message.success(res.msg);
			}).then(() => {
				this.$emit("sure");

				this.$store.commit('SC_CUSTOMER_COOPERATE_EXPORT_LIST_RESET', {
					type: ""
				});
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		handleCancel() {
			this.$emit("close");
		},

		handleSearch() {
			this.loadData();
		},

		handleRowClick(row, index) {
			this.$refs.table.toggleSelect(index);
		}
	}
};

export const AllocatProductModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-sc-customer-export-associat-product{
	.ivu-modal{
		width: 680px !important;
	}

	.ivu-table-wrapper {
		border: 0px;
		max-height: 304px;
		overflow-x: hidden;
		overflow-y: auto;
	}

	.ivu-table-overflowX {
		overflow-x: hidden;
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