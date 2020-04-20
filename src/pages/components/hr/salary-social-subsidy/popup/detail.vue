<template>
	<div>
		<i-drawer
			v-model="closable"
			:mask="false"
			:mask-closable="false"
			class="v-salary-social-subsidy-popup-details"
			@on-close="$emit('close')"
		>
			<div v-if="spin" class="_detail-header">{{ formData.staff_name }}</div>
			<div v-if="spin">
				<i-row>
					<i-col span="8" class="g-m-t-15">
						<span class="g-m-l-5">员工工号：</span>
						<span class="g-m-l-10">{{ formData.staff_number }}</span>
					</i-col>
					<i-col span="8" class="g-m-t-15" style="marginLeft: -40px">
						<span class="g-m-l-5">员工性别：</span>
						<span class="g-m-l-10">{{ formData.sex }}</span>
					</i-col>
					<i-col span="8" class="g-m-t-15" >
						<span class="g-m-l-5">手机号码：</span>
						<span class="g-m-l-10">{{ formData.mobile }}</span>
					</i-col>
				</i-row>
				<i-row>
					<i-col span="8" class="g-m-t-15">
						<span class="g-m-l-5">入职日期：</span>
						<span class="g-m-l-10">{{ formData.create_time }}</span>
					</i-col>
					<i-col span="8" class="g-m-t-15" style="marginLeft: -40px">
						<span class="g-m-l-5">员工部门：</span>
						<span class="g-m-l-10">{{ formData.depart_name }}</span>
					</i-col>
					<i-col span="8" class="g-m-t-15" >
						<span class="g-m-l-5">员工职位：</span>
						<span class="g-m-l-10">{{ formData.position_name }}</span>
					</i-col>
				</i-row>
				<i-divider class="_divider"/>
				<i-form
					ref="formValidate"
					:model="formData"
					:rules="ruleValidate"
					:label-width="100"
					style="width: 1000px"
					class="_form"
					inline
					position="center"
				>
					<i-form-item label="缴纳公司：">
						<i-select
							v-model="formData.security_company_id"
							placeholder="请选择缴纳公司"
							style="width: 300px"
							transfer
							clearable
							@on-query-change="handleSecurityCompany"
						>
							<i-option
								v-for="(item, index) in socialContractArr"
								:key="index"
								:value="item.contract_company_id"
							>{{ item.company_name }}</i-option>
						</i-select>
					</i-form-item>
					<i-form-item v-if="type==='2'" label="参加工作日期：">
						<i-date-picker
							v-model="formData.work_start_time"
							style="width: 300px"
							type="date"
							clearable
							placeholder="请选择参加工作日期"
							@on-open-change="handleTipStatus(2)"
						/>
					</i-form-item>
					<i-form-item v-if="type==='1'" label="开缴月份：">
						<i-date-picker
							v-model="formData.start_month"
							style="width: 300px"
							type="month"
							clearable
							placeholder="请选择开缴月份"
							@on-open-change="handleTipStatus(3)"
						/>
					</i-form-item>
					<i-form-item label="户口性质：">
						<i-select
							v-model="formData.residence_type"
							clearable
							placeholder="请选择户口性质"
							style="width: 300px"
							transfer
							@on-query-change="handleTipStatus(4)"
						>
							<i-option
								v-for="(item, index) in residenceArr"
								:key="index"
								:value="item.value"
							>{{ item.label }}</i-option>
						</i-select>
					</i-form-item>
					<i-form-item label="用工性质：">
						<i-select
							v-model="formData.employment_form"
							clearable
							style="width: 300px"
							placeholder="请选择用工性质"
							transfer
							@oon-query-change="handleTipStatus(5)"
						>
							<i-option
								v-for="(item, index) in foremployment"
								:key="index"
								:value="item.foremployment_value"
							>{{ item.label }}</i-option>
						</i-select>
					</i-form-item>
					<i-form-item label="新增原因：">
						<i-select
							v-model="formData.social_security_reason"
							clearable
							placeholder="请选择新增原因"
							transfer
							style="width: 300px"
							@on-query-change="handleTipStatus(6)"
						>
							<i-option
								v-for="(item, index) in reason"
								:key="index"
								:value="item.social_value"
							>{{ item.label }}</i-option>
						</i-select>
					</i-form-item>
					<i-form-item label="月收入：">
						<i-input
							v-model="formData.salary"
							:maxlength="7"
							style="width: 300px"
							placeholder="请输入月收入"
							@on-change="handleTipStatus(7)"
						/>
					</i-form-item>
					<i-form-item label="用工形式：">
						<i-select
							v-model="formData.employment_foremployment_form"
							style="width: 300px"
							placeholder="请选择用工形式"
							transfer
							clearable
							@on-query-change="handleTipStatus(8)"
						>
							<i-option
								v-for="(item, index) in residenceList"
								:key="index"
								:value="item.value"
							>{{ item.label }}</i-option>
						</i-select>
					</i-form-item>
					<i-form-item label="是否特困：">
						<i-select
							v-model="formData.is_poor"
							style="width: 300px"
							placeholder="请选择是否特困"
							transfer
							clearable
							@on-query-change="handleTipStatus(9)"
						>
							<i-option
								v-for="item in isPoorArr"
								:key="item.value"
								:value="item.value"
							>{{ item.label }}</i-option>
						</i-select>
					</i-form-item>
					<i-form-item label="通讯地址：">
						<i-input
							v-model="formData.company_address"
							:maxlength="50"
							clearable
							style="width: 300px"
							placeholder="请输入通讯地址"
							@on-change="handleTipStatus(10)"
						/>
					</i-form-item>
					<i-form-item label="邮编：">
						<i-input
							v-model="formData.postcode"
							:maxlength="6"
							clearable
							style="width: 300px"
							placeholder="请输入邮编"
							@on-change="handleTipStatus(11)"
						/>
					</i-form-item>
					<i-form-item label="工种：">
						<i-input
							v-model="formData.work_type"
							:maxlength="20"
							style="width: 300px"
							placeholder="请输入工种"
							@on-change="handleTipStatus(12)"
						/>
					</i-form-item>
					<i-form-item v-if="type==='2'" label="补贴金额：">
						<i-input
							v-model="formData.subsidy_money"
							:maxlength="7"
							style="width: 300px"
							placeholder="请输入补贴金额"
							@on-change="handleTipStatus(13)"
						/>
					</i-form-item>
				</i-form>
				<div class="_detail-footer g-flex g-flex-ac g-jc-sb" style="marginTop: 46px;">
					<div class="g-fl">
						<i-button type="primary" @click="handleSave('formValidate')">确定</i-button>
						<i-button class="g-m-l-5" @click="handleCancel">取消</i-button>
					</div>
					<div v-if="formData.remark">
						<span @click="handleCancel">{{ formData.remark }}</span>
					</div>
					<div v-else>
						<i-button 
							v-if="type==='1'&&$auth['1135']" 
							class="g-m-r-10" 
							@click="handleTip">转到补贴</i-button>
						<i-button 
							v-if="type==='2'&&$auth['1135']" 
							class="g-m-r-10" 
							@click="handleTip">转到社保</i-button>
					</div>
				</div>
			</div>
			<oa-loading v-else/>
		</i-drawer>
	</div>
