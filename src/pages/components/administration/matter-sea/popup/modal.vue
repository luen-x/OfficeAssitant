<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		class="g-flex v-hr-employee-relation-try-modal"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel">

		<div slot="header" class="g-tc">
			{{ type === 'receive' ? '事项领取' : '事项驳回' }}
		</div>

		<div class="g-fs-14">
			<div v-if="type === 'receive'" class="g-m-l-20">
				是否确认领取该事项？
			</div>

			<i-form
				v-else
				ref="form"
				:model="form"
				:rules="rule"
				:label-width="100"
				class="g-m-lr-20 g-m-t-20">
				<i-form-item label="驳回理由：" prop="refuse_reason">
					<oa-limit-words
						v-model="form.refuse_reason"
						:max="200"
						placeholder="请输入驳回理由"
						width="220px"/>
				</i-form-item>
			</i-form>
		</div>

	</i-modal>
</template>

<script>
import moment from 'moment';
import API_ROOT from "@stores/apis/root";
import { Modal, Input, Form, FormItem } from "iview";
import { CreatePortal, Copy } from "wya-vc";
import { formatMoment } from "@utils/utils";
import orderModal from '@extends/mixins/orderModal';
import { log } from 'util';

export default {
	name: "hr-employee-relation-try-modal",
	components: {
		"i-modal": Modal,
		"vc-copy": Copy,
		"i-form": Form,
		"i-form-item": FormItem,
		'i-input': Input
	},
	mixins: [orderModal],
	props: {
		data: Object,
		type: String,
		requestFn: Function
	},
	data() {
		return {
			visible: false,
			form: {},
			rule: {
				refuse_reason: [{ required: true, message: "请输入驳回理由", trigger: "blur" }],
			}
		};
	},
	computed: {},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */
			if (this.type === 'receive') {		// 事项领取
				this.$request({
					url: API_ROOT._ADMINISTRATION_RECEIVE_EVENT_POST,
					type: "POST",
					param: {
						event_id: this.data.event_id,
						priority: this.data.priority,
						head_staff_id: this.data.head_staff_id,
						completion_rate: this.data.completion_rate,
						participant_id: this.data.participant_id
					},
					loading: false
				}).then(res => {
					this.$emit("sure");
					this.$Message.success("操作成功");
					this.$store.commit('ADMINISTRATION_MATTER_SEA_LIST_INIT');

					if (this.requestFn) {
						this.requestFn({
							cb: () => this.$emit('destory')
						});
					}
				}).catch(err => {
					this.$Message.warning(err.msg);
					this.$refs.modal.buttonLoading = false;
				});
			} else {
				this.$refs['form'].validate(valid => {
					if (valid) {	// 事项驳回
						this.$request({
							url: API_ROOT._ADMINISTRATION_AUDIT_EVENT_POST,
							type: "POST",
							param: {
								...this.form,
								event_id: this.data.event_id,
								status: 0
							},
							loading: false
						}).then(res => {
							this.$emit("sure");
							this.$Message.success("操作成功");
							this.$store.commit('ADMINISTRATION_MATTER_SEA_LIST_INIT');

							if (this.requestFn) {
								this.requestFn({
									cb: () => this.$emit('destory')
								});
							}
						}).catch(err => {
							this.$Message.warning(err.msg);
							this.$refs.modal.buttonLoading = false;
						});
					} else {
						this.$refs.modal.buttonLoading = false;
						this.$Message.warning('请按照提示完善表单信息');
					}
				});
			}
		},
		handleCancel() {
			this.$emit("destory");
		}
	}
};
export const PModal = CreatePortal({}, module.exports.default);
</script>
