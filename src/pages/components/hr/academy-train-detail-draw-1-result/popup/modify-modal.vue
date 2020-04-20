<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="抽奖状态修改"
		width="400px"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-tc g-m-tb-30 g-fs-14 g-c-black2">
			<i-form 
				ref="formData" 
				:model="formData" 
				:rules="formDataRule" 
				:label-width="100">
				<i-form-item label="状态：" style="margin-top: 10px" prop="status">
					<i-radio-group v-model="formData.status">
						<i-radio :label="1" class="g-tl" style="display: block">未颁发</i-radio>
						<i-radio :label="2" class="g-tl" style="display: block">已颁发</i-radio>
						<i-radio :label="3" class="g-tl" style="display: block">设未无效抽奖<span class="g-c-black5">（奖品将飞回抽奖池中哦~）</span></i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="备注：">
					<oa-limit-words
						v-model="formData.audit_remark"
						:max="200"
						style="width: 220px;"
						placeholder="请输入备注"
					/>
				</i-form-item>
			</i-form>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Radio, RadioGroup, Form, FormItem } from 'iview';
import { CreatePortal } from 'wya-vc';
import API_ROOT from '@stores/apis/root';

export default {
	name: "oa-hr-train-detail-delete-tip",
	components: {
		'i-modal': Modal,
		'i-radio': Radio,
		'i-radio-group': RadioGroup,
		'i-form': Form,
		'i-form-item': FormItem,
	},
	props: {
		rowData: Object
	},
	data() {
		return {
			visible: false,
			formData: {
				status: this.rowData.status,
				audit_remark: this.rowData.audit_remark
			},
			formDataRule: {
				status: [{
					required: true, message: '请选择状态'
				}]
			}
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs.modal.buttonLoading = false;
			this.$refs.formData.validateAndScroll(valid => {
				if (valid) {
					const { lottery_id, record_id } = this.rowData;
					this.$request({
						url: API_ROOT._HR_ACADEMY_TRAIN_DETAIL_DRAW_1_RESULT_STATUS_POST,
						param: {
							lottery_id,
							record_id,
							...this.formData
						},
						type: "POST"
					}).then(res => {
						this.$Message.success(res.msg);
						this.$emit('sure', true);
					}).catch(err => this.$Message.error(err.mag));
				}
			});
		},
		handleCancel() {
			this.$refs.modal.buttonLoading = false;
			this.$emit('close', false);
			this.visible = false;
		}
	}
};
export const ModifyModal = CreatePortal({}, module.exports.default);
</script>
