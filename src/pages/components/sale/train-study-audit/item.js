import { Tooltip } from "iview";
import { Confirm } from '../../_common/confirm/confirm';
import { UploadProof } from '../train-study/popup/upload-proof';
import { QuestionAudit } from '../../hr/_common/academy-course/modals/audit-question';
import { QuestionDetail } from '../../hr/_common/academy-course/drawers/question-detail';

export default {
	data() {
		return {
			columns: [
				{
					title: '题目',
					key: 'title',
					minWidth: 188,
					render: (h, { row }) => {
						return (
							<div class="g-operation" onClick={() => { this.handleDetail(row); }} >{
								row.title.length > 16
									? <Tooltip
										transfer
										placement="bottom"
									>
										<span>{row.title.substring(0, 16) + '...'}</span>
										<div style="white-space: normal;" slot="content">
											<span class="_inline-block">{row.title}</span>
										</div>
									</Tooltip>
									: <span>{row.title}</span>
							}
							</div>
						);
					}
				},
				{
					title: '题型',
					key: 'type_name',
					minWidth: 100
				},
				{
					title: '分值',
					key: 'score',
					minWidth: 100
				},
				{
					title: '发起时间',
					key: 'create_time',
					minWidth: 160
				},
				{
					title: '审核人',
					key: 'audit_staff_name',
					minWidth: 160
				},
				{
					title: '审核时间',
					key: 'audit_time',
					minWidth: 160
				},
				{
					title: '操作',
					key: 'opt',
					width: 180,
					render: (h, { row }) => {
						if (this.type == 1) {
							return (
								<div class="g-operation g-flex " >
									<span onClick={() => { this.handleEdit(row); }}>重新编辑</span>
									<span style="padding:0 5px">|</span>
									<span onClick={() => { this.handleRecall(row); }}>撤回申请</span>
								</div>
							);
						} else if (this.type == 2) {
							return (
								<div class="g-operation g-flex g-jc-sb" >
									<span onClick={() => { this.handleLook(row); }}>查看申请</span>
								</div>
							);
						} else {
							return (
								<div class="g-operation g-flex " >
									<span onClick={() => { this.handleLook(row); }}>查看</span>
									<span style="padding:0 5px">|</span>
									{
										row.is_again == 0
											? <span onClick={() => { this.handleApplyAgain(row); }}>重新申请</span>
											: <span style={{ color: '#bfbfbf' }}>重新申请</span>

									}
									<span style="padding:0 5px">|</span>
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
			this.$store.commit('SALE_TRAIN_STUDY_AUDIT_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('SALE_TRAIN_STUDY_AUDIT_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleDel(row) {
			Confirm.popup({
				msg: '确认删除该条记录吗？'
			}).then((data) => {
				this.$request({
					url: '_SALE_TRAIN_EXAM_QUESTION_DELETE_POST',
					type: 'GET',
					param: {
						question_ids: row.question_id
					},
				}).then((res) => {
					this.$Message.success(res.msg);
					this.handleResetFirst();
				}).catch((error) => {
					this.$Message.error(error.msg);
					console.error(error);
				});
			});
		},
		handleRecall(row) {
			Confirm.popup({
				msg: '撤回后填写的信息将无法恢复，确人要撤回吗？'
			}).then(() => {
				this.$request({
					url: '_SALE_TRAIN_EXAM_QUESTION_CANCEL_POST',
					type: 'GET',
					param: {
						question_id: row.question_id
					},
				}).then((res) => {
					this.$Message.success(res.msg);
					this.handleResetFirst();
				}).catch((error) => {
					this.$Message.error(error.msg);
					console.error(error);
				});
			});
		},
		handleApplyAgain(row) {
			Confirm.popup({
				msg: '确人要重新申请吗？'
			}).then(() => {
				this.$router.push({ path: '/sale/train/study/question?author=sale',
					query: { action: 'readd', pathName: '出题审核', author: 'sale', question_id: row.question_id } });
			});
		},
		handleEdit(row) {
			QuestionDetail.popup({
				questionId: row.question_id,
				author: 'sale',
				inEdit: true,
			}).then(res => {
				this.handleResetCur();
			}).catch(res => {
				this.handleResetCur();
			});
		},
		handleLook(row) {
			QuestionAudit.popup({
				questionId: row.question_id,
				author: 'sale',
				action: 'view'
			}).then(res => {
				this.handleResetCur();
			}).catch(res => {
				this.handleResetCur();
			});
		},
		handleDetail(row) {
			QuestionDetail.popup({
				questionId: row.question_id,
				author: 'sale',
				showFooter: false,
			}).then(res => {
				this.handleResetCur();
			}).catch(res => {
				this.handleResetCur();
			});
		}

	},
};


