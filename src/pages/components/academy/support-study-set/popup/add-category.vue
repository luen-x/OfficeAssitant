<template>
	<i-modal
		ref="modal"
		:loading="true"
		v-model="visible"
		:title="title"
		:mask-closable="false"
		width="400"
		class="g-modal-small"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<i-form
			ref="form"
			:model="formData"
			:rules="ruleValidate"
			:label-width="100"
			class="_input-wrapper"
		>
			<i-form-item label="类型:" prop="study_type">
				<i-select
					v-model="formData.study_type"
					transfer
					class="_select-width"
					style="width: 220px;"
					@on-change="handleChangeType"
				>
					<i-option :value="1">内部自习室</i-option>
					<i-option :value="2">外部自习室</i-option>
				</i-select>
			</i-form-item>
			<i-form-item label="类目名称:" prop="category_name">
				<i-input
					v-model="formData.category_name"
					:maxlength="20"
					clearable
					transfer
					style="width: 220px;"
					placeholder="请输入类目名称"
					class="_select-width"/>
			</i-form-item>
			<i-form-item v-if="!(type==2&&formData.pid==0)" label="上级分类:" prop="pid">
				<oa-input-tree
					:title="category_name"
					v-model="formData.pid"
					:data-source="categoryList"
					@change="handleSelectCategory"
					@on-change="handleclear"
				/>
			</i-form-item>
			<i-form-item label="职位限制：">
				<oa-tree-select-check
					ref="treeSelectCheck"
					v-model="formData.position_ids"
					:data="departPosition"
					:width="220"
					:max-width="220"
					placeholder="请选择职位范围"
				/>
				<!-- <i-select
						v-model="formData.position_ids"
						multiple
						transfer
						clearable
						style="width:220px"
						class="_select-width">
						<i-option
							v-for="item in positionList"
							:key="item.position_id"
							:value="item.position_id"
						>{{ item.position_name }}</i-option>
					</i-select> -->
			</i-form-item>
			<i-form-item label="工龄限制：" >
				<i-input-number
					:min="1"
					:max="999"
					v-model="formData.work_age_min"
					:precision="0"
					placeholder="请输入数值"
					style="width:90px;"/>
				~
				<i-input-number
					:min="1"
					:max="999"
					v-model="formData.work_age_max"
					:precision="0"
					placeholder="请输入数值"
					style="width: 90px;"/>
				个月
			</i-form-item>
		</i-form>
	</i-modal>
</template>
<script>
import { Modal, Button, Tree, Form, FormItem, Input, Icon, Select, Option, Poptip, Radio, RadioGroup, InputNumber } from 'iview';
import treeSelectCheck from '@components/_common/tree-select-check/tree-select-check';
import { CreatePortal } from 'wya-vc';
import API_ROOT from "@stores/apis/root";
import { services } from "@stores/services/content";
import { error } from 'util';
import inputTree from '../../_common/study-manage/input-tree';

