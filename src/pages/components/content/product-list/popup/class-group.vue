<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		class="v-class-group"
		width="400"
		title="分类管理"
		footer-hide
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div style="height:350px;overflow-y: auto;">
			<div v-for="(item,index) in list" :key="index" class="_class-name g-flex g-jc-sb">
				<div class="g-m-l-20">{{ item.category_name }} </div>
				<div>
					<i v-if="auth[25]&&0" class="_oprea g-m-r-20 iconfont icon-delete" @click="handleDel(index)"/>
					<i v-if="auth[26]&&0" class="_oprea g-m-r-20 iconfont icon-edit2" @click="handleEdit(index)"/>
				</div>
			</div>
			<div v-if="0" style="padding-bottom: 20px;" class="g-operation g-m-t-20 g-flex-cc" @click="handleAdd()">
				<i v-if="auth[27]" class="_oprea  g-m-r-10 iconfont icon-add1"/>添加
			</div>
		</div>
	</i-modal>
</template>

<script type="text/ecmascript-6">
import API from "@stores/apis/root";
import { Modal, Form, FormItem, Input, Button, InputNumber } from 'iview';
import { CreatePortal } from 'wya-vc';
import { DelClass } from "./del-class";
import { AddClass } from "./add-class";

export default {
	name: "class-group",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-input-number": InputNumber
	},

	data() {
		return {
			visible: false,
			formItem: {},
			list: ''// 分类管理
		};
	},
	computed: {
		auth() {
			return this.$auth;
		}
	},
	beforeCreate() {
		this.Button = Button;
	},
	created() {
		this.GetClass();

	},
	mounted() {
		this.visible = true;
	},
	methods: {
		GetClass() {
			this.$request({
				url: API._CONTENT_PRODUCT_CATEGORY_GET,
				type: "GET",
				loading: false,
				param: {
				}
			}).then(res => {
				this.list = res.data;
			}).catch(error => {
				console.error(error);
			});

		},
		handleSave() {
			this.visible = false;
		},
		handleNull() {
			this.visible = false;
		},
		handleOk() {
			/**
			 * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
			 */
			// this.visible = false;
			this.$emit('sure', {});
		},
		handleCancel() {
			// this.visible = false;
			this.$emit('close');
		},
		// 删除
		handleDel(i) {
			let val = this.list[i].category_id;
			DelClass.popup({
				data: {
					category_id: val,
				}			})
				.then(data => {
					this.GetClass();
				})
				.catch(data => {

				});
		},
		// 添加
		handleAdd() {
			AddClass.popup({
				data: {
					type: 0
				},
			})
				.then(data => {
					this.GetClass();
				})
				.catch(data => { });
		},
		handleEdit(i) {
			let val = this.list[i].category_id;
			AddClass.popup({
				data: {
					type: 1,
					category_id: val,
					list: this.list[i],
				}
			}).then(data => {
				this.GetClass();
			}).catch(data => {
				this.GetClass();
			});
		}

	}
};
export const ClassGroup = CreatePortal({}, module.exports.default);
</script>

<style  lang="scss">
	.v-class-group {
	    ._class-name {
	        height: 60px;
	        line-height: 80px;
	        color: #484f57;
	        border-bottom: 1px solid #ebeef1;
	    }
		._oprea{
			cursor: pointer;
			font-size: 18px !important;
		}
	    .ivu-modal-body {
	        padding: 0;
	    }
	}
</style>
