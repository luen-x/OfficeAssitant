<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:width="400"
			:mask-closable="false"
			:loading="true"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">修改成本比例</div>
			<i-form
				ref="form"
				:model="formdata" 
				:rules="validator"
				:label-width="100" 
				class="g-m-t-20"
			>
				<i-form-item 
					v-for="(item, index) of formdata.cost_info"
					:key="index"
					:label="item.staff_name"
					:rules="validator.percent" 
					:prop="`cost_info.${index}.percent`">
					<i-input-number 
						v-model="item.percent"
						:disabled="!item.is_edit"
						:min="0"
						:max="100"
						style="width: 80%"
						placeholder="请输入成本比例"
						clearable
					/>
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Form, FormItem, InputNumber } from 'iview';
import { CreatePortal } from 'wya-vc';

export default {
	name: 'contract-change-rate',
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input-number': InputNumber
	},
	props: {
		info: Array
	},
	data() {
		return {
			formdata: {
				cost_info: this.info
			},
			visible: false,
			validator: {
				percent: [
					{ required: true, type: 'number', message: '请输入分单比例', trigger: 'blur' }
				]
			}
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs.modal.buttonLoading = false;
			this.$refs.form.validate(item => {
				if (item) {
					this.visible = false;
					this.$emit('sure');
				}
			});
		},
		handleCancel() {
			this.$emit('close');
		}
	}
};

export const RateModal = CreatePortal({ store: app.$store }, module.exports.default);
</script>

<style lang="scss">

</style>


