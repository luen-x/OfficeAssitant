<template>
	<i-form 
		ref="form" 
		:model="formdata" 
		:rules="ruleValidate" 
		:label-width="120"
		style="width: 900px"
		class="v-tpl-form g-m-t-30"
		position="left"
		@submit.native.prevent
	>
		<div class="g-flex g-jc-sb">
			<i-form-item label="项目类目" prop="category_id">
				<i-cascader
					v-model="formdata.category_id" 
					:data="projectList"
					style="width: 300px"
					transfer
					clearable
					change-on-select
					placeholder="请选择项目类目"
				/>
			</i-form-item>
			<i-form-item label="内容标题" prop="title">
				<i-input 
					v-model="formdata.title" 
					:maxlength="30"
					style="width: 300px"
					clearable
					placeholder="请输入标题（30字以内）"
				/>
			</i-form-item>
		</div>
		<i-form-item label="重置顺序">
			<i-input-number 
				v-model="formdata.sort" 
				style="width: 300px"
				clearable
				placeholder="请输入数字"
			/>
		</i-form-item>
		<i-form-item 
			label="正文：" 
			prop="text">
			<vc-editor
				v-model="formdata.text" 
				:options="options"
				style="width: 100%"
				placeholder="请输入合同金额"
			/>
		</i-form-item>
		<div class="g-tc">
			<i-button 
				type="primary"
				class="g-m-l-10"
				@click="handleSubmit"
			>
				发布
			</i-button>
		</div>
	</i-form>
</template>

<script>
import { 
	Form, FormItem, Input, InputNumber, 
	Select, Option, DatePicker, Cascader, Message, Button
} from 'iview';
// utils
import { dataValidity, initTreeData } from '@utils/utils';
import { ImgsPicker, Editor } from 'wya-vc';

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
		'i-button': Button,
		'vc-imgs-picker': ImgsPicker,
		'vc-editor': Editor,
		
	},
	data() {
		return {
			formdata: {
				category_id: [],
				sort: null
			},
			options: {
				modules: {
					toolbar: '#toolbar'
				},
			},
			projectList: [],
			ruleValidate: {
				text: [
					{ required: true, message: '请输入正文', trigger: 'change' }
				],
				category_id: [
					{ required: true, type: 'array', message: '请选择项目类目', trigger: 'change' }
				],
				title: [
					{ required: true, message: '请输入标题', trigger: 'blur' } 
				],
			}
		};
	},
	mounted() {
		this.loadProject();
		this.$route.query.means_id && this.loadDetail();
	},
	methods: {
		handleSubmit(name) {
			this.$refs.form.validate((isValid) => {
				if (isValid) {
					this.$request({
						url: '_CONTENT_INFORMATION_COTNENT_PUBLISH_POST',
						loading: false,
						type: 'POST',
						param: {
							...this.formdata,
							category_id: this.formdata.category_id[this.formdata.category_id.length - 1]
						}
					}).then(res => {
						this.$Message.success(res.msg);
						this.$router.back();
					}).catch(err => {
						this.$Message.error(err.msg);
					});
				}
			});
		},
		loadDetail() {
			const { query } = this.$route;
			this.$request({
				url: '_CONTENT_INFORMATION_COTNENT_DETAIL_GET',
				type: 'GET',
				param: {
					means_id: query.means_id
				},
			}).then((res) => {
				this.formdata = {
					...res.data,
					category_id: this.formdata.category_id
				};
			}).catch((err) => {
				console.error(err);
			});
		},
		loadProject() {
			this.$request({
				url: '_CONTENT_CATEGORY_TREE_GET',
				type: 'GET',
				param: {
				},
			}).then((res) => {
				this.projectList = initTreeData(res.data, 'category_id', 'category_name');
				const result = this.findNode(+this.$route.query.category_id, this.projectList);
				this.formdata.category_id = result;
			}).catch((err) => {
				console.error(err);
			});
		},
		findNode(value, children, result = []) {
			let origin = [...result];
			for (let i = 0; i < children.length; i++) {
				let arr = [...origin, children[i].value];
				if (children[i].value === value) {
					return arr;
				} else if (children[i].children && children[i].children.length) {
					const exist = this.findNode(value, children[i].children, arr);
					if (exist) return exist;	 
				}
			}
		}


	},
};
</script>

<style lang="scss" scoped>
.v-tpl-form {
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
}
</style>
