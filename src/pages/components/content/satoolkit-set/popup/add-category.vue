<template>
	<i-modal
		ref="modal"
		:loading="true"
		v-model="visible"
		:title="title"
		:mask-closable="false"
		width="400"
		class="le g-modal-small"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<i-form
			ref="formData"
			:model="formData"
			:rules="ruleValidate"
			:label-width="100"
			class="_input-wrapper"
		>
			<i-form-item label="类目名称:" prop="category_name">
				<i-input
					v-model="formData.category_name"
					:maxlength="20"
					clearable
					style="width: 220px;"
					placeholder="请输入类目名称"
					class="_select-width"/>
			</i-form-item>
			<i-form-item label="上级分类:" prop="pid">
				<i-poptip
					v-model="popVisible"
					:width="220"
					placement="bottom"
					@on-popper-show="poptipShow = true"
					@on-popper-hide="poptipShow = false"
				>
					<div class="_select-class _select-width" style="width: 220px;">
						<i-input v-show="false" v-model="formData.pid"/>
						<span v-if="classListArray.length === 0">根类目</span>
						<div v-for="(item, index) in classListArray" :key="index">
							<span>{{ item.title }}</span>
						</div>
						<i
							:class="poptipShow ? 'icon-up' : 'icon-down'"
							class="iconfont icon-down"
							style="position: absolute;right: 10px;top: 0;font-size: 12px"
						/>
					</div>
					<div slot="content" class="_poptip-content">
						<i-tree
							ref="classTree"
							:data="categoryList"
							@on-select-change="handleCheckedClassNode"
						/>
					</div>
				</i-poptip>
			</i-form-item>
			<i-form-item label="是否显示:" prop="is_display">
				<i-radio-group v-model="formData.is_display" @on-change="handleDisplayStatus">
					<i-radio :label="0">隐藏</i-radio>
					<i-radio :label="1">显示</i-radio>
				</i-radio-group>
			</i-form-item>
			<i-form-item label="浏览权限:" prop="role_show">
				<i-select
					v-model="formData.role_show"
					:filterable="true"
					multiple
					transfer
					class="_select-width"
					style="width: 220px;"
				>
					<i-option v-for="item in roleList" :key="item.role_id" :value="item.role_id">
						{{ item.role_name }}
					</i-option>
				</i-select>
			</i-form-item>
			<i-form-item label="入职年限:" prop="category_year">
				<i-select
					v-model="formData.category_year"
					:disabled="select_year"
					class="_select-width"
					style="width: 220px;"
				>
					<i-option v-for="item in categoryYear" :key="item.value" :value="item.value">
						{{ item.label }}
					</i-option>
				</i-select>
			</i-form-item>
		</i-form>
	</i-modal>
</template>
<script>
import { Modal, Button, Tree, Form, FormItem, Input, Icon, Select, Option, Poptip, Radio, RadioGroup } from 'iview';
import { CreatePortal } from 'wya-vc';
import API_ROOT from "@stores/apis/root";
import { error } from 'util';

