<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		class="g-flex"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel">

		<div slot="header" class="g-tc">
			{{ title }}
		</div>

		<div class="g-flex g-fd-c g-ai-c g-m-t-10">
			<i-form
				ref="form"
				:model="form"
				:rules="rule"
				:label-width="84">

				<i-form-item
					v-if="data.action === 'add'"
					label="补贴人："
					prop="staff_id">
					<i-select
						ref="staff"
						v-model="form.staff_id"
						:remote-method="handleSelectSubsidy"
						:loading="staffLoading"
						style="width: 220px;"
						filterable
						remote
						clearable
						transfer
						label-in-value
						placeholder="请输入员工姓名/手机号"
						@on-change="handleStaffChange"
						@on-query-change="handleQueryChange"
					>
						<i-option
							v-for="(item, index) in staffData"
							:key="index"
							:value="item.staff_id"
						>{{ item.staff_name }}</i-option>
					</i-select>
				</i-form-item>

				<i-form-item label="在杭住址：" prop="address">
					<i-input
						v-model="form.address"
						:maxlength="50"
						placeholder="请输入在杭地址"
						clearable
						style="width: 220px"/>
				</i-form-item>

				<i-form-item label="补贴金额：" prop="traffic_subsidy">
					<i-input
						v-model="form.traffic_subsidy"
						:maxlength="7"
						placeholder="请输入补贴金额"
						number
						style="width: 220px;"
						clearable/>
				</i-form-item>

				<i-form-item label="生效月份：" prop="start_month">
					<i-date-picker
						v-model="form.start_month"
						type="month"
						style="width: 220px;"
						placeholder="请选择生效月份"
					/>
				</i-form-item>

				<i-form-item label="有效期：" prop="effect_month">
					<i-input-number
						v-model="form.effect_month"
						:max="30"
						:min="1"
						style="width: 220px"
						placeholder="请输入有效期"/>
				</i-form-item>

			</i-form>
		</div>
	</i-modal>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import { CreatePortal, Copy } from "wya-vc";
import { dataValidity, formatMoment } from '@utils/utils';
import { services, staffByMutiTerm } from '@stores/services/hr';
import { DatePicker, Input, InputNumber, Modal, Select, Option, Poptip, Form, FormItem } from "iview";

export default {
	name: "hr-salary-subsidy-traffic",
	components: {
		"i-input": Input,
		"i-modal": Modal,
		"i-select": Select,
		"i-option": Option,
		"i-poptip": Poptip,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-date-picker": DatePicker,
		"i-input-number": InputNumber,
		"vc-copy": Copy
	},
	mixins: [
		// staffByMutiTerm
	],
	props: {
		data: Object
	},
	data() {
		let validateSubsidy = (rule, value, callback) => {
			if (value > 10000000) {
				callback(new Error('补贴金额过大！'));
			} else if (value <= 0) {
				callback(new Error("请输入正数！"));
			} else {
				callback();
			}
		};
		return {
			visible: false,
			title: '',
			staffLoading: false,
			staffData: [],
			form: {
				effect_month: 3
			},
			rule: {
				staff_id: [{ required: true, message: "请输入员工姓名", pattern: /.+/, trigger: "change" }],
				address: [
					{ required: true, message: "请输入住址", trigger: "blur" }
					// { type: 'validName', validator: dataValidity, trigger: "blur" }
				],
				traffic_subsidy: [
					{ required: true, message: "请输入补贴金额", pattern: /.+/, trigger: "blur" },
					{ type: 'number',
						message: '金额请输入数字格式',
						trigger: 'blur',
						transform(value) {
							return Number(value);
						}
					},
					{ validator: validateSubsidy, trigger: "blur" }
				],
				start_month: [{ required: true, message: "请选择生效月份", type: 'object', trigger: "change" }],
				effect_month: [{ required: true, message: "请选择有效期", pattern: /.+/, trigger: "change" }],

			}
		};
	},
	computed: {},
	mounted() {
		this.visible = true;
		if (this.data.action === 'adjust') {
			this.form = {
				...this.data.selected,
				effect_month: this.data.selected.effect_month_num
			};
			// this.form.traffic_subsidy = this.data.selected.traffic_subsidy;
		}
		this.title = this.data.action === 'adjust' ? '补贴调整' : '新增补贴';
	},
	methods: {
		// 获取补贴人列表
		handleSelectSubsidy(query = '') {
			this.$request({
				url: API_ROOT._HR_SUBSIDY_MEMBER_GET,
				type: "GET",
				param: {
					search: query
				}
			}).then(res => {
				this.staffData = res.data;
			});
		},
		handleQueryChange(query = '') {
			let targetQuery = this.form.staff_name || '';
			if (targetQuery.length > query.length) {
				this.$refs.staff.clearSingleSelect();
			}
		},
		// 补贴人
		handleStaffChange(obj) {
			this.form.address = '';
			this.form.staff_id = obj && obj.value ? obj.value : '';
			this.form.staff_name = obj && obj.label ? obj.label : '';
			if (this.staffData.length) {
				this.form.address = this.staffData.filter(item => item.staff_id === obj.value)[0].now_address;
			}
		},
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */
			// this.visible = false;
			this.$refs['form'].validate(valid => {
				if (valid) {

					if (this.data.action === 'adjust') {
						this.$request({
							url: API_ROOT['_HR_SALARY_SUBSIDY_TRAFFIC_ADD_GET'],
							type: 'GET',
							param: {
								...this.form,
								staff_id: this.data.selected.staff_id,
								start_month: formatMoment(this.form.start_month)
							},
							loading: false
						}).then((res) => {
							this.$emit("sure");
							this.$Message.success('操作成功');
							this.$store.commit('HR_SALARY_SUBSIDY_TRAFFIC_LIST_INIT');
							this.$refs.modal.buttonLoading = false;
						}).catch((error) => {
							this.$refs.modal.buttonLoading = false;
							this.$Message.error(error.msg);
						});
					} else {
						this.$request({
							url: API_ROOT['_HR_SALARY_SUBSIDY_TRAFFIC_ADD_GET'],
							type: 'GET',
							param: {
								...this.form,
								start_month: formatMoment(this.form.start_month)
							},
							loading: false
						}).then((res) => {
							this.$emit("sure");
							this.$Message.success('操作成功');
							this.$store.commit('HR_SALARY_SUBSIDY_TRAFFIC_LIST_INIT');
							this.$refs.modal.buttonLoading = false;
						}).catch((error) => {
							this.$refs.modal.buttonLoading = false;
							this.$Message.error(error.msg);
						});
					}
				} else {
					this.$refs.modal.buttonLoading = false;
					this.$Message.warning('请按照提示完善表单信息');
				}
			});

		},
		handleCancel() {
			this.$emit("close");
		}
	}
};
export const PModal = CreatePortal({}, module.exports.default);
</script>
