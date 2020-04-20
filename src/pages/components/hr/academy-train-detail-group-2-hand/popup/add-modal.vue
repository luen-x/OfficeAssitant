<template>
	<div>
		<i-modal
			ref="modal"
			:loading="true"
			v-model="visible"
			:mask-closable="false"
			:width="400"
			class="v-hr-academy-schedule-model"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				新增分组
			</div>
			<i-form
				ref="form" 
				:model="formData" 
				:label-width="100" 
				:rules="formdataRule" 
				class="g-m-t-20 g-pd-l-30"
			>
				<i-form-item label="分组名称:" prop="group_name">
					<i-input v-model="formData.group_name" :maxlength="10" style="width: 220px"/>
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, DatePicker, Form, FormItem, Message, Select, Option, Input } from 'iview';
import API_ROOT from '@stores/apis/root';
import { CreatePortal } from 'wya-vc';
import moment from 'moment';

export default {
	name: 'sc-service-start-modal',
	components: {
		'i-modal': Modal,
		'i-datepicker': DatePicker,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-select': Select,
		'i-option': Option,
		'i-input': Input,
	},
	props: {
		name: Number,
		datas: {
			type: Array,
			default: () => [{}, {}]
		}
	},
	data() {
		return {
			visible: false,
			formData: {
				group_name: ''
			},
			formdataRule: {
				group_name: [{ type: 'string', required: true, message: '请填写分组名称', trigger: 'blur' }]
			},
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					if (this.datas.includes(this.formData.group_name)) {
						this.$Message.warning('组名不能重复');
						this.$refs.modal.buttonLoading = false;
					} else {
						this.visible = false;
						this.$emit('sure', this.formData.group_name);
					}
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleCancel() {
			this.$emit('close');
		}
	}
};
export const AddModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>

</style>


