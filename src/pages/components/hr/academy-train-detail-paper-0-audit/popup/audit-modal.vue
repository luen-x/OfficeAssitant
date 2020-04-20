<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		:title="showAuditInfo ? '批量审核' : '审核'"
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
					<i-row class="g-m-b-15" style=" margin-top: -10px">
						<i-col span="5" style="width: 88px;" class="g-tr">课程：</i-col>
						<i-col span="19" style="word-break:break-all">{{ course_name }}</i-col>
					</i-row>
					<i-row class="g-m-b-15">
						<i-col span="5" style="width: 88px;" class="g-tr">证明人：</i-col>
						<i-col span="19">{{ referee_name }}</i-col>
					</i-row>
					<i-row v-if="status > 1" class="g-m-b-15">
						<i-col span="5" style="width: 88px;" class="g-tr">原因：</i-col>
						<i-col span="19">
							{{ auditData.audit_remark }}
						</i-col>
					</i-row>
					<i-row class="g-m-b-15">
						<i-col span="5" style="width: 88px;" class="g-tr">凭证：</i-col>
						<i-col span="19">
							<vc-imgs-preview v-if="imgs.length" :data-source="imgs" />
							<span v-else>未上传凭证</span>
						</i-col>
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
						<i-form-item label="理由：" prop="audit_remark">
							<oa-limit-words
								v-model="auditData.audit_remark"
								:max="200"
								style="width: 440px"
								placeholder="请输入备注"
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
import { CreatePortal, ImgsPreview } from 'wya-vc';
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
		"oa-across-table": AcrossTable,
		'vc-imgs-preview': ImgsPreview,
	},
	props: {
		id: {
			// 为字符串表示单个审核或查看， 为数组表示批量审核
			required: true,
			type: [String, Number, Array]
		}
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
				],
				audit_remark: [
					{ required: true, message: '备注不能为空', trigger: 'blur' }
				],
			},
			status: '',
			referee_name: '',
			course_name: '',
			imgs: []
		};
	},
	computed: {
		showAuditInfo() {
			return Array.isArray(this.id);
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
			if (!this.showAuditInfo) {
				this.$request({
					url: API_ROOT._HR_ACADEMY_TRAIN_ARRANGEMENT_AUDIT_DETAIL_GET,
					param: { audit_id: this.id },
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
					this.status = data.status;
					this.referee_name = data.referee_name;
					this.course_name = data.course.map(v => v.course_name).join('、');
					this.auditData.audit_remark = data.audit_remark;
					this.imgs = data.voucher.split(',');
				});
			}
		},
		handleOk() {
			if (this.status == '1' || this.showAuditInfo) {
				this.$refs.modal.buttonLoading = false;
				this.$refs.auditData.validateAndScroll(valid => {
					if (valid) {
						this.$request({
							url: API_ROOT._HR_ACADEMY_TRAIN_ARRANGEMENT_AUDIT_POST,
							param: { 
								...this.auditData,
								audit_id: this.showAuditInfo ? this.id : [this.id]
							},
							type: "POST"
						}).then(res => {
							this.$emit('sure');
						}).catch(err => this.$Message.error(err.msg));
					
					} else {
						this.visible = true;
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
