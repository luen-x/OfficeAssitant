<template>
	<div class="g-flex g-fd-c">
		<i-form
			ref="form2"
			:model="formValidate"
			:rules="ruleValidate"
			:label-width="120"
			style="width: 850px"
			position="center"
		>
			<div class="g-flex g-flex-ac g-m-t-20">
				<oa-title title="身份信息"/>
				<div
					v-if="($auth['209']||($auth['678']&&$auth['679']))&& queryStaffStatus !=='4'"
					class="g-m-lr-15 g-operation"
					@click="handleEdit('身份信息')"
				>
					<span v-if="idStatus" class="g-fs-14">
						<span class="g-m-lr-15" @click="handleSubmit(2,'idStatus')">保存</span>
						<span @click="handleCancel(2,'idStatus')">取消</span>		
					</span>
					<span v-else class="g-fs-14">编辑</span>
				</div>
			</div>
			<div v-if="idStatus" class="g-flex-ac g-jc-sb g-fw-w g-ai-fs">
				<i-form-item label="身份证号：" prop="id_card" style="width:50%">
					<i-input
						v-model="formValidate.id_card"
						:maxlength="18"
						style="width: 300px"
						placeholder="请输入身份证号"
					/>
				</i-form-item>
				<i-form-item label="生日类型：" prop="birthday_type" style="width:50%">
					<i-radio-group v-model="formValidate.birthday_type">
						<i-radio label="0">公历</i-radio>
						<i-radio label="1">农历</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="公历生日：" prop="birthday" style="width:50%">
					<i-date-picker
						v-model="formValidate.birthday"
						format="yyyy-MM-dd"
						style="width: 300px"
						type="date"
						placeholder="请选择公历生日"
						@on-change="handleChange"
					/>
				</i-form-item>
				<i-form-item label="民族：" prop="nation_id" style="width:50%">
					<i-select
						v-model="formValidate.nation_id"
						clearable
						placeholder="请选择民族"
						style="width: 300px"
					>
						<i-option
							v-for="(item, index) in nations"
							:key="index"
							:value="item.value"
						>{{ item.label }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="星座：" style="width:50%">
					<i-input
						v-model="formValidate.constellation_name"
						:maxlength="20"
						disabled
						style="width: 300px"
						placeholder="暂无星座信息"
					/>
				</i-form-item>
				<i-form-item label="婚否：" prop="is_married" style="width:50%">
					<i-radio-group v-model="formValidate.is_married">
						<i-radio label="0">未婚</i-radio>
						<i-radio label="1">已婚</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="籍贯：" prop="region">
					<i-cascader
						v-model="formValidate.region"
						:data="region"
						style="width: 300px; display: inline-block"
						clearable
						transfer
						trigger="hover"
						placeholder="请选择籍贯"
						@on-change="handleRegion"
					/>
				</i-form-item>
				<i-form-item label="户口地址：" prop="address" style="width:50%">
					<oa-limit-words
						v-model="formValidate.address"
						:max="50"
						style="width: 300px"
						placeholder="请输入身份证上的地址"
					/>
				</i-form-item>
				<i-form-item label="现住地址：" prop="now_address" style="width:50%">
					<oa-limit-words
						v-model="formValidate.now_address"
						:max="50"
						style="width: 300px"
						placeholder="请输入现住地址"
					/>
				</i-form-item>
				<i-form-item label="健康状况：" style="width:50%">
					<i-input
						v-model="formValidate.health_condition"
						:maxlength="10"
						style="width: 300px"
						placeholder="请输入健康状况"
					/>
				</i-form-item>
				<i-form-item label="重大病史:" prop="has_medical_history">
					<i-radio-group v-model="formValidate.has_medical_history">
						<i-radio label="1">有</i-radio>
						<i-radio label="2" style="margin-left:50px">无</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item v-if="formValidate.has_medical_history=='1'" label="病史说明:" prop="medical_history">
					<oa-limit-words
						v-model="formValidate.medical_history"
						:max="200"
						style="width:300px"
						placeholder="请详细说明情况，便于工作岗位和强度安排"
					/>
				</i-form-item>
			</div>
			<div v-else class="_oaitem">
				<oa-item label="身份证号">{{ formValidate.id_card }}</oa-item>
				<oa-item label="生日类型">{{ formValidate.birthday_type==0?'公历':'农历' }}</oa-item>
				<oa-item label="公历生日">{{ formValidate.birthday }}</oa-item>
				<oa-item label="民族">{{ formValidate.nation_name }}</oa-item>
				<oa-item label="星座">{{ formValidate.constellation_name }}</oa-item>
				<oa-item label="婚否">{{ formValidate.is_married==0?'未婚':'已婚' }}</oa-item>
				<oa-item label="籍贯">{{ formValidate.native }}</oa-item>
				<oa-item label="户口地址">{{ formValidate.address }}</oa-item>
				<!-- <div> -->
				<oa-item label="现住地址">{{ formValidate.now_address }}</oa-item>
				<!-- </div> -->
				<oa-item label="健康状况">{{ formValidate.health_condition }}</oa-item>
				<oa-item label="重大病史">{{ formValidate.has_medical_history_name }}</oa-item>
				<oa-item v-if="formValidate.has_medical_history=='1'" label="病史说明">{{ formValidate.medical_history }}</oa-item>
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
	Cascader,
	Message,
	Row,
	Col,
	RadioGroup,
	Radio
} from "iview";
// utils
import moment from "moment";
import { dataValidity, getHashUrl, unCode } from "@utils/utils";
import { ImgsPicker } from "wya-vc";
import { services } from "@stores/services/hr";
import { log } from "util";
import { services as commonServices } from '@stores/services/common';
import LimitWords from '@components/_common/limit-words/limit-words';
import Title from "../../../../_common/title";
import DetailItem from "../../detail-item";

