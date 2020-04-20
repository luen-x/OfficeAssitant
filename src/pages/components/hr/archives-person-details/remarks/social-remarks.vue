<template>
	<div class="hr-archives-person-details-remarks-social-remartks">
		<div class="_title g-m-b-20">
			<span :class="{'_active': tab }" @click="tab = true">备注信息</span>
			<span :class="{'_active': !tab }" class="g-m-l-10" @click="tab = false">操作记录</span>
		</div>
		<div v-if="tab" >
			<div
				v-for="(item, index) in dataSource"
				:key="index"
				class="g-flex"
				style="marginLeft: 12px"
			>
				<div
					v-if="item.remarks_info && item.remarks_info.length"
					class="g-c-black2 g-fs-14"
					style="white-space: nowrap;min-width: 70px;">
					{{ item.status_name }}:
				</div>
				<oa-steps
					v-if="item.remarks_info && item.remarks_info.length"
					:type="1"
					:data-source="item.remarks_info"
					:render-title="renderTitle"
					:render-content="renderContent"
					class="g-m-l-20 _steps"
				/>
			</div>
		</div>
		<div v-else >
			<oa-steps
				v-if="record.length"
				:data-source="record"
				:render-title="renderRecordTitle"
				:render-content="renderRecordContent"
				:type="1"
				class="g-m-l-20 _steps"
			/>
			<div v-else class="g-m-l-20">无操作记录</div>
		</div>
	</div>
</template>

<script>
import Steps from '@components/_common/steps/steps';
import LimitWords from '@components/_common/limit-words/limit-words';
import { getParseUrl, getHashUrl } from '@utils/utils';
import API_ROOT from '@stores/apis/root';
// import { delPModal } from '../recruit-school-summary-detail/popup/delete';
// import { editPModal } from '../recruit-school-summary-detail/popup/edit';

export default {
	name: 'oa-hr-social-summary-info-remarks',
	components: {
		'oa-steps': Steps,
		'oa-limit-words': LimitWords,
	},
	props: {
		dataSource: {
			type: Array,
			default() {
				return [];
			}
		},
		record: {
			type: Array,
			default() {
				return [];
			}
		},
		onRefresh: Function
	},
	data() {
		const { query } = getParseUrl();
		return {
			listType: query.type !== 'social-statistics',
			remarks: '',
			tab: true,
		};
	},
	computed: {
		isShow() {
			const { query } = getParseUrl();
			let flag = true;
			if (query.list_type == 'try-data-detail-index'
				|| query.list_type == 'lecture-course-detail-index') {
				flag = false;
			} else if (query.list_type == 'transport' && query.type + '' !== '6') {
				flag = false;
			}
			return flag;
		}
	},
	methods: {
		renderRecordTitle(h, { rows }) {
			const { staff_name } = rows;
			return (
				<div class="g-flex g-jc-sb g-ai-c _item">
					<div class="g-fs-14 g-m-l-10" style="color: #666;">{staff_name}</div>
				</div>
			);
		},
		renderRecordContent(h, { rows }) {
			const { create_time, content } = rows;
			return (
				<div class="_desc">
					<div class="g-fs-14 g-c-black2 g-m-l-10">{content}</div>
					<div class="g-c-black4 g-pd-t-5 g-pd-b-20 g-m-l-10 g-nobreak">{create_time}</div>
				</div>
			);
		},
		renderTitle(h, params = {}) {
			const { staff_name } = params.rows;
			return (
				<div class="g-flex g-jc-sb g-ai-c _item">
					<div class="g-fs-14 g-m-l-10" style="color: #666;">{staff_name}</div>
					{ this.isShow && <span class="g-c-blue-mid g-pointer _action">
						<span class="g-m-r-5" onClick={() => this.handleEdit(params.rows)}>编辑</span>
						<span onClick={() => this.handleDelete(params.rows)}>删除</span>
					</span>}
				</div>
			);
		},
		renderContent(h, params = {}) {
			const { create_time, content } = params.rows;
			return (
				<div class="_desc">
					<div class="g-fs-14 g-c-black2 g-m-l-10">{content}</div>
					<div class="g-c-black4 g-pd-t-5 g-pd-b-20 g-m-l-10 g-nobreak">{create_time}</div>
				</div>
			);
		},
		// 编辑备注
		handleEdit(sed) {
			// editPModal.popup({
			// 	info: { ...sed, isSchool: false }
			// }).then(res => {
			// 	this.onRefresh && this.onRefresh(false);
			// }).catch(err => {});
		},
		// 删除备注
		handleDelete(sed) {
			// delPModal.popup({
			// 	info: { ...sed }
			// }).then(res => {
			// 	this.onRefresh && this.onRefresh(false);
			// }).catch(err => {});
		},
		handleAddRemark() {
			if (!this.remarks) {
				this.$Message.warning('请先输入备注');
				return;
			}
			this.$request({
				url: API_ROOT['_HR_RECRUIT_ADD_REMARKS_POST'], // eslint-disable-line
				type: "POST",
				param: {
					applicant_id: this.$route.params.id,
					remarks: this.remarks
				}
			}).then((res) => {
				this.onRefresh && this.onRefresh(false);
				this.remarks = '';
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		}
	}
};
</script>

<style lang="scss">
.hr-archives-person-details-remarks-social-remartks {
	height: 100%;
	overflow-x: auto;
	position: relative;
	min-width: 360px;
	margin-left: 40px;
	._title {
		font-size: 14px;
		color: #333333;
		line-height: 14px;
		background: #f0f4fc;
		padding: 0 15px;

		span {
			display: inline-block;
			cursor: pointer;
		}
		._active {
			color: #E74854;
			padding: 15px 0px 13px;
			border-bottom: 2px solid #E74854;
		}
	}
	._steps {
		word-break: break-all;
		margin-bottom: 60px;
		._item {
			._action {
				opacity: 0;
			}
		}

	}
	._footer {
		position: absolute;
		bottom: 0;
	}
}
</style>


