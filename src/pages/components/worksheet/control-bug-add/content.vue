<template>
	<div class="v-worksheet-control-bug-add g-flex-cc">
		<i-form 
			ref="form" 
			:model="formData"
			:rules="formDataRule" 
			:label-width="120" 
			class="g-m-b-30"
			position="left"
			@submit.native.prevent
		>
			<div class="g-flex">
				<div class="g-inline-block">
					<i-form-item 
						label="所属项目：" 
						prop="system_id"
					>
						<i-select
							v-model="formData.system_id"
							class="g-m-r-5"
							style="width: 350px;"
							clearable
							filterable
							transfer
							placeholder="请选择所属项目"
							@on-change="handleChangeSystem"
						><i-option
							v-for="(v, index) in systemList"
							:key="index"
							:value="v.system_id"
						>{{ v.system_name }}</i-option>
						</i-select>
					</i-form-item>
					<i-form-item label="指派：" prop="assign_staff_id">
						<i-select
							ref="staff_assign"
							:value="formData.assign_staff_id"
							:remote-method="loadTechStaff"
							:loading="staffTechLoading"
							:disabled="!formData.enable_edit_assign"
							class="g-m-r-5"
							style="width: 350px;"
							filterable
							remote
							clearable
							transfer
							label-in-value
							placeholder="请选择指派人员"
							@on-change="handleChangeAssign"
						>
							<i-option
								v-for="(item, index) in staffTechData"
								:key="index"
								:value="item.staff_id"
							>{{ item.staff_name }}</i-option>
						</i-select>
					</i-form-item>
					<i-form-item 
						label="客户账号：" 
						prop="customer_account"
					>
						<i-input
							v-model="formData.customer_account"
							:maxlength="50"
							placeholder="请输入客户账号" 
							style="width: 350px" 
							clearable
						/>
					</i-form-item>
				</div>
				<div class="g-inline-block">
					<i-form-item
						label="所属模块：" 
						prop="module_id"
					>
						<i-cascader
							:data="moduleList"
							v-model="formData.module_id"
							:change-on-select="true"
							:placeholder="formData.system_id ? '请选择所属模块' : '请先选择所属项目'"
							trigger="click"
							clearable
							transfer
							style="width: 350px;display:inline-block"
							class="g-m-r-5"
							@on-change="handleChangeModule"
						/>
					</i-form-item>
					<i-form-item label="抄送：" prop="copy_for_staff_ids">
						<i-select
							ref="staff_copy"
							:value="formData.copy_for_staff_ids"
							:remote-method="remote"
							:loading="staffLoading"
							:disabled="!formData.enable_edit_assign"
							class="g-m-r-5"
							style="width: 350px;"
							multiple
							filterable
							remote
							clearable
							transfer
							placeholder="请选择抄送人员"
							@on-change="handleChangeCopy({copy_for_staff_ids: arguments[0]})"
						>
							<i-option
								v-for="(item, index) in staffData"
								:key="index"
								:value="item.value"
							>{{ item.label }}</i-option>
						</i-select>
					</i-form-item>
					<i-form-item 
						label="客户端来源：" 
						prop="customer_source"
					>
						<i-select
							v-model="formData.customer_source"
							class="g-m-r-5"
							style="width: 350px;"
							clearable
							filterable
							transfer
							placeholder="请选择客户端来源"
						><i-option
							v-for="(v, index) in sourceList"
							:key="index"
							:value="v.id"
						>{{ v.name }}</i-option>
						</i-select>
					</i-form-item>
				</div>
			</div>
			<i-form-item label="bug标题：" prop="title" class="g-inline-block">
				<i-input 
					v-model="formData.title" 
					:maxlength="50" 
					placeholder="请输入bug标题"
					style="min-width:570px;max-width:570px;"
				/>
			</i-form-item>
			<div class="g-inline-block">
				<i-form-item label="优先级：" prop="priority">
					<i-select
						v-model="formData.priority"
						class="g-m-r-5"
						style="width: 131px;"
						clearable
						filterable
						transfer
						placeholder="请选择优先级"
					>
						<i-option
							v-for="(v, index) in priorityList"
							:key="index"
							:value="v.name"
						>{{ v.name }}</i-option>
					</i-select>
				</i-form-item>
			</div>
			<i-form-item label="敏感信息：" prop="sensitive_info">
				<oa-limit-words
					v-model="formData.sensitive_info" 
					:max="200" 
					style="min-width:400px;width:825px;"
					class="g-dp-ib"
					placeholder="请在此处填写账号密码等敏感信息"
				/>
			</i-form-item>
			<i-form-item label="问题描述：" prop="describe">
				<vc-editor
					ref="editor"
					v-model="formData.describe"
					:options="options"
					style="min-width:400px;width:825px;"
					@file-error="handleError"
				/>	
			</i-form-item>
			<i-form-item label="添加附件：">
				<oa-content-upload
					ref="upload"
					v-model="formData.attach"
					:size="100"
					:max="5"
					style="margin:0;width:825px;"
					accept=".rar, .zip, .doc, .docx, .pdf, .jpg, .png, .ppt, .MP3, .MP4, .xlsx, .avi, .wmv, .flv, .vob, .dat, .mkv, .asf, .asx"
					@error="handleFileError"
					@postFile="handlePreview"
				>
					<div slot="trigger" class="g-flex">
						<i-button>本地上传</i-button>
					</div>
					<div slot="top" class="g-c-black4 g-m-t-5" style="line-height: 16px">
						本地上传支持扩展名：.rar .zip .doc .docx .pdf .jpg .png .ppt .MP3 .xlsx .mp4 .avi .wmv .flv
						,最多可上传5张
					</div>
				</oa-content-upload>
			</i-form-item>
		</i-form>
		
		<div class="_footer g-flex-cc">
			<div
				class="g-gray-btn-small g-m-r-10"
				@click="handleCancel"
			>
				取消
			</div>
			<vc-debounce-click
				class="g-red-btn-small"
				@click="handleOk"
			>
				保存
			</vc-debounce-click>
		</div>
	</div>
