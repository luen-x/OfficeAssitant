<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="补交尾款"
		class="v-sale-customer-pay-left"
		width="400"
		@on-ok="handleSave"
		@on-cancel="handleCancel"
	>
		<i-form
			ref="form"
			:model="formData"
			:rules="rule"
			:label-width="90"
			style="max-height: 314px; overflow: auto; overflow-x: hidden;"
			class="g-pd-l-10"
		>
			<div class="g-m-b-20 g-flex">
				<span class="g-c-black1 g-tr" style="width:78px">可用余额：</span>
				<span class="g-m-l-10 g-c-red-light">￥{{ balance.balance }}</span>
				<span class="g-c-black1 g-tr" style="width:78px">剩余尾款：</span>
				<span class="g-m-l-10 g-c-red-light">￥{{ balance.last_amount }}</span>
			</div>
			<i-form-item :rules="rule.payment_amount" prop="payment_amount" label="补款金额：" clearable>
				<i-input-number
					v-model="formData.payment_amount"
					:min="0"
					:max="maxPaymentAmount"
					:precision="2"
					:active-change="false"
					:disabled="disabled"
					placeholder="请输入补款金额"
					style="width: 220px"
				/>
			</i-form-item>
			
			<div v-for="(project,index) in formData.projects" :key="project.project_id" :class="index==0?'g-m-t-20':'g-m-t-30'">
				<div class="g-m-l-10 g-m-b-10"><span class="_title-bar g-bg-red-mid g-m-r-10"/>{{ project.product_name }}</div>
				<div class="g-m-l-20">
					<span v-if="project.last_cost!=='0.00'" >剩余成本：{{ project.last_cost_amount }}</span>
				</div>
				<i-form-item 
					v-if="project.last_cost!=='0.00'" 
					:prop="'projects.'+index+'.cost_amount'" 
					:rules="rule.cost_amount" 
					label="补交成本："
					clearable
				>
					<i-input-number
						v-model="project.cost_amount"
						:min="0"
						:max="parseFloat(project.last_cost_amount)"
						:precision="2"
						:active-change="false"
						:disabled="disabled"
						placeholder="请输入补交成本的金额"
						style="width: 220px"
					/>
				</i-form-item>
			</div>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Input, Form, FormItem, Select, Option, InputNumber, Button, Icon } from 'iview';
import { CreatePortal } from 'wya-vc';
import API from '@stores/apis/root';
import LimitWords from "@components/_common/limit-words/limit-words";
import orderModal from '@extends/mixins/orderModal';
import { debounce } from 'lodash';

