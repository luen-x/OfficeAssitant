<template>
	<i-modal
		ref="modal"
		v-model="visible" 
		:width="400"
		:loading="true"
		:mask-closable="false"
		class="v-tech-category-modal"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			{{ !edit ? '添加类目' : '编辑类目' }}
		</div>

		<i-form 
			ref="form" 
			:label-width="110"
			:model="formData" 
			:rules="rule"  
			class="g-m-t-20"
		>
			<i-form-item label="类目名称：" prop="category_name">
				<i-input
					v-model="formData.category_name"
					:maxlength="20"
					clearable
					placeholder="请输入类目名称"
					style="width: 220px;"
				/>
			</i-form-item>

			<i-form-item label="上级类目：" prop="pid">
				<i-poptip
					v-model="popVisible"
					:width="220"
					placement="bottom"
					transfer
					@on-popper-show="poptipShow = true"
					@on-popper-hide="poptipShow = false"
				>
					<div class="_select-class" style="width: 220px;">
						<i-input v-show="false" v-model="formData.pid"/>
						<span 
							style="display: inline-block;
							width: 180px; overflow: hidden; white-space: nowrap">{{ projectName }}</span>
						<i
							:class="poptipShow ? 'icon-up' : 'icon-down'"
							class="iconfont icon-down g-absolute g-fs-12"
							style="right: 10px;top: 0;"
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
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Input, Poptip, Tree } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";
import { Confirm } from "@components/_common/confirm/confirm";

export default {
	name: "tech-category-modal",

	components: {
		"i-modal": Modal,
		"i-input": Input,
		"i-form": Form,
		"i-form-item": FormItem,
		'i-poptip': Poptip,
		'i-tree': Tree
	},

	props: {
		edit: {
			type: Boolean,
			default: () => false
		},
		info: Object,
		flag: Number
	},

	data() {
		return {
			visible: false,
			popVisible: false,
			poptipShow: false,
			categoryList: [],
			projectName: this.edit ? this.info.pid_category_name : this.info.category_name,
			formData: {
				pid: this.edit ? this.info.pid : this.info.category_id,
				category_name: this.edit ? this.info.category_name : ''
			},
			rule: {
				category_name: [
					{
						required: true,
						message: "类目名称是必填的！",
						trigger: "blur"
					}
				],
				pid: [
					{ required: true, type: 'number', message: '上级类目不能为空', trigger: 'blur' }
				]
			},
			sendData: {} // 传给后端的数据
		};
	},

	mounted() {
		this.loadData();
		this.visible = true;
	},

	methods: {
		loadData() {
			this.$request({
				url: "_CONTENT_CATEGORY_TREE_GET",
				type: "GET",
			}).then(res => {
				let listString = '';
				listString = (JSON.stringify(res.data)).replace(/category_name/g, 'title');
				this.categoryList = JSON.parse(listString);
				this.categoryList.unshift({
					title: '根目录',
					category_id: 0 
				});
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		handleOk() {
			this.$refs.form.validate((valid) => {
				if (valid) {
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},

		handleSave() {
			this.$request({
				url: "_CONTENT_CATEFORY_TREE_ADD_POST",
				type: "POST",
				param: {
					pid: this.formData.pid,
					category_name: this.formData.category_name,
					category_id: this.edit ? this.info.category_id : null
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.$emit("sure", true);
			}).catch(error => {
				this.$Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		},

		handleCancel() {
			this.$emit("close");
		},

		handleCheckedClassNode() {
			let treeArray = this.$refs.classTree.getSelectedNodes();
			
			if (treeArray.length > 0) {
				this.projectName = treeArray[0].title;
				this.formData.pid = treeArray[0].category_id;
			}
			
			this.popVisible = false;
		}
	}
};
export const CategoryModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-tech-category-modal{
	._select-class{
		display: inline-block;
		box-sizing: border-box;
		vertical-align: middle;
		color: #515a6e;
		font-size: 12px;
		line-height: 32px;
		height: 32px;
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

	.ivu-icon-ios-arrow-forward:before {
		content: "\F341";
	}
}
</style>