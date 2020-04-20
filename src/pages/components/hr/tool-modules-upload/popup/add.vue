<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true"
			:mask-closable="false"
			class="c-modal-container"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				{{ title }}
			</div>
			<i-form 
				ref="formValidate" 
				:model="formValidate" 
				:rules="ruleValidate"
				:label-width="100" 
				class="g-m-t-20"
			>
				<i-form-item 
					prop="document_name"
					label="模板名称:"
				>
					<i-input
						v-model="formValidate.document_name"
						:maxlength="10"
						clearable
						style="width: 220px"
						placeholder="请输入模板名称"
					/>
				</i-form-item>
				<i-form-item 
					prop="description"
					label="模板简介:"
				>
					<oa-limit-words
						v-model="formValidate.description"
						:max="200"
						style="width: 220px"
						placeholder="请输入模板简介"
					/>
				</i-form-item>
				<i-form-item label="" prop="template" >
					<oa-upload
						v-model="formValidate.template" 
						:max="1"
						:upload="{accept:'.doc,.docx,.xls,.xlsx,.pdf'}"
						style="width: 220px"
					/>
					<div style="color:#999;marginTop:-10px">上传文件为EXCEL文档、WORD文档、TXT文档</div>
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Form, FormItem, Input, Select, Option } from 'iview';
import { CreatePortal } from 'wya-vc';
import API_ROOT from '@stores/apis/root';
import LimitWords from '@components/_common/limit-words/limit-words';
import Upload from '@components/_common/upload/upload';

export default {
	name: 'hr-tool-module-add-modal',
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-select': Select,
		'i-option': Option,
		'oa-limit-words': LimitWords,
		'oa-upload': Upload
	},
	props: {
		title: String,
		type: String,
		info: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			visible: false,
			formValidate: {
				document_name: this.info.document_name || '',
				description: this.info.description || '',
				template: this.info.template ? [this.info.template] : [],
			},
			ruleValidate: {
				document_name: [
					{ required: true, message: '请输入模板名称', trigger: 'blur' }
				],
				description: [
					{ required: true, message: '请输入模板简介', trigger: 'blur' }
				],
				template: [
					{ required: true, type: 'array', message: '请上传模板' }
				],
			}
		};
	},
	computed: {
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs.formValidate.validate((valid) => {
				if (valid) {
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleCancel() {
			this.$emit('close');
		},
		handleSave() {
			this.$request({
				url: API_ROOT['_HR_TOOL_MODULES_ADD_UPLOAD_POST'],
				type: "POST",
				param: {
					document_id: this.info.document_id,
					document_name: this.formValidate.document_name,
					description: this.formValidate.description,
					template: this.formValidate.template[0]
				},
				loading: false
			}).then((res) => {
				this.visible = false;
				this.$refs.modal.buttonLoading = false;
				this.$emit('sure');
				this.$options.$store.commit('HR_TOOL_MODULES_UPLOAD_INIT');
			}).catch((error) => {
				this.$refs.modal.buttonLoading = false;
				this.$Message.error(error.msg);
			});
		}
	}
};
export const AddModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.c-modal-container {
	.ivu-modal-wrap .ivu-modal {
		width: 400px !important;
	}
	.ivu-form-item-label {
		color: #333333;
	}
	.ivu-modal-body {
		padding: 20px 20px 0 20px;
	}
	.c-upload ._item {
		margin: 0px;
	}
}
</style>