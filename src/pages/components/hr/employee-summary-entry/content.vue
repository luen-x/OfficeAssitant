<template>
	<!-- eslint-disable -->
	<div class="v-hr-summary-entry g-m-t-20">
		<div class="g-flex g-jc-c">
			<i-form 
				ref="form" 
				:model="formValidate" 
				:rules="ruleValidate" 
				:label-width="110"
				class="_form g-flex-ac g-jc-sb g-fw-w"
			>
				<i-form-item style='width:50%' label="姓名:">
					<div style="width: 300px">{{ formValidate.staff_name }}</div>
				</i-form-item>
					
				<i-form-item style='width:50%' label="手机号码:">
					<div style="width: 300px">{{ formValidate.mobile }}</div>
				</i-form-item>
				<i-form-item style='width:50%' label="入职时间:" prop="create_time">
					<i-date-picker 
						v-model="formValidate.create_time" 
						format="yyyy-MM-dd" 
						style="width: 300px" 
						type="date" 
						:options="pickerOptionsStart" 
						placeholder="请选择入职时间" />
				</i-form-item>
				<i-form-item style='width:50%' label="部门:" prop="depart_id">
					<i-cascader 
						v-model="formValidate.depart_id" 
						:data="departAll" 
						:change-on-select="true" 
						style="width: 300px; display: inline-block" 
						clearable 
						transfer 
						trigger="click" 
						placeholder="请选择部门" 
						@on-change="handleChange" />
				</i-form-item>
				<i-form-item style='width:50%' label="是否管理:" prop="is_charge">
					<i-radio-group v-model="formValidate.is_charge" style="width: 300px">
						<i-radio label="0">否</i-radio>
						<i-radio label="1">是</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item style='width:50%' label="职位:" prop="position_id">
					<i-select 
						v-model="formValidate.position_id" 
						clearable 
						filterable
						placeholder="请选择职位" 
						style="width: 300px">
						<i-option 
							v-for="(item, index) in positionArr" 
							:key="index" 
							:value="item.position_id"
						>{{ item.position_name }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item style='width:50%' label="角色:" >
					<i-select 
						ref="staff"
						v-model="formValidate.role_id" 
						:remote-method="handleSelectRole" 
						:loading="isLoading" 
						:multiple="false" 
						filterable 
						remote 
						clearable
						transfer
						label-in-value
						style="width: 300px"
						placeholder="请输入角色关键字搜索"
						@on-change="handleStaffChange"
						@on-query-change="handleQueryChange"
						>
						<i-option 
							v-for="role in allRoles" 
							:value="role.role_id" 
							:key="role.role_id">{{ role.role_name }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item style='width:50%' >
					<div slot="label">
						<span>兼部门</span>
						<oa-explain 
							style="transform: translateY(1px);"
							title="在主部门担任工作且从属关系属于主部门，开启兼部门配置后就有权限查看该兼部门的员工数据促进自己在兼部门的工作"
							content="例如，员工A的主部门是杭一一部的经理，开启兼部门后，其在杭二一部兼部门，则该员工A的从属部门还是杭一一部。同时根据兼部门给予的兼角色给予权限，查看杭二一部员工的数据，协助自己在兼部门的工作。" 
						/>
						:
					</div>
					<span 
						style="width: 300px" 
						class="g-operation" 
						@click="handleDepartChange">已选{{ formValidate.extra_depart.length }}个兼部门</span>
					
				</i-form-item>
				<i-form-item style='width:50%' label="员工状态:" prop="status">
					<i-radio-group v-model="formValidate.status" style="width: 300px">
						<i-radio label="1">试用期员工</i-radio>
						<i-radio label="2">正式员工</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item style='width:50%' label="兼角色:">
					<div 
						style="width: 300px" 
						class="g-operation"
						@click="handleExtraRole">已选{{ formValidate.extra_role.length }}个兼角色</div>
				</i-form-item>
				<i-form-item style='width:50%' label="试用期时长:" prop="try_time" v-if="formValidate.status==1">
					<i-select 
						v-model="formValidate.try_time" 
						clearable 
						placeholder="请选择试用期时长" 
						style="width: 300px"
					>
						<i-option 
							v-for="(item, index) in signTime" 
							:key="index" 
							:value="item.value"
						>
							{{ item.label }}
						</i-option>
					</i-select>
				</i-form-item>
				<i-form-item style='width:50%' label="合同签订时间:" prop="sign_time">
					<i-radio-group v-model="formValidate.sign_time" style="width: 300px">
						<i-radio label="1">现在就签</i-radio>
						<i-radio label="2">一个月</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item style='width:50%' label="底薪设置:" prop="basic_salary_id">
					<i-select 
						v-model="formValidate.basic_salary_id" 
						clearable 
						placeholder="请选择底薪规则" 
						style="width: 300px">
						<i-option 
							v-for="(item, index) in baseSalary" 
							:key="index" 
							:value="item.basic_salary_id"
						>{{ item.name }}</i-option>
					</i-select>
				</i-form-item>
				
				<i-form-item style='width:50%' label="提成设置:" prop="rate_case_id" >
					<i-select 
						v-model="formValidate.rate_case_id" 
						style="width: 300px" 
						clearable 
						placeholder="请选择提成规则">
						<i-option 
							v-for="(item, index) in rateCase" 
							:key="index" 
							:value="item.rate_case_id"
						>{{ item.name }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item style='width:50%' label="团队提成:" >
					<i-select 
						:disabled="formValidate.is_charge==0"
						v-model="formValidate.t_rate_case_id" 
						style="width: 300px" 
						clearable 
						placeholder="请选择团队提成"
					>
						<i-option 
							v-for="(item, index) in rateTreamCase" 
							:key="index" 
							:value="item.t_rate_case_id"
						>{{ item.name }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item style='width:50%' prop="seat_number">
					<div slot="label">
						<span>坐席号</span>
						<oa-explain 
						style="transform: translateY(2px);"
						content="同外线号码一同配置，由人事专人负责。详细可咨询人事该模块的负责人。"
						/>
						:
					</div>
					<i-input 
						v-model="formValidate.seat_number" 
						:maxlength="4" 
						style="width: 300px" 
						placeholder="请输入坐席号" />
				</i-form-item>
				<i-form-item style='width:50%' prop="pstn_number">
					<div slot="label">
						<span>外线号码</span>
						<oa-explain 
						style="transform: translateY(2px);"
						content="员工在OA系统中配置的热线号码，可直接在OA系统中进行拨号。由人事专人配置，配置时如有问题可咨询人事该模块的负责人"
					/>
						:
					</div>
					<i-input 
						v-model="formValidate.pstn_number" 
						:maxlength="6" 
						style="width: 300px" 
						placeholder="请输入外线号码" />
				</i-form-item>
				<i-form-item style='width:50%'  label="座机号码:" prop="tel">
					<i-input 
						v-model="formValidate.tel" 
						:maxlength="11" 
						style="width: 300px" 
						placeholder="请输入座机号码" />
				</i-form-item>
				
				<i-form-item style='width:50%'>
					<div slot="label">
						<span>入职面谈人</span>
						<oa-explain 
							style="transform: translateY(1px);"
							title="在试岗结束并通过后，与该入职员工面谈的人员。"
							content="例如，员工A试岗通过后，该员工的经理B与其进行面谈，那经理B就是A的入职面谈人"
						/>
						:
					</div>
					<div  style="width: 300px">
						<span>{{ formValidate.entry_interviewer }}</span>
						
					</div>
				</i-form-item>
				<i-form-item style='width:50%' label="入职面谈单:" >
					<div 
						v-if="formValidate.entry_interview_form==''" 
						style="width: 300px"
					>
						暂无
					</div>
					<div 
						v-else 
						style="width: 300px" 
						class="g-operation" 
						@click="handleGo(formValidate.entry_interview_form)"
					>
						点击查看
					</div>
				</i-form-item>
			</i-form>
		</div>
		<footer class="g-flex-cc">
			<div class="g-gray-btn-small g-m-r-10" @click="$router.back()">取消</div>
			<div class="g-m-r-10 g-red-btn-small" @click="handleSubmit">提交</div>
		</footer>
	</div>
	<!-- eslint-enable -->
</template>

<script>
import lodash from "lodash";
import API_ROOT from "@stores/apis/root";
import moment from "moment";
import {
	Form,
	FormItem,
	Input,
	InputNumber,
	Select,
	Option,
	DatePicker,
	Cascader,
	Row,
	Col,
	RadioGroup,
	Radio,
	Button
} from "iview";
// utils
import { dataValidity } from "@utils/utils";
import { ImgsPicker } from "wya-vc";
import { services } from "@stores/services/hr";
import Explain from '@components/_common/explain/explain';
import { DepartModal } from "./popup/depart";
import { RoleModal } from "./popup/role";
import { ConfirmModal } from "./popup/confirm";


export default {
	name: "v-hr-summary-entry",
	components: {
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-input-number": InputNumber,
		"i-select": Select,
		"i-option": Option,
		"i-date-picker": DatePicker,
		"i-cascader": Cascader,
		"i-row": Row,
		"i-col": Col,
		"i-radio-group": RadioGroup,
		"i-radio": Radio,
		"i-button": Button,
		"vc-imgs-picker": ImgsPicker,
		'oa-explain': Explain
	},
	mixins: [
		services.departAll(),
		services.departPosition(),
		services.roleList(),
		services.signTime()
	],
	data() {
		const {
			query = {}
		} = this.$route;
		return {
			pickerOptionsStart: {
				disabledDate: time => {
					// 可通过箭头函数的方式访问到this
					return time.getTime() > Date.now();
				}
			},
			first_depart_id: '',
			firstLoad: true,
			baseSalary: [],
			rateCase: [],
			rateTreamCase: [],
			stairDepart: [],
			positionArr: [],
			allRoles: [],
			isLoading: false,
			formValidate: {
				t_rate_case_id: '',
				staff_name: "",
				mobile: "",
				tel: '',
				depart_id: [],
				resume_status: null, // 简历状态 1：已完善，0：待完善
				entry_interviewer: "", // 入职面谈人
				staff_number: "", // 工号
				seat_number: "", // 坐席号
				pstn_number: "", // 外线号
				receiveRole: [],
				create_time: "", // 入职时间
				extra_depart: [], // 兼部门
				extra_role: [], // 兼部门
				position_id: [], // 职位id,：前一个是部门，后一个是职位id
				role_id: "", // 角色id
				status: "", // 员工状态 1：试用期员工，2：正式员工
				sign_time: "", // 合同签订时间 1：现在签订，2：选择几个月后签订
				try_time: "", // 试用期时长
				basic_salary_id: "", // 底薪制度id 非必填
				rate_case_id: "", // 提成制度id  非必填
				entry_interview_form: "",
				is_charge: "0"
			},
			ruleValidate: {
				seat_number: [
					{
						type: "validNum",
						message: "请输入数字",
						validator: dataValidity
					}
				],
				tel: [
					{
						type: "validNum",
						message: "请输入数字",
						validator: dataValidity
					},
					{ min: 11, message: '请输入11位数', trigger: 'blur' }
				],
				name: [{
					required: true,
					message: "姓名为必填"
				}],
				customer_name: [{
					required: true,
					message: "请输入客户姓名"
				}],
				contact: [{
					required: true,
					message: "请填写合同签订公司"
				}],
				my_company: [{
					required: true,
					message: "请选择我方合同公司",
					trigger: "change"
				}],
				create_time: [{
					required: true,
					type: "date",
					message: "请选择入职时间",
					trigger: "change"
				}],
				depart_id: [{
					required: true,
					type: "array",
					message: "请选择部门",
					trigger: "change"
				}],
				position_id: [{
					required: true,
					type: "number",
					message: "请选择职位",
					trigger: "change"
				}],
				
				status: [{
					required: true,
					message: "员工状态必选",
					trigger: "change"
				}],
				sign_time: [{
					required: true,
					message: "合同签订时间必选",
					trigger: "change"
				}],
				try_time: [{
					required: true,
					type: "number",
					message: "试用期时长必选",
					trigger: "change"
				}]
			}
		};
	},
	created() {
	},
	mounted() {
		this.fetchEntryInfo();
		this.handleEntryDepart();
	},
	methods: {
		handleSelectRole(query) {
			this.isLoading = true;
			this.$request({
				url: API_ROOT._HR_ROLE_DATA_GET,
				type: "GET",
				param: {
					role_name: query,
					first_depart_id: this.first_depart_id,
					is_level: 1,
				}
			}).then(res => {
				this.isLoading = false;
				this.allRoles = res.data;
			});
		},
		fetchEntryInfo() {
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_SUMMARY_ENTRY_DETAIL_GET,
				type: "GET",
				param: {
					applicant_id: this.$route.query.applicant_id
				},
				loading: false
			}).then(res => {
				this.formValidate = { ...this.formValidate,
					...res.data
				};
				if (res.data.depart_id.length) {
					this.first_depart_id = res.data.depart_id[0];
					this.handleEntryPosition(res.data.depart_id[0]);
					this.handleChange(res.data.depart_id);
					this.handleSelectRole();
				}
				res.data.ei_status == 0
					? this.$Message.warning({
						content: "入职信息未完善",
						closable: true
					})
					: null;
				res.data.resume_status == 0
					? this.$Message.warning({
						content: "简历未完善",
						closable: true
					})
					: null;
					
			}).catch(err => {});
		},
		handleDepartChange() {
			DepartModal.popup({
				extra_depart: this.formValidate.extra_depart,
			}).then(
				res => {
					this.formValidate.extra_depart = res;
				}
			);
		},
		handleExtraRole() {
			RoleModal.popup({
				extra_role: this.formValidate.extra_role,
				show: false,
				is_auth: 1,
			}).then(res => {
				this.formValidate.extra_role = res;
			});
		},
		handleChange(value, selectedData) {
			if (!this.firstLoad) {
				this.formValidate.position_id = "";
				this.positionArr = [];
			}
			if (value[0]) {
				this.first_depart_id = value[0];
				this.handleEntryPosition(value[0]);
				this.fetchbaseSalaryList(value[0]);
				this.fetchRateCaseList(value[0]);
				this.fetchTeamRateCaseList(value[0]);
				this.handleSelectRole();
			}
			this.firstLoad = false;
		},
		handleStaffChange(obj) {
			this.staff_id = obj && obj.value ? obj.value : '';
			this.staff_name = obj && obj.label ? obj.label : '';
		},
		handleQueryChange(query = '') {
			let targetQuery = this.staff_name || '';
			if (query.length == 0) {
				this.formValidate.role_id = '';
				this.handleSelectRole(query);
			}
			if (targetQuery.length > query.length) {
				this.$refs.staff.clearSingleSelect();
			}
		},
		fetchbaseSalaryList(id) {
			// eslint-disable-line
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_SUMMARY_DETAILS_BASIC_SALARY_GET,
				type: "GET",
				param: {
					depart_id: id
				},
				loading: false
			}).then(res => {
				this.baseSalary = res.data;
			}).catch(error => {});
		},
		fetchRateCaseList(id) {
			// eslint-disable-line
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_SUMMARY_DETAILS_RATE_CASE_GET,
				type: "GET",
				param: {
					depart_id: id
				},
				loading: false
			}).then(res => {
				this.rateCase = res.data;
			}).catch(error => {});
		},
		fetchTeamRateCaseList(id) {
			// eslint-disable-line
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_SUMMARY_DETAILS_RATE_CASE_GET,
				type: "GET",
				param: {
					depart_id: id,
					type: 2
				},
				loading: false
			}).then(res => {
				this.rateTreamCase = res.data;
			}).catch(error => {});
		},
		handleEntryInfo() {
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_SUMMARY_ENTRY_POST,
				type: "POST",
				param: {
					...this.formValidate,
					create_time: moment(this.formValidate.create_time).format(
						"YYYY-MM-DD"
					)
				}
			}).then(res => {
				this.$router.push("/hr/employee/summary?page=1&pageSize=10&type=2");
				this.$Message.success(res.msg);
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleEntryDepart() {
			this.$request({
				url: API_ROOT.HR_STAIR_DEPART_GET,
				type: "GET",
				loading: false
			}).then(res => {
				this.stairDepart = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleDepartId(id) {
			this.handleEntryPosition(id);
		},
		handleEntryPosition(id) {
			this.$request({
				url: API_ROOT.HR_POSITION_LIST_GET,
				type: "GET",
				param: {
					depart_id: id,
					type: 1
				}
			}).then(res => {
				this.positionArr = res.data.list;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		
		handleGo(url) {
			this.$router.push(url);
		},
		handleSubmit: lodash.debounce(function (event) {
			this.$refs.form.validate(isValid => {
				if (isValid) {
					if (this.formValidate.add_type !== 1) {
						ConfirmModal.popup().then(res => {
							this.handleEntryInfo();
						});
					} else {
						this.handleEntryInfo();
					}
				} else {
					this.$Message.error(err.msg);
				}
			});
		}, 500)
	}
};
</script>

<style lang="scss" scoped>
.v-hr-summary-entry {
	height: calc(100% - 55px);
    overflow-y: auto;
    margin-top: 50px;
	._form {
		min-width: 410px;
		max-width: 900px;
		.ivu-input-wrapper {
			width: 300px;
		}
	}
	._tip{
		position: absolute;
		right: -18px;
		top: 0px;
	}
	.ivu-radio-wrapper:first-child {
		margin-right: 40px;
	}
	._title {
		display: inline-block;
		width: 4px;
		margin-top: 10px;
		margin-bottom: 10px;
	}
	footer {
		position: absolute;
		bottom: 0;
		left: 0;
		background-color: #ffffff;
		width: 100%;
		height: 60px;
		box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
	}
}
</style>