</template>

<script>
import { 
	Form, FormItem, Input, InputNumber, 
	Select, Option, DatePicker, Cascader, Message, Button
} from 'iview';
// utils
import { services, createSearch, searchCompany, searchTechStaff, staffByNameOrPhone } from '@stores/services/hr';
import { Editor, FilesPicker, ImgsPicker } from "wya-vc";
import { FilePreview } from '@common/file-preview/file-preview';
import { dataValidity, initTreeData, getItem } from '@utils/utils';
import { Confirm } from '@common/confirm/confirm';
import ContentUpload from '@components/content/_common/upload';
import API_ROOT from "@stores/apis/root";

export default {
	name: 'oa-content',
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		'i-cascader': Cascader,
		"vc-editor": Editor,
		'vc-imgs-picker': ImgsPicker,
		'i-button': Button,
		'oa-content-upload': ContentUpload
	},
	mixins: [
		staffByNameOrPhone,
		searchCompany,
		searchTechStaff
	],
	data() {
		return {
			remote: null,
			attach: [],
			formData: {
				copy_for_staff_name: '',
				assign_staff_name: '',
				system_id: null,
				module_id: [],
				priority: 2,
				// contract_company_id: null,
				assign_staff_id: null,
				copy_for_staff_ids: [],
				title: '',
				describe: '',
				sensitive_info: '',
				customer_account: '',
				customer_source: 1,
				attach: [], // 添加附件
				enable_edit_assign: 1
			},
			formDataRule: {
				system_id: [
					{ required: true, type: 'number', message: '请选择项目', trigger: 'change' }
				],
				module_id: [
					{ required: true, type: 'array', message: '请选择模块', trigger: 'change' }
				],
				priority: [
					{ required: true, type: 'number', message: '请选择优先级', trigger: 'change' }
				],
				assign_staff_id: [
					{ required: true, type: 'number', message: '请选择指派人员', trigger: 'change' }
				],
				title: [
					{ required: true, message: 'bug标题不可为空', trigger: 'change' }
				],
				describe: [
					{ required: true, message: '问题描述不可为空', trigger: 'change' }
				],
				customer_source: [
					{ required: true, type: 'number', message: '客户端来源不可为空', trigger: 'change' }
				],
			},
			systemList: [], // 系统项目列表
			priorityList: [
				{
					name: 1,
				},
				{
					name: 2,
				},
				{
					name: 3,
				},
				{
					name: 4,
				}
			],
			sourceList: [
				{
					id: 1,
					name: 'PC',
				},
				{
					id: 2,
					name: 'APP',
				},
				{
					id: 3,
					name: 'H5',
				}
			],
			moduleList: [],
			options: {
				modules: {
					toolbar: '#toolbar',
				},
			},
			tempStaff: []
		};
	},
	mounted() {
		if (+this.$route.query.system_id) {
			this.formData.system_id = +this.$route.query.system_id;
			this.handleModuleList(+this.$route.query.system_id);
		}
		this.handleLoadStaffData(() => {
			this.$nextTick(() => {
				this.remote = this.loadStaff();
			});
		});
		this.$route.query.edit ? this.initInfo() : '';
		this.handleSystemList();
		this.$nextTick(() => {
			let editor = document.getElementsByClassName('ql-editor');
			editor[0].dataset.placeholder = '若填写账号密码信息，请通过“敏感信息”方式添加';
		});
	},
	methods: {
		handleFileError(res) {
			if (res.msg && res.msg.includes('大小限制')) {
				this.$Message.error('文件过大(限制为100M)');
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
		async initInfo() {
			await this.loadInfo();
			await this.handleModuleList(this.formData.system_id);
		},
		handleChangeSystem(e) {
			if (e) {
				this.formData.module_id = [];
				this.handleModuleList(e);
			} else {
				this.formData.module_id = [];
			}
		},
		handleChangeModule(e) {
			if (this.$global.staff.first_depart_sn !== 'tec') {
				this.$request({
					url: '_WORKSHEET_CONTROL_BUG_RELATION_GET',
					type: "GET",
					param: {
						module_id: e[e.length - 1]
					},
					loading: false
				}).then((res) => {
					this.$refs.staff_assign.query = res.data.staff_name;
					this.formData.assign_staff_id = res.data.staff_id;
				}).catch((error) => {
				});
			}
		},
		handleChangeCopy(obj) {
			if (obj.copy_for_staff_ids.length > 10) {
				this.$refs.staff_copy.values.pop();
				this.$Message.warning('最多选择10个抄送人员');
			} else {
				this.formData.copy_for_staff_ids = obj.copy_for_staff_ids;
			}
		},
		handleChangeAssign(obj) {
			if (obj) {
				this.$refs.staff_assign.query = obj.label;
				this.formData.assign_staff_id = obj.value;
			}
		},
		handleError(e) {
			this.$Message.warning(e.msg);
		},
		handleSystemList() {
			this.$request({
				url: '_WORKSHEET_CONTROL_BUG_SYSTEM_GET',
				type: "GET",
				param: {},
				loading: false
			}).then((res) => {
				this.systemList = res.data;
			}).catch((error) => {
			});
		},
		// 设置远程搜索刷新后值保持
		handleLoadStaffData() {
			return this.$request({
				url: API_ROOT._HR_MUTI_TERM_STAFF_GET,
				type: 'GET',
				param: {
					search: '1' // 为了能搜索到全部的员工数据（手机号码必定有1）
				},
				loading: false
			}).then((res) => {
				this.staff = Number(this.$route.query.staff_id);
				this.staffData = initTreeData(res.data, 'staff_id', 'staff_name');
			}).then(() => {
				this.remote = this.loadStaff;
			}).catch((error) => {
					
			});
		},
		async loadInfo() {
			return this.$request({
				url: '_WORKSHEET_CONTROL_TECH_EDIT_INFO_GET',
				type: "GET",
				param: {
					bug_id: this.$route.query.bug_id,
					opt_type: 1
				},
				loading: false
			}).then((res) => {
				this.formData = { ...res.data };
				this.formData.module_id = res.data.modules.map(v => v.module_id).map(Number);
				if (res.data.pre_solve_staff_id) {
					this.$refs.staff_assign.query = res.data.pre_solve_staff_name;
					this.formData.assign_staff_id = res.data.pre_solve_staff_id;
				} else {
					this.$refs.staff_assign.query = res.data.assign_staff_name;
					this.formData.assign_staff_id = res.data.assign_staff_id;
				}
				this.formData.copy_for_staff_ids = res.data.copy_for_staff_ids.split(',').map(Number);
				this.formData.customer_source = res.data.customer_source || 1;
				this.tempStaff = res.data.copy_staff;
				res.data.fileImage.forEach(ele => {
					this.attach.push({
						percent: "100.00",
						title: ele.file_name,
						url: ele.url 
					});
				});
				this.formData.attach = this.attach;
				this.$refs.upload.$refs.filesPicker.data = this.formData.attach;
			}).then(res => {
				this.loadTechStaff(this.$refs.staff_assign.query);
				// this.loadCompany(this.$refs.company.query);
			}).catch((error) => {
			});
		},
		async handleModuleList(e) {
			return this.$request({
				url: '_WORKSHEET_CONTROL_BUG_MODULE_GET',
				type: "GET",
				param: {
					system_id: e
				},
				loading: false
			}).then((res) => {
				let arr = [];
				this.moduleList = this.formatModule(res.data);
			}).catch((error) => {
			});
		},
		formatModule(arr) {
			const target = arr.map(it => {
				const result = {
					label: it.module_name || '',
					value: it.module_id || null,
					children: it.children || []
				};
				if (result.children.length > 0) {
					result.children = this.formatModule(result.children);
				} else {
					delete result.children;
				}
				return result;
			});
			return target;
		},
		handleOk() {
			this.$refs.form.validate(valid => {
				if (valid) {
					this.handleSave();
				}
			});
		},
		handleCancel() {
			Confirm.popup({
				title: "",
				msg: '取消后，所填写的内容将不会保存，是否确认取消？',
				showIcon: true
			}).then(() => {
				this.$router.go(-1);
			}).catch(error => {
			});
		},
		handleSave() {
			let param = {
				...this.formData,
				module_id: this.formData.module_id[this.formData.module_id.length - 1],
				module_ids: this.formData.module_id.join(','),
				copy_for_staff_ids: this.formData.copy_for_staff_ids.join(','),
				attach: this.formData.attach.map(v => ({ url: v.url, file_name: v.title }))
			};
			if (this.$route.query.bug_id) {
				param.bug_id = this.$route.query.bug_id;
				param.status = this.$route.query.status;
			}
			this.$request({
				url: API_ROOT['_WORKSHEET_CONTROL_BUG_ADD_POST'], // eslint-disable-line
				type: "POST",
				param
			}).then((res) => {
				Message.success('保存成功');
				let urlPath = '';
				let bugId = '';
				if (!this.$route.query.edit || this.$route.query.edit == '1') {
					urlPath = '/worksheet/control/bug';
				} else {
					urlPath = '/worksheet/control/bug/detail';
					bugId = this.$route.query.bug_id;
				}
				this.$router.push({
					path: urlPath,
					query: {
						bug_id: bugId
					}
				});
			}).catch((error) => {
				Message.error(error.msg);
			});
		}
	},
};
</script>

<style lang="scss">
.v-worksheet-control-bug-add {
	margin-top: 50px;
	margin-bottom: 60px;
	._progress {
		width: 400px;
	}
	.btn {
		color: #0085ff;
		cursor: pointer;
	}
	._right {
		@extend .btn;
		position: absolute; 
		right: -30px; 
		top: 0;
	}
	._del {
		@extend .btn;
		display: block;
		margin-top: 24px;
	}
	._footer {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 45px;
		background-color: #fff;
		box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
	}
	.vc-quill-editor .ql-editor {
		min-height: 300px;
		max-height: 300px;
		height: 100%;
	}
	em{
		font-style:italic;
	}

	b, strong{
		em{
			font-weight: bolder;
			font-style:italic;
		}
	}
}
</style>
