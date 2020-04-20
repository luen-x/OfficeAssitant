<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="调整微币余额"
		width="400"
		class="v-sale-property-coin-adjust-modal"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<i-form
			ref="form"
			:label-width="100"
			:model="formData" 
			:rules="ruleValidate" 
			class="g-pd-l-10"
		>
			<i-form-item label="" prop="coin_count" class="_select">
				<i-select
					v-model="formData.type"
					style="width: 110px"
					class="g-inline-block"
					transfer
					placeholder="请选择"
				>
					<i-option :value="1">增加余额</i-option>
					<i-option :value="2">减少余额</i-option>
				</i-select>
				<i-input-number
					v-model="formData.coin_count"
					:max="1000"
					:min="1"
					:precision="0"
					:active-change="false"
					placeholder="输入微币数量"
					class="g-inline-block"
					style="width: 110px"
				/>
				<span>个微币</span>
			</i-form-item>
			<i-form-item label="备注原因：" prop="remark">
				<oa-limit-words
					v-model="formData.remark" 
					:max="200" 
					style="width:220px;"
					class="g-dp-ib"
					placeholder="请输入原因"
				/>
			</i-form-item>
			<div style="color: #E74854;padding-left: 28px;padding-top: 10px;">提醒：每笔余额操作都将会被系统记录，请谨慎操作。</div>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Select, Option, InputNumber } from 'iview';
import { CreatePortal } from 'wya-vc';

export default {
	name: "v-sale-property-coin-adjust-modal",
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-select': Select,
		'i-option': Option,
		'i-input-number': InputNumber
	},
	props: {
		datas: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			visible: false,
			formData: {
				type: 1,
				coin_count: null,
				remark: ''
			},
			ruleValidate: {
				coin_count: [
					{ required: true, type: 'number', message: '请输入调整数量', trigger: 'blur' }
				],
				remark: [
					{ required: true, message: '请填写备注', trigger: 'blur' }
				],
			}
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk(res) {
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleSave() {
			let param = {
				...this.formData,
				account_id: this.datas.account_id,
				staff_id: this.datas.staff_id
			};
			this.$request({
				url: `_SALE_PROPERTY_CONTROL_PROPERTY_CONIN_SAVE_POST`, // eslint-disable-line
				type: "POST",
				param
			}).then((res) => {
				this.$Message.success('调整成功');
				this.visible = false;
				this.$emit('sure');
			}).catch((error) => {
				this.$Message.error(error.msg);
				this.visible = true;
				this.$refs.modal.buttonLoading = false;
			});
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
	}
};
export const AdjustModal = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-sale-property-coin-adjust-modal {
    ._select {
        .ivu-form-item-content {
            margin-left: 28px !important;
        }
    }
}
</style>

