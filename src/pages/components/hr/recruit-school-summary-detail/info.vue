<template>
	<div class="v-hr-recruit-detail-info">
		<div class="g-flex g-fw-w g-jc-sb">
			<div class="g-bb _label-item g-flex">
				<div class="__label-item-text">应聘职位</div>
				<span>{{ data.position_name || '--' }}</span>
			</div>
			<div class="g-bb _label-item g-flex">
				<div class="__label-item-text">备选职位</div>
				<span>{{ data.alternative_position_name ? data.alternative_position_name : '--' }}</span>
			</div>
			<div class="g-bb _label-item g-flex">
				<div class="__label-item-text">面试官</div>
				<span>{{ data.interviewer_name || '--' }}</span>
			</div>
			<div class="g-bb _label-item g-flex">
				<div class="__label-item-text">面试时间</div>
				<span>{{ data.interview_time || '--' }}</span>
			</div>
			<div class="g-bb _label-item g-flex">
				<div class="__label-item-text">微信号</div>
				<span>{{ data.wechat ? data.wechat : '--' }}</span>
			</div>
			<div class="g-bb _label-item g-flex">
				<div class="__label-item-text">邮箱</div>
				<span>{{ data.email ? data.email : '--' }}</span>
			</div>
			<div class="g-bb _label-item g-flex">
				<div class="__label-item-text">是否干部</div>
				<span>{{ data.is_leader_name ? data.is_leader_name : '--' }}</span>
			</div>
			<div class="g-bb _label-item g-flex">
				<div class="__label-item-text">干部职位</div>
				<span>{{ data.leader_position ? data.leader_position : '--' }}</span>
			</div>
			<div class="g-bb _label-item g-flex">
				<div class="__label-item-text">录入时间</div>
				<span>{{ data.create_time || '--' }}</span>
			</div>
			<div class="g-bb _label-item g-flex">
				<div class="__label-item-text">招聘会学校</div>
				<span>{{ data.school }}</span>
			</div>
			<div class="g-bb _label-item g-flex">
				<div class="__label-item-text">招聘会时间</div>
				<span>{{ data.meeting_start_time }} - {{ data.meeting_end_time }}</span>
			</div>
			<div class="g-bb _label-item g-flex">
				<div class="__label-item-text">招聘会年份</div>
				<span>{{ data.meeting_year_name || '--' }}</span>
			</div>
			<div class="g-bb _label-item g-flex">
				<div class="__label-item-text">招聘会季节</div>
				<span>{{ data.season_type_name || '--' }}</span>
			</div>
			<!-- 以下需要根据状态来判断是否显示 -->
			<div
				v-if="[2,3,4,5,6,7,8,9,10,11].indexOf(data.status) > -1"
				class="g-bb _label-item g-flex">
				<div class="__label-item-text">面试结果</div>
				<span>{{ data.interview_result_name ? data.interview_result_name : '--' }}</span>
			</div>
			<div
				v-if="[2,3,4,5,6,7,9,10,11].indexOf(data.status) > -1"
				class="g-bb _label-item g-flex">
				<div class="__label-item-text">发offer时间</div>
				<span>{{ data.send_offer_time ? data.send_offer_time : '--' }}</span>
			</div>
			<div
				v-if="[3,4,5,6,7,9,10,11].indexOf(data.status) > -1"
				class="g-bb _label-item g-flex">
				<div class="__label-item-text">回复报到时间</div>
				<span>{{ data.reply_time ? data.reply_time : '--' }}</span>
			</div>
			<div
				v-if="[3,4,5,6,7,9,10,11].indexOf(data.status) > -1"
				class="g-bb _label-item g-flex _ticket">
				<div class="__label-item-text">车票信息</div>
				<div>
					<i-poptip
						v-if="data.ticket_info_all"
						trigger="hover"
						word-wrap
						width="280"
						transfer>
						<div slot="title">
							<div>{{ data.ticket_departure_time }}~{{ data.ticket_arrive_time }}</div>
						</div>
						<div slot="content">
							<span>{{ data.ticket_info }}</span>
						</div>
						<div class="__remarks">{{ data.ticket_info_all }}</div>
					</i-poptip>
					<span v-else>--</span>
				</div>
			</div>
			<div
				v-if="[3,4,5,6,7,9,10,11].indexOf(data.status) > -1"
				class="g-bb _label-item g-flex">
				<div class="__label-item-text">试岗部门</div>
				<span>{{ data.try_depart_name ? data.try_depart_name : '--' }}</span>
			</div>
			<div
				v-if="[3,4,5,6,7,10,11].indexOf(data.status) > -1"
				class="g-bb _label-item g-flex">
				<div class="__label-item-text">实际报到时间</div>
				<span>{{ data.register_time ? data.register_time : '--' }}</span>
			</div>
			<div
				v-if="[3,4,5,11].indexOf(data.status) > -1"
				class="g-bb _label-item g-flex">
				<div class="__label-item-text">试岗时间</div>
				<span>{{ (data.try_start_time || data.try_end_time) ? data.try_start_time + ' - ' + data.try_end_time : '--' }}</span>
			</div>
			<div
				class="g-bb _label-item g-flex">
				<div class="__label-item-text">预计入职时间</div>
				<span>{{ data.predict_entry_time ? data.predict_entry_time : '--' }}</span>
			</div>
			<div
				v-if="data.status === 5 || data.status === 11"
				class="g-bb _label-item g-flex">
				<div class="__label-item-text">入职时间</div>
				<span>{{ data.entry_time ? data.entry_time : '--' }}</span>
			</div>
			<div
				v-if="[4,5,7].indexOf(data.status) > -1"
				class="g-bb _label-item g-flex">
				<div class="__label-item-text">入职面谈单</div>
				<span v-if="data.is_write_entry == 1" class="g-operation" @click="handleLinkTo">
					已上传
				</span>
				<span v-else>
					未上传
				</span>
			</div>
			<div
				v-if="data.status === 7"
				class="g-bb _label-item g-flex">
				<div class="__label-item-text">离职时间</div>
				<span>{{ data.leave_time ? data.leave_time : '--' }}</span>
			</div>
			<div v-if="data.status === 11" class="g-bb _label-item g-flex">
				<div class="__label-item-text">离开时间</div>
				<span>{{ data.departure_time }}</span>
			</div>
			<div v-if="data.status === 11" class="g-bb _label-item g-flex">
				<div class="__label-item-text">离开类型</div>
				<span>{{ data.departure_type_name }}</span>
			</div>
			<div v-if="data.status === 6" class="g-bb _label-item g-flex">
				<div class="__label-item-text">淘汰时间</div>
				<span>{{ data.pass_time }}</span>
			</div>
			<div v-if="data.status === 6" class="g-bb _label-item g-flex">
				<div class="__label-item-text">淘汰类型</div>
				<span>{{ data.pass_type_name }}</span>
			</div>
		</div>

		<div v-if="data.status === 11" class="g-bb g-flex _label-item">
			<div class="__label-item-text">离开原因</div>
			<div>
				<span v-if="data.departure_reason.length < 20">{{ data.departure_reason }}</span>
				<i-poptip
					v-else
					trigger="hover"
					word-wrap
					width="300">
					<div slot="content" style="word-break: break-all">{{ data.departure_reason }}</div>
					<div class="__remarks">{{ data.departure_reason.slice(0, 20) + '...' }}</div>
				</i-poptip>
			</div>
		</div>
		<div v-if="data.status === 6" class="g-bb g-flex _label-item">
			<div class="__label-item-text">淘汰原因</div>
			<div>
				<i-poptip
					trigger="hover"
					word-wrap
					width="300"
					transfer>
					<div slot="content" style="word-break: break-all">{{ data.pass_remarks_type_name }}</div>
					<div class="__remarks">{{ data.pass_remarks_type_name }}</div>
				</i-poptip>
			</div>
		</div>

		<!-- <div class="g-bb _label-item g-flex">
			<div class="__label-item-text">面试结果</div>
			<span>{{ 
				STATUS[data.interview_result] 
			}}</span>
		</div> -->

		<div class="g-bb _label-item g-flex">
			<div class="__label-item-text">笔试结果</div>
			<span 
				:class="list_type !== 'transport' ? 'g-c-blue-mid g-pointer' : ''"
				@click="list_type !== 'transport' ? handleResultDetail() : ''">点击查看</span>
		</div>

		<div class="g-bb _label-item g-flex">
			<div class="__label-item-text">答卷预览</div>
			<span 
				:class="list_type !== 'transport' ? 'g-c-blue-mid g-pointer' : ''"
				@click="list_type !== 'transport' ? handleAnswerDetail() : ''">点击查看</span>
		</div>

		<div class="g-bb g-flex _file">
			<div class="__label-item-text">简历附件</div>
			<oa-upload
				v-if="data.resume.length"
				v-model="data.resume"
				disabled
				style="width: 300px"
				class="__upload"
			/>
			<span v-else>--</span>
		</div>
	</div>

