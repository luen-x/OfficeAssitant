<template>
	<div>
		<i-drawer
			:mask="false"
			:mask-closable="false"
			:styles="styles"
			v-model="visible"
			:loading="true"
			:title="company_name"
			width="720"
			class="v-archives-audit g-fs-14"
			@on-close="handleClose"
		>
			<div v-if="!isLoading">
				<div class="_wrapper">
					<div
						class="g-fs-14 g-c-black3 g-lh-16 g-pd-l-10 g-m-b-20"
						style="border-left: 2px solid #e84854;height: 16px;"
					>
						举报内容
					</div>
					<div style="margin-left: 14px;">
						<div class="__item">
							<span class="__label">举报时间：</span>
							<span class="__text">{{ report_info.create_time }}</span>
						</div>
						<div class="__item">
							<span class="__label">举报内容：</span>
							<div class="g-inline-block __card g-pd-20">
								<div>
									<div class="g-m-b-10">
										<span class="g-c-block1 g-fs-14 g-m-r-10">{{ report_info.customer_record.type_name }}</span>
										<span v-if="report_info.customer_record.type == 1 || report_info.customer_record.type == 4" class="g-gs-14">
											{{ report_info.customer_record.connect_status }}
										</span>
										<span 
											v-if="report_info.customer_record.customer_intention"
											class="g-gs-14"
										>
											{{ report_info.customer_record.customer_intention }}
										</span>
										<span class="g-fr" style="color: #999">
											{{ report_info.customer_record.staff_name }}
											{{ report_info.customer_record.create_time }}
										</span>
									</div>
									<div v-if="report_info.customer_record.type == 1">
										<div class="g-m-b-10">
											<span class="__label">沟通客户：</span>
											<span class="__text">{{ report_info.customer_record.customer_name }}</span>
											<span class="__label" style="margin-left: 50px;">电话：</span>
											<span class="__text">{{ report_info.customer_record.tel }}</span>
										</div>
										<oa-cus-audio
											v-if="report_info.customer_record.tape_link"
											:src="report_info.customer_record.tape_link"
											:disabled="false"
											mode="mid"
											show-tip="never"
											class="g-m-b-5"
											style="width: 500px;display: inline-block;"
										/>
										<div v-if="report_info.customer_record.remark" class="g-m-t-5">
											<span class="__label">备注：</span>
											<span class="__text">{{ report_info.customer_record.remark }}</span>
										</div>
									</div>
									<div v-if="report_info.customer_record.type !== 1">
										<span class="__label">跟进记录：</span>
										<span class="__text">{{ report_info.customer_record.remark }}</span>
									</div>
								</div>
							</div>
						</div>
						<div class="__item">
							<span class="__label">举报说明：</span>
							<span class="__text __value">{{ report_info.remark }}</span>
						</div>
					</div>
					<div
						v-if="type !== 2"
						class="g-fs-14 g-c-black3 g-lh-16 g-pd-l-10 g-m-t-20"
						style="border-left: 2px solid #e84854;height: 16px;"
					>
						审核状态
					</div>
					<div v-if="type !== 2" style="margin-left: 14px;">
						<div class="g-flex g-fw-w">
							<oa-info-item :content="audit_info.audit_staff_name" label="审核人："/>
							<oa-info-item :content="audit_info.audit_time" label="审核时间："/>
							<oa-info-item :content="audit_info.status_name" label="审核状态："/>
							<oa-info-item :content="audit_info.audit_remark" :label="type==3 ? '通过说明：' : '驳回原因'"/>
						</div>
					</div>
				</div>
				<div
					v-if="type == 2 &&($auth[1672] || $auth[1673])"
					name="foot"
					class="_footer"
				>
					<i-button
						v-if="$auth[1672]"
						type="primary"
						style="margin: 0 6px 0 20px"
						@click="handleOk(1)"
					>
						举报通过
					</i-button>
					<i-button
						v-if="$auth[1673]"
						@click="handleOk(0)"
					>
						举报驳回
					</i-button>
				</div>
			</div>
			<div v-if="isLoading">
				<oa-loading/>
			</div>
		</i-drawer>
	</div>
</template>
<script>
import { Button, Drawer, Input } from "iview";
import { CreatePortal, ImgsPreview } from "wya-vc";
import Loading from '@components/_common/loading/loading';
import API_ROOT from '@stores/apis/root';
import InfoItem from "@components/sale/_common/info-item";
import CusAudio from '@components/sale/_common/audio/audio';
import { AuditModal } from './audit-modal';

export default {
	name: "oa-audit-detail",
	components: {
		"i-button": Button,
		"i-drawer": Drawer,
		"i-input": Input,
		'vc-imgs-preview': ImgsPreview,
		'oa-loading': Loading,
		'oa-info-item': InfoItem,
		'oa-cus-audio': CusAudio,
	},
	props: {
		reportId: {
			required: true,
			type: Number,
			default: 1
		},
		company_name: {
			type: String,
			default: ''
		},
		type: {
			type: Number,
			default: 2
		}
	},
	data() {
		return {
			visible: false,
			audio: '',
			styles: {
				height: "calc(100% - 55px)",
				overflow: "hidden",
				paddingBottom: "53px",
				position: "static"
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
			audit_info: {
				audit_staff_name: '',
				audit_time: '',
				audit_remark: '',
				status: '',
				status_name: ''
			},
			isLoading: false
		};
	},
	watch: {
		reportId(val) {
			this.loadData(val);

		}
	},
	created() {
		this.loadData();
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		loadData() {
			this.isLoading = false;
			this.$request({
				url: `_HR_ARCHIVES_AUDIT_DETAIL_GET`,
				type: 'GET',
				param: {
					report_id: this.reportId
				},
				loading: false
			}).then(res => {
				this.isLoading = false;
				this.report_info = res.data.report_info;
				this.audit_info = res.data.audit_info;
				// this.$Message.success(res.msg);
			}).catch(err => {
				// this.$Message.error(err.msg);
			});
		},
		handleOk(name) {
			AuditModal.popup({
				report_ids: [this.reportId],
				status: name,
				record_type: this.report_info.customer_record.type,
				remark: this.report_info.customer_record.remark
			}).then(res => {
				this.$store.commit('HR_ARCHIVES_AUDIT_LIST_INIT');
			}).catch(err => err && console.error(err));
		},
		handleClose() {
			this.$emit('close');
		},
		handleSaveChange() {

		},
		handleSuccessSave() {
			this.loadData();
		}
	}
};
export const DetailDrawer = CreatePortal({
	alive: true
}, module.exports.default);
</script>
<style lang="scss">
.v-archives-audit {
	position: relative;
	._wrapper {
		.__item {
			display: flex;
			margin-bottom: 10px;
			.__label {
				box-flex: 1;
				flex: 0 1 65px;
				color: #818794;
			}
			.__text {
				color: #4b4f57;
			}
			.__value {
				width: 800px;
			}
			.__card {
				width: 90%;
				background:rgba(255,255,255,1);
				box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
			}
		}
	}
	._footer {
		width: 100%;
		position: absolute;
		background-color: #fff;
		left: 0;
		bottom: 0;
		height: 60px;
		line-height: 60px;
		box-shadow: 0 -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
	}
	.ivu-drawer-header-inner {
		font-size: 16px;
		color: #000;
		font-weight: normal;
	}
	.ivu-drawer-body {
		overflow: auto !important;
	}
}
</style>

