<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:width="400"
			:mask-closable="false"
		>
			<div slot="header" class="g-tc">修改成本</div>
			<i-form 
				ref="form"
				:model="formdata" 
				:rules="validator"
				:label-width="100" 
				class="g-m-t-20">
				<i-formitem prop="project_id" label="下单产品:">
					<i-select
						v-model="formdata.project_id"
						style="width: 80%"
						placeholder="请选择下单产品"
						@on-change="handleChange"
					>
						<i-option 
							v-for="item of project" 
							:key="item.project_id" 
							:value="String(item.project_id)">{{ item.product_name }}</i-option>
					</i-select>
				</i-formitem>
				<i-formitem prop="need_cost_amount" label="产品成本:">
					<i-input-number
						v-model="formdata.need_cost_amount"
						:min="0"
						:max="max"
						:precision="2"
						:active-change="false"	
						style="width: 80%"
						clearable
						placeholder="请输入产品成本"
					/>
				</i-formitem>
				<i-formitem v-if="projectDetail.is_cost_instalment" prop="cost_amount" label="实扣成本:">
					<i-input-number
						v-model="formdata.cost_amount" 
						:min="0"
						:max="max"
						:precision="2"
						:active-change="false"	
						style="width: 80%"
						clearable
						placeholder="请输入实扣成本"
					/>
				</i-formitem>
				<i-formitem prop="remark" label="修改原因:">
					<oa-textarea 
						v-model="formdata.remark"
						placeholder="请输入修改原因"
						clearable
						style="width: 80%"
					/>
				</i-formitem>
			</i-form>
			<div slot="footer">
				<i-button 
					type="text" 
					@click="handleCancel"
				>
					取消
				</i-button>
				<i-button 
					type="primary" 
					@click="handleOk"
				>
					确定
				</i-button>
			</div>
		</i-modal>
	</div>
</template>

<script>
import { Modal, DatePicker, Button, Form, FormItem, Select, Input, InputNumber, Option, Row, Col } from 'iview';
import { CreatePortal } from 'wya-vc';
import API_ROOT from '@stores/apis/root';
import TextArea from '@components/_common/limit-words/limit-words';
import lodash from "lodash";

export default {
	name: 'finance-customer-edit-modal',
	components: {
		'i-modal': Modal,
		'i-datepicker': DatePicker,
		'i-form': Form,
		'i-formitem': FormItem,
		'i-select': Select,
		'i-option': Option,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-row': Row,
		'i-col': Col,
		'i-button': Button,
		'oa-textarea': TextArea
	},
	props: {
		name: String,
		project: Array,
		requestFn: Function,
		contract_id: Number
	},
	data() {
		return {
			visible: false,
			formdata: {
				project_id: '',
				cost_amount: null,
				need_cost_amount: null,
				remark: ''

			},
			max: 99999999,
			projectDetail: {
				is_cost_instalment: 0
			},
			projectId: "",
			validator: {
				project_id: [
					{ required: true, message: '请选择下单产品', trigger: 'change' }
				],
				need_cost_amount: [
					{ required: true, type: 'number', message: '请输入产品成本', trigger: 'blur' }
				],
				cost_amount: [
					{ required: true, type: 'number', message: '请输入实扣成本', trigger: 'blur' }
				],
				remark: [
					{ required: true, message: '请输入修改原因', trigger: 'blur' }
				]
			}
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleChange(val) {
			this.loadProject(val);
			let obj = this.project.filter(item => item.project_id == val)[0];
			this.max = obj.is_gift ? 200000 : 99999999;
		},
		handleOk: lodash.debounce(function (event) {
			this.$refs['form'].validate((item) => {
				if (item) {
					const { need_cost_amount, cost_amount, need_amount, last_amount } = this.formdata;
					this.requestFn({
						data: {
							...this.formdata,
							cost_amount: this.projectDetail.is_cost_instalment ? this.formdata.cost_amount : this.formdata.need_cost_amount
						},
						cb: () => { 
							this.visible = false;
							this.$emit('destory');
						}
					});
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
		loadProject(val) {
			this.$request({
				url: API_ROOT._FINANCE_CUSTOMER_PRODUCT_INFO_GET,
				type: 'GET',
				param: {
					contract_id: this.contract_id,
					project_id: val
				},
				loading: false
			}).then(res => {
				this.projectDetail = res.data;
				this.formdata = {
					...this.formdata,
					need_cost_amount: Number(res.data.need_cost_amount),
					cost_amount: Number(res.data.cost_amount)
				};
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		}
	}
};
export const ChangeModal = CreatePortal({ store: app.$store }, module.exports.default);
</script>

<style lang="scss" scoped>

</style>


