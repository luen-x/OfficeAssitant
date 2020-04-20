<template>
	<div>
		<i-drawer
			ref="drawer"
			v-model="visible"
			:mask="false"
			:mask-closable="false"
			:styles="styles"
			:transfer="false"
			width="720"
			class="v-hr-role_modify"
		>
			<div slot="header">
				<div class="g-fs-14 g-pd-l-30">
					<span 
						class="g-br g-pd-r-15"
						style="cursor: pointer"
						@click="visible = false">返回</span>
					<span
						class="g-pd-l-15 g-c-black1">
						修改角色
					</span>
				</div>
			</div>

			<i-form ref="formValidate" :model="formValidate" :rules="formValidateRule" :label-width="100">
				<i-form-item label="角色名称" prop="name" class="_form-item">
					<i-input
						v-model="formValidate.name"
						:maxlength="15"
						style="width: 300px"
						placeholder="请输入角色名称，15字以内"/>
				</i-form-item>
				<i-form-item label="角色描述" prop="describe" class="_form-item">
					<i-input
						v-model="formValidate.describe"
						:maxlength="30"
						style="width: 300px"
						placeholder="请输入角色描述，30字以内"/>
				</i-form-item>
				<i-form-item label="角色等级" prop="level" class="_form-item">
					<i-select
						v-model="formValidate.level"
						:maxlength="30"
						style="width: 300px"
						placeholder="请选择角色等级">
						<i-option :value="1">高级管理 </i-option>
						<i-option :value="2">中级管理</i-option>
						<i-option :value="3">普通员工</i-option>
					</i-select>
					<oa-explain :content="LEVEL_DESC" placement="bottom-start"/>
				</i-form-item>
			</i-form>

			<div class="g-fs-14 g-pd-l-30 g-flex">
				<div class="g-1of2 _pc-tree">
					<div class="_title g-c-black1">PC权限设置</div>
					<i-tree 
						ref="pcTree"
						:data="pcFunctionList" 
						show-checkbox 
						multiple
						@on-toggle-expand="handleHideTemplate"/>
				</div>
				<div class="g-1of2 _app-tree">
					<div class="_title g-c-black1">App权限设置</div>
					<i-tree 
						ref="appTree"
						:data="appFunctionList" 
						show-checkbox 
						multiple
						@on-toggle-expand="handleHideTemplate"/>
				</div>
			</div>

			<div class="demo-drawer-footer">
				<vc-debounce-click :tag="Button" class="_cancel" @click="visible = false">取消</vc-debounce-click >
				<i-button type="primary" class="_ok" @click="handleSubmit">确定</i-button>
			</div>
		</i-drawer>    
	</div>
</template>
<script>
import { Button, Drawer, Input, Tree, Form, FormItem, Select, Option } from 'iview';
import { CreatePortal } from 'wya-vc';
import API_ROOT from '@stores/apis/root';
import Explain from '@components/_common/explain/explain';
import { LEVEL_DESC } from './add-new-role';

