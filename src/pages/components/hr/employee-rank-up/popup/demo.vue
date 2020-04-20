<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="员工降职"
		class="v-hr-employee-rank-up-demo-modal"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel">

		<div class="g-fs-14 _content">

			<i-form
				ref="form"
				:model="formData"
				:rules="rule"
				:label-width="90"
				class="g-m-lr-15">
				<i-form-item label="员工姓名：" class="_form-item">
					<div>{{ data.staff_name }}</div>
				</i-form-item>
				<i-form-item label="调整部门：" prop="after_depart_id">
					<i-cascader
						:data="departList"
						v-model="formData.after_depart_id"
						:change-on-select="true"
						placeholder="请选择调整部门"
						trigger="click"
						clearable
						transfer
						style="width: 220px;"
						@on-change="handleChange"/>
				</i-form-item>
				<i-form-item label="降职职位：" prop="after_position_id">
					<i-select
						v-model="formData.after_position_id"
						clearable
						transfer
						placeholder="请选择降职职位"
						style="width: 220px;"
						@on-change="handlePositionChange">
						<i-option
							v-for="item in positionList"
							:key="item.value"
							:value="item.value">
							{{ item.label }}
						</i-option>
					</i-select>
				</i-form-item>
				<i-form-item
					v-if="data.is_auth === 1"
					label="调整角色："
					prop="after_role_id">
					<i-select
						v-model="formData.after_role_id"
						:remote-method="handleSelectRole"
						:loading="isLoading"
						:multiple="false"
						clearable
						transfer
						filterable
						remote
						style="width: 220px;"
						placeholder="请输入选择调整角色"
						@on-change="handleRoleChange"
					>
						<i-option
							v-for="(role, index) in roleList"
							:value="role.role_id"
							:key="index"
						>{{ role.role_name }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item v-else label="调整角色：">
					<div>{{ data.role_name }}</div>
				</i-form-item>
				<i-form-item label="底薪规则：" prop="after_basic_salary_id">
					<i-select
						v-model="formData.after_basic_salary_id"
						clearable
						transfer
						style="width:220px"
						placeholder="请选择底薪规则">
						<i-option
							v-for="(item, index) in baseSalaryList"
							:key="index"
							:value="item.basic_salary_id"
						>
							{{ item.name }}
						</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="提成规则：" prop="after_rate_case_id">
					<i-select
						v-model="formData.after_rate_case_id"
						clearable
						transfer
						style="width:220px"
						placeholder="请选择提成规则"
					>
						<i-option
							v-for="(item, index) in rateCaseList"
							:key="index"
							:value="item.rate_case_id"
						>
							{{ item.name }}
						</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="团队提成：" prop="t_rate_case_id" class="_form-item">
					<i-select
						v-model="formData.t_rate_case_id"
						clearable
						transfer
						style="width:220px"
						placeholder="请选择团队提成"
					>
						<i-option
							v-for="(item, index) in teamList"
							:key="index"
							:value="item.t_rate_case_id"
						>
							{{ item.name }}
						</i-option>
					</i-select>
				</i-form-item>
				<i-form-item class="_form-item">
					<div class="g-flex g-fd-c">
						<i-checkbox v-model="formData.is_charge">拥有管理权限</i-checkbox>
						<i-checkbox v-model="formData.is_extends" >继承兼部门、兼角色</i-checkbox>
					</div>
				</i-form-item>
				<i-form-item label="降职理由：" prop="remarks">
					<oa-limit-words
						v-model="formData.remarks"
						:max="200"
						placeholder="请输入降职理由"
						width="220px"/>
				</i-form-item>
			</i-form>
		</div>

	</i-modal>
</template>

<script>
import moment from 'moment';
import API_ROOT from "@stores/apis/root";
import { CreatePortal, Copy } from "wya-vc";
import { formatMoment, initTreeData } from "@utils/utils";
import { services } from '@stores/services/hr';
import orderModal from '@extends/mixins/orderModal';
import { Modal, Form, FormItem, Input, Select, Option, DatePicker,
		 Checkbox, Cascader } from "iview";
import { DelTipModal } from '../../_common/delete-tip';

export default {
	name: "hr-employee-rank-up-demo-modal",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-select": Select,
		"i-option": Option,
		"i-checkbox": Checkbox,
		"i-cascader": Cascader,
		"i-date-picker": DatePicker,
	},
	mixins: [
		services.departPosition(),
		orderModal
	],
	props: {
		data: Object,
		id: Number | String
	},
	data() {
		return {
			visible: false,
			departList: [],
			positionList: [],
			roleList: [],
			isLoading: false,
			baseSalaryList: [],
			rateCaseList: [],
			teamList: [],
			formData: {
				after_role_id: '',
				after_depart_id: [],
				after_position_id: '',
				after_basic_salary_id: '',
				after_rate_case_id: '',
				is_charge: false,
				is_extends: false,
			},
			rule: {
				after_position_id: [{ required: true, message: "请选择降职职位", pattern: /.+/, trigger: "change" }],
				// after_role_id: [{ required: true, message: "请选择调整角色", pattern: /.+/, trigger: "change" }],
				after_basic_salary_id: [{ required: true, message: "请选择底薪规则", pattern: /.+/, trigger: "change" }],
				after_rate_case_id: [{ required: true, message: "请选择提成规则", pattern: /.+/, trigger: "change" }],
				after_depart_id: [{ required: true, message: "请选择部门", type: 'array', trigger: "change" }],
				remarks: [{ required: true, message: "请输入降职理由", trigger: "change" }]
			}
		};
	},
	mounted() {
		this.visible = true;
		// 设置默认调整角色
		this.formData.after_role_id = this.data.role_id;
		this.loadBasicRateList();
		this.loadTeamList();
		this.loadDepartList();
		this.loadPositionList();
		// 获取初始角色下拉框
		this.handleSelectRole(this.data.role_name);
	},
	methods: {
		// 获取部门列表
		loadDepartList() {
			this.$request({
				url: "_HR_DEPART_ALL_GET",
				type: "GET",
				loading: false
			}).then(res => {
				if (Array.isArray(res.data)) {
					let list = res.data.filter(item => item.depart_id === this.id);
					this.departList = initTreeData(
						list,
						"depart_id",
						"depart_name"
					);
				} else {
					this.departList = [];
				}
			}).catch(error => {});
		},
		// 获取职位列表
		loadPositionList() {
			this.$request({
				url: "_HR_DEPART_POSITION_GET",
				type: "GET",
				loading: false
			}).then(res => {
				let list = res.data.filter(item => item.depart_id === this.id)[0].positions;
				this.positionList = initTreeData(
					list,
					"position_id",
					"position_name"
				);
			}).catch(error => {});
		},
		// 加载底薪、提成下拉列表
		loadBasicRateList() {
			this.$request({
				url: '_HR_EMPLOYEE_RELATION_TRAN_BASIC_RATE_GET',
				type: 'GET',
				param: {
					staff_id: this.data.staff_id,
					depart_id: this.id
				},
				loading: false
			}).then((res) => {
				this.baseSalaryList = res.data.basic_salary;
				this.rateCaseList = res.data.rate_case;
			}).catch((error) => {});
		},
		// 获取团队提成下拉数据
		loadTeamList() {
			this.$request({
				url: '_HR_STAFF_RATE_CASE_GET',
				type: 'GET',
				param: {
					depart_id: this.id,
					type: 2
				},
				loading: false
			}).then((res) => {
				this.teamList = res.data;
			}).catch((error) => {});
		},
		// 根据角色职位获取默认团队提成
		loadTeamId(role_id) {
			if (this.formData.after_position_id && this.formData.after_role_id) {
				this.$request({
					url: '_HR_EMPLOYEE_UP_TEAM_BY_POS_ROLE_GET',
					type: 'GET',
					param: {
						role_id: this.formData.after_role_id,
						position_id: this.formData.after_position_id
					},
					loading: false
				}).then((res) => {
					this.formData.t_rate_case_id = res.data.rate_case_id;
				}).catch((error) => {});
			}
		},
		handleChange(value) {
			this.formData.after_depart_id = value;
			// 职位下拉框数组
			if (value.length === 0) {
				this.formData.after_position_id = '';
				this.formData.after_basic_salary_id = '';
				this.formData.after_rate_case_id = '';
				this.formData.after_role_id = '';
				this.baseSalaryList = [];
				this.rateCaseList = [];
				this.teamList = [];
				this.positionList = [];
				this.roleList = [];
			} else {
				this.loadBasicRateList();
				this.loadTeamList();
				this.loadPositionList();
				this.handleSelectRole();
			}
		},
		// 角色变化
		handleRoleChange(value) {
			if (value) {
				this.loadTeamId();
			} else {
				this.formData.t_rate_case_id = '';
			}
		},
		// 职位变化
		handlePositionChange(val) {
			if (val) {
				this.loadTeamId();
			} else {
				this.formData.t_rate_case_id = '';
			}
		},
		// 获取角色列表
		handleSelectRole(query) {
			this.$request({
				url: '_HR_ROLE_DATA_GET',
				type: "GET",
				param: {
					role_name: query,
					first_depart_id: this.id,
					is_level: 1
				}
			}).then(res => {
				this.roleList = res.data;
			}).catch((error) => {
				this.roleList = [];
			});
		},
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */

			this.$refs.modal.buttonLoading = false;
			this.$refs['form'].validate(valid => {
				if (valid) {
					this.$request({ 	// 判断是否离开了积分学分的范围
						url: '_HR_EMPLOYEE_UP_IS_RANGE_POST',
						type: "POST",
						param: {
							record_id: this.data.record_id,
							status: 4,
							...this.formData,
							is_charge: this.formData.is_charge === false ? 0 : 1,
							is_extends: this.formData.is_extends === false ? 0 : 1,
							after_depart_id: this.formData.after_depart_id.slice(this.formData.after_depart_id.length - 1)[0],
							after_role_id: this.data.is_auth === 1 ? this.formData.after_role_id : this.data.role_id
						},
						loading: false
					}).then(res => {
						if (res.data.is_range === 0) { 	// 离开了
							DelTipModal.popup({
								title: '员工降职',
								content: res.data.range_remark
							}).then(res1 => {
								this.$request({ 	// 降职
									url: '_HR_EMPLOYEE_UP_DEMO_POST',
									type: "POST",
									param: {
										record_id: this.data.record_id,
										status: 4,
										...this.formData,
										is_charge: this.formData.is_charge === false ? 0 : 1,
										is_extends: this.formData.is_extends === false ? 0 : 1,
										after_depart_id: this.formData.after_depart_id.slice(this.formData.after_depart_id.length - 1)[0],
										after_role_id: this.data.is_auth === 1 ? this.formData.after_role_id : this.data.role_id
									},
									loading: false
								}).then(res2 => {
									this.$Message.success(res2.msg);
									this.$emit("sure");
								}).catch(err => {
									this.$Message.error(err.msg);
								});
							}).catch(err => {});
						} else { 	// 未离开
							this.$request({ 	// 降职
								url: '_HR_EMPLOYEE_UP_DEMO_POST',
								type: "POST",
								param: {
									record_id: this.data.record_id,
									status: 4,
									...this.formData,
									is_charge: this.formData.is_charge === false ? 0 : 1,
									is_extends: this.formData.is_extends === false ? 0 : 1,
									after_depart_id: this.formData.after_depart_id.slice(this.formData.after_depart_id.length - 1)[0],
									after_role_id: this.data.is_auth === 1 ? this.formData.after_role_id : this.data.role_id
								},
								loading: false
							}).then(res1 => {
								this.$Message.success(res1.msg);
								this.$emit("sure");
							}).catch(err => {
								this.$Message.error(err.msg);
							});
						}

					}).catch(err => {
						this.$Message.error(err.msg);
					});
				} else {
					this.$Message.warning('请按照提示完善表单信息');
				}
			});
		},
		handleCancel() {
			this.$emit("close");
		}
	}
};
export const demoPModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
.v-hr-employee-rank-up-demo-modal {
	._content {
		margin-top: 14px;
	}
}
</style>

<style lang="scss">
.v-hr-employee-rank-up-demo-modal {
	._form-item {
		margin-bottom: 10px !important;
	}
}
</style>
