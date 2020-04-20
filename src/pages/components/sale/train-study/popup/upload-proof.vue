<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		:title="title"
		width="680"
	>
		<i-form ref="form" :model="formData" :rules="ruleValidate" :label-width="123">
			<i-form-item label="课程：" >
				{{ course }}
			</i-form-item>
			<i-form-item prop="voucher" label="上传凭证：">
				<oa-content-upload
					ref="upload"
					v-model="formData.voucher"
					:data-source="voucher"
					:size="200"
					:max="4"
					style="margin:0;width:300px"
					accept=".rar, .zip, .doc, .docx, .pdf, .jpg, .png, .ppt, .MP3, .MP4, .xlsx, .avi, .wmv, .flv, .vob, .dat, .mkv, .asf, .asx"
					@error="handleFileError"
					@postFile="handlePreview"
				>
					<div slot="trigger" class="g-flex">
						<i-button>本地上传</i-button>
					</div>
					<div slot="top" class="g-c-black4 g-m-t-5" style="line-height: 16px">
						本地上传支持扩展名：.rar .zip .doc .docx .pdf .jpg .png .ppt .MP3 .xlsx .mp4 .avi .wmv .flv
						,最多可上传4张
					</div>
				</oa-content-upload>
			</i-form-item>
			<div style="margin-left: 120px;">
				<i-button @click="handleAddLink">添加链接</i-button><div>最多可添加4个</div>
			</div>
			<i-form-item
				v-for="(item,index) in formData.link"
				:key="index"
				:prop="'link.' + index + '.url'"
				:rules="{required: true, message: '请添加链接', trigger: 'blur'}"
				style="margin-bottom: 10px !important"
			>
				<div class="g-flex g-m-t-10">
					<i-input v-model.trim="item.url" style="width:300px;margin-right: 10px" />
					<span class="g-operation" @click="handleLinkDel(index)">删除</span>
				</div>
			</i-form-item>
		</i-form>
		<div slot="footer">
			<i-button type="text" @click="handleCancel">取消</i-button>
			<i-button type="primary" @click="handleOk">确定</i-button>
		</div>
	</i-modal>
</template>
<script>
import { Modal, Form, FormItem, Icon, Button, Input, Select, Option, DatePicker } from 'iview';
import { CreatePortal, CreateCustomer, ImgsPicker } from 'wya-vc';
import { debounce } from 'lodash';
import { FilePreview } from '@common/file-preview/file-preview';
import ContentUpload from '@components/content/_common/upload';

const Content = CreateCustomer({
});
export default {
	name: "vc-upload-proof",
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-modal': Modal,
		'i-icon': Icon,
		'i-button': Button,
		'i-input': Input,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		'vc-imgs-picker': ImgsPicker,
		'oa-content': Content,
		'oa-content-upload': ContentUpload
	},
	props: {
		data: {
			type: Object,
			default() {
				return {
					course: "",
				};
			}
		},
		title: {
			type: String,
			default: '上传作业',
		},
		course: String,
		is_upload: [String, Number],
		course_id: [String, Number]

	},
	data() {
		return {
			visible: false,
			loading: false,
			need: {},
			voucher: [],
			formData: {
				course_id: this.course_id,
				voucher: [],
				link: [],
			},
			ruleValidate: {
				voucher: [
					{ required: true, type: "array", message: '请上传作业', trigger: 'change' }
				],
			}
		};
	},
	mounted() {
		this.visible = true;
		this.is_upload && this.loadDeail();

	},
	methods: {
		handleAddLink() {
			this.formData.link.length == 4 ? '' : this.formData.link.push({ url: '', type: '2' });
			if (this.formData.link.length) {
				this.ruleValidate.voucher[0].required = false;
			}
		},
		handleLinkDel(i) {
			this.formData.link.splice(i, 1);
			if (!this.formData.link.length) {
				this.ruleValidate.voucher[0].required = true;
			}
		},
		handleOk: debounce(function () {
			this.$refs.form.validate((isValid) => {
				if (isValid) {
					let file = [];
					this.formData.voucher.map(ele => {
						file.push({
							file_name: ele.title,
							url: ele.url,
						});
						return;
					});
					let link = this.formData.link.map(ele => ele.url);
					this.handleSeavVoucher(file, link);
				} else {
					this.$Message.error('内容请填写完整');
				}
			});
		}, 200),
		handleSeavVoucher(file, link) {
			this.$request({
				url: '_SALE_TRAIN_EXAM_SUBMIT_AUDIT_POST',
				type: "post",
				param: {
					...this.formData,
					voucher: file,
					link,
				}
			}).then((res) => {
				this.$Message.success(res.msg);
				this.visible = false;
				this.$emit('sure', 1);
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		handleFileError(res) {
			if (res.msg && res.msg.includes('大小限制')) {
				this.$Message.error('文件过大(限制为200M)');
			} else {
				this.$Message.error(res.msg);
			}
		},
		handlePreview(e, item) {
			this.$emit('preview-start');
			FilePreview.popup({
				data: {
					fileUrl: item.url,
					x: e.clientX,
					y: e.clientY
				}
			}).then((res) => {}).catch((err) => {}).finally(() => {
				this.$emit('preview-end');
			});
		},
		loadDeail() {
			this.$request({
				url: '_SALE_TRAIN_EXAM_VOUCHER_DETAIL_GET',
				type: 'GET',
				param: {
					course_id: this.course_id
				},
			}).then((res) => {
				this.formData.course_name = res.data.course_name;
				res.data.voucher.forEach(ele => {
					this.voucher.push({
						percent: "100.00",
						title: ele.file_name,
						url: ele.url });
				});
				res.data.link.forEach(ele => {
					this.formData.link.push({
						url: ele,
						type: '2'
					});
				});
				if (this.formData.link.length) {
					this.ruleValidate.voucher[0].required = false;
				}
			});
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close', 0);
		},
		handleError(err) {
			this.$Message.error(err.msg);
		}

	}
};
export const UploadProof = CreatePortal({}, module.exports.default);
</script>
