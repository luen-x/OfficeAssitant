<template>
	<div>
		<i-drawer
			:mask="false"
			:mask-closable="false"
			:styles="styles"
			v-model="visible"
			:loading="true"
			:title="data && data.school"
			width="720"
			class="v-recruit-school-drawer g-fs-14"
			@on-close="$emit('close')"
		>
			<div v-if="!isLoading" class="_wrapper">
				<div class="_sub-title g-m-b-5">
					<span 
						style="font-size: 14px" 
						class="__title"
					>
						基本信息
					</span>
					<span
						v-if="!isEdit"
						class="g-c-blue-mid g-m-l-10"
						style="font-size: 12px; cursor: pointer"
						@click="isEdit = true"
					>编辑</span>
					<span
						v-if="isEdit"
						class="g-c-blue-mid g-m-l-10"
						style="font-size: 12px; cursor: pointer"
					>
						<span @click="handleSaveEdit">保存</span>
						<span class="g-m-l-5" @click="isEdit = false">取消</span>
					</span>
				</div>
				<div v-if="!isEdit" style="padding-left: 12px">
					<i-row class="__item">
						<i-col span="10" class="g-bb">
							<span class="__left">学校性质</span>
							<span class="__right">{{ data.college_type_name }}</span>
						</i-col>
						<i-col span="10" offset="2" class="g-bb">
							<span class="__left">学校官网</span>
							<span 
								class="__right g-c-blue-light g-operation g-dp-ib" 
								@click="handleLinkTo(data.college_url)">
								<oa-auto-tooltip 
									:content="data.college_url"
									:label-class="''"
									theme="dark"
									width="230px" 
									placement="bottom"
									class="g-pointer g-dp-ib"
								/>
							</span>
						</i-col>
					</i-row>
					<i-row class="__item">
						<i-col span="10" class="g-bb ">
							<span class="__left">官网账号</span>
							<span v-if="data.college_amount_number" class="__right">{{ data.college_amount_number }}</span>
							<span v-else class="__right">--</span>
						</i-col>
						<i-col span="10" offset="2" class="g-bb ">
							<span class="__left">官网密码</span>
							<span v-if="data.college_password" class="__right">{{ data.college_password }}</span>
							<span v-else class="__right">--</span>
						</i-col>
					</i-row>
					<i-row class="__item">
						<i-col span="10" class="g-bb ">
							<span class="__left">招聘会地址</span>
							<span 
								class="__right g-dp-ib" >
								<oa-auto-tooltip 
									:content="data.province_name && data.address 
										? `${data.province_name}/${data.city_name}/${data.address}` 
										: data.province_name 
											? `${data.province_name}/${data.city_name}`
											: data.address 
												? `${data.address}`
												: '--'
									"
									:label-class="''"
									theme="dark"
									width="230px" 
									placement="bottom"
									class="g-pointer g-dp-ib"
								/>
							</span>
						</i-col>
						<i-col span="10" offset="2" class="g-bb ">
							<span class="__left">招聘会类型</span>
							<span class="__right">{{ data.meeting_type_name }}</span>
						</i-col>
					</i-row>
					<i-row class="__item">
						<i-col span="10" class="g-bb ">
							<span class="__left">招聘会时间</span>
							<span class="__right">
								{{ data.meeting_time[0] ? data.meeting_time.join(' 至 ') : '--' }}
							</span>
						</i-col>
						<i-col span="10" offset="2" class="g-bb ">
							<span class="__left">联系老师</span>
							<span 
								class="__right g-dp-ib" >
								<oa-auto-tooltip 
									:content="data.contact_teacher"
									:label-class="''"
									theme="dark"
									width="230px" 
									placement="bottom"
									class="g-pointer g-dp-ib"
								/>
							</span>
						</i-col>
					</i-row>
					<i-row class="__item">
						<i-col span="10" class="g-bb ">
							<span class="__left">联系电话</span>
							<span class="__right">{{ data.contact_tel.join(',') }}</span>
						</i-col>
						<i-col span="10" offset="2" class="g-bb ">
							<span class="__left">参与人员</span>
							<span 
								v-if="data.join_staff.length" 
								class="__right g-dp-ib" >
								<oa-auto-tooltip 
									:content="data.join_staff.map(item => item.staff_name).join(',')"
									:label-class="''"
									theme="dark"
									width="230px" 
									placement="bottom"
									class="g-pointer g-dp-ib"
								/>
							</span>
							<span v-else class="__right">--</span>
						</i-col>
					</i-row>
					<i-row class="__item">
						<i-col span="10" class="g-bb ">
							<span class="__left">发资料邮箱</span>
							<span 
								v-if="data.email"
								class="__right g-dp-ib" >
								<oa-auto-tooltip 
									:content="data.email && '--'"
									:label-class="''"
									theme="dark"
									width="230px" 
									placement="bottom"
									class="g-pointer g-dp-ib"
								/>
							</span>
						</i-col>
						<i-col span="10" offset="2" class="g-bb ">
							<span class="__left">发资料微信</span>
							<span 
								class="__right g-dp-ib" >
								<oa-auto-tooltip 
									:content="data.email_wechat && '--'"
									:label-class="''"
									theme="dark"
									width="230px" 
									placement="bottom"
									class="g-pointer g-dp-ib"
								/>
							</span>
						</i-col>
					</i-row>
					<i-row class="__item">
						<i-col span="10" class="g-bb ">
							<span class="__left">参与情况</span>
							<span class="__right">{{ data.status_name }}</span>
						</i-col>
						<i-col span="10" offset="2" class="g-bb ">
							<span class="__left">电话沟通进度</span>
							<span 
								class="__right g-dp-ib" >
								<oa-auto-tooltip 
									:content="data.communication_progress && '--'"
									:label-class="''"
									theme="dark"
									width="230px" 
									placement="bottom"
									class="g-pointer g-dp-ib"
								/>
							</span>
						</i-col>
					</i-row>
					<i-row class="__item">
						<i-col span="10" class="g-bb ">
							<span class="__left">招聘会年份</span>
							<span class="__right">
								{{ data.meeting_year ? data.meeting_year + '年' : '--' }}
							</span>
						</i-col>
						<i-col span="10" offset="2" class="g-bb ">
							<span class="__left">招聘会季节</span>
							<span class="__right">
								{{ data.season_type_name && '--' }}
							</span>
						</i-col>
					</i-row>
					<i-row class="__item">
						<i-col span="10" class="g-bb ">
							<span class="__left">备注</span>
							<span 
								class="__right g-dp-ib" >
								<oa-auto-tooltip 
									:content="data.remarks && '--'"
									:label-class="''"
									theme="dark"
									width="230px" 
									placement="bottom"
									class="g-pointer g-dp-ib"
								/>
							</span>
						</i-col>
					</i-row>
				</div>
				<div v-if="isEdit">
					<oa-edit-detail 
						ref="editForm"
						:data-source="data"
						:meeting_id="data.meeting_id"
						@success-modify="handleSuccessModify"/>
				</div>
				<div class="_sub-title g-m-b-5 g-m-t-20">
					<span 
						style="font-size: 14px" 
						class="__title"
					>
						参与信息
					</span>
					<span
						v-if="!isJoinEdit"
						class="g-c-blue-mid g-m-l-10"
						style="font-size: 12px; cursor: pointer"
						@click="isJoinEdit = true"
					>编辑</span>
					<span
						v-if="isJoinEdit"
						class="g-c-blue-mid g-m-l-10"
						style="font-size: 12px; cursor: pointer"
					>
						<span @click="handleJoinSaveEdit">保存</span>
						<span class="g-m-l-5" @click="handleJoinCancel">取消</span>
					</span>
				</div>
				<div v-if="!isJoinEdit" style="padding-left: 12px">
					<i-row class="__item">
						<i-col span="10">
							<div class="g-bb">
								<span class="__left">简历码</span>
								<span class="__right g-operation" @click="handleDownload">
									点击下载
								</span>
							</div>
							<div 
								v-for="(item, index) of info.school_positions"
								:key="index"
								class="g-m-t-30 g-flex g-jc-sb">
								<span class="__left">{{ index === 0 ? '校招职位' : '' }}</span>
								<span 
									class="__right g-dp-ib _item" 
								>
									<oa-auto-tooltip 
										:content="getPositionName(item)"
										:label-class="''"
										theme="dark"
										width="230px" 
										placement="bottom"
										class="g-pointer g-dp-ib"
									/>
									<div class="g-flex g-jc-sb g-m-t-10">
										<span 
											class="g-operation"
											@click="handllePreview(item.paper_id)">{{ item.paper_theme }}</span>
									</div>	
								</span>
							</div>
						</i-col>
						<i-col span="10" offset="2">
							<div 
								v-for="(item, index) of info.interview_groups"
								:key="index"
								class="g-m-b-15 g-flex g-jc-sb">
								<span class="__left">{{ index === 0 ? '面试组' : '' }}</span>
								<span 
									class="__right g-dp-ib _item" 
								>
									<div class="g-m-b-20">
										面试组{{ index + 1 }}:
									</div>
									<oa-auto-tooltip 
										:content="getInterviewerName(item)"
										:label-class="''"
										theme="dark"
										width="230px" 
										placement="bottom"
										class="g-pointer g-dp-ib"
									/>
								</span>
							</div>
							<div v-if="!info.interview_groups.length" class="g-m-b-15">
								<span class="g-dp-ib" style="width:120px">面试组</span>--
							</div>
						</i-col>
					</i-row>
				</div>
				<div
					v-else
					style="paddingRight: 40px"
				>
					<oa-join-info
						ref="joinForm"
						:info="copyInfo"
						:edit="true"
						type="small"
					/>
				</div>
			</div>
			<div v-if="isLoading">
				<oa-loading/>
			</div>
		</i-drawer>
	</div>
