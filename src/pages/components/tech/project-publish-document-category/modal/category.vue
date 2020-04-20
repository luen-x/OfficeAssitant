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
			{{ name === '1' ? '添加类目' : '编辑项目' }}
		</div>

		<i-form 
			ref="form" 
			:label-width="110"
			:model="formData" 
			:rules="rule"  
			class="g-m-t-20"
		>
			<i-form-item label="类目名称" prop="document_name">
				<i-input
					v-model="formData.document_name"
					:maxlength="10"
					clearable
					placeholder="请输入类目名称"
					style="width: 220px;"
				/>
			</i-form-item>

			<i-form-item label="上级类目:" prop="pid">
				<i-poptip
					v-model="popVisible"
					:width="220"
					placement="bottom"
					transfer
					@on-popper-show="poptipShow = true"
					@on-popper-hide="poptipShow = false"
				>
					<div class="_select-class" style="width: 220px;">
						<i-input v-show="false" v-model="formData.document_id"/>
						<span v-if="classListArray.length === 0">{{ projectName }}</span>
						<div v-for="(item, index) in classListArray" :key="index">
							<span>{{ item.title }}</span>
						</div>
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
		name: String,
		v: Object,
		flag: Number
	},

	data() {
		return {
			visible: false,
			popVisible: false,
			poptipShow: false,
			classListArray: [],
			categoryList: [],
			projectName: '',
			formData: {
				document_name: '',
				document_id: ''
			},
			rule: {
				document_name: [
					{
						required: true,
						message: "类目名称是必填的！",
						trigger: "blur"
					}
				],
				document_id: [
					{ required: true, message: '根类目不能为空', trigger: 'blur' }
				]
			},
			sendData: {} // 传给后端的数据
		};
	},

	mounted() {
		if (this.flag === 1 && this.name === '1') {
			this.sendData = {
				project_id: this.v.value,
				parent_id: this.v.document_id
			};
		} else if (this.flag === 1 && this.name === '2') {
			this.sendData = {
				project_id: this.v.value,
				parent_id: this.v.parent_id
			};
		}
		if (this.name === '2') {
			this.formData.document_name = this.v.label;
			this.projectName = this.v.parent_document_name;
		} else {
			this.projectName = this.v.label;
		}

		this.loadData();
		this.visible = true;
	},

	methods: {
		loadData() {
			this.$request({
				url: "TECH_PROJECT_PUBLISH_DOCUMENT_CATEGORY_LIST_GET",
				type: "GET",
				param: {
					status: 1,
					project_id: this.v.value
				}
			}).then(res => {
				let listString = '';
				listString = (JSON.stringify(res.data)).replace(/document_name/g, 'title');
				this.categoryList = JSON.parse(listString);
				this.flag === 2 ? this.sendData = {
					project_id: res.data[0].project_id,
					parent_id: res.data[0].document_id
				} : null;
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
				url: "_TECH_PROJECT_PUBLISH_PRODUCTMENT_DOCUMENT_LIST_POST",
				type: "POST",
				param: {
					project_id: this.sendData.project_id,
					document_name: this.formData.document_name,
					parent_id: this.sendData.parent_id,
					document_id: this.name === '2' ? this.v.document_id : null
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
				this.formData.document_id = treeArray[0].document_id;
				this.sendData = treeArray[0];
				this.sendData.parent_id = this.sendData.document_id;
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