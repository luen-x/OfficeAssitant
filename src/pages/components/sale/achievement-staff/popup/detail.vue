<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="查看详情"
		footer-hide
		width="680"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-m-b-40">
			<div style="margin-left: 30px;">
				{{ data.contract_company_name }}
			</div>
			<oa-block class="">
				<oa-block-item :content="payment_info.payment_amount" labels="实付金额"/>
				<oa-block-item :content="payment_info.received_amount" labels="到账金额"/>
				<oa-block-item :content="payment_info.poundage" labels="手续费" />
				<oa-block-item :content="payment_info.after_share_performance" labels="分单后业绩"/>
				<oa-block-item labels="分单金额">
					<!-- <oa-money-tooltip
						:total="payment_info.share_performance"
						:data="payment_info.staff_share" /> -->
					<i-poptip v-if="payment_info.is_share" trigger="hover">
						<span class="g-operation">{{ payment_info.share_performance }}</span>
						<div slot="content" style="padding:0 4px">
							<div v-for="(percent) in payment_info.staff_share.filter(i=>!i.is_invite_staff)" :key="percent.staff_id+'staff'">
								{{ percent.staff_name }}
								：
								{{ percent.convert||percent.performance }}
							</div>
							<div v-for="(percent) in payment_info.depart_share" :key="percent.depart_id+'depart'">
								{{ percent.depart_name }}
								：
								{{ percent.performance }}
							</div>
							<div v-for="(percent,index) in payment_info.cooperation_share" :key="index">
								外部合作
								：
								{{ percent.performance }}
							</div>
						</div>
					</i-poptip>
					<span v-else class="g-c-black2">{{ payment_info.share_performance }}</span>
				</oa-block-item>
				<oa-block-item :content="payment_label" labels="款项标签"/>
				<oa-block-item v-if="payment_info.refund_amount>0" :content="payment_info.refund_amount" labels="退款金额"/>
				<oa-block-item :content="base_info.original_time" labels="原始时间" />
				<oa-block-item :content="payment_time" labels="付款时间" />
				<oa-block-item :content="audit_info.audit_time" labels="审核时间" />
				<oa-block-item :content="base_info.create_time" labels="录入时间" />
				<oa-block-item :content="payment_info.remark" labels="备注">
					<span v-if="payment_info.remark==undefined ||payment_info.remark.length<10">{{ payment_info.remark }}</span>
					<i-poptip v-else :content="payment_info.remark" transfer trigger="hover">
						<span class="g-poninter">{{ payment_info.remark.substring(0,10)+'...' }}</span>
						<div slot="content" style="max-width: 500px;white-space: normal;">
							{{ payment_info.remark }}
						</div>
					</i-poptip>
				</oa-block-item>
			</oa-block>
		</div>
	</i-modal>
</template>
<script>
import { Modal, Icon, Input, Form, FormItem, RadioGroup, Radio, Button, Poptip, Select, Option } from 'iview';
import Explain from '@components/_common/explain/explain';
import { CreatePortal } from 'wya-vc';
import { dataValidity, objRegex } from '@utils/utils';
import MoneyTooltip from '@components/sale/_common/customer/popup/components/money-tooltip';
import BlockItem from './block-item';
import Block from './block';

export default {
	name: "oa-sale-",
	components: {
		'i-modal': Modal,
		'i-icon': Icon,
		'i-input': Input,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-button': Button,
		'i-poptip': Poptip,
		'oa-explain': Explain,
		'i-select': Select,
		'i-option': Option,
		'oa-block-item': BlockItem,
		'oa-block': Block,
		'oa-money-tooltip': MoneyTooltip

	},
	props: {
		data: Object // customer_id
	},
	data() {
		return {
			visible: false,
			payment_info: {}, // 款项信息
			audit_info: {},
			base_info: {},
			payment_label: '', // 款项标签
			payment_time: '', // 付款时间
			rules: {
				prop: []
			}
		};
	},
	created() {
		if (this.data.payment_id) {
			this.$request({
				url: '_SALE_PAYMENT_DETAIL_GET',
				type: "POST",
				param: {
					...this.data
				},
				loading: false
			}).then(res => {
				this.payment_info = res.data.payment_info;
				this.base_info = res.data.base_info;
				this.audit_info = res.data.audit_info;

				this.payment_info.payment_label.map(ele => {
					return this.payment_label += ele.label_name;
				});
				this.payment_label = this.payment_info.payment_label.length
					? this.payment_info.payment_label.map(ele => ele.label_name).join("、") : '';
				this.payment_time = this.payment_info.payment_method.length
					? this.payment_info.payment_method.map(ele => ele.payment_time).join("/") : '';
			}).catch((res) => {
			});
		}
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
		handleSave() {
			this.$refs.form.validate(valid => {
				if (valid) {
					this.$request({
						url: '',
						type: "POST",
						param: {
							...this.formData
						},
						loading: false
					}).then(res => {
						this.$Message.success(res.msg);
						this.visible = false;
						this.$emit('sure');
					}).catch((res) => {
						this.$Message.error(res.msg);
						this.$refs.modal.buttonLoading = false;
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		}
	}
};
export const AccountDetail = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
</style>