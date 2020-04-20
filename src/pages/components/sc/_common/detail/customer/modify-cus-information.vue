<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:width="680"
			:loading="true"
			:mask-closable="false"
			class="v-sc-customer-modify-cus-infomation"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc g-m-b-20">
				更改下单信息
			</div>

			<div class="g-flex g-m-b-30">
				<oa-title title="合同编号:" class="g-m-l-10"/>
	
				<i-input
					v-model="contract_num"
					:maxlength="20"
					:disabled="!canEditProjectNum"
					:clearable="canEditProjectNum"
					placeholder="请输入合同编号"
					style="width:300px"
				/>
			</div>
			<div v-if="projectConfigs.list.length">
				<oa-title title="项目需求" class="g-m-l-10"/>
				<oa-form-item
					v-if="projectConfigs.list.length"
					ref="projectForm" 
					:configs="projectConfigs" 
				/>
			</div>
			<template v-if="customerConfigs.list.length">
				<oa-title title="客户信息" class="g-m-l-10"/>
				<oa-form-item
					ref="customerForm" 
					:configs="customerConfigs" 
				/>
			</template>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Form, FormItem, Input, InputNumber } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";
import { Title } from "@components/sc/_common";
import moment from "moment";
import FromItem, { formatProductDetail, getOutputValue, getOutputOption } from "../../../../sale/_common/customer/cus-form/cus-form";

export default {
	name: "sc-customer-modify-cus-information-modal",

	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-input-number": InputNumber,
		"oa-title": Title,
		"oa-form-item": FromItem
	},

	props: {
		contract_id: Number,
		project_id: Number,
		type: String // 为3或4时不可编辑合作年限
	},

	data() {
		return {
			visible: false,
			canEditProjectNum: false, // 状态 是否可以编辑合同编号 true 是 false 否
			contract_num: "",
			customerConfigs: { // 组件信息
				list: [],
				raw_request: []
			},
			projectConfigs: {
				list: [],
				raw_request: []
			}
		};
	},

	mounted() {
		this.loadData();
		this.visible = true;
	},

	methods: {
		async handleOk() {
			let customerOk = true;
			if (this.$refs.customerForm) {
				customerOk = await this.$refs.customerForm.getForm().validateAndScroll();
			}
			const projectOk = await this.$refs.projectForm.getForm().validateAndScroll();
			let unfinishItem = this.getUnfinishItem();
			if (unfinishItem) {
				this.$Message.warning("请等待" + unfinishItem.label + "上传完成");
				this.$refs.modal.buttonLoading = false;
			} else if (customerOk && projectOk) {
				try {
					this.handleSave();
				} catch (e) {
					this.$refs.modal.buttonLoading = false;
				}
			} else {
				this.$refs.modal.buttonLoading = false;
			}
		},
		getUnfinishItem() {
			const forms = [this.$refs.projectForm, this.$refs.customerForm].filter(i => i);
			for (let i = 0; i < forms.length; i++) {
				const config = forms[i].getConfigs();
				const formData = forms[i].getFormData();
				const unfinishItem = config.list.find(item => {
					return item.itemType == 'img-picker' && formData[item.prop].find(it => it.uid);
				});
				if (unfinishItem) return unfinishItem;
			}
		},

		handleSave() {
			let regex = /[^a-zA-Z0-9]/g;

			if (this.canEditProjectNum && !this.contract_num) {
				this.$Message.warning("合同编号不能为空！");
				this.$refs.modal.buttonLoading = false;
				return;
			}
			if (regex.test(this.contract_num)) {
				this.$Message.warning("合同编号只能是英文和字母哦！");
				this.$refs.modal.buttonLoading = false;
				return;
			}
			let customerData = [];
			if (this.$refs.customerForm) {
				const customerFormData = this.$refs.customerForm.getFormData();
				customerData = this.customerConfigs.raw_request.map(item => ({ 
					component_field: item.component_field,
					component_type: item.component_type,
					component_value: getOutputValue({ ...item, component_value: customerFormData[item.component_field] }), 
					data: getOutputOption(item, this.customerConfigs)
				
				}));
			}

			const projectFormData = this.$refs.projectForm.getFormData();
			const projectData = this.projectConfigs.raw_request.map(item => ({ 
				component_field: item.component_field,
				component_type: item.component_type,
				component_value: getOutputValue({ ...item, component_value: projectFormData[item.component_field] }), 
				data: getOutputOption(item, this.projectConfigs)
			}));
			this.$request({
				url: API_ROOT._SC_CUSTOMER_COOPERATE_SAVE_CUSTOMER_INFO_POST,
				type: "POST",
				param: {
					contract_id: this.contract_id,
					project_id: this.project_id,
					contract_num: this.contract_num,

					customer_info: customerData,
					project_request: projectData
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.$emit("sure", true);
			}).catch(error => {
				this.$refs.modal.buttonLoading = false;
				this.$Message.error(error.msg);
			});
		},

		handleCancel() {
			this.$emit("close");
		},
        
		loadData() {
			this.$request({
				url: API_ROOT._SC_CUSTOMER_COOPERATE_EDIT_CUSTOMER_INFO_GET,
				type: "GET",
				param: {
					contract_id: this.contract_id,
					project_id: this.project_id
				}
			}).then(res => {
				this.canEditProjectNum = res.data.flag;
				this.contract_num = res.data.contract_num;
				this.customerConfigs.raw_request = res.data.component;
				this.customerConfigs.list = formatProductDetail(res.data.component).list;

				this.projectConfigs.raw_request = res.data.project_request.project_request;
				this.projectConfigs.list = formatProductDetail(res.data.project_request.project_request).list;
				if (['2', '3', '4'].includes(this.type)) {
					this.projectConfigs.list.forEach(v => {
						v.disabled = (v.prop == 'cooperate_year');
					});
				}
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		}
	}
};

export const ModifyCusInformationModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-sc-customer-modify-cus-infomation{
	.ivu-modal-body{
		max-height: 388px;
		overflow: auto;
		padding-left: 40px; 
	}
}
</style>