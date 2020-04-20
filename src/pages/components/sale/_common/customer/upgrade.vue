<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="提升客户级别"
		class="v-sale-customer-upgrade"
		width="400"
		@on-ok="handleSave"
		@on-cancel="handleCancel"
	>
		<i-form
			ref="form"
			:model="formData"
			:rules="rule"
			:label-width="80"
			class="g-pd-l-20"
			style="max-height: 300px;overflow: auto;">
			<i-form-item label="提升为：" prop="level">
				<i-radio-group v-model="formData.level" @on-change="loadUpgradeInfo">
					<i-radio :label="0" :disabled="customer.level ==1" >临时客户</i-radio>
					<i-radio :label="1" class="g-m-l-10">普通客户</i-radio>
					<i-radio :label="2" >重要客户</i-radio>
				</i-radio-group>
			</i-form-item>
			<i-form-item label="保护时间：" prop="refund_type">
				<span class="g-c-black0">{{ upgradeInfo.limit_time }}</span>
			</i-form-item>
		</i-form>
	</i-modal>
</template>
<script >
import { Modal, Form, FormItem, Select, Option, RadioGroup, Radio } from 'iview';
import { CreatePortal } from 'wya-vc';
import orderModal from '@extends/mixins/orderModal';
import { Confirm } from '@common/confirm/confirm';
import { PropModal } from '../property/prop-modal';

export default {
	name: "oa-dale-customer-upgrade",
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-select': Select,
		'i-option': Option
	},
	mixins: [orderModal],
	props: {
		customer: {
			type: Object,
			default: () => ({ customer_id: '', level: 1 })
		}
	},
	data() {
		return {
			visible: false,
			formData: {
				level: this.customer.level,
				customer_id: this.customer.customer_id
			},
			rule: {
				level: []
			},
			msg: '',
			upgradeInfo: {}
		};
	},
	created() {
		this.loadUpgradeInfo(this.formData.level);
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		async handleSave() {
			if (this.formData.level == this.customer.level) {
				this.handleCancel();
				return;
			}
			// 是否达到等级数量限制
			if (this.upgradeInfo.hold_upper_limit) {
				PropModal.popup({
					type: this.formData.level,
					customerId: this.customer.customer_id
				}).then(() => {
					this.handleOk();
				}).catch(e => {
					e && console.error(e);
					this.handleCancel();
				});


			} else {
				this.$request({
					url: "_SALE_INTENTION_UPGRADE_POST",
					type: "POST",
					loading: false,
					param: {
						...this.formData
					}
				}).then(res => {
					this.$Message.success(res.msg);
					this.handleOk();
				}).catch(res => {
					this.$Message.error(res.msg);
					this.$refs.modal.buttonLoading = false;
				});

			}
		},
		loadUpgradeInfo(level) {
			this.$request({
				url: "_SALE_INTENTION_BERORE_UPGRADE_GET",
				type: "GET",
				loading: false,
				param: {
					customer_id: this.customer.customer_id,
					level
				}
			}).then(res => {
				this.upgradeInfo = res.data;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		}
	}
};
export const Upgrade = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-sale-customer-upgrade{
	.ivu-radio-wrapper:first-child {
		margin-right: 0 !important;
	}
}
</style>