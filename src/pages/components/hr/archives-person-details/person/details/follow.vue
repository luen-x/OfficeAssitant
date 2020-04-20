<template>
	<div class="v-hr-archives-person-details-person-follow">
		<div class="g-flex g-flex-ac">
			<oa-title title="个人信息"/>
			<div class="g-m-lr-15 g-fs-14 g-operation">
				<span v-if="personalStatus">
					<span class="g-m-lr-15" @click="handleSubmitInfo(1)">保存</span>
					<span @click="handleCancel(1)">取消</span>
				</span>
				<span v-else @click="handleEdit(1)">编辑</span>
			</div>
		</div>
		<i-form
			v-if="personalStatus"
			ref="form1"
			:model="formData"
			:rules="ruleValidate"
			:label-width="100"
			style="width: 900px"
			class="_form"
			inline
			position="center"
		>
			<i-form-item label="室友：" prop="roomie">
				<i-input
					v-model="formData.roomie"
					:maxlength="10"
					style="width: 300px"
					placeholder="请输入室友"
				/>
			</i-form-item>
			<i-form-item label="结婚纪念日：" prop="married_day">
				<i-date-picker
					v-model="formData.married_day"
					style="width: 300px"
					type="date"
					placeholder="请选择结婚纪念日"
				/>
			</i-form-item>
		</i-form>
		<div v-else class="status">
			<div class="__oaitem">
				<oa-item label="室友">{{ formData.roomie }}</oa-item>
				<oa-item label="结婚纪念日">{{ formData.married_day }}</oa-item>
			</div>
		</div>
		<div class="g-flex g-flex-ac g-m-t-20 g-m-b-5">
			<oa-title title="家庭成员"/>
			<span v-if="familyStatus" class="g-operation g-m-lr-15">
				<span class="g-m-lr-15" @click="handleSubmitInfo(2)">保存</span>
				<span @click="handleCancel(2)">取消</span>
				<span
					v-if="formData.family.length < 5"
					class="g-m-lr-15 g-operation"
					@click="handleAddFamily"
				>添加</span>
			</span>
			<span v-else class="g-operation g-m-lr-15" @click="handleEdit(2)">编辑</span>
		</div>
		<i-form
			v-if="familyStatus"
			ref="form2"
			:model="formData"
			:rules="ruleValidate"
			:label-width="100"
			style="width: 900px"
			class="_form"
			inline
			position="center"
		>
			<div class="g-flex g-flex-ac">
				<div class="g-fs-14">
					<div v-for="(item,index) in formData.family" :key="index">
						<div class="_family">
							<div class="g-m-t-10 g-fr g-operation _del" @click="handleDelFamily(index)">删除</div>
							<i-form-item label="姓名：" prop="family_name">
								<i-input
									v-model="item.family_name"
									:maxlength="10"
									style="width: 300px"
									placeholder="请输入姓名"
								/>
							</i-form-item>
							<i-form-item label="与本人关系：" prop="family_relation">
								<i-input
									v-model="item.family_relation"
									:maxlength="10"
									style="width: 300px"
									placeholder="请输入与本人关系"
								/>
							</i-form-item>
							<i-form-item label="手机号：" prop="family_phone">
								<i-input
									v-model="item.family_phone"
									:maxlength="11"
									style="width: 300px"
									placeholder="请输入手机号"
								/>
							</i-form-item>
							<i-form-item label="出生日期：" prop="family_birthday">
								<i-date-picker
									v-model="item.family_birthday"
									style="width: 300px"
									type="date"
									placeholder="请选择出生日期"
								/>
							</i-form-item>
							<i-form-item label="年龄：" prop="family_age">
								<i-input
									v-model="item.family_age"
									:maxlength="5"
									style="width: 300px"
									placeholder="请输入年龄"
								/>
							</i-form-item>
						</div>
					</div>
				</div>
			</div>
		</i-form>
		<div v-else class="__oaitem">
			<div v-for="(item,index) in formData.family" :key="index" >
				<oa-item label="姓名">{{ item.family_name }}</oa-item>
				<oa-item label="与本人关系">{{ item.family_relation }}</oa-item>
				<oa-item label="手机号">{{ item.family_phone }}</oa-item>
				<oa-item label="出生日期">{{ item.family_birthday }}</oa-item>
				<oa-item label="年龄">{{ item.family_age }}</oa-item>
			</div>
		</div>
		<div class="g-flex g-flex-ac g-m-t-20 g-m-b-5">
			<oa-title title="业务模块"/>
			<div class="g-m-lr-15 g-fs-14 g-operation">
				<span v-if="businessStatus">
					<span class="g-m-lr-15" @click="handleSubmitInfo(3)">保存</span>
					<span @click="handleCancel(3)">取消</span>
				</span>
				<span v-else @click="handleEdit(3)">编辑</span>
			</div>
		</div>
		<i-form
			v-if="businessStatus"
			ref="form3"
			:model="formData"
			:rules="ruleValidate"
			:label-width="100"
			style="width: 900px"
			class="_form"
			inline
			position="center"
		>
			<i-form-item label="师傅：">
				<i-select
					v-model="formData.master_name"
					:remote-method="loadStaff"
					:loading="staffLoading"
					:placeholder="'请输入姓名'"
					style="width: 300px"
					filterable
					remote
					clearable
					transfer
				>
					<i-option
						v-for="(item, index) in staffData"
						:key="index"
						:value="item.label"
					>{{ item.label }}</i-option>
				</i-select>
			</i-form-item>
			<i-form-item label="对手：">
				<i-select
					v-model="formData.analogue_name"
					:remote-method="loadStaff"
					:loading="staffLoading"
					:placeholder="'请输入姓名'"
					style="width: 300px"
					filterable
					remote
					clearable
					transfer
				>
					<i-option
						v-for="(item, index) in staffData"
						:key="index"
						:value="item.label"
					>{{ item.label }}</i-option>
				</i-select>
			</i-form-item>
			<i-form-item label="标杆：">
				<i-select
					v-model="formData.sightcing_name"
					:remote-method="loadStaff"
					:loading="staffLoading"
					:placeholder="'请输入姓名'"
					style="width: 300px"
					filterable
					remote
					clearable
					transfer
				>
					<i-option
						v-for="(item, index) in staffData"
						:key="index"
						:value="item.label"
					>{{ item.label }}</i-option>
				</i-select>
			</i-form-item>
			<i-form-item label="自我评价：" prop="business_self_appraise">
				<oa-limit-words
					v-model="formData.business_self_appraise"
					:max="500"
					style="width:300px"
					placeholder="请输入自我评价"
				/>
			</i-form-item>
		</i-form>
		<div v-else class="__oaitem">
			<oa-item label="师傅">{{ formData.master_name }}</oa-item>
			<oa-item label="对手">{{ formData.analogue_name }}</oa-item>
			<oa-item label="标杆">{{ formData.sightcing_name }}</oa-item>
			<oa-item label="自我评价">{{ formData.business_self_appraise }}</oa-item>
		</div>
		<div class="g-flex g-flex-ac g-m-t-20 g-m-b-5" >
			<oa-title title="自我定位" />
			<div class="g-m-lr-15 g-fs-14 g-operation">
				<span v-if="selfStatus">
					<span class="g-m-lr-15" @click="handleSubmitInfo(4)">保存</span>
					<span @click="handleCancel(4)">取消</span>
				</span>
				<span v-else @click="handleEdit(4)">编辑</span>
			</div>
		</div>
		<i-form
			v-if="selfStatus"
			ref="form4"
			:model="formData"
			:rules="ruleValidate"
			:label-width="100"
			style="width: 900px"
			class="_form"
			inline
			position="center"
		>
			<i-form-item label="最近想做的事：" prop="want_do_thing">
				<oa-limit-words
					v-model="formData.want_do_thing"
					:max="500"
					style="width:300px"
					placeholder="请输入最近想做的事"
				/>
			</i-form-item>
			<i-form-item label="自我评价：" prop="character_self_appraise">
				<oa-limit-words
					v-model="formData.character_self_appraise"
					:max="500"
					style="width:300px"
					placeholder="请输入自我评价"
				/>
			</i-form-item>
			<i-form-item label="自我评价优点：" prop="merit_self_appraise">
				<oa-limit-words
					v-model="formData.merit_self_appraise"
					:max="500"
					style="width:300px"
					placeholder="请输入自我评价优点"
				/>
			</i-form-item>
			<i-form-item label="自我评价缺点：" prop="defect_self_appraise">
				<oa-limit-words
					v-model="formData.defect_self_appraise"
					:max="500"
					style="width:300px"
					placeholder="请输入自我评价缺点"
				/>
			</i-form-item>
			<i-form-item label="个人IP打造:" prop="personal_IP">
				<oa-upload
					:upload="{accept: '.doc, .docx, .xls, .xlsx, .ppt,.pptx, .rar, .pdf'}"
					v-model="formData.personal_IP"
					:max="10"
					style="width: 300px"
					class="g-m-t-10"
				/>
			</i-form-item>
		</i-form>
		<div v-else class="__oaitem">
			<oa-item label="最近想做的事">{{ formData.want_do_thing }}</oa-item>
			<oa-item label="自我评价">{{ formData.character_self_appraise }}</oa-item>
			<oa-item label="自我评价优点">{{ formData.merit_self_appraise }}</oa-item>
			<oa-item label="自我评价缺点">{{ formData.defect_self_appraise }}</oa-item>
			<oa-item label="个人IP打造">
				<div class="g-m-t-15">
					<oa-upload
						v-model="formData.personal_IP"
						disabled
						style="width: 300px"
					/>
				</div>
			</oa-item>
		</div>
	</div>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import {
	getParseUrl,
	getHashUrl,
	formatMoment,
	getItem,
	dataValidity
} from "@utils/utils";
import { services, staffByMutiTerm } from "@stores/services/hr";
import {
	Form,
	FormItem,
	Input,
	Select,
	Option,
	DatePicker,
	Button
} from "iview";
import Upload from "@components/_common/upload/upload";
import moment from "moment";
import LimitWords from "@components/_common/limit-words/limit-words";
import Title from "../../../_common/title";
import DetailItem from "../../common/detail-item";

