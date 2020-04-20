<template>
	<div>
		<i-modal
			ref="modal"
			:loading="true"
			v-model="visible"
			:title="edit ? '编辑岗培课程' : '新建岗培课程'"
			:width="400"
			:mask-closable="false"
			class="v-academy-support-course-pre-modal"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<i-form
				ref="form" 
				:model="formData" 
				:label-width="100" 
				:rules="formDataRule" 
				class="g-m-t-20 g-pd-l-10"
			>
				<i-form-item 
					label="TAB命名：" 
					prop="tab"
				>
					<i-input 
						v-model="formData.tab"
						:maxlength="6"
						style="width:220px"
						placeholder="请输入TAB命名"
					/>
				</i-form-item>
				<i-form-item 
					label="课程名称：" 
					prop="course_name"
				>
					<i-input 
						v-model="formData.course_name"
						:maxlength="30"
						style="width:220px"
						placeholder="请输入课程名称"
					/>
				</i-form-item>
				<i-form-item label="适用部门：" prop="depart_ids">
					<i-select
						v-model="formData.depart_ids"
						style="width: 220px"
						clearable
						transfer
						multiple
						placeholder="请选择适用部门"
					>
						<i-option
							v-for="(option, index) in departList"
							:value="option.depart_id"
							:key="index">{{ option.depart_name }}</i-option>
					</i-select>
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Form, FormItem, Message, Select, Option, Radio, RadioGroup, InputNumber, Input } from 'iview';
import API_ROOT from '@stores/apis/root';
import { services as commonServices } from '@stores/services/common';
import { CreatePortal } from 'wya-vc';
import { dataValidity } from '@utils/utils';
import moment from 'moment';

export default {
	name: 'v-academy-support-course-pre-modal',
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-select': Select,
		'i-option': Option,
		'i-input': Input,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
	},
	mixins: [
		commonServices.region()
	],
	props: {
		data: {
			type: Object,
			default: () => {}
		},
		edit: {
			type: Number,
			default: 0
		},
		calendar_id: Number
	},
	data() {
		return {
			visible: false,
			course_id: '',
			formData: {
				tab: '',
				course_name: '',
				depart_ids: [],
			},
			formDataRule: {
				tab: [{ type: 'string', required: true, message: '请填写TAB名称', trigger: 'blur' }],
				course_name: [{ type: 'string', required: true, message: '请填写课程名称', trigger: 'blur' }],
				depart_ids: [{ type: 'array', required: true, message: '请选择适用部门', trigger: 'change' }],
			},
			departList: []
		};
	},
	watch: {
	},
	mounted() {
		this.visible = true;
		this.loadDepartData();
		this.edit ? this.loadData() : '';
	},
	methods: {
		loadDepartData() {
			this.$request({
				url: "_HR_DEPART_ALL_GET",
				type: "GET",
				param: {},
				loading: false
			}).then(res => {
				this.departList = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
        
		loadData() {
			this.$request({
				url: "_ACADEMY_SUPPORT_COURSE_PRE_DETAIL_GET",
				type: "GET",
				param: {
					course_id: this.data.course_id
				},
				loading: false
			}).then(res => {
				this.formData = { ...res.data };
				this.course_id = res.data.course_id;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

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
			let obj = {
				...this.formData
			};
			this.edit ? obj.course_id = this.course_id : '';
			this.$request({
				url: "_ACADEMY_SUPPORT_COURSE_PRE_ADD_POST",
				type: "POST",
				param: obj,
				loading: false
			}).then(res => {
				this.$Message.success(this.edit ? '编辑成功' : '新建成功');
				this.$store.commit('ACADEMY_SUPPORT_COURSE_LIST_INIT');
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		handleCancel() {
			this.$emit('close');
		}
	}
};
export const PreModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>

</style>