export default {
	name: 'oa-add-category',
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-tree': Tree,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-icon': Icon,
		'i-select': Select,
		'i-option': Option,
		'i-poptip': Poptip,
		'i-radio': Radio,
		'oa-tree-select-check': treeSelectCheck,
		'i-radio-group': RadioGroup,
		'oa-input-tree': inputTree
	},
	mixins: [
		services.departPosition()
	],
	props: {
		type: [String, Number], // 1添加。2编辑
		category_id: [String, Number], // 1添加。2编辑
		study_type: [String, Number],
		title: {
			type: String,
			default: '添加类目'
		}// 1添加。2编辑
	},
	data() {
		const { query } = this.$route;
		return {
			visible: false,
			isSend: true,
			category_name: '',
			formData: {
				category_name: '',
				pid: 0,
				study_type: this.study_type || 1,
				category_id: this.type == 2 ? this.category_id : '',
				position_ids: [], // 查看职位
				work_age_min: null, // 最小工龄
				work_age_max: null// 最大工龄
			},
			categoryList: [],
			ruleValidate: {
				category_name: [{ required: true, message: '请填写类目名称', trigger: 'blur' }],
				pid: [{ required: true, type: 'number', message: '请选择所属类目', trigger: 'blur' },
					{ required: true, type: 'number', message: '请选择所属类目', trigger: 'change' }
				],
				study_type: [{ required: true, type: 'number', message: '类型不能为空', trigger: 'change' }],
			}
		};
	},
	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},
	mounted() {
		this.visible = true;
		this.handleCategoryList();
		this.type && this.loadDetail();
	},
	methods: {
		handleOk() {
			this.$refs.form.validate(valid => {
				if (valid) {
					if (this.formData.work_age_max != null && this.formData.work_age_max <= this.formData.work_age_min) {
						this.$Message.error('工龄限制第二位必须大于第一位');
						this.$refs.modal.buttonLoading = false;
						return;
					}
					this.createAndEdit();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleCancel() {
			this.$emit('close');
		},
		handleclear(v) {
			if (!v.target.value) this.formData.pid = null;
		},
		handleChangeType() {
			this.formData.pid = null;
			this.category_name = '';
			this.handleCategoryList();
		},
		loadDetail() {
			this.$request({
				url: '_ACADEMY_SUPPORT_LIBRARY_CATEGORY_DETAIL_GET',
				type: 'GET',
				param: {
					category_id: this.category_id
				}
			}).then((res) => {
				res.data.position_ids = res.data.position_ids.map(i => 'position_id-' + i);
				Object.keys(this.formData).forEach(key => {
					this.formData[key] = res.data[key];
				});
				this.category_name = res.data.pid_name;
				if (this.type == 1) {
					this.formData.category_name = '';
					this.formData.pid = res.data.category_id;
					this.formData.category_id = '';
					this.category_name = res.data.category_name;
				}
			});
		},
		handleCategoryList() {
			this.$request({
				url: '_ACADEMY_SUPPORT_LIBRARY_CATEGORY_ALL_GET',
				type: 'GET',
				param: {
					need_top: 1,
					study_type: this.formData.study_type
				}
			}).then((res) => {
				let listString = '';
				listString = (JSON.stringify(res.data)).replace(/category_name/g, 'title');
				this.categoryList = JSON.parse(listString);
			});
		},
		handleSelectCategory(v) {
			this.formData.position_ids = v.position_ids.map(i => 'position_id-' + i);
			this.formData.work_age_max = v.work_age_max;
			this.formData.work_age_min = v.work_age_min;
		},
		createAndEdit() {
			let checkedTags = (this.$refs.treeSelectCheck && this.$refs.treeSelectCheck.checkedTags) || [];
			const position_ids = checkedTags.map(ele => ele.parent_id && ele.value).filter(Boolean).map(i => +i.replace('position_id-', ''));
			this.$request({
				url: '_ACADEMY_SUPPORT_LIBRARY_CATEGORY_SAVE_GET',
				type: 'POST',
				param: {
					...this.formData,
					position_ids
				}
			}).then((res) => {
				this.$Message.success(res.msg);
				this.$store.commit('ACADEMY_SUPPORT_STUDY_SET_LIST_INIT');
				this.$emit('sure');
			}).catch((err) => {
				this.$refs.modal.buttonLoading = false;
				this.$Message.error(err.msg);
			});

		},
		// getCategoryDetail(categoryId) {
		// 	this.$request({
		// 		url: API_ROOT._CONTENT_CATEGORY_DETAIL_GET,
		// 		type: 'GET',
		// 		param: {
		// 			category_id: categoryId,
		// 		}
		// 	}).then((res) => {
		// 		this.categoryInfo.title = res.data.category_name;
		// 		this.classListArray.push(this.categoryInfo);
		// 	});
		// }
	}
};
export const AddCategory = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
.g-modal-small{
	/deep/ .ivu-select-input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
		color: #333;
	}
	/deep/ .ivu-select-input:-moz-placeholder, textarea:-moz-placeholder {
		color: #333;
	}
	/deep/ .ivu-select-input::-moz-placeholder, textarea::-moz-placeholder {
		color: #333;
	}
	/deep/ .ivu-select-input:-ms-input-placeholder, textarea:-ms-input-placeholder {
		color: #333;
	}
	/deep/ .ivu-icon-ios-arrow-forward:before {
		content: "\F341";
	}
	/deep/ .ivu-tree-arrow{
		position: relative;
		margin-right: 5px;
		z-index: 0;
		i {
			font-size: 25px;
		}
	}
	/deep/ .ivu-tree-title{
		vertical-align: middle;
	}
	/deep/ .ivu-select-selection{
		max-height: 300px;
		overflow-y: auto;
	}

	.btn-red{
		background: #e74854;
		color: #fff !important;
	}
	._input-wrapper{
		._url-box{
			width: 440px;
		}
		.ivu-btn-primary{
			color: #fff;
		}
		._select-width{
			width: 360px;
		}
		._tree-box{
			position: absolute;
			position: absolute;
			top: 36px;
			width: 440px;
			padding: 0 20px;
			box-sizing: border-box;
			z-index: 10;
			background: #fff;
			height: 275px;
			overflow-y: scroll;
			border-radius: 4px;
			box-shadow:0px 2px 20px 0px rgba(223,223,223,1);
		}
		._select-class{
			display: inline-block;
			box-sizing: border-box;
			vertical-align: middle;
			color: #515a6e;
			font-size: 12px;
			line-height: 32px;
			outline: 0;
			-webkit-user-select: none;
			-moz-user-select: none;
			-ms-user-select: none;
			user-select: none;
			cursor: pointer;
			position: relative;
			padding: 0 10px;
			background-color: #fff;
			border-radius: 4px;
			border: 1px solid #dcdee2;
			transition: all .2s ease-in-out;
			._tag{
				height: 24px;
				line-height: 22px;
				margin: 3px 4px 3px 0;
				display: inline-block;
				padding: 0 8px;
				border: 1px solid #e8eaec;
				border-radius: 3px;
				background: #f7f7f7;
				font-size: 12px;
				vertical-align: middle;
				opacity: 1;
				overflow: hidden;
				cursor: pointer;
			}
		}
	}
	._poptip-content{
		height: 200px;
		overflow-y: hidden;
		&:hover{
			overflow-y: auto;
		}
	}
}
</style>

