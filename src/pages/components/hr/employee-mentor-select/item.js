import Explain from '@components/_common/explain/explain';
import {
	ApplyMasterModal 
} from "@components/hr/employee-summary-details/details/hearder/popup/apply-master";
import { Tooltip, Divider } from "iview"; 
import { DetailDrawer } from "./popup/detail";
import { AuditModal } from "./popup/audit.vue";
import { RejectModal } from "./popup/reject-modal";
import { RemoveModal } from "./popup/remove-modal";

export default {
	data() {
		return {
			columns: {
				'1': [],
				'2': [],
				'3': [],
				'4': [],
			}
			 
		};
	},
	mounted() {
		for (let key in this.columns) {
			this.columns[String(key)] = this.getColumns(key);
		}
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('HR_EMPLOYEE_MENTOR_SELECT_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_EMPLOYEE_MENTOR_SELECT_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleMasterApply(staff_id) {
			// this.info.apply_status = false;
			ApplyMasterModal.popup({
				staff_id,
				showFoot: true
			}).then();
		},
		getColumns(type) {
			let columns = [
				{
					title: '姓名',
					key: 'staff_name',
					minWidth: 150,
					render: (h, params) => {
						return (
							<div 
								onClick={() => this.handleStaffName(type, params)} 
								class={type === '1' ? '' : 'g-operation'}
							>{params.row.staff_name}</div>
						);
					}
				},
				{
					title: '手机号码',
					minWidth: 150,
					key: 'mobile'
				},
				{
					title: '工号',
					minWidth: 150,
					key: 'staff_number'
				},
				{
					title: '部门',
					minWidth: 150,
					key: 'depart_name'
				},
				{
					title: '职位',
					minWidth: 150,
					key: 'position_name'
				},
				{
					title: '申请日期',
					minWidth: 200,
					key: 'apply_time'
				}
				
			];
			if (type === '1') {
				columns.push({
					title: '操作',
					key: 'do',
					minWidth: 150,
					render: (h, params) => {
						return (
							<div class="g-operation" >
								{
									params.row.is_operate === 1 ? <div>
										{
											this.$auth['913'] ? <span 
												
												onClick={() => this.handleAuditModal(params.row.master_apply_id)}
											>通过</span> : ''
										}
										{
											this.$auth['913'] && this.$auth['914'] ? <Divider type="vertical" class="g-m-lr-10"/> : ''
										}
										{
											this.$auth['914'] ? <span 
												onClick={() => this.handleRejectModal(params.row.master_apply_id)} 
											>驳回</span> : ''
										}	
									</div> : ''
								}
								
							</div>
						);
					}
				});
			}
			if (type !== '1') {
				columns.splice(5, 0, {
					title: "评选情况",
					key: "rigid_standard",
					minWidth: 100,
					renderHeader: (h, params) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }} >
								评选情况
								<Explain
									style={{ marginLeft: '2px' }}
									width={40}
									trigger="click"
									content="绿色：全部条件通过    蓝色：部分条件通过     红色：有未通过条件   "
								/>
							</div>
						);
					},
					render: (h, params) => {
						const { color } = params.row;
						let newColor = '';
						switch (color) {
							case 'green':
								newColor = '#4FC43D';
								break;
							case 'blue':
								newColor = '#2397F9';
								break;
							case 'red':
								newColor = '#E74854';
								break;
							default:
								break;
						}
						return <span 
							style={{ color: newColor }} 
						>
							{params.row.rigid_standard}
						</span>;
					}
				});
				columns.splice(6, 0, {
					title: '评选周期',
					key: 'cycle_month',
					minWidth: 200
				});
				if (type === '2') { 
					columns.push({
						title: '操作',
						key: 'do',
						minWidth: 150,
						render: (h, params) => {
							return (
								<div>
									{
										params.row.is_operate === 1 && this.$auth['915'] ? <div 
											class="g-operation"
											onClick={() => this.handleRemoveModal(params.row.master_apply_id)}
										>移除</div>
											: ''
									}
								</div>
								
							);	
						}
					}); 
				}
				if (type === '4') { 
					columns.push(
						{
							title: '驳回人',
							minWidth: 150,
							key: 'audit_staff_name',
						}, 
						{
							title: '驳回理由',
							key: 'do',
							minWidth: 240,
							render: (h, params) => {
								return (
									<div>
										{params.row.remark.length > 15
											? <Tooltip 
												transfer 
												placement="bottom-start"
												style="margin: 10px auto;display: block;maxWidth:200px"
											>
												<div>{params.row.remark.substr(0, 15) + '...'}</div>
												<div slot="content">
													<p style="whiteSpace: normal">
														{params.row.remark}
													</p>
												</div>
											</Tooltip>
											: params.row.remark}
									</div>
								);
							}
						}
					); 
				}
			}
			return columns;
		},
		handleStaffName(type, params) {
			if (type === '1') {
				return; 
			}
			DetailDrawer.popup({
				type,
				params,
			}).then(res => {
				this.$store.commit('HR_EMPLOYEE_MENTOR_SELECT_LIST_INIT');
			}).catch(err => {
			});
		},
		handleAuditModal(master_apply_id) {
			AuditModal.popup({
				status: 1,
				master_apply_id
			}).then(res => {
				this.$store.commit('HR_EMPLOYEE_MENTOR_SELECT_LIST_INIT');
			});
		},
		handleRejectModal(master_apply_id) {
			RejectModal.popup({
				master_apply_id,
				status: 2
			}).then(res => {
				this.$store.commit('HR_EMPLOYEE_MENTOR_SELECT_LIST_INIT');
			});
		},
		handleRemoveModal(master_apply_id) {
			RemoveModal.popup({
				master_apply_id
			}).then(res => {
				this.$store.commit('HR_EMPLOYEE_MENTOR_SELECT_LIST_INIT');
			});
		},
		
	}
};

