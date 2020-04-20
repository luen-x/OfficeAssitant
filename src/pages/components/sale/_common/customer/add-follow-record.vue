<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="添加跟进记录"
		width="400"
		@on-ok="handleSave"
		@on-cancel="handleCancel"
	>
		<i-form
			ref="form"
			:model="formData"
			:rules="rules"
			:label-width="110"
			class="g-pd-l-20"
		>
			<i-form-item label="跟进记录：" prop="remark">
				<!-- <span slot="label">
					<i-tooltip 
						v-if="coinConfig.tip_4_1" 
						:content="coinConfig.tip_4_1" 
						max-width="220" 
						placement="top" 
						transfer>
						<img :src="OSS_PROP_ICON2" style="height:18px;width:18px;position: relative;top: 4px;" class="g-m-r-5 g-pointer">
					</i-tooltip> 
					跟进记录：
				</span> -->
				<oa-limit-words
					v-model="formData.remark"
					:max="500"
					placeholder="请输入备注内容"
					style="width: 220px"
				/>
			</i-form-item>
			<i-form-item label="接通情况：" prop="connect_status">
				<i-select 
					v-model="formData.connect_status"
					placeholder="请选择接通状态"
					clearable 
					transfer 
					style="width:220px"
				>
					<i-option :value="0">未拨</i-option>
					<i-option :value="1">已接</i-option>
					<i-option :value="2">未接</i-option>
					<i-option :value="3">拒接</i-option>
					<i-option :value="4">空号</i-option>
					<i-option :value="5">微信</i-option>
				</i-select>
			</i-form-item>
			<i-form-item label="客户意向：" prop="customer_intention">
				<i-select 
					v-model="formData.customer_intention" 
					placeholder="请选择接客户意向" 
					clearable 
					transfer 
					style="width:220px"
				>
					<i-option :value="1">无意向</i-option>
					<i-option :value="2">待联系</i-option>
					<i-option :value="3">跟进中</i-option>
				</i-select>
			</i-form-item>
			
		</i-form>
	</i-modal>
</template>
<script>
import { Modal, Input, Form, FormItem, Select, Option, Tooltip } from 'iview';
import orderModal from '@extends/mixins/orderModal';
import { CreatePortal } from 'wya-vc';
import LimitWords from "@common/limit-words/limit-words";
import { dataValidity, objRegex } from '@utils/utils';
import { services } from '@stores/services/sale';
import { OSS_PROP_ICON2 } from '@constants/constants';

export default {
	name: "oa-sale-add-conatct",
	components: {
		'i-modal': Modal,
		'i-input': Input,
		'i-form': Form,
		'i-form-item': FormItem,
		'oa-limit-words': LimitWords,
		'i-select': Select,
		'i-option': Option,
		'i-tooltip': Tooltip
	},
	mixins: [orderModal, services.coinConfig()],
	props: {
		customerId: Number
	},
	data() {
		return {
			OSS_PROP_ICON2,
			visible: false,
			formData: {
				customer_id: this.customerId,
				connect_status: '',
				customer_intention: null,
				remark: '',
				type: 4 // 固定传4
			},
			rules: {
				connect_status: [{ required: true, type: "number", message: '请选择接通状态', trigger: 'change' }],
				// customer_intention: [{ required: true, type: "number", message: '请选择客户意向', trigger: 'change' }],
				remark: [{ required: true, message: '请填写跟进记录', trigger: 'blur' }],
			}
		};
	},
	created() {
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleSave() {
			this.$refs.form.validate(valid => {
				if (!valid) return this.$refs.modal.buttonLoading = false;
				const param = { ...this.formData };
				if (!param.customer_intention) {
					param.customer_intention = 0;
				}
				this.$request({
					url: "_SALE_CUSTOMER_SALE_LOG_SAVE_POST",
					type: "POST",
					param,
					loading: false,
				}).then(res => {
					this.handleOk();
				}).catch((res) => {
					this.$refs.modal.buttonLoading = false;
					this.$Message.error(res.msg);
				});
			});
			// this.$refs.form.validate(valid => {
			// 	if (valid) {
			// 		const temp = { ...this.formData };
			// 		// if (temp.connect_status !== 1 && temp.connect_status !== 5) {
			// 		// 	temp.customer_intention = '';
			// 		// }
			// 		this.$request({
			// 			url: "_SALE_INTENTION_ADD_SALE_LOG_POST",
			// 			type: "POST",
			// 			loading: false,
			// 			param: temp
			// 		}).then(res => {
			// 			this.$Message.success(res.msg);
			// 			this.handleOk();
			// 		}).catch((res) => {
			// 			this.$Message.error(res.msg);
			// 			this.$refs.modal.buttonLoading = false;
			// 		});
			// 	} else {
			// 		this.$refs.modal.buttonLoading = false;
			// 	}
			// });
		}
	}
};
export const AddFollowRecord = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
</style>