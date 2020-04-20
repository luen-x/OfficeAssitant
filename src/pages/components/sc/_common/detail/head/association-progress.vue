<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true"
			:mask-closable="false"
			width="900px"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				关联合同
			</div>

			<div style="margin-top:4px;">
				<i-input
					v-model="search"
					placeholder="请输入公司名称"
					style="width: 300px;margin-left:250px;"
					clearable
					@on-enter="handleSearch"
					@on-change="handleInputChange"
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

			<i-tabs
				value="4"
				type="card"
				class="g-tabs-card"
				@on-click="handleSwitchTabs"
			>
				<i-tab-pane name="4" label="已分配">
					<oa-failure
						v-if="tabs == '4'"
						key="2"
						ref="distribute"
						:product_id="product_id"
						:project_id="project_id"
						:type="tabs"
						:searchs="searchs"
						@event="handleGetId"
					/>
				</i-tab-pane>
				<i-tab-pane name="6" label="已失效">
					<oa-failure
						v-if="tabs == '6'"
						ref="abate"
						key="1"
						:product_id="product_id"
						:project_id="project_id"
						:type="tabs"
						:searchs="searchs"
						@event="handleGetId"
					/>
				</i-tab-pane>
			</i-tabs>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Input, Button, Table, Radio, Tabs, TabPane } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";
import Failure from "./failure";

export default {
	name: "sc-assciation-progress",

	components: {
		"i-modal": Modal,
		"i-input": Input,
		"i-button": Button,
		"i-table": Table,
		"i-tabs": Tabs,
		"i-tab-pane": TabPane,
		"oa-failure": Failure
	},

	props: {
		name: String,
		product_id: Number,
		contract_id: Number,
		project_id: Number,
		contract_num: String
	},

	data() {
		return {
			new_project_id: "", // 	新项目id
			new_contract_id: "", // 新合同id
			new_contract_num: "", // 新合同编号
			tabs: "4",
			visible: false,
			search: "", // 客户公司名
			searchs: "",
			obj: {}
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
			this.searchs = this.search;
		},

		handleOk() {	
			if (!this.obj.new_project_id) {
				this.$Message.error("请选择关联的产品");
				this.$refs.modal.buttonLoading = false;

				return;
			}

			this.handleSave();
		},

		handleSave() {
			this.$request({
				url: API_ROOT._SC_CUSTOMER_COOPERATE_RELATION_CONTRACT_POST,
				type: "POST",
				param: {
					old_project_id: this.obj.new_project_id,
					old_contract_id: this.obj.new_contract_id,
					old_contract_num: this.obj.new_contract_num,
					new_project_id: this.project_id,
					new_contract_id: this.contract_id,
					new_contract_num: this.contract_num
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

		handleGetId(val) {
			this.obj = val;
		},

		handleCancel() {
			this.$emit("close");
		}
	}
};
export const AssociationModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
</style>