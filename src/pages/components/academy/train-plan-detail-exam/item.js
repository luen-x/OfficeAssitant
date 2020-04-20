import AutoTooltip from "@components/_common/auto-tooltip/auto-tooltip";
import { Confirm } from "@components/_common/confirm/confirm";
import { Dropdown, DropdownMenu, DropdownItem } from "iview";
import { VoucherModal } from './popup/voucher-modal';

export default {
	data() {
		return {
			columns: [
				{
					title: '姓名',
					minWidth: 150,
					key: 'staff_name',
				},
				{
					title: '部门',
					minWidth: 150,
					key: 'depart_name',
				},
				{
					title: '手机号',
					minWidth: 150,
					key: 'mobile',
				},
				{
					title: '是否上传',
					minWidth: 150,
					key: 'is_upload',
					render: (h, params) => {
						return (
							<AutoTooltip content={params.row.is_upload ? '是' : '否'} theme="dark" placement="bottom" labelClass=" "/>
						);
					}
				},
				{
					title: '通关情况',
					minWidth: 150,
					key: 'is_pass_name',
				},
				{
					title: '提交时间',
					minWidth: 180,
					key: 'update_time',
				},
				{
					title: '操作',
					minWidth: 80,
					key: 'options',
					fixed: "right",
					align: 'center',
					render: (h, params) => {
						// return (
						// 	<div>
						// 		{
						// 			params.row.fileImage.length 
						// 				? <span onClick={() => this.handleDetail(params.row)} class="g-operation">查看</span>
						// 				: this.isNotice
						// 					? <span 
						// 						onClick={() => this.handleNotice([params.row.staff_id], [params.row.staff_name])} 
						// 						class="g-operation"
						// 					>
						// 				提醒
						// 					</span> : <span>--</span>
						// 		}
						// 	</div>
						// );
						let look = params.row.fileImage.length ? "block" : "none";
						let pass = !params.row.is_pass ? "block" : "none";
						let reject = params.row.is_pass ? "block" : "none";
						let notice = params.row.fileImage.length ? "none" : "block";
						return (
							<div>
								{
									this.isNotice ? <Dropdown 
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

										<DropdownMenu slot="list">
											<DropdownItem name="1" style={{ display: look }}>
										查看
											</DropdownItem>
											<DropdownItem name="2" style={{ display: pass }}>
										通关
											</DropdownItem>
											<DropdownItem name="3" style={{ display: reject }}>
										未通关
											</DropdownItem>
											<DropdownItem name="4" style={{ display: notice }}>
										提醒
											</DropdownItem>
										</DropdownMenu>
									</Dropdown> : <span>--</span>
								}
							</div>
						);
					}
				}
			],
		};
	},
	computed: {
		isNotice() {
			let listInfo = this.$store.state.academyTrainPlanDetailExam.listInfo;
			let start = listInfo.time[0];
			let end = listInfo.time[1];
			let notice = false;
			if (listInfo.enable_upload && start == '') {
				notice = true;
			} else if (listInfo.enable_upload && moment().isBefore(end) && moment(start).isBefore(new Date())) {
				notice = true;
			}
			return notice;
		},
		getColumns() {
			let columns = this.isNotice ? [{
				type: "selection",
				fixed: "left",
				minWidth: 50
			}] : [];
			columns.push(...this.columns);
			return columns;
		},
	},
	methods: {
		handleOperate(name, row) {
			if (name == '1') {
				this.handleDetail(row);
			} else if (name == '2' || name == '3') {
				this.handlePass(name, row);
			} else {
				this.handleNotice([row.staff_id], [row.staff_name]);
			}
		},
		handlePass(name, row) {
			Confirm.popup({
				title: '',
				msg: `是否将该学员本次上传的作业标记为${name == '2' ? '通关' : '未通关'}？`,
				showIcon: true
			}).then(() => {
				this.$request({
					url: '_ACADEMY_TRAIN_PLAN_DETAIL_EXAM_PASS_POST',
					type: 'POST',
					param: {
						exam_voucher_id: row.exam_voucher_id,
						is_pass: name == 2 ? 1 : 0
					},
				}).then(res => {
					this.$Message.success('修改成功');
					this.$store.commit('ACADEMY_TRAIN_PLAN_DETAIL_EXAM_LIST_INIT');
				}).catch((err) => {
					this.$Message.error(err.msg);
				});
			});
		},
		handleNotice(staff_ids, staff_names) {
			Confirm.popup({
				title: '',
				msg: staff_ids.length > 1 ? `是否对${staff_names[0]}等${staff_names.length}名学员进行上传提醒？`
					: `是否对${staff_names[0]}进行上传提醒？`,
				showIcon: true
			}).then(() => {
				this.$request({
					url: '_ACADEMY_TRAIN_PLAN_DETAIL_EXAM_NOTICE_POST',
					type: 'POST',
					param: {
						course_id: this.$route.query.course_id,
						staff_ids
					},
				}).then(res => {
					this.$Message.success('提醒成功');
					this.$store.commit('ACADEMY_TRAIN_PLAN_DETAIL_EXAM_LIST_INIT');
				}).catch((err) => {
					this.$Message.error(err.msg);
				});
			});
		},
		handleDetail(row) {
			VoucherModal.popup({ data: row }).then((res) => {
				
			}).catch(err => err && console.error(err));
		},
		handleResetFirst() {
			this.$store.commit('ACADEMY_TRAIN_PLAN_DETAIL_EXAM_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('ACADEMY_TRAIN_PLAN_DETAIL_EXAM_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

