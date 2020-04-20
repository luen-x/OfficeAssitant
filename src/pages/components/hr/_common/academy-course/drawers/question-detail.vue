<template>
	<i-drawer
		v-model="visible"
		:mask-closable="false"
		:mask="false"
		:class="{'_second-drawer':secondDrawer}"
		class="v-hr-side-detail"
		@on-close="handleCancel"
	>
		<oa-loading v-if="loading"/>
		<div
			class="_head-title"
			style="padding-left:20px"
		>
			题目详情
		</div>
		<div v-if="questionInfo.question_id" class="g-pd-lr-20 g-m-r-30" style="flex:1;overflow-y:auto">
			<oa-question 
				v-if="isEdit" 
				ref="question"	
				:data="questionInfo" 
				expand 
				show-keyword
				show-tip
			/>
			<oa-question-pre v-else :data="questionInfo" :width="secondDrawer?570:700" />

		</div>
		<template v-if="$auth[1051] || $auth[1057] || (author=='sale'&& $auth[502])">
			<div v-if="showFooter" style="height:60px"/>
			<div v-if="showFooter" class="_footer">
				<template v-if="questionAudit">
					<i-button v-if="auditStatus=='1'" @click="handleAudit">审核</i-button>
					<i-button v-else @click="handleViewAudit">查看审核结果</i-button>


				</template>
				<template v-else-if="isEdit">
					<i-button
						@click="handleSave"
					>
						保存
					</i-button>
					<i-button
						v-if="paperId && author=='hr'&& $auth[1052]"
						@click="handleSaveToStore"
					>
						保存并加入题库
					</i-button>
					<i-button
						@click="handleCancelEdit"
					>
						取消
					</i-button>
				</template>
				<template v-else>
					<i-button
						v-if="$auth[1057] || (author=='sale'&& $auth[502])"
						@click="handleEdit"
					>
						编辑
					</i-button>
					<i-button
						v-if="canDelete && ($auth[1051] || (author=='sale'&& $auth[502]))"
						@click="handleDelete"
					>
						删除
					</i-button>
				</template>
			</div>
		</template>
	</i-drawer>
</template>

<script>
import { Drawer, Button } from "iview";
import { CreatePortal, ImgsPicker, Fragment, ImgsPreview } from "wya-vc";
import { debounce } from 'lodash';
import Loading from '@components/_common/loading/loading';
import QuestionPreview from '@components/_common/questions/question-preview';
import Question from '@components/_common/questions/question';
import { Confirm } from '@common/confirm/confirm';
import { getHashUrl } from '@utils/utils';
import { QuestionAudit } from '../modals/audit-question';
import '../../hr-side';


const config1 = { // 对于题库的题目
	sale: {
		updateUrl: '_SALE_TRAIN_EXAM_UPDATE_QUESTION_POST',
		infoUrl: '_SALE_TRAIN_EXAM_QUESTION_DETAIL_GET'
	},
	hr: {
		updateUrl: '_HR_TRAIN_LIBRARY_QUESTION_UPDATE_POST',
		infoUrl: '_HR_TRAIN_LIBRARY_QUESTION_INFO_GET'
	}
};
const config2 = { // 对于某张试卷的题目
	sale: {
		updateUrl: '_SALE_TRAIN_EXAM_UPDATE_QUESTION_POST',
		infoUrl: '_SALE_TRAIN_EXAM_QUESTION_DETAIL_GET'
	},
	hr: {
		updateUrl: '_HR_ACADEMY_COURSE_PAPER_QUESTION_UPDATE_POST',
		infoUrl: '_HR_ACADEMY_COURSE_PAPER_QUESTION_DETAIL_GET'
	}
};
const config3 = { // 对于审核列表的题目
	hr: {
		infoUrl: '_HR_ACADEMY_COURSE_QUESTION_AUDIT_INFO_GET'
	}
};

