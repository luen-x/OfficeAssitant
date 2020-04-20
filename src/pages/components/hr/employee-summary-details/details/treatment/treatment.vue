<template>
	<div>
		<i-form 
			ref="form" 
			:model="formValidate" 
			:rules="ruleValidate" 
			:label-width="100" 
			class="v-hr-summary-details-treatment" 
			style="width: 830px" 
			position="left">
			<div class="g-flex g-flex-ac">
				<oa-title title="薪资制度" />
				<div v-if="$auth['211']" class="g-operation" @click="handleStatus(1)">
					<div v-if="raceStatus" class="g-fs-14">
						<span class="g-m-l-15" @click="handleSubmit(1)">保存</span>
						<span class="g-m-lr-15" @click="handleCancel(1)">取消</span>
					</div>
					<span v-else-if="$route.query.from !== 'avatar'" class="g-m-lr-15 g-fs-14">编辑</span>
				</div>
			</div>
			<div>
				<div v-if="raceStatus">
					<div class="g-m-t-5 g-m-b-15 g-c-red-mid g-fs-14">{{ warnMsg }}</div>
					<div class="_item g-flex">
						<i-form-item label="提成制度:" prop="rate_case_id">
							<i-select 
								v-model="formValidate.rate_case_id" 
								transfer 
								style="width:300px" 
								placeholder="请选择提成制度">
								<i-option 
									v-for="(item, index) in rateCaseList" 
									:key="index" 
									:value="item.rate_case_id">
									{{ item.name }}
								</i-option>
							</i-select>
						</i-form-item>
						<i-form-item label="底薪制度:" prop="basic_salary_id">
							<i-select 
								v-model="formValidate.basic_salary_id" 
								transfer 
								style="width:300px" 
								placeholder="请选择底薪制度">
								<i-option 
									v-for="(item, index) in baseSalaryList" 
									:key="index" 
									:value="item.basic_salary_id">
									{{ item.name }}
								</i-option>
							</i-select>
						</i-form-item>
						<i-form-item label="团队提成:" >
							<i-select 
								:disabled="formValidate.is_charge===0"
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
					</div>
					<oa-title title="薪资结构" />
					<div class="_item g-flex">
						<i-form-item label="我的底薪:">
							<i-input 
								v-model="formValidate.basic_salary" 
								:maxlength="20" 
								disabled 
								style="width: 300px" 
								placeholder="暂无底薪信息" />
						</i-form-item>
						<i-form-item label="工龄工资:">
							<i-input 
								v-model="formValidate.work_age_salary" 
								:maxlength="20" 
								disabled 
								style="width: 300px" 
								placeholder="暂无工龄工资信息" />
						</i-form-item>
						<template v-for="(item,index) in formValidate.rankInfo" class="g-flex  g-fw-w">
							<!-- <i-form-item v-if="item.rank_name" :label="item.system_name+':'" :key="Math.random()+index">
								<i-input 
									v-model="item.rank_name" 
									:maxlength="20" 
									disabled 
									style="width: 300px" 
									placeholder="暂无信息" />
							</i-form-item> -->
							<i-form-item v-if="item.rank_name" :label="item.system_name+'底薪:'" :key="Math.random()+index">
								<i-input 
									v-model="item.regular_subsidy" 
									:maxlength="20" 
									disabled 
									style="width: 300px" 
									placeholder="暂无信息" />
							</i-form-item>
							<i-form-item v-if="item.rank_name" :label="item.system_name +'提成:'" :key="Math.random()+index">
								<i-input 
									v-model="item.commission_rate" 
									:maxlength="20" 
									disabled 
									style="width: 300px" 
									placeholder="暂无信息" />
							</i-form-item>
						</template>
					</div>
				</div>
				<div v-else class="_oaitem">
					<oa-item label="提成制度">
						<span 
							class="g-operation" 
							@click="handleRate(formValidate.rate_case_name,formValidate.rate_case_id,1)">
							{{ formValidate.rate_case_name }}
						</span>
					</oa-item>
					<oa-item label="底薪制度">{{ formValidate.basic_salary_name }}</oa-item>
					<oa-item label="团队提成">
						<span 
							class="g-operation" 
							@click="handleRate(formValidate.t_rate_case_name,formValidate.t_rate_case_id,2)">
							{{ formValidate.t_rate_case_name }}
						</span>
					</oa-item>
					<oa-title title="薪资结构" style="marginLeft:-10px;marginTop:30px"/>
					<oa-item label="我的底薪">{{ formValidate.basic_salary }}</oa-item>
					<oa-item label="工龄工资">{{ formValidate.work_age_salary }}</oa-item>
					<div class="_check">
						<div v-for="(item,index) in formValidate.rankInfo" :key="index">
							<!-- <oa-item v-if="item.rank_name" :label="item.system_name">
								{{ item.rank_name }}
							</oa-item> -->
							<oa-item v-if="item.rank_name" :label="item.system_name+'底薪'">
								{{ item.regular_subsidy }}
							</oa-item>
							<oa-item v-if="item.rank_name" :label="item.system_name +'提成'">
								{{ item.commission_rate }}
							</oa-item>
						</div>
					</div>
				</div>
			</div>
			<div>
				<oa-item 
					v-if="formValidate.rank_name" 
					:label="formValidate.system_name+&quot;提成&quot;">{{ formValidate.commission_rate }}</oa-item>
			</div>
			<div class="g-flex g-flex-ac g-m-t-15">
				<oa-title title="社保信息" />
				<div v-if="$auth['211']" class="g-operation" @click="handleStatus(2)">
					<div v-if="socialStatus" class="g-fs-14">
						<span class="g-m-l-15" @click="handleSubmit(2)">保存</span>
						<span class="g-m-lr-15" @click="handleCancel(2)">取消</span>
					</div>
					<span v-else-if="$route.query.from !== 'avatar'" class="g-m-lr-15 g-fs-14">编辑</span>
				</div>
			</div>
			<div v-if="socialStatus">
				<i-row>
					<i-col span="12">
						<i-form-item label="新增原因:">
							<i-select 
								v-model="formValidate.social_security_reason" 
								placeholder="请选择新增原因" 
								transfer 
								style="width: 300px">
								<i-option v-for="(item, index) in reason" :key="index" :value="item.social_value">
									{{ item.lable }}
								</i-option>
							</i-select>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="用工形式:">
							<i-select 
								v-model="formValidate.employment_foremployment_form" 
								style="width: 300px" 
								placeholder="请选择用工形式" 
								transfer>
								<i-option 
									v-for="(item, index) in foremployment" 
									:key="index" 
									:value="item.foremployment_value">
									{{ item.label }}
								</i-option>
							</i-select>
						</i-form-item>
					</i-col>
				</i-row>
				<i-form-item label="户口性质:">
					<i-select 
						v-model="formValidate.residence_type" 
						placeholder="请选择户口性质" 
						style="width: 300px" 
						transfer>
						<i-option 
							v-for="(item, index) in residenceList" 
							:key="index" 
							:value="item.value">
							{{ item.label }}
						</i-option>
					</i-select>
				</i-form-item>
			</div>
			<div v-else class="_oaitem">
				<oa-item label="新增原因">{{ formValidate.social_security_reason_name }}</oa-item>
				<oa-item label="用工形式">{{ formValidate.employment_foremployment_form_name }}</oa-item>
				<oa-item label="户口性质">{{ formValidate.residence_type_name }}</oa-item>
			</div>
		</i-form>
	</div>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import {
	Form,
	FormItem,
	Input,
	Select,
	Option,
	DatePicker,
	Row,
	Col
} from "iview";
// utils
import { services } from "@stores/services/hr";
import { dataValidity, unCode } from "@utils/utils";
import { ImgsPicker } from "wya-vc";
import Title from "../../../_common/title";
import DetailItem from "../detail-item";
import { AuditModal } from "./popup/audit";