</template>
<script>
import { Button, Drawer, Input, Col, Row } from "iview";
import { CreatePortal, ImgsPreview } from "wya-vc";
import Loading from '@components/_common/loading/loading';
import API_ROOT from '@stores/apis/root';
import { dataValidity, objRegex, getHashUrl, getItem } from '@utils/utils';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { cloneDeep } from 'lodash';
import JoinInfo from './join-info';
import editDetail from './edit-detail';
import { PaperModal } from './paper-preview';

export default {
	name: "oa-audit-detail",
	components: {
		"i-button": Button,
		"i-drawer": Drawer,
		"i-input": Input,
		'vc-imgs-preview': ImgsPreview,
		'oa-loading': Loading,
		'i-col': Col,
		'i-row': Row,
		'oa-auto-tooltip': AutoToolTip,
		'oa-edit-detail': editDetail,
		'oa-join-info': JoinInfo
	},
	props: {
		detailData: {
			required: true,
			type: Object
		}
	},
	data() {
		this.Button = Button;
		return {
			visible: false,
			styles: {
				height: "calc(100% - 55px)",
				overflow: "auto",
				paddingBottom: "53px",
				position: "static",
				marginLeft: '-8px'
			},
			isLoading: false,
			data: this.detailData,
			info: {},
			copyInfo: {},
			isEdit: false,
			isJoinEdit: false,
			hasModified: false
		};
	},
	created() {
		this.loadData();
	},
	mounted() {
		this.visible = true;
	},
	beforeDestroy() {
		this.hasModified && app.$store.commit('HR_RECRUIT_SCHOOL_JOBFAIR_LIST_RESET', { type: this.type });
	},
	methods: {
		loadData() {
			this.isLoading = true;
			this.isEdit = false;
			this.isJoinEdit = false;
			return this.$request({
				url: API_ROOT['_HR_RECRUIT_SCHOOL_JOBFAIR_INFO_GET'],
				type: "GET",
				param: {
					meeting_id: this.detailData.meeting_id
				}
			}).then(({ data }) => {
				this.data = data.list[0];
				this.info = data.join_info;
				this.copyInfo = cloneDeep(this.info);
			}).finally(() => {
				this.isLoading = false;
			});
		},
		handleDownload() {
			window.open(getHashUrl(API_ROOT._HR_MERTING_RESUME_CODE_DOWNLOAD_GET, {
				meeting_id: this.detailData.meeting_id,
				'-token': getItem(`staff_${this.$global.version}`).token
			}));
		},
		getInterviewerName(item) {
			return item.interviewers ? item.interviewers.map(i => i.interviewer_name).join(' | ') : '';
		},
		getPositionName(item) {
			return item.positions ? item.positions.map(i => i.position_name).join(' | ') : '';

		},
		handllePreview(paper_id) {
			paper_id && PaperModal.popup({
				paper_id
			}).catch(err => err && console.error(err));
		},
		handleLinkTo(college_url) {
			let url = objRegex.validURLScheme.regex.test(college_url) 
				? college_url 
				: `http://${college_url}`;
			window.open(url);
		},
		handleSaveEdit() {
			this.$refs.editForm.handleSave();
		},
		handleJoinCancel() {
			this.isJoinEdit = false;
			this.copyInfo = cloneDeep(this.info);
		},
		handleJoinSaveEdit() {
			this.$refs.joinForm.$refs.form.validate(item => {
				if (item) {
					const data = { ...this.$refs.joinForm.formdata };
					data.interview_groups = data.interview_groups.filter(g => g.interviewer_ids && g.interviewer_ids.length);
					
					this.$request({
						url: API_ROOT['_HR_RECRUIT_MEETING_JOIN_INFO_POST'], // eslint-disable-line
						type: "POST",
						param: {
							...data,
							meeting_id: this.data.meeting_id
						}
					}).then((res) => {
						this.$Message.success(res.msg);
						this.hasModified = true;
						this.loadData();
					}).catch((error) => {
						this.$Message.error(error.msg);
					});
				}
			});
		},
		handleSuccessModify() {
			this.isEdit = false;
			this.hasModified = true;
			this.loadData();
		}
	}
};
export const DetailDrawer = CreatePortal({
	alive: true
}, module.exports.default);
</script>
<style lang="scss">
.v-recruit-school-drawer {
    ._wrapper {
		flex-direction: column;
		min-width: 400px;
		max-width: 900px;
		margin-left: 12px;
		.__item {
			margin-bottom: 15px;
            padding: 5px 0;
            line-height: 2;
			.__left {
                display: inline-block;
                width: 100px;
				color: #818794;
			}
			.__right {
				line-height: 15px;
				color: #000;
				word-wrap: break-word;
			}
			._item {
				background: #FAFAFA;
				padding: 15px;
			}
		}
	}
    ._sub-title {
		line-height: 20px;
		// margin-top: 25px;
		.__left {
			background: #e84854;
			width: 2px;
			height: 14px;
			display: inline-block;
			margin-right: 10px;
		}
        .__title{
            position: relative;
            padding-left: 10px;
            &::before {
                top: 1px;
                left: -3px;
                content: '';
                height: 14px;
                width: 2px;
                position: absolute;
                background: #ca1622;
		}
	}
	}
	._title {
		width: 100%;
		font-size: 16px;
		margin-bottom: 30px;
		color: #000;
		margin-left: 135px;
	}
}
</style>

