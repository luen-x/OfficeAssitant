<template>
	<i-drawer
		v-model="visible"
		:mask-closable="false"
		:mask="false"
		:class="mode=='sale'?'_small-drawer':'_small-drawer'"
		class="v-hr-side-detail v-hr-personal-report-detail"
		@on-close="handleCancel"
	>
		<oa-loading v-if="loading"/>
		<div
			class="_head-title"
			style="padding-left:26px;border-bottom:1px solid #EBEEF1"
		>
			{{ companyName }}
		</div>
		<div class="g-c-black3 g-m-t-20" style="padding-left:20px;">
			<div class="g-detail-title" >
				{{ titlePrefix }}举报信息
				<span :class="'g-bold '+audit.class" style="margin-left:10px">{{ audit.name }}</span>
			</div>
			<div class="g-m-t-20">
				<span class="g-c-black4 g-dp-ib g-tr" style="width:80px;">{{ titlePrefix }}举报时间： </span>
				<span>{{ report_info.create_time }}</span>
			</div>
			<div class="g-flex g-m-t-20">
				<span class="g-c-black4 g-tr" style="width:80px;">{{ titlePrefix }}举报内容：</span>
				<div class="g-box-shadow g-col g-pd-lr-20 g-pd-t-10 g-pd-b-10 g-m-r-20" >
					<template v-if="reportType==1 && report_info">
						<div class="g-flex">
							<div class="g-c-black4">举报联系方式：</div>
							<div class="g-col g-flex g-jc-sb">
								<span>{{ report_info.link.link_str }}</span>
								<span>
									<span class="g-c-black4">添加人：</span><span >{{ report_info.link.staff_name }}</span>
								</span>
								<span>
									<span class="g-c-black4">添加时间：</span><span >{{ report_info.link.create_time }}</span>
								</span>
							</div>
						</div>
						<div class="g-flex g-m-t-10">
							<div class="g-c-black4 ">举报原因：</div>
							<div class="g-col">{{ report_info.reason }}</div>
						</div>
					</template>
					<template v-else-if="reportType==2 && customer_record">
					
						<div class="g-flex">
							<div class="g-c-blue-mid" style="width:200px">
								{{ customer_record.type_name }} 
								<span v-if="customer_record.type == 1 || customer_record.type == 4">
									- {{ customer_record.connect_status }} 
								</span>
								<span v-if="customer_record.customer_intention">
									- {{ customer_record.customer_intention }}
								</span>
							</div>
							<span style="width:200px">{{ customer_record.staff_name }}</span>
							<span class="g-col g-c-black4">
								{{ customer_record.create_time }}
							</span>
						</div>
						<template v-if="customer_record.type==1">
							<div class="g-flex g-m-t-10">
								<div style="width:200px">
									<div class="g-c-black4  g-dp-ib">沟通客户：</div>
									<div class="g-m-r-40 g-dp-ib">{{ customer_record.customer_name }}</div>
								</div>
								<div class="g-c-black4 ">电话：</div>
								<div class="g-col">{{ customer_record.tel }}</div>
							</div>
							<div class="g-m-t-10 _audio-background">
								<oa-cus-audio :src="customer_record.tape_link" mode="mid" show-tip="never"/>
							</div>
						</template>
						
						<div class="g-flex g-m-t-10">
							<div class="g-c-black4 ">举报原因：</div>
							<div class="g-col">{{ report_info.reason }}</div>
						</div>
					</template>
				</div>
			</div>
			<div>
				<div class="g-flex g-m-t-20 g-m-r-20">
					<span class="g-c-black4 g-tr" style="width:80px">举报说明：</span>
					<span class="g-col">{{ report_info.remark }}</span>
				</div>
				<div v-if="reportType == 1" class="g-flex  g-m-t-20">
					<span class="g-c-black4 g-tr" style="width:80px">凭证：</span>
					<span class="g-col">
						<oa-upload
							v-model="report_info.images"
							:max="10"
							:upload="{multiple: true, max: 10}"
							:show-title="false"
							disabled
						/>
					</span>
				</div>

			</div>
			<template v-if="reportType==1 && defend_info.is_defend" >
				<div class="g-detail-title g-m-t-20" >{{ (mode == "hr" && tabType==2) ? "我的":"被举报人" }}辩护材料</div>
				<div class="g-flex g-fw-w g-pd-l-20 " style="margin-right: -20px;">
					<oa-info-item :content="defend_info.staff_name" label="被举报人"/>
					<oa-info-item :content="defend_info.defend_time" label="提交时间"/>
					<oa-info-item :content="defend_info.defend_remark" label="辩护说明"/>
					<oa-info-item :content="defend_info.images" label="凭证">
						<oa-upload
							v-model="defend_info.images"
							:max="10"
							:upload="{multiple: true, max: 10}"
							:show-title="false"
							disabled
						/>
					</oa-info-item>


				</div>
			</template>
			<template v-if="audit_info && (audit_info.status==3 || audit_info.status==4)" >
				<div class="g-detail-title g-m-t-20" >审核状态</div>
				<div class="g-flex g-fw-w g-pd-l-20" style="margin-right: -20px;">
					<oa-info-item :content="audit_info.audit_staff_name" label="审核人"/>
					<oa-info-item :content="audit_info.audit_time" label="审核时间"/>
					<oa-info-item :content="audit_info.status_name" label="审核状态"/>
					<oa-info-item :content="audit_info.audit_remark" :label="audit_info.status==3?'通过说明':'驳回说明'"/>
				</div>

			</template>
		</div>
		
		<template v-if="showBackBtn || showProtectBtn || showAuditBtn">
			<div style="height:60px"/>
			<div class="_footer">
		
				<i-button
					v-if="showBackBtn"
					@click="handleBack"
				>
					撤回 
				</i-button>
				<i-button
					v-if="showProtectBtn"
					@click="handleProtect"
				>
					发起辩护
				</i-button>
				<span v-if="showProtectBtn" class="g-absolute g-m-r-20" style="right: 10px">
					{{ count_down }}
				</span>
				<template v-if="showAuditBtn">
					<i-button
						v-if="$auth[1722]"
						@click="handlePass"
					>
						举报通过 
					</i-button>
					<i-button
						v-if="$auth[1723]"
						@click="handleReject"
					>
						举报驳回
					</i-button>
				</template>
			</div>
		</template>
	</i-drawer>
