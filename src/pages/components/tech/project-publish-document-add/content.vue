<template>
	<div class="v-project-public-document-add g-flex-cc">
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
						label="项目类目：" 
						prop="document_id"
					>
						<i-cascader
							:data="documentList"
							v-model="formData.document_id"
							:change-on-select="true"
							placeholder="请选择项目类目"
							trigger="click"
							clearable
							transfer
							style="width: 300px;display:inline-block"
							class="g-m-r-5"
							@on-change="handleChangeDocument"
						/>
					</i-form-item>
					<i-form-item label="置顶顺序:" prop="sort">
						<i-input-number
							v-model="formData.sort"
							:max="999"
							:min="0"
							:precision="0"
							placeholder="请输入数字"
							style="width:300px;"
						/>
					</i-form-item>
				</div>
				<div class="g-inline-block">
					<i-form-item
						label="内容标题：" 
						prop="title"
					>
						<i-input 
							v-model="formData.title" 
							:maxlength="20" 
							placeholder="请输入标题（20字以内）"
							style="width:300px"
						/>
					</i-form-item>
					<i-form-item 
						label="浏览权限：" 
						prop="competence"
					>
						<i-select
							v-model="formData.competence" 
							style="width:300px"
							placeholder="请选择浏览权限"
							clearable
						>
							<i-option :value="0">所有人可见</i-option>
							<i-option :value="1">仅管理可见</i-option>
						</i-select>
					</i-form-item>
				</div>
			</div>
			<i-form-item label="正文：" prop="text">
				<vc-editor
					ref="editor"
					v-model="formData.text"
					:options="options"
					style="min-width:400px;width:722px;"
					@file-error="handleError"
				/>	
			</i-form-item>
		</i-form>
		<div class="_footer g-flex-cc">
			<vc-debounce-click
				class="g-red-btn-small"
				@click="handleOk"
			>
				发布
			</vc-debounce-click>
		</div>
	</div>
</template>

<script>
import { 
	Form, FormItem, Input, InputNumber, 
	Select, Option, DatePicker, Cascader, Message
} from 'iview';
// utils
import { Editor, FilesPicker, ImgsPicker } from "wya-vc";
import { dataValidity } from '@utils/utils';
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
		'vc-imgs-picker': ImgsPicker
	},
	data() {
		return {
			document_id_str: '',
			formData: {
				title: '',
				project_id: null,
				text: '',
				sort: null,
				document_id: [],
				competence: null
			},
			formDataRule: {
				title: [
					{ required: true, message: '标题不可为空', trigger: 'blur' }
				],
				project_id: [
					{ required: true, type: 'number', message: '项目不可为空', trigger: 'change' }
				],
				document_id: [
					{ required: true, type: 'array', message: '项目类目不可为空', trigger: 'change' }
				],
				competence: [
					{ required: true, type: 'number', message: '浏览权限不能为空', trigger: 'change' }
				],
				text: [
					{ required: true, message: '正文不可为空！', trigger: 'change' }
				]
			},
			projectList: [],
			documentList: [],
			options: {
				modules: {
					toolbar: '#toolbar',
				},
			},
		};
	},
	mounted() {
		this.$route.query.edit ? this.loadInfo() : '';
		this.loadDocumentList();
	},
	methods: {
		handleError(e) {
			this.$Message.warning(e.msg);
		},
		handleChangeDocument(item) {
			if (item.length) {
				this.formData.project_id = this.projectList.filter(v => v.value == item[item.length - 1])[0].project_id;
			}
		},
		loadInfo() {
			this.$request({
				url: '_TECH_PROJECT_PUBLISH_DOCUMENT_INFO_GET',
				type: "GET",
				param: {
					read_id: this.$route.query.read_id
				},
				loading: false
			}).then((res) => {
				this.formData.title = res.data.title;
				this.formData.project_id = res.data.project_id;
				this.formData.text = res.data.text;
				if (res.data.sort) {
					this.formData.sort = res.data.sort;
				} else {
					this.formData.sort = null;
				}
				this.formData.read_id = res.data.read_id;
				this.formData.document_id = res.data.document_id_str.map(Number);
				this.formData.competence = res.data.competence;
			}).catch((error) => {
			});
		},
		loadDocumentList() {
			this.$request({
				url: '_TECH_PROJECT_PUBLISH_DOCUMENT_TREE_GET',
				type: "GET",
				param: {},
				loading: false
			}).then((res) => {
				let arr = [];
				this.documentList = this.formatDocument(res.data);
				arr = JSON.parse(JSON.stringify(this.documentList));
				this.formatProjectList(arr);
			}).catch((error) => {
			});
		},
		formatProjectList(arr) {
			const target = arr.map(v => {
				this.projectList.push(v);
				if (v.children) {
					this.formatProjectList(v.children);
				}
				return;
			});
		},
		formatDocument(arr) {
			const target = arr.map(it => {
				const result = {
					label: it.document_name || '',
					value: it.document_id || null,
					project_id: it.project_id || null,
					children: it.children || []
				};
				if (result.children.length > 0) {
					result.children = this.formatDocument(result.children);
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
		handleSave() {
			let obj = {
				document_id: this.formData.document_id,
				project_id: this.formData.project_id,
				title: this.formData.title,
				sort: this.formData.sort,
				competence: this.formData.competence,
				text: this.formData.text
			};
			if (this.$route.query.edit) {
				obj.read_id = this.$route.query.read_id;
			}
			this.$request({
				url: API_ROOT['_TECH_PROJECT_PUBLISH_DOCUMENT_SAVE_POST'], // eslint-disable-line
				type: "POST",
				param: obj
			}).then((res) => {
				Message.success('发布成功');
				this.$router.push({
					path: '/tech/project/publish/document',
					query: {
						project_id: this.formData.project_id,
						document_id: this.formData.document_id[this.formData.document_id.length - 1]
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
.v-project-public-document-add {
	margin-top: 50px;
	margin-bottom: 20px;
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
