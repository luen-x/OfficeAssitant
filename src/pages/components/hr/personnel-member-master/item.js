import {
	Dropdown,
	DropdownMenu,
	DropdownItem,
	Tooltip
} from 'iview';
import {
	Copy
} from "wya-vc";
import {
	getHashUrl
} from '@utils/utils';
import { M_HR_URL } from '@constants/constants';
import {
	 ApplyMasterModal 
} from "@components/hr/employee-summary-details/details/hearder/popup/apply-master";
import {
	CauseModal
} from './popup/cause.vue';
import {
	TipModal
} from './popup/tip.vue';

export default {
	data() {
		const {
			query = {}
		} = this.$route;
		return {
			columns: {
				'1': this.getColumns('1'),
				'2': this.getColumns('2'),
				'3': this.getColumns('3'),
				'4': this.getColumns('4'),
				'5': this.getColumns('5'),
			}
		};
	},

	methods: {
		handleCause(params) {
			CauseModal.popup({
				master_apply_id: params.row.master_apply_id
			}).then(res => {
				this.$store.commit("HR_PERSONNEL_MEMBER_MASTER_LIST_INIT");
			});
		},
		handleTip(params) {
			TipModal.popup({
				master_apply_id: params.row.master_apply_id
			}).then(res => {
			});
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
					title: '申请人',
					key: 'staff_name',
					minWidth: 180,
					fixed: 'left'

				},
				{
					title: '手机号码',
					key: 'mobile',
					minWidth: 120,
					fixed: 'left'

				},
				{
					title: '工号',
					minWidth: 140,
					key: 'staff_number',
					
				},
				{
					title: '部门',
					minWidth: 200,
					key: 'depart_name',
					
				},
				{
					title: '职位',
					minWidth: 200,
					key: 'position_name',
					
				},
				{
					title: '申请日期',
					minWidth: 120,
					key: 'create_time'
				}
			];
			
			switch (type) {
				case '1':
					columns.push(
						{
							title: '操作',
							minWidth: 160,
							fixed: 'right',
							render: (h, params) => {
								return (
									<div>
										{
											params.row.is_operate === 1 ? <div>
												{this.$auth['1240'] ? <span 
													class="g-operation" 
													onClick={() => this.handleTip(params)}
												>通过</span> : ''}
												{this.$auth['1241'] ? <span 
													class="g-operation g-m-l-10" 
													onClick={() => this.handleCause(params)}
												>驳回</span> : ''}
											</div> : ''
										}
									</div>
								);
							}
						},
					);
					return columns;
				case '5':
					columns.push(
						{
							title: '驳回人',
							minWidth: 150,
							key: 'audit_staff_name',
							
						},
						{
							title: '驳回理由',
							minWidth: 240,
							render: (h, params) => {
								return (
									<div>
										{params.row.remark.length > 15
											? <Tooltip 
												transfer 
												placement="bottom-start"
												style="display: block;maxWidth:200px"
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
						},
					);
					return columns;
				
				default:
					return columns;
			}
		},
	},
};
