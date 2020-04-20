<template>
	<i-modal
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="删除提示"
		width="400px"
		footer-hide>
		<div class="g-m-30 g-fs-14" style="color: #333">
			{{ message }}
		</div>
		<div name="foot" style="height: 40px; padding-top: 10px">
			<div v-if="canDelete">
				<i-button type="primary" class="g-fr" @click="handleCancel">确定</i-button>
			</div>
			<div v-else>
				<i-button class="g-fr g-m-l-10" type="primary" @click="handleSubmit">确定</i-button>
				<i-button class="g-fr" type="text" @click="handleCancel">取消</i-button>
			</div>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Button, Upload } from 'iview';
import { CreatePortal } from 'wya-vc';
import API_ROOT from '@stores/apis/root';

export default {
	name: "vc-notice-delete",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-upload': Upload
	},
	props: {
		role_ids: {
			required: true,
			type: Array
		},
		canDelete: {
			// 可以删除 返回false
			required: true,
			type: Boolean
		},
		message: {
			required: true,
			type: String
		}
	},
	data() {
		return {
			visible: false,
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			/**
			 * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
			 */
			// this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleSubmit() {
			this.$request({
				url: API_ROOT._HR_ROLE_ROLE_DELETE_POST,
				type: 'POST',
				param: {
					role_ids: this.role_ids,
				}
			}).then(res => {
				app.$store.commit('HR_ROLE_LIST_INIT');
				this.$Message.success(res.msg);
				this.visible = false;
			}).catch(error => {
				console.error(error);
				this.$Message.success(error.msg);
			});
		}
	}
};
export const PModalDelete = CreatePortal({}, module.exports.default);
</script>