const emptyFunc = () => {};
export default {
	name: "c-hr-question-detail",
	components: {
		"i-drawer": Drawer,
		'oa-loading': Loading,
		'i-button': Button,
		'oa-question-pre': QuestionPreview,
		'oa-question': Question
	},
	props: {
		questionId: [Number, String],
		paperId: [Number, String], // 查看试卷下的题目时必传
		inEdit: Boolean,
		secondDrawer: Boolean,
		author: {
			type: String,
			default: 'hr'
		},
		questionAudit: Boolean,
		auditStatus: String,
		updateTable: {
			type: Function,
			default: emptyFunc
		},
		deleteQuestion: {
			type: Function,
			default: emptyFunc
		},
		showFooter: {
			type: Boolean,
			default: true
		},
		canDelete: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			visible: false,
			loading: false,
			isEdit: this.inEdit,
			questionInfo: {
				question_id: '',
			},
			config: this.paperId ? config2 : config1
		};
	},
	computed: {
		infoUrl() {
			if (this.questionAudit) {
				return config3[this.author].infoUrl;
			} else {
				return this.config[this.author].infoUrl;
			}
		},
		updateUrl() {
			return this.config[this.author].updateUrl;
		}
	},
	watch: {
		'questionId': function (newVal, oldVal) {
			this.loadData();
		}
	},
	mounted() {
		this.visible = true;
		this.$vc.on('hr-academy-chooose-question-close', this.handleCancel);
		this.loadData();
	},
	beforeDestroy() {
		this.$vc.off('hr-academy-chooose-question-close', this.handleCancel);
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
		handleEdit() {
			this.isEdit = true;
		},
		loadData() {
			this.$request({
				url: this.infoUrl,
				type: "GET",
				param: {
					question_id: this.questionId
				},
				loading: false,
			}).then(res => {
				this.questionInfo = res.data;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		handleSave: debounce(function () {
			this.$refs.question.validate().then((valid) => {
				if (!valid) return;
				this.$request({
					url: this.updateUrl,
					type: "POST",
					param: {
						...this.$refs.question.getFormData(),
						paper_id: this.paperId || ''
					},
					loading: false,
				}).then(res => {
					this.isEdit = false;
					this.$Message.success(res.msg);
					this.loadData();
					this.updateTable();
				}).catch((res) => {
					this.$Message.error(res.msg);
				});
			});
		}, 200),
		handleSaveToStore: debounce(function () {
			this.$refs.question.validate().then((valid) => {
				if (!valid) return;
				const formData = this.$refs.question.getFormData();
				// 修改试卷的题目
				this.$request({
					url: this.updateUrl,
					type: "POST",
					param: {
						...formData,
						paper_id: this.paperId || ''
					},
					loading: false,
				}).then(res => {
					this.isEdit = false;
					this.$Message.success(res.msg);
					this.loadData();
					this.updateTable();
				}).catch((res) => {
					this.$Message.error(res.msg);
				});
				// 新增题库的题目
				this.$request({
					url: '_HR_TRAIN_LIBRARY_QUESTION_SAVE_POST',
					type: "POST",
					param: formData,
					loading: false,
				}).then(res => {
				}).catch((res) => {
					console.error(res);
					this.$Message.error(res.msg);
				});

			});
		}, 200),
		handleDelete() {
			this.deleteQuestion(this.questionId).then(() => {
				this.handleOk();
			}).catch(() => {});	
		},
		handleCancelEdit() {
			Confirm.popup({
				renderContent: (h) => {
					return (
						<div class="g-fs-14  g-c-black2">
						你填写的内容，还没有保存<br/>
						取消后内容将无法恢复，确定取消吗？
						</div>
					);
				}
			}).then(() => {
				this.isEdit = false;
			}).catch(() => {});
			
		},
		handleAudit() {
			QuestionAudit.popup({ 
				questionId: this.questionId,
				action: 'add',
				type: this.auditStatus
			}).then(() => {
				this.updateTable();
				this.handleOk();
			}).catch((res) => console.error(res));
		},
		handleViewAudit() {
			QuestionAudit.popup({ 
				questionId: this.questionId,
				action: 'view',
				type: this.auditStatus
			}).then(() => {
				
			}).catch((res) => console.error(res));

		}
	}
};
export const QuestionDetail = CreatePortal({ alive: true }, module.exports.default);
</script>
<style lang="scss" >
</style>
