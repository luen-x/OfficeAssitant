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
			{{ title }}
		</div>

		<div class="g-fs-14">
			<div v-if="type === 'pass' || type === 'complete'" class="g-m-l-20">
				{{ type == 'pass' ? '确认通过该事项申请？' : '确认要完成吗？确认后就无法撤销哦' }}
			</div>

			<i-form
				v-if="type === 'reject' || type === 'assign'"
				ref="form"
				:model="form"
				:rules="rule"
				:label-width="100"
				class="g-m-lr-20 g-m-t-20">
				<i-form-item
					v-if="type === 'reject'"
					label="驳回理由："
					prop="refuse_reason">
					<oa-limit-words
						v-model="form.refuse_reason"
						:max="200"
						placeholder="请输入驳回理由"
						width="220px"/>
				</i-form-item>

				<i-form-item
					v-if="type === 'assign'"
					label="负责部门："
					prop="responsible_depart_id">
					<i-cascader
						:data="assignDepart"
						v-model="form.responsible_depart_id"
						:change-on-select="true"
						placeholder="请选择负责部门"
						trigger="click"
						clearable
						transfer
						style="width: 220px;"
						@on-change="handleDepartChange" />
				</i-form-item>

				<i-form-item
					v-if="type === 'assign'"
					label="负责人："
					prop="staff_id">
					<i-select
						v-model="form.staff_id"
						style="width: 220px;"
						filterable
						clearable
						transfer
						label-in-value
						placeholder="请选择负责人"
					>
						<i-option
							v-for="(item, index) in staffData"
							:key="index"
							:value="item.staff_id"
						>{{ item.staff_name }}</i-option>
					</i-select>
				</i-form-item>

				<i-form-item
					v-if="type === 'assign'"
					label="处理说明："
					prop="dispose_reason">
					<oa-limit-words
						v-model="form.dispose_reason"
						:max="200"
						placeholder="请输入处理说明"
						width="220px"/>
				</i-form-item>
			</i-form>

		</div>

	</i-modal>
</template>

<script>
import moment from 'moment';
import API_ROOT from "@stores/apis/root";
import { Modal, Input, Form, FormItem, Select, Option, Cascader } from "iview";
import { CreatePortal, Copy } from "wya-vc";
import { formatMoment } from "@utils/utils";
import orderModal from '@extends/mixins/orderModal';
import { services, searchPKStaff } from '@stores/services/administration';

export default {
	name: "hr-employee-relation-try-modal",
	components: {
		"i-modal": Modal,
		"vc-copy": Copy,
		"i-form": Form,
		"i-form-item": FormItem,
		'i-input': Input,
		"i-select": Select,
		"i-option": Option,
		"i-cascader": Cascader,
	},
	mixins: [
		orderModal,
		services.assignDepart(),
		searchPKStaff({ key: 'staff' })
	],
	props: {
		info: Object,
		type: String,
		requestFn: Function
	},
	data() {
		return {
			visible: false,
			title: '',
			staff: '',
			form: {},
			staffData: [],
			rule: {
				refuse_reason: [{ required: true, message: "请输入驳回理由", trigger: "blur" }],
				responsible_depart_id: [{ required: true, message: "请选择负责部门", pattern: /.+/, trigger: "change" }],
				staff_id: [{ required: true, message: "请选择负责人", pattern: /.+/, trigger: "change" }],
				dispose_reason: [{ required: true, message: "请输入处理说明", trigger: "blur" }],
			}
		};
	},
	computed: {},
	mounted() {
		this.visible = true;
		switch (this.type) {
			case 'pass':
				this.title = '通过提醒';
				break;
			case 'reject':
				this.title = '驳回申请';
				break;
			case 'assign':
				this.title = '事项指派';
				break;
			case 'complete':
				this.title = '完成提醒';
				break;
			default:
				this.title = '通过申请';
				break;
		}
	},
	methods: {
		// 负责部门变化
		handleDepartChange(v) {
			if (v) {
				this.$request({
					url: '_ADMINISTRATION_ASSIGN_STAFF_GET',
					type: "GET",
					param: {
						depart_id: v
					},
					loading: false
				}).then(res => {
					this.staffData = res.data;
				}).catch(err => {
				});
			}
			if (v === undefined || (v && v.length === 0)) {
				this.staffData = [];
				this.form.staff_id = '';
			}
		},
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */
			let url = '';
			switch (this.type) {
				case 'reject':
				case 'pass':
					url = "_ADMINISTRATION_AUDIT_EVENT_POST";
					break;
				case 'complete':
					url = "_ADMINISTRATION_COMPLETE_EVENT_POST";
					break;
				case 'assign':
					url = "_ADMINISTRATION_ASSIGN_EVENT_POST";
					break;
				default:
					break;
			}
			if (this.type === 'reject' || this.type === 'assign') {
				this.$refs['form'].validate(valid => {
					if (valid) {	// 事项驳回
						this.$request({
							url: API_ROOT[`${url}`],
							type: "GET",
							param: {
								...this.form,
								event_id: this.info.event_id,
								status: this.type === 'reject' ? 0 : null,
								responsible_staff_id: this.type !== 'reject' ? this.form.staff_id : null
							},
							loading: false
						}).then(res => {
							this.$emit("sure");
							this.$Message.success("操作成功");
							this.$store.commit('ADMINISTRATION_MATTER_MY_LIST_INIT');

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
			} else if (this.type === 'pass') {	// 事项通过
				this.$request({
					url: API_ROOT[`${url}`],
					type: "POST",
					param: {
						event_id: this.info.event_id,
						status: this.type === 'pass' ? 1 : null,
						priority: this.info.priority,
						head_staff_id: this.info.head_staff_id,
						participant_id: this.info.participant_id,
						completion_rate: this.info.completion_rate
					},
					loading: false
				}).then(res => {
					this.$emit("sure");
					this.$Message.success(`${this.type === 'pass' ? '操作成功' : '事项完成，赞一个'}`);
					this.$store.commit('ADMINISTRATION_MATTER_MY_LIST_INIT');

					if (this.requestFn) {
						this.requestFn({
							cb: () => this.$emit('destory')
						});
					}
				}).catch(err => {
					this.$Message.error(err.msg);
					this.$refs.modal.buttonLoading = false;
				});
			} else if (this.type === 'complete') {
				this.requestFn({
					data: {
						event_id: this.info.event_id
					},
					cb: () => this.$emit('destory')
				});
			}
		},
		handleCancel() {
			this.$emit("destory");
		}
	}
};
export const myModal = CreatePortal({}, module.exports.default);
</script>