export default {
	name: 'oa-add-category',
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-tree': Tree,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-icon': Icon,
		'i-select': Select,
		'i-option': Option,
		'i-poptip': Poptip,
		'i-radio': Radio,
		'i-radio-group': RadioGroup
	},
	data() {
		const validateCategoryName = (rule, value, callback) => {
			if (value) {
				if (this.categoryName === value) {
					callback();
				} else {
					this.$request({
						url: API_ROOT._CONTENT_CATEGORY_IS_USE_GET,
						type: 'GET',
						loading: false,
						param: {
							kit_type: 2,
							category_name: value
						}
					}).then((res) => {
						this.isSend = true;
						callback();
					}).catch((err) => {
						console.error(err);
						this.isSend = false;
						callback(new Error(err.msg));
					});
				}
			} else {
				callback(new Error('类目名称不能为空'));
			}
		};
		return {
			popVisible: false,
			select_year: false, // 年限选择
			visible: false,
			isShowTree: false,
			isFirstValidator: false,
			poptipShow: false,
			isSend: true,
			categoryName: '',
			categoryYear: [{ label: '所有人可见', value: 0 }, { label: '一年以上', value: 1 }],
			formData: {
				category_name: '',
				is_display: 1,
				pid: '0',
				role_show: [],
				kit_type: 2,
				category_id: '',
				category_year: ''
			},
			categoryList: [],
			classListArray: [],
			roleList: [],
			title: '添加类目',
			isDiaplay: true,
			ruleValidate: {
				category_name: [
					{ required: true, validator: validateCategoryName, trigger: 'blur' },
					{ validator: validateCategoryName, trigger: 'change' }
				],
				is_display: [
					{ required: true, message: '是否显示不能为空', trigger: 'blur' }
				],
				pid: [
					{ required: true, message: '根类目不能为空', trigger: 'blur' }
				],
				role_show: [
					{ required: true, message: '浏览权限不能为空', trigger: 'blur' }
				],
				category_year: [
					{ required: true, message: '入职年限不能为空', trigger: 'blur' }
				]
			}
		};
	},
	computed: {
		categoryInfo() {
			return this.$options.propsData.categoryInfo;
		}
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
		if (this.categoryInfo) {
			this.title = this.categoryInfo.headerTitle;
			this.formData.category_year = this.categoryInfo.category_year;
			if (this.categoryInfo.pid !== '') {
				if (this.categoryInfo.pid === 0) {
					this.categoryInfo.title = this.categoryInfo.categoryName;
					this.getAllRole('1');
					this.getCategoryList(this.categoryInfo.id, '2');
				} else {
					this.select_year = true;
					this.getCategoryDetail(this.categoryInfo.pid);
					this.getCategoryList(this.categoryInfo.pid);
					this.getCategoryList(this.categoryInfo.id, '1');
				}
				this.formData.pid = this.categoryInfo.pid;
				this.formData.category_id = this.categoryInfo.id;
				this.formData.category_name = this.categoryInfo.categoryName;
				this.formData.category_year = this.categoryInfo.category_year;
				this.categoryName = this.categoryInfo.categoryName;
				this.formData.is_display = Number(this.categoryInfo.isDisplay);
			} else {
				this.select_year = true;
				this.formData.pid = this.categoryInfo.id;
				this.categoryInfo.title = this.categoryInfo.categoryName;
				this.formData.category_year = this.categoryInfo.category_year;
				this.classListArray.push(this.categoryInfo);
				this.getCategoryList(this.categoryInfo.id, '3');
			}
		} else {
			this.getAllRole();
			this.formData.category_year = 0;
		}
		this.handleDisplayStatus(this.formData.is_display);
	},
	methods: {
		handleOk() {
			/**
			 * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
			 */
			// this.visible = false;
			this.createAndEdit();
		},
		handleCancel() {
			// this.visible = false;
			this.$emit('close');
		},
		handleCategoryList() {
			this.$request({
				url: API_ROOT._CONTENT_CATEGORY_LIST_GET,
				type: 'GET',
				param: {
					kit_type: 2,
					is_control_role: 0
				}
			}).then((res) => {
				let firtObj = {
					title: '根类目',
				};
				let listString = '';
				listString = (JSON.stringify(res.data)).replace(/category_name/g, 'title');
				this.categoryList = JSON.parse(listString);
				this.categoryList.unshift(firtObj);
				this.handleRoleList(this.categoryList, this.formData.category_name);
			});
		},
		handleCheckedClassNode() {
			let treeArray = this.$refs.classTree.getSelectedNodes();
			this.classListArray = [];
			if (treeArray[treeArray.length - 1]) {
				if (treeArray[0].title === '根类目') {
					this.formData.pid = '0';
					this.formData.role_show = [];
					this.getAllRole();
					this.select_year = false;
				} else {
					this.classListArray.push(treeArray[treeArray.length - 1]);
					this.getCategoryList(this.classListArray[0].category_id, '3');
					this.formData.pid = this.classListArray[0].category_id;
					this.formData.category_year = this.classListArray[0].category_year;
					this.select_year = true;
				}
			} else {
				this.getAllRole();
				this.classListArray = [];
				this.formData.pid = '0';
			}
			this.popVisible = false;
		},
		handleDisplayStatus(res) {
			if (res === '0') {
				this.isDiaplay = false;
			} else {
				this.isDiaplay = true;
			}
		},
		createAndEdit() {
			if (this.isSend) {
				this.$request({
					url: API_ROOT._CONTENT_SERVICE_CATEGORY_CREATE_AND_EDIT_POST,
					type: 'POST',
					param: this.formData
				}).then((res) => {
					if (this.categoryInfo) {
						if (this.categoryInfo.pid) {
							this.$Message.success(res.msg);
						} else {
							this.$Message.success(res.msg);
						}
					} else {
						this.$Message.success(res.msg);
					}
					this.$store.commit('CONTENT_SATOOLKIT_SET_LIST_INIT');
					this.$emit('sure');
				}).catch((err) => {
					this.$refs.modal.buttonLoading = false;
					this.$Message.error(err.msg);
				});
			} else {
				this.$refs.modal.buttonLoading = false;
				this.$Message.error('类目名称不可用');
			}
		},
		getCategoryList(id, isFirst) {
			this.$request({
				url: API_ROOT._CONTENT_MATERIAL_ROLE_LIST_GET,
				type: 'GET',
				param: {
					category_id: id
				}
			}).then((res) => {
				if (!isFirst) {
					this.roleList = res.data;
				} else {
					this.formData.role_show = [];
					if (isFirst === '2') {
						for (let i in res.data) {
							this.formData.role_show.push(+res.data[i].role_id);
						}
					} else if (isFirst === '3') {
						this.roleList = res.data;
						for (let i in res.data) {
							this.formData.role_show.push(res.data[i].role_id);
						}
					} else {
						for (let i in res.data) {
							this.formData.role_show.push(res.data[i].role_id);
						}
					}
				}
			});
		},
		getCategoryDetail(categoryId) {
			this.$request({
				url: API_ROOT._CONTENT_CATEGORY_DETAIL_GET,
				type: 'GET',
				param: {
					category_id: categoryId,
					is_control_role: 0
				}
			}).then((res) => {
				this.categoryInfo.title = res.data.category_name;
				this.classListArray.push(this.categoryInfo);
			});
		},
		getAllRole(isFirst) {
			this.$request({
				url: API_ROOT._CONTENT_ALL_ROLE_GET,
				type: 'GET',
			}).then((res) => {
				this.roleList = res.data;
			});
		},
		handleRoleList(arr, name) {
			let arrValue = arr;
			for (let i in arr) {
				if (arr[i].title === name) {
					arrValue.splice(i, 1);
					return;
				}
				if (arr[i].children && arr[i].children.length > 0) {
					this.handleRoleList(arr[i].children, name);
				}
			}
		}
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
		._m-left{
			margin-left: 11px;
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
