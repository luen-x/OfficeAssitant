<template>
	<div class="page">
		<i-modal
			v-model="visible"
			:mask-closable="false"
			width="400"
			title="申请增加报名人"
			@on-ok="handleOk"
			@on-cancel="handleCancel">
			<div class="g-fs-14 g-c-black1">是否确认申请增加报名人参加活动？若确人增加，则需
				<br>要审核通过才能报名成功
			</div>
		</i-modal>
	</div>
</template>

<script type="text/ecmascript-6">
import API from '@stores/apis/root';
import { Modal, Form, FormItem, Input, Button } from 'iview';
import { CreatePortal } from 'wya-vc';

export default {
	name: "ed-target",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
	},
	data() {
		return {
			visible: false,
			list: ''
		};
	},
	beforeCreate() {
		this.Button = Button;
	},
	mounted() {
		this.visible = true;
	},
	methods: {
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
		 this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
	 this.visible = false;
			this.$emit('close');
		},
		handleDetail(v) {
			this.$router.push({ name: "sale-full-casedetail", query: { material_id: v } });
		}
	},
};
export const AddUser = CreatePortal({}, module.exports.default);
</script>

<style scoped lang="scss">
</style>
