<template>
	<div class="v-hr-recruit-school-jobfair-info">
		<div class="_title">
			{{ info.school }}
			<!-- <span
				v-if="$auth[167] && editable && info.list.length === 1"
				class="__edit g-operation g-m-l-20"
				@click="toEdit(info.list[0].meeting_id)">
				编辑
			</span> -->
		</div>
		<div class="_wrapper">
			<div
				v-for="(item, index) in info.list"
				:key="item.meeting_id"
				:class="index < info.list.length - 1 ? 'g-bb g-m-b-20' : ''"
			>
				<i-row class="__item">
					<i-col span="12">
						<span class="__left">学校性质：</span>
						<span class="__right">{{ item.college_type_name }}</span>
					</i-col>
					<i-col span="12">
						<span class="__left">学校官网：</span>
						<span class="g-c-blue-light g-operation" @click="toUrl(item)">{{ item.college_url }}</span>
					</i-col>
				</i-row>
				<i-row class="__item">
					<i-col span="12">
						<span class="__left">官网账号：</span>
						<span v-if="item.college_amount_number" class="__right">{{ item.college_amount_number }}</span>
						<span v-else class="__right">--</span>
					</i-col>
					<i-col span="12">
						<span class="__left">官网密码：</span>
						<span v-if="item.college_password" class="__right">{{ item.college_password }}</span>
						<span v-else class="__right">--</span>
					</i-col>
				</i-row>
				<i-row class="__item">
					<i-col span="12">
						<span class="__left">招聘会类型：</span>
						<span class="__right">{{ item.meeting_type_name }}</span>
					</i-col>
					<i-col span="12">
						<span class="__left">招聘会时间：</span>
						<span class="__right">{{ item.meeting_time.join(' ~ ') }}</span>
					</i-col>
				</i-row>
				<i-row class="__item">
					<i-col span="12">
						<span class="__left">联系老师：</span>
						<span class="__right">{{ item.contact_teacher }}</span>
					</i-col>
					<i-col span="12">
						<span class="__left">联系电话：</span>
						<span class="__right">{{ item.contact_tel.join(',') }}</span>
					</i-col>
				</i-row>
				<i-row class="__item">
					<i-col span="12">
						<span class="__left">招聘会地址：</span>
						<span class="__right">{{ 
							item.province_name && item.address 
								? `${item.province_name}/${item.city_name}/${item.address}` 
								: item.province_name 
									? `${item.province_name}/${item.city_name}` : 
										item.address 
											? `${item.address}`
											: '--'
						}}</span>
					</i-col>
					<i-col span="12">
						<span class="__left">发资料微信：</span>
						<span v-if="item.email_wechat" class="__right">{{ item.email_wechat }}</span>
						<span v-else class="__right">--</span>
					</i-col>
				</i-row>
				<i-row class="__item">
					<i-col span="12">
						<span class="__left">发资料邮箱：</span>
						<span v-if="item.email" class="__right">{{ item.email }}</span>
						<span v-else class="__right">--</span>
					</i-col>
					<i-col span="12">
						<span class="__left">参与人员：</span>
						<span v-if="item.join_staff.length" class="__right">{{ item.join_staff.map(item => item.staff_name).join(',') }}</span>
						<span v-else class="__right">--</span>
					</i-col>
				</i-row>
				<i-row class="__item">
					<i-col span="12">
						<span class="__left">招聘会年份：</span>
						<span class="__right">{{ item.meeting_year == '--' || !item.meeting_year ? `--` : `${item.meeting_year + '年'}` }}</span>
					</i-col>
					<i-col span="12">
						<span class="__left">招聘会季节：</span>
						<span class="__right">{{ item.season_type_name }}</span>
					</i-col>
				</i-row>
				<i-row class="__item">
					<i-col span="12">
						<span class="__left">参与情况：</span>
						<span class="__right">{{ item.status_name }}</span>
					</i-col>
					<i-col span="12">
						<span class="__left">电话沟通进度：</span>
						<span 
							v-if="item.communication_progress" 
							class="__right g-inline-block" 
							style="word-break:break-all;width: 230px;"
						>
							<oa-auto-tooltip 
								:content="item.communication_progress"
								:label-class="''"
								theme="dark"
								width="230px" 
								placement="bottom"
								class="g-pointer g-dp-ib"
								style="g-inline-block"
							/>
						</span>
						<span v-else class="__right">--</span>
					</i-col>
				</i-row>
				<i-row class="__item">
					<i-col span="12">
						<span class="__left">备注：</span>
						<span 
							v-if="item.remarks" 
							class="__right g-inline-block" 
							style="word-break:break-all;width: 230px;"
						>
							<oa-auto-tooltip 
								:content="item.remarks"
								:label-class="''"
								theme="dark"
								width="230px" 
								placement="bottom"
								class="g-pointer g-dp-ib"
								style="g-inline-block"
							/>
						</span>
						<span v-else class="__right">--</span>
					</i-col>
				</i-row>
			</div>
		</div>

	</div>
</template>

<script>
import { Message, Col, Row } from 'iview';
import Upload from '@components/_common/upload/upload';
import API_ROOT from '@stores/apis/root';
import { services as commonServices } from '@stores/services/common';
import { dataValidity, objRegex } from '@utils/utils';
import autoTooltip from '@components/_common/auto-tooltip/auto-tooltip';

export default {
	name: 'oa-content',
	components: {
		'i-col': Col,
		'i-row': Row,
		'oa-auto-tooltip': autoTooltip,
	},
	mixins: [
	],
	data() {
		return {
			index: 1,
			addShow: true,
			info: {
				list: []
			},
			editable: !Number(this.$route.query.no_edit)
		};
	},
	mounted() {
	},
	created() {
		this.getInfoData();
	},
	methods: {
		toUrl(e) {
			let college_url = objRegex.validURLScheme.regex.test(e.college_url) ? e.college_url : `http://${e.college_url}`;
			window.open(college_url);
		},
		toEdit(meeting_id) {
			this.$router.push(`/hr/recruit/school/jobfair/edit?id=${meeting_id}`);
		},
		getInfoData() {
			this.$request({
				url: API_ROOT['_HR_RECRUIT_SCHOOL_JOBFAIR_INFO_GET'], // eslint-disable-line
				type: "GET",
				param: {
					meeting_id: this.$route.query.id
				}
			}).then((res) => {
				this.info = res.data;
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		}
	},
};
</script>

<style lang="scss" scoped>
.v-hr-recruit-school-jobfair-info {
	padding: 20px 0 60px 0;
	overflow-x: hidden;
	._wrapper {
		flex-direction: column;
		min-width: 400px;
		max-width: 900px;
		margin-left: 135px;
		.__item {
			margin-bottom: 15px;
			.__left {
				color: #818794;
			}
			.__right {
				color: #000;
				word-wrap: break-word;
			}
		}
	}
	._title {
		width: 100%;
		font-size: 16px;
		margin-bottom: 30px;
		color: #000;
		margin-left: 135px;
		.__edit {
			// margin-left: 75px;
		}
	}
}
</style>
