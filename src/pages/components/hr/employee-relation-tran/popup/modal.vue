<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		:width="data.action === 'add'||data.action === 'edit'?680:400"
		class="g-flex v-hr-employee-relation-tran-modal"
		@on-ok="handleOk"
		@on-cancel="handleCancel">

		<div slot="header" class="g-tc">
			{{ title }}
		</div>

		<div v-if="data.action === 'confirm'" class="g-fs-14">
			<div class="g-m-l-20">
				该员工{{ data.info.is_save === 0 ? '未' : '已' }}勾选“保留数据”选项，
				此次转岗，该员工所有的客户和任务都{{ data.info.is_save === 0 ? '不再' : '会' }}保留，是否确认转岗？
			</div>
			<i-form
				ref="form"
				:model="form"
				:rules="rule"
				:label-width="110"
				class="g-m-lr-20 g-m-t-20">
				<i-form-item label="实际转岗日期：" prop="transfer_time">
					<i-date-picker
						v-model="form.transfer_time"
						:options="dateOption"
						type="date"
						clearable
						transfer
						placeholder="请选择实际转岗日期"
						style="width: 220px"/>
				</i-form-item>
				<i-form-item v-if="data.info.staff_status==1" label="试用期：" prop="try_time">
					<i-select 
						v-model="form.try_time" 
						clearable 
						transfer
						placeholder="请选择试用期时长" 
						style="width: 220px"
					>
						<i-option 
							v-for="(item, index) in signTime" 
							:key="index" 
							:value="item.value"
						>
							{{ item.label }}
						</i-option>
					</i-select>
					<div class="g-c-red-mid">
						试用期内员工转岗需要重新选择试用期
					</div>
				</i-form-item>
			</i-form>
		</div>

		<div v-if="data.action === 'delete'" class="_only-text g-fs-14">
			是否确认删除?
		</div>

		<div v-if="data.action === 'add'||data.action === 'edit'" class="_content">
			<i-form
				ref="addForm"
				:model="addForm"
				:rules="addRule"
				:label-width="180">
				<i-form-item label="员工姓名：" prop="staff_id">
					<i-select
						ref="staff"
						:value="addForm.staff_id"
						:remote-method="loadStaff"
						:loading="staffLoading"
						:disabled="data.action === 'edit'"
						style="width: 300px;"
						filterable
						remote
						clearable
						label-in-value
						class="g-m-r-10"

						placeholder="请输入员工姓名/手机号"
						@on-change="handleStaffChange"
						@on-query-change="handleQueryChange"
					>
						<i-option
							v-for="(item, index) in staffData"
							:key="index"
							:value="item.value"
						>{{ item.label }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="转岗前：">
					<div v-if="addForm.staff_id">
						<div>{{ addForm.before_depart ? addForm.before_depart : '--' }}</div>
						<div>{{ addForm.before_position ? addForm.before_position : '--' }}</div>
						<div>{{ addForm.before_role ? addForm.before_role : '--' }}</div>
					</div>
					<span v-else>--</span>
				</i-form-item>

				<i-form-item label="转岗后：" prop="afterTran">
					<i-cascader
						:data="departAll"
						v-model="addForm.afterTran.after_depart"
						:change-on-select="true"
						placeholder="请选择转岗后部门"
						trigger="click"
						clearable
						style="width: 300px;marginBottom: 20px;"
						@on-change="handleChange"/>

					<i-select
						v-model="addForm.afterTran.after_position"
						clearable
						filterable
						placeholder="请选择转岗后职位"
						style="width: 300px;marginBottom: 20px;">
						<i-option
							v-for="item in positionList"
							:key="item.value"
							:value="item.value">
							{{ item.label }}
						</i-option>
					</i-select>

					<i-input
						v-if="disabled"
						:value="data.action === 'edit' ? detail.after_role_name : disabledName"
						disabled
						style="width: 300px;marginBottom: 10px;" />

					<i-select
						v-else
						v-model="addForm.afterTran.after_role"
						:remote-method="handleSelectRole"
						:loading="isLoading"
						:multiple="false"
						clearable
						filterable
						remote
						style="width: 300px;marginBottom: 10px;"
						placeholder="请输入转岗后角色(选填)"
					>
						<i-option
							v-for="(role, index) in roleList"
							:value="role.role_id"
							:key="index"
						>{{ role.role_name }}</i-option>
					</i-select>

					<div class="g-flex g-fd-c">
						<i-checkbox v-model="addForm.afterTran.is_leader">拥有管理权限</i-checkbox>
						<i-checkbox v-model="addForm.afterTran.is_inherit" >继承兼部门、兼角色</i-checkbox>
						<i-checkbox v-model="addForm.afterTran.is_save">保留数据</i-checkbox>
					</div>

					<div class="g-m-r-20 g-c-red-mid g-lh-14" style="lineHeight: 18px !important;width:300px">
						不勾选保留数据员工目前所有的客户都会归属到其上级，如果在事业部内部转岗（包括分公司之间）必须点击保留数据。
					</div>
				</i-form-item>
				<i-form-item
					label="底薪规则："
					prop="basic_salary_id"
				>
					<i-select
						v-model="addForm.afterTran.basic_salary_id"
						clearable
						style="width:300px"
						placeholder="请选择转岗后底薪制度">
						<i-option
							v-for="(item, index) in baseSalaryList"
							:key="index"
							:value="item.basic_salary_id"
						>
							{{ item.name }}
						</i-option>
					</i-select>
				</i-form-item>
				<i-form-item
					label="提成规则："
					prop="rate_case_id"
				>
					<i-select
						v-model="addForm.afterTran.rate_case_id"
						clearable
						style="width:300px"
						placeholder="请选择转岗后提成制度"
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
				<i-form-item label="部门提成：">
					<i-select
						v-model="addForm.afterTran.t_rate_case_id"
						:disabled="!addForm.afterTran.is_leader"
						clearable
						style="width:300px"
						placeholder="请选择转岗后提成制度"
					>
						<i-option
							v-for="(item, index) in tRateCaseList"
							:key="index"
							:value="item.t_rate_case_id"
						>
							{{ item.name }}
						</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="预计转岗时间：" prop="predict_time">
					<i-date-picker
						v-model="addForm.predict_time"
						type="date"
						clearable
						placeholder="请选择预计转岗时间"
						style="width: 300px;"/>
				</i-form-item>
			</i-form>
		</div>
	</i-modal>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import { CreatePortal, Copy } from "wya-vc";
import { formatMoment } from "@utils/utils";
import { services, staffByNameOrPhone, createSearch } from '@stores/services/hr';
import { Modal, Form, FormItem, Input, Select, Option, DatePicker,
		 Checkbox, Cascader } from "iview";

export default {
	name: "hr-employee-relation-tran-modal",
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
		"vc-copy": Copy
	},
	mixins: [
		services.departAll(),
		services.departPosition(),
		// staffByNameOrPhone
		createSearch({ key: 'staff' })
	],
	props: {
		data: Object,
	},
	data() {
		const validateRateCaseId = (rule, value, callback) => {
			if (this.addForm.afterTran.basic_salary_id === '') {
				callback(new Error('提成规则必填'));
			} else {
				callback();
			}
		};
		const validateBasicSalaryId = (rule, value, callback) => {
			if (this.addForm.afterTran.basic_salary_id === '') {
				callback(new Error('底薪规则必填'));
			} else {
				callback();
			}
		};
		return {
			visible: false,
			title: '',
			roleList: [],
			isLoading: false,
			form: {},
			baseSalaryList: [],
			rateCaseList: [],
			tRateCaseList: [],
			staff: '',
			disabled: false,
			detail: {},
			disabledName: '',
			disabledId: '',
			signTime: [],
			rule: {
				transfer_time: [{ required: true, type: 'object', message: "请选择实际转岗日期", trigger: "change" }],
				try_time: [{
					required: true,
					type: "number",
					message: "试用期时长必选",
					trigger: "change"
				}]
			},
			dateOption: {
				disabledDate(date) {
					return date && date.valueOf() > Date.now();
				}
			},
			addForm: {
				staff_id: '',
				afterTran: {
					after_depart: [],
					is_leader: false,
					is_inherit: false,
					is_save: false,
					basic_salary_id: '',
					rate_case_id: '',
					t_rate_case_id: '',
				},
				predict_time: '',
			},
			positionList: [],
			addRule: {
				afterTran: {
					type: 'object',
					trigger: 'change',
					required: true,
					fields: {
						after_depart: [{ required: true, message: "转岗后内容不能为空", pattern: /.+/, type: 'array', trigger: "change", }],
						after_position: [{ required: true, message: "转岗后内容不能为空", pattern: /.+/, trigger: "change" }],
						// after_role: [{ required: true, message: "转岗后角色不能为空", pattern: /.+/, trigger: "change" }],
						is_leader: [{ required: true, message: "请勾选是否管理", pattern: /.+/, trigger: "change" }],
						is_inherit: [{ required: true, message: "请勾选是否继承兼部门", pattern: /.+/, trigger: "change" }],
						is_save: [{ required: true, message: "请勾选是否保留数据", pattern: /.+/, trigger: "change" }],
					}
				},
				basic_salary_id: [{ required: true, validator: validateBasicSalaryId, pattern: /.+/, trigger: "change" }],
				rate_case_id: [{ required: true, validator: validateRateCaseId, pattern: /.+/, trigger: "change" }],
				t_rate_case_id: [{ required: true, message: '团队提成不能为空', pattern: /.+/, trigger: 'change' }],
				staff_id: [{ required: true, message: '员工姓名不能为空', pattern: /.+/, trigger: 'change' }],
				predict_time: [{ required: true, message: '预计转岗时间不能为空', type: 'object', trigger: 'change' }],
			},
		};
	},
	computed: {

	},
	mounted() {
		this.visible = true;
		switch (this.data.action) {
			case 'add':
				this.title = "新增转岗";
				break;
			case 'confirm':
				this.title = "转岗确认";
				break;
			case 'delete':
				this.title = "删除";
				break;
			case 'edit':
				this.title = "转岗编辑";
				this.loadRelationDetail();
				break;
			default:
				break;
		}
		this.loadTryTime();
	},
	methods: {
		// 编辑是请求
		loadRelationDetail() {
			this.$request({
				url: '_HR_EMPLOYEE_RELATION_TRAN_DETAIL_GET',
				type: 'GET',
				param: {
					transfer_post_id: this.data.info.transfer_post_id
				},
				loading: false
			}).then((res) => {
				this.detail = res.data;
				this.addForm.staff_id = res.data.staff_id;
				this.staff = res.data.staff_name;
				this.addForm.afterTran.is_leader = res.data.is_leader === 1;
				this.addForm.afterTran.is_inherit = res.data.is_inherit === 1;
				this.addForm.afterTran.is_save = res.data.is_save === 1;
				this.addForm.before_depart = res.data.before_depart;
				this.addForm.before_position = res.data.before_position_name;
				this.addForm.before_role = res.data.before_role_name;
				this.addForm.afterTran.after_depart = res.data.after_depart;
				this.addForm.afterTran.after_position = res.data.after_position;
				this.addForm.predict_time = formatMoment(res.data.predict_time);
				this.handleChange(res.data.after_depart);
				this.handleSelectRole(res.data.after_role_name);
				this.addForm.afterTran.after_role = res.data.after_role;
				this.addForm.afterTran.basic_salary_id = res.data.basic_salary_id;
				this.addForm.afterTran.rate_case_id = res.data.rate_case_id;
				this.addForm.afterTran.t_rate_case_id = res.data.t_rate_case_id;

				this.disabled = res.data.is_auth === 0;
				this.staffData = [{
					label: res.data.staff_name,
					value: res.data.staff_id
				}];
			}).catch((error) => {});

		},
		// 加载底薪下拉列表
		loadBasicRateList() {
			if (this.addForm.staff_id && this.addForm.afterTran.after_depart.length != 0) {
				this.$request({
					url: '_HR_EMPLOYEE_RELATION_TRAN_BASIC_RATE_GET',
					type: 'GET',
					param: {
						staff_id: this.addForm.staff_id,
						depart_id: this.addForm.afterTran.after_depart
					},
					loading: false
				}).then((res) => {
					this.baseSalaryList = res.data.basic_salary;
					this.rateCaseList = res.data.rate_case;
					this.tRateCaseList = res.data.t_rate_case;
					// this.addForm.afterTran.basic_salary_id = this.baseSalaryList.filter(item => item.selected === 1)[0].basic_salary_id;
					// this.addForm.afterTran.rate_case_id = this.rateCaseList.filter(item => item.selected === 1)[0].rate_case_id;
					// this.addForm.afterTran.t_rate_case_id = this.tRateCaseList.filter(item => item.selected === 1)[0].t_rate_case_id;

				}).catch((error) => {});
			}
		},
		// 选中部门发生变化时
		handleChange(value, selected) {
			if (this.addForm.afterTran.after_depart.length && value.length) {
				if (this.addForm.afterTran.after_depart[0] !== value[0]) {
					this.addForm.afterTran.after_role = '';
				}
			}
			this.addForm.afterTran.after_depart = value;
			// 职位下拉框数组
			if (value.length === 0) {
				this.addForm.afterTran.after_position = '';
				this.addForm.afterTran.basic_salary_id = '';
				this.addForm.afterTran.rate_case_id = '';
				this.addForm.afterTran.t_rate_case_id = '';
				this.addForm.afterTran.after_role = '';
				this.positionList = [];
				this.baseSalaryList = [];
				this.rateCaseList = [];
				this.tRateCaseList = [];
				this.roleList = [];
			} else {
				this.addForm.afterTran.after_depart = value;
				this.departPosition.forEach((item, index) => {
					item.value === value[0] ? this.positionList = this.departPosition[index].children : '';
				});
				this.loadBasicRateList();
				this.handleSelectRole();
			}
		},
		// 员工
		handleStaffChange(obj) {
			// 角色相关逻辑
			this.disabled = false;
			if (obj && Object.keys(obj).length) {
				this.addForm.staff_id = obj.value;
				this.addForm.staff_name = obj.label;
				this.loadBasicRateList();
				// 角色相关逻辑
				let cur = this.staffData.filter(it => it.staff_id === obj.value)[0];
				this.disabled = cur.is_auth === 0;
				if (this.disabled) {
					this.disabledId = cur.role_id;
					this.disabledName = cur.before_role;
				}

				if (this.staffData && Array.isArray(this.staffData) && this.staffData.length) {
					let sed = this.staffData.filter(item => item.value === obj.value)[0];
					this.addForm.before_depart = sed.before_depart;
					this.addForm.before_position = sed.before_position;
					this.addForm.before_role = sed.before_role;
				}
			} else {
				this.addForm.staff_id = '';
				this.addForm.staff_name = '';
				// 转岗前信息根据所选员工变化
				this.addForm.before_depart = '';
				this.addForm.before_position = '';
				this.addForm.before_role = '';
				// 转岗后角色根据所选员工变化
				this.addForm.afterTran.basic_salary_id = '';
				this.addForm.afterTran.rate_case_id = '';
				this.addForm.afterTran.t_rate_case_id = '';
				this.tRateCaseList = [];
				this.baseSalaryList = [];
				this.rateCaseList = [];
				this.disabledId = '';
				this.disabledName = '';
			}

		},
		handleQueryChange(query = '') {
			let targetQuery = this.addForm.staff_name || '';
			if (targetQuery.length > query.length) {
				this.$refs.staff.clearSingleSelect();
			}
		},
		// 获取角色列表
		handleSelectRole(query) {
			let id = this.addForm.afterTran.after_depart;
			this.$request({
				url: API_ROOT._HR_ROLE_DATA_GET,
				type: "GET",
				param: {
					role_name: query,
					first_depart_id: id.length ? id.slice(0, 1) : '',
					is_level: 1
				}
			}).then(res => {
				this.roleList = res.data;
			}).catch((error) => {
				this.roleList = [];
			});
		},
		loadTryTime() {
			this.$request({
				url: API_ROOT._HR_STAFF_PROBATION_SELECT_GET,
				type: "GET",
				param: {
					type: 1
				},
				loading: false
			}).then(res => {
				this.signTime = res.data;
			}).catch(err => {});
		},
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */
			// this.visible = false;

			if (this.data.action === 'add' || this.data.action === 'edit') { // 新增转岗
				this.$refs['addForm'].validateAndScroll(valid => {
					if (valid) {
						let param = {
							...this.addForm.afterTran,
							staff_id: this.addForm.staff_id,
							after_depart: this.addForm.afterTran.after_depart.length
								? this.addForm.afterTran.after_depart : '',
							after_role: this.disabled ? this.detail.after_role || this.disabledId : this.addForm.afterTran.after_role,
							is_leader: this.addForm.afterTran.is_leader ? 1 : 0,
							is_inherit: this.addForm.afterTran.is_inherit ? 1 : 0,
							is_save: this.addForm.afterTran.is_save ? 1 : 0,
							predict_time: formatMoment(this.addForm.predict_time)
						};
						if (this.data.action === 'edit') {
							param.transfer_post_id = this.data.info.transfer_post_id;
						}
						this.$request({
							url: API_ROOT._HR_EMPLOYEE_RELATION_TRAN_ADD_POST,
							type: "POST",
							param,
							loading: false
						}).then(res => {
							this.$emit("sure");
						}).catch(err => {
							this.$refs.modal.buttonLoading = false;
							this.$Message.error(err.msg);
						});

					} else {
						this.$refs.modal.buttonLoading = false;
						this.$Message.warning('请按照提示信息完善表单');
					}
				});

			} else if (this.data.action === 'confirm') {	// 转岗确认弹框

				this.$refs['form'].validate(valid => {
					if (valid) {
						this.$request({
							url: API_ROOT._HR_EMPLOYEE_RELATION_TRAN_CONFIRM_GET,
							type: "GET",
							param: {
								staff_id: this.data.info.staff_id,
								transfer_time: formatMoment(this.form.transfer_time),
								try_time: this.form.try_time
							},
							loading: false
						}).then(res => {
							this.$emit("sure");
						}).catch(err => {
							this.$refs.modal.buttonLoading = false;
							this.$Message.error(err.msg);
						});
					} else {
						this.$refs.modal.buttonLoading = false;
						this.$Message.warning('请按照提示完善表单信息');
					}
				});

			} else if (this.data.action === 'delete') {	// 删除

				this.$request({
					url: API_ROOT._HR_EMPLOYEE_RELATION_TRAN_DELETE_GET,
					type: "GET",
					param: {
						staff_id: this.data.info.staff_id,
						transfer_post_id: this.data.info.transfer_post_id
					},
					loading: false
				}).then(res => {
					this.$emit("sure");
				}).catch(err => {
					this.$refs.modal.buttonLoading = false;
					this.$Message.error(err.msg);
				});

			}

		},
		handleCancel() {
			this.$emit("close");
		}
	}
};
export const PModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
.v-hr-employee-relation-tran-modal {
	._only-text {
		padding: 34px;
		padding-top: 44px;
		padding-bottom: 24px;
		color: #333;
	}
	._content {
		max-height: 356px;
		overflow-y: auto;
	}
}
</style>
