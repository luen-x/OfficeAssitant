<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		:title="rowData.status == 2 ? '通过详情' : '驳回详情'"
		width="400px"
		class="v-collage-lesson-detail-modal"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div
			style="display: flex;"
			class="g-lh-30 g-c-black3">
			<div style="flex: 2" class="g-tr g-pd-r-5">活动类型：</div>
			<div style="flex: 7; width: 50%">
				<div>{{ detailData.activity_category_name }}</div>
			</div>
		</div>

		<div
			style="display: flex;"
			class="g-lh-30 g-c-black3">
			<div style="flex: 2" class="g-tr g-pd-r-5">
				{{ roleKeyList.includes(3) ? '课程名称' : '活动名称' }}：
			</div>
			<div style="flex: 7; width: 50%">
				<div>{{ detailData.lesson_name }}</div>
			</div>
		</div>

		<div
			style="display: flex;"
			class="g-lh-30 g-c-black3">
			<div style="flex: 2" class="g-tr g-pd-r-5">
				录单人：
			</div>
			<div style="flex: 7; width: 50%">
				<div>{{ detailData.record_staff_name }}</div>
			</div>
		</div>
		
		<div
			style="display: flex;"
			class="g-lh-30 g-c-black3">
			<div style="flex: 2" class="g-tr g-pd-r-5">
				担任角色：
			</div>
			<div style="flex: 7; width: 50%">
				<div>{{ rowData.role_type_name }}</div>
			</div>
		</div>

		<div
			v-if="roleKeyList.includes(4)"
			style="display: flex;"
			class="g-lh-30 g-c-black3">
			<div style="flex: 2" class="g-tr g-pd-r-5">
				参与日期：
			</div>
			<div style="flex: 7; width: 50%">
				<div>{{ detailData.join_time.join('至') }}</div>
			</div>
		</div>

		<div
			v-if="roleKeyList.includes(6)"
			style="display: flex;"
			class="g-lh-30 g-c-black3">
			<div style="flex: 2" class="g-tr g-pd-r-5">
				讲课时长：
			</div>
			<div style="flex: 7; width: 50%">
				<div>{{ rowData.lecturer_hour.replace('h', '小时') }}</div>
			</div>
		</div>

		<div	
			v-if="roleKeyList.includes(5)"
			style="display: flex;"
			class="g-lh-30 g-c-black3">
			<div style="flex: 2" class="g-tr g-pd-r-5">
				参与天数：
			</div>
			<div style="flex: 7; width: 50%">
				<div>{{ detailData.join_day }}天</div>
			</div>
		</div>

		<div
			v-if="roleKeyList.includes(7)"
			style="display: flex;"
			class="g-lh-30 g-c-black3">
			<div style="flex: 2" class="g-tr g-pd-r-5">
				课程主题：
			</div>
			<div style="flex: 7; width: 50%">
				<div>{{ detailData.lesson_subject }}</div>
			</div>
		</div>

		<!-- <div
			v-if="roleKeyList.includes(9)"
			style="display: flex;"
			class="g-lh-30 g-c-black3">
			<div style="flex: 2" class="g-tr g-pd-r-5">
				培训主题：
			</div>
			<div style="flex: 7; width: 50%">
				<div>{{ detailData.training_subject }}</div>
			</div>
		</div> -->

		<!-- <div
			v-if="roleKeyList.includes(8)"
			style="display: flex;"
			class="g-lh-30 g-c-black3">
			<div style="flex: 2" class="g-tr g-pd-r-5">
				培训时间：
			</div>
			<div style="flex: 7; width: 50%">
				<div>{{ detailData.training_time.join('至') }}</div>
			</div>
		</div> -->

		<div
			v-if="roleKeyList.includes(10)"
			style="display: flex;"
			class="g-lh-30 g-c-black3">
			<div style="flex: 2" class="g-tr g-pd-r-5">
				备注：
			</div>
			<div style="flex: 7; width: 50%">
				<oa-autotip
					:content="detailData.remark"
					placement="bottom" 
					label-class=" "
				/>
			</div>
		</div>

		<div
			v-if="rowData.status == 3"
			style="display: flex;"
			class="g-lh-30 g-c-black3">
			<div style="flex: 2" class="g-tr g-pd-r-5">
				驳回理由：
			</div>
			<div style="flex: 7; width: 50%">
				<oa-autotip
					:content="detailData.reject_reason"
					placement="bottom" 
					label-class=" "
				/>
			</div>
		</div>
	</i-modal>
</template>

<script>
import API_ROOT from '@stores/apis/root';
import AutoToolTip from "@common/auto-tooltip/auto-tooltip";
import { CreatePortal } from 'wya-vc';
import { Modal } from 'iview';
import { FORM_KEY } from '../constants';

export default {
	name: 'oa-hr-lesson-detail-modal',
	components: {
		'oa-autotip': AutoToolTip,
		'i-modal': Modal
	},
	props: {
		rowData: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			visible: false,
			detailData: {},
			roleKeyList: [],
			FORM_KEY,
		};
	},
	computed: {
	},
	created() {
		this.loadData();
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		loadData() {
			this.$request({
				url: API_ROOT['_COLLEAGE_RECORD_LESSON_DETAIL_EDIT_GET'],
				type: "GET",
				param: {
					open_lesson_id: this.rowData.open_lesson_id
				}
			}).then(({ data: { 
				field_key, 
				record_field, 
				record_staff_name,
				activity_category_name,
				reject_reason } }) => {
				this.roleKeyList = field_key;
				this.detailData = {
					...record_field,
					record_staff_name,
					reject_reason,
					activity_category_name
				};
			});
		},
		handleCancel() {
			this.$refs.modal.buttonLoading = false;
			this.$emit('close', false);
			this.visible = false;
		},
		handleOk() {
			this.$refs.modal.buttonLoading = false;
			this.$emit('sure', true);
		},
	}
};

export const LessonDetail = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-collage-lesson-detail-modal {
    .ivu-tooltip-rel,
    .ivu-tooltip,
    .v-auto-tooltip   {
        height: 30px;
    }
    .ivu-modal-body {
        padding-bottom: 0;
    }
}
</style>

