<template>
	<div class="v-content-circle-add g-flex g-jc-c g-m-t-30">
		
		<i-form
			ref="form"
			:model="formData"
			:rules="rules"
			:label-width="100"
			class="g-pd-l-10"
			style="padding-bottom:60px"
			inline
		>
			<i-form-item label="素材类型：" prop="type">
				<i-radio-group v-model="formData.type" >
					<i-radio :label="1" >图片、视频类素材</i-radio>
					<i-radio :label="2" >文章类素材</i-radio>
				</i-radio-group>
			</i-form-item><br>
			<i-form-item label="素材标题：" prop="title">
				<i-input
					v-model="formData.title"
					clearable
					placeholder="请输入素材标题"
					style="width:300px"
				/>
			</i-form-item><br>
			<i-form-item label="素材分类：" prop="category_id">
				<i-select
					v-model="formData.category_id"
					placeholder="请选择素材分类"
					style="width:300px"
					clearable
				>
					<i-option
						v-for="(item,index) in categoryList"
						:key="index"
						:value="item.category_id"
					>
						{{ item.category_name }}
					</i-option>
				</i-select>
				<i 
					class="icon iconfont icon-edit1 g-fs-14 g-pointer g-c-blue-mid" 
					style="position:absolute;right:-18px" 
					@click="handleEditCategory"
				/>
			</i-form-item><br>

			<i-form-item v-if="formData.type==2" :key="2" label="内容：" prop="contentRich">
				<vc-editor
					ref="editor"
					v-model="formData.contentRich"
					:options="options"
					style="min-width:400px;width:722px;"
					@file-error="handleError"
				/>	
			</i-form-item><br v-if="formData.type==2">
			<i-form-item label="附件上传：" prop="attachment_list">
				<oa-upload
					v-model="formData.attachment_list"
					:max="20"
					:show-title="false"
					style="width: 340px"
				/>
			</i-form-item><br>
			<i-form-item v-if="formData.type==1" :key="1" label="素材说明：" prop="content">
				<oa-limit-words
					v-model="formData.content"
					:max="500"
					placeholder="请输入素材说明"
					style="width: 300px"
				/>
			</i-form-item><br v-if="formData.type==1">
			<i-form-item label="查看职位：" prop="position_list">
				<oa-tree-select-check
					ref="treeSelectCheck"
					v-model="formData.position_list"
					:data="departPosition"
					:width="300"
					:max-width="220"
					placeholder="请选择职位"
				/>
					
			</i-form-item><br>
			<i-form-item label="工龄限制：" prop="-">
				<i-input-number 
					v-model="formData.work_age_min"
					:max="999"
					:min="0"
					:precision="0"
					style="width:120px"
					placeholder="请输入数值" 
				/>
				<span>～</span>
				<i-input-number 
					v-model="formData.work_age_max"
					:max="999"
					:min="0"
					:precision="0"
					style="width:120px"
					placeholder="请输入数值" 
				/>
				<span class="_number-append" style="right:-35px">个月</span>
			</i-form-item>
		</i-form>
		<div class="_footer">
			<i-button @click="handleCancel">取消</i-button>
			<i-button :loading="saveLoading" type="primary" @click="handleSave">保存</i-button>
		</div>
	</div>
</template>

<script>
import { Form, FormItem, Input, Select, Option, InputNumber, Button, Cascader, Radio, RadioGroup } from 'iview';
import TreeSelectCheck from '@common/tree-select-check/tree-select-check';
import { Editor } from "wya-vc";
import { services } from '@stores/services/content';
import Upload from '@common/upload/upload';
import { setData } from '@components/sale/_common/util';
import { EditCategory } from '../_common/modals/circle/edit-category';


