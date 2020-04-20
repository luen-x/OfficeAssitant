<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="查看课程"
		class="v-hr-academy-transfer-watch-modal"
		width="680"
		@on-ok="handleOk"
		@on-cancel="handleCancel">

		<div class="g-fs-14 _content">
			<div class="g-flex g-jc-fe">
				<i-button
					v-if="type === '2' || type === '3'"
					type="primary"
					style="marginTop: 4px;"
					@click="handleAdd()">
					添加
				</i-button>
			</div>
			<i-table
				:data="course"
				:columns="(type === '2' || type === '3') ? columns : columns1"
				:height="course.length ? (course.length > 4 ? 282 : '') : ''"
				class="g-m-t-20"/>
		</div>

	</i-modal>
</template>

<script>
import moment from 'moment';
import API_ROOT from "@stores/apis/root";
import { Modal, Button, Divider, Table } from "iview";
import { CreatePortal, Copy } from "wya-vc";
import { formatMoment } from "@utils/utils";
import orderModal from '@extends/mixins/orderModal';
import { DelTipModal } from '../../_common/delete-tip';
import { addPModal } from './add';
import { modifyPModal } from './modify';

export default {
	name: "hr-academy-transfer-watch-modal",
	components: {
		"i-modal": Modal,
		"i-button": Button,
		"i-table": Table,
		"vc-copy": Copy,
	},
	mixins: [orderModal],
	props: {
		info: Object,
		type: String
	},
	data() {
		return {
			visible: false,
			course: [],
			columns: [
				{
					title: '课程名称',
					key: 'course_name',
					minWidth: 150,
					renderHeader: (h, params) => {
						return (
							<div style="marginLeft: 33px;">课程名称</div>
						);
					},
					render: (h, params) => {
						return (
							<div>
								<div class={[params.row.is_history === 1 ? 'g-bg-orange-mid' : '', 'g-m-r-5 g-remark']}>
									{ params.row.is_history === 1 ? '历' : '本'}
								</div>
								<span>{params.row.course_name}</span>
							</div>
						);
					}
				},
				{
					title: '课程时间',
					key: 'course_time',
					minWidth: 120,
				},
				{
					title: '完成情况',
					key: 'status_name',
					minWidth: 100
				},
				{
					title: '操作',
					key: 'action',
					minWidth: 100,
					render: (h, params) => {
						return (
							<div>
								{(params.row.is_history !== 1 && params.row.is_out !== 1) && <div>
									<span class="g-pointer g-c-blue-mid" onClick={() => this.handleEdit(params.row)}>编辑</span>
									<Divider type="vertical"/>
									<span class="g-pointer g-c-blue-mid" onClick={() => this.handleDelete(params.row)}>删除</span>
								</div>}
							</div>
						);
					}
				}
			],
			columns1: [
				{
					title: '课程名称',
					key: 'course_name',
					minWidth: 150,
					renderHeader: (h, params) => {
						return (
							<div style="marginLeft: 33px;">课程名称</div>
						);
					},
					render: (h, params) => {
						return (
							<div>
								<div class={[params.row.is_history === 1 ? 'g-bg-orange-mid' : '', 'g-m-r-5 g-remark']}>
									{ params.row.is_history === 1 ? '历' : '本'}
								</div>
								<span>{params.row.course_name}</span>
							</div>
						);
					}
				},
				{
					title: '课程时间',
					key: 'course_time',
					minWidth: 120,
				},
				{
					title: '完成情况',
					key: 'status_name',
					minWidth: 100,
				}
			]
		};
	},
	computed: {},
	mounted() {
		this.visible = true;
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: "_HR_ACADEMY_TRANSFER_EMPLOYEE_COURSE_GET",
				type: "GET",
				param: {
					applicant_id: this.info.applicant_id
				},
				loading: false,
			}).then(res => {
				this.course = Array.isArray(res.data) ? res.data : [];
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		// 新增
		handleAdd() {
			addPModal.popup({
				info: {
					applicant_id: this.info.applicant_id,
					mobile: this.info.mobile,
					applicant_name: this.info.applicant_name
				}
			}).then(res => {
				this.loadData();
			}).catch(() => {});
		},
		// 编辑
		handleEdit(info) {
			modifyPModal.popup({
				info: {
					...info,
					applicant_id: this.info.applicant_id,
					mobile: this.info.mobile,
					applicant_name: this.info.applicant_name
				},
			}).then(res => {
				this.loadData();
			}).catch(() => {});
		},
		handleDelete(info) {
			DelTipModal.popup({
				title: '提示',
				content: '是否确认删除此课程，如果删除，那么此人将不能在安排课程中显示。'
			}).then(res => {
				// 删除
				this.$request({
					url: "_HR_ACADEMY_TRANSFER_COURSE_DELETE_POST",
					type: "POST",
					param: {
						participator_id: info.participator_id
					},
					loading: false,
				}).then(res1 => {
					this.$Message.success('操作成功');
					this.loadData();
				}).catch((err) => {
					this.$Message.error(err.msg);
				});
			}).catch(() => {});
		},
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */
			this.$emit("sure");

		},
		handleCancel() {
			this.$emit("close");
		}
	}
};
export const watchPModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
.v-hr-academy-transfer-watch-modal {
	._content {
		padding-left: 34px;
		padding-right: 34px;
	}
}
</style>

