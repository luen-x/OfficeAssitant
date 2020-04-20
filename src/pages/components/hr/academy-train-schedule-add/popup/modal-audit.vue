<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		:title="title == 1 ? '查看详情' : (showAuditInfo ? '批量审核' : '审核')"
		width="680px"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="v-academy-train-detail-enroll-result">
			<div class="_content">
				<div v-if="!showAuditInfo">
					<div class=" g-flex">
						<oa-across-table :data="crossData"/>
					</div>
					<i-row v-if="apply_type == 1" class="g-m-b-15" style=" margin-top: -10px">
						<i-col span="5" style="width: 88px;" class="g-tr">报名课程：</i-col>
						<i-col span="19" style="word-break:break-all">{{ course_name }}</i-col>
					</i-row>
					<i-row v-else class="g-m-b-15" style=" margin-top: -10px">
						<i-col span="5" style="width: 88px;" class="g-tr">关联事项：</i-col>
						<i-col span="19" style="word-break:break-all">{{ course_name }}</i-col>
					</i-row>
					<i-row class="g-m-b-15">
						<i-col span="5" style="width: 88px;" class="g-tr">推荐人：</i-col>
						<i-col v-if="referee_name" span="19">{{ referee_name }}</i-col>
						<i-col v-else span="19">--</i-col>
					</i-row>
					<i-row v-if="apply_remark" class="g-m-b-15">
						<i-col span="5" style="width: 88px;" class="g-tr">报名原因：</i-col>
						<i-col span="19">{{ apply_remark }}</i-col>
					</i-row>
					<i-row v-if="status_name" class="g-m-b-15">
						<i-col span="5" style="width: 88px;" class="g-tr">审核状态：</i-col>
						<i-col span="19">{{ status_name }}</i-col>
					</i-row>
					<i-row v-if="audit_remark" class="g-m-b-15">
						<i-col span="5" style="width: 88px;" class="g-tr">审核理由：</i-col>
						<i-col span="19">{{ audit_remark }}</i-col>
					</i-row>
				</div>
				<div v-if="status == '1' || showAuditInfo" class="_content-bottom">
					<i-form 
						ref="auditData" 
						:model="auditData" 
						:rules="auditRule" 
						:label-width="100">
						<i-form-item label="审核结果：" prop="status" style="margin-top: 10px">
							<i-radio-group v-model="auditData.status">
								<i-radio :label="2">通过</i-radio>
								<i-radio :label="3">驳回</i-radio>
							</i-radio-group>
						</i-form-item>
						<i-form-item 
							:rules="{ required: auditData.status != 2, message: '理由不能为空', trigger: 'blur' }" 
							prop="audit_remark" 
							label="理由：">
							<oa-limit-words
								v-model="auditData.audit_remark"
								:max="200"
								style="width: 440px"
								placeholder="请输入通过或驳回原因"
							/>
						</i-form-item>
					</i-form>
				</div>
			</div>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Row, Col, Radio, RadioGroup, Input, Form, FormItem, Steps, Step, Message, Tooltip } from 'iview';
import { CreatePortal } from 'wya-vc';
import API_ROOT from '@stores/apis/root';
import AcrossTable from "@components/_common/across-table/across-table";

export default {
	name: "oa-hr-train-detail-delete-tip",
	components: {
		'i-modal': Modal,
		'i-col': Col,
		'i-row': Row,
		'i-radio': Radio,
		'i-radio-group': RadioGroup,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		"oa-across-table": AcrossTable
	},
	props: {
		courseIds: {
			// 为字符串表示单个审核或查看， 为数组表示批量审核
			required: true,
			type: [String, Number, Array]
		},
		title: Number
	},
	data() {
		return {
			visible: false,
			crossData: [],
			auditData: {
				status: '',
				audit_remark: ''
			},
			auditRule: {
				status: [
					{ required: true, type: 'number', message: '请选择审核结果', trigger: 'change' }
				]
			},
			status: '',
			referee_name: '',
			course_name: '',
			imgs: [],
			apply_type: '',
			apply_remark: '',
			audit_remark: '',
			status_name: ''
		};
	},
	computed: {
		showAuditInfo() {
			return Array.isArray(this.courseIds);
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
			if (!Array.isArray(this.courseIds)) {
				this.$request({
					url: API_ROOT._HR_ACADEMY_TRAIN_DETAIL_ENROLL_2_RESULT_AUDIT_GET,
					param: { record_id: this.courseIds },
					type: 'GET'
				}).then(({ data }) => {
					const staffData = {
						status: 2,
						title: data.depart_name + data.staff_name,
						content: data.create_time,
					};
					const auditData = {
						status: data.status,
						title: '三立学府',
						content: data.audit_time
					};
					this.crossData = [staffData, auditData];
					this.status = data.status + '';
					this.referee_name = data.referee_name;
					this.course_name = data.course_name;
					this.apply_type = data.apply_type;
					this.apply_remark = data.apply_remark;
					this.audit_remark = data.audit_remark;
					this.status_name = data.status_name;
				});
			}
		},
		handleOk() {
			if (this.status == '1' || this.showAuditInfo) {
				this.$refs.modal.buttonLoading = false;
				this.$refs.auditData.validateAndScroll(valid => {
					if (valid) {
						this.$request({
							url: API_ROOT._HR_ACADEMY_TRAIN_DETAIL_ENROLL_2_RESULT_AUDIT_POST,
							param: { 
								...this.auditData,
								record_ids: this.showAuditInfo ? this.courseIds : [this.courseIds]
							},
							type: "POST"
						}).then(res => {
							this.$emit('sure');
						}).catch(err => this.$Message.error(err.msg));
					
					}
				});
			} else {
				this.handleCancel();
				return;
			}
		},
		handleCancel() {
			this.$refs.modal.buttonLoading = false;
			this.$emit('close', false);
			this.visible = false;
		},
	}
};
export const AuditModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" >
.v-academy-train-detail-enroll-result {
        ._content {
		position: relative;
        padding: 0 23px 0px 50px;
		max-height: 480px;
		overflow-y: auto;
		overflow-x: hidden;
        ._content-top {
            padding-bottom: 20px;
            border-bottom: 1px solid #d4d7db;
        }
		._content-title {
			margin: 20px 0 20px 6px;
			font-size: 16px;
			color: #000;
		}
        ._content-text {
			word-wrap: break-word;
        }
        ._content-mid {
            padding-bottom: 20px;
            border-bottom: 1px solid #d4d7db;
		}
		._content-bottom {
            overflow: hidden;
			background: #f5f5f6;
			padding-bottom: 10px;
		}
		.__item {
			img {
				border: 1px solid #d4d7db;
			}
		}
        .c-across-table {
            flex: 1;
            ._item {
            flex: 1;
        }
            ._line {
                width: 167px;
                height: 1px;
                position: absolute;
                top: 20px;
                left: 200px;
            }
        }
    }
}
</style>
