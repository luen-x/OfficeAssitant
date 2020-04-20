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
					class="_select-width"
				/>
			</i-form-item>
			<i-form-item label="上级分类:" style="margin-bottom: 10px !important;" prop="pid">
				<i-poptip
					v-model="popVisible"
					:width="220"
					placement="bottom"
					@on-popper-show="poptipShow = true"
					@on-popper-hide="poptipShow = false"
				>
					<div class="_select-class _select-width" style="width: 220px; ">
						<i-input v-show="false" v-model="formData.pid"/>
						<span v-if="classListArray.length === 0">根类目</span>
						<div v-for="(item, index) in classListArray" :key="index" style="padding-right: 10px;">
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
			<i-form-item label="浏览权限:" prop="role_list">
				<i-select
					v-model="formData.role_list"
					:filterable="true"
					transfer
					multiple
					class="_select-width"
					style="width: 220px;"
				>
					<i-option
						v-for="item in roleList"
						:key="item.role_id"
						:value="item.role_id"
					>{{ item.role_name }}</i-option>
				</i-select>
			</i-form-item>
			<i-form-item label="入职年限:" prop="category_year">
				<i-select
					v-model="formData.category_year"
					:disabled="select_year"
					class="_select-width"
					style="width: 220px;"
				>
					<i-option
						v-for="item in categoryYear"
						:key="item.value"
						:value="item.value"
					>{{ item.label }}</i-option>
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
				role_list: [],
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
				role_list: [
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
		},
		type() {
			// 1编辑 //2添加
			return (this.categoryInfo && this.categoryInfo.type) || 2;
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
			this.formData.pid = this.categoryInfo.pid;
			if (this.type == 1) {
				this.title = '编辑类目';
				this.formData.category_name = this.categoryInfo.categoryName;
				this.formData.category_id = this.categoryInfo.id;
				this.categoryInfo.pid > 0 ? this.getLibraryRole(this.categoryInfo.pid) : this.getAllRole();
			} else if (this.type == 2) {
				this.title = '添加类目';
				this.formData.category_name = '';
				this.formData.category_id = '';
				this.formData.role_list = [];
			}
			this.getCategoryDetail(this.categoryInfo.id);
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
				url: API_ROOT._CONTENT_CONFIG_LIBRARY_CATEGORY_ALL_GET,
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
		handleCheckedClassNode(v) {
			let treeArray = this.$refs.classTree.getSelectedNodes();
			if (v.length == 0) return;
			this.classListArray = [];
			if (v[v.length - 1].nodeKey == 0 || v[v.length - 1].pid == 0) {
				v[v.length - 1].category_id && this.getCategoryDetail(v[v.length - 1].category_id);
				this.formData.pid = v[v.length - 1].category_id;
				this.getLibraryRole(v[v.length - 1].category_id);
			} else if (v[v.length - 1].pid > 0) {
				this.getLibraryRole(v[v.length - 1].category_id);
				this.getCategoryDetail(v[v.length - 1].category_id);
				this.formData.pid = v[v.length - 1].category_id;
			}
			this.classListArray.push(v[v.length - 1]);
			if (v[0].title === '根类目') {
				this.select_year = false;
				this.formData.pid = 0;
				this.getAllRole();
				this.formData.role_list = [];
			} else {
				this.select_year = true;
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
					url: API_ROOT._CONTENT_CONFIG_LIBRARY_CATEGORY_SAVE,
					type: 'POST',
					param: this.formData
				}).then((res) => {
					if (this.categoryInfo) {
						if (this.categoryInfo.pid) {
							this.$Message.success('修改成功');
						} else {
							this.$Message.success('添加成功');
						}
					} else {
						this.$Message.success('添加成功');
					}
					this.$store.commit('CONTENT_CONFIG_MATERIAL_SET_LIST_INIT');
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
		getLibraryRole(id) {
			this.$request({
				url: API_ROOT._CONTENT_CONFIG_LIBRARY_CATEGORY_ROLE_LIST_GET,
				type: 'GET',
				param: {
					category_id: id
				}
			}).then((res) => {
				this.roleList = res.data;
			});
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
					this.formData.role_list = [];
					if (isFirst === '2') {
						for (let i in res.data) {
							this.formData.role_list.push(+res.data[i].role_id);
						}
					} else if (isFirst === '3') {
						this.roleList = res.data;
						for (let i in res.data) {
							this.formData.role_list.push(res.data[i].role_id);
						}
					} else {
						for (let i in res.data) {
							this.formData.role_list.push(res.data[i].role_id);
						}
					}
				}
			});
		},
		getCategoryDetail(categoryId) {
			this.$request({
				url: API_ROOT._CONTENT_CONFIG_LIBRARY_CATEGORY_DETAIL,
				type: 'GET',
				param: {
					category_id: categoryId,
				}
			}).then((res) => {
				let list = ['category_name', 'category_id', 'pid'];
				Object.keys(res.data).forEach(key => {
					if (!list.includes(key)) {
						this.formData[key] = res.data[key];
					}
				});
				if (this.type == 1 && this.classListArray.length == 0) {
					res.data.pid_name && this.classListArray.push({ title: res.data.pid_name });
				}
				if (this.type == 2) {
					if (res.data.category_id) {
						this.getLibraryRole(res.data.category_id);
						this.formData.pid = res.data.category_id;
					}
					if (this.classListArray.length == 0) {
						res.data.category_name && this.classListArray.push({ title: res.data.category_name });
					}
					this.select_year = true;
				}
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
    .g-modal-small {
        /deep/ .ivu-select-input::-webkit-input-placeholder,
        textarea::-webkit-input-placeholder {
            color: #333;
        }
        /deep/ .ivu-select-input:-moz-placeholder,
        textarea:-moz-placeholder {
            color: #333;
        }
        /deep/ .ivu-select-input::-moz-placeholder,
        textarea::-moz-placeholder {
            color: #333;
        }
        /deep/ .ivu-select-input:-ms-input-placeholder,
        textarea:-ms-input-placeholder {
            color: #333;
        }
        /deep/ .ivu-icon-ios-arrow-forward:before {
            content: "\F341";
        }
        /deep/ .ivu-tree-arrow {
            position: relative;
            margin-right: 5px;
            z-index: 0;
            i {
                font-size: 25px;
            }
        }
        /deep/ .ivu-tree-title {
            vertical-align: middle;
        }
        /deep/ .ivu-select-selection {
            max-height: 300px;
            overflow-y: auto;
        }

        .btn-red {
            background: #e74854;
            color: #fff !important;
        }
        ._input-wrapper {
            ._url-box {
                width: 440px;
            }
            .ivu-btn-primary {
                color: #fff;
            }
            ._m-left {
                margin-left: 11px;
            }
            ._select-width {
                width: 360px;
            }
            ._tree-box {
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
                box-shadow: 0px 2px 20px 0px rgba(223, 223, 223, 1);
            }
            ._select-class {
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
                transition: all 0.2s ease-in-out;
                ._tag {
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
        ._poptip-content {
            height: 200px;
            overflow-y: hidden;
            &:hover {
                overflow-y: auto;
            }
        }
    }
</style>
