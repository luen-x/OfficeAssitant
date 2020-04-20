import AutoTooltip from "@components/_common/auto-tooltip/auto-tooltip";
import { Dropdown, DropdownMenu, DropdownItem } from "iview";
import { Confirm } from "@components/_common/confirm/confirm";
import { StaffModal } from './popup/staff-modal';

export default {
	data() {
		return {
			button: [
				{
					name: '编辑',
					id: '1',
				},
				{
					name: '删除',
					id: '2',
				},
				{
					name: '签到',
					id: '3',
				},
				{
					name: '考试',
					id: '4',
				}
			],
			common: [
				{
					title: '课程名称',
					minWidth: 180,
					fixed: "left",
					key: 'course_name',
					render: (h, params) => {
						return (
							<div>
								{
									this.type !== '1' && this.$auth[1593] && this.$auth[1594]
										? <span onClick={() => { this.handleDetail(params.row); }}>
											<AutoTooltip
												content={params.row.course_name}
												theme="dark"
												placement="bottom"
											/>
										</span> : <AutoTooltip
											content={params.row.course_name}
											theme="dark"
											placement="bottom"
											labelClass=" "
										/>
								}
							</div>
						);
					}

				},
				{
					title: '授课讲师',
					minWidth: 150,
					key: 'lecture',
					render: (h, params) => {
						return (
							<AutoTooltip content={params.row.lecture.map(v => v.staff_name).join(',')}
								theme="dark"
								placement="bottom"
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '授课时间',
					minWidth: 260,
					key: 'start_time',
					render: (h, params) => {
						return (
							<div>
								{
									this.type == '1' ? <AutoTooltip
										content={params.row.start_time}
										theme="dark"
										placement="bottom"
										labelClass=" "
									/>
										: <AutoTooltip
											content={params.row.start_time + ' - ' + params.row.end_time}
											theme="dark"
											placement="bottom"
											labelClass=" "
										/>
								}
							</div>
						);
					}
				}
			]
		};
	},
	computed: {
		getColumns() {
			let columns = [...this.common];
			if (this.type == '1') {
				columns.push({
					title: '参与人数',
					minWidth: 120,
					key: 'course_participate_num',
				},
				{
					title: '参与人员',
					minWidth: 200,
					key: 'participator',
					render: (h, params) => {
						return (
							<span onClick={() => { this.handleStaff(params.row.participator.map(v => v.staff_name)); }}>
								<AutoTooltip
									content={params.row.participator ? params.row.participator.map(v => v.staff_name).join(',') : ''}
									theme="dark"
									placement="bottom"
								/>
							</span>
						);
					}
				});
			} else {
				columns.push({
					title: '授课地点',
					minWidth: 150,
					key: 'address',
					render: (h, params) => {
						return (
							<AutoTooltip content={params.row.address}
								theme="dark"
								placement="bottom"
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '报名人数',
					minWidth: 120,
					key: 'course_apply_num',
				},
				{
					title: '参与人数',
					minWidth: 120,
					key: 'course_participate_num',
				},
				{
					title: '实际出勤人数',
					minWidth: 120,
					key: 'course_attendance',
				},
				{
					title: '作业上传人数',
					minWidth: 120,
					key: 'course_upload_num',
				},
				{
					title: '创建时间',
					minWidth: 180,
					key: 'create_time',
				});
			}
			if (this.type !== '1' && (this.$auth[1589] || this.$auth[1590] || this.$auth[1591] || this.$auth[1592])) {
				columns.push({
					title: "操作",
					key: "title",
					fixed: "right",
					align: 'center',
					minWidth: 80,
					render: (h, params) => {
						return (
							<Dropdown
								style="cursor: pointer; width: 100%; height: 100%; text-align: center;"
								transfer={true}
								placement="left-start"
								onOn-click={(name) => { this.handleOperate(name, params.row); }}
							>
								<i
									class="iconfont icon-point"
									style="font-size: 20px; display: block"
									onClick={(e) => { e.stopPropagation(); }}
								/>
								{
									<DropdownMenu slot="list">
										{
											<div>
												{
													this.$auth[1589] ? <DropdownItem name="1">
													编辑
													</DropdownItem> : ''
												}
												{
													this.$auth[1590] ? <DropdownItem name="2">
													删除
													</DropdownItem> : ''
												}
												{
													this.$auth[1591] ? <DropdownItem name="3">
													签到
													</DropdownItem> : ''
												}
												{
													this.$auth[1592] ? <DropdownItem name="4">
													考试
													</DropdownItem> : ''
												}
											</div>
										}
									</DropdownMenu>

								}
							</Dropdown>
						);
					}
				});
			}
			return columns;
		},
	},
	methods: {
		handleDetail(row) {
			this.$router.push({
				path: '/academy/train/plan/detail/participate',
				query: {
					course_id: row.course_id
				}
			});
		},
		handleStaff(data) {
			data.length ? StaffModal.popup({
				staff: data,
			}).then(res => {
				this.$store.commit('ACADEMY_TRAIN_PLAN_LIST_INIT');
			}).catch(error => {
				error && console.error(error);
			}) : '';
		},
		handleResetFirst() {
			this.$store.commit('ACADEMY_TRAIN_PLAN_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('ACADEMY_TRAIN_PLAN_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleOperate(name, row) {
			if (name == '1') {
				let route = '';
				if (this.type == '2') {
					route = '/academy/train/plan/train';
				} else if (this.type == '3') {
					route = '/academy/train/plan/manage';
				}
				this.$router.push({
					path: route,
					query: {
						edit: 1,
						course_id: row.course_id
					}
				});
			} else if (name == '2') {
				Confirm.popup({
					title: '提示',
					msg: row.course_participate_num
						? `创建的${row.course_name}课程已有${row.course_participate_num}人参加，删除后的课程会放入到"课程回收站，确认删除吗？`
						: '是否确认删除该课程？',
					showIcon: true
				}).then(() => {
					this.$request({
						url: '_ACADEMY_SUPPORT_TRAIN_COURSE_DELETE_POST',
						type: 'POST',
						param: {
							course_id: row.course_id
						}
					}).then((res) => {
						this.$Message.success('删除成功！');
						this.$store.commit('ACADEMY_TRAIN_PLAN_LIST_INIT');
					}).catch((err) => {
						this.$Message.error(err.msg);
					});
				}).catch((err) => {
					console.error(err);
				});
			} else if (name == '3') {
				this.$router.push({
					path: '/academy/train/plan/detail/sign',
					query: {
						edit: 1,
						course_id: row.course_id
					}
				});
			} else if (name == '4') {
				this.$router.push({
					path: '/academy/train/plan/detail/exam',
					query: {
						edit: 1,
						course_id: row.course_id
					}
				});
			}
		}
	}
};

