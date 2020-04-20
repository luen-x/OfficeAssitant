<template>
	<i-drawer
		v-model="visible"
		:mask-closable="false"
		:mask="false"
		class="v-hr-side-detail-academy"
		@on-close="handleCancel"
	>
		<oa-loading v-if="loading"/>
		<div
			class="_head-title"
			style="padding-bottom: 0;"
		>
			题目详情
		</div>
		<div v-if="questionInfo.question_id" class="g-pd-l-20" style="flex:1;overflow-y:auto">
			<oa-question v-if="isEdit" :data="questionInfo"/>
			<oa-question-pre v-else :data="questionInfo" />

		</div>
	</i-drawer>
</template>

<script>
import { Drawer, Button } from "iview";
import { CreatePortal, ImgsPicker, Fragment, ImgsPreview } from "wya-vc";
import { debounce } from 'lodash';
import Loading from '@components/_common/loading/loading';
import QuestionPreview from '@components/_common/questions/question-preview';
import Question from '@components/_common/questions/question';
import { getHashUrl } from '@utils/utils';
// import '../../_common/hr-side';

export default {
	name: "c-sale-customer-detail",
	components: {
		"i-drawer": Drawer,
		'oa-loading': Loading,
		'i-button': Button,
		'oa-question-pre': QuestionPreview,
		'oa-question': Question
	},
	props: {
		questionId: Number
	},
	data() {
		return {
			visible: false,
			loading: false,
			isEdit: false,
			questionInfo: {
				question_id: '',
			}
		};
	},
	computed: {

	},
	watch: {
		'data.questionId': function (newVal, oldVal) {
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
		handleEdit() {
			this.isEdit = true;
		},
		loadData() {
			this.$request({
				url: "_HR_TRAIN_LIBRARY_QUESTION_INFO_GET",
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
		handleSave() {
			this.isEdit = false;
			// this.$request({
			// 	url: "",
			// 	type: "GET",
			// 	param: {},
			// 	loading: false,
			// }).then(res => {
			// 	this.isEdit=false

			// }).catch((res) => {
			// 	this.$Message.error(res.msg);
			// });

		},
		handleDelete() {
			
		}
	}
};
export const QuestionDetail = CreatePortal({ alive: true }, module.exports.default);
</script>
<style lang="scss" >
.v-hr-side-detail-academy {
	height: 100%;
	._head-title {
		font-size: 16px;
		width: 700px;
		color: black;
		padding: 20px 20px 20px 20px;
	}
	.ivu-drawer-body {
		padding: 0;
		display: flex;
		flex-direction: column;
		// padding-bottom: 100px;
	}
	._title-wrapper {
		padding-left: 20px;
		padding-bottom: 0;
	}
	._span1 {
		min-width: 170px;
		display: inline-block;
		font-size: 12px;
		margin-bottom: 11px;
		._left-text {
			color: #818794;
		}
		._right-text {
			color: #333;
		}
	}
	.ivu-tabs-nav-scroll {
		background: #f5f5f6;
		border-bottom: 2px #d4d7db solid;
	}
	.ivu-tabs-nav-container:focus .ivu-tabs-tab-focused {
		border-color: #e84854 !important;
	}
	.ivu-tabs-tab {
		padding: 6px 0;
		margin: 0 15px;
		&:hover {
			color: #e84854;
		}
		&:focus {
			color: #e84854;
			border-bottom: 2px #e84854 solid;
		}
	}
	.ivu-tabs {
		flex: 1;
		display: flex;
		flex-direction: column;
		margin-bottom: 60px;
	}
	.ivu-tabs-content {
		flex: 1;
	}
	.ivu-tabs-tabpane {
		padding: 0 20px;
		overflow-y: auto;
		overflow-x: hidden;
		max-height: 100%;
	}
	.ivu-tabs-tab-focused {
		color: #e84854;
		border-bottom: 2px #e84854 solid;
	}
	._title-bar {
		display: inline-block;
		width: 2px;
		height: 14px;
		position: relative;
		top: 1px;
		background-color: #e74854;
	}
	._footer {
		width: 940px;
		height: 60px;
		position: fixed;
		bottom: 0;
		right: 0;
		box-shadow: 0 -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
		padding: 10px 16px;
		background: #fff;
		.ivu-btn {
			margin-left: 5px;
			margin-right: 5px;
			&:first-child {
				background-color: #e74854 !important;
				border-color: #e74854 !important;
				color: white;
				&:hover {
					color: white !important;
				}
			}
		}
		display: flex;
		align-items: center;
	}
	.ivu-tabs-ink-bar {
		display: none;
	}
	.ivu-tabs-bar {
		border: none;
		margin-bottom: 0;
	}
}
</style>
