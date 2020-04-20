<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:width="400"
			:mask-closable="false"
		>
			<div slot="header" class="g-tc">
				{{ name === '1' ? '通过申请' : '驳回申请' }}
			</div>
			<i-form 
				v-if="spin"
				ref="form"
				:model="formdata" 
				:rules="validator"
				:label-width="100" 
				class="g-m-t-20">
				<i-formitem v-if="name === '1' && show" :label="label + ':'" prop="month" >
					<i-datepicker
						v-model="formdata.month"
						:placeholder="`请选择${label}`"
						:options="options"
						style="width: 80%"
						type="month"
						transfer
					/>
				</i-formitem>
				<i-formitem :label="type" prop="remarks">
					<i-textarea 
						v-model="formdata.remarks"
						:placeholder="placeholder"
						clearable
						style="width: 80%"
					/>
				</i-formitem>
			</i-form>
			<i-spin v-else fix />
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
import { Modal, DatePicker, Form, FormItem, Row, Col, Spin, Button } from 'iview';
import { CreatePortal } from 'wya-vc';
import moment from 'moment';
import TextArea from '@components/_common/limit-words/limit-words';
import API_ROOT from '@stores/apis/root';
import { Confirm } from '@components/_common/confirm/confirm';

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
		'i-spin': Spin,
		'i-button': Button,
	},
	props: {
		name: String,
		show: {
			type: Boolean,
			default: () => true
		},
		state: String,
		payment_id: Number,
		requestFn: Function,
		deal_month: String,
		label: {
			type: String,
			default: () => '业绩归属月份'
		}
	},
	data() {
		return {
			visible: false,
			spin: true,
			formdata: {
				month: this.deal_month
			},
			month: this.deal_month,
			validator: {
				month: [{ required: true, type: 'date', message: '请选择业绩归属月份', trigger: 'blur' }],
				remarks: [{ 
					required: true, 
					message: `请输入${this.name === '1' ? '通过说明' : '驳回原因'}`, 
					trigger: 'blur' 
				}]
			}
		};
	},
	computed: {
		type() {
			return this.name === '1' ? '通过说明' : '驳回原因';
		},
		placeholder() {
			return `请输入${this.type}`;
		},
		options() {
			return {
				disabledDate: (date) => {
					return (date && date.valueOf() > new Date()) || date.valueOf() < new Date(this.month) - 86400000;
				}
			};
		}
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs['form'].validate((item) => {
				if (item) {
					const formdata = {
						...this.formdata,
						month: moment(this.formdata.month).format('YYYY-MM')
					};
					this.handleCheck(formdata);
				}
			});
		},
		async handleCheck(formdata) {
			if (this.show) {
				const { data } = await this.$request({
					url: '_FINANCE_PAYMENT_AUDIT_CHECK_GET',
					type: 'GET',
					param: {
						payment_id: this.payment_id
					}
				});
				if (this.name === '1') {
					data.share_payment && await Confirm.popup({ msg: '系统检测到创建人或绕前台电话添加人与邀约人不是同一个人，确定该邀约人不分单给相应的创建人或添加人？' });
					data.log_repeat && await Confirm.popup({ msg: '系统检测到本次到账可能跟之前的到账记录重复，确定过本次到账？' });
				}
			}
			this.requestFn({
				data: formdata,
				cb: () => { this.visible = false; this.$emit('sure'); }
			});
		},
		handleCancel() {
			if ((this.name === '1' && this.show === true && this.formdata.month) || this.formdata.remarks) {
				Modal.confirm({
					title: '提示',
					content: '取消后你所填写的内容将无法恢复，确认取消？',
					width: 400,
					onOk: () => {
						this.visible = false;
						this.$emit('destory');
					}
				});
			} else {
				this.visible = false;
			}
		}
	}
};
export const AchiAuditModal = CreatePortal({ store: app.$store }, module.exports.default);
</script>

<style lang="scss" scoped>

</style>


