<template>
	<i-modal 
		ref="modal"
		v-model="visible"
		:mask-closable="false"
		title="填写拒绝原因"
		width="360px"
		footer-hide
		class="v-activity-audit-refuse"
	>
		<div style="max-height: 150px; margin: 30px 0 0 -20px" class="g-flex">
			<i-form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
				<i-form-item label="拒绝原因：" prop="value">
					<oa-limit-words
						:rows="4"
						v-model="formValidate.value" 
						:max="50"
						width="220px"
						placeholder="在这里输入..."
					/>
				</i-form-item>
			</i-form>
		</div>
		<div name="foot" style="height: 50px" class="g-pd-t-20">
			<i-button type="primary" class="g-fr g-m-l-10" @click="handleOk">确定</i-button>
			<i-button type="text" class="g-fr g-m-l-10" @click="handleCancel">取消</i-button>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Button, Input, Form, FormItem } from 'iview';
import { CreatePortal } from 'wya-vc';
import API_ROOT from '@stores/apis/root';

export default {
	name: "vc-activity-refuse",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-input': Input,
		'i-form': Form,
		'i-form-item': FormItem,
	},
	props: {
		data: Object
	},
	data() {
		return {
			visible: false,
			value: '',
			formValidate: {
				value: '',
			},
			ruleValidate: {
				value: [
					{ required: true, message: '请填写拒绝原因', trigger: 'blur' }
				],
			}
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs['formValidate'].validateAndScroll((valid) => {
				if (valid) {
					this.$request({
						url: API_ROOT._CONTENT_ACTIVITY_AUDIT_PASS_POST,
						type: 'POST',
						param: {
							type: 2,
							apply_id: this.data.apply_id,
							refuse_reason: this.formValidate.value
						}
					}).then(res => {
						this.visible = false;
						this.$Message.success(res.msg);
						this.$emit('sure');
					}).catch(err => {
						this.$Message.error(err.msg);
						this.visible = true;
					});
				} else {
					this.$refs.modal.buttonLoading = false;
					this.visible = true;
				}
			});
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		}
	}
};
export const PModalRefuse = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-activity-audit-refuse {
	._tip {
    color: #bbb;
    bottom: 0px;
    right: 35px;
	}
	textarea {
		// resize: none
	}
}
</style>

