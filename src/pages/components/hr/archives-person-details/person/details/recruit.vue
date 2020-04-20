<template>
	<div class="g-flex" style="max-height: calc(100% - 275px);">
		<div class="g-m-b-20 v-hr-archives-person-details-recruit">
			<div v-if="add_type==='3'">
				<oa-title title="基本信息" class="_title"/>
				<div class="_content">
					<oa-item label="应聘职位" >{{ recruitData.position_name }}</oa-item>
					<oa-item label="备选职位" >{{ recruitData.alternative_position_name }}</oa-item>
					<oa-item label="招聘会学校" >{{ recruitData.school }}</oa-item>
					<oa-item label="招聘会时间" >{{ recruitData.meeting_time }}</oa-item>
					<oa-item label="毕业学校" >{{ recruitData.college }}</oa-item>
					<oa-item label="专业" >{{ recruitData.profession }}</oa-item>
					<oa-item label="学历" >{{ recruitData.education_name }}</oa-item>
					<oa-item label="车票信息" >{{ recruitData.ticket_info_all }}</oa-item>
					<oa-item label="面试结果" >{{ recruitData.interview_result_name }}</oa-item>
					<oa-item label="发offer时间" >{{ recruitData.send_offer_time }}</oa-item>
					<oa-item label="试岗部门" >{{ recruitData.try_depart_name }}</oa-item>
					<oa-item label="试岗时间" >{{ recruitData.try_time }}</oa-item>
					<oa-item label="回复报到时间" >{{ recruitData.reply_time }}</oa-item>
					<oa-item label="实际报到时间" >{{ recruitData.register_time }}</oa-item>
					<oa-item label="面试官" >{{ recruitData.interviewer_name }}</oa-item>
					<oa-item label="面试时间" >{{ recruitData.interview_time }}</oa-item>
					<oa-item v-if="scenario==3" label="预计入职时间" >{{ recruitData.predict_entry_time }}</oa-item>
					<oa-item label="入职面谈单">
						<span
							class="g-operation"
							@click="handleUrl(recruitData.jump_entry_interview_url)"
						>
							查看
						</span>
					</oa-item>
				</div>
			</div>
			<div v-else-if="add_type==='2'">
				<oa-title title="基本信息" class="_title"/>
				<div class="_content">
					<oa-item label="应聘职位">{{ recruitData.depart_name }}</oa-item>
					<oa-item label="工作年限">{{ recruitData.work_time_name }}</oa-item>
					<oa-item label="期望薪资">{{ recruitData.salary }}</oa-item>
					<oa-item label="学历">{{ recruitData.education_name }}</oa-item>
					<oa-item label="现居住地">{{ recruitData.now_address }}</oa-item>
					<oa-item label="招聘渠道">{{ recruitData.ditch_name }}</oa-item>
					<oa-item label="转介绍人">{{ recruitData.introducer_name }}</oa-item>
					<oa-item label="邀约人">{{ recruitData.invite_name }}</oa-item>
					<oa-item label="线上简历">
						<span
							v-if="$auth[169]"
							class="g-operation"
							@click="handleUrl(recruitData.jump_online_resume_url)"
						>
							查看
						</span>
						<span v-else style="cursor: not-allowed;color:#ACA899">查看</span>
					</oa-item>
				</div>
				<div v-for="(item,index) in recruitData.interview" :key="index" class="g-m-b-20">
					<div>
						<oa-title :title="getStrNumber(index)+'面'" class="_title"/>
						<div class="_content">
							<oa-item label="面试官" >{{ item.interviewer_name }}</oa-item>
							<oa-item label="面试时间" >{{ item.interview_time }}</oa-item>
							<oa-item label="面试结果" >{{ item.result_name }}</oa-item>
							<oa-item label="面试记录单" >
								<span

									class="g-operation"
									@click="handleUrl(item.jump_interview_record_url)"
								>
									查看
								</span>

							</oa-item>
						</div>
					</div>
				</div>
				<div class="_bottom _content">
					<oa-item label="试岗时间">{{ recruitData.try_start_time }}~{{ recruitData.try_end_time }}</oa-item>
					<oa-item label="试岗部门">{{ recruitData.try_depart_name }}</oa-item>
					<oa-item label="预计入职时间">{{ recruitData.predict_entry_time }}</oa-item>
					<oa-item label="入职面谈单">
						<span
							class="g-operation"
							@click="handleUrl(recruitData.jump_entry_interview_url)"
						>
							查看
						</span>
					</oa-item>
				</div>
			</div>
			<div v-else class="g-flex g-flex-cc g-flex-ac">
				<div class="_empty" >
					<img :src="nodataUrl" class="_img g-m-b-20">
					<div>暂无招聘信息</div>
				</div>
			</div>
		</div>
		<div class="g-m-t-40" style="height: inherit" >
			<oa-social-remark v-if="add_type==='2'" :data-source="remarks" :record="applicant_log"/>
			<oa-school-remark v-if="add_type==='3'" :data-source="remarks"/>
		</div>
	</div>
