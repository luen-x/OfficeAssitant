<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="400"
		:loading="true"
		:mask-closable="false"
		class="v-hr-integration-add-modal"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			{{ fetch ? `投诉信息(${index + 1}/${data.length})` : '添加投诉记录' }}
		</div>
		<i v-if="index !== 0" class="icon iconfont icon-prev _left" @click="handlePrev"/>
		<i-form
			ref="form"
			:model="formdata"
			:label-width="100"
			:rules="validator"
		>
			<i-formitem label="投诉方式:" prop="complaint_type">
				<i-select
					v-model="formdata.complaint_type"
					placeholder="请选择投诉方式"
					style="width: 220px"
				>
					<i-option :value="1">微信投诉</i-option>
					<i-option :value="2">电话投诉</i-option>
					<i-option :value="3">跑到办公室投诉</i-option>
					<i-option :value="4">客户对外负面传播</i-option>
					<i-option :value="5">其他</i-option>
				</i-select>
			</i-formitem>
			<i-formitem label="投诉时间:" prop="complaint_time">
				<i-datepicker
					v-model="formdata.complaint_time"
					placeholder="请选择投诉时间"
					style="width: 220px"
					transfer
				/>
			</i-formitem>
			<i-formitem label="投诉员工:">
				<i-select
					v-model="formdata.complaint_staff_id"
					:remote-method="loadStaff"
					:loading="staffLoading"
					:disabled="is_score"
					filterable
					remote
					multiple
					style="width: 220px"
					placeholder="请输入员工关键字搜索"
					clearable
				>
					<i-option 
						v-for="(option, index) in staffData" 
						:value="option.value + ''" 
						:key="index">{{ option.label }}</i-option>
				</i-select>
			</i-formitem>
			<i-formitem label="投诉部门:">
				<oa-tree-select
					v-model="formdata.complaint_depart_id"
					:data-source="departAll"
					:width="200"
					placeholder="请选择投诉部门"
				/>
			</i-formitem>
			<i-formitem label="投诉内容:" prop="content">
				<oa-textarea 
					v-model="formdata.content"
					placeholder="请填写投诉内容"
					clearable
					style="width: 220px"
				/>
			</i-formitem>
			<i-formitem label="投诉证明人:" prop="reference">
				<i-input 
					v-model="formdata.reference"
					:maxlength="15"
					placeholder="请输入投诉证明人"
					style="width: 220px"
				/>
			</i-formitem>
			<i-formitem label="投诉凭证:" prop="fileImage">
				<oa-upload
					v-if="formdata.fileImage.length"
					:max="6"
					:data-source="formdata.fileImage.map(it => ({
						type: it.img_url.substr(it.img_url.lastIndexOf('.')),
						url: it.img_url
					}))"
					disabled
					@preview-start="handlePreviewStart"
					@preview-end="handlePreviewEnd"
				>
					<span slot="trigger"/>
				</oa-upload>
			</i-formitem>
			<i-formitem v-if="data[index].status !== 2 && data[index].status" label="评定积分:">
				<span>{{ item[index].point }}分</span>
			</i-formitem>
		</i-form>
		<i v-if="index !== data.length - 1" class="icon iconfont icon-next _right" @click="handleNext"/>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Input, Select, Option, DatePicker, InputNumber } from 'iview';
import { CreatePortal, ImgsPicker } from 'wya-vc';
import { searchStaff } from '@stores/services/hr';
import moment from 'moment';
import Upload from "@components/_common/upload/upload";
import TextArea from '@components/_common/limit-words/limit-words';
import TreeSelect from '@components/_common/tree-select/tree-select';
import { initTreeData } from '@utils/utils';

