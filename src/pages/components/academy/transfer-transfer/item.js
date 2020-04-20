import { Dropdown, DropdownMenu, DropdownItem } from "iview";
import { Confirm } from "@components/_common/confirm/confirm";
import { getParseUrl, getHashUrl, formatMoment } from '@utils/utils';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { MentalityTracking } from "./popup/mentality-tracking";
import { ArrangeTraining } from "./popup/arrange-training";
import { Eliminate } from "./popup/eliminate";
import { Assign } from "./popup/assign";

export default {
	data() {
		return {
			statusTrainData: [3, 4, 5, 6],
			colomnStore: {}, // 缓存列表字段
			columns: [
				{
					title: '姓名',
					key: 'applicant_name',
					minWidth: 160,
					fixed: "left",
					render: (h, params) => {
						const { applicant_name, add_type, status } = params.row;
						
						return (
							<div class="g-flex g-flex-ac">
								{
									add_type == 1 ? <span>
										{ applicant_name.length <= 7 ? applicant_name
											: <AutoToolTip
												content={applicant_name}
												width="105px"
												theme="dark"
												labelClass=" "
											>
												{applicant_name}
											</AutoToolTip>
										}
									</span> : <router-link
										class="g-c-blue-mid g-pointer"
										style={{ display: 'block', width: '100%' }}
										to={this.handleLinkTo(params)}
									>
										{<span>
											{ applicant_name.length <= 7 ? applicant_name
												: <AutoToolTip
													content={applicant_name}
													labelClass=""
													width="105px"
													theme="dark"
												>
													{applicant_name}
												</AutoToolTip>
											}
										</span>
										}
									</router-link>
								}
								{
									[2, 3].includes(+this.type) && params.row.status == 7
										? <span
											class="g-inline-block g-tc g-c-white g-m-l-10" 
											style="width: 40px;height: 24px; line-height: 24px; background: #E84C57;border-radius: 4px;"
										>
											离职
										</span>
										: null
								}
								{
									+this.type === 2 && +params.row.status != 7 && [3, 4, 5, 6].indexOf(+params.row.train_status) > -1
										? <span
											class="g-inline-block g-tc g-c-white g-m-l-10" 
											style="width: 40px;height: 24px; line-height: 24px; background: #E84C57;border-radius: 4px;"
										>
											淘汰
										</span>
										: null
								}
							</div>
						);
					}
				},
				{
					title: '电话',
					key: 'mobile',
					minWidth: 140,
					fixed: "left"
				},
				{
					title: '试岗部门',
					key: 'try_depart_name',
					minWidth: 120
				},
				{
					title: '应聘职位',
					key: 'position_name',
					minWidth: 150
				},
				{
					title: '招聘来源',
					key: 'ditch_name',
					minWidth: 120
				},
				{
					title: '邀约人',
					key: 'invite_name',
					minWidth: 120
				}
			],
			allCourses: [],
			wait: false, // 等待请求的数据回来
		};
	},
	created() {
		this.loadAllCourses();
	},
	computed: {
		firstType() {
			return this.$auth[1565] || this.$auth[1566] || this.$auth[1567] || this.$auth[1568];
		},

		secondType() {
			return this.$auth[1565] || this.$auth[1567] || this.$auth[1568];
		}
	},
	methods: {
		getColumns(type) {
			if (!this.wait) {
				return;
			}
			if (this.colomnStore[type]) {
				return this.colomnStore[type];
			} else {
				let columns = [...this.columns];

				switch (+type) {
					case 1:
						(this.$auth[1569] || this.$auth[1570]) && columns.unshift(
							{
								type: "selection",
								fixed: "left",
								minWidth: 50	
							}
						);
						columns.splice(2, 0, ...this.allCourses);
						columns.push(
							{
								title: '授课时间',
								key: 'teaching_time',
								minWidth: 160
							},
							{
								title: '操作',
								key: '',
								minWidth: 100,
								align: 'center',
								fixed: "right",
								render: (h, params) => {
									if (params.row.is_new_course && this.firstType) {
										return (
											<Dropdown 
												style="cursor: pointer; width: 100%; height: 100%;"
												transfer={true}
												placement="left-start"
												onOn-click={(method) => { this[method](params.row); }}
											>
												<i 
													class="iconfont icon-point"
													style="font-size: 20px; display: block"
													onClick={(e) => { e.stopPropagation(); }}
												/>
		
												<DropdownMenu slot="list">
													{
														this.$auth[1565] 
														&& <DropdownItem name="handleMentalityTracking">
																心态跟踪
														</DropdownItem>
													}
													{
														this.$auth[1566]  
															&& <DropdownItem name="handleNoTraining">
																无需培训
															</DropdownItem>
													}
													{
														this.$auth[1567]  
															&& <DropdownItem name="handleEliminationTraining">
																培训淘汰
															</DropdownItem>
													}
													{
														this.$auth[1568]  
															&& <DropdownItem name="handleAssign">
																指派
															</DropdownItem>
													}
												</DropdownMenu>
											</Dropdown>
										);
									} else {
										return null;
									}
								}
							}
						);

						break;

					case 2:
						this.$auth[1570] && columns.unshift(
							{
								type: "selection",
								fixed: "left",
								minWidth: 50	
							}
						);
						columns.splice(2, 0, ...this.allCourses);
						columns.push(
							{
								title: '授课时间',
								key: 'teaching_time',
								minWidth: 160
							},
							{
								title: '操作',
								key: '',
								minWidth: 100,
								align: 'center',
								fixed: "right",
								render: (h, params) => {
									if (params.row.is_new_course && this.secondType) {
										return (
											<Dropdown 
												style="cursor: pointer; width: 100%; height: 100%;"
												transfer={true}
												placement="left-start"
												onOn-click={(method) => { this[method](params.row); }}
											>
												<i 
													class="iconfont icon-point"
													style="font-size: 20px; display: block"
													onClick={(e) => { e.stopPropagation(); }}
												/>
		
												<DropdownMenu slot="list">
													{
														this.$auth[1565]  
															&& <DropdownItem name="handleMentalityTracking">
																心态跟踪
															</DropdownItem>
													}
													{
														this.$auth[1567]  
															? !this.statusTrainData.includes(params.row.train_status)
																? <DropdownItem name="handleEliminationTraining">
															培训淘汰
																</DropdownItem> : null
															: null
													}
													{
														this.$auth[1568]  
															&& <DropdownItem name="handleAssign">
																指派
															</DropdownItem>
													}
												</DropdownMenu>
											</Dropdown>
										);
									} else {
										return null;
									}
								}
							}
						);

						break;

					case 3:
						columns.splice(1, 0, ...this.allCourses);
						columns.push(
							{
								title: '授课时间',
								key: 'teaching_time',
								minWidth: 160
							},
							{
								title: '培训淘汰时间',
								key: 'train_pass_time',
								minWidth: 160
							},
							{
								title: '淘汰人',
								key: 'train_pass_staff_name',
								minWidth: 160
							},
							{
								title: '淘汰类型',
								key: 'pass_type_name',
								minWidth: 120
							},
							{
								title: '淘汰原因',
								key: 'pass_remarks_type_name',
								minWidth: 140
							},
							{
								title: '备注',
								key: 'train_pass_remarks',
								minWidth: 160,
								render: (h, params) => {
									return (
										<AutoToolTip content={params.row.train_pass_remarks} theme="dark" placement="bottom" labelClass=" "/>
									);
								}
							},
							{
								title: '操作',
								key: '',
								minWidth: 140,
								align: 'center',
								fixed: "right",
								render: (h, params) => {
									return (
										<div class="g-flex">
											{
												this.$auth[1565]
													? params.row.is_new_course
														? <div class="g-operation" onClick={() => { this.handleMentalityTracking(params.row); }}>
															心态跟踪
														</div>
														: <div class=" g-operation-disable">
															心态跟踪
														</div>
													: null
											}
											{
												// eslint-disable-next-line max-len
												(!this.$auth[1565] && (!params.row.is_new_course || [5, 6].includes(params.row.train_status) || params.row.status == 7 || !this.$auth[1573]))
													? <div class="g-m-lr-5 g-operation">|</div>
													: <div class="g-m-lr-5 g-operation-disable">|</div>
											}
											{	
												// eslint-disable-next-line max-len
												!params.row.is_new_course || [5, 6].includes(params.row.train_status) || params.row.status == 7 || !this.$auth[1573] 
													? <div class="g-operation-disable">恢复</div>
													: <div class="g-operation" onClick={() => { this.handleComfirm(0, params); }}>
														恢复
													</div>
											}
										</div>
									);
								}
							}
						);

						break;

					case 4:
						columns.splice(3, 0, {
							title: '试岗负责人',
							key: 'try_depart_manager',
							minWidth: 100
						});

						columns.push(
							{
								title: '试岗时间',
								key: 'try_time',
								minWidth: 200
							},
							{
								title: '试岗离开时间',
								key: 'pass_time',
								minWidth: 160
							},
							{
								title: '入职时间',
								key: 'entry_time',
								minWidth: 160
							},
							{
								title: '离职时间',
								key: 'leave_time',
								minWidth: 160
							},
							{
								title: '在职时间',
								key: 'work_day',
								minWidth: 160
							},
							{
								title: '去/留',
								key: 'leave_status_name',
								minWidth: 100
							},
							{
								title: '离职原因',
								key: 'reason_name',
								minWidth: 160
							}
						);

						break;
			
					default:
						break;
				}

				this.colomnStore[type] = columns;
				return columns;
			}
		},

		// 获取所有的岗前培训课程
		loadAllCourses() {
			this.$request({
				url: "_ACADEMY_TRANSFER_TRANSFER_ALL_COURSE_GET",
				type: "GET",
				param: {},
				loading: false
			}).then(res => {
				res.data.length && res.data.forEach((item, index) => {
					this.allCourses.push(
						{
							title: `${item.tab}`,
							key: `${item.course_id}`,
							minWidth: 160,
							render: (h, params) => {
								let obj = {};

								params.row.course.forEach(element => {
									if (+params.column.key === +element.course_id) {
										obj = element;
									}
								});

								if (obj.train_status_name == "安排培训") {
									if (params.row.is_new_course && this.$auth[1571]) {
										return (
											<div 
												class="g-operation"
												onClick={() => { this.handleArrangeTraining(+obj.course_id, +params.row.applicant_id); }}
											>
												{obj.train_status_name}
											</div>
										);
									} else {
										return (
											<div class="g-operation-disable">{obj.train_status_name}</div>
										);
									}
								} else if (obj.train_status_name == "已完成") {
									if (!params.row.is_new_course || [3, 4, 5].includes(+params.row.train_status) || !this.$auth[1572]) {
										return (
											<div class="g-operation-disable">
												{obj.train_status_name}
											</div>
										);
									} else {
										return (
											<div 
												class="g-operation"
												onClick={() => { this.handleComfirm(1, params, +obj.course_id); }}
											>
												{obj.train_status_name}
											</div>
										);
									}
								} else if (!params.row.is_new_course || obj.train_status_name == "无需培训") {
									return (
										<div>{obj.train_status_name}</div>
									);
								} else {
									return (
										<div style="color: #E84C57;">{obj.train_status_name}</div>
									);
								}
							}
						}
					);
				});

				this.wait = true;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		handleResetFirst() {
			this.$store.commit('ACADEMY_TRANSFER_TRANSFER_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('ACADEMY_TRANSFER_TRANSFER_LIST_RESET', { type: this.type });
		},
		// 心态跟踪
		handleMentalityTracking({ remarks_info, applicant_id }) {
			MentalityTracking.popup({
				records: remarks_info,
				applicantId: applicant_id
			}).then(res => {
				res && this.handleResetCur();
			});
		},
		// 无需培训
		handleNoTraining({ applicant_id, course_step }) {
			Confirm.popup({
				title: '',
				msg: '请确认该员工无需培训？',
				showIcon: true
			}).then(() => {
				this.$request({
					url: '_ACADEMY_TRANSFER_TRANSFER_NO_NEED_TRAIN_POST',
					type: 'POST',
					param: {
						applicant_id,
						course_step
					},
				}).then(res => {
					this.$Message.success(res.msg);
					this.handleResetCur();
				}).catch((err) => {
					this.$Message.error(err.msg);
				});
			});
		},
		// 淘汰培训
		handleEliminationTraining({ applicant_id, course_step }) {
			Eliminate.popup({
				applicantId: +applicant_id,
				courseStep: +course_step
			}).then(res => {
				res && this.handleResetCur();
			});
		},
		//  指派
		handleAssign({ applicant_id }) {
			Assign.popup({
				applicantId: +applicant_id
			}).then(res => {
				res && this.handleResetCur();
			});
		},
		handleLinkTo(params) {
			let baseUrl = params.row.add_type === 3
				? `/academy/transfer/transfer/school/${params.row.applicant_id}`
				: `/academy/transfer/transfer/social/${params.row.applicant_id}`;
			return params.row.add_type === 3 ? getHashUrl(baseUrl, {
				type: 'no-edit',
				list_type: 'transport',
				tabType: this.type,
				index: 'transfer',
				status: params.row.status
			}) : getHashUrl(baseUrl, {
				list_type: 'transport',
				type: this.type,
				index: 'transfer',
				status: params.row.status
			});
		},
		handleOperate(name, obj) {
			if (+name === 1) {
				MentalityTracking.popup({
					records: obj.row.remarks_info,
					applicantId: +obj.row.applicant_id
				}).then(res => {
					res && this.handleResetCur();
				});
			} else if (+name === 2) {
				Confirm.popup({
					title: '',
					msg: '请确认该员工无需培训？',
					showIcon: true
				}).then(() => {
					this.$request({
						url: '_ACADEMY_TRANSFER_TRANSFER_NO_NEED_TRAIN_POST',
						type: 'POST',
						param: {
							applicant_id: obj.row.applicant_id,
							course_step: obj.row.course_step
						},
					}).then(res => {
						this.$Message.success(res.msg);
						this.handleResetCur();
					}).catch((err) => {
						this.$Message.error(err.msg);
					});
				});
			} else if (+name === 3) {
				Eliminate.popup({
					applicantId: +obj.row.applicant_id,
					courseStep: +obj.row.course_step
				}).then(res => {
					res && this.handleResetCur();
				});
			} else {
				Assign.popup({
					applicantId: +obj.row.applicant_id
				}).then(res => {
					res && this.handleResetCur();
				});
			}
		},
		// 安排培训
		handleArrangeTraining(courseId, applicant_id) {
			ArrangeTraining.popup({
				courseId,
				applicantIds: [applicant_id],
				name: "arrange"
			}).then(res => {
				res && this.handleResetCur();
			});
		},
		handleComfirm(name, value, course_id) {
			let msg = ["是否恢复该员工信息？", '是否撤销该员工的课程？'][name];
			let url = ["_ACADEMY_TRANSFER_TRANSFER_RECOVER_POST", "_ACADEMY_TRANSFER_TRANSFER_BACK_OUT_POST"][name];
			let param = [ 
				{
					applicant_id: value.row.applicant_id,
					course_step: value.row.course_step
				},
				{
					applicant_id: value.row.applicant_id,
					course_step: value.row.course_step,
					teaching_time: value.row.teaching_time,
					course_id
				}
			][name];

			Confirm.popup({
				title: '',
				msg,
				showIcon: true
			}).then(() => {
				this.$request({
					url,
					type: 'POST',
					param,
				}).then(res => {
					this.$Message.success(res.msg);
					this.handleResetCur();
				}).catch((err) => {
					this.$Message.error(err.msg);
				});
			});
		}
	}
};