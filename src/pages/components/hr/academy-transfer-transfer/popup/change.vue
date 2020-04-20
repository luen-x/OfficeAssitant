<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="心态跟踪"
		class="g-flex v-hr-academy-transfer-change-modal"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel">

		<div slot="header" class="g-tc">
			{{ title }}
		</div>
		<div class="g-fs-14 _content">
			<div v-if="action === 'complete'" class="_text">
				是否确定此应聘人培训完成，确认后此人无需在进行培训。
			</div>
			<!-- <div v-if="isConfirm" class="_text">
				是否确定此入职人员变更到培训淘汰，确认后会通知人事人员为此人办理离职。
			</div> -->
			<div v-if="action === 'recover'" class="_text">
				是否确定此应聘人恢复至岗前培训。
			</div>

			<i-form
				ref="form"
				:model="formData"
				:rules="rule"
				:label-width="action === 'not-reach' ? 110 : 90"
				class="g-m-lr-20 g-m-t-20">

				<i-form-item
					v-if="action === 'eliminate'"
					label="淘汰原因："
					prop="pass_remarks_type">
					<i-select
						v-model="formData.pass_remarks_type"
						clearable
						transfer
						placeholder="请选择淘汰原因"
						style="width: 220px;">
						<i-option
							v-for="item in passDeparture"
							:key="item.value"
							:value="item.value">
							{{ item.label }}
						</i-option>
					</i-select>
				</i-form-item>

				<i-form-item
					v-if="action === 'eliminate'"
					label="淘汰时间："
					prop="train_pass_time">
					<i-date-picker
						v-model="formData.train_pass_time"
						type="date"
						clearable
						transfer
						placeholder="请选择淘汰时间"
						style="width: 220px"/>
				</i-form-item>

				<i-form-item
					v-if="action === 'eliminate'"
					label="备注："
					prop="train_pass_remarks">
					<oa-limit-words
						v-model="formData.train_pass_remarks"
						:max="500"
						placeholder="请输入备注"
						width="220px"/>
				</i-form-item>

				<i-form-item
					v-if="action === 'not-reach'"
					label="未达标备注："
					prop="train_unachieve_remarks">
					<oa-limit-words
						v-model="formData.train_unachieve_remarks"
						:max="500"
						placeholder="请输入未达标备注"
						width="220px"/>
				</i-form-item>
			</i-form>
		</div>

	</i-modal>
</template>

<script>
import moment from 'moment';
import API_ROOT from "@stores/apis/root";
import { Modal, DatePicker, Form, FormItem, Select, Option } from "iview";
import { CreatePortal, Copy } from "wya-vc";
import { formatMoment } from "@utils/utils";
import Steps from '@components/_common/steps/steps';
import LimitWords from "@common/limit-words/limit-words";
import { services } from '@stores/services/hr';
import { DelTipModal } from '../../_common/delete-tip';

export default {
	name: "hr-academy-transfer-change-modal",
	components: {
		'i-modal': Modal,
		'vc-copy': Copy,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-date-picker': DatePicker,
		'i-select': Select,
		'i-option': Option,
		'oa-steps': Steps,
		'oa-limit-words': LimitWords
	},
	mixins: [
		services.passDeparture()
	],
	props: {
		info: Object,
		action: String
	},
	data() {
		return {
			visible: false,
			formData: {},
			rule: {
				// train_pass_remarks: [{ required: true, message: "请输入备注", trigger: "blur" }],
				train_pass_time: [{ required: true, message: "请选择培训淘汰时间", type: 'object', trigger: "change" }],
				train_unachieve_remarks: [{ required: true, message: "请输入未达标备注", trigger: "blur" }],
				pass_remarks_type: [{ required: true, message: "请选择淘汰原因", pattern: /.+/, trigger: "change" }],
			}
		};
	},
	computed: {
		title() {
			switch (this.action) {
				case 'complete':
					return '培训完成';
				case 'eliminate':
					return '培训淘汰';
				case 'not-reach':
					return '培训未达标';
				case 'recover':
					return '恢复';
				default:
					return '';
			}
		}
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */
			// 培训完成
			if (this.action === 'complete') {
				this.$request({
					url: '_HR_ACADEMY_TRANSFER_CHANGE_STATUS_GET',
					type: "GET",
					param: {
						applicant_id: this.info.applicant_id,
						train_status: 4
					},
					loading: false
				}).then(res => {
					this.$emit("sure");
					this.$Message.success("操作成功");
					this.$store.commit('HR_ACADEMY_TRANSFER_TRANSFER_LIST_INIT');
				}).catch(err => {
					this.$Message.warning(err.msg);
					this.$refs.modal.buttonLoading = false;
				});
			} else if (this.action === 'eliminate') { // 培训淘汰
				this.$refs['form'].validateAndScroll(valid => {
					if (valid) {
						this.$refs.modal.buttonLoading = false;
						this.$request({
							url: '_HR_ACADEMY_TRANSFER_CHANGE_STATUS_GET',
							type: "GET",
							param: {
								applicant_id: this.info.applicant_id,
								train_status: 6,
								pass_remarks_type: this.formData.pass_remarks_type,
								train_pass_time: formatMoment(this.formData.train_pass_time, 'YYYY-MM-DD'),
								train_pass_remarks: this.formData.train_pass_remarks
							},
							loading: false
						}).then(response => {
							this.$emit("sure");
							this.$Message.success("操作成功");
							this.$store.commit('HR_ACADEMY_TRANSFER_TRANSFER_LIST_INIT');
						}).catch(err => {
							this.$Message.error(err.msg);
						});
					} else {
						this.$refs.modal.buttonLoading = false;
						this.$Message.warning('请按照提示完善表单信息');
					}
				});

			} else if (this.action === 'not-reach') { // 培训未达标
				this.$refs['form'].validateAndScroll(valid => {
					if (valid) {
						this.$request({
							url: '_HR_ACADEMY_TRANSFER_CHANGE_STATUS_GET',
							type: "GET",
							param: {
								applicant_id: this.info.applicant_id,
								train_status: 5,
								train_unachieve_remarks: this.formData.train_unachieve_remarks
							},
							loading: false
						}).then(res => {
							this.$emit("sure");
							this.$Message.success("操作成功");
							this.$store.commit('HR_ACADEMY_TRANSFER_TRANSFER_LIST_INIT');
						}).catch(err => {
							this.$Message.warning(err.msg);
							this.$refs.modal.buttonLoading = false;
						});
					} else {
						this.$refs.modal.buttonLoading = false;
						this.$Message.warning('请按照提示完善表单信息');
					}
				});
			} else if (this.action === 'recover') {
				this.$request({
					url: '_HR_ACADEMY_TRANSFER_CHANGE_STATUS_GET',
					type: "GET",
					param: {
						applicant_id: this.info.applicant_id,
						train_status: 1
					},
					loading: false
				}).then(res => {
					this.$emit("sure");
					this.$Message.success("操作成功");
					this.$store.commit('HR_ACADEMY_TRANSFER_TRANSFER_LIST_INIT');
				}).catch(err => {
					this.$Message.warning(err.msg);
					this.$refs.modal.buttonLoading = false;
				});
			}
		},
		handleCancel() {
			this.$emit("close");
		}
	}
};
export const changePModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
.v-hr-academy-transfer-change-modal {
	._content {
		._steps {
			word-break: break-all;
		}
		._text {
			margin-left: 15px;
			margin-top: 34px;
		}
	}
}
</style>