export default {
	name: "v-hr-archives-person-details-person-follow",
	components: {
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-select": Select,
		"i-option": Option,
		"i-date-picker": DatePicker,
		"i-button": Button,
		"oa-title": Title,
		"oa-item": DetailItem,
		"oa-limit-words": LimitWords,
		"oa-upload": Upload
	},
	mixins: [staffByMutiTerm],
	data() {
		const { query = {} } = this.$route;
		return {
			allRoles: [],
			status: false,
			personalStatus: false,
			familyStatus: false,
			businessStatus: false,
			selfStatus: false,
			isLoading: false,
			formData: {
				roomie: "", // 室友
				married_day: "", // 结婚纪念日
				family: [],
				master_name: "", // 师傅名称
				analogue_name: "", // 对手名称
				sightcing_name: "", // 标杆姓名
				business_self_appraise: "", // 业务自我评价
				want_do_thing: "", // 最近的想做的事
				character_self_appraise: "", // 性格自我评价
				merit_self_appraise: "", // 自我评价优点
				defect_self_appraise: "", // 自我评价缺点
				personal_IP: [] // 个人IP打造url数组
			},
			ruleValidate: {
				create_time: [
					{
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
					{ min: 11, message: "请输入11位数", trigger: "blur" }
				],
				position_id: [
					{
						type: "number",
						message: "请选择职位",
						trigger: "change"
					}
				]
			}
		};
	},
	mounted() {
		this.loadBaseInfo();
	},
	methods: {
		handleSubmitInfo(num) {
			this.$refs['form' + num].validate(isValid => {
				if (isValid) {

					if (this.formData.personal_IP.length > 10 && num === 4) {
						this.$Message.error("个人IP打造文件超过10个！");
						return;
					}
					if (this.formData.married_day && num === 1) {
						this.formData.married_day = moment(
							this.formData.married_day
						).format("YYYY-MM-DD");
					}
					if (this.formData.family.length && num === 2) {
						this.formData.family.map((item, index) => {
							return (item.family_birthday = item.family_birthday
								? moment(item.family_birthday).format(
									"YYYY-MM-DD"
								)
								: "");
						});
					}
					this.$request({
						url: API_ROOT._HR_ARCHIVES_PERSON_DETAIL_PERSON_ADD_FOLLOW_POST,
						type: "POST",
						param: {
							staff_id: this.$route.query.staff_id,
							scenario: this.$route.query.scenario,
							...this.formData,
							follow_info_type: num
						}
					}).then(res => {
						this.$Message.success(res.msg);
						// this.loadBaseInfo(num);
						this.handleCancel(num);
					}).catch(err => {
						this.$Message.error(err.msg);
					});
				} else {
					this.$Message.error(err.msg);
				}
			});
		},
		handleEdit(num) {
			switch (num) {
				case 1:
					this.personalStatus = true;
					break;
				case 2:
					this.familyStatus = true;
					break;
				case 3:
					this.businessStatus = true;
					break;
				case 4:
					this.selfStatus = true;
					break;
				default:
					break;
			}
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
		loadBaseInfo(follow_info_type) {
			this.$request({
				url: API_ROOT._HR_ARCHIVES_PERSON_DETAIL_PERSON_PERSON_GET,
				type: "GET",
				param: {
					staff_id: this.$route.query.staff_id,
					scenario: this.$route.query.scenario,
					type: 4,
					follow_info_type
				}
			}).then(res => {
				this.formData = { ...this.formData, ...res.data };
				this.handleSelectRole(res.data.role_name);
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleStaffChange(obj) {
			this.formData.role_id = obj && obj.value ? obj.value : "";
			this.formData.staff_name = obj && obj.label ? obj.label : "";
		},
		handleQueryChange(query = "") {
			let targetQuery = this.formData.staff_name || "";
			if (query.length == 0) {
				this.formData.role_id = "";
				this.handleSelectRole(query);
			}
			if (targetQuery.length > query.length) {
				this.$refs.staff.clearSingleSelect();
			}
		},
		handleCancel(num) {
			switch (num) {
				case 1:
					this.personalStatus = false;
					break;
				case 2:
					this.familyStatus = false;
					break;
				case 3:
					this.businessStatus = false;
					break;
				case 4:
					this.selfStatus = false;
					break;
				default:
					break;
			}
			this.loadBaseInfo(num);
		},
		handleAddFamily() {
			this.formData.family.push({
				family_name: "",
				family_relation: "",
				family_phone: "",
				family_birthday: "",
				family_age: ""
			});
		},
		handleDelFamily(index) {
			this.formData.family.splice(index, 1);
		},
		handleStaffSearch(staff = {}) {
			this.staff = staff.value || "";
			this.staff_label = staff.label || "";
			this.handleSearch();
		}
	}
};
</script>

<style lang="scss">
.v-hr-archives-person-details-person-follow {
	margin-top: 20px;
    ._family {
        position: relative;
        width: 830px;
        padding-top: 30px;
        ._del {
            top: -13px;
            right: 18px;
            position: absolute;
        }
    }
    .__oaitem {
		width: 1000px;
		margin-left:10px;
        ._title {
            margin-top: 40px;
            margin-bottom: 25px;
        }
        ._content {
			// ._item{
			// 	margin-top:10px;
			// }
			._title{
				margin: 10px 0px 0px;
			}
        }
    }
}
</style>