export default {
	name: 'oa-hr-role-modify',
	components: {
		'i-button': Button,
		'i-drawer': Drawer,
		'i-input': Input,
		'i-tree': Tree,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-select': Select,
		'i-option': Option,
		'oa-explain': Explain,
	},
	props: {
		data: {
			required: true,
			type: Object
		}
	},
	data() {
		this.LEVEL_DESC = LEVEL_DESC;
		return {
			visible: false,
			styles: {
				height: 'calc(100% - 55px)',
				overflow: 'hidden',
				paddingBottom: '53px',
				position: 'static'
			},
			pcFunctionList: [],
			appFunctionList: [],
			formValidate: {
				name: '',
				describe: '',
				level: ''
			},
			formValidateRule: {
				name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
				describe: [{ required: true, message: '角色描述不能为空', trigger: 'blur' }],
				level: [{ required: true, type: 'number', min: 1, message: '角色等级不能为空', trigger: 'change' }]
			},
		};
	},
	computed: {
	},
	beforeCreate() {
		this.Button = Button;
	},
	created() {
		this.handleInitData();
		this.formValidate.name = this.data.role_name;
		this.formValidate.describe = this.data.role_describe;
		this.formValidate.level = +this.data.level;
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		async handleInitData() {
			// 获取该角色功能详情
			const detailResP = this.$request({
				url: API_ROOT._HR_ROLE_ROLE_DETAIL_GET,
				type: 'GET',
				param: { role_id: this.data.role_id }
			});
			
			// 获取权限树
			const pcResponeseP = this.$request({
				url: API_ROOT._HR_ROLE_FUNCTION_GET,
				type: 'GET',
			});
			const appResponeseP = this.$request({
				url: API_ROOT._HR_ROLE_FUNCTION_GET,
				type: 'GET',
				param: { type: 1 }
			});
			const [detailRes, pcResponese, appResponse] = await Promise.all([detailResP, pcResponeseP, appResponeseP]);
			const pcMenusIds = detailRes.data.menus_ids;
			const appMenusIds = detailRes.data.app_menus_ids;
			this.pcFunctionList = pcResponese.data;
			this.appFunctionList = appResponse.data;
			// 递归遍历权限树  第一次遍历 获取不到父亲的状态  
			const modifyData = (arr, ids) => {
				arr = arr.map(v => {
					v.title = v.name;
					if (ids.includes(v.menus_id)) {
						if (v.children == undefined) {
							this.$set(v, 'checked', true);
						} else {
							this.$set(v, 'indeterminate', true);
						}
					}
					if (v.children && v.children.length) {
						// 添加虚拟结点
						v.children.unshift({
							checked: false,
							menus_id: 0,
							disableCheckbox: true,
							isVirtualNode: true,
							'show-checkbox': false,
							render(h) {
								return h('span', {
									class: 'delete_node',
								}, 'template');
							}
						});
						v.hasVirtualSon = true;
						modifyData(v.children, ids);
					}
					return v;
				});
				return arr;
			};
			this.pcFunctionList = modifyData(this.pcFunctionList, pcMenusIds);
			this.appFunctionList = modifyData(this.appFunctionList, appMenusIds);
			
			// 等待iview 处理数据后 再执行
			setTimeout(() => {
				this.handleVirtualNodeChecked(this.pcFunctionList);
				this.handleVirtualNodeChecked(this.appFunctionList);
			}, 0);
		},
		handleSubmit() {
			this.$refs.formValidate.validateAndScroll(valid => {
				if (valid) {
					const pcMenusArr = this.$refs.pcTree.getCheckedAndIndeterminateNodes();
					const pcMenusIds = pcMenusArr.map(v => v.menus_id).filter(v => v > 0);

					const appMenusArr = this.$refs.appTree.getCheckedAndIndeterminateNodes();
					const appMenusIds = appMenusArr.map(v => v.menus_id).filter(v => v > 0);

					if (!pcMenusIds.length) {
						this.$Message.error('至少选择一项权限');
						return;
					}
					this.$request({
						url: API_ROOT._HR_ROLE_ROLE_EDIT_POST,
						type: 'POST',
						param: {
							role_name: this.formValidate.name,
							role_describe: this.formValidate.describe,
							level: this.formValidate.level,
							menus_ids: pcMenusIds,
							app_menus_ids: appMenusIds,
							role_id: this.data.role_id,
							first_depart_id: this.data.first_depart_id
						}
					}).then(res => {
						app.$store.commit('HR_ROLE_LIST_INIT');
						this.$Message.success(res.msg);
						this.visible = false;
					}).catch(err => {
						console.error(err);
						this.$Message.error(err.msg);
					});
				}
			});
			
		},
		handleHideTemplate() {
			this.$nextTick(() => {
				const hideNodeSon = document.getElementsByClassName('delete_node');
				[...hideNodeSon].forEach(sonNode => {
					sonNode.parentNode.style.display = 'none';
				});
			});
		},
		handleVirtualNodeChecked(arr) {
			arr.forEach(v => {
				const isIndeterminate = v.indeterminate;
				if (v.hasVirtualSon) {
					// 初始化时处理子节点状态跟随父节点
					const oldNodeInfo = v.children[0];
					const newNodeInfo = {
						...oldNodeInfo,
						checked: isIndeterminate
					};
					this.$set(v.children, 0, newNodeInfo);

					// 递归
					this.handleVirtualNodeChecked(v.children);
				}
			});
		},
		handleDefineReactive() {

		}
	},
};
export const ModifyDrawer = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-hr-role_modify {
  .ivu-drawer.ivu-drawer-right {
    width: calc(100% - 160px)!important;
  }
	/deep/ .ivu-drawer-body {
		overflow-y: scroll!important;
	}
  .demo-drawer-footer{
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      border-top: 1px solid #e8e8e8;
      padding: 10px 16px;
      text-align: center;
			background: #fff;
			._cancel {
				margin-right: 8px;
			}
  }
  ._title {
  border-left: 2px solid #ec505b;
  line-height: 15px;
  padding-left: 25px;
  font-size: 16px;
  margin: 20px 0;
}
._form-item {
	display: inline-block;
}
	._pc-tree,
	._app-tree {
		overflow: hidden;
		min-width: 400px;
		max-width: 500px
	}
}
</style>

