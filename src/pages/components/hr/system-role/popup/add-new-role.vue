<template>
	<div class="v-hr-sale_add">
		<i-drawer
			v-model="visible"
			:mask="false"
			:mask-closable="false"
			:styles="styles"
			:transfer="false"
			title="新增角色"
		>
			<div slot="header">
				<div class="g-fs-14 g-pd-l-30">
					<span 
						class="g-br g-pd-r-15"
						style="cursor: pointer"
						@click="visible = false">返回</span>
					<span
						class="g-pd-l-15 g-c-black1">
						新增角色
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
				<vc-debounce-click 
					:tag="Button"
					style="margin-right: 8px" 
					@click="visible = false">取消</vc-debounce-click>
				<vc-debounce-click
					:tag="Button"
					type="primary" 
					@click="handleSubmit">确定</vc-debounce-click>
			</div>
		</i-drawer>    
	</div>
</template>
<script>
import { Button, Drawer, Input, Tree, Form, FormItem, Select, Option } from 'iview';
import Explain from '@components/_common/explain/explain';
import API_ROOT from '@stores/apis/root';
import { CreatePortal } from 'wya-vc';

export const LEVEL_DESC = `角色等级将影响人事员工入职、调整角色时可以选择的角色的范围,人事员工只能选择平级或者比自己低级的角色。`;

export default {
	name: 'oa-hr-role-add',
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
		first_depart_id: Number | String
	},
	data() {
		this.LEVEL_DESC = LEVEL_DESC;
		return {
			visible: false,
			styles: {
				height: 'calc(100% - 55px)',
				overflow: 'auto',
				paddingBottom: '53px',
				position: 'static',
			},
			formValidate: {
				name: '',
				describe: '',
				level: ''
			},
			formValidateRule: {
				name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
				describe: [{ required: true, message: '角色描述不能为空', trigger: 'blur' }],
				level: [{ required: true, type: 'number', message: '角色等级不能为空', trigger: 'change' }]
			},
			pcFunctionList: [],
			appFunctionList: [],
			responese: []
		};
	},
	beforeCreate() {
		this.Button = Button;
	},
	async created() {
		[this.pcFunctionList, this.appFunctionList] = await this.handleGetFunctionList();
		this.modifyData(this.pcFunctionList);
		this.modifyData(this.appFunctionList);
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleSubmit() {
			this.$refs.formValidate.validateAndScroll(valid => {
				if (valid) {
					const pcMenusArr = this.$refs.pcTree.getCheckedAndIndeterminateNodes();
					const pcMenusIds = pcMenusArr.map(v => v.menus_id).filter(v => v > 0);

					const appMenusArr = this.$refs.appTree.getCheckedAndIndeterminateNodes();
					const appMenusIds = appMenusArr.map(v => v.menus_id).filter(v => v > 0);

					if (!pcMenusIds.length) {
						this.$Message.error('至少选择一项pc权限');
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
							first_depart_id: this.$route.query.first_depart_id
						}
					}).then(async res => {
						this.formValidate.name = '';
						this.formValidate.describe = '';
						this.visible = false;
						app.$store.commit('HR_ROLE_LIST_INIT');
						this.$emit('sure');
						this.$Message.success(res.msg);
					}).catch(error => {
						console.error(error);
						this.$Message.error(error.msg);
					});
				}
			});
		},
		async handleGetFunctionList() {
			const getPcFunctionList = this.$request({
				url: API_ROOT._HR_ROLE_FUNCTION_GET,
				type: 'GET',
			});
			const getAppFunctionList = this.$request({
				url: API_ROOT._HR_ROLE_FUNCTION_GET,
				type: 'GET',
				param: { type: 1 }
			});
			const [pcRes, appRes] = await Promise.all([getPcFunctionList, getAppFunctionList]);
			return [pcRes.data, appRes.data];
		},
		modifyData(arr) {
			arr.forEach(v => {
				v.title = v.name;
				if (v.children && v.children.length > 0) {
					// 添加虚拟结点
					v.children.unshift({
						checked: false,
						menus_id: 0,
						disableCheckbox: true,
						'show-checkbox': false,
						render(h) {
							return h('span', {
								class: 'delete_node',
							}, 'template');
						}
					});
					this.modifyData(v.children);
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
		}
	}
};
export const PModalAddNew = CreatePortal({}, module.exports.default);
</script>
<style>
.demo-drawer-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
	text-align: center;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  background: #fff;
}
</style>
<style lang="scss">
.v-hr-sale_add {
  .ivu-drawer.ivu-drawer-right {
    width: calc(100% - 160px)!important;
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
	.ivu-form-item {
		margin-bottom: 0;
	}
	._pc-tree,
	._app-tree {
		overflow: hidden;
		min-width: 400px;
		max-width: 500px
	}
}
  
</style>

