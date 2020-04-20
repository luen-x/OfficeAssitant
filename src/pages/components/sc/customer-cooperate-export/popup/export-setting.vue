<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		class="v-sc-customer-export-setting"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			导出模板
		</div>

		<div class="_search">
			<i-form
				ref="form"
				:label-width="90"
				:model="formData"
				:rules="rule"
			>
				<i-form-item
					label="模板名称："  
					prop="template_name"
				>
					<i-input
						v-model="formData.template_name"
						:maxlength="15"
						placeholder="请输入模板名称"
						style="width: 300px;"
					/>
				</i-form-item>
			</i-form>

			<vc-debounce-click
				style="margin-right: 8px"
				class="g-red-btn-line"
				@click="handleEmpty"
			>
				清空选项
			</vc-debounce-click>
		</div>
		<div class="g-tabs-card">
			<i-tabs
				value="basicInformation"
				type="card"
				@on-click="handleSwitchTabs"
			>
				<i-tab-pane
					name="basicInformation"
					label="基础信息"
				>
					<oa-select
						:date="date['1']"
						:arr="arr"
						@event="handleGetData"
					/>
				</i-tab-pane>
				<i-tab-pane
					name="customerInformation"
					label="客户信息"
				>
					<oa-select
						:date="date['2']"
						:arr="arr"
						@event="handleGetData"
					/>
				</i-tab-pane>
				<i-tab-pane
					name="projectRequirement"
					label="项目需求"
				>
					<oa-select
						:date="date['3']"
						:arr="arr"
						@event="handleGetData"
					/>
				</i-tab-pane>
				<i-tab-pane
					name="processSteps"
					label="流程步骤"
				>
					<oa-select
						:date="date['4']"
						:arr="arr"
						@event="handleGetData"
					/>
				</i-tab-pane>
			</i-tabs>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Input, Button, Tabs, TabPane, Message, Form, FormItem } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";
import Select from "./select";

export default {
	name: "sc-export-setting",

	components: {
		"i-modal": Modal,
		"i-input": Input,
		"i-button": Button,
		"i-tabs": Tabs,
		"i-tab-pane": TabPane,
		"i-form": Form,
		"i-form-item": FormItem,
		"oa-select": Select
	},

	props: {
		name: String,
		template_id: String,
		template_names: String
	},

	data() {
		return {
			tabs: "basicInformation",
			visible: false,
			type: 0,
			fields: [],
			empty: false, // 清空
			date: {}, // 所有状态下元件的集合
			arr: [], // 添加选中的状态
			formData: {
				template_name: "" // 模板名称
			},
			rule: {
				template_name: [
					{
						required: true,
						message: "模板名称是必填的！",
						trigger: "blur"
					}
				]
			}
		};
	},

	mounted() {
		if (!this.template_id) {
			this.$request({
				url: API_ROOT._SC_CUSTOMER_COOPERATE_EXPORT_CONTENT_GET,
				type: "GET",
				param: {}
			}).then(res => {
				this.date = res.data;
			}).catch(error => {});
		} else {
			this.formData.template_name = this.template_names;
			
			this.$request({
				url: API_ROOT._SC_CUSTOMER_COOPERATE_EXPORT_EDIT_GET,
				type: "GET",
				param: {
					template_id: this.template_id
				}
			}).then(res => {
				this.date = res.data;

				for (let i in this.date) {
					this.date[i].forEach(item => {
						item.show == true ? this.fields.push(item) : "";
					});
				}

				this.arr = this.fields;
			}).catch(error => {});
		}

		this.visible = true;
	},

	methods: {
		// 切换标签页
		handleSwitchTabs(name) {
			this.tabs = name;
		},

		handleOk() {
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					this.visible = false;

					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},

		handleCancel() {
			this.$emit("close");
		},

		handleSave() {
			if (this.fields.length === 0) {
				Message.warning("元件不能为空！");

				this.$refs.modal.buttonLoading = false;
				this.visible = true;

				return;
			} else {
				this.$refs.modal.buttonLoading = false;
			}

			this.visible = true;

			let API = this.template_id ? "_SC_CUSTOMER_COOPERATE_EXPORT_EDIT_TEMPLATE_POST" : "_SC_CUSTOMER_COOPERATE_EXPORT_ADD_POST";
	
			this.$request({
				url: API_ROOT[API],
				type: "POST",
				param: {
					template_id: this.template_id ? this.template_id : "",
					template_name: this.formData.template_name,
					fields: this.fields
				}
			}).then(res => {
				this.$Message.success(res.msg);
			}).then(() => {
				this.visible = false;
				this.$store.commit("SC_CUSTOMER_COOPERATE_EXPORT_LIST_RESET", {
					type: ""
				});

				this.$emit("sure");
			}).catch(error => {
				this.$refs.modal.buttonLoading = false;
				this.visible = true;

				this.$Message.error(error.msg);
			});
		},

		handleGetData(v) {
			// v.number != -1代表取消
			if (v.number != -1) {
				let arr = []; // 取消相应模板后，arr对应的也要取消

				this.arr.forEach(element => {
					if ((element.field == v.item.field && element.type == v.item.type) || element.number == 0) {
						return;
					}

					arr.push(element);
				});

				this.arr = arr;
				this.fields = []; 
				this.fields = Array.from(this.arr);

				for (let k in this.date) {
					this.date[k].forEach(item => {
						Number(item.number) > Number(v.number) ? (item.number--) + "" : "";
					});
				}

				return;
			} else {
				this.arr.push(v.item);
				this.fields = []; 
				this.fields = Array.from(this.arr);
			}
		},

		// 清空选项
		handleEmpty() {
			this.arr = [];
			this.fields = [];

			for (let i in this.date) {
				this.date[i].forEach(item => {
					item.show = false;
					item.number = 0;
				});
			}
		}
	}
};

export const ExportSettingModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-sc-customer-export-setting{
	.ivu-tabs-tabpane{
		max-height: 244px;
		overflow-y: auto;
	}

	.ivu-modal{
		width: 680px !important;
	}

	.ivu-modal-content {
		width: 680px !important;
	}

	.ivu-modal-footer {
		border-top: none;
	}

	._search {
		display: flex;
		justify-content: space-between;
		margin-top: 10px;
	}
}
</style>