</template>

<script>
import { getParseUrl, getHashUrl, formatMoment, getItem } from "@utils/utils";
import API_ROOT from "@stores/apis/root";
import { DatePicker } from "iview";
import { OSS_EMPTY } from '@constants/constants';
import Title from "../../../_common/title";
import DetailItem from "../../common/detail-item";
import SchoolRemark from "../../remarks/school-remarks";
import SocialRemark from "../../remarks/social-remarks";


export default {
	name: "oa-filter",
	components: {
		'oa-title': Title,
		"oa-item": DetailItem,
		"oa-social-remark": SocialRemark,
		"oa-school-remark": SchoolRemark,
	},
	data() {
		const { query = {} } = this.$route;
		return {
			scenario: query.scenario,
			add_type: query.add_type,
			nodataUrl: OSS_EMPTY,
			remarks: [],
			applicant_log: [],
			cnum: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
			recruitData: {
				position_name: "",
				alternative_position_name: '',
				school: '',
				meeting_time: '',
				college: '',
				profession: '',
				education_name: '',
				ticket_info_all: '',
				interview_result_name: '',
				send_offer_time: '',
				try_depart_array: '',
				try_start_time: '',
				reply_time: '',
				register_time: '',
				interviewer_name: '',
				interview_time: '',
				interview: [],
				depart_name: '',
				work_time: '',
				salary: '',
				now_address: '',
				try_depart_name: '',
				predict_entry_time: '',
				ditch: '',
				introducer_name: '',
				invite_name: '',
				resume_status: '',
				jump_entry_interview_url: '',
			}
		};
	},
	mounted() {
		this.loadBaseInfo();
		this.loadApplicantDetail();
	},
	methods: {
		loadBaseInfo() {
			const { query = {} } = this.$route;
			this.$request({
				url: API_ROOT._HR_ARCHIVES_PERSON_DETAIL_PERSON_PERSON_GET,
				type: "GET",
				param: {
					staff_id: query.staff_id,
					applicant_id: query.applicant_id,
					scenario: query.scenario,
					type: 1
				},
				loading: false
			}).then(res => {
				this.recruitData = res.data;
			}).catch(err => {});
		},
		loadApplicantDetail(v) {
			this.$request({
				url: this.add_type == 2 ? '_HR_RECRUIT_APPLICANT_DETAIL_GET' : '_HR_RECRUIT_SCHOOL_SUMMARY_GET_INFO_GET',
				type: "GET",
				param: {

					applicant_id: this.$route.query.applicant_id,
					list_type: 'social-index',
					type: 1
				},
				loading: false
			}).then(res => {
				this.remarks = res.data.content;
				this.applicant_log = res.data.applicant_log;
				this.predict_entry_time = res.data.predict_entry_time;
			}).catch(err => {});
		},
		handleUrl(val) {
			this.$router.push(val + '&from=person');
		},
		getStrNumber(n) {
			let s = '';
			n = '' + n; // 数字转为字符串
			for (let i = 0; i < n.length; i++) {
				s += this.cnum[n.charAt(i)];
			}
			return s;
		}
	}
};
</script>

<style lang="scss" >
.v-hr-archives-person-details-recruit{
	margin-top:40px;
	height: inherit;
	overflow-x: auto;
	width: 1000px;
	._title{
		margin-bottom:20px;
	}
	._content{
		padding-left: 10px;
	}
	._bottom{
		margin-top:50px;
	}
	._empty {
		margin-top: 180px;
		background-color: #fff;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
}

</style>