</template>

<script>
import {
	Drawer,
	Form,
	FormItem,
	Input,
	InputNumber,
	Select,
	Option,
	DatePicker,
	Button,
	Divider,
	Row,
	Col
} from "iview";
import { CreatePortal, ImgsPreview } from "wya-vc";
import API_ROOT from "@stores/apis/root";
import { services, staffByMutiTerm } from "@stores/services/hr";
import moment from "moment";
import lodash from "lodash";
import { TipModal } from "./tip";
import { LeaveModal } from "./leave";

export default {
	name: "salary-social-subsidy-popup-details-drawer",
	components: {
		"i-drawer": Drawer,
		"i-button": Button,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-input-number": InputNumber,
		"i-select": Select,
		"i-option": Option,
		"i-date-picker": DatePicker,
		// 'oa-info': Info,
		"i-divider": Divider,
		"i-row": Row,
		"i-col": Col
	},
	mixins: [staffByMutiTerm, services.departAll()],
	props: {
		staffId: String | Number,
		type: String 
	},
	data() {
		return {
			closable: false,
			spin: true,
			socialContractArr: [],
			isPoorArr: [
				{
					value: 0,
					label: "否"
				},
				{
					value: 1,
					label: "是"
				}
			],
			reason: [
				{
					social_value: 1,
					label: "新参加工作"
				},
				{
					social_value: 2,
					label: "个体再就业"
				}
			],
			foremployment: [
				{
					foremployment_value: 1,
					label: "城合工"
				},
				{
					foremployment_value: 2,
					label: "农合工"
				}
			],
			residenceList: [
				{
					value: 1,
					label: "合同工"
				},
				{
					value: 2,
					label: "编外合同工"
				}
			],
			residenceArr: [
				{
					value: 1,
					label: "本地城镇（主城区）"
				},
				{
					value: 2,
					label: "本地农村（主城区）"
				},
				{
					value: 3,
					label: "外地城镇（省内市外）"
				},
				{
					value: 4,
					label: "外地城镇（省外）"
				},
				{
					value: 5,
					label: "外地农村（省内市外）"
				},
				{
					value: 6,
					label: "外地农村（省外）"
				}
			],
			formData: {
				staff_name: "",
				staff_number: "",
				sex: "",
				mobile: "",
				create_time: "",
				depart_name: "",
				position_name: "",
				remark: "",
				security_company_id: "",
				work_start_time: "",
				start_month: "",
				residence_type: "",
				employment_form: "",
				social_security_reason: "",
				work_type: "",
				salary: '',
				employment_foremployment_form: "",
				postcode: '',
				is_poor: '',
				company_address: "",
				subsidy_money: ""
			},
			ruleValidate: {
				postcode: [
					{
						required: false,
						type: "number",
						message: "请输入邮编",
						trigger: "change"
					}
				],
				salary: [
					{
						required: false,
						type: "number",
						message: "请输入月收入",
						trigger: "change"
					}
				],
			},
			openTipStatus: false
		};
	},
	watch: {
		staffId() {
			this.loadData();
			this.handleSocialContractCompany();
		}
	},
	mounted() {
		this.closable = true;
		this.loadData();
		this.handleSocialContractCompany();
	},
	methods: {
		handleCancel() {
			if (!this.openTipStatus) {
				this.$emit("close");
			} else {
				this.handleLeaveModal(true);
			}
		},
		handleSocialContractCompany() {
			this.$request({
				url: API_ROOT._HR_STAFF_SOCIAL_CONTRACT_COMPANY_GET,
				type: "GET"
			}).then(res => {
				this.socialContractArr = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleSecurityCompany() {
			this.$request({
				url: API_ROOT._HR_SALARY_SOCIAL_SUBSIDY_DEFAULT_CONF_GET,
				type: "GET",
				param: {
					security_company_id: this.formData.security_company_id
				},
				loading: false
			}).then(res => {
				this.formData = { ...this.formData, ...res.data };
				this.handleTipStatus(1);
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleTipStatus(num) {
			this.openTipStatus = true;
		},
		loadData(type, staff_id) {
			if (!this.openTipStatus) {
				this.$request({
					url:
                        API_ROOT._HR_SALARY_SOCIAL_SUBSIDY_LIST_ROW_ADJUSTMENT_GET,
					type: "GET",
					param: {
						// type: type || this.type,
						type: this.type,
						staff_id: staff_id || this.staffId
					},
					loading: false
				}).then(res => {
					this.formData = res.data;
				}).catch(err => {
					this.$Message.error(err.msg);
				});
			} else {
				this.handleLeaveModal();
			}
		},
		handleSave(name) {
			this.$request({
				url: API_ROOT._HR_SALARY_SOCIAL_SUBSIDY_LIST_ROW_ADJUSTMENT_ADD_POST,
				type: "POST",
				param: {
					...this.formData,
					work_start_time: this.formData.work_start_time ? moment(
						this.formData.work_start_time
					).format("YYYY-MM-DD") : '',
					start_month: this.formData.start_month ? moment(this.formData.start_month).format(
						"YYYY-MM"
					) : '',
					salary: this.formData.salary ? this.formData.salary : '',
					postcode: this.formData.postcode ? this.formData.postcode : '',
				},
				loading: false
			}).then(res => {
				this.openTipStatus = false;
				this.$Message.success("保存成功");
				this.$emit("sure");
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleLeaveModal(cancel) {
			LeaveModal.popup({}).then(res => {
				this.openTipStatus = false;
				this.loadData();
				if (cancel) {
					this.$emit("close");
				}
			}).catch(err => {});
		},
		handleTip() {
			TipModal.popup({
				staffId: this.staffId,
				type: this.type,
				loadData: this.loadData
			}).then(res => {
				this.$store.commit("HR_SALARY_SOCIAL_SUBSIDY_LIST_INIT");
			}).catch(err => {});
		}
	}
};
export const DetailDrawer = CreatePortal(
	{ store: app.$store, alive: true },
	module.exports.default
);
</script>

<style lang="scss">
.v-salary-social-subsidy-popup-details {
	._divider{
		position: relative;
		left:-60px;
		width: 150%;
	}
    ._form {
        margin-top: 30px;
        margin-left: -20px;
    }
    ._detail-header {
        color: #000;
        font-size: 16px;
        height: 31px;
        line-height: 31px;
    }
    ._demo-drawer-profile {
        margin-top: 14px;
    }
    ._detail-footer {
        width: 940px;
        height: 61px;
        position: fixed;
        bottom: 0;
        right: 0;
        border-top: 1px solid #e8e8e8;
        padding: 10px 16px;
        text-align: left;
        background: #fff;
        box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1);
    }
}
</style>
