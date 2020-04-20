<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:width="600"
			:loading="true"
			:mask-closable="false"
			class="c-modal-container-mci"
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
					:disabled="!canEditContractNum"
					:clearable="canEditContractNum"
					placeholder="请输入合同编号"
					style="width:300px"
				/>
			</div>

			<oa-title title="项目需求" class="g-m-l-10"/>
			<div v-for="(item) in projectConfigs" :key="item.project_id">
				<div class="g-m-l-30 g-m-tb-10">{{ item.raw_project.product_name }}</div>
				<oa-cusform 
					ref="projectForm" 
					:configs="item"
				/>
			</div>
			<template v-if="customerConfig.list.length">
				<oa-title title="客户信息" class="g-m-l-10"/>
				<oa-cusform
					
					ref="customerForm" 
					:configs="customerConfig" 
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
import CusFrom, { formatProductDetail, getOutputValue, getOutputOption } from "@components/sale/_common/customer/cus-form/cus-form";

export default {
	name: "finance-customer-modify-cus-information-modal",

	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-input": Input,
		"i-input-number": InputNumber,
		"oa-title": Title,
		"oa-cusform": CusFrom
	},

	props: {
		contract_id: Number,
		project_id: Number,
		type: String
	},

	data() {
		return {
			visible: false,
			canEditContractNum: true, // 状态 是否可以编辑合同编号 true 是 false 否
			projectConfigs: [
				// {
				// 	list: [],
				// 	raw_project: {},
				// }
			],
			customerConfig: {
				list: [],
				raw_customer_info: []

			},
			contract_num: ""
		};
	},

	mounted() {
		this.loadData();
		this.visible = true;
	},

	methods: {
		async handleOk() {
			// // 验证合作年限和提单年限 -> 改为后端验证
			// const err = this.$refs.projectForm.map(item => item.getFormData()).find(formData => {
			// 	formData.cooperate_year && formData.bill_year && console.log(formData.cooperate_year, formData.bill_year);
			// 	return formData.cooperate_year && formData.bill_year && +formData.cooperate_year > +formData.bill_year;
			// });
			// if (err) {
			// 	this.$Message.error("合作年限必须小于等于提单年限");
			// 	this.$refs.modal.buttonLoading = false;
			// 	return;
			// }
			const promises = this.$refs.projectForm.map(item => item.getForm().validateAndScroll());
			if (this.$refs.customerForm) {
				promises.push(this.$refs.customerForm.getForm().validateAndScroll());
			}
			const validList = await Promise.all(promises);

			let unfinishItem = this.getUnfinishItem();
			
			if (unfinishItem) {
				this.$Message.warning("请等待" + unfinishItem.label + "上传完成");
				this.$refs.modal.buttonLoading = false;
			} else if (validList.includes(false)) {
				this.$refs.modal.buttonLoading = false;
			} else {
				try {
					this.handleSave();
				} catch (e) {
					console.error(e);
					this.$refs.modal.buttonLoading = false;
				}
				
			}	
		},
		getUnfinishItem() {
			const forms = [...this.$refs.projectForm];
			if (this.$refs.customerForm) { 
				forms.push(this.$refs.customerForm);
			}
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
			if (this.canEditContractNum && !this.contract_num) {
				this.$Message.warning("合同编号不能为空");
				this.visible = true;
				this.$refs.modal.buttonLoading = false;

				return;
			} else if (!/^[A-Za-z0-9]{1,}$/.test(this.contract_num)) {
				this.$Message.warning("合同编号必须为字母或数字");
				this.visible = true;
				this.$refs.modal.buttonLoading = false;

				return;
			}
			// 构建项目信息
			const projectData = this.$refs.projectForm.map(form => {
				const config = form.getConfigs();
				const formData = form.getFormData();

				return {
					parent_product_id: config.raw_project.parent_product_id,
					product_id: config.raw_project.product_id,
					project_id: config.raw_project.project_id,
					project_request: config.raw_project.project_request.map(item => ({
						component_field: item.component_field, 
						component_type: item.component_type,
						component_value: getOutputValue({ ...item, component_value: formData[item.component_field] }),
						data: getOutputOption(item, config)
					}))
				};
			});
			// 构建客户信息
			let customerData = [];
			if (this.$refs.customerForm) {
				const customerFormData = this.$refs.customerForm.getFormData();
				customerData = this.customerConfig.raw_customer_info.map(item => ({ 
					component_field: item.component_field,
					component_type: item.component_type,
					component_value: getOutputValue({ ...item, component_value: customerFormData[item.component_field] }), 
					data: getOutputOption(item, this.customerConfig)
				
				}));
			}
			this.$request({
				url: 'FINANCE_CUSTOMER_CONTRACT_CONTRACT_MODIFY_POST',
				type: "POST",
				param: {
					contract_id: this.contract_id,
					contract_num: this.contract_num,
					customer_info: customerData,
					project: projectData,
					status: this.type
				}
			}).then(res => {
				this.$Message.success(res.msg);
			}).then(() => {
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
				url: '_FINANCE_CUSTOMER_CONTRACT_CONTRACT_INFO_GET',
				type: "GET",
				param: {
					contract_id: this.contract_id,
					project_id: this.project_id
				}
			}).then(res => {
				this.canEditContractNum = res.data.flag;
				this.contract_num = res.data.contract_num;
				this.projectConfigs = res.data.project.map(project => ({
					list: formatProductDetail(project.project_request).list,
					raw_project: project,
				}));
				if (['2', '3', '4'].includes(this.type)) {
					this.projectConfigs.forEach(project => {
						project.list.forEach(v => {
							v.disabled = (v.prop == 'cooperate_year');
						});
					}); 
				}
				
				this.customerConfig = {
					list: formatProductDetail(res.data.customer_info).list,
					raw_customer_info: res.data.customer_info
				};
			}).catch(error => {
				console.error(error);
				this.$Message.error(error.msg);
			});
		}
	}
};

export const ModifyCusInformationModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.c-modal-container-mci{
	.ivu-modal-body{
		max-height: 388px;
		overflow: auto;
	}
}
</style>