export default {
	name: 'hr-add',
	components: {
		'i-modal': Modal,
		'i-input': Input,
		'i-form': Form,
		'i-formitem': FormItem,
		'i-select': Select,
		'i-option': Option,
		'oa-textarea': TextArea,
		'i-datepicker': DatePicker,
		'vc-imgspicker': ImgsPicker,
		'oa-tree-select': TreeSelect,
		'i-input-number': InputNumber,
		"oa-upload": Upload,
	},
	mixins: [searchStaff],	
	props: {
		label: String,
		item: Array,
		idx: Number
	},
	data() {
		return {
			data: this.item,
			visible: false,
			index: this.idx || 0,
			formdata: {
				complaint_depart_id: [],
				fileImage: [],
			},
			departAll: [],
			validator: {
				point: [
					{ required: true, type: 'number', message: '请输入评定积分', trigger: 'blur' }
				],
				complaint_type: [
					{ required: true, type: 'number', message: '请选择投诉方式', trigger: 'change' }
				],
				complaint_time: [
					{ required: true, type: 'date', message: '请选择投诉时间', trigger: 'change' }
				],
				content: [
					{ required: true, message: '请填写投诉内容', trigger: 'blur' }
				],
				reference: [
					{ required: true, message: '请填写投诉证明人', trigger: 'blur' }
				],
				fileImage: [
					{ required: true, type: 'array', message: '请上传凭证', trigger: 'change' }
				]
			},
			is_score: false
		};
	},
	computed: {
		fetch() {
			return this.idx || this.idx === 0;
		}
	},
	mounted() {
		this.visible = true;
		this.loadData();
	},
	methods: {
		handleOk() {
			this.$refs.form.validate(item => {
				this.$refs.modal.buttonLoading = false;
				if (item) {
					let fileArray = [];
					this.formdata.fileImage.map(v => {
						fileArray.push({ url: v.img_url });
						return;
					});
					this.$request({
						url: this.fetch 
							? '_HR_EMPLOYEE_SCORE_INTEGRATION_RECORD_EDIT_POST' 
							: '_HR_EMPLOYEE_SCORE_INTEGRATION_RECORD_ADD_POST',
						type: 'POST',
						loading: false,
						param: {
							...this.formdata,
							complaint_depart_id: this.formdata.complaint_depart_id.join(','),
							complaint_staff_id: this.formdata.complaint_staff_id.join(','),
							complaint_time: this.formdata.complaint_time && moment(this.formdata.complaint_time).format('YYYY-MM'),
							contract_company_id: !this.fetch && this.item.contract_company_id,
							fileImage: fileArray
						}
					}).then(res => {
						this.$Message.success(res.msg);
						this.$emit('sure');
					}).catch(err => {
						this.$Message.error(err.msg);
					});
				}
			});
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handlePrev() {
			this.index -= 1;
			this.loadInfo();
		},
		handleNext() {
			this.index += 1;
			this.loadInfo();
		},
		async loadData() {
			await this.loadDepart();
			this.fetch && this.loadInfo();
		},
		loadDepart() {
			return this.$request({
				url: '_HR_DEPART_ALL_GET',
				type: 'GET',
				loading: false,
			}).then(res => {
				this.departAll = initTreeData(res.data, 'depart_id', 'depart_name', 'child');
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		loadInfo() {
			this.$request({
				url: '_HR_EMPLOYEE_SCORE_INTEGRATION_RECORD_GET',
				type: 'POST',
				loading: false,
				param: {
					type: 5,
					service_record_id: this.item[this.index].service_record_id,
				}
			}).then(res => {
				const { staff = [], ...data } = res.data;
				this.staffData = staff.map(item => {
					return {
						value: item.complaint_staff_id,
						label: item.complaint_staff_name
					};
				});
				data.complaint_staff_id = staff.map(item => item.complaint_staff_id);
				data.complaint_depart_id = data.complaint_depart_id.map(Number);
				this.formdata = { ...data };
				// res.data.fileImage.forEach(item => {
				// 	this.formdata.fileImage.push({
				// 		url: item.img_url,
				// 		title: item.img_url.split("/")[6],
				// 		type: "." + item.img_url.split("/")[6].split(".")[1],
				// 		uid: item.img_url
				// 	});
				// });
				this.is_score = !!res.data.is_score;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handlePreviewStart() {
			this.$vc.emit('ORDER_MODAL_ENABLE', { enable: false });
		},
		handlePreviewEnd() {
			this.$vc.emit('ORDER_MODAL_ENABLE', { enable: true });
		}
	}
};
export const AddModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-hr-integration-add-modal {
	._left {
		position: absolute;
		left: 16px;
		top: 40%;
		font-size: 20px;
		cursor: pointer;
		color: #818794;
	}
	._right {
		position: absolute;
		right: 16px;
		top: 40%;
		font-size: 20px;
		cursor: pointer;
		color: #818794;
	}

	.ivu-modal-body {
		max-height: 500px;
		overflow: auto;
	}
}
</style>