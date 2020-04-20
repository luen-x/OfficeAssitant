<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:width="400"
			:mask-closable="false"
		>
			<div slot="header" class="g-tc">
				{{ name === '2' ? '通过申请' : '驳回申请' }}
			</div>
			<i-form
				ref="form"
				:model="formdata"
				:rules="validator"
				:label-width="100"
				class="g-m-t-20">
				<i-formitem :label="type" prop="audit_remark">
					<i-textarea
						v-model="formdata.audit_remark"
						:placeholder="placeholder"
						:max="50"
						clearable
						style="width: 80%"
					/>
				</i-formitem>
			</i-form>
			<div slot="footer">
				<i-button 
					type="text" 
					@click="handleCancel"
				>
					取消
				</i-button>
				<i-button 
					type="primary" 
					@click="handleOk"
				>
					确定
				</i-button>
			</div>
		</i-modal>
	</div>
</template>

<script>
import { Modal, DatePicker, Form, FormItem, Row, Col, Button } from 'iview';
import { CreatePortal } from 'wya-vc';
import TextArea from '@components/_common/limit-words/limit-words';

export default {
	name: 'finance-customer-audit-modal',
	components: {
		'i-modal': Modal,
		'i-datepicker': DatePicker,
		'i-textarea': TextArea,
		'i-form': Form,
		'i-formitem': FormItem,
		'i-row': Row,
		'i-col': Col,
		'i-button': Button
	},
	props: {
		name: String,
		show: {
			type: Boolean,
			default: () => true
		},
		requestFn: Function
	},
	data() {
		return {
			visible: false,
			formdata: {},
			validator: {
				audit_remark: [
					{ required: true, message: `请输入${this.name === '2' ? '通过说明' : '驳回原因'}`, trigger: 'blur' }
				]
			}
		};
	},
	computed: {
		type() {
			return this.name === '2' ? '通过说明' : '驳回原因';
		},
		placeholder() {
			return `请输入${this.type}`;
		}
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs['form'].validate((item) => {
				if (item) {
					this.requestFn({
						data: this.formdata,
						cb: () => { this.visible = false; this.$emit('destory'); }
					});
				}
			});
		},
		handleCancel() {
			if (this.formdata.remark) {
				Modal.confirm({
					title: '提示',
					content: '取消后你所填写的内容将无法恢复，确认取消？',
					onOk: () => {
						this.visible = false;
						this.$emit('destory');
					}
				});
			} else {
				this.visible = false;
			}
		},
	}
};
export const AuditModal = CreatePortal({ store: app.$store }, module.exports.default);
</script>

<style lang="scss" scoped>

</style>