export default {
	name: "v-hr-summary-details-treatment",
	components: {
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-select": Select,
		"i-option": Option,
		"i-date-picker": DatePicker,
		"i-row": Row,
		"i-col": Col,
		"oa-title": Title,
		"oa-item": DetailItem
	},
	mixins: [services.residenceList()],
	data() {
		return {
			warnMsg: "",

			raceStatus: false,
			socialStatus: false,
			baseSalaryList: [],
			rateCaseList: [],
			rateTreamCase: [],
			reason: [{
				social_value: 1,
				lable: "新参加工作"
			},
			{
				social_value: 2,
				lable: "个体再就业"
			}
			],
			foremployment: [{
				foremployment_value: 1,
				label: "合同工"
			},
			{
				foremployment_value: 2,
				label: "编外合同工"
			}
			],

			formValidate: {
				system_name: "",
				basic_salary_id: "",
				rate_case_id: "",
				basic_salary_name: "",
				basic_salary: "",
				rate_case_name: "",
				work_age_salary: "",
				rank_name: "",
				regular_subsidy: "",
				commission_rate: "",
				social_security_reason: "",
				employment_foremployment_form: "",
				residence_type: "",
				social_security_reason_name: "",
				t_rate_case_name: '',
				t_rate_case_id: '',
				employment_foremployment_form_name: "",
				residence_type_name: "",
				is_charge: 0
			},
			ruleValidate: {
				rate_case_id: [{
					required: true,
					type: "number",
					message: "提成制度为必选",
					trigger: "change"
				}],
				basic_salary_id: [{
					required: true,
					type: "number",
					message: "底薪制度为必选",
					trigger: "change"
				}],
			}
		};
	},
	watch: {
		$route(to, from) {
			if (unCode(to.query.staff_id) != unCode(from.query.staff_id)) {
				this.fetchApplicantInfo();
			}
		}
	},
	mounted() {
		this.fetchApplicantInfo();
	},
	methods: {
		handleStatus(type) {
			switch (type) {
				case 1:
					this.raceStatus = true;
					this.fetchWarnMsg();
					this.fetchbaseSalaryList();
					this.fetchRateCaseList();
					this.fetchTeamRateCaseList();
					break;
				case 2:
					this.socialStatus = true;
					break;
				default:
					break;
			}
		},
		handleSubmit(type) {
			if (type == 1) {
				this.$refs[`form`].validate(isValid => {
					if (isValid) {
						this.raceStatus = false;
						this.fetchData(1);
					}

				});
			}
			if (type == 2) {
				this.fetchData(2);
			}
		},
		fetchData(type) {
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_SUMMARY_DETAILS_EDIT_SOCIAL_SECURITY_POST,
				type: "POST",
				param: {
					...this.formValidate,
					staff_id: unCode(this.$route.query.staff_id),
					type
				},
				loading: false
			}).then(res => {
				if (type == 1) {
					this.raceStatus = false;
				}
				if (type == 2) {
					this.socialStatus = false;
				}
				this.$Message.success(res.msg);
				this.fetchApplicantInfo(type);
			}).catch(err => {
				this.$Message.error(err.msg);
			});

		},
		fetchWarnMsg() {
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_SUMMARY_DETAILS_WARN_MSG_GET,
				type: "GET"
			}).then(res => {
				this.warnMsg = res.data.msg;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		fetchbaseSalaryList() {
			// eslint-disable-line
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_SUMMARY_DETAILS_BASIC_SALARY_GET,
				type: "GET",
				param: {
					depart_id: this.formValidate.level_depart_id
				},
				loading: false
			}).then(res => {
				this.baseSalaryList = res.data;
			}).catch(error => {});
		},
		fetchRateCaseList() {
			// eslint-disable-line
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_SUMMARY_DETAILS_RATE_CASE_GET,
				type: "GET",
				param: {
					depart_id: this.formValidate.level_depart_id
				},
				loading: false
			}).then(res => {
				this.rateCaseList = res.data;
			}).catch(error => {});
		},
		fetchApplicantInfo(type) {
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_SUMMARY_DETAILS_SOCIAL_SECURITY_GET,
				type: "GET",
				param: {
					staff_id: unCode(this.$route.query.staff_id),
					type
				},
				loading: false
			}).then(res => {
				this.formValidate = { ...this.formValidate, ...res.data };
				if (type == 1) {
					this.raceStatus = false;
				}
				if (type == 2) {
					this.socialStatus = false;
				}
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		fetchTeamRateCaseList(id) {
			// eslint-disable-line
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_SUMMARY_DETAILS_RATE_CASE_GET,
				type: "GET",
				param: {
					depart_id: this.formValidate.level_depart_id,
					type: 2
				},
				loading: false
			}).then(res => {
				this.rateTreamCase = res.data;
			}).catch(error => {});
		},
		handleRate(name, id, type) {
			AuditModal.popup({ title: name, rate_case_id: id, type }).then();
		},
		handleCancel(type) {
			this.fetchApplicantInfo(type);
		},
	}
};
</script>

<style lang="scss">
.v-hr-summary-details-treatment {
	// padding-right: 20px;
	overflow-y: auto;
	min-height: 500px;
	._check {
		max-height: 300px;
		overflow-y: auto;
	}
	._item{
		width: 900px;
		flex-wrap: wrap;
	}
	._oaitem{
		margin-left: 10px;
	}
}
</style>