export default {
	name: "oa-sale-add-conatct",
	components: {
		'i-modal': Modal,
		'i-input': Input,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input-number': InputNumber,
		'i-select': Select,
		'i-option': Option,
		'i-button': Button,
		'i-icon': Icon
	},
	mixins: [orderModal],
	props: {
		data: Object, // {contract_company_id,contract_id,action,supply_id,chooseContract}
	},
	data() {
		return {
			visible: false,
			saveLoading: false,
			formData: {
				contract_id: this.data.contract_id,
				supply_id: this.data.supply_id || '',
				payment_amount: null,
				original_supply_id: this.data.original_supply_id || '',
				projects: []
			},
			rule: {
				contract_id: [{ required: true, type: 'number', message: "请选择合同", trigger: "change" }],
				// payment_amount: [{ validator: this.paymentAmountValidator, trigger: "blur" }],
				// cost_amount: [{ validator: this.costAmountValidator, trigger: "blur" }]
			},
			balance: {
				balance: '',
				last_amount: ''
				
			},
		};
	},
	computed: {
		disabled() {
			return this.action == 'view';
		},
		maxPaymentAmount() {
			const balance = parseFloat(this.balance.balance);
			const lastAmount = parseFloat(this.balance.last_amount);
			return balance - lastAmount > 0 ? lastAmount : balance;
		}
	},
	created() {
		this.loadProjects(this.data.contract_id);
		
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		parseFloat(val) {
			return parseFloat(val);

		},
		handleOk() {
			this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		loadProjects(contract_id) {
			// 缓存请求
			
			this.$request({
				url: "_SALE_SUPPLEMENT_PROJECT_INFO_GET",
				type: "GET",
				param: {
					contract_id
				},
				loading: false,
			}).then(res => {
				this.balance.balance = res.data.balance;
				this.balance.last_amount = res.data.last_amount;
				this.formData.projects = res.data.project.map(project => {
					return { 
						project_id: project.project_id, 
						cost_amount: null, 
						last_cost_amount: project.last_cost_amount,
						product_name: project.product_name
					};
				}).filter(project => parseFloat(project.last_cost_amount));
				if (this.data.action == 'update' || this.data.action == 'readd') {
					this.loadSupplyDetail();
				}
			}).catch((res) => {
				console.error(res);
				this.$Message.error(res);
			});
			

		},
		loadSupplyDetail() {
			this.$request({
				url: "_SALE_SUPPLEMENT_INFO_GET",
				type: "GET",
				param: {
					supply_id: this.data.supply_id
				},
				loading: false,
			}).then(res => {
				res.data.project_info.forEach(project => {
					const result = this.formData.projects.find(_p => _p.project_id == project.project_id);
					if (result) {
						result.cost_amount = parseFloat(project.cost_amount) || null;
					}
				});
				this.formData.payment_amount = parseFloat(res.data.supply_info.payment_amount) || null;
				if (this.data.action == 'update') {
					this.balance.balance = (+this.balance.balance + (this.formData.payment_amount || 0)).toFixed(2);
				}
				this.formData.projects = [...this.formData.projects];
			}).catch((res) => {
				console.error(res);
				this.$Message.error(res.msg);
			});
		},
		paymentAmountValidator(rule, value, callback) {
			if (value === null) {
				callback();
				return;
			}
			const index = Number(rule.field.split('.')[1]);
			const curProject = this.formData.projects[index];
			if (value > curProject.last_amount) {
				callback('补款金额应小于等于' + curProject.last_amount);
				return;
			}
			callback();
		},
		costAmountValidator(rule, value, callback) {
			const index = Number(rule.field.split('.')[1]);
			const curProject = this.formData.projects[index];
			if (value === null) {
				const cha = curProject.last_cost - (curProject.last_amount - curProject.payment_amount);
				if (cha > 0) {
					
					if ((cha + value) == curProject.last_cost) {
						callback("补交成本应等于" + (cha + value));
					} else {
						callback("补交成本应大于等于" + (cha + value));
					}
					return;
				}
				callback();
				return;
			}

			if (value > curProject.last_cost) {
				callback('补交成本应小于等于' + curProject.last_cost);
				return;
			}
			if (value > curProject.last_amount) {
				callback('补交成本应小于等于补款金额');
				return;
			}
			const cha = curProject.last_cost - value - (curProject.last_amount - curProject.payment_amount);
			if (cha > 0) {
				if ((cha + value) == curProject.last_cost) {
					callback("补交成本应等于" + (cha + value));
				} else {
					callback("补交成本应大于等于" + (cha + value));
				}
				return;
			}
			callback();
		},
		handleSave: debounce(function () {
			this.$refs.form.validate(valid => {
				if (valid) {
					const param = { ...this.formData, project: this.formData.projects };
					delete param.projects;
					this.$request({
						url: this.data.action == 'update' ? "_SALE_SUPPLEMENT_UPDATE_POST" : "_SALE_SUPPLEMENT_SAVE_POST",
						type: "POST",
						loading: false,
						param
					}).then(res => {
						this.$refs.modal.buttonLoading = false;
						this.$Message.success(res.msg);
						this.$vc.emit('SALE_CUSTOMER_PAY_LEFT');
						this.visible = false;
						this.$emit('sure');
					}).catch(res => {
						console.error(res);
						this.$refs.modal.buttonLoading = false;
						this.$Message.error(res.msg);
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		}, 200)
	}
};

export const PayLeft = CreatePortal({}, module.exports.default);
</script>
<style lang="scss" >
.v-sale-customer-pay-left{
	._title-bar{
		display: inline-block;
		width: 2px;
		height: 14px;
		position: relative;
		top: 1px;
	}
}
</style>

