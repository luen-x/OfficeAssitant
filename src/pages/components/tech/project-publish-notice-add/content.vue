<template>
	<div class="v-project-public-notice-add g-flex-cc">
		<i-form 
			ref="form" 
			:model="formData" 
			:rules="formDataRule" 
			:label-width="120"
			class="g-m-b-30"
			position="left"
			@submit.native.prevent
		>
			<div class="g-inline-block">
				<i-form-item 
					label="选择项目：" 
					prop="project_id"
				>
					<i-select
						v-model="formData.project_id" 
						style="width:300px"
						placeholder="请选择项目"
						clearable
					>
						<i-option 
							v-for="item in projectList" 
							:value="item.project_id" 
							:key="item.project_id"
						>
							{{ item.project_name }}
						</i-option>
					</i-select>
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
			notice_id: '',
			formData: {
				title: '',
				project_id: null,
				text: ''
			},
			formDataRule: {
				title: [
					{ required: true, message: '标题不可为空', trigger: 'blur' }
				],
				project_id: [
					{ required: true, type: 'number', message: '项目不可为空', trigger: 'change' }
				],
				text: [
					{ required: true, message: '正文不可为空', trigger: 'change' }
				]
			},
			projectList: [],
			options: {
				modules: {
					toolbar: '#toolbar',
				},
			},
		};
	},
	mounted() {
		this.$route.query.edit ? this.loadInfo() : '';
		this.loadProjectList();
	},
	methods: {
		handleError(e) {
			this.$Message.warning(e.msg);
		},
		loadInfo() {
			this.$request({
				url: '_TECH_PROJECT_PUBLISH_NOTICE_INFO_GET',
				type: "GET",
				param: {
					notice_id: this.$route.query.notice_id
				},
				loading: false
			}).then((res) => {
				this.formData.title = res.data.title;
				this.formData.project_id = res.data.project_id;
				this.formData.text = res.data.text;
			}).catch((error) => {
			});
		},
		loadProjectList() {
			this.$request({
				url: '_TECH_PROJECT_PUBLISH_NOTICE_PROJECT_LIST_GET',
				type: "GET",
				param: {},
				loading: false
			}).then((res) => {
				this.projectList = res.data;
			}).catch((error) => {
			});
		},
		handleOk() {
			this.$refs.form.validate(valid => {
				if (valid) {
					this.handleSave();
				}
			});
		},
		handleSave() {
			if (this.$route.query.edit) {
				this.formData.notice_id = this.$route.query.notice_id;
			}
			this.$request({
				url: API_ROOT['_TECH_PROJECT_PUBLISH_NOTICE_SAVE_POST'], // eslint-disable-line
				type: "POST",
				param: this.formData
			}).then((res) => {
				Message.success('发布成功');
				this.$router.push({
					path: '/tech/project/publish/notice',
				});
			}).catch((error) => {
				Message.error(error.msg);
			});
		}
	},
};
</script>

<style lang="scss">
.v-project-public-notice-add {
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
