import { Divider, Tooltip, Message } from 'iview';
import AutoTooltip from "@components/_common/auto-tooltip/auto-tooltip";
import API_ROOT from '@stores/apis/root';
import { ModalTip } from '@components/hr/academy-train-detail/_common/popup/model-tips';
import { Confirm } from '@components/_common/confirm/confirm';
import { EditModal } from './popup/modal-edit';
import { DetailModal } from './popup/modal-detail';

export default {
	data() {
		return {
			columns: [
				{
					title: '报名课程',
					key: 'course_name',
					minWidth: 120,
					render: (h, params) => {
						let course_name = params.row.course_name;
						return (
							<AutoTooltip
								content={course_name}
								width="100px"
								theme="dark"
								placement="bottom"
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '报名时间',
					key: 'create_time',
					minWidth: 170,
				},
				{
					title: '授课时间',
					key: 'audit_staff_name',
					minWidth: 160,
					render: (h, { row }) => {
						return (
							<AutoTooltip content={`${row.start_time}至${row.end_time}`} theme="dark" placement="bottom" labelClass=" "/>
							// <span>
							// 	{row.start_time
							// 		? <Tooltip
							// 			transfer
							// 			placement="bottom"
							// 		>
							// 			<span>{row.start_time}至...</span>
							// 			<div style="white-space: normal;" slot="content">
							// 				<span class="_inline-block">{row.start_time}</span>
							// 				至
							// 				<span class="_inline-block">{row.end_time}</span>
							// 			</div>
							// 		</Tooltip> : ''
							// 	}</span>
						);
					}
				},
				{
					title: '授课讲师',
					key: 'apply_type_name',
					minWidth: 120,
					render: (h, { row }) => {
						let lecture_staff = row.lecture_staff;
						return (
							<AutoTooltip
								content={lecture_staff}
								width="150px"
								theme="dark"
								placement="bottom"
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '操作',
					key: 'opt',
					align: 'center',
					minWidth: 120,
					render: (h, { row }) => {
						return <div class="g-operation" >
							{
								row.enable_cancel ? <div onClick={(e) => { e.stopPropagation; this.handleCancel(row); }}>撤回申请</div>
									: <div style={{ color: '#ACA899' }}>撤回申请</div>
							}
						</div>;

					}
				}
			]
		};
	},
	computed: {
	},
	methods: {
		handleCancel(row) {
			this.$request({
				url: '_SALE_TRAIN_COURSE_DETAIL_CANCEL_POST', // eslint-disable-line
				type: "POST",
				param: {
					participator_id: row.participator_id
				}
			}).then((res) => {
				Message.success('撤回成功');
				this.$store.commit('SALE_TRAIN_COURSE_DETAIL_LIST_INIT');
			}).catch((error) => {
				Message.error(error.msg);
			});
		},
		handleResetFirst() {
			this.$store.commit('SALE_TRAIN_COURSE_DETAIL_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('SALE_TRAIN_COURSE_DETAIL_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

