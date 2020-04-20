<template>
	<div class="v-contract-edit-modal">
		<i-modal
			ref="modal"
			v-model="visible"
			:width="600"
			:mask-closable="false"
			:loading="true"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">编辑成本</div>
			<oa-title style="padding-left: 12px">
				<template slot="title">
					<span class="g-fs-14">成本详情</span>
				</template>
				<div slot="content" class="g-m-t-10">
					<div>
						<span>产品成本: {{ formdata.need_cost_amount }}</span>
						<span class="g-m-l-30">实扣成本: {{ formdata.cost_amount }}</span>
					</div>
					<span>剩余成本: {{ formdata.rest_cost_amount }}</span>
				</div>
			</oa-title>
			<i-form 
				ref="form"
				:model="formdata" 
				:rules="validator"
				:label-width="100" 
				class="g-m-t-20">
				<oa-title 
					class="g-m-t-10" 
					style="padding-left: 12px"
				>
					<template slot="title">
						<span class="g-fs-14">成本扣除</span>
					</template>
					<div slot="content" class="g-m-t-10">
						<div 
							v-for="(info, info_index) of formdata.rest_info"
							:key="info_index"
							style="padding: 10px; margin-top: 10px"
						>
							<div class="g-m-b-20">
								<span>业绩归属: {{ info.actual_month }}</span>
								<span style="margin-left: 40px;">
									使用金额: 
									<i-poptip trigger="hover">
										<span class="g-operation">{{ info.pocket_info.lock_amount }}</span>
										<div slot="content">
											<p v-for="(data, index) of info.pocket_info.use_info" :key="index">
												<span>{{ data.label }}： {{ data.value }}</span>
											</p>
										</div>
									</i-poptip>
								</span>
								<template v-if="info.cost_info.length > 1">
									<span style="margin-left: 40px;">
										成本比例: 
										<span v-for="(mess, index) of info.cost_info" :key="index + '1'">
											<span v-if="index">:</span>
											<span>{{ mess.percent }}</span>
										</span>
									</span>
									<span 
										class="g-operation g-m-l-30"
										@click="() => handleRate(info.cost_info, info_index)">编辑</span>
								</template>
							</div>
							<div>
								<div class="g-flex g-ai-c">
									<div class="g-m-b-20" style="width: 80px">成本金额:</div>
									<div class="g-flex g-fw-w">
										<i-formitem 
											v-for="(v, cost_index) of info.cost_info.filter(i=>i.staff_id)"
											:key="v.staff_id"
											:label="v.staff_name"
											:rules="validator.cost_amount"
											:prop="`rest_info.${info_index}.cost_info.${cost_index}.cost_amount`"
										>
											<i-input-number
												v-model="v.cost_amount"
												:disabled="!v.is_edit"
												:min="0"
												:max="99999999"
												:active-change="false"
												:precision="2"	
												style="width: 120px"
												clearable
											/>
										</i-formitem>
									</div>
								</div>
							</div>	
						</div>
					</div>
				</oa-title>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, DatePicker, Button, Form, FormItem, Input, InputNumber, Poptip } from 'iview';
import { CreatePortal } from 'wya-vc';
import TextArea from '@components/_common/limit-words/limit-words';
import API_ROOT from '@stores/apis/root';
import lodash from "lodash";
import Title from '../../_common/title';
import { RateModal } from './rate';

export default {
	name: 'finance-contract-edit-modal',
	components: {
		'i-modal': Modal,
		'i-datepicker': DatePicker,
		'i-form': Form,
		'i-formitem': FormItem,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-button': Button,
		'i-poptip': Poptip,
		'oa-textarea': TextArea,
		'oa-title': Title
	},
	props: {
		name: String,
		project: Array,
		requestFn: Function,
		project_id: Number,
		contract_id: Number,
		contract_company_id: Number,
		supply_id: Number,
		need_cost_amount: String
	},
	data() {
		return {
			visible: false,
			data: {},
			formdata: {
			},
			validator: {
				// cost_amount: [
				// 	{ required: true, type: 'number', message: '请输入成本扣除', trigger: 'blur' }
				// ],
				remarks: [
					{ required: true, message: '请输入修改原因', trigger: 'blur' }
				]
			}
		};
	},
	mounted() {
		this.visible = true;
		this.loadData();
	},
	methods: {
		handleRate(info, index) {
			RateModal.popup({
				info
			}).then(res => {
				let percent_sum = 0;
				let cost_sum = 0;
				let rest_sum = 0;
				info.forEach(item => {
					percent_sum += item.percent;
					cost_sum += item.cost_amount;
				});
				info.forEach((item, i) => {
					if (i < info.length - 1) {
						item.cost_amount = +(cost_sum * item.percent / percent_sum).toFixed(2);
						rest_sum += item.cost_amount;
					} else {
						item.cost_amount = cost_sum - rest_sum;
					}
					
				});
			});
		},
		handleOk: lodash.debounce(function (event) {
			this.$refs['modal'].buttonLoading = false;
			this.$refs['form'].validate((item) => {
				if (item) {
					this.handleSave();
				}
			});
		}, 300),
		handleCancel() {
			this.visible = false;
			this.$emit('destory');
			// if (this.formdata.remark || this.formdata.project_id || this.formdata.cost_amount) {
			// 	Modal.confirm({
			// 		title: '提示',
			// 		content: '取消后你所填写的内容将无法恢复，确认取消？',
			// 		width: 400,
			// 		onOk: () => {
			// 			this.visible = false;
			// 			this.$emit('destory');
			// 		}
			// 	});
			// } else {
			// 	this.visible = false;
			// }
		},
		handleSave() {
			this.$request({
				url: API_ROOT._FINANCE_CUSTOMER_CONTRACT_COST_CHANGE_GET,
				type: 'POST',
				param: {
					supply_id: this.supply_id,
					contract_id: this.contract_id,
					project_id: this.project_id,
					...this.formdata
				},
				loading: false
			}).then(res => {
				this.$Message.success(res.msg);
				this.$emit('sure');
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		loadData() {
			this.$request({
				url: API_ROOT._FINANCE_CUSTOMER_CONTRACT_COST_INFO_GET,
				type: 'GET',
				param: {
					supply_id: this.supply_id,
					contract_company_id: this.contract_company_id,
					contract_id: this.contract_id,
					project_id: this.project_id
				},
				loading: false
			}).then(res => {
				res.data.rest_info.forEach(item => {
					item.cost_info.forEach(info => info.cost_amount = +info.cost_amount);
				});
				this.formdata = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		}
	}
};
export const EditModal = CreatePortal({ store: app.$store }, module.exports.default);
</script>

<style lang="scss">
</style>


