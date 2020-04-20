<template>
	<i-modal
		v-model="visible"
		:title="title"
		:mask-closable="false"
		width="360px"
		footer-hide
	>
		<div class="g-m-tb-30">
			<div v-if="canDelete" style="font-size: 14px">
				仍有活动存在于“{{ data.category_name }}”分类下，暂无法删除
			</div>
			<div v-else>
				确认删除“{{ data.category_name }}”分类
			</div>
		</div>
		<div name="foot" style="height: 40px">
			<div v-if="canDelete">
				<i-button type="primary" class="g-fr" @click="handleCancel">确定</i-button>
			</div>
			<div v-else>
				<i-button type="primary" class="g-fr g-m-l-10" @click="handleDelete">确定</i-button>
				<i-button type="text" class="g-fr" @click="handleCancel">取消</i-button>
			</div>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Button, Upload } from 'iview';
import { CreatePortal } from 'wya-vc';
import API_ROOT from '@stores/apis/root';

export default {
	name: "vc-tpl-basic",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-upload': Upload
	},
	props: {
		data: Object
	},
	data() {
		return {
			visible: false,
			defaultList: {}
		};
	},
	computed: {
		canDelete() {
			return this.data.activity_num > 0;
		},
		title() {
			return this.data.activity_num > 0 ? "删除提示" : "确认删除";
		}
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$emit('sure');
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleDelete() {
			this.$request({
				url: API_ROOT._CONTENT_ACTIVITY_CLASSIFY_DELETE_POST,
				type: "POST",
				param: {
					id: this.data.category_id,
				}
			}).then(res => {
				this.visible = false;
				this.$Message.success(res.msg);
				app.$store.commit('CONTENT_ACTIVITY_CLASSIFY_LIST_RESET', { type: '' });
			}).catch(err => this.$Message.error(err.msg));
		}
	}
};
export const PModalDelete = CreatePortal({}, module.exports.default);
</script>
