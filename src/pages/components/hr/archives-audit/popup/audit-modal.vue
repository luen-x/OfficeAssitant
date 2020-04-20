<template>
	<div>
		<i-modal
			ref="modal"
			:loading="true"
			v-model="visible"
			:width="400"
			:mask-closable="false"
			:title="status ? '举报通过' : '举报驳回'"
			class="v-hr-archives-audit-modal"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<i-form
				ref="form" 
				:model="formData" 
				:label-width="100" 
				:rules="formdataRule" 
				class="g-m-t-20"
			>
				<i-form-item 
					v-if="status"
					label="处理措施：" 
					prop="handle_way"
				>
					<i-select
						v-if="record_type == 1 && remark"
						v-model="formData.handle_way"
						class="g-m-r-5"
						style="width: 220px;"
						clearable
						transfer
						placeholder="请选择解决方案"
					><i-option
						v-for="(v, index) in resolveList"
						:key="index"
						:value="v.id"
					>{{ v.name }}</i-option>
					</i-select>
					<span v-else>该条记录对销售不显示</span>
				</i-form-item>
				<i-form-item :label="status ? '通过说明：' : '驳回原因：'" prop="audit_remark">
					<oa-limit-words
						v-model="formData.audit_remark" 
						:max="500" 
						:placeholder="status ? '请输入通过说明' : '请输入驳回原因'"
						style="width:220px;"
						class="g-dp-ib"
					/>
				</i-form-item>
				<div v-if="status == 1 && report_ids.length > 1 && link_number" style="color: #e74854;margin-left: 28px;">
					你选中的数据中有{{ link_number }}条录音，请谨慎操作。
				</div>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Modal, Form, FormItem, Message, InputNumber, Select, Option } from 'iview';
import API_ROOT from '@stores/apis/root';
import { CreatePortal } from 'wya-vc';

export default {
	name: 'v-worksheet-control-bug-close-modal',
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input-number': InputNumber,
		'i-select': Select,
		'i-option': Option
	},
	props: {
		status: {
			type: Number,
			default: 1 // 1 通过，0 驳回
		},
		record_type: {
			type: Number,
			default: 1 // 1-OA通话记录，2-手机电话，3-微信维护，4-备注信息
		},
		report_ids: {
			type: Array,
			default() {
				return [];
			}
		},
		remark: {
			type: String,
			default: ''
		},
		link_number: {
			type: Number,
			default: 0
		},
	},
	data() {
		return {
			visible: false,
			formData: {
				audit_remark: '',
				handle_way: null
			},
			formdataRule: {
				audit_remark: [{ type: 'string', required: !this.status, message: '请填写备注内容', trigger: 'blur' }],
			},
			resolveList: [
				{
					id: 1,
					name: '该跟进记录对销售不显示'
				},
				{
					id: 2,
					name: '只显示录音不显示备注'
				}
			]
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
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

		handleSave() {
			this.$request({
				url: '_HR_ARCHIVES_AUDIT_AUDIT_POST', // eslint-disable-line
				type: "POST",
				param: {
					report_ids: this.report_ids,
					status: this.status ? 3 : 4,
					audit_remark: this.formData.audit_remark,
					handle_way: this.formData.handle_way 
				}
			}).then((res) => {
				this.$Message.success('审核成功');
				this.visible = false;
				this.$emit('sure');
			}).catch((error) => {
				this.$Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		},

		handleCancel() {
			this.$emit('close');
		}
	}
};
export const AuditModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-hr-archives-audit-modal {

}
</style>