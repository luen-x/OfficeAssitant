<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true" 
		:mask-closable="false"
		width="400px" 
		class="v-hr-recruit-paper-import"
		@on-ok="handleOk"
		@on-close="handleCancel"
	>
		<div slot="header" class="g-tc">
			<span>数据导入</span>
		</div>

		<i-form 
			ref="formData" 
			:label-width="120"
			@submit.native.prevent
		>
			<i-form-item label="请选择导入文件：">
				<oa-manul-upload 
					:input-option="{accept:'.xls, .xlsx'}" 
					@change="handleImport"
				>
					<span v-if="fileName">{{ fileName }}</span>
					<i-button v-else>选择文件</i-button>
				</oa-manul-upload>
			</i-form-item>
			<div class="g-m-l-10">
				<span 
					class="g-c-blue-mid g-pointer" 
					@click="handleDownload"
				>
					下载导入模板
				</span>
			</div>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Button, Form, FormItem } from 'iview';
import { CreatePortal } from 'wya-vc';
import API_ROOT from "@stores/apis/root";
import orderModal from '@extends/mixins/orderModal';
import ManulUpload from '@components/sale/_common/manul-upload/upload';

export default {
	name: "oa-recruit-paper-import",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		'oa-manul-upload': ManulUpload
	},
	mixins: [orderModal],
	props: {
		paperId: [String, Number]
	},
	data() {
		return {
			visible: false,
			file: null,
			fileName: ''
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		/**
		 * 点击取消
		 */
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleImport(files) {
			this.file = files[0];
			this.fileName = files[0].name;
		},
		/**
		 * 点击确定
		 */
		handleOk() {
			let data = new FormData();
			data.append('file', this.file);
			data.append('paper_id', this.paperId);
			fetch(API_ROOT._HR_RECRUIT_SCHOOL_IMPORT_QUESTION_POST, {
				method: 'post',
				body: data,
				headers: {
					'-token': this.$global.token,
				},
				credentials: 'include'
			}).then(async (res) => {
				const { msg, status, data: { return_tips } } = await res.json();
				if (status) {
					this.$emit('sure');
					this.$Message.success('文件上传成功，正在导入');
				} else {
					this.$emit('close');
					this.$Message.error('上传失败');
				}
			}).catch(err => {
				this.$emit('close');
				this.$Message.error('上传失败');
			}).finally(() => {
				this.visible = false;
				this.$refs.modal.buttonLoading = false;
			});
		},
		handleDownload() {
			window.open(API_ROOT._HR_RECRUIT_SCHOOL_DOWNLOAD_TEMPLATE_POST + "?-token=" + _global.token, '_blank');
		}
	}
};

export const RecruitPaperImport = CreatePortal({}, module.exports.default);

</script>

<style lang="scss">

</style>

