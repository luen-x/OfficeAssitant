<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true" 
		:mask-closable="false"
		width="400px" 
		class="v-tech-project-plan-import"
		@on-ok="handleOk"
		@on-close="handleCancel"
	>
		<div slot="header" class="g-tc">
			<span>数据导入</span>
		</div>

		<i-form 
			ref="form" 
			:model="formData" 
			:rules="rules"  
			:label-width="120"
			@submit.native.prevent
		>
			<i-form-item label="选择项目：" prop="project_id">
				<i-select 
					v-model="formData.project_id"
					clearable 
					filterable
					transfer
					placeholder="请选择项目"
					style="width: 220px;"
				>
					<i-option 
						v-for="(item, index) in projectList" 
						:key="index"
						:value="item.project_id"
					>{{ item.project_name }}</i-option>
				</i-select>
			</i-form-item>
			<i-form-item label="请选择导入文件：">
				<oa-manul-upload 
					:input-option="{accept:'.xls, .xlsx'}" 
					@change="handleImport"
				>
					<div v-if="fileName" style="margin-top: 2px;">
						<span class="g-m-r-30">{{ fileName }}</span>
						<i class="icon iconfont icon-close g-fs-12 g-pointer" @click.prevent="handleDel"/>
					</div>
					<i-button v-else>选择文件</i-button>
				</oa-manul-upload>
			</i-form-item>
			<div style="margin-left: 35px;">
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
import { Modal, Button, Form, FormItem, Select, Option } from 'iview';
import { CreatePortal } from 'wya-vc';
import API_ROOT from "@stores/apis/root";
import orderModal from '@extends/mixins/orderModal';
import ManulUpload from '@components/sale/_common/manul-upload/upload';

export default {
	name: "oa-project-plan-import",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-select': Select,
		'i-option': Option,
		'oa-manul-upload': ManulUpload
	},
	mixins: [orderModal],
	data() {
		return {
			visible: false,
			fileName: '',
			projectList: [],
			formData: {
				project_id: '',
				file: null
			},
			rules: {
				project_id: [{ required: true, type: 'number', message: '请选择项目', trigger: 'change' }],
			}
		};
	},
	mounted() {
		this.visible = true;
		this.loadProjectList();
	},
	methods: {
		loadProjectList() {
			this.$request({
				url: 'TECH_PROJECT_PLAN_OVERVIEW_LIST_GET',
				type: 'GET',
				loading: false,
				param: { 
					is_page: 0
				},
				autoTip: false
			}).then(res => {
				if (Array.isArray(res.data.list) && res.data.list.length) {
					this.projectList = res.data.list;
				}
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 点击取消
		 */
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleImport(files) {
			this.formData.file = files[0];
			this.fileName = files[0].name;
		},
		/**
		 * 点击确定
		 */
		handleOk() {
			this.$refs.form.validate((valid) => {
				if (valid) {
					let data = new FormData();
					data.append('project_id', this.formData.project_id);
					data.append('file', this.formData.file);
					fetch(API_ROOT._TECH_PROJECT_NEED_IMPORT_POST, {
						method: 'post',
						body: data,
						headers: {
							'-token': this.$global.token,
						},
						credentials: 'include'
					}).then(async (res) => {
						const { msg, status, data: { return_tips } } = await res.json();
						if (status) {
							this.visible = false;
							this.$refs.modal.buttonLoading = false;
							this.$emit('sure', {
								project_id: this.formData.project_id
							});
							this.$Message.success('文件上传成功，正在导入');
						} else {
							this.$refs.modal.buttonLoading = false;
							this.$Message.error(msg);
						}
					}).catch(error => {
						this.visible = false;
						this.$refs.modal.buttonLoading = false;
						this.$emit('close');
						this.$Message.error(error.msg);
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleDownload() {
			window.open(API_ROOT._TECH_PROJECT_NEED_DOWNLOAD_TEMPLATE_GET + "?-token=" + _global.token, '_blank');
		},
		handleDel(e) {
			e.stopPropagation();
			this.fileName = '';
		}
	}
};

export const ProjectPlanImport = CreatePortal({}, module.exports.default);

</script>

<style lang="scss">
.v-tech-project-plan-import {
	.ivu-form .ivu-form-item-label {
		padding-right: 0;
	}
}
</style>