</template>

<script>
import Upload from '@components/_common/upload/upload';
import { getHashUrl, getParseUrl } from '@utils/utils';
import { Poptip } from 'iview';
import { ResultDetailModal } from './popup/result-detail';
import { AnswerResultDrawer } from './popup/answer-result';

const STATUS = ['', 'A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-'];

export default {
	name: "oa-tpl",
	components: {
		"oa-upload": Upload,
		"i-poptip": Poptip
	},
	props: {
		data: {
			type: Object
		}
	},
	data() {
		const { query } = getParseUrl();
		return {
			STATUS,
			list_type: query.list_type,
		};
	},
	methods: {
		handleLinkTo() {
			let params = {};
			let paramsArr = this.data.url.pc.split('?')[1].split('&');
			paramsArr.forEach(it => {
				params[it.split('=')[0]] = it.split('=')[1];
			});
			this.$router.push(getHashUrl('/hr/recruit/school/summary/entry', {
				...params,
				recruitType: 'school'
			}));
			// let url = this.data.url ? this.data.url.pc.split('.com') : '';
			// url ? this.$router.push(`${url[1]}`) : null;
		},
		handleResultDetail() {
			if (!this.data.paper_id) {
				this.$Message.warning('暂无数据');
				return;
			}
			ResultDetailModal.popup({
				paper_id: this.data.paper_id,
				paper_theme: this.data.paper_theme
			});
		},
		handleAnswerDetail() {
			if (!this.data.paper_id) {
				this.$Message.warning('暂无数据');
				return;
			}
			AnswerResultDrawer.popup({
				paper_id: this.data.paper_id,
				paper_theme: this.data.paper_theme
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.v-hr-recruit-detail-info {
	padding-bottom: 20px;
    ._label-item {
        width: 400px;
        height: 40px;
        line-height: 40px;
        margin-top: 10px;
		font-size: 12px;
		color: #333;
		.__label-item-text {
			width: 120px;
			color: #8b919c;
		}
	}
	._pass, ._leave, ._ticket, ._file {
		.__label-item-text {
			width: 120px;
			color: #8b919c;
		}
		.__remarks {
			width: 280px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
	._pass, ._leave, ._file {
		width: 400px;
		line-height: 40px;
		min-height: 40px;
        margin-top: 10px;
		font-size: 12px;
		color: #333;
	}
	._file {
		.__upload {
			margin-top: 14px;
		}
	}
}
</style>
