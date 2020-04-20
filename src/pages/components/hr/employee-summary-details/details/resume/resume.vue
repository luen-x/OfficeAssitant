<template>
	<div class="oa-hr-summary-details-resume">
		<vc-debounce-click 
			class="g-red-btn-line" 
			style="width:40px;textAlign:center;marginLeft:690px"
			@click="handlePrint"
		>
			打印
		</vc-debounce-click >
		<div class="g-flex g-fd-c">
			<oa-person-info :date-obj="formValidate"/>
			<oa-identity-info :date-obj="formValidate" />
			<oa-educational-info :date-obj="formValidate"/>
			<oa-other-info :date-obj="formValidate"/>
			<oa-edu-experience :date-obj="formValidate"/>
			<oa-work-experience :date-obj="formValidate"/>
			<div style="display: none">
				<vc-print ref="pageTarget">
					<oa-print :info="info"/>
				</vc-print>
			</div>
		</div>
	</div>
</template>

<script>
import API_ROOT from "@stores/apis/root";
// utils
import moment from "moment";
import { Print } from "wya-vc";
import lodash from "lodash";
import { dataValidity, getHashUrl, unCode } from "@utils/utils";
import PersonInfo from "./components/person-info";
import IdentityInfo from "./components/identity-info";
import EducationalInfo from "./components/educational-info";
import OtherInfo from "./components/other-info";
import EduExperience from "./components/edu-experience";
import WorkExperience from "./components/work-experience";
import ResumePrint from "../../../employee-summary-resume/print";

export default {
	name: "oa-hr-summary-details-resume",
	components: {
		"oa-person-info": PersonInfo,
		"oa-identity-info": IdentityInfo,
		"oa-educational-info": EducationalInfo,
		"oa-other-info": OtherInfo,
		"oa-edu-experience": EduExperience,
		"oa-work-experience": WorkExperience,
		"oa-print": ResumePrint,
		"vc-print": Print
	},
	
	data() {
		return {
			info: {},
			formValidate: {
				type: 0,
				applicant_name: "",
				sex: "",
				height: "",
				position_name: "",
				nation_name: "",
				hobby: "",
				blood: "",
				constellation: "",
				salary: "",
				mobile: "",
				wechat: "",
				position_id: [], // "商务经理"
				region: [],
				email: "",
				id_card: "",
				birthday: "",
				nation_id: [],
				native: '',
				is_married: "",
				birthday_type: "",
				address: "",
				now_address: "",
				college: "",
				graduate_time: "", // 毕业时间
				education: [], // 学历
				education_id: "",
				profession: "", // 专业
				important_name: "", // 紧急联系人姓名
				important_phone: "", // 紧急联系人电话
				specially: "", // 个人特长
				english_skills: "", // 外语能力
				english_skills_name: "",
				computer_skills: "", // 计算机能力
				computer_skills_name: "",
				front_impression: "", // 对前台的印象
				front_impression_name: "",
				edu_experience: [],
				job_experience: [],
				education_name: "",
				ali_sesame_credit: "",
				last_social_company: "",
				social_suspension_date: "",
			},
		};
	},
	watch: {
		$route(to, from) {
			if (unCode(to.query.staff_id) != unCode(from.query.staff_id)) {
				this.loadApplicantInfo('0');
			}
		}
	},
	mounted() {
		this.loadApplicantInfo('0');
	},
	methods: {
		loadApplicantInfo(type, name) {
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_SUMMARY_CHECK_RESUME_GET,
				type: "GET",
				param: {
					staff_id: unCode(this.$route.query.staff_id),
					type
				},
				loading: false
			}).then(res => {
				if (res.data.edu_experience && res.data.edu_experience.length > 0) {
					res.data.edu_experience.forEach(item => {
						item.edu_time = [item.edu_start_time, item.edu_end_time];
					});
				}
				if (res.data.job_experience && res.data.job_experience.length > 0) {
					res.data.job_experience.forEach(item => {
						item.job_time = [item.job_start_time, item.job_end_time];
					});
				}
				if (res.data.constellation_name) {
					res.data.constellation = res.data.constellation_name;
				}
				this.formValidate = { ...this.formValidate, ...res.data };
				this.formValidate.region = res.data.province ? [res.data.province, res.data.city] : [];
				this.$forceUpdate();
				this.info = this.formValidate;
				this[name] = false;
			}).catch(err => {});
		},
		
		handlePrint: lodash.debounce(function (event) {
			this.$refs.pageTarget.print();
		}, 300),
	}
};
</script>

<style lang="scss">
.oa-hr-summary-details-resume {
    padding-bottom: 68px;
    ._oaitem {
        margin-left: 10px;
    }
    ._add {
        display: inline-block;
        margin: 0px 10px;
    }
    ._height {
        position: relative;
        .__cm {
            position: absolute;
            right: 8px;
            top: 0px;
        }
    }
	._education {
        padding-top: 30px;
        margin-left: -20px;
        background-color: #fafafa;
		margin-bottom:10px;
        position: relative;
    }
	._edu {
		padding-left: 40px;
        margin-left: -30px;
        background-color: #fafafa;
		margin-bottom:10px;
    }
    ._del {
        position: absolute;
        top: 8px;
        right: 18px;
        font-size: 14px !important;
        display: inline-block;
    }
}
</style>
