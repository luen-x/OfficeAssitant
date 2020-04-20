<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true"
			:mask-closable="false"
			ok-text="预览"
			class="c-social-change-modal"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				发offer
			</div>
			<i-form
				ref="formValidate"
				:model="formValidate"
				:rules="ruleValidate"
				:label-width="110"
				class="g-m-t-20 g-pd-lr-20"
			>

				<i-formitem
					prop="offer_id"
					label="附件样式："
				>
					<!-- <i-select
						v-model="formValidate.offer_id"
						:remote-method="loadOffer"
						:loading="offerLoading"
						remote
						filterable
						style="width: 220px;"
						clearable
						transfer
						placeholder="请输入模板样式"
					>
					<i-option
							v-for="(item, index) in offerData"
							:key="index"
							:value="item.value"
						>{{ item.label }}</i-option>
					</i-select>-->
					<i-select
						v-model="formValidate.offer_id"
						style="width: 220px;"
						clearable
						transfer
						placeholder="请选择附件样式"
					>
						<i-option
							v-for="(item, index) in offerData"
							:key="index"
							:value="item.offer_id"
						>{{ item.offer_name }}</i-option>
					</i-select>
				</i-formitem>


				<i-formitem label="发offer时间：" prop="send_offer_time">
					<i-date-picker
						v-model="formValidate.send_offer_time"
						type="date"
						clearable
						transfer
						placeholder="请选择发offer时间"
						style="width: 220px"/>
				</i-formitem>


				<i-formitem label="报到时间：" prop="register_time">
					<i-date-picker
						v-model="formValidate.register_time"
						type="datetime"
						format="yyyy-MM-dd HH:mm"
						clearable
						transfer
						placeholder="请选择报到时间"
						style="width: 220px"/>
				</i-formitem>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Form, FormItem, Select, Option, DatePicker, InputNumber } from 'iview';
import { CreatePortal } from 'wya-vc';
import LimitWords from '@components/_common/limit-words/limit-words';
import API_ROOT from '@stores/apis/root';
import { getParseUrl, getHashUrl, formatMoment } from '@utils/utils';
// import { searchOffer } from '@stores/services/hr';

export default {
	name: 'hr-social-offer-modal',
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-formitem': FormItem,
		'i-input-number': InputNumber,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker
	},
	// mixins: [searchOffer({ type: 3 })],
	props: {
		applicantId: String | Number,
		status: String | Number,
	},
	data() {
		return {
			visible: false,
			offerData: [],
			formValidate: {
				offer_id: '',
			},
			ruleValidate: {
				offer_id: [
					{ required: true, type: 'number', message: '请选择附件样式', trigger: 'change' }
				],
				send_offer_time: [
					{ required: true, message: "请选择发offer时间", type: 'object', trigger: "change" }
				],
				register_time: [
					{ required: true, message: "请选择报到时间", type: 'object', trigger: "change" }
				],
			}
		};
	},
	computed: {

	},
	mounted() {
		this.visible = true;
		this.fetchOfferData();
	},
	methods: {
		handleOk() {
			this.$refs.formValidate.validate((valid) => {
				if (valid) {
					this.$router.push(
						getHashUrl('/hr/recruit/social/summary/email',
							{
								...this.formValidate,
								applicant_id: this.applicantId,
								send_offer_time: this.formValidate.send_offer_time && formatMoment(this.formValidate.send_offer_time),
								register_time: formatMoment(this.formValidate.register_time, 'YYYY-MM-DD HH:mm'),
								recruitType: 'social'
							})
					);
					this.$refs.modal.buttonLoading = false;
					this.visible = false;
					this.$emit('sure');
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleCancel() {
			this.$emit('close');
		},
		fetchOfferData() {
			this.$request({
				url: API_ROOT['_HR_MODULE_GET'],
				type: 'GET',
				param: {
					type: 3
				},
				loading: false
			}).then((res) => {
				this.offerData = res.data;
			}).catch((error) => {
			});
		}
	}
};
export const OfferModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.c-social-offer-modal {
	.ivu-modal-wrap .ivu-modal {
		width: 400px !important;
	}
	.ivu-form-item-label {
		color: #333333;
	}
	.ivu-modal-body {
		padding: 0 !important;
	}
	.ivu-modal-footer {
		padding: 0 20px 20px 20px !important;
	}
}
</style>
