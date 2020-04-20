import { ImgsPreview } from 'wya-vc';
import { Tooltip } from "iview";
import { Confirm } from '../../_common/confirm/confirm';
import { UploadProof } from '../train-study/popup/upload-proof';
import { AuditModal } from './popup/audit-modal';

export default {
	data() {
		return {
			columns: [
				{
					title: '课程名称',
					key: 'course_name',
					minWidth: 120,
				},
				{
					title: '项目类型',
					key: 'project_type_name',
					minWidth: 120,
				},
				{
					title: '项目主题',
					key: 'project_topic',
					minWidth: 120,
				},
				{
					title: '课程来源',
					key: 'user_source_name',
					minWidth: 150,
				},
				{
					title: '发起时间',
					key: 'create_time',
					minWidth: 170,
				},
				{
					title: '审核人',
					key: 'audit_staff_name',
					minWidth: 100,
				},
				{
					title: '操作时间',
					key: 'audit_time',
					minWidth: 160,
				},
				{
					title: '操作',
					key: 'title',
					width: 170,
					render: (h, { row }) => {
						if (this.type == 1) {
							return (
								<div class="g-operation g-flex" >
									<span onClick={() => { this.handleEdit(row); }}>重新编辑</span>
									<span style="margin: 0 5px">|</span>
									<span onClick={() => { this.handleRecall(row); }}>撤回申请</span>
								</div>
							);
						} else if (this.type == 2) {
							return (
								<div class="g-operation g-flex " >
									<span onClick={() => { this.handleAuditModal(row); }}>查看申请</span>
								</div>
							);
						} else {
							return (
								<div class="g-operation g-flex " >
									<span onClick={() => { this.handleAuditModal(row); }}>查看</span>
									<span style="margin: 0 5px">|</span>
									{
										row.is_again == 0
											? <span onClick={() => { this.handleApplyAgain(row); }}>重新申请</span>
											: <span style={{
												color: '#bfbfbf'
											}}>重新申请</span>
									}
									<span style="margin: 0 5px">|</span>
									<span onClick={() => { this.handleDel(row); }}>删除</span>
								</div>
							);
						}

					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('SALE_TRAIN_STUDY_EXAMINE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('SALE_TRAIN_STUDY_EXAMINE_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleAuditModal(row) {
			AuditModal.popup({
				id: row.audit_id
			}).then();
		},
		handleDel(row) {
			Confirm.popup({
				msg: '确认删除该条记录吗？'
			}).then((data) => {
				this.$request({
					url: '_SALE_TRAIN_EXAM_STAFF_EXAM_AUDIT_DELETE_POST',
					type: "post",
					param: {
						audit_ids: [row.audit_id]
					}
				}).then(res => {
					this.$Message.error(res.msg);
					this.handleResetCur();
				}).catch(error => {
					this.$Message.error(error.msg);
				});
			});
		},
		handleRecall(row) {
			Confirm.popup({
				msg: '撤回后填写的信息将无法恢复，确认要撤回吗？'
			}).then((data) => {
				this.$request({
					url: '_SALE_TRAIN_EXAM_STAFF_EXAM_AUDIT_CANCEL_POST',
					type: "post",
					param: {
						audit_id: row.audit_id
					}
				}).then((res) => {
					this.$Message.success(res.msg);
					this.handleResetCur();
				}).catch(error => {
					this.$Message.error(error.msg);
				});
			});
		},
		handleEdit(row) {
			UploadProof.popup({
				data: {
					api: "_SALE_TRAIN_EXAM_STAFF_EXAM_AUDIT_AGAIN_POST",
					res: row,
					exam_id: row.exam_id,
					title: "编辑",
					witness_name: row.witness_name,
					course: row.course_name,
					course_id: row.course_id,
				}
			}).then(res => {
				this.handleResetCur();
			});
		},
		handleApplyAgain(row) {
			UploadProof.popup({
				data: {
					api: "_SALE_TRAIN_EXAM_SUBMIT_AUDIT_POST",
					res: row,
					exam_id: row.exam_id,
					title: "重新申请",
					witness_name: row.witness_name,
					course: row.course_name,
					course_id: row.course_id
				}
			}).then(res => {
				this.handleResetCur();
			});
		},
	}
};