</template>

<script>
import { Drawer, Button, Checkbox, Poptip } from "iview";
import AutoTooltip from "@common/auto-tooltip/auto-tooltip";
import { FilePreview } from '@common/file-preview/file-preview';
import { CreatePortal, ImgsPicker, Fragment, ImgsPreview } from "wya-vc";
import { debounce } from 'lodash';
import Loading from '@components/_common/loading/loading';
import Upload from '@common/upload/upload';
import CusAudio from '@components/sale/_common/audio/audio';
import { getHashUrl, oneLinePipe } from '@utils/utils';
import InfoItem from "@components/sale/_common/info-item";
import { Confirm } from '@common/confirm/confirm';
import { services } from '@stores/services/hr';
import { setData } from '@components/sale/_common/util';
import { ConfirmWithRemark } from "@components/sale/_common/customer/confirm-remark";
import '../../_common/hr-side.scss';
import { ProtectReport } from './protect-report.vue';

export default {
	name: "oa-hr-personal-report-detail",
	components: { 
		"i-drawer": Drawer,
		'oa-loading': Loading,
		'i-button': Button,
		'oa-info-item': InfoItem,
		'i-checkbox': Checkbox,
		'i-poptip': Poptip,
		'oa-upload': Upload,
		'oa-auto-tooltip': AutoTooltip,
		'oa-cus-audio': CusAudio
	},
	mixins: [],
	props: {
		reportId: Number,
		reportType: Number, // 举报类型：1-错误关联举报，2-跟进记录举报
		tabType: String, // tab类型 1-我的举报，2-我的被举报
		companyName: String,
		updateList: Function,
		mode: {
			type: String,
			default: 'hr', // hr / sale
		}
	},
	data() {
		return {
			visible: false,
			loading: false,
			auditCallback: (status) => (remark) => {
				const param = {
					report_ids: [this.reportId],
					status,
					audit_remark: remark,
				};

				return this.$request({
					url: "_HR_ARCHIVES_AUDIT_AUDIT_POST",
					type: "POST",
					param,
					loading: false,
				}).then(res => {
					this.$Message.success(res.msg);
					return res;
				}).catch((res) => {
					console.error(res, param);
					this.$Message.error(res.msg);
					return res;
				});
			},
			auditConfig: {
				1: {
					name: "待辩护",
					label: '',
					class: 'g-c-orange-mid'

				},
				2: {
					name: "待审核",
					label: '',
					class: 'g-c-orange-mid'
				},
				3: {
					name: "举报通过",
					label: '通过说明',
					class: 'g-c-green-mid'
				},
				4: {
					name: "举报驳回",
					label: '驳回说明',
					class: 'g-c-red-mid'
				}

			},
			"report_info": {
				create_time: '',
				"link": {
					"link_str": "",
					"staff_name": "",
					"create_time": ""// 添加时间
				},
				"reason": "", // 举报原因
				"remark": "", // 举报说明
				"images": [], // 举报凭证
				"customer_record": {// 跟进记录举报才有
					"record_id": '',
					"type": '',
					"customer_id": '',
					"call_id": '',
					"tel": "", // OA通话记录电话
					"remark": "", // 跟进记录备注
					"staff_id": 1,
					"customer_intention": "", // 客户意向
					"connect_status": "", // 接通状态
					"create_time": "", // 跟进时间
					"update_time": '',
					"staff_name": "",
					"type_name": "", // 跟进方式
					"tape_link": '', // 录音地址
					"customer_name": ""// 客户名称
				}
			},
			"defend_info": {
				"staff_name": "",
				"defend_time": "",
				"defend_remark": "",
				"images": []// 辩护凭证
			},
			"audit_info": {
				"audit_staff_name": "",
				"audit_time": "",
				"audit_remark": "",
				"status": 0,
				"status_name": ""// 举报状态
			},
			count_down: '',
		};
	},
	computed: {
		titlePrefix() {
			return (this.tabType == '2' && this.mode == 'hr') ? '被' : '';
		},
		audit() {
			return this.auditConfig[this.audit_info && this.audit_info.status] || {};
		},
		showBackBtn() {
			return this.mode == "hr" && this.tabType == 1 && (this.audit_info.status == 1 || this.audit_info.status == 2) && this.$auth[1706];

		},
		showProtectBtn() {
			return this.mode == "hr" && this.tabType == 2 && this.audit_info.status == 1 && this.$auth[1708];
		},
		customer_record() {
			return this.report_info.customer_record;
		},
		showAuditBtn() {
			return this.mode == 'sale' && this.tabType == 2;
		}

	},
	watch: {
		'reportId': function (newVal, oldVal) {
			this.loadData();
		}
	},
	mounted() {
		this.visible = true;
		this.loadData();

	},
	methods: {
		handleOk() {
			this.visible = false;
			this.$emit("sure");
		},
		handleCancel() {
			this.visible = false;
			this.$emit("close");
		},
		
		loadData() {
			this.$request({
				url: '_HR_PERSONAL_REPORT_DETAIL_GET',
				type: "GET",
				param: {
					report_id: this.reportId
				},
				loading: false,
			}).then(res => {
				this.report_info = res.data.report_info;
				this.defend_info = res.data.defend_info;
				this.audit_info = res.data.audit_info;
				this.count_down = res.data.count_down;
				// setData(this.info, res.data);
			}).catch((res) => {
				console.error(res);
				this.$Message.error(res.msg);
			});

		},
		handleBack() {
			Confirm.popup({
				msg: '确定要撤回举报吗？'
			}).then(() => {
				this.$request({
					url: "_SALE_CUSTOMER_REPORT_DELETE_POST",
					type: "POST",
					param: {
						report_id: this.reportId
					},
					loading: false,
				}).then(res => {
					this.$Message.success(res.msg);
					this.updateList && this.updateList();
				}).catch((res) => {
					console.error(res, { report_id: this.reportId });
					this.$Message.error(res.msg);
				});
			});

		},
		handleProtect() {
			ProtectReport.popup({
				reportId: this.reportId
			}).then(() => {
				this.loadData();
				this.updateList && this.updateList();
			}).catch((res) => {
				res && console.error(res);
			});
		},
		handlePass() {
			ConfirmWithRemark.popup({
				title: "举报通过",
				label: "通过说明：",
				placeholder: "请填写通过说明",
				required: false,
				okCallback: this.auditCallback(3)
			}).then(() => {
				this.updateList();
				this.handleOk();
			}).catch(e => e && console.error(e));

		},
		handleReject() {
			ConfirmWithRemark.popup({
				title: "举报驳回",
				label: "驳回说明：",
				placeholder: "请填写驳回说明",
				okCallback: this.auditCallback(4)
			}).then(() => {
				this.updateList();
				this.handleOk();
			}).catch(e => e && console.error(e));

		}

		
	}
};
export const ReportDetail = CreatePortal({ alive: true }, module.exports.default);
</script>
<style lang="scss" >
.v-hr-personal-report-detail {
	._audio-background {
		background: #F5F5F6;
		border-radius: 4px;
		padding-left: 20px;
		padding-right: 20px;
	}
	&._small-drawer {
		.ivu-drawer.ivu-drawer-right {
			width: 720px !important;

		}
		._footer {
			width: 720px;
		}

	}
	

}
</style>
