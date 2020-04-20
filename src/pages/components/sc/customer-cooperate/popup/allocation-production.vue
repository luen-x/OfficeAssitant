<template>
	<i-modal
		ref="modal"  
		v-model="visible" 
		:loading="true"
		:mask-closable="false"
		class="c-modal-containers"
		width="900px"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			分配制作
		</div>

		<div style="margin:4px 0 20px 0">
			<i-input 
				v-model="staff_names" 
				placeholder="请输入姓名" 
				style="width: 220px;margin-right:10px;"
				clearable
				@on-enter="handleSearch" 
				@on-change="handleInputChange"
			/>
			<i-input 
				v-model="product_names" 
				placeholder="请输入产品名称" 
				style="width: 220px;" 
				clearable
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

		<i-tabs 
			value="allocatePeople"
			type="card" 
			class="g-tabs-card"
			@on-click="handleSwitchTabs"
		>
			<i-tab-pane 
				name="allocatePeople"
				label="分配人员"
			>
				<oa-allocate-people
					:staff_name="staff_name"
					:product_name="product_name"
					:make_id="make_id"
					:product_assign_id="product_assign_id"
					@event="handleGetIds"
				/>
			</i-tab-pane>
			<i-tab-pane 
				name="distributionRecords"
				label="分配记录"
			>
				<oa-distribution-records
					:staff_name="staff_name"
					:product_name="product_name"
				/>
			</i-tab-pane>
		</i-tabs>
	</i-modal>
</template>

<script>
import { Modal, Input, Button, Tabs, TabPane } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";
import DistributionRecords from "./distribution-records";
import AllocatePeople from "./allocate-people";

export default {
	name: "sc-allocation-production",

	components: {
		"i-modal": Modal,
		"i-input": Input,
		"i-button": Button,
		"i-tabs": Tabs,
		"i-tab-pane": TabPane,
		"oa-distribution-records": DistributionRecords,
		"oa-allocate-people": AllocatePeople
	},

	props: {
		name: String,
		make_id: Number,
		product_assign_id: Number
	},

	data() {
		return {
			tabs: "allocatePeople",
			currentId: "",
			visible: false,
			staff_name: "",
			staff_names: "",
			ids: null,
			product_name: "",
			product_names: ""
		};
	},

	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},

	mounted() {
		this.visible = true;
	},

	methods: {
		// 切换标签页
		handleSwitchTabs(name) {
			this.tabs = name;
		},

		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},

		// 搜索
		handleSearch() {
			this.staff_name = this.staff_names;
			this.product_name = this.product_names;
		},

		handleOk() {
			if (this.ids.length == 0) {
				this.$Message.warning("请先选择分配人员！");
				this.visible = true;
				this.$refs.modal.buttonLoading = false;

				return;
			}

			if (this.ids.length > 5) {
				this.$Message.warning("最多只能选择5分配人员！");
				this.visible = true;
				this.$refs.modal.buttonLoading = false;

				return;
			}

			this.$emit("sure", this.ids);
		},

		handleCancel() {
			this.$emit("close");
		},

		// 得到ids
		handleGetIds(value) {
			this.ids = value;
		}
	}
};

export const AllocationProductionModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
/deep/ .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar {
	div:nth-of-type(2){
		border-radius: 4px 0 0 0;
	}

	div:nth-of-type(3){
		border-radius: 0 4px 0 0;
	}
}
</style>