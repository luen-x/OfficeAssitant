<template>
	<div class="g-flex g-fd-c v-hr-imformation-form">
		<div class="g-flex g-flex-ac">
			<oa-title title="个人信息"/>
			<div 
				v-if="$auth['208'] && queryStaffStatus !=='4'" 
				class="g-m-lr-15 g-fs-14 g-operation" 
				@click="handleEdit"
			>
				<span v-if="status" class="g-fs-14">
					<span class="g-m-lr-15" @click="handleJobInfo">保存</span>
					<span @click="handleCancel">取消</span>		
				</span>
				<span v-else-if="$route.query.from !== 'avatar'" class="g-fs-14">编辑</span>
			</div>
		</div>
		<i-form
			v-if="status"
			ref="form"
			:model="formValidate"
			:rules="ruleValidate"
			:label-width="100"
			style="width: 1000px"
			class="_form"
			inline
			position="center"
		>
			<i-form-item label="工号：" >
				<i-input 
					v-model="formValidate.staff_number" 
					:maxlength="15" 
					style="width: 300px"
					placeholder="请输入姓名"
					disabled
				/>
			</i-form-item>
			<i-form-item label="部门：">
				<i-cascader
					v-model="formValidate.depart_id"
					:data="departAll"
					:change-on-select="true"
					style="width:300px; display: inline-block"
					clearable
					transfer
					disabled 
					trigger="click"
					placeholder="请选择部门"
					@on-change="handleChange"
				/>
			</i-form-item>
			<i-form-item label="是否管理：">
				<i-radio-group 
					v-model="formValidate.is_charge"
					style="width: 300px;">
					<i-radio :label="1" disabled>是</i-radio>
					<i-radio :label="0" disabled>否</i-radio>
				</i-radio-group>
			</i-form-item>
			<i-form-item label="职位：" >
				<!-- <i-select 
					v-model="formValidate.position_id" 
					style="width: 300px" 
					clearable 
					disabled 
					placeholder="请选择职位"
				>
					<i-option
						v-for="(item, index) in positionArr"
						:key="index"
						:value="item.position_id"
					>{{ item.position_name }}</i-option>
				</i-select> -->
				<i-input 
					v-model="formValidate.position_name" 
					:maxlength="15" 
					style="width: 300px"
					placeholder="请输入职位"
					disabled
				/>
			</i-form-item>
			<i-form-item label="角色：" >
				<i-select 
					v-model="formValidate.role_id" 
					style="width: 300px" 
					disabled 
					placeholder="请输入角色关键字搜索"
				>
					<i-option 
						v-for="role in allRoles" 
						:value="role.role_id" 
						:key="role.role_id">{{ role.role_name }}</i-option>
				</i-select>
			</i-form-item>
			<i-form-item label="兼部门：">
				<div
					v-if="$auth['893']"
					class="g-operation"
					style="width: 300px"
					@click="handleDepartChange(false)"
				>已选{{ formValidate.extra_depart.length }}个兼部门</div>
				<div
					v-else
					:class="formValidate.extra_depart.length>0?'g-operation':''"
					style="width: 300px"
					@click="handleDepartChange(true)"
				>已选{{ formValidate.extra_depart.length }}个兼部门</div>
			</i-form-item>
			<i-form-item label="兼角色：">
				<div
					v-if="$auth['893']"
					class="g-operation"
					style="width: 300px"
					@click="handleExtraRole(false)"
				>已选{{ formValidate.extra_role.length }}个兼角色</div>
				<div
					v-else
					:class="formValidate.extra_role.length>0?'g-operation':''"
					style="width: 300px"
					@click="handleExtraRole(true)"
				>已选{{ formValidate.extra_role.length }}个兼角色</div>
			</i-form-item>
			<i-form-item label="入职日期：">
				<i-input 
					v-model="formValidate.create_time" 
					:maxlength="15" 
					style="width: 300px"
					placeholder="请输入姓名"
					disabled
				/>
			</i-form-item>
			<i-form-item label="转正日期：">
				<i-input 
					v-model="formValidate.regular_time" 
					:maxlength="15" 
					style="width: 300px"
					placeholder="请输入姓名"
					disabled
				/>
			</i-form-item>
			<i-form-item
				v-if="formValidate.try_time !=0 "
				label="试用期时长："
				prop="try_time"
			>
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
			<i-form-item label="工龄：">
				<i-input 
					v-model="formValidate.work_day" 
					:maxlength="15" 
					style="width: 300px"
					placeholder="请输入姓名"
					disabled
				/>
			</i-form-item>
			<i-form-item label="管理工龄：" prop="name">
				<i-input 
					v-model="formValidate.manager_day" 
					:maxlength="15" 
					style="width: 300px"
					placeholder="请输入姓名"
					disabled
				/>
			</i-form-item>
			<i-form-item label="坐席号：">
				<i-input
					v-model="formValidate.seat_number"
					:maxlength="4"
					style="width: 300px"
					clearable
					placeholder="请填写坐席号"
				/>
			</i-form-item>
			<i-form-item label="外线号码：">
				<i-input
					v-model="formValidate.pstn_number"
					:maxlength="6"
					clearable
					style="width: 300px"
					placeholder="请填写外线号码"
				/>
			</i-form-item>
			<i-form-item label="座机号码：" prop="tel">
				<i-input 
					v-model="formValidate.tel" 
					:maxlength="11" 
					style="width: 300px" 
					placeholder="请输入座机号码" />
			</i-form-item>
			<i-form-item label="企业邮箱：">
				<i-input 
					v-model="formValidate.email" 
					:maxlength="20" 
					clearable 
					style="width: 300px" 
					placeholder="请填写企业邮箱"/>
			</i-form-item>
			<i-form-item label="招聘渠道：">
				<i-input 
					v-model="formValidate.add_type" 
					:maxlength="15" 
					style="width: 300px"
					placeholder="请输入姓名"
					disabled
				/>
			</i-form-item>
		</i-form>
		<div v-else class="__oaitem">
			<oa-item label="工号">{{ formValidate.staff_number }}</oa-item>
			<oa-item label="部门">{{ formValidate.depart_name }}</oa-item>
			<oa-item label="是否管理">{{ formValidate.is_charge_name }}</oa-item>
			<oa-item label="职位">{{ formValidate.position_name }}</oa-item>
			<oa-item label="角色">{{ formValidate.role_name }}</oa-item>
			<oa-item label="兼部门">
				<div
					:class="formValidate.extra_depart.length>0?'g-operation':''"
					@click="handleDepartChange(true)"
				>已选{{ formValidate.extra_depart.length }}个兼部门</div>
			</oa-item>
			<oa-item label="兼角色">
				<div
					:class="formValidate.extra_role.length>0?'g-operation':''"
					@click="handleExtraRole(true)"
				>已选{{ formValidate.extra_role.length }}个兼角色</div>
			</oa-item>
			<oa-item label="入职时间">{{ formValidate.create_time }}</oa-item>
			<oa-item label="转正时间">{{ formValidate.regular_time }}</oa-item>
			<oa-item label="试用期">{{ formValidate.try_time_name }}</oa-item>
			<oa-item label="工龄">{{ formValidate.work_day }}</oa-item>
			<oa-item label="管理工龄">{{ formValidate.manager_day }}</oa-item>
			<oa-item label="坐席号">{{ formValidate.seat_number }}</oa-item>
			<oa-item label="外线号码">{{ formValidate.pstn_number }}</oa-item>
			<oa-item label="座机号码">{{ formValidate.tel }}</oa-item>
			<oa-item label="企业邮箱">{{ formValidate.email }}</oa-item>
			<oa-item label="招聘渠道">{{ formValidate.add_type }}</oa-item>
		</div>
		<oa-record :position="formValidate.position_change" :staff-id="formValidate.staff_id"/>
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
	Cascader,
	Message,
	Row,
	Col,
	Radio,
	RadioGroup
} from "iview";
// utils
import moment from "moment";
import { dataValidity, getHashUrl, unCode } from "@utils/utils";
import { ImgsPicker } from "wya-vc";
import { services } from "@stores/services/hr";
import Record from "./record";
import { DepartModal } from "../../../employee-summary-entry/popup/depart";
import { RoleModal } from "../../../employee-summary-entry/popup/role";
import DetailItem from "../detail-item";
import Title from "../../../_common/title";

