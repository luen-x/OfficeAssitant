<template>
	<i-modal 
		ref="modal"
		v-model="visible"
		:loading="true"  
		:mask-closable="false" 
		title="举报错误关联客户"
		width="400" 
		@on-ok="handleSave"
		@on-cancel="handleCancel"
	>
		<i-form
			ref="form"
			:model="formData"
			:rules="rules"
			:label-width="110"
			class="g-pd-l-10"
		>
			<i-form-item label="举报公司：" style="margin-bottom: 5px !important;">
				{{ companyName }}
			</i-form-item>
			<i-form-item label="举报联系电话：" prop="link_id">
				<i-select 
					v-model="formData.link_id"
					placeholder="请选择联系方式"
					style="width:220px"
					clearable 
				>
					<i-option 
						v-for="link in linkList"
						:key="link.link_id" 
						:value="link.link_id"
					>
						{{ link.customer_name+'/'+link.customer_role+'/'+link.original_tel }}
					</i-option>
				</i-select>
			</i-form-item>
			<i-form-item label="举报原因：" style="margin-bottom: 5px !important;">
				错误的手机号导致资料关联
			</i-form-item>
			<i-form-item label="举报说明：" prop="remark">
				<oa-limit-words
					v-model="formData.remark"
					:max="200"
					placeholder="请输入举报说明"
					style="width: 220px"
				/> 
			</i-form-item>
			<i-form-item label="凭证：" prop="images">
				<oa-upload
					v-model="formData.images"
					:max="10"
					:upload="{multiple: true, max: 10}"
					placeholder="请上传聊天截图或工商信息截图等凭证"
					style="width: 220px"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>
<script>
import { Modal, Icon, Input, Form, FormItem, RadioGroup, Radio, Button, Poptip, Select, Option } from 'iview';
import Explain from '@components/_common/explain/explain';
import { CreatePortal } from 'wya-vc';
import { dataValidity, objRegex } from '@utils/utils';
import Upload from '@common/upload/upload';

export default {
	name: "oa-sale-",
	components: {
		'i-modal': Modal,
		'i-icon': Icon,
		'i-input': Input,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-button': Button,
		'i-poptip': Poptip,
		'oa-explain': Explain,
		'i-select': Select,
		'i-option': Option,
		'oa-upload': Upload
	}, 
	props: {
		companyName: String,
		customerId: Number,
		linkList: Array

	},
	data() {
		return {
			visible: false,
			formData: {
				link_id: '',
				remark: '',
				images: [],
				type: 1, // 1-错误关联举报，2-跟进记录举报
				reason_type: 0, // 错误关联举报 固定给0
				
			},
			rules: {
				link_id: [{ required: true, type: 'number', message: "请选择联系方式", trigger: "change" }],
				remark: [{ required: true, type: 'string', message: "请填写举报说明", trigger: "blur" }],
				images: [{ required: true, type: 'array', message: "请上传凭证", trigger: "change" }],
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
				if (valid) {
					const param = { ...this.formData, customer_id: this.customerId };
					param.images = param.images.map(i => i.url);

					const link = this.linkList.find(i => i.link_id === param.link_id);
					if (!link) return console.error('link 找不到', { linkList: this.linkList, link_id: param.link_id });
					param.link_list = [{ 
						link_id: link.link_id, 
						original_tel: link.original_tel, 
						link_str: link.customer_name + '/' + link.customer_role + '/' + link.original_tel,
						add_time: link.create_time,
						staff_id: link.staff_id

					}];
					delete param.link_id;
					this.$request({
						url: '_SALE_CUSTOMER_REPORT_SAVE_POST',
						type: "POST",
						param,
						loading: false
					}).then(res => {
						this.$Message.success(res.msg);
						this.visible = false;
						this.$emit('sure');
					}).catch((res) => {
						this.$Message.error(res.msg);
						this.$refs.modal.buttonLoading = false;
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		}
	}
};
export const TipOffLink = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
</style>