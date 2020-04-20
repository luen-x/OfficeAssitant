<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="添加条件"
		width="600px"
		class="v-hr-academy-elite-add-course"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-m-tb-30 g-fs-14 g-c-black2">
			<i-checkbox-group v-model="select">
				<i-checkbox
					v-for="item in beforeConditions" 
					:label="item.value" 
					:key="item.value"
					class="g-m-l-30" 
					style="display: block; margin-bottom: 15px">
					<span>{{ item.title }}</span>
					<span class="g-c-black5">{{ item.label }}</span>
				</i-checkbox>
			</i-checkbox-group>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Checkbox, CheckboxGroup } from 'iview';
import { CreatePortal } from 'wya-vc';
import { beforeConditions, afterCondition } from '../add-condition/condition';

export default {
	name: "oa-hr-train-detail-delete-tip",
	components: {
		'i-modal': Modal,
		'i-checkbox': Checkbox,
		'i-checkbox-group': CheckboxGroup,
	},
	props: {
		default: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			visible: false,
			beforeConditions,
			select: this.default
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			if (this.select.length) {
				this.$refs.modal.buttonLoading = false;
				this.$emit('sure', this.select);
				this.visible = false;
			} else {
				this.$refs.modal.buttonLoading = false;
				this.visible = true;
				this.$Message.warning('至少选择一个条件');
			}
		},
		handleCancel() {
			this.$refs.modal.buttonLoading = false;
			this.$emit('close', false);
			this.visible = false;
		},
	}
};
export const AddCondition = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-hr-academy-elite-add-course {
    .ivu-modal-body {
        max-height: 400px;
        overflow: auto;
    }
}
</style>