export default {
	name: "oa-content",
	components: {
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-select": Select,
		"i-option": Option,
		"i-date-picker": DatePicker,
		"i-cascader": Cascader,
		"i-row": Row,
		"i-col": Col,
		"i-radio-group": RadioGroup,
		"i-radio": Radio,
		"vc-imgs-picker": ImgsPicker,
		"oa-record": Record,
		"oa-item": DetailItem,
		"oa-title": Title
	},
	mixins: [
		services.departAll(),
		services.departPosition(),
		services.signTime()
	],
	data() {
		const { query } = this.$route;
		return {
			allRoles: [],
			queryStaffStatus: query.staff_status,
			status: false,
			isLoading: false,
			positionArr: [],
			new_depart_id: '',
			tryTimeStatus: true,
			formValidate: {
				staff_id: "",
				is_charge_name: "",
				staff_number: "", // 工号
				depart_id: [], // 部门id
				position_id: [], // 职位id
				create_time: "", // 入职时间
				regular_time: "", // 转正时间
				try_time: "", // 试用期，单位：月
				seat_number: "", // 坐席号
				pstn_number: "", // 外线号码
				email: "", // 邮箱
				add_type: "", // 招聘渠道
				role_id: "", // 角色id
				role_name: "", // 角色名称
				position_name: "", // 职位名称
				depart_name: "", // 部门名称
				work_day: "", // 工龄
				try_time_name: "",
				is_charge: "", // 是否为管理， 1：是；0：否
				extra_depart_num: "", // 兼部门数
				extra_role_num: "", // 兼角色数
				extra_role: [],
				extra_depart: [],
				sign_time: "",
				manager_day: "", // 管理工龄
				position_change: []
			},
			ruleValidate: {
				staff_number: [{ required: true, message: "工号为必填" }],
				my_company: [
					{
						required: true,
						message: "请选择我方合同公司",
						trigger: "change"
					}
				],
				try_time: [
					{
						required: true,
						type: "number",
						message: "试用期时长必选",
						trigger: "change"
					}
				],
				create_time: [
					{
						required: true,
						type: "date",
						message: "请选择入职时间",
						trigger: "change"
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
				depart_id: [
					{
						required: true,
						type: "array",
						message: "请选择部门",
						trigger: "change"
					}
				],
				position_id: [
					{
						required: true,
						type: "number",
						message: "请选择职位",
						trigger: "change"
					}
				]
			}
		};
	},
	watch: {
		$route(to, from) {
			if (unCode(to.query.staff_id) != unCode(from.query.staff_id)) {
				this.fetchJobInfo();
			}
		}
	},
	mounted() {
		const { query = {} } = this.$route;
		this.fetchJobInfo();
		query.from === 'avatar' && this.fetchNewDepartId();
	},
	methods: {
		handleCancel() {
			this.fetchJobInfo();
		},
		fetchNewDepartId() {
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_SUMMARY_ENTRY_NEW_DEPART_ID_GET,
				type: "GET",
				param: {}
			}).then(res => {
				this.new_depart_id = res.data[0];
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleChange(value, selectedData) {
			this.positionArr = [];
			this.formValidate.position_id = "";
			value[0] && this.handleEntryPosition(value[0]);
		},
		handleEntryPosition(id) {
			this.$request({
				url: API_ROOT.HR_POSITION_LIST_GET,
				type: "GET",
				param: {
					depart_id: id || this.new_depart_id,
					type: 1
				},
				loading: false
			}).then(res => {
				this.positionArr = res.data.list;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleSelectRole(query) {
			this.isLoading = true;
			this.$request({
				url: API_ROOT._HR_ROLE_DATA_GET,
				type: "GET",
				param: {
					role_name: query
				}
			}).then(res => {
				this.isLoading = false;
				this.allRoles = res.data;
			});
		},
		fetchJobInfo() {
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_SUMMARY_DETAILS_JOB_INFO_GET,
				type: "GET",
				param: {
					staff_id: unCode(this.$route.query.staff_id)
				}
			}).then(res => {
				this.formValidate = { ...this.formValidate, ...res.data };
				this.status = false;
				this.handleSelectRole(res.data.role_name);
				this.handleEntryPosition(res.data.depart_id);
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleJobInfo() {
			this.$refs.form.validate(isValid => {
				if (isValid) {
					this.$request({
						url:
                            API_ROOT._HR_EMPLOYEE_SUMMARY_DETAILS_EDIT_JOB_INFO_POST,
						type: "POST",
						param: {
							staff_id: unCode(this.$route.query.staff_id),
							...this.formValidate,
							position_id: this.formValidate.position_id[this.formValidate.position_id.length - 1],
							create_time: moment(
								this.formValidate.create_time
							).format("YYYY-MM-DD")
						}
					}).then(res => {
						setTimeout(() => {
							this.$Message.success(res.msg);
							this.fetchJobInfo();
							this.$router.replace(
								getHashUrl("/hr/employee/summary/details", {
									...this.$route.query,
									name: Math.floor(Math.random() * 100)
								})
							);
							
						}, 500);
						
					}).catch(err => {
						this.$Message.error(err.msg);
					});
				} else {
					this.$Message.error(err.msg);
				}
			});
		},
		handleEdit() {
			this.status = true;
		},
		handleDepartChange(bool) {
			if (this.formValidate.extra_depart.length || this.status) {
				DepartModal.popup({
					extra_depart: this.formValidate.extra_depart,
					show: bool
				}).then(res => {
					this.formValidate.extra_depart = res;
				});
			}
			
		},
		handleExtraRole(bool) {
			if (this.formValidate.extra_role.length || this.status) {
				RoleModal.popup({ 
					extra_role: this.formValidate.extra_role, 
					show: bool,
					is_auth: this.formValidate.is_auth,
				}).then(
					res => (this.formValidate.extra_role = res)
				);
			}
			
		}
	}
};
</script>

<style lang="scss" >
.v-hr-imformation-form {
	width:1200px;
    ._form {
        margin-top: 16px;
    }
   .__oaitem {
			width: 850px;
			margin-left: 10px ;
		}
}
</style>