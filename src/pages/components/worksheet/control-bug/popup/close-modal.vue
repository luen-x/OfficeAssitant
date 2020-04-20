<template>
	<div>
		<i-modal
			ref="modal"
			:loading="true"
			v-model="visible"
			:width="400"
			:mask-closable="false"
			title="关闭bug"
			class="v-worksheet-control-bug-close-modal"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<i-form
				ref="form" 
				:model="formData" 
				:label-width="50" 
				:rules="formdataRule" 
				class="g-m-t-20"
			>
				<i-form-item label="备注:">
					<oa-limit-words
						v-model="formData.describe" 
						:max="200" 
						style="width:300px;height: 100px;"
						class="g-dp-ib"
						placeholder="请填写备注信息"
					/>
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Modal, Form, FormItem, Message, InputNumber } from 'iview';
import API_ROOT from '@stores/apis/root';
import { CreatePortal } from 'wya-vc';

export default {
	name: 'v-worksheet-control-bug-close-modal',
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input-number': InputNumber,
	},
	props: {
		name: Number,
		data: {
			type: Object,
			default: () => {}
		},
	},
	data() {
		return {
			visible: false,
			formData: {
				describe: '',
			},
			formdataRule: {
				describe: [{ type: 'string', required: true, message: '请填写备注内容', trigger: 'blur' }],
			},
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
				url: API_ROOT['_WORKSHEET_CONTROL_BUG_DETAIL_CLOSE_POST'], // eslint-disable-line
				type: "POST",
				param: {
					bug_id: this.data.bug_id,
					describe: this.formData.describe,
					status: this.data.status
				}
			}).then((res) => {
				Message.success('关闭成功');
				this.visible = false;
				this.$emit('sure');
			}).catch((error) => {
				Message.error(error.msg);
				this.$store.commit('WORKSHEET_CONTROL_BUG_LIST_INIT');
				this.$refs.modal.buttonLoading = false;
			});
		},

		handleCancel() {
			this.$emit('close');
		}
	}
};
export const CloseModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
</style>