export default {
	name: "oa-hr-summary-details-identity-info",
	components: {
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-select": Select,
		"i-option": Option,
		"i-date-picker": DatePicker,
		"i-row": Row,
		"i-col": Col,
		"i-cascader": Cascader,
		"i-radio-group": RadioGroup,
		"i-radio": Radio,
		"oa-title": Title,
		'oa-limit-words': LimitWords,
		"oa-item": DetailItem
	},
	mixins: [
		services.constellation(),
		services.nations(),
		commonServices.region()
	],
	props: {
		dateObj: {
			type: Object
		},
	},
	data() {
		const { query } = this.$route;
		return {
			idStatus: false,
			queryStaffStatus: query.staff_status,
			formValidate: this.dateObj,
			ruleValidate: {
				id_card: [
					{
						required: true,
						message: "身份证为必填",
					},
					{
						required: true,
						message: "身份证位数不正确",
						min: 18
					},
					{
						type: "validId",
						message: "身份证格式不正确",
						validator: dataValidity
					}
				],
				birthday: [
					{
						required: true,
						type: "date",
						message: "请输入公历生日",
						trigger: "change"
					}
				],
				birthday_type: [
					{
						required: true,
						message: "生日类型为必选",
						trigger: "change"
					}
				],
				nation_id: [
					{
						required: true,
						message: "民族为必选",
						type: "number",
						trigger: "change"
					}
				],
				is_married: [
					{
						required: true,
						message: "婚姻为必选",
						trigger: "change"
					}
				],
				region: [
					{
						required: true,
						type: "array",
						message: "籍贯为必选",
						trigger: "change",
						validator: this.validatorRegion 
					}
				],
				address: [
					{
						required: true,
						message: "户口地址为必填",
						trigger: "blur"
					},
					{
						type: "string",
						max: 50,
						message: "最多50个字",
						trigger: "blur"
					}
				],
				now_address: [
					{
						required: true,
						message: "现住地址为必填",
						trigger: "blur"
					},
					{
						type: "string",
						max: 50,
						message: "最多50个字",
						trigger: "blur"
					}
				],
				health_condition: [
					{
						required: true,
						message: "健康状况为必填",
						trigger: "blur"
					}
				],
				has_medical_history: [
					{
						required: true,
						message: "重大病史为必选",
						trigger: "change"
					}
				],
				medical_history: [
					{
						required: true,
						message: "病史说明为必填",
						trigger: "blur"
					}
				],
			}
		};
	},
	watch: {
		dateObj(value) {
			this.formValidate = value;
		}
	},
	methods: {
		handleChange(data) {
			let month = data.slice(5, 7);
			let day = data.slice(8, 10);
			this.getAstro(month, day);
		},
		getAstro(month, day) {
			let s = "魔羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯";
			let arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
			this.formValidate.constellation = s.substr(month * 2 - (day < arr[month - 1] ? 2 : 0), 2) + "座";
			return this.formValidate.constellation;
		},
		handleSubmit(type, name) {
			this.$refs[`form${type}`].validate(isValid => {
				if (isValid) {
					this.handleFetch(type, name);
				}
			});
		},
		handleFetch(type, name) {
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_SUMMARY_RESUME_RESUME_POST,
				type: "POST",
				param: {
					staff_id: unCode(this.$route.query.staff_id),
					...this.formValidate,
					type,
					province: this.formValidate.region[0],
					city: this.formValidate.region[1],
					birthday: this.formValidate.birthday ? moment(this.formValidate.birthday).format(
						"YYYY-MM-DD"
					) : "",
					graduate_time: this.formValidate.birthday ? moment(
						this.formValidate.graduate_time
					).format("YYYY-MM") : ''
				},
				loading: false
			}).then(res => {
				this[name] = false;
				this.fetchApplicantInfo(type);
				// this.$router.replace(
				// 	getHashUrl("/hr/employee/summary/details", {
				// 		...this.$route.query,
				// 		name: Math.floor(Math.random() * 100)
				// 	})
				// );
				this.$Message.success(res.msg);
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleCancel(type, name) {
			this.fetchApplicantInfo(type, name);
		},
		handleRegion(value) {
			if (value.length == 0) {
				this.formValidate.city = 0;
				this.formValidate.province = 0;
			}
			this.formValidate.region = value;
			this.$forceUpdate();
		},
		validatorRegion(rule, value, callback) {
			if (this.formValidate.region[0]) {
				callback();
			} else {
				callback(new Error('籍贯为必选')); 
			}
		},
		fetchApplicantInfo(type, name) {
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_SUMMARY_CHECK_RESUME_GET,
				type: "GET",
				param: {
					staff_id: unCode(this.$route.query.staff_id),
					type
				},
				loading: false
			}).then(res => {
				if (res.data.constellation_name) {
					res.data.constellation = res.data.constellation_name;
				}
				this.formValidate.region = res.data.province ? [res.data.province, res.data.city] : [];
				this.formValidate = { ...this.formValidate, ...res.data };
				this[name] = false;
			}).catch(err => {});
		},
		handleEdit(type) {
			this.idStatus = true;
		},
	}
};
</script>

