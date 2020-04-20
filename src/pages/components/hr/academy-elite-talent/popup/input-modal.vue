<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:mask-closable="false"
		:loading="true"
		title="导入数据"
		width="400px"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-m-tb-30 g-m-l-30 g-fs-14 v-academy-elite-talent-import-data" style="color: #333">
			<i-form
				ref="formValidate"
				:model="formValidate"
				:rules="ruleValidate"
				:label-width="120">
				<i-form-item label="选择excel文件：" prop="file" class="_customer-input">
					<vc-upload
						accept=".xlsx, .xls"
						@begin="handleBegin"
						@complete="handleComplete"
						@file-before="handleFileBefore"
						@file-start="handleFileStart"
						@file-error="handleError"
						@file-success="handleFileSuccess"
						@file-progress="handleFileProgress"
					>
					<div v-if="!formValidate.file.length" class="_upload">上传</div></vc-upload>
					<div v-if="formValidate.file.length">
						<i class="iconfont icon-accessory"/>
						<span>{{ formValidate.file[0].title }}</span>
						<span
							class="g-fr g-operation"
							@click="formValidate.file = [];"
						>删除</span>
					</div>
				</i-form-item>
			</i-form>
			<div 
				class="g-c-blue-mid g-fs-14 g-pointer g-m-l-10"
				@click="handleExportModel">下载导入模板</div>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Button } from 'iview';
import { CreatePortal, Upload } from 'wya-vc';
import { OSS_TEMPLATE_FILE02 } from '@constants/constants';
import ROOT_API from '@stores/apis/root';
import orderModal from '@extends/mixins/orderModal';
import moment from 'moment';

export default {
	name: "oa-pk-import-data",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		"vc-upload": Upload,
	},
	mixins: [orderModal],
	data() {
		return {
			visible: false,
			formValidate: {
				file: []
			},
			ruleValidate: {
				file: [
					{ required: true, type: 'array', message: '请上传文件', trigger: 'change' }
				],
			},

		};
	},
	created() {

	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs.formValidate.validate((valid) => {
				if (valid) {
					this.$refs.modal.buttonLoading = false;
					this.$request({
						url: ROOT_API._HR_ACADEMY_ELITE_TALENT_INPUT_DATA_POST,
						param: {
							oss_file_name: this.formValidate.file[0].url
						}
					}).then(res => {
						this.$emit('sure');
						this.$store.commit('HR_ACADEMY_ELITE_TALENT_PERCENT_UPDATE', { show: true, percent: 0 });
					}).catch(err => {
						this.$Message.error(err.msg);
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
		},
		handleInput(e) {
		},
		handleBegin() {},

	
		handleComplete(file, f2) {
			
		},
		handleFileBefore(file) {
			const index = file.name.lastIndexOf('.');
			const name = file.name.substring(0, index);
			const end = file.name.substring(index);
			let pattern = /^[\u4e00-\u9fa5a-zA-Z0-9\\\\(\\\\)（）-]+$/;
			if (name.includes(' ')) {
				this.$Message.error("文件名不能包含空格");
				return false;
			} else if (!pattern.test(name)) {
				this.$Message.error("文件名只能包含中英文、数字、括号、中横线");
				return false;
			} else if ((end !== '.xlsx' && end !== '.xls')) {
				this.$Message.error("只支持.xls、.xlsx格式的文件");
				return false;
			} else {
				return true;
			}
			
		},
		handleFileStart() {
		},
		handleFileSuccess(res, file) {
			this.formValidate.file = [res.data];
		},
		handleFileProgress(percent) {
		},
		handleError(err) {
			this.$Message.error(err.msg);
		},
		handleChange(v) {
		},
		handleExportModel() {
			window.open(OSS_TEMPLATE_FILE02);
		}
	}
};
export const PModalInput = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-academy-elite-talent-import-data {
	.vcp-files-picker {
		margin-top: 0;
	}
	._upload {
            width: 80px;
            text-align: center;
            height: 32px;
            background: #fafafa;
            border: 1px solid #d4d7d8 !important;
            color: #999 !important;
            border-radius: 4px;
			cursor: pointer;
        }
        ._upload:hover {
            border: 1px solid #e74854 !important;
            color: #e74854 !important;
        }

}
</style>
