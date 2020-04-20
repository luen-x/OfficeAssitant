<template>
	<i-modal
		ref="modal"
		v-model="visible" 
		:mask-closable="false"
		:loading="true"
		class="le g-modal-small" 
		title="修改前端路径"
		@on-ok="handleOk" 
		@on-cancel="handleCancel"
	>
		<div>
			<i-form
				:model="formData"
				:label-width="100"
			>
				<i-form-item label="路由名称:" prop="name">
					<i-input v-model="formData.name" disabled placeholder="请输入路由名称" style="width: 320px;"/>
				</i-form-item>
				<i-form-item label="权限id:" prop="menus_id">
					<i-input v-model="formData.menus_id" disabled placeholder="请输入权限id" style="width: 320px;"/>
				</i-form-item>
				<i-form-item label="前端路由地址:" prop="frontend_url">
					<i-input v-model="formData.frontend_url" placeholder="请输入前端路由地址" style="width: 320px;"/>
				</i-form-item>
				<i-form-item label="后端路由地址:" prop="backend_urls">
					<oa-limit-words
						v-model="formData.backend_urls"
						:max="1000"
						placeholder="请输入后端路由地址" 
						style="width: 320px;"
					/>
				</i-form-item>
			</i-form>
		</div>
	</i-modal>
</template>
<script>
import { Modal, Button, Form, FormItem, Input } from 'iview';
import { CreatePortal } from 'wya-vc';
import API_ROOT from "@stores/apis/root";

export default {
	name: 'oa-front-end-router',
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input
	},
	props: {
		frontendUrl: String,
		routerName: String,
		menusId: Number,
		isbackendUrl: Number,
		backendUrls: String
	},
	data() {
		return {
			visible: false,
			Button,
			formData: {
				name: '',
				frontend_url: '',
				menus_id: '',
				backend_urls: ''
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
		this.formData.name = this.routerName;
		this.formData.frontend_url = this.frontendUrl;
		this.formData.menus_id = this.menusId;
		this.formData.backend_urls = (this.backendUrls || '').replace(/,/g, ',\r\n\r\n');
	},
	methods: {
		handleOk() {
			const targetData = {
				...this.formData,
				backend_urls: this.formData.backend_urls.replace(/\r/g, '').replace(/\n/g, '').replace(/ /g, '')
			};
			this.$request({
				url: API_ROOT.SETTINGS_ROUTE_SAVE_POST,
				type: 'POST',
				param: targetData
			}).then((res) => {
				this.$Message.success('编辑成功');
				this.$emit('sure', targetData);
			}).catch((err) => {
				this.$refs.modal.buttonLoading = false;
				this.$Message.error(err.msg);
			});
		},
		handleCancel() {
			// this.visible = false;
			this.$emit('close');
		},
	}
};
export const FrontEndRouter = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">

</style>