export default {
	name: 'oa-tpl',
	components: {
		'oa-upload': Upload,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-select': Select,
		'i-input-number': InputNumber,
		'i-button': Button,
		'i-option':	Option,
		'i-cascader': Cascader,
		'oa-tree-select-check': TreeSelectCheck,
		'vc-editor': Editor,
		'i-radio': Radio,
		'i-radio-group': RadioGroup
	},
	mixins: [services.circleCategoryList(), services.departPosition()],
	data() {
		const query = this.$route.query || {};
		return {
			saveLoading: false,
			formData: {
				"circle_id": query.circle_id || '',
				"type": 1, // 类型：1图片视频类 2文章类
				"title": "", // 标题
				category_id: "",
				"work_age_min": null, // 最小工龄
				"work_age_max": null, // 最大工龄
				"content": "", // 内容
				contentRich: '',
				"position_list": [], // 职位
				"attachment_list": []// 附
			},
			rules: {
				"type": [{ required: true, type: 'number', message: "请选素材类型", trigger: "change" }], // 类型：1图片视频类 2文章类
				"title": [{ required: true, type: 'string', message: "请填写标题", trigger: "blur" }], // 标题
				"content": [{ required: true, type: 'string', message: "请填写素材说明", trigger: "blur" }], // 内容
				contentRich: [{ required: true, type: 'string', message: "请填写内容", trigger: "change" }],
				"position_list": [{ required: false, type: 'array', message: "请选择职位", trigger: "change" }], // 职位
				"attachment_list": [{ required: true, type: 'array', message: "请上传附件", trigger: "change" }], // 附
				category_id: [{ required: true, type: 'number', message: "请选素材素材分类", trigger: "change" }], 
			},
			options: {
				modules: {
					toolbar: '#toolbar',
				},
			},
		};
	},
	computed: {
		categoryList() {
			return this.circleCategoryList.category_list || [];
		}

	},
	created() {
		if (this.formData.circle_id) {
			this.loadData();
		}
	},
	methods: {
		handleCancel() {
			this.$router.go(-1);

		},
		handleSave() {
			this.saveLoading = true;
			this.$refs.form.validateAndScroll(valid => {
				if (!valid) return this.saveLoading = false;
				if (this.formData.work_age_min !== null 
					&& this.formData.work_age_max !== null 
					&& this.formData.work_age_min > this.formData.work_age_max
				) {
					this.$Message.warning('最大工龄应大于等于最小工龄');
					this.saveLoading = false;
					return;
				}
				const param = { ...this.formData };
				const checkedTags = (this.$refs.treeSelectCheck && this.$refs.treeSelectCheck.checkedTags) || [];
				const position_list = checkedTags.map(ele => ele.parent_id && ele.value).filter(Boolean).map(i => +i.replace('position_id-', ''));
				param.position_list = position_list;
				param.attachment_list = param.attachment_list.map(i => i.url).filter(Boolean);
				if (this.formData.type == 2) {
					param.content = param.contentRich;
				}
				delete param.contentRich;
				this.$request({
					url: "_CONTENT_CIRCLE_SAVE_POST",
					type: "POST",
					param,
					loading: false,
				}).then(res => {
					this.$Message.success(res.msg);
					this.$router.go(-1);
				
				}).catch((res) => {
					
					console.error(res);
					this.saveLoading = false;
					this.$Message.error(res.msg);
				});

			});
			
		},
		loadData() {
			this.$request({
				url: "_CONTENT_CIRCLE_DETAIL_GET",
				type: "GET",
				param: {
					circle_id: this.formData.circle_id
				},
				loading: false,
			}).then(res => {
				res.data.position_list = res.data.position_list.map(i => 'position_id-' + i);
				if (res.data.type == 2) {
					res.data.contentRich = res.data.content;
					res.data.content = '';
				}
				setData(this.formData, res.data);
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		handleError(e) {
			this.$Message.warning(e.msg);
		},
		handleEditCategory() {
			EditCategory.popup().then(() => {
				this.clearCircleCategoryList();
				this.loadCircleCategoryList();
				
			});

		}
	},
};
</script>

<style lang="scss">
.v-content-circle-add {
	._footer {
		width: calc(100% - 160px);
		height: 60px;
		position: fixed;
		bottom: 0;
		left: 160px;
		box-shadow: 0 -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
		padding: 10px 16px;
		background: #fff;
		z-index: 3;
		.ivu-btn {
			margin-left: 5px;
			margin-right: 5px;
		}
		display: flex;
		align-items: center;
		justify-content: center;
	}

